import themes from './themes';
import cursors from './cursors';
import Bowman from './characters/bowman';
import Daemon from './characters/daemon';
import Magician from './characters/magician';
import Swordsman from './characters/swordsman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.newGame();
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
  }

  newGame() {
    this.userTypes = [Swordsman, Bowman, Magician];
    this.computerTypes = [Daemon, Undead, Vampire];
    this.gameState = new GameState(1, 1, 0, 0, []);
    this.activeCharacter = null;
    this.motion = true;
    this.userTeamPositions = this.teamLocation(this.userTypes, this.gameState.level, 2);
    this.computerTeamPositions = this.teamLocation(this.computerTypes, this.gameState.level, 2);
    this.gameState.allTypesPositions = [
      ...this.userTeamPositions,
      ...this.computerTeamPositions,
    ];
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.gamePlay.redrawStatistics(
      this.gameState.level,
      this.gameState.steps,
      this.gameState.points,
      this.gameState.bestResult,
    );
    this.gamePlay.redrawPositions(this.gameState.allTypesPositions);
  }

  saveGame() {
    this.stateService.save(this.gameState);
    GamePlay.showPopup('Игра сохранена.');
  }

  loadGame() {
    if (this.gamePlay.cellClickListeners.length === 0) {
      this.init();
    }
    try {
      const load = this.stateService.load();
      if (load) {
        this.gameState = GameState.from(load);
        this.gamePlay.drawUi(themes[this.gameState.level]);
        this.gamePlay.redrawStatistics(
          this.gameState.level,
          this.gameState.steps,
          this.gameState.points,
          this.gameState.bestResult,
        );
        this.gamePlay.redrawPositions(this.gameState.allTypesPositions);
      }
    } catch (error) {
      GameController.clearLocalStorage('state');
      // localStorage.removeItem('state');
      GamePlay.showPopup(`Ошибка загрузки: "${error.message}"`);
      this.newGame();
    }
    GamePlay.showPopup('Игра загружена.');
  }

  onCellClick(index) {
    // TODO: react to click
    const characterInCell = this.gameState.allTypesPositions.find(
      (item) => item.position === index,
    );
    // Выбор и перемещение персонажа
    if (this.activeCharacter) {
      // Снимаем отметку активности
      if (characterInCell && characterInCell === this.activeCharacter) {
        this.gamePlay.deselectCell(this.activeCharacter.position);
        this.activeCharacter = undefined;
        this.gamePlay.redrawPositions(this.gameState.allTypesPositions);
      // Переключение отметки активности м/у персонажами User
      } else if (
        characterInCell
          && String(this.userTypes).includes(characterInCell.character.type)
      ) {
        this.gamePlay.deselectCell(this.activeCharacter.position);
        this.activeCharacter = undefined;
        this.gameState.steps += 1;
        this.gamePlay.redrawPositions(this.gameState.allTypesPositions);
        this.gamePlay.redrawStatistics(
          this.gameState.level,
          this.gameState.steps,
          this.gameState.points,
          this.gameState.bestResult,
        );
        this.gamePlay.selectCell(index);
        this.activeCharacter = characterInCell;
      // Атака
      } else if (
        characterInCell
          && String(this.computerTypes).includes(characterInCell.character.type)
          && GameController.getAllowedAttack(
            this.activeCharacter.character.radiusAttack,
            this.activeCharacter.position,
          ).includes(index)
      ) {
        this.attack(characterInCell, this.activeCharacter, index);
        this.gameState.steps += 1;
        this.gamePlay.redrawStatistics(
          this.gameState.level,
          this.gameState.steps,
          this.gameState.points,
          this.gameState.bestResult,
        );
        this.motion = false;
      // Ход
      } else if (
        !characterInCell
          && GameController.getAllowedMove(
            this.activeCharacter.character.radiusMovement,
            this.activeCharacter.position,
          ).includes(index)
      ) {
        this.gamePlay.deselectCell(this.activeCharacter.position);
        this.activeCharacter.position = index;
        this.gamePlay.deselectCell(index);
        this.gameState.steps += 1;
        this.gamePlay.redrawStatistics(
          this.gameState.level,
          this.gameState.steps,
          this.gameState.points,
          this.gameState.bestResult,
        );
        this.gamePlay.redrawPositions(this.gameState.allTypesPositions);
        this.motion = false;
        this.checkLevel();
      }
    } else if (
      characterInCell
        && String(this.userTypes).includes(characterInCell.character.type)
    ) {
      this.gamePlay.selectCell(index);
      this.activeCharacter = characterInCell;
    } else if (
      characterInCell
        && String(this.computerTypes).includes(characterInCell.character.type)
    ) {
      GamePlay.showPopup('Этот персонаж не из Вашей команды');
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const characterInCell = this.gameState.allTypesPositions.find(
      (item) => item.position === index,
    );
    // Информация о персонаже
    if (characterInCell) {
      const characterInfo = `\u{1F396}${characterInCell.character.level}\u{2694}${characterInCell.character.attack}\u{1F6E1}${characterInCell.character.defence}\u{2764}${characterInCell.character.health}`;
      this.gamePlay.showCellTooltip(characterInfo, index);
    }

    // Активность курсора при не выбранном персонаже
    if (characterInCell) {
      const cursor = String(this.userTypes).includes(characterInCell.character.type)
        ? cursors.pointer : cursors.notallowed;
      this.gamePlay.setCursor(cursor);
    } else {
      this.gamePlay.setCursor(cursors.auto);
    }
    // Активность курсора при выбранном персонаже
    if (this.activeCharacter) {
      if (
        !characterInCell
      && GameController.getAllowedMove(
        this.activeCharacter.character.radiusMovement,
        this.activeCharacter.position,
      ).includes(index)
      ) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      } else if (
        characterInCell
          && String(this.computerTypes).includes(characterInCell.character.type)
          && GameController.getAllowedAttack(
            this.activeCharacter.character.radiusAttack,
            this.activeCharacter.position,
          ).includes(index)
      ) {
        this.gamePlay.selectCell(index, 'red');
        this.gamePlay.setCursor(cursors.crosshair);
      } else
      if (
        !characterInCell
        || (characterInCell && String(this.computerTypes).includes(characterInCell.character.type))
      ) {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    const characterInCell = this.gameState.allTypesPositions.find(
      (item) => item.position === index,
    );
    this.gamePlay.setCursor(cursors.auto);
    // Убираем инфу о персонаже
    if (characterInCell) {
      this.gamePlay.hideCellTooltip(index);
    }

    if (this.activeCharacter) {
      // Убираем подсветку доступного хода
      if (
        !characterInCell
        && GameController.getAllowedMove(
          this.activeCharacter.character.radiusMovement,
          this.activeCharacter.position,
        ).includes(index)
      ) {
        this.gamePlay.deselectCell(index);
      } else if (
        characterInCell
        && String(this.computerTypes).includes(characterInCell.character.type)
        && GameController.getAllowedAttack(
          this.activeCharacter.character.radiusAttack,
          this.activeCharacter.position,
        ).includes(index)
      ) {
      // Убираем подсветку доступной атаки
        this.gamePlay.deselectCell(index);
      }
    }
  }

  teamLocation(teamType, maxLevel, count) {
    const avialiblePositions = [];
    const size = this.gamePlay.boardSize;
    const validSpace = teamType.filter((x) => this.userTypes.includes(x))
      .length !== 0 ? 0 : size - 2;
    for (let i = validSpace; i <= (size ** 2 - 1); i += size) {
      avialiblePositions.push(i, i + 1);
    }
    if (validSpace === 0) {
      this.avialibleUserPositions = [...avialiblePositions];
    }
    const positions = [];
    for (const char of generateTeam(teamType, maxLevel, count).characters) {
      const randomIndex = Math.floor(Math.random() * avialiblePositions.length);
      const selectedPosition = Number(avialiblePositions[randomIndex]);
      avialiblePositions.splice(randomIndex, 1);
      positions.push(new PositionedCharacter(char, selectedPosition));
    }
    return positions;
  }

  static getAllowedMove(radius, index) {
    const allowableSteps = new Set();
    let topCell = index;
    let bottomCell = index;
    let leftCell = index;
    let rightCell = index;

    // Верхнее значение
    while (topCell > (index - radius * 8) && (topCell - 8) >= 0) {
      topCell -= 8;
    }
    // Нижнее значение
    while (bottomCell < (index + radius * 8) && (bottomCell + 8) < 64) {
      bottomCell += 8;
    }
    // Столбец
    for (let i = topCell; i <= bottomCell; i += 8) {
      allowableSteps.add(i);
    }

    // Левое значение
    while (leftCell > index - radius && leftCell % 8 !== 0) {
      leftCell -= 1;
    }
    // Правое значение
    while (rightCell < index + radius && (rightCell + 1) % 8 !== 0) {
      rightCell += 1;
    }
    // Строка
    for (let i = leftCell; i <= rightCell; i += 1) {
      allowableSteps.add(i);
    }

    // Верхняя левая диагональ
    for (let i = index; i >= (index - radius * 9); i -= 9) {
      allowableSteps.add(i);
      if (i % 8 === 0 || (i - 8) < 0) break;
    }
    // Верхняя правая диагональ
    for (let i = index; i >= (index - radius * 7); i -= 7) {
      allowableSteps.add(i);
      if ((i + 1) % 8 === 0 || (i - 7) < 0) break;
    }
    // Нижняя правая диагональ
    for (let i = index; i <= (index + radius * 9); i += 9) {
      allowableSteps.add(i);
      if ((i + 1) % 8 === 0 || (i + 8) > 64) break;
    }
    // Нижняя левая диагональ
    for (let i = index; i <= (index + radius * 7); i += 7) {
      allowableSteps.add(i);
      if (i % 8 === 0 || (i + 7) >= 64) break;
    }

    return [...allowableSteps].filter((num) => num !== index);
  }

  static getAllowedAttack(radius, index) {
    const allowableAttack = new Set();
    let leftCell = index;
    let rightCell = index;
    let startCell = null;

    // Левое значение
    while (leftCell > index - radius && leftCell % 8 !== 0) {
      leftCell -= 1;
    }
    // Правое значение
    while (rightCell < index + radius && (rightCell + 1) % 8 !== 0) {
      rightCell += 1;
    }

    // Общее
    startCell = leftCell;
    while (startCell <= rightCell) {
      let topValues = startCell;
      let bottomValues = startCell;
      allowableAttack.add(startCell);

      // Верхнее значение
      while (topValues > startCell - radius * 8 && topValues - 8 >= 0) {
        topValues -= 8;
        allowableAttack.add(topValues);
      }
      // Нижнее значение
      while (bottomValues < startCell + radius * 8 && bottomValues + 8 < 64) {
        bottomValues += 8;
        allowableAttack.add(bottomValues);
      }
      startCell += 1;
    }
    return [...allowableAttack];
  }

  async attack(attacked, attacker, indexAttacked) {
    // Атаки атакующего персонажа
    const { attack } = attacker.character;
    // Защиты атакуемого
    const { defence } = attacked.character;
    // Атакуемый персонаж
    const attackedUnit = attacked.character;
    // Урон
    const damage = 2 * Math.round(Math.max((attack - defence, attack * 0.1)));
    attackedUnit.health -= damage;
    // Проверка убит ли персонаж
    if (attackedUnit.health <= 0) {
      const array = this.gameState.allTypesPositions.filter(
        (item) => item.position !== indexAttacked,
      );
      this.gameState.allTypesPositions = [];
      this.gameState.allTypesPositions = array;
    }
    if (this.activeCharacter.character.health <= 0) {
      this.activeCharacter = null;
    }
    // Выделяем атакующего и атакуемого героя
    this.gamePlay.selectCell(attacker.position, 'yellow');
    this.gamePlay.selectCell(attacked.position, 'red');
    this.gamePlay.redrawPositions(this.gameState.allTypesPositions);
    // Анимация урона
    await this.gamePlay.showDamage(indexAttacked, damage);
    // Снимаем выделение с атакующего и атакуемого героя
    this.gamePlay.deselectCell(attacker.position);
    this.gamePlay.deselectCell(attacked.position);
    if (attacked.character.health > 0) {
      this.gamePlay.selectCell(this.activeCharacter.position, 'yellow');
    }
    this.checkLevel();
  }

  computerLogic() {
    const userTeam = this.gameState.allTypesPositions.filter(
      (char) => String(this.userTypes).includes(char.character.type),
    );
    const computerTeam = this.gameState.allTypesPositions.filter(
      (char) => String(this.computerTypes).includes(char.character.type),
    );
    // Проверяем возможность атаки
    this.motion = true;
    const attack = computerTeam.some((compChar) => {
      const attacked = userTeam.find(
        (userChar) => GameController.getAllowedAttack(
          compChar.character.radiusAttack,
          compChar.position,
        ).includes(userChar.position),
      );
      if (attacked) {
        this.attack(attacked, compChar, attacked.position);
        return true;
      }
      return false;
    });
    // Ход computer
    if (!attack && computerTeam.length && userTeam.length) {
      const char = Math.floor(Math.random() * computerTeam.length);
      const steps = GameController.getAllowedMove(
        computerTeam[char].position,
        computerTeam[char].character.radiusMovement,
      );
      const step = Math.floor(Math.random() * steps.length);
      computerTeam[char].position = steps[step];
      this.gamePlay.redrawPositions(this.gameState.allTypesPositions);
      this.checkLevel();
    }
  }

  checkLevel() {
    const userValue = this.gameState.allTypesPositions.some(
      (char) => String(this.userTypes).includes(char.character.type),
    );
    const computerValue = this.gameState.allTypesPositions.some(
      (char) => String(this.computerTypes).includes(char.character.type),
    );
    if (userValue && computerValue) {
      if (!this.motion) {
        this.computerLogic();
      }
      return;
    }
    if (!computerValue) {
      this.gameState.points = this.gameState.allTypesPositions.reduce(
        (acc, char) => acc + char.character.health,
        0,
      );
      this.gameState.saveBestResult(this.gameState.points);
      this.nextLevel(this.gameState.level);
    }
    if (!userValue) {
      GamePlay.showPopup('Вы проиграли! Попробуйте еще раз!');
    }
  }

  nextLevel(level) {
    this.gameState.level = level + 1;
    if (this.gameState.level >= 5) {
      // Блокировка поля
      this.gamePlay.cellClickListeners.length = 0;
      GamePlay.showPopup(`Победа! Игра окончена. Счет: ${this.gameState.points}`);
    } else if (this.gameState.level > 1 && this.gameState.level < 5) {
      // Повышаем уровень оставшихся и возвращаем на стартовые места
      const survivors = this.gameState.allTypesPositions;
      for (const char of survivors) {
        char.character.health = char.character.health + 80 >= 100
          ? 100 : char.character.health + 80;
        char.character.attack = Math.floor(
          Math.max(
            char.character.attack,
            char.character.attack * (0.8 + char.character.health / 100),
          ),
        );
        char.position = this.avialibleUserPositions[
          Math.floor(Math.random() * this.avialibleUserPositions.length)
        ];
      }
      // Вышевшие + новые Users
      this.userTeamPositions = [
        ...survivors,
        ...this.teamLocation(this.userTypes, this.gameState.level, 7 - survivors.length),
      ];
      // новая команда компа
      this.computerTeamPositions = this.teamLocation(this.computerTypes, this.gameState.level, 7);
      this.gameState.allTypesPositions = [];
      this.gameState.allTypesPositions = [
        ...this.userTeamPositions,
        ...this.computerTeamPositions,
      ];
      this.gamePlay.drawUi(themes[this.gameState.level]);
      this.gamePlay.redrawStatistics(
        this.gameState.level,
        this.gameState.steps,
        this.gameState.points,
        this.gameState.bestResult,
      );
      this.gamePlay.redrawPositions(this.gameState.allTypesPositions);
      GamePlay.showPopup(`Уровень ${this.gameState.level} Счет: ${this.gameState.points}`);
    }
  }

  static clearLocalStorage(key) {
    localStorage.removeItem(key);
  }
}
