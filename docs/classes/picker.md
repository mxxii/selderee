[API documentation - v0.5.0](../index.md) / Picker

# Class: Picker<L, V\>

Simple wrapper around the matcher function.
Recommended return type for builder plugins.

## Type parameters

| Name | Description |
| :------ | :------ |
| `L` | the type of HTML Element in the targeted DOM AST. |
| `V` | the type of associated values. |

## Table of contents

### Constructors

- [constructor](picker.md#constructor)

### Methods

- [pick1](picker.md#pick1)
- [pickAll](picker.md#pickall)

## Constructors

### constructor

\+ **new Picker**<L, V\>(`f`: [*MatcherFunction*](../modules/types.md#matcherfunction)<L, V\>): [*Picker*](picker.md)<L, V\>

Create new Picker object.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `L` | the type of HTML Element in the targeted DOM AST. |
| `V` | the type of associated values. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `f` | [*MatcherFunction*](../modules/types.md#matcherfunction)<L, V\> | the function that matches an element and returns all associated values. |

**Returns:** [*Picker*](picker.md)<L, V\>

## Methods

### pick1

▸ **pick1**(`el`: L, `preferFirst?`: *boolean*): ``null`` \| V

Run the selectors decision tree against one HTML Element
and choose the value from the most specific mached selector.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `el` | L | - | an HTML Element. |
| `preferFirst` | *boolean* | false | option to define which value to choose when there are multiple matches with equal specificity. |

**Returns:** ``null`` \| V

the value from the most specific mached selector
or `null` if nothing matched.

___

### pickAll

▸ **pickAll**(`el`: L): [*ValueContainer*](../modules/ast.md#valuecontainer)<V\>[]

Run the selectors decision tree against one HTML Element
and return all matched associated values
along with selector specificities.

Client code then decides how to further process them
(sort, filter, etc).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `el` | L | an HTML Element. |

**Returns:** [*ValueContainer*](../modules/ast.md#valuecontainer)<V\>[]

all associated values along with
selector specificities for all matched selectors.
