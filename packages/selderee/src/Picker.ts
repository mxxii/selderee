import { compareSpecificity } from 'parseley';
import { ValueContainer } from './Ast';
import { MatcherFunction } from './Types';

/**
 * Simple wrapper around the matcher function.
 * Recommended return type for builder plugins.
 *
 * @typeParam L - the type of HTML Element in the targeted DOM AST.
 * @typeParam V - the type of associated values.
 */
export class Picker<L,V> {

  private f: MatcherFunction<L,V>;

  /**
   * Create new Picker object.
   *
   * @typeParam L - the type of HTML Element in the targeted DOM AST.
   * @typeParam V - the type of associated values.
   *
   * @param f - the function that matches an element
   * and returns all associated values.
   */
  constructor (f: MatcherFunction<L,V>) {
    this.f = f;
  }

  /**
   * Run the selectors decision tree against one HTML Element
   * and return all matched associated values
   * along with selector specificities.
   *
   * Client code then decides how to further process them
   * (sort, filter, etc).
   *
   * @param el - an HTML Element.
   *
   * @returns all associated values along with
   * selector specificities for all matched selectors.
   */
  pickAll (el: L): ValueContainer<V>[] {
    return this.f(el);
  }

  /**
   * Run the selectors decision tree against one HTML Element
   * and choose the value from the most specific matched selector.
   *
   * @param el - an HTML Element.
   *
   * @param preferFirst - option to define which value to choose
   * when there are multiple matches with equal specificity.
   *
   * @returns the value from the most specific matched selector
   * or `null` if nothing matched.
   */
  pick1 (
    el: L,
    preferFirst = false
  ): V | null {
    const results = this.f(el);
    const len = results.length;
    if (len === 0) { return null; }
    if (len === 1) { return results[0].value; }
    const comparator = (preferFirst)
      ? comparatorPreferFirst
      : comparatorPreferLast;
    let result = results[0];
    for (let i = 1; i < len; i++) {
      const next = results[i];
      if (comparator(result, next)) { result = next; }
    }
    return result.value;
  }

}

function comparatorPreferFirst<V>(
  acc: ValueContainer<V>,
  next: ValueContainer<V>
): boolean {
  const diff = compareSpecificity(next.specificity, acc.specificity);
  return diff > 0 || (diff === 0 && next.index < acc.index);
}

function comparatorPreferLast<V>(
  acc: ValueContainer<V>,
  next: ValueContainer<V>
): boolean {
  const diff = compareSpecificity(next.specificity, acc.specificity);
  return diff > 0 || (diff === 0 && next.index > acc.index);
}
