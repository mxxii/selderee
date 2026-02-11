[**API documentation**](../../../index.md)

***

[API documentation](../../../index.md) / selderee/src/selderee

# selderee/src/selderee

Selector-based decision tree - core module.

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [Ast](namespaces/Ast.md) | Decision tree node definitions. |
| [Treeify](namespaces/Treeify.md) | Basic [BuilderFunction](namespaces/Types.md#builderfunction) implementation for decision tree visualization. |
| [Types](namespaces/Types.md) | Function types for builders and matchers. |

## Classes

### DecisionTree

CSS selectors decision tree.
Data structure that weaves similar selectors together
in order to minimize the number of checks required
to find the ones matching a given HTML element.

Converted into a functioning implementation via plugins
tailored for specific DOM ASTs.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `V` | the type of values associated with selectors. |

#### Constructors

##### Constructor

```ts
new DecisionTree<V>(input: [string, V][], options?: DecisionTreeOptions): DecisionTree<V>;
```

Create new DecisionTree object.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | \[`string`, `V`\][] | an array containing all selectors paired with associated values. |
| `options` | [`DecisionTreeOptions`](#decisiontreeoptions) | optional configuration for the decision tree. |

###### Returns

[`DecisionTree`](#decisiontree)&lt;`V`&gt;

#### Methods

##### build()

```ts
build<R>(builder: BuilderFunction<V, R>): R;
```

Turn this decision tree into a callable form.

###### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `R` | return type defined by the builder function. |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `builder` | [`BuilderFunction`](namespaces/Types.md#builderfunction)&lt;`V`, `R`&gt; | the builder function. |

###### Returns

`R`

the decision tree in a form ready for use.

***

### Picker

Simple wrapper around the matcher function.
Recommended return type for builder plugins.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `L` | the type of HTML Element in the targeted DOM AST. |
| `V` | the type of associated values. |

#### Constructors

##### Constructor

```ts
new Picker<L, V>(f: MatcherFunction<L, V>): Picker<L, V>;
```

Create new Picker object.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `f` | [`MatcherFunction`](namespaces/Types.md#matcherfunction)&lt;`L`, `V`&gt; | the function that matches an element and returns all associated values. |

###### Returns

[`Picker`](#picker)&lt;`L`, `V`&gt;

#### Methods

##### pick1()

```ts
pick1(el: L, preferFirst?: boolean): V | null;
```

Run the selectors decision tree against one HTML Element
and choose the value from the most specific matched selector.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `el` | `L` | `undefined` | an HTML Element. |
| `preferFirst` | `boolean` | `false` | option to define which value to choose when there are multiple matches with equal specificity. |

###### Returns

`V` \| `null`

the value from the most specific matched selector
or `null` if nothing matched.

##### pickAll()

```ts
pickAll(el: L): ValueContainer<V>[];
```

Run the selectors decision tree against one HTML Element
and return all matched associated values
along with selector specificities.

Client code then decides how to further process them
(sort, filter, etc).

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `el` | `L` | an HTML Element. |

###### Returns

[`ValueContainer`](namespaces/Ast.md#valuecontainer)&lt;`V`&gt;[]

all associated values along with
selector specificities for all matched selectors.

## Type Aliases

### DecisionTreeOptions

```ts
type DecisionTreeOptions = object;
```

Options for DecisionTree construction.

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-attributeswithnormalizedvalues"></a> `attributesWithNormalizedValues?` | `string`[] | Attribute names whose values should be case-insensitive by default. Only affects attribute value selectors (`[name="value"]`) with no explicit case-sensitivity modifier (`i` or `s`). |
