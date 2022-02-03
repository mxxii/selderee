[API documentation](../index.md) / [selderee](../modules/selderee.md) / Picker

# Class: Picker<L, V\>

[selderee](../modules/selderee.md).Picker

Simple wrapper around the matcher function.
Recommended return type for builder plugins.

## Type parameters

| Name | Description |
| :------ | :------ |
| `L` | the type of HTML Element in the targeted DOM AST. |
| `V` | the type of associated values. |

## Table of contents

### Constructors

- [constructor](selderee.Picker.md#constructor)

### Methods

- [pick1](selderee.Picker.md#pick1)
- [pickAll](selderee.Picker.md#pickall)

## Constructors

### constructor

• **new Picker**<`L`, `V`\>(`f`)

Create new Picker object.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `L` | the type of HTML Element in the targeted DOM AST. |
| `V` | the type of associated values. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `f` | [`MatcherFunction`](../modules/selderee.Types.md#matcherfunction)<`L`, `V`\> | the function that matches an element and returns all associated values. |

## Methods

### pick1

▸ **pick1**(`el`, `preferFirst?`): ``null`` \| `V`

Run the selectors decision tree against one HTML Element
and choose the value from the most specific matched selector.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `el` | `L` | `undefined` | an HTML Element. |
| `preferFirst` | `boolean` | `false` | option to define which value to choose when there are multiple matches with equal specificity. |

#### Returns

``null`` \| `V`

the value from the most specific matched selector
or `null` if nothing matched.

___

### pickAll

▸ **pickAll**(`el`): [`ValueContainer`](../modules/selderee.Ast.md#valuecontainer)<`V`\>[]

Run the selectors decision tree against one HTML Element
and return all matched associated values
along with selector specificities.

Client code then decides how to further process them
(sort, filter, etc).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `el` | `L` | an HTML Element. |

#### Returns

[`ValueContainer`](../modules/selderee.Ast.md#valuecontainer)<`V`\>[]

all associated values along with
selector specificities for all matched selectors.
