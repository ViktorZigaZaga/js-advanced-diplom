import Bowman from '../characters/bowman';
import Swordsman from '../characters/swordsman';
import Magician from '../characters/magician';
import GameStateService from '../GameStateService';
import GamePlay from '../GamePlay';
import GameController from '../GameController';
import PositionedCharacter from '../PositionedCharacter';
import cursors from '../cursors';
import Daemon from '../characters/daemon';
import Undead from '../characters/undead';
import GameState from '../GameState';

const swordsmanPosition = new PositionedCharacter(new Swordsman(1), 30);
const bowmanInPosition = new PositionedCharacter(new Bowman(1), 25);
const daemonInPosition = new PositionedCharacter(new Daemon(1), 27);
const undeadInPosition = new PositionedCharacter(new Undead(1), 55);
const gameCtrl = new GameController(new GamePlay(), new GameStateService());
const gameState = new GameState(1, 1, 0, 0, [
  bowmanInPosition,
  swordsmanPosition,
  daemonInPosition,
  undeadInPosition,
]);

// gameCtrl.gameState.allTypesPositions = [
//   bowmanInPosition,
//   swordsmanPosition,
//   daemonInPosition,
//   undeadInPosition,
// ];

gameCtrl.userTypes = [Swordsman, Bowman, Magician];

gameCtrl.gamePlay.hideCellTooltip = jest.fn();
gameCtrl.gamePlay.showCellTooltip = jest.fn();
gameCtrl.gamePlay.setCursor = jest.fn();
gameCtrl.gamePlay.selectCell = jest.fn();

test('If there is a character in the cell, when you hover over the character, information about him is displayed + curson pointer', () => {
  const message = `\u{1F396}${bowmanInPosition.character.level}\u{2694}${bowmanInPosition.character.attack}\u{1F6E1}${bowmanInPosition.character.defence}\u{2764}${bowmanInPosition.character.health}`;
  gameCtrl.onCellEnter(25);
  expect(gameCtrl.gamePlay.showCellTooltip).toHaveBeenCalledWith(message, 25);
  expect(gameCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.pointer);
});

test('If the cursor is taken away from the cell with the character, information about it ceases to be displayed + curson auto', () => {
  gameCtrl.onCellLeave(25);
  expect(gameCtrl.gamePlay.hideCellTooltip).toBeCalled();
  expect(gameCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.auto);
});

test('If there is a player character in the cell, onCellClick highlights the cell', () => {
  gameCtrl.onCellClick(25);
  expect(gameCtrl.gamePlay.selectCell).toBeCalled();
});

test('getAllowedMove, getAllowedAttack return valid arrays', () => {
  const receivedAttack = [
    24, 16, 8, 32, 40, 25, 17, 9, 33, 41, 26, 18, 10, 34, 42, 27, 19, 11, 35, 43,
  ];
  const receivedMove = [9, 17, 33, 41, 24, 26, 27, 16, 18, 11, 34, 43, 32];
  expect(GameController.getAllowedAttack(2, 25)).toEqual(receivedAttack);
  expect(GameController.getAllowedMove(2, 25)).toEqual(receivedMove);
});

test('onCellEnter shows the cell + curson pointer', () => {
  gameCtrl.onCellEnter(26);
  expect(gameCtrl.gamePlay.selectCell).toHaveBeenCalledWith(26, 'green');
  expect(gameCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.pointer);
});

test('If a character is selected and a valid attack range, then when hovering over a bot curson crosshair', () => {
  gameCtrl.onCellEnter(27);
  expect(gameCtrl.gamePlay.selectCell).toHaveBeenCalledWith(27, 'red');
});

test('If a character is selected but not a valid range to attack and move curson notallowed', () => {
  gameCtrl.onCellEnter(55);
  expect(gameCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.notallowed);
});

test('If the cell has a bot character, onCellClick shows an error message', () => {
  gameCtrl.onCellClick(55);
  expect(gameCtrl.gamePlay.selectCell).toBeCalled();
});

test('teamLocation should place characters in the right fields and in a certain amount', () => {
  const position = gameCtrl.teamLocation([Swordsman, Bowman, Magician], gameState.level, 7);
  expect(position.length).toBe(7);
});

test('position must be a number', () => {
  expect(() => new PositionedCharacter(new Swordsman(1), null)).toThrow(new Error('position must be a number'));
});

test('character must be instance of Character or its children', () => {
  expect(() => new PositionedCharacter(null, 1)).toThrow(new Error('character must be instance of Character or its children'));
});
