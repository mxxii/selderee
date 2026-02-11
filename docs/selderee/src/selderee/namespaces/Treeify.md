[**API documentation**](../../../../index.md)

***

[API documentation](../../../../index.md) / [selderee/src/selderee](../index.md) / Treeify

# Treeify

Basic [BuilderFunction](Types.md#builderfunction) implementation
for decision tree visualization.

## Functions

### treeify()

```ts
function treeify(nodes: DecisionTreeNode<string>[]): string;
```

A [BuilderFunction](Types.md#builderfunction) implementation.

Produces a string representation of the tree
for testing and debug purposes.

Only accepts `string` as the associated value type.
Map your input collection before creating a [DecisionTree](../index.md#decisiontree)
if you want to use it with a different type -
the decision on how to stringify the value is up to you.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `nodes` | [`DecisionTreeNode`](Ast.md#decisiontreenode)&lt;`string`&gt;[] | nodes from the root level of the decision tree. |

#### Returns

`string`

the string representation of the tree.
