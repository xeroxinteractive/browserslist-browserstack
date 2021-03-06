import responses from '../__specs__/queries.json';
import { arraysEqual } from '../helpers';
const original = jest.requireActual('browserslist');

const browserslist = jest.fn(
  (
    queries?: string | readonly string[],
    opts?: Record<string, any>
  ): string[] => {
    for (const response of responses) {
      if (arraysEqual([queries], [response.queries])) {
        return response.results;
      }
    }
    // Fallback to the original, so it can throw relevant errors.
    const og = original(queries, opts);
    if (og.length) {
      const temp = {
        queries,
        opts,
        results: og,
      };
      throw new Error(
        `Please add an entry of:\n${JSON.stringify(
          temp,
          null,
          '  '
        )}\nin '/source/__mocks__/queries.json'!`
      );
    } else {
      return og;
    }
  }
);

export default browserslist;
