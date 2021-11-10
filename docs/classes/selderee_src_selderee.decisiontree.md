[API documentation](../index.md) / [selderee/src/selderee](../modules/selderee_src_selderee.md) / DecisionTree

# Class: DecisionTree<V\>

[selderee/src/selderee](../modules/selderee_src_selderee.md).DecisionTree

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

- [constructor](selderee_src_selderee.DecisionTree.md#constructor)

### Methods

- [build](selderee_src_selderee.DecisionTree.md#build)

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
| `builder` | [`BuilderFunction`](../modules/selderee_src_selderee.Types.md#builderfunction)<`V`, `R`\> | the builder function. |

#### Returns

`R`

the decision tree in a form ready for use.
