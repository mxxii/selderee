[API documentation - v0.5.0](../index.md) / Types

# Namespace: Types

## Table of contents

### Type aliases

- [BuilderFunction](types.md#builderfunction)
- [MatcherFunction](types.md#matcherfunction)

## Type aliases

### BuilderFunction

Ƭ **BuilderFunction**<V, R\>: (`nodes`: [*DecisionTreeNode*](ast.md#decisiontreenode)<V\>[]) => R

A function that turn a decision tree into a usable form.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `V` | the type of associated value. |
| `R` | return type for this builder (Consider using [Picker](../classes/picker.md).) |

#### Type declaration

▸ (`nodes`: [*DecisionTreeNode*](ast.md#decisiontreenode)<V\>[]): R

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodes` | [*DecisionTreeNode*](ast.md#decisiontreenode)<V\>[] |

**Returns:** R

___

### MatcherFunction

Ƭ **MatcherFunction**<L, V\>: (`el`: L, ...`tail`: L[]) => [*ValueContainer*](ast.md#valuecontainer)<V\>[]

Recommended matcher function shape to implement
in builders.

The elements stack is represented as the arguments array.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `L` | the type of elements in a particular DOM AST. |
| `V` | the type of associated value. |

#### Type declaration

▸ (`el`: L, ...`tail`: L[]): [*ValueContainer*](ast.md#valuecontainer)<V\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | L |
| `...tail` | L[] |

**Returns:** [*ValueContainer*](ast.md#valuecontainer)<V\>[]
