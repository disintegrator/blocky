import Chance from 'chance';
import { assert } from 'chai';

import { Block, BlockGrid, COLOURS, MAX_X, MAX_Y } from './grid';

const serialize = grid => {
  return grid.map(col => col.map(b => b.colour.charAt(0)).join(' ')).join('\n');
};

describe('Block', () => {
  it('should be created with correct coordinates and one of the valid colours', () => {
    let testCoords = [[1, 2], [4, 9], [0, 0]];

    testCoords.forEach(testCoord => {
      const random = new Chance(1);
      const block = new Block(...testCoord, random.pickone(COLOURS));
      assert.equal(block.x, testCoord[0], 'x is set correctly');
      assert.equal(block.y, testCoord[1], 'y is set correctly');
      assert.ok(COLOURS.indexOf(block.colour) > -1, 'colour is valid');
    });
  });
});

describe('BlockGrid', () => {
  it(`should be ${MAX_X} by ${MAX_Y} blocks in size`, () => {
    const blockGrid = new BlockGrid();
    const { grid } = blockGrid;
    assert.equal(grid.length, MAX_X, `grid.length !== ${MAX_X}`);
    grid.forEach((col, i) => {
      assert.equal(col.length, MAX_Y, `grid[${i}].length !== ${MAX_Y}`);
    });
  });

  it('should eliminate similarly-coloured, adjacent blocks', () => {
    const random = new Chance(1);
    const blockGrid = new BlockGrid({ random });
    blockGrid.renderBlockColour = () => {};
    const { grid } = blockGrid;
    // Initial:
    /*
g y b y r r g y r r
r g r g g b g y b y
g g b b r g y r r b
b y g g b g r y r y
y b y y g r b b y y
y y r y r g r r y b
r b g b y g b r b g
g r b y y g r r y b
y b b g g g y r r r
g g y r g y g r r b
    */
    blockGrid.blockClicked(null, grid[7][3]); // click a chain of yellows
    blockGrid.blockClicked(null, grid[1][0]); // click a singular block
    blockGrid.blockClicked(null, grid[4][9]); // click a chain of yellows
    blockGrid.blockClicked(null, grid[7][8]); // click a transparent block
    blockGrid.blockClicked(null, grid[9][0]); // click a chain of greens
    blockGrid.blockClicked(null, grid[9][0]); // click a chain of reds
    assert.equal(
      serialize(grid),
      `
g y b y r r g y r r
r g r g g b g y b y
g g b b r g y r r b
b y g g b g r y r t
y b y y g r b b t t
y y r y r g r r b t
r b g b g b r b g t
g r b g r r y b t t
b b g g g y r r r t
r g y g r r b t t t
`.trim(),
    );
  });
});
