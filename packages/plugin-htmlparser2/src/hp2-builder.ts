import { Element, Node, isTag } from 'domhandler';
import { Picker, Types, Ast } from 'selderee';

/**
 * A {@link BuilderFunction} implementation.
 *
 * Creates a function (in a {@link Picker} wrapper) that can run
 * the decision tree against `htmlparser2` `Element` nodes.
 *
 * @typeParam V - the type of values associated with selectors.
 *
 * @param nodes - nodes ({@link DecisionTreeNode})
 * from the root level of the decision tree.
 *
 * @returns a {@link Picker} object.
 */
export function hp2Builder<V>(
  nodes: Ast.DecisionTreeNode<V>[]
): Picker<Element, V> {
  return new Picker(handleArray(nodes));
}

// ==============================================

function handleArray<V>(
  nodes: Ast.DecisionTreeNode<V>[]
): Types.MatcherFunction<Element, V> {
  const matchers = nodes.map(handleNode);
  return (el: Element, ...tail: Element[]) =>
    matchers.flatMap(m => m(el, ...tail));
}

function handleNode<V>(
  node: Ast.DecisionTreeNode<V>
): Types.MatcherFunction<Element, V> {
  switch (node.type) {
    case 'terminal':{
      const result = [ node.valueContainer ];
      return (el: Element, ...tail: Element[]) => result;
    }
    case 'tagName':
      return handleTagName(node);
    case 'attrValue':
      return handleAttrValueName(node);
    case 'attrPresence':
      return handleAttrPresenceName(node);
    case 'pushElement':
      return handlePushElementNode(node);
    case 'popElement':
      return handlePopElementNode(node);
  }
}

function handleTagName<V>(
  node: Ast.TagNameNode<V>
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

function handleAttrPresenceName<V>(
  node: Ast.AttrPresenceNode<V>
): Types.MatcherFunction<Element, V> {
  const attrName = node.name;
  const continuation = handleArray(node.cont);
  return (el: Element, ...tail: Element[]) =>
    (Object.prototype.hasOwnProperty.call(el.attribs, attrName))
      ? continuation(el, ...tail)
      : [];
}

function handleAttrValueName<V>(
  node: Ast.AttrValueNode<V>
): Types.MatcherFunction<Element, V> {
  const callbacks: (
    (attr: string, el: Element, ...tail: Element[]) => Ast.ValueContainer<V>[]
    )[] = [];
  for (const matcher of node.matchers) {
    const predicate = matcher.predicate;
    const continuation = handleArray(matcher.cont);
    callbacks.push(
      (attr: string, el: Element, ...tail: Element[]) =>
        (predicate(attr) ? continuation(el, ...tail) : [])
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

function handlePushElementNode<V>(
  node: Ast.PushElementNode<V>
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

const getParentElement = (el: Element): Element | null => {
  const parent = el.parent;
  return (parent && isTag(parent)) ? parent : null;
};

function handlePopElementNode<V>(
  node: Ast.PopElementNode<V>
): Types.MatcherFunction<Element, V> {
  const continuation = handleArray(node.cont);
  return (el: Element, next: Element, ...tail: Element[]) =>
    continuation(next, ...tail);
}
