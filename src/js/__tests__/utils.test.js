import { calcTileType, calcHealthLevel } from '../utils';

test.each([
  [0, 'top-left'],
  [5, 'top'],
  [7, 'top-right'],
  [8, 'left'],
  [10, 'center'],
  [15, 'right'],
  [25, 'center'],
  [30, 'center'],
  [35, 'center'],
  [40, 'left'],
  [45, 'center'],
  [50, 'center'],
  [55, 'right'],
  [56, 'bottom-left'],
  [60, 'bottom'],
  [63, 'bottom-right'],
])('calcTileType with index %s should return %s', (index, expected) => {
  expect(calcTileType(index, 8)).toBe(expected);
});

test.each([
  [5, 'critical'],
  [15, 'normal'],
  [50, 'high'],
])('Health %s level', (value, level) => {
  expect(calcHealthLevel(value)).toBe(level);
});
