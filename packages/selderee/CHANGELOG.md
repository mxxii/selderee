# Changelog

## Version 0.12.0

* targeting Node 20;
* adjusted `package.json` exports;
* bumped `parseley` dependency to version 0.13.1 ([changelog](https://github.com/mxxii/parseley/blob/main/CHANGELOG.md))
  * Pseudo-classes;
  * Some normalization improvements;
* `DecisionTree` now accepts an options object (`DecisionTreeOptions`) as an optional second argument:
  * `attributesWithNormalizedValues: string[]` - list of attribute names whose values should be normalized (lowercased) when matching selectors. Default: `[]`
    * by default, all attribute values without explicit case-sensitivity flag are matched case-sensitively;
* added support for pseudo-classes:
  * `:empty` - matches elements that have no children (including text nodes) - according to [Selectors-3](https://drafts.csswg.org/selectors-3/#empty-pseudo) spec and current browser implementation. Selectors-4 spec is not implemented by browsers and is not followed here;
  * `:first-child` - matches elements that are the first child of their parent;
  * `:last-child` - matches elements that are the last child of their parent;
  * `:only-child` - matches elements that are the only child of their parent;
  * `:any-link` - matches `a` or `area` elements with an `href` attribute - according to [Selectors-4](https://www.w3.org/TR/selectors/#the-any-link-pseudo) spec.

## Version 0.11.0

* Bump `parseley` dependency to version 0.12.0 ([changelog](https://github.com/mxxii/parseley/blob/main/CHANGELOG.md))
  * Escape sequences in selectors.

## Version 0.10.0

* Targeting Node.js version 14 and ES2020;
* Bump dependencies.

## Version 0.9.0

* Bump dependencies - fix "./core module cannot be found" issue.

## Version 0.8.1

* Bump `parseley` dependency to version 0.9.1 ([changelog](https://github.com/mxxii/parseley/blob/main/CHANGELOG.md))
  * Now all dependencies are TypeScript, dual CommonJS/ES module packages;
* Use `rollup-plugin-cleanup` to condition published files;
* Package is marked as free of side effects.

## Version 0.7.0

* Drop Node.js version 10 support. At least 12.22.x is required.

## Version 0.6.0

* Give priority to more common attribute values (Previously the first matching simple selector was taken instead);
* Repeated simple selectors should not affect the tree balance and should not produce extra tree nodes (But they affect the specificity).

## Version 0.5.0

Initial release.

Aiming at Node.js version 10 and up.
