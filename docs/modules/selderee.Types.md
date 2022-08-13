[API documentation](../index.md) / [selderee](selderee.md) / Types

# Namespace: Types

[selderee](selderee.md).Types

## Table of contents

### Type Aliases

- [BuilderFunction](selderee.Types.md#builderfunction)
- [MatcherFunction](selderee.Types.md#matcherfunction)

## Type Aliases

### BuilderFunction

Ƭ **BuilderFunction**<`V`, `R`\>: (`nodes`: [`DecisionTreeNode`](selderee.Ast.md#decisiontreenode)<`V`\>[]) => `R`

#### Type parameters

| Name | Description |
| :------ | :------ |
| `V` | the type of associated value. |
| `R` | return type for this builder (Consider using [Picker](../classes/selderee.Picker.md).) |

#### Type declaration

▸ (`nodes`): `R`

A function that turn a decision tree into a usable form.

##### Parameters

| Name | Type |
| :------ | :------ |
| `nodes` | [`DecisionTreeNode`](selderee.Ast.md#decisiontreenode)<`V`\>[] |

##### Returns

`R`

___

### MatcherFunction

Ƭ **MatcherFunction**<`L`, `V`\>: (`el`: `L`, ...`tail`: `L`[]) => [`ValueContainer`](selderee.Ast.md#valuecontainer)<`V`\>[]

#### Type parameters

| Name | Description |
| :------ | :------ |
| `L` | the type of elements in a particular DOM AST. |
| `V` | the type of associated value. |

#### Type declaration

▸ (`el`, ...`tail`): [`ValueContainer`](selderee.Ast.md#valuecontainer)<`V`\>[]

Recommended matcher function shape to implement
in builders.

The elements stack is represented as the arguments array.

##### Parameters

| Name | Type |
| :------ | :------ |
| `el` | `L` |
| `...tail` | `L`[] |

##### Returns

[`ValueContainer`](selderee.Ast.md#valuecontainer)<`V`\>[]
