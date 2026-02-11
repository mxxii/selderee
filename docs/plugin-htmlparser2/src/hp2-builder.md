[**API documentation**](../../index.md)

***

[API documentation](../../index.md) / plugin-htmlparser2/src/hp2-builder

# plugin-htmlparser2/src/hp2-builder

Decision tree builder for [htmlparser2](https://github.com/fb55/htmlparser2)/[domhandler](https://github.com/fb55/domhandler) DOM AST.

## Functions

### hp2Builder()

```ts
function hp2Builder<V>(nodes: Ast_DecisionTreeNode<V>[]): Picker<Element, V>;
```

A [Types.BuilderFunction](../../selderee/src/selderee/namespaces/Types.md#BuilderFunction) implementation.

Creates a function (in a [Picker](../../selderee/src/selderee/index.md#Picker) wrapper) that can run
the decision tree against `htmlparser2`/`domhandler` [Element](https://domhandler.js.org/classes/Element.html) nodes.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `V` | the type of values associated with selectors. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `nodes` | [`Ast_DecisionTreeNode`](../../selderee/src/selderee/namespaces/Ast.md#DecisionTreeNode)&lt;`V`&gt;[] | nodes ([Ast.DecisionTreeNode](../../selderee/src/selderee/namespaces/Ast.md#DecisionTreeNode)) from the root level of the decision tree. |

#### Returns

[`Picker`](../../selderee/src/selderee/index.md#Picker)&lt;[`Element`](https://domhandler.js.org/classes/Element.html), `V`&gt;

a [Picker](../../selderee/src/selderee/index.md#Picker) object.
