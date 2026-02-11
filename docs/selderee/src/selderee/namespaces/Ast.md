[**API documentation**](../../../../index.md)

***

[API documentation](../../../../index.md) / [selderee/src/selderee](../index.md) / Ast

# Ast

Decision tree node definitions.

## Type Aliases

### AttrPresenceNode

```ts
type AttrPresenceNode<V> = object;
```

Have to check the presence of an element attribute
with the given name.

#### Type Parameters

| Type Parameter |
| ------ |
| `V` |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-cont"></a> `cont` | [`DecisionTreeNode`](#decisiontreenode)&lt;`V`&gt;[] |
| <a id="property-name"></a> `name` | `string` |
| <a id="property-type"></a> `type` | `"attrPresence"` |

***

### AttrValueNode

```ts
type AttrValueNode<V> = object;
```

Have to check the value of an element attribute
with the given name.
It usually requires to run all underlying matchers
one after another.

#### Type Parameters

| Type Parameter |
| ------ |
| `V` |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-matchers"></a> `matchers` | [`MatcherNode`](#matchernode)&lt;`V`&gt;[] |
| <a id="property-name-1"></a> `name` | `string` |
| <a id="property-type-1"></a> `type` | `"attrValue"` |

***

### DecisionTreeNode

```ts
type DecisionTreeNode<V> = 
  | TerminalNode<V>
  | TagNameNode<V>
  | AttrPresenceNode<V>
  | AttrValueNode<V>
  | PushElementNode<V>
  | PopElementNode<V>;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `V` |

***

### MatcherNode

```ts
type MatcherNode<V> = object;
```

String value matcher.
Contains the predicate so no need to reimplement it
from descriptive parameters.

#### Type Parameters

| Type Parameter |
| ------ |
| `V` |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-cont-1"></a> `cont` | [`DecisionTreeNode`](#decisiontreenode)&lt;`V`&gt;[] |
| <a id="property-matcher"></a> `matcher` | `"="` \| `"~="` \| "\|=" \| `"^="` \| `"$="` \| `"*="` |
| <a id="property-modifier"></a> `modifier` | `"i"` \| `"s"` \| `null` |
| <a id="property-predicate"></a> `predicate` | (`prop`: `string`) => `boolean` |
| <a id="property-type-2"></a> `type` | `"matcher"` |
| <a id="property-value"></a> `value` | `string` |

***

### PopElementNode

```ts
type PopElementNode<V> = object;
```

Remove the top element from the stack -
following checks are performed on the previous element.

#### Type Parameters

| Type Parameter |
| ------ |
| `V` |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-cont-2"></a> `cont` | [`DecisionTreeNode`](#decisiontreenode)&lt;`V`&gt;[] |
| <a id="property-type-3"></a> `type` | `"popElement"` |

***

### PushElementNode

```ts
type PushElementNode<V> = object;
```

Push next element on the stack, defined by the combinator.
Only `>` and `+` are expected to be supported.

All checks are performed on the element on top of the stack.

#### Type Parameters

| Type Parameter |
| ------ |
| `V` |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-combinator"></a> `combinator` | `">"` \| `"+"` |
| <a id="property-cont-3"></a> `cont` | [`DecisionTreeNode`](#decisiontreenode)&lt;`V`&gt;[] |
| <a id="property-type-4"></a> `type` | `"pushElement"` |

***

### Specificity

```ts
type Specificity = [number, number, number];
```

Specificity as defined by Selectors spec.

[https://www.w3.org/TR/selectors/#specificity](https://www.w3.org/TR/selectors/#specificity)

Three levels: for id, class, tag (type).

Extra level(s) used in HTML styling don't fit the scope of this package
and no space reserved for them.

***

### TagNameNode

```ts
type TagNameNode<V> = object;
```

Tag name has to be checked.
Underlying variants can be assembled
into a dictionary key check.

#### Type Parameters

| Type Parameter |
| ------ |
| `V` |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-type-5"></a> `type` | `"tagName"` |
| <a id="property-variants"></a> `variants` | [`VariantNode`](#variantnode)&lt;`V`&gt;[] |

***

### TerminalNode

```ts
type TerminalNode<V> = object;
```

When reached a terminal node, decision tree adds
the value container to the list of successful matches.

#### Type Parameters

| Type Parameter |
| ------ |
| `V` |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-type-6"></a> `type` | `"terminal"` |
| <a id="property-valuecontainer"></a> `valueContainer` | [`ValueContainer`](#valuecontainer)&lt;`V`&gt; |

***

### ValueContainer

```ts
type ValueContainer<V> = object;
```

Container for the associated value,
selector specificity and position in the selectors collection.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `V` | the type of the associated value. |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-index"></a> `index` | `number` |
| <a id="property-specificity"></a> `specificity` | [`Specificity`](#specificity) |
| <a id="property-value-1"></a> `value` | `V` |

***

### VariantNode

```ts
type VariantNode<V> = object;
```

String value variant.

#### Type Parameters

| Type Parameter |
| ------ |
| `V` |

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-cont-4"></a> `cont` | [`DecisionTreeNode`](#decisiontreenode)&lt;`V`&gt;[] |
| <a id="property-type-7"></a> `type` | `"variant"` |
| <a id="property-value-2"></a> `value` | `string` |
