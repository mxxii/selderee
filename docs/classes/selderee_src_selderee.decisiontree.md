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

- [constructor](selderee_src_selderee.decisiontree.md#constructor)

### Methods

- [build](selderee_src_selderee.decisiontree.md#build)

## Constructors

### constructor

\+ **new DecisionTree**<V\>(`input`: [*string*, V][]): [*DecisionTree*](selderee_src_selderee.decisiontree.md)<V\>

Create new DecisionTree object.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `V` | the type of values associated with selectors. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | [*string*, V][] | an array containing all selectors paired with associated values. |

**Returns:** [*DecisionTree*](selderee_src_selderee.decisiontree.md)<V\>

## Methods

### build

▸ **build**<R\>(`builder`: [*BuilderFunction*](../modules/selderee_src_selderee.types.md#builderfunction)<V, R\>): R

Turn this decision tree into a usable form.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `R` | return type defined by the builder function. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `builder` | [*BuilderFunction*](../modules/selderee_src_selderee.types.md#builderfunction)<V, R\> | the builder function. |

**Returns:** R

the decision tree in a form ready for use.
