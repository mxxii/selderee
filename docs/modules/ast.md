[API documentation - v0.5.0](../index.md) / Ast

# Namespace: Ast

## Table of contents

### Type aliases

- [AttrPresenceNode](ast.md#attrpresencenode)
- [AttrValueNode](ast.md#attrvaluenode)
- [DecisionTreeNode](ast.md#decisiontreenode)
- [MatcherNode](ast.md#matchernode)
- [PopElementNode](ast.md#popelementnode)
- [PushElementNode](ast.md#pushelementnode)
- [Specificity](ast.md#specificity)
- [TagNameNode](ast.md#tagnamenode)
- [TerminalNode](ast.md#terminalnode)
- [ValueContainer](ast.md#valuecontainer)
- [VariantNode](ast.md#variantnode)

## Type aliases

### AttrPresenceNode

Ƭ **AttrPresenceNode**<V\>: *object*

Have to check the presence of an element attribute
with the given name.

#### Type parameters

| Name |
| :------ |
| `V` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cont` | [*DecisionTreeNode*](ast.md#decisiontreenode)<V\>[] |
| `name` | *string* |
| `type` | ``"attrPresence"`` |

___

### AttrValueNode

Ƭ **AttrValueNode**<V\>: *object*

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
| `matchers` | [*MatcherNode*](ast.md#matchernode)<V\>[] |
| `name` | *string* |
| `type` | ``"attrValue"`` |

___

### DecisionTreeNode

Ƭ **DecisionTreeNode**<V\>: [*TerminalNode*](ast.md#terminalnode)<V\> \| [*TagNameNode*](ast.md#tagnamenode)<V\> \| [*AttrPresenceNode*](ast.md#attrpresencenode)<V\> \| [*AttrValueNode*](ast.md#attrvaluenode)<V\> \| [*PushElementNode*](ast.md#pushelementnode)<V\> \| [*PopElementNode*](ast.md#popelementnode)<V\>

#### Type parameters

| Name |
| :------ |
| `V` |

___

### MatcherNode

Ƭ **MatcherNode**<V\>: *object*

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
| `cont` | [*DecisionTreeNode*](ast.md#decisiontreenode)<V\>[] |
| `matcher` | ``"="`` \| ``"~="`` \| ``"\|="`` \| ``"^="`` \| ``"$="`` \| ``"*="`` |
| `modifier` | ``"i"`` \| ``"s"`` \| ``null`` |
| `predicate` | (`prop`: *string*) => *boolean* |
| `type` | ``"matcher"`` |
| `value` | *string* |

___

### PopElementNode

Ƭ **PopElementNode**<V\>: *object*

Remove the top element from the stack -
following ckecks are performed on the previous element.

#### Type parameters

| Name |
| :------ |
| `V` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cont` | [*DecisionTreeNode*](ast.md#decisiontreenode)<V\>[] |
| `type` | ``"popElement"`` |

___

### PushElementNode

Ƭ **PushElementNode**<V\>: *object*

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
| `cont` | [*DecisionTreeNode*](ast.md#decisiontreenode)<V\>[] |
| `type` | ``"pushElement"`` |

___

### Specificity

Ƭ **Specificity**: [*number*, *number*, *number*]

Specificity as defined by Selectors spec.

[https://www.w3.org/TR/selectors/#specificity](https://www.w3.org/TR/selectors/#specificity)

Three levels: for id, class, tag (type).

Extra level(s) used in HTML styling don't fit the scope of this package
and no space reserved for them.

___

### TagNameNode

Ƭ **TagNameNode**<V\>: *object*

Tag name has to be checked.
Underlying varuants can be assembled
into a dictionary key check.

#### Type parameters

| Name |
| :------ |
| `V` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | ``"tagName"`` |
| `variants` | [*VariantNode*](ast.md#variantnode)<V\>[] |

___

### TerminalNode

Ƭ **TerminalNode**<V\>: *object*

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
| `valueContainer` | [*ValueContainer*](ast.md#valuecontainer)<V\> |

___

### ValueContainer

Ƭ **ValueContainer**<V\>: *object*

Container for the associated value,
selector specificity and position in the selectors collection.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `V` | the type of the associated value. |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `index` | *number* |
| `specificity` | [*Specificity*](ast.md#specificity) |
| `value` | V |

___

### VariantNode

Ƭ **VariantNode**<V\>: *object*

String value variant.

#### Type parameters

| Name |
| :------ |
| `V` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cont` | [*DecisionTreeNode*](ast.md#decisiontreenode)<V\>[] |
| `type` | ``"variant"`` |
| `value` | *string* |
