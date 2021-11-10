[API documentation](../index.md) / plugin-htmlparser2/src/hp2-builder

# Module: plugin-htmlparser2/src/hp2-builder

## Table of contents

### Functions

- [hp2Builder](plugin_htmlparser2_src_hp2_builder.md#hp2builder)

## Functions

### hp2Builder

▸ **hp2Builder**<`V`\>(`nodes`): `Picker`<`Element`, `V`\>

A [BuilderFunction](selderee_src_selderee.Types.md#builderfunction) implementation.

Creates a function (in a [Picker](../classes/selderee_src_selderee.Picker.md) wrapper) that can run
the decision tree against `htmlparser2` `Element` nodes.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `V` | the type of values associated with selectors. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodes` | `DecisionTreeNode`<`V`\>[] | nodes ([DecisionTreeNode](selderee_src_selderee.Ast.md#decisiontreenode)) from the root level of the decision tree. |

#### Returns

`Picker`<`Element`, `V`\>

a [Picker](../classes/selderee_src_selderee.Picker.md) object.
