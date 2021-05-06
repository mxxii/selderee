import * as parseley from 'parseley';
import * as Ast from './Ast';
import { BuilderFunction } from './Types';

/**
 * CSS selectors decision tree.
 * Data structure that weaves similar selectors together
 * in order to minimize the number of checks required
 * to find the ones matching a given HTML element.
 *
 * Converted into a functioning implementation via plugins
 * tailored for specific DOM ASTs.
 *
 * @typeParam V - the type of values associated with selectors.
 */
export class DecisionTree<V> {

  private readonly branches: Ast.DecisionTreeNode<V>[];

  /**
   * Create new DecisionTree object.
   *
   * @param input - an array containing all selectors
   * paired with associated values.
   *
   * @typeParam V - the type of values associated with selectors.
   */
  constructor(input: [string, V][]) {
    this.branches = weave(toAstTerminalPairs(input));
  }

  /**
   * Turn this decision tree into a usable form.
   *
   * @typeParam R - return type defined by the builder function.
   *
   * @param builder - the builder function.
   *
   * @returns the decision tree in a form ready for use.
   */
  build<R>(builder: BuilderFunction<V, R>): R {
    return builder(this.branches);
  }

}

// ==============================================

type AstTerminalPair<V> = {
  ast: parseley.Ast.CompoundSelector;
  terminal: Ast.TerminalNode<V> | Ast.PopElementNode<V>;
};

type SelectorsGroup<V, S extends parseley.Ast.SimpleSelector> = {
  oneSimpleSelector: S,
  items: AstTerminalPair<V>[]
}

function toAstTerminalPairs<V>(array: [string, V][]): AstTerminalPair<V>[] {
  const len = array.length;
  const results = new Array(len) as AstTerminalPair<V>[];
  for (let i = 0; i < len; i++) {
    const [selectorString, val] = array[i];
    const ast = preprocess(parseley.parse1(selectorString));
    results[i] = {
      ast: ast,
      terminal: {
        type: 'terminal',
        valueContainer: { index: i, value: val, specificity: ast.specificity }
      }
    };
  }
  return results;
}

function preprocess (ast: parseley.Ast.CompoundSelector): parseley.Ast.CompoundSelector {
  reduceSelectorVariants(ast);
  parseley.normalize(ast);
  return ast;
}

function reduceSelectorVariants (ast: parseley.Ast.CompoundSelector): void {
  const newList: parseley.Ast.SimpleSelector[] = [];
  ast.list.forEach(sel => {
    switch (sel.type) {
      case 'class':
        newList.push({
          matcher: '~=',
          modifier: null,
          name: 'class',
          namespace: null,
          specificity: sel.specificity,
          type: 'attrValue',
          value: sel.name,
        });
        break;
      case 'id':
        newList.push({
          matcher: '=',
          modifier: null,
          name: 'id',
          namespace: null,
          specificity: sel.specificity,
          type: 'attrValue',
          value: sel.name,
        });
        break;
      case 'combinator':
        reduceSelectorVariants(sel.left);
        newList.push(sel);
        break;
      case 'universal':
        // skip it
        break;
      default:
        newList.push(sel);
        break;
    }
  });
  ast.list = newList;
}

function weave<V> (items: AstTerminalPair<V>[]): Ast.DecisionTreeNode<V>[] {
  const branches: Ast.DecisionTreeNode<V>[] = [];
  while (items.length) {
    const topKind = findTopKind(items);
    const { matches, nonmatches, empty } = breakByKind(items, topKind);
    items = nonmatches;
    if (matches.length) {
      branches.push(branchOfKind(topKind, matches));
    }
    if (empty.length) {
      branches.push(...terminate(empty));
    }
  }
  return branches;
}

function terminate<V> (
  items: AstTerminalPair<V>[]
): (Ast.TerminalNode<V> | Ast.PopElementNode<V>)[] {
  const results: (Ast.TerminalNode<V> | Ast.PopElementNode<V>)[] = [];
  for (const item of items) {
    const terminal = item.terminal;
    if (terminal.type === 'terminal') {
      results.push(terminal);
    } else { // popElement - lift contained terminals
      const { matches, rest } = partition(
        terminal.cont,
        (node): node is Ast.TerminalNode<V> => node.type === 'terminal'
      );
      matches.forEach((node) => results.push(node));
      if (rest.length) {
        terminal.cont = rest;
        results.push(terminal);
      }
    }
  }
  return results;
}

function findTopKind<V> (items: AstTerminalPair<V>[]): string {
  const kindCounters: Record<string, number> = {};
  for (const item of items) {
    for (const node of item.ast.list) {
      const kind = getSelectorKind(node);
      kindCounters[kind] = (kindCounters[kind]) ? kindCounters[kind] + 1 : 1;
    }
  }
  let topKind = '';
  let topCounter = 0;
  for (const entry of Object.entries(kindCounters)) {
    if (entry[1] > topCounter) {
      topKind = entry[0];
      topCounter = entry[1];
    }
  }
  return topKind;
}

function breakByKind<V> (items: AstTerminalPair<V>[], selectedKind: string) {
  const matches: AstTerminalPair<V>[] = [];
  const nonmatches: AstTerminalPair<V>[] = [];
  const empty: AstTerminalPair<V>[] = [];
  for (const item of items) {
    const simpsels = item.ast.list;
    if (simpsels.length) {
      const isMatch = simpsels.some(node => getSelectorKind(node) === selectedKind);
      (isMatch ? matches : nonmatches).push(item);
    } else {
      empty.push(item);
    }
  }
  return { matches, nonmatches, empty };
}

function getSelectorKind (sel: parseley.Ast.SimpleSelector): string {
  switch (sel.type) {
    case 'attrPresence':
      return `attrPresence ${sel.name}`;
    case 'attrValue':
      return `attrValue ${sel.name}`;
    case 'combinator':
      return `combinator ${sel.combinator}`;
    default:
      return sel.type;
  }
}

function branchOfKind<V> (
  kind: string,
  items: AstTerminalPair<V>[]
): Ast.DecisionTreeNode<V> {
  if (kind === 'tag') {
    return tagNameBranch(items);
  }
  if (kind.startsWith('attrValue ')) {
    return attrValueBranch(kind.substring(10), items);
  }
  if (kind.startsWith('attrPresence ')) {
    return attrPresenceBranch(kind.substring(13), items);
  }
  if (kind === 'combinator >') {
    return combinatorBranch('>', items);
  }
  if (kind === 'combinator +') {
    return combinatorBranch('+', items);
  }
  throw new Error(`Unsupported selector kind: ${kind}`);
}

function tagNameBranch<V> (
  items: AstTerminalPair<V>[]
): Ast.TagNameNode<V> {
  const groups = spliceAndGroup(
    items,
    (x): x is parseley.Ast.TagSelector => x.type === 'tag',
    (x) => x.name
  );
  const variants: Ast.VariantNode<V>[] =
  Object.entries(groups).map(
    ([name, group]) => ({
      type: 'variant',
      value: name,
      cont: weave(group.items)
    })
  );
  return {
    type: 'tagName',
    variants: variants
  };
}

function attrPresenceBranch<V> (
  name: string,
  items: AstTerminalPair<V>[]
): Ast.AttrPresenceNode<V> {
  for (const item of items) {
    spliceSimpleSelector(item, (x): x is parseley.Ast.AttrabutePresenceSelector => (x.type === 'attrPresence') && (x.name === name));
  }
  return {
    type: 'attrPresence',
    name: name,
    cont: weave(items)
  };
}

function attrValueBranch<V> (
  name: string,
  items: AstTerminalPair<V>[]
): Ast.AttrValueNode<V> {
  const groups = spliceAndGroup(
    items,
    (x): x is parseley.Ast.AttrabuteValueSelector => (x.type === 'attrValue') && (x.name === name),
    (x) => `${x.matcher} ${x.modifier || ''} ${x.value}`
  );
  const matchers: Ast.MatcherNode<V>[] = [];
  for (const group of Object.values(groups)) {
    const sel = group.oneSimpleSelector;
    const predicate = getAttrPredicate(sel);
    const continuation = weave(group.items);
    matchers.push({
      type: 'matcher',
      matcher: sel.matcher,
      modifier: sel.modifier,
      value: sel.value,
      predicate: predicate,
      cont: continuation
    });
  }
  return {
    type: 'attrValue',
    name: name,
    matchers: matchers
  };
}

function getAttrPredicate (
  sel: parseley.Ast.AttrabuteValueSelector
): (actual: string) => boolean {
  if (sel.modifier === 'i') {
    const expected = sel.value.toLowerCase();
    switch (sel.matcher) {
      case '=':
        return (actual) => expected === actual.toLowerCase();
      case '~=':
        return (actual) => actual.toLowerCase().split(/[ \t]+/).includes(expected);
      case '^=':
        return (actual) => actual.toLowerCase().startsWith(expected);
      case '$=':
        return (actual) => actual.toLowerCase().endsWith(expected);
      case '*=':
        return (actual) => actual.toLowerCase().includes(expected);
      case '|=':
        return (actual) => {
          const lower = actual.toLowerCase();
          return (expected === lower) || (lower.startsWith(expected) && lower[expected.length] === '-');
        };
    }
  } else {
    const expected = sel.value;
    switch (sel.matcher) {
      case '=':
        return (actual) => expected === actual;
      case '~=':
        return (actual) => actual.split(/[ \t]+/).includes(expected);
      case '^=':
        return (actual) => actual.startsWith(expected);
      case '$=':
        return (actual) => actual.endsWith(expected);
      case '*=':
        return (actual) => actual.includes(expected);
      case '|=':
        return (actual) => (expected === actual) || (actual.startsWith(expected) && actual[expected.length] === '-');
    }
  }
}

function combinatorBranch<V> (
  combinator: '>' | '+',
  items: AstTerminalPair<V>[]
): Ast.PushElementNode<V> {
  const groups = spliceAndGroup(
    items,
    (x): x is parseley.Ast.Combinator => (x.type === 'combinator') && (x.combinator === combinator),
    (x) => parseley.serialize(x.left)
  );
  const leftItems: AstTerminalPair<V>[] = [];
  for (const group of Object.values(groups)) {
    const rightCont = weave(group.items);
    const leftAst = group.oneSimpleSelector.left;
    leftItems.push({
      ast: leftAst,
      terminal: { type: 'popElement', cont: rightCont }
    });
  }
  return {
    type: 'pushElement',
    combinator: combinator,
    cont: weave(leftItems)
  };
}

function spliceAndGroup<V, S extends parseley.Ast.SimpleSelector> (
  items: AstTerminalPair<V>[],
  predicate: (sel: parseley.Ast.SimpleSelector) => sel is S,
  keyCallback: (sel: S) => string
) {
  const groups: Record<string, SelectorsGroup<V, S>> = {};
  for (const item of items) {
    const splicedNode = spliceSimpleSelector(item, predicate);
    const key = keyCallback(splicedNode);
    if (!groups[key]) {
      groups[key] = { oneSimpleSelector: splicedNode, items: [] };
    }
    groups[key].items.push(item);
  }
  return groups;
}

function spliceSimpleSelector<V, S extends parseley.Ast.SimpleSelector> (
  item: AstTerminalPair<V>,
  predicate: (sel: parseley.Ast.SimpleSelector) => sel is S
): S {
  const simpsels = item.ast.list;
  for (let i = 0; i < simpsels.length; i++) {
    if (predicate(simpsels[i])) {
      return simpsels.splice(i, 1)[0] as S;
    }
  }
  throw new Error(`Couldn't find the required simple selector. This code must be unreachable.`);
}

function partition<T, R extends T>(
  src: T[],
  predicate: (x: T) => x is R
): { matches: R[], rest: T[] } {
  const matches: R[] = [];
  const rest: T[] = [];
  for (const x of src) {
    if (predicate(x)) { matches.push(x); } else { rest.push(x); }
  }
  return { matches, rest };
}
