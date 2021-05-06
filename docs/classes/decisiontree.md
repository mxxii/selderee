[API documentation - v0.5.0](../index.md) / DecisionTree

# Class: DecisionTree<V\>

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

- [constructor](decisiontree.md#constructor)

### Methods

- [build](decisiontree.md#build)

## Constructors

### constructor

\+ **new DecisionTree**<V\>(`input`: [*string*, V][]): [*DecisionTree*](decisiontree.md)<V\>

Create new DecisionTree object.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `V` | the type of values associated with selectors. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | [*string*, V][] | an array containing all selectors paired with associated values. |

**Returns:** [*DecisionTree*](decisiontree.md)<V\>

## Methods

### build

▸ **build**<R\>(`builder`: [*BuilderFunction*](../modules/types.md#builderfunction)<V, R\>): R

Turn this decision tree into a usable form.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `R` | return type defined by the builder function. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `builder` | [*BuilderFunction*](../modules/types.md#builderfunction)<V, R\> | the builder function. |

**Returns:** R

the decision tree in a form ready for use.
