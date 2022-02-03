[API documentation](../index.md) / [selderee](../modules/selderee.md) / DecisionTree

# Class: DecisionTree<V\>

[selderee](../modules/selderee.md).DecisionTree

CSS selectors decision tree.
Data structure that weaves similar selectors together
in order to minimize the number of checks required
to find the ones matching a given HTML element.

Converted into a functioning implementation via plugins
tailored for specific DOM ASTs.

## Type parameters

| Name | Description |
| :------ | :------ |
| `V` | the type of values associated with selectors. |

## Table of contents

### Constructors

- [constructor](selderee.DecisionTree.md#constructor)

### Methods

- [build](selderee.DecisionTree.md#build)

## Constructors

### constructor

• **new DecisionTree**<`V`\>(`input`)

Create new DecisionTree object.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `V` | the type of values associated with selectors. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | [`string`, `V`][] | an array containing all selectors paired with associated values. |

## Methods

### build

▸ **build**<`R`\>(`builder`): `R`

Turn this decision tree into a usable form.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `R` | return type defined by the builder function. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `builder` | [`BuilderFunction`](../modules/selderee.Types.md#builderfunction)<`V`, `R`\> | the builder function. |

#### Returns

`R`

the decision tree in a form ready for use.
