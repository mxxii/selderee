[API documentation](../index.md) / [selderee/src/selderee](selderee_src_selderee.md) / Types

# Namespace: Types

[selderee/src/selderee](selderee_src_selderee.md).Types

## Table of contents

### Type aliases

- [BuilderFunction](selderee_src_selderee.types.md#builderfunction)
- [MatcherFunction](selderee_src_selderee.types.md#matcherfunction)

## Type aliases

### BuilderFunction

Ƭ **BuilderFunction**<V, R\>: (`nodes`: [*DecisionTreeNode*](selderee_src_selderee.ast.md#decisiontreenode)<V\>[]) => R

A function that turn a decision tree into a usable form.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `V` | the type of associated value. |
| `R` | return type for this builder (Consider using [Picker](../classes/selderee_src_selderee.picker.md).) |

#### Type declaration

▸ (`nodes`: [*DecisionTreeNode*](selderee_src_selderee.ast.md#decisiontreenode)<V\>[]): R

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodes` | [*DecisionTreeNode*](selderee_src_selderee.ast.md#decisiontreenode)<V\>[] |

**Returns:** R

___

### MatcherFunction

Ƭ **MatcherFunction**<L, V\>: (`el`: L, ...`tail`: L[]) => [*ValueContainer*](selderee_src_selderee.ast.md#valuecontainer)<V\>[]

Recommended matcher function shape to implement
in builders.

The elements stack is represented as the arguments array.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `L` | the type of elements in a particular DOM AST. |
| `V` | the type of associated value. |

#### Type declaration

▸ (`el`: L, ...`tail`: L[]): [*ValueContainer*](selderee_src_selderee.ast.md#valuecontainer)<V\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | L |
| `...tail` | L[] |

**Returns:** [*ValueContainer*](selderee_src_selderee.ast.md#valuecontainer)<V\>[]
