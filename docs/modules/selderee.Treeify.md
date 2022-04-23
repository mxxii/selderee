[API documentation](../index.md) / [selderee](selderee.md) / Treeify

# Namespace: Treeify

[selderee](selderee.md).Treeify

## Table of contents

### Functions

- [treeify](selderee.Treeify.md#treeify)

## Functions

### treeify

▸ **treeify**(`nodes`): `string`

A [BuilderFunction](selderee.Types.md#builderfunction) implementation.

Produces a string representation of the tree
for testing and debug purposes.

Only accepts `string` as the associated value type.
Map your input collection before creating a [DecisionTree](../classes/selderee.DecisionTree.md)
if you want to use it with a different type -
the decision on how to stringify the value is up to you.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodes` | [`DecisionTreeNode`](selderee.Ast.md#decisiontreenode)<`string`\>[] | nodes from the root level of the decision tree. |

#### Returns

`string`

the string representation of the tree.
