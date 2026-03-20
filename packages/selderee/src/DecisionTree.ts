import * as parseley from 'parseley';
import * as Ast from './Ast.ts';
import { type BuilderFunction } from './Types.ts';

/**
 * Options for DecisionTree construction.
 */
export type DecisionTreeOptions = {
  /**
   * Attribute names whose values should be case-insensitive by default.
   *
   * Only affects attribute value selectors (`[name="value"]`) with no explicit case-sensitivity modifier (`i` or `s`).
   */
  attributesWithNormalizedValues?: string[];
};

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
   * @param options - optional configuration for the decision tree.
   *
   * @typeParam V - the type of values associated with selectors.
   */
  constructor (input: [string, V][], options: DecisionTreeOptions = {}) {
    this.branches = weave(toAstTerminalPairs(input, options));
  }

  /**
   * Turn this decision tree into a callable form.
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
  oneSimpleSelector: S;
  items: AstTerminalPair<V>[];
};

/**
 * Convert the input array of selector strings and associated values
 * into an array of parsed selector ASTs and terminal nodes.
 *
 * Selector ASTs are reduced and normalized.
 */
function toAstTerminalPairs<V> (
  array: [string, V][],
  options: DecisionTreeOptions,
): AstTerminalPair<V>[] {
  const len = array.length;
  const results = new Array(len) as AstTerminalPair<V>[];
  for (let i = 0; i < len; i++) {
    const [selectorString, val] = array[i];
    const ast = parseley.parse1(selectorString);
    reduceSelectorVariants(ast);
    parseley.normalize(ast, {
      mode: 'html',
      attributesWithNormalizedValues: options.attributesWithNormalizedValues ?? [],
      allowUnspecifiedCaseSensitivityForAttributes: false,
    });
    results[i] = {
      ast: ast,
      terminal: {
        type: 'terminal',
        valueContainer: { index: i, value: val, specificity: ast.specificity },
      },
    };
  }
  return results;
}

/**
 * Transform selector ASTs by replacing class and id selectors
 * with equivalent attribute value selectors, and removing universal selectors.
 *
 * This simplifies the decision tree construction
 * by reducing the number of selector types to handle.
 */
function reduceSelectorVariants (ast: parseley.Ast.CompoundSelector): void {
  const newList: parseley.Ast.SimpleSelector[] = [];
  ast.list.forEach((sel) => {
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
          specificity: [0, 1, 0], // safe change because SimpleSelector specificity is not used after this
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

/**
 * Build decision-tree nodes from selector/terminal pairs.
 *
 * Algorithm (greedy, recursive):
 * 1) Among all remaining simple selectors, pick the most frequent kind.
 * 2) Split items into:
 *    - `matches`: contain that kind (compiled into one branch now),
 *    - `nonMatches`: deferred to later iterations of this level,
 *    - `empty`: selectors already fully consumed (emitted via `terminate`).
 * 3) Repeat until no items remain.
 *
 * Result is a list of sibling branches for the current level.
 *
 * Each branch recursively calls `weave` on selectors with one condition removed.
 */
function weave<V> (
  items: AstTerminalPair<V>[],
): Ast.DecisionTreeNode<V>[] {
  const branches: Ast.DecisionTreeNode<V>[] = [];
  while (items.length) {
    const topKind = findTopKey(
      items,
      (_sel): _sel is parseley.Ast.SimpleSelector => true,
      getSelectorKind,
    );
    const { matches, nonMatches, empty } = breakByKind(items, topKind);
    items = nonMatches;
    if (matches.length) {
      branches.push(branchOfKind(topKind, matches));
    }
    if (empty.length) {
      branches.push(...terminate(empty));
    }
  }
  return branches;
}

/**
 * Called on items with exhausted ASTs (no more simple selectors).
 *
 * Emits terminals; when faces popElement,
 * it lifts direct terminals but keeps non-terminal continuation.
 *
 * @returns an array of terminal nodes and popElement nodes
 * with no direct terminals in their continuations.
 */
function terminate<V> (
  items: AstTerminalPair<V>[],
): (Ast.TerminalNode<V> | Ast.PopElementNode<V>)[] {
  const results: (Ast.TerminalNode<V> | Ast.PopElementNode<V>)[] = [];
  for (const item of items) {
    const terminal = item.terminal;
    if (terminal.type === 'terminal') {
      results.push(terminal);
    } else { // popElement - lift contained terminals
      const { matches, rest } = partition(
        terminal.cont,
        (node): node is Ast.TerminalNode<V> => node.type === 'terminal',
      );
      matches.forEach(node => results.push(node));
      if (rest.length) {
        terminal.cont = rest;
        results.push(terminal);
      }
    }
  }
  return results;
}

/**
 * Break the given items (AST-terminal pairs) into three groups:
 * - `matches` - items whose ASTs contain at least one simple selector of the given kind;
 * - `nonMatches` - items whose ASTs do not contain any simple selectors of the given kind;
 * - `empty` - items whose ASTs are empty.
 *
 * Items are not modified.
 */
function breakByKind<V> (items: AstTerminalPair<V>[], selectedKind: string) {
  const matches: AstTerminalPair<V>[] = [];
  const nonMatches: AstTerminalPair<V>[] = [];
  const empty: AstTerminalPair<V>[] = [];
  for (const item of items) {
    const simpleSelectors = item.ast.list;
    if (simpleSelectors.length) {
      const isMatch = simpleSelectors.some(node => getSelectorKind(node) === selectedKind);
      (isMatch ? matches : nonMatches).push(item);
    } else {
      empty.push(item);
    }
  }
  return { matches, nonMatches, empty };
}

/**
 * Get the kind of a simple selector as a string.
 *
 * It is used to group simple selectors into branches of the decision tree.
 */
function getSelectorKind (sel: parseley.Ast.SimpleSelector): string {
  switch (sel.type) {
    case 'attrPresence':
      return `attrPresence ${sel.name}`;
    case 'attrValue':
      return `attrValue ${sel.name}`;
    case 'pc':
      return `pc ${sel.name}`;
    case 'combinator':
      return `combinator ${sel.combinator}`;
    default:
      return sel.type;
  }
}

/**
 * Create a branch of the decision tree for the given selector kind and matched items.
 */
function branchOfKind<V> (
  kind: string,
  items: AstTerminalPair<V>[],
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
  if (kind.startsWith('pc ')) {
    return pseudoClassBranch(kind.substring(3), items);
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
  items: AstTerminalPair<V>[],
): Ast.TagNameNode<V> {
  const groups = spliceAndGroup(
    items,
    (x): x is parseley.Ast.TagSelector => x.type === 'tag',
    x => x.name,
  );
  const variants: Ast.VariantNode<V>[] =
    Object.entries(groups).map(
      ([name, group]) => ({
        type: 'variant',
        value: name,
        cont: weave(group.items),
      }),
    );
  return {
    type: 'tagName',
    variants: variants,
  };
}

function attrPresenceBranch<V> (
  name: string,
  items: AstTerminalPair<V>[],
): Ast.AttrPresenceNode<V> {
  for (const item of items) {
    spliceSimpleSelector(
      item,
      (x): x is parseley.Ast.AttributePresenceSelector => (x.type === 'attrPresence') && (x.name === name),
    );
  }
  return {
    type: 'attrPresence',
    name: name,
    cont: weave(items),
  };
}

function attrValueBranch<V> (
  name: string,
  items: AstTerminalPair<V>[],
): Ast.AttrValueNode<V> {
  const groups = spliceAndGroup(
    items,
    (x): x is parseley.Ast.AttributeValueSelector => (x.type === 'attrValue') && (x.name === name),
    x => `${x.matcher} ${x.modifier || ''} ${x.value}`,
  );
  const matchers: Ast.MatcherNode<V>[] = [];
  for (const group of Object.values(groups)) {
    const sel = group.oneSimpleSelector;
    matchers.push({
      type: 'matcher',
      matcher: sel.matcher,
      modifier: sel.modifier,
      value: sel.value,
      predicate: getAttrValuePredicate(sel),
      cont: weave(group.items),
    });
  }
  return {
    type: 'attrValue',
    name: name,
    matchers: matchers,
  };
}

/**
 * For a given attribute value selector, create a predicate function
 * to match it against actual attribute values.
 */
function getAttrValuePredicate (
  sel: parseley.Ast.AttributeValueSelector,
): (actual: string) => boolean {
  if (sel.modifier === 'i') {
    const expected = sel.value.toLowerCase();
    switch (sel.matcher) {
      case '=':
        return actual => expected === actual.toLowerCase();
      case '~=':
        return actual => actual.toLowerCase().split(/[ \t]+/).includes(expected);
      case '^=':
        return actual => actual.toLowerCase().startsWith(expected);
      case '$=':
        return actual => actual.toLowerCase().endsWith(expected);
      case '*=':
        return actual => actual.toLowerCase().includes(expected);
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
        return actual => expected === actual;
      case '~=':
        return actual => actual.split(/[ \t]+/).includes(expected);
      case '^=':
        return actual => actual.startsWith(expected);
      case '$=':
        return actual => actual.endsWith(expected);
      case '*=':
        return actual => actual.includes(expected);
      case '|=':
        return actual => (expected === actual) || (actual.startsWith(expected) && actual[expected.length] === '-');
    }
  }
}

function pseudoClassBranch<V> (
  name: string,
  items: AstTerminalPair<V>[],
): Ast.PseudoClassNode<V> {
  if (
    name !== 'empty'
    && name !== 'only-child'
    && name !== 'first-child'
    && name !== 'last-child'
    && name !== 'any-link'
  ) {
    throw new Error(`Unsupported pseudo-class: :${name}`);
  }

  for (const item of items) {
    spliceSimpleSelector(
      item,
      (x): x is parseley.Ast.PseudoClassSelector => (x.type === 'pc') && (x.name === name),
    );
  }

  return {
    type: 'pseudoClass',
    name: name,
    cont: weave(items),
  };
}

function combinatorBranch<V> (
  combinator: '>' | '+',
  items: AstTerminalPair<V>[],
): Ast.PushElementNode<V> {
  const groups = spliceAndGroup(
    items,
    (x): x is parseley.Ast.Combinator => (x.type === 'combinator') && (x.combinator === combinator),
    x => parseley.serialize(x.left),
  );
  const leftItems: AstTerminalPair<V>[] = [];
  for (const group of Object.values(groups)) {
    const rightCont = weave(group.items);
    const leftAst = group.oneSimpleSelector.left;
    leftItems.push({
      ast: leftAst,
      terminal: { type: 'popElement', cont: rightCont },
    });
  }
  return {
    type: 'pushElement',
    combinator: combinator,
    cont: weave(leftItems),
  };
}

/**
 * Repeatedly find the most common key among simple selectors in the given items,
 * where the key is determined by the given predicate and key callback,
 * and splice all simple selectors with this key from the items, grouping them by the key.
 *
 * @returns a record mapping keys to groups of items with simple selectors of this key removed.
 */
function spliceAndGroup<V, S extends parseley.Ast.SimpleSelector> (
  items: AstTerminalPair<V>[],
  predicate: (sel: parseley.Ast.SimpleSelector) => sel is S,
  keyCallback: (sel: S) => string,
): Record<string, SelectorsGroup<V, S>> {
  const groups: Record<string, SelectorsGroup<V, S>> = {};
  while (items.length) {
    const bestKey = findTopKey(items, predicate, keyCallback);
    const bestKeyPredicate =
      (sel: parseley.Ast.SimpleSelector): sel is S => predicate(sel) && keyCallback(sel) === bestKey;
    const hasBestKeyPredicate =
      (item: AstTerminalPair<V>) => item.ast.list.some(bestKeyPredicate);
    const { matches, rest } = partition(items, hasBestKeyPredicate);
    let oneSimpleSelector: S | null = null;
    for (const item of matches) {
      const splicedNode = spliceSimpleSelector(item, bestKeyPredicate);
      if (!oneSimpleSelector) { oneSimpleSelector = splicedNode; }
    }
    if (oneSimpleSelector == null) {
      throw new Error('No simple selector is found.');
    }
    groups[bestKey] = { oneSimpleSelector: oneSimpleSelector, items: matches };
    items = rest;
  }
  return groups;
}

/**
 * Remove all matching simple selectors (duplicates) from one compound selector,
 * return first match.
 */
function spliceSimpleSelector<V, S extends parseley.Ast.SimpleSelector> (
  item: AstTerminalPair<V>,
  predicate: (sel: parseley.Ast.SimpleSelector) => sel is S,
): S {
  const simpleSelectors = item.ast.list;
  const matches: boolean[] = new Array<boolean>(simpleSelectors.length);
  let firstIndex = -1;
  for (let i = simpleSelectors.length; i-- > 0;) {
    if (predicate(simpleSelectors[i])) {
      matches[i] = true;
      firstIndex = i;
    }
  }
  if (firstIndex == -1) {
    throw new Error(`Couldn't find the required simple selector.`);
  }
  const result = simpleSelectors[firstIndex];
  item.ast.list = simpleSelectors.filter((_, i) => !matches[i]);
  return result as S;
}

/**
 * Find the most common key among simple selectors in the given items,
 * where the key is determined by the given predicate and key callback.
 * The most common key is the one that appears in the largest number of items.
 *
 * @returns the most common key.
 */
function findTopKey<V, S extends parseley.Ast.SimpleSelector> (
  items: AstTerminalPair<V>[],
  predicate: (sel: parseley.Ast.SimpleSelector) => sel is S,
  keyCallback: (sel: S) => string,
): string {
  const candidates: Record<string, number> = {};
  for (const item of items) {
    const candidates1: Record<string, boolean> = {};
    for (const node of item.ast.list.filter(predicate)) {
      candidates1[keyCallback(node)] = true;
    }
    for (const key of Object.keys(candidates1)) {
      if (candidates[key]) {
        candidates[key]++;
      } else {
        candidates[key] = 1;
      }
    }
  }
  let topKind = '';
  let topCounter = 0;
  for (const entry of Object.entries(candidates)) {
    if (entry[1] > topCounter) {
      topKind = entry[0];
      topCounter = entry[1];
    }
  }
  return topKind;
}

/**
 * Partition the given array into two arrays:
 * one with items matching the predicate and one with the rest.
 */
function partition<T, R extends T> (
  src: T[],
  predicate: (x: T) => x is R,
): { matches: R[]; rest: T[] };

function partition<T> (
  src: T[],
  predicate: (x: T) => boolean,
): { matches: T[]; rest: T[] };

function partition<T> (
  src: T[],
  predicate: (x: T) => boolean,
): { matches: T[]; rest: T[] } {
  const matches: T[] = [];
  const rest: T[] = [];
  for (const x of src) {
    if (predicate(x)) { matches.push(x); } else { rest.push(x); }
  }
  return { matches, rest };
}
