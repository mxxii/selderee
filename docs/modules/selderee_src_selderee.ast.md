[API documentation](../index.md) / [selderee/src/selderee](selderee_src_selderee.md) / Ast

# Namespace: Ast

[selderee/src/selderee](selderee_src_selderee.md).Ast

## Table of contents

### Type aliases

- [AttrPresenceNode](selderee_src_selderee.ast.md#attrpresencenode)
- [AttrValueNode](selderee_src_selderee.ast.md#attrvaluenode)
- [DecisionTreeNode](selderee_src_selderee.ast.md#decisiontreenode)
- [MatcherNode](selderee_src_selderee.ast.md#matchernode)
- [PopElementNode](selderee_src_selderee.ast.md#popelementnode)
- [PushElementNode](selderee_src_selderee.ast.md#pushelementnode)
- [Specificity](selderee_src_selderee.ast.md#specificity)
- [TagNameNode](selderee_src_selderee.ast.md#tagnamenode)
- [TerminalNode](selderee_src_selderee.ast.md#terminalnode)
- [ValueContainer](selderee_src_selderee.ast.md#valuecontainer)
- [VariantNode](selderee_src_selderee.ast.md#variantnode)

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
| `cont` | [*DecisionTreeNode*](selderee_src_selderee.ast.md#decisiontreenode)<V\>[] |
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
| `matchers` | [*MatcherNode*](selderee_src_selderee.ast.md#matchernode)<V\>[] |
| `name` | *string* |
| `type` | ``"attrValue"`` |

___

### DecisionTreeNode

Ƭ **DecisionTreeNode**<V\>: [*TerminalNode*](selderee_src_selderee.ast.md#terminalnode)<V\> \| [*TagNameNode*](selderee_src_selderee.ast.md#tagnamenode)<V\> \| [*AttrPresenceNode*](selderee_src_selderee.ast.md#attrpresencenode)<V\> \| [*AttrValueNode*](selderee_src_selderee.ast.md#attrvaluenode)<V\> \| [*PushElementNode*](selderee_src_selderee.ast.md#pushelementnode)<V\> \| [*PopElementNode*](selderee_src_selderee.ast.md#popelementnode)<V\>

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
| `cont` | [*DecisionTreeNode*](selderee_src_selderee.ast.md#decisiontreenode)<V\>[] |
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
| `cont` | [*DecisionTreeNode*](selderee_src_selderee.ast.md#decisiontreenode)<V\>[] |
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
| `cont` | [*DecisionTreeNode*](selderee_src_selderee.ast.md#decisiontreenode)<V\>[] |
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
| `variants` | [*VariantNode*](selderee_src_selderee.ast.md#variantnode)<V\>[] |

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
| `valueContainer` | [*ValueContainer*](selderee_src_selderee.ast.md#valuecontainer)<V\> |

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
| `specificity` | [*Specificity*](selderee_src_selderee.ast.md#specificity) |
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
| `cont` | [*DecisionTreeNode*](selderee_src_selderee.ast.md#decisiontreenode)<V\>[] |
| `type` | ``"variant"`` |
| `value` | *string* |
