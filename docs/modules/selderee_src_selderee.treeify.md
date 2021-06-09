[API documentation](../index.md) / [selderee/src/selderee](selderee_src_selderee.md) / Treeify

# Namespace: Treeify

[selderee/src/selderee](selderee_src_selderee.md).Treeify

## Table of contents

### Functions

- [treeify](selderee_src_selderee.treeify.md#treeify)

## Functions

### treeify

▸ `Const` **treeify**(`nodes`): `string`

A [BuilderFunction](selderee_src_selderee.types.md#builderfunction) implementation.

Produces a string representation of the tree
for testing and debug purposes.

Only accepts `string` as the associated value type.
Map your input collection before creating a [DecisionTree](../classes/selderee_src_selderee.decisiontree.md)
if you want to use it with a different type -
the decision on how to stringify the value is up to you.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodes` | [DecisionTreeNode](selderee_src_selderee.ast.md#decisiontreenode)<string\>[] | nodes from the root level of the decision tree. |

#### Returns

`string`

the string representation of the tree.
