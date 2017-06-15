import { NULL_COLOUR } from './constants';
import { getColourChain } from './search';
import { assert } from 'chai';

const grid = [
  ['B', 'G', 'Y', 'R', 'R', 'R', 'Y', 'Y', 'G', 'R'],
  ['G', 'G', 'G', 'B', 'Y', 'G', 'Y', 'B', 'R', 'G'],
  ['Y', 'Y', 'R', 'R', 'R', 'G', 'G', 'R', 'Y', 'R'],
  ['G', 'B', 'R', 'Y', 'B', 'Y', 'B', 'Y', 'Y', 'G'],
  ['B', 'G', 'Y', 'B', 'G', 'G', 'B', 'R', 'R', 'R'],
  ['B', 'B', 'Y', 'Y', 'Y', 'R', 'G', 'B', 'R', 'Y'],
  ['B', 'B', 'R', 'Y', 'B', 'G', 'R', 'B', 'R', 'R'],
  ['B', 'R', 'G', 'G', 'Y', 'Y', 'R', 'Y', NULL_COLOUR, NULL_COLOUR],
  ['G', 'R', 'B', 'B', 'B', 'Y', 'Y', 'Y', 'R', NULL_COLOUR],
  ['G', 'R', 'R', 'G', 'G', 'Y', 'Y', 'B', 'G', NULL_COLOUR],
].map(
  // recreate a grid of `Block`s
  (col, x) => col.map((colour, y) => ({ x, y, colour })),
);

describe('search', () => {
  describe('getColourChain', () => {
    [
      { block: grid[0][1], size: 4 },
      { block: grid[5][5], size: 1 },
      { block: grid[6][8], size: 6 },
      { block: grid[7][8], size: 1 },
    ].forEach(({ block, size }) => {
      const { colour } = block;
      it(`should return a set of ${size} ${colour}-coloured blocks`, () => {
        const chain = getColourChain(block, grid);
        assert.equal(chain.size, size);
        const colours = new Set();
        chain.forEach(b => {
          colours.add(b.colour);
        });
        assert.equal(
          colours.size,
          1,
          `Expected chain to be of one colour found ${size}`,
        );
        assert.ok(colours.has(colour), `Expected chain colour to be ${colour}`);
      });
    });
  });
});
