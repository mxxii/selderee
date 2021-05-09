import test, {ExecutionContext} from 'ava';
import * as htmlparser2 from 'htmlparser2';
import { DecisionTree } from 'selderee';

import { hp2Builder } from '../src/hp2-builder';

const html = /*html*/`<html><body>
  <div><p id="A" class="foo qux">second</p></div>
</body></html>`;
const dom = htmlparser2.parseDocument(html);

function pickAllMacro(
  t: ExecutionContext,
  elemId: string,
  selectors: [string, string][]
) {
  const dt = (new DecisionTree(selectors)).build(hp2Builder);
  const element = htmlparser2.DomUtils.getElementById(elemId, dom.children, true);
  if (element === null) {
    t.fail('Couldn\'t get the element for test - check the test');
  } else {
    t.snapshot(
      dt.pickAll(element),
      `For \`#${elemId}\`, pick matches from \`${JSON.stringify(selectors)}\``
    );
  }
}

test('empty input', pickAllMacro, 'A', []);

test('single matching input', pickAllMacro, 'A', [['p.qux', 'A1']]);

test('single non-matching input', pickAllMacro, 'A', [['p.bar', 'A2']]);

test('multiple inputs', pickAllMacro, 'A', [
  ['p.foo', 'A3'],
  ['p.bar', 'A4'],
  ['*.baz', 'A5'],
  ['* > [class~=qux]', 'A6'],
  ['#A[class]','A7']
]);
