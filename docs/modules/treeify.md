[API documentation - v0.5.0](../index.md) / Treeify

# Namespace: Treeify

## Table of contents

### Functions

- [treeify](treeify.md#treeify)

## Functions

### treeify

▸ `Const` **treeify**(`nodes`: [*DecisionTreeNode*](ast.md#decisiontreenode)<string\>[]): *string*

A [BuilderFunction](types.md#builderfunction) implementation.

Produces a string representation of the tree
for testing and debug purposes.

Only accepts `string` as the associated value type.
Map your input collection before creating a [DecisionTree](../classes/decisiontree.md)
if you want to use it with a different type -
the decision on how to stringify the value is up to you.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodes` | [*DecisionTreeNode*](ast.md#decisiontreenode)<string\>[] | nodes from the root level of the decision tree. |

**Returns:** *string*

the string representation of the tree.
