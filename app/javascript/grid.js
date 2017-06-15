import { getColourChain } from './search';

export const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;

export class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
  }
}

export class BlockGrid {
  constructor() {
    this.grid = [];

    for (let x = 0; x < MAX_X; x++) {
      let col = [];
      for (let y = 0; y < MAX_Y; y++) {
        col.push(new Block(x, y));
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
          id = `block_${x}x${y}`,
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

  blockClicked(e, block) {
    const chain = getColourChain(block, this.grid);
    this.applyChain(chain);
  }

  renderBlockColour({ x, y, colour }) {
    const id = `block_${x}x${y}`;
    document.getElementById(id).style.background = colour;
  }

  applyChain(chain) {
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
      // grey out the rest of the column
      for (let y = MAX_Y - count; y < MAX_Y; y++) {
        const block = this.grid[x][y];
        block.colour = 'transparent';
        this.renderBlockColour(block);
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
