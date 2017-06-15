import { NULL_COLOUR } from './constants';

const getNeighbours = (block, grid) => {
  const x = block.x;
  const y = block.y;
  const top = grid[x][y + 1];
  const right = grid[x][y - 1];
  const bottom = (grid[x + 1] || [])[y];
  const left = (grid[x - 1] || [])[y];
  return [top, right, bottom, left];
};

const unionSet = (s1, s2) => {
  const union = new Set(s1);
  for (var elem of s2) {
    union.add(elem);
  }
  return union;
};

export const getColourChain = (startBlock, grid, chain = new Set()) => {
  let out = new Set(chain);
  out.add(startBlock);
  const ns = getNeighbours(startBlock, grid);
  ns
    .filter(
      n =>
        n && // must not be out of bounds value aka undefined
        n.colour !== NULL_COLOUR && // must not be a null block
        n.colour === startBlock.colour && // must be same colour as startBlock
        !out.has(n), // must be a newly visited block
    )
    .forEach(n => {
      out = unionSet(out, getColourChain(n, grid, out));
    });
  return out;
};
