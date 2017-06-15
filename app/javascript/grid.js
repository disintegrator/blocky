import Chance from 'chance';

import { NULL_COLOUR } from './constants';
import { getColourChain } from './search';

export const COLOURS = ['red', 'green', 'blue', 'yellow'];
export const MAX_X = 10;
export const MAX_Y = 10;

// Switching to Chance allows us a to use a controlled source of randomness.
// BlockGrid can use RANDOM as a default random number generator. When testing,
// we can pass BlockGrid an instance with a fixed seed and be able to generate
// a deterministic grid
const RANDOM = new Chance(Math.random);

const genId = ({ x, y }) => `block_${x}x${y}`;

export class Block {
  constructor(x, y, colour) {
    this.x = x;
    this.y = y;
    this.colour = colour;
  }
}

export class BlockGrid {
  constructor({ random = RANDOM } = {}) {
    this.grid = [];

    for (let x = 0; x < MAX_X; x++) {
      let col = [];
      for (let y = 0; y < MAX_Y; y++) {
        col.push(new Block(x, y, random.pickone(COLOURS)));
      }

      this.grid.push(col);
    }
    return this;
  }

  render(el = document.querySelector('#gridEl')) {
    for (let x = 0; x < MAX_X; x++) {
      let id = 'col_' + x;
      let colEl = document.createElement('div');
      colEl.className = 'col';
      colEl.id = id;
      el.appendChild(colEl);

      for (let y = MAX_Y - 1; y >= 0; y--) {
        let block = this.grid[x][y],
          id = genId(block),
          blockEl = document.createElement('div');

        blockEl.id = id;
        blockEl.className = 'block';
        blockEl.style.background = block.colour;
        blockEl.addEventListener('click', evt => this.blockClicked(evt, block));
        colEl.appendChild(blockEl);
      }
    }

    return this;
  }

  renderBlockColour(block) {
    const { x, y, colour } = block;
    const id = genId(block);
    document.getElementById(id).style.background = colour;
  }

  blockClicked(e, block) {
    const chain = getColourChain(block, this.grid);
    if (chain.size <= 1) {
      return;
    }

    const collapse = {};
    chain.forEach(({ x, y }) => {
      const current = collapse[x] || { start: y, count: 0 };
      collapse[x] = {
        start: Math.min(current.start, y),
        count: current.count + 1,
      };
    });
    Object.keys(collapse).forEach(x => {
      const { start, count } = collapse[x];
      // "collapse" the column
      for (let y = start; y < MAX_Y - count; y++) {
        const block = this.grid[x][y];
        const colour = this.grid[x][y + count].colour;
        block.colour = colour;
        this.renderBlockColour(block);
      }
      // clear the rest of the blocks in the column
      for (let y = MAX_Y - count; y < MAX_Y; y++) {
        const block = this.grid[x][y];
        block.colour = NULL_COLOUR;
        this.renderBlockColour(block);
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
