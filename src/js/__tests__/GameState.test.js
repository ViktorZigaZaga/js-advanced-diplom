import GameStateService from '../GameStateService';
import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameState from '../GameState';

const storage = {};
const gamePlay = new GamePlay();
const stateService = new GameStateService(storage);
const gameController = new GameController(gamePlay, stateService);

jest.mock('../GamePlay');

test('test gameLoad', () => {
  jest.resetAllMocks();
  gameController.gamePlay.cellClickListeners = [1, 2, 3];
  GameStateService.clear = jest.fn(() => {});
  gameController.loadGame();
  expect(GamePlay.showPopup).toBeCalledWith('Ошибка загрузки: "Invalid state"');
});

test('test gameSave', () => {
  jest.resetAllMocks();
  const gameState = GameState.from(1, 56, 115, 755, []);
  stateService.storage.setItem = jest.fn;
  stateService.save(gameState);
  gameController.loadGame();
  expect(GamePlay.showPopup).toBeCalledWith('Игра загружена.');
});
