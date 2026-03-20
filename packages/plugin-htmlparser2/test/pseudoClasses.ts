import test, { type Macro } from 'ava';
import * as htmlparser2 from 'htmlparser2';
import { type ChildNode, type Element, isTag } from 'domhandler';
import { DecisionTree } from 'selderee';

import { hp2Builder } from '../src/hp2-builder.ts';

type PseudoClassMacroOptions = {
  selector: string;
  expectedPositive: string[];
  expectedNegative: string[];
};

const pseudoClassMacro: Macro<[PseudoClassMacroOptions]> = {
  exec: (t, options: PseudoClassMacroOptions) => {
    const { selector, expectedPositive: positiveFragments, expectedNegative: negativeFragments } = options;
    const dt = (new DecisionTree([[selector, null]])).build(hp2Builder);

    const findTargetElement = (nodes: ChildNode[]): Element | null => {
      for (const node of nodes) {
        if (!isTag(node)) {
          continue;
        }
        if (node.attribs['id'] === 'target') {
          return node;
        }
        const nested = findTargetElement(node.children);
        if (nested) {
          return nested;
        }
      }
      return null;
    };

    const evaluate = (fragments: string[]): Record<string, boolean> => {
      const result: Record<string, boolean> = {};
      for (const html of fragments) {
        const dom = htmlparser2.parseDocument(html);
        const element = findTargetElement(dom.children);
        if (!element) {
          t.fail('Couldn\'t find element with id="target" for test - check the test');
          return result;
        }

        result[html] = dt.pickAll(element).length > 0;
      }
      return result;
    };

    const result = {
      expectedPositive: evaluate(positiveFragments),
      expectedNegative: evaluate(negativeFragments),
    };
    t.snapshot(
      result,
      `Results of ${selector} pseudo-class matching on positive and negative test cases`,
    );
  },
  title: (_provided: string | undefined, options: PseudoClassMacroOptions) =>
    `pseudo-class - ${options.selector}`,
};

// https://drafts.csswg.org/selectors-3/#empty-pseudo
// https://drafts.csswg.org/selectors-4/#the-empty-pseudo
// https://github.com/web-platform-tests/wpt/blob/master/css/selectors/selectors-empty-001.xml
test(
  pseudoClassMacro,
  {
    selector: ':empty',
    expectedPositive: [
      '<div id="target"/>',
      '<div id="target"></div>',
      '<div id="target" title="data"></div>',
      '<div id="target"><!-- comment --></div>',
      '<div id="target"><!-- comment --><!-- comment --></div>',
      '<div id="target"><![CDATA[data]]></div>',
      '<div id="target"><?php?></div>',
      '<div id="target"><!-- comment --><![CDATA[data]]><?php?></div>',
    ],
    expectedNegative: [
      '<div id="target">text</div>',
      '<div id="target"> </div>',
      '<div id="target"><p></p></div>',
      '<div id="target"><script></script></div>',
      '<div id="target"><style></style></div>',
      '<div id="target">&nbsp;</div>',
      '<div id="target">&gt;&lt;</div>',
      '<div id="target">&#x2211;</div>',
      '<div id="target"><!-- comment --> </div>',
      '<div id="target"> <!-- comment --></div>',
      '<div id="target"><![CDATA[data]]> </div>',
      '<div id="target"> <![CDATA[data]]></div>',
      '<div id="target"><?php?> </div>',
      '<div id="target"> <?php?></div>',
    ],
  },
);

// https://www.w3.org/TR/selectors-3/#only-child-pseudo
// https://www.w3.org/TR/selectors/#the-only-child-pseudo
// https://github.com/web-platform-tests/wpt/blob/master/css/selectors/only-child.html

test(
  pseudoClassMacro,
  {
    selector: ':only-child',
    expectedPositive: [
      '<div id="target"/>',
      '<div id="target"></div>',
      '<!-- comment --><div id="target"></div>',
      '<div id="target"></div><!-- comment -->',
      '<!-- comment --><div id="target"></div><!-- comment -->',
      ' text <div id="target"></div> text ',
      '<![CDATA[data]]><div id="target"></div><?php?>',
    ],
    expectedNegative: [
      '<div id="target"></div><span></span>',
      '<!-- comment --><div id="target"></div><span></span>',
      '<div id="target"></div> text <span></span>',
      '<![CDATA[data]]><div id="target"></div><?php?><span></span>',
    ],
  },
);

// https://www.w3.org/TR/selectors-3/#first-child-pseudo
// https://www.w3.org/TR/selectors/#the-first-child-pseudo
// https://github.com/web-platform-tests/wpt/blob/master/css/selectors/first-child.html
test(
  pseudoClassMacro,
  {
    selector: ':first-child',
    expectedPositive: [
      '<div id="target"></div>',
      '<!-- comment --><div id="target"></div>',
      ' text <div id="target"></div>',
      '<section><div id="target"></div><span></span></section>',
      '<section><!-- comment --><div id="target"></div></section>',
      '<section> text <div id="target"></div></section>',
    ],
    expectedNegative: [
      '<span></span><div id="target"></div>',
      '<!-- comment --><span></span><div id="target"></div>',
      ' text <span></span><div id="target"></div>',
      '<section><span></span><div id="target"></div></section>',
      '<section><!-- comment --><span></span><div id="target"></div></section>',
      '<section> text <span></span><div id="target"></div></section>',
    ],
  },
);

// https://www.w3.org/TR/selectors-3/#last-child-pseudo
// https://www.w3.org/TR/selectors/#the-last-child-pseudo
// https://github.com/web-platform-tests/wpt/blob/master/css/selectors/last-child.html
test(
  pseudoClassMacro,
  {
    selector: ':last-child',
    expectedPositive: [
      '<div id="target"></div>',
      '<div id="target"></div><!-- comment -->',
      '<div id="target"></div> text ',
      '<section><span></span><div id="target"></div></section>',
      '<section><div id="target"></div><!-- comment --></section>',
      '<section><div id="target"></div> text </section>',
    ],
    expectedNegative: [
      '<div id="target"></div><span></span>',
      '<div id="target"></div><!-- comment --><span></span>',
      '<div id="target"></div> text <span></span>',
      '<section><div id="target"></div><span></span></section>',
      '<section><div id="target"></div><!-- comment --><span></span></section>',
      '<section><div id="target"></div> text <span></span></section>',
    ],
  },
);

// https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:any-link
// https://www.w3.org/TR/selectors/#the-any-link-pseudo
test(
  pseudoClassMacro,
  {
    selector: ':any-link',
    expectedPositive: [
      '<a id="target" href="https://example.com"></a>',
      '<a id="target" href=""></a>',
      '<a id="target" href></a>',
      '<area id="target" href="https://example.com"/>',
      '<area id="target" href=""/>',
    ],
    expectedNegative: [
      '<a id="target"></a>',
      '<area id="target"></area>',
      '<div id="target" href="https://example.com"></div>',
      '<section><a href="https://example.com"></a><a id="target"></a></section>',
      '<section><area href="https://example.com"></area><area id="target"></area></section>',
    ],
  },
);
