import test, {ExecutionContext} from 'ava';
import * as htmlparser2 from 'htmlparser2';
import { DecisionTree } from 'selderee';

import { hp2Builder } from '../src/hp2-builder';

const html = /*html*/`<html><body>
  <div><p id="A" class="foo qux">second</p></div>
</body></html>`;
const dom = htmlparser2.parseDocument(html);

function pick1Macro(
  t: ExecutionContext,
  elemId: string,
  selectors: [string, string][],
  preferFirst: boolean,
  expected: string | null
) {
  const dt = (new DecisionTree(selectors)).build(hp2Builder);
  const element = htmlparser2.DomUtils.getElementById(elemId, dom.children, true);
  if (element === null) {
    t.fail('Couldn\'t get the element for test - check the test');
  } else {
    t.is(
      dt.pick1(element, preferFirst),
      expected
    );
  }
}

test('empty input', pick1Macro, 'A', [], false, null);

test('single matching input', pick1Macro, 'A', [['p.qux', 'A1']], false, 'A1');

test('single non-matching input', pick1Macro, 'A', [['p.bar', 'A2']], false, null);

const selectors: [string, string][] = [
  ['p.bar', 'A3'],
  ['p.foo', 'A4'],
  ['div > [class~=qux]', 'A5'],
  ['p[class]','A6'],
  ['*.baz', 'A7']
];

test('multiple inputs, prefer last', pick1Macro, 'A', selectors, false, 'A6');

test('multiple inputs, prefer first', pick1Macro, 'A', selectors, true, 'A4');
