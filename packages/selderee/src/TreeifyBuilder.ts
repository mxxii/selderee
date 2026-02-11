/**
 * Basic {@link BuilderFunction} implementation
 * for decision tree visualization.
 *
 * @packageDocumentation
 */

import * as Ast from './Ast.ts';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { BuilderFunction } from './Types.ts';

/**
 * A {@link BuilderFunction} implementation.
 *
 * Produces a string representation of the tree
 * for testing and debug purposes.
 *
 * Only accepts `string` as the associated value type.
 * Map your input collection before creating a {@link DecisionTree}
 * if you want to use it with a different type -
 * the decision on how to stringify the value is up to you.
 *
 * @param nodes - nodes from the root level of the decision tree.
 * @returns the string representation of the tree.
 */
export function treeify (nodes: Ast.DecisionTreeNode<string>[]): string {
  return '▽\n' + treeifyArray(nodes, thinLines);
}

// ==============================================

type treePrefixTemplate = [[string, string], [string, string]];
const thinLines: treePrefixTemplate = [['├─', '│ '], ['└─', '  ']];
const heavyLines: treePrefixTemplate = [['┠─', '┃ '], ['┖─', '  ']];
const doubleLines: treePrefixTemplate = [['╟─', '║ '], ['╙─', '  ']];

type anyNode =
  | Ast.DecisionTreeNode<string>
  | Ast.VariantNode<string>
  | Ast.MatcherNode<string>;

function treeifyArray (
  nodes: anyNode[],
  tpl: treePrefixTemplate = heavyLines,
) {
  return prefixItems(tpl, nodes.map(n => treeifyNode(n)));
}

function treeifyNode (node: anyNode): string {
  switch (node.type) {
    case 'terminal':{
      const vctr = node.valueContainer;
      return `◁ #${vctr.index} ${JSON.stringify(vctr.specificity)} ${vctr.value}`;
    }
    case 'tagName':
      return `◻ Tag name\n${treeifyArray(node.variants, doubleLines)}`;
    case 'attrValue':
      return `▣ Attr value: ${node.name}\n${treeifyArray(node.matchers, doubleLines)}`;
    case 'attrPresence':
      return `◨ Attr presence: ${node.name}\n${treeifyArray(node.cont)}`;
    case 'pushElement':
      return `◉ Push element: ${node.combinator}\n${treeifyArray(node.cont, thinLines)}`;
    case 'popElement':
      return `◌ Pop element\n${treeifyArray(node.cont, thinLines)}`;
    case 'variant':
      return `◇ = ${node.value}\n${treeifyArray(node.cont)}`;
    case 'matcher':
      return `◈ ${node.matcher} "${node.value}"${node.modifier || ''}\n${treeifyArray(node.cont)}`;
  }
}

function prefixItems (tpl: treePrefixTemplate, items: string[]): string {
  return items
    .map((item, i, { length }) => prefixItem(tpl, item, i === length - 1))
    .join('\n');
}

function prefixItem (tpl: treePrefixTemplate, item: string, tail = true): string {
  const tpl1 = tpl[tail ? 1 : 0];
  return tpl1[0] + item.split('\n').join('\n' + tpl1[1]);
}
