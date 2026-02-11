[**API documentation**](../../../../index.md)

***

[API documentation](../../../../index.md) / [selderee/src/selderee](../index.md) / Types

# Types

Function types for builders and matchers.

## Type Aliases

### BuilderFunction()

```ts
type BuilderFunction<V, R> = (nodes: DecisionTreeNode<V>[]) => R;
```

A function that turn a decision tree into a callable form.

To be implemented by builder plugins.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `V` | the type of associated value. |
| `R` | return type for this builder (Consider using [Picker](../index.md#picker).) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nodes` | [`DecisionTreeNode`](Ast.md#decisiontreenode)&lt;`V`&gt;[] |

#### Returns

`R`

***

### MatcherFunction()

```ts
type MatcherFunction<L, V> = (el: L, ...tail: L[]) => ValueContainer<V>[];
```

Recommended matcher function shape to implement in builders.

The elements stack is represented as the arguments array.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `L` | the type of elements in a particular DOM AST. |
| `V` | the type of associated value. |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | `L` |
| ...`tail` | `L`[] |

#### Returns

[`ValueContainer`](Ast.md#valuecontainer)&lt;`V`&gt;[]
