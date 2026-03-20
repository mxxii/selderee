/**
 * Decision tree builder for [htmlparser2](https://github.com/fb55/htmlparser2)/[domhandler](https://github.com/fb55/domhandler) DOM AST.
 *
 * @packageDocumentation
 */

import { Element, Node, isTag } from 'domhandler';
import { ElementType } from 'domelementtype';
import { Picker, type Types, type Ast } from 'selderee';

/**
 * A {@link Types.BuilderFunction} implementation.
 *
 * Creates a function (in a {@link Picker} wrapper) that can run
 * the decision tree against `htmlparser2`/`domhandler` {@link Element} nodes.
 *
 * @typeParam V - the type of values associated with selectors.
 *
 * @param nodes - nodes ({@link Ast.DecisionTreeNode})
 * from the root level of the decision tree.
 *
 * @returns a {@link Picker} object.
 */
export function hp2Builder<V> (
  nodes: Ast.DecisionTreeNode<V>[],
): Picker<Element, V> {
  return new Picker(handleArray(nodes));
}

// ==============================================

function handleArray<V> (
  nodes: Ast.DecisionTreeNode<V>[],
): Types.MatcherFunction<Element, V> {
  const matchers = nodes.map(handleNode);
  return (el: Element, ...tail: Element[]) =>
    matchers.flatMap(m => m(el, ...tail));
}

function handleNode<V> (
  node: Ast.DecisionTreeNode<V>,
): Types.MatcherFunction<Element, V> {
  switch (node.type) {
    case 'terminal':{
      const result = [ node.valueContainer ];
      return () => result;
    }
    case 'tagName':
      return handleTagName(node);
    case 'attrValue':
      return handleAttrValueName(node);
    case 'attrPresence':
      return handleAttrPresenceName(node);
    case 'pseudoClass':
      return handlePseudoClassNode(node);
    case 'pushElement':
      return handlePushElementNode(node);
    case 'popElement':
      return handlePopElementNode(node);
  }
}

function handleTagName<V> (
  node: Ast.TagNameNode<V>,
): Types.MatcherFunction<Element, V> {
  const variants: Record<string, Types.MatcherFunction<Element, V>> = {};
  for (const variant of node.variants) {
    variants[variant.value] = handleArray(variant.cont);
  }
  return (el: Element, ...tail: Element[]) => {
    const continuation = variants[el.name];
    return (continuation) ? continuation(el, ...tail) : [];
  };
}

function handleAttrPresenceName<V> (
  node: Ast.AttrPresenceNode<V>,
): Types.MatcherFunction<Element, V> {
  const attrName = node.name;
  const continuation = handleArray(node.cont);
  return (el: Element, ...tail: Element[]) =>
    (Object.prototype.hasOwnProperty.call(el.attribs, attrName))
      ? continuation(el, ...tail)
      : [];
}

function handleAttrValueName<V> (
  node: Ast.AttrValueNode<V>,
): Types.MatcherFunction<Element, V> {
  const callbacks: (
    (attr: string, el: Element, ...tail: Element[]) => Ast.ValueContainer<V>[]
  )[] = [];
  for (const matcher of node.matchers) {
    const predicate = matcher.predicate;
    const continuation = handleArray(matcher.cont);
    callbacks.push(
      (attr: string, el: Element, ...tail: Element[]) =>
        (predicate(attr) ? continuation(el, ...tail) : []),
    );
  }
  const attrName = node.name;
  return (el: Element, ...tail: Element[]) => {
    const attr = el.attribs[attrName];
    return (attr || attr === '')
      ? callbacks.flatMap(cb => cb(attr, el, ...tail))
      : [];
  };
}

function handlePseudoClassNode<V> (
  node: Ast.PseudoClassNode<V>,
): Types.MatcherFunction<Element, V> {
  const continuation = handleArray(node.cont);
  const predicate = pseudoClassPredicates[node.name];
  if (!predicate) {
    throw new Error(`Unsupported pseudo-class: :${node.name}`);
  }
  return (el: Element, ...tail: Element[]) =>
    predicate(el) ? continuation(el, ...tail) : [];
}

const pseudoClassPredicates: Record<string, (el: Element) => boolean> = {
  'empty': isEmptyElement,
  'only-child': isOnlyChildElement,
  'first-child': isFirstChildElement,
  'last-child': isLastChildElement,
  'any-link': isAnyLinkElement,
};

function isEmptyElement (el: Element): boolean {
  for (const child of el.children) {
    if (isTag(child)) { return false; }
    if (child.type === ElementType.Text || child.type === ElementType.CDATA) { return false; }
  }
  return true;
}

function isOnlyChildElement (el: Element): boolean {
  return getPrecedingElement(el) === null && getFollowingElement(el) === null;
}

function isFirstChildElement (el: Element): boolean {
  return getPrecedingElement(el) === null;
}

function isLastChildElement (el: Element): boolean {
  return getFollowingElement(el) === null;
}

function isAnyLinkElement (el: Element): boolean {
  return (el.name === 'a' || el.name === 'area')
    && Object.prototype.hasOwnProperty.call(el.attribs, 'href');
}


function handlePushElementNode<V> (
  node: Ast.PushElementNode<V>,
): Types.MatcherFunction<Element, V> {
  const continuation = handleArray(node.cont);
  const leftElementGetter = (node.combinator === '+')
    ? getPrecedingElement
    : getParentElement;
  return (el: Element, ...tail: Element[]) => {
    const next = leftElementGetter(el);
    if (next === null) { return []; }
    return continuation(next, el, ...tail);
  };
}

const getPrecedingElement = (el: Node): Element | null => {
  const prev = el.prev;
  if (prev === null) { return null; }
  return (isTag(prev)) ? prev : getPrecedingElement(prev);
};

const getFollowingElement = (el: Node): Element | null => {
  const next = el.next;
  if (next === null) { return null; }
  return (isTag(next)) ? next : getFollowingElement(next);
};

const getParentElement = (el: Element): Element | null => {
  const parent = el.parent;
  return (parent && isTag(parent)) ? parent : null;
};

function handlePopElementNode<V> (
  node: Ast.PopElementNode<V>,
): Types.MatcherFunction<Element, V> {
  const continuation = handleArray(node.cont);
  return (_el: Element, next: Element, ...tail: Element[]) =>
    continuation(next, ...tail);
}
