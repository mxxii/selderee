[API documentation](../index.md) / [selderee](selderee.md) / Ast

# Namespace: Ast

[selderee](selderee.md).Ast

## Table of contents

### Type Aliases

- [AttrPresenceNode](selderee.Ast.md#attrpresencenode)
- [AttrValueNode](selderee.Ast.md#attrvaluenode)
- [DecisionTreeNode](selderee.Ast.md#decisiontreenode)
- [MatcherNode](selderee.Ast.md#matchernode)
- [PopElementNode](selderee.Ast.md#popelementnode)
- [PushElementNode](selderee.Ast.md#pushelementnode)
- [Specificity](selderee.Ast.md#specificity)
- [TagNameNode](selderee.Ast.md#tagnamenode)
- [TerminalNode](selderee.Ast.md#terminalnode)
- [ValueContainer](selderee.Ast.md#valuecontainer)
- [VariantNode](selderee.Ast.md#variantnode)

## Type Aliases

### AttrPresenceNode

Ƭ **AttrPresenceNode**<`V`\>: `Object`

Have to check the presence of an element attribute
with the given name.

#### Type parameters

| Name |
| :------ |
| `V` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cont` | [`DecisionTreeNode`](selderee.Ast.md#decisiontreenode)<`V`\>[] |
| `name` | `string` |
| `type` | ``"attrPresence"`` |

___

### AttrValueNode

Ƭ **AttrValueNode**<`V`\>: `Object`

Have to check the value of an element attribute
with the given name.
It usually requires to run all underlying matchers
one after another.

#### Type parameters

| Name |
| :------ |
| `V` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `matchers` | [`MatcherNode`](selderee.Ast.md#matchernode)<`V`\>[] |
| `name` | `string` |
| `type` | ``"attrValue"`` |

___

### DecisionTreeNode

Ƭ **DecisionTreeNode**<`V`\>: [`TerminalNode`](selderee.Ast.md#terminalnode)<`V`\> \| [`TagNameNode`](selderee.Ast.md#tagnamenode)<`V`\> \| [`AttrPresenceNode`](selderee.Ast.md#attrpresencenode)<`V`\> \| [`AttrValueNode`](selderee.Ast.md#attrvaluenode)<`V`\> \| [`PushElementNode`](selderee.Ast.md#pushelementnode)<`V`\> \| [`PopElementNode`](selderee.Ast.md#popelementnode)<`V`\>

#### Type parameters

| Name |
| :------ |
| `V` |

___

### MatcherNode

Ƭ **MatcherNode**<`V`\>: `Object`

String value matcher.
Contains the predicate so no need to reimplement it
from descriptive parameters.

#### Type parameters

| Name |
| :------ |
| `V` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cont` | [`DecisionTreeNode`](selderee.Ast.md#decisiontreenode)<`V`\>[] |
| `matcher` | ``"="`` \| ``"~="`` \| ``"\|="`` \| ``"^="`` \| ``"$="`` \| ``"*="`` |
| `modifier` | ``"i"`` \| ``"s"`` \| ``null`` |
| `type` | ``"matcher"`` |
| `value` | `string` |
| `predicate` | (`prop`: `string`) => `boolean` |

___

### PopElementNode

Ƭ **PopElementNode**<`V`\>: `Object`

Remove the top element from the stack -
following checks are performed on the previous element.

#### Type parameters

| Name |
| :------ |
| `V` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cont` | [`DecisionTreeNode`](selderee.Ast.md#decisiontreenode)<`V`\>[] |
| `type` | ``"popElement"`` |

___

### PushElementNode

Ƭ **PushElementNode**<`V`\>: `Object`

Push next element on the stack, defined by the combinator.
Only `>` and `+` are expected to be supported.

All checks are performed on the element on top of the stack.

#### Type parameters

| Name |
| :------ |
| `V` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `combinator` | ``">"`` \| ``"+"`` |
| `cont` | [`DecisionTreeNode`](selderee.Ast.md#decisiontreenode)<`V`\>[] |
| `type` | ``"pushElement"`` |

___

### Specificity

Ƭ **Specificity**: [`number`, `number`, `number`]

Specificity as defined by Selectors spec.

[https://www.w3.org/TR/selectors/#specificity](https://www.w3.org/TR/selectors/#specificity)

Three levels: for id, class, tag (type).

Extra level(s) used in HTML styling don't fit the scope of this package
and no space reserved for them.

___

### TagNameNode

Ƭ **TagNameNode**<`V`\>: `Object`

Tag name has to be checked.
Underlying variants can be assembled
into a dictionary key check.

#### Type parameters

| Name |
| :------ |
| `V` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | ``"tagName"`` |
| `variants` | [`VariantNode`](selderee.Ast.md#variantnode)<`V`\>[] |

___

### TerminalNode

Ƭ **TerminalNode**<`V`\>: `Object`

When reached a terminal node, decision tree adds
the value container to the list of successful matches.

#### Type parameters

| Name |
| :------ |
| `V` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | ``"terminal"`` |
| `valueContainer` | [`ValueContainer`](selderee.Ast.md#valuecontainer)<`V`\> |

___

### ValueContainer

Ƭ **ValueContainer**<`V`\>: `Object`

Container for the associated value,
selector specificity and position in the selectors collection.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `V` | the type of the associated value. |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `index` | `number` |
| `specificity` | [`Specificity`](selderee.Ast.md#specificity) |
| `value` | `V` |

___

### VariantNode

Ƭ **VariantNode**<`V`\>: `Object`

String value variant.

#### Type parameters

| Name |
| :------ |
| `V` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cont` | [`DecisionTreeNode`](selderee.Ast.md#decisiontreenode)<`V`\>[] |
| `type` | ``"variant"`` |
| `value` | `string` |
