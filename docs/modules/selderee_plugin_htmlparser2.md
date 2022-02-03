[API documentation](../index.md) / @selderee/plugin-htmlparser2

# Module: @selderee/plugin-htmlparser2

## Table of contents

### Functions

- [hp2Builder](selderee_plugin_htmlparser2.md#hp2builder)

## Functions

### hp2Builder

▸ **hp2Builder**<`V`\>(`nodes`): `Picker`<`Element`, `V`\>

A [BuilderFunction](selderee.Types.md#builderfunction) implementation.

Creates a function (in a [Picker](../classes/selderee.Picker.md) wrapper) that can run
the decision tree against `htmlparser2` `Element` nodes.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `V` | the type of values associated with selectors. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodes` | `DecisionTreeNode`<`V`\>[] | nodes ([DecisionTreeNode](selderee.Ast.md#decisiontreenode)) from the root level of the decision tree. |

#### Returns

`Picker`<`Element`, `V`\>

a [Picker](../classes/selderee.Picker.md) object.
