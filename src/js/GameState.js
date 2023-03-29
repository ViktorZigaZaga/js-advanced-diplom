export default class GameState {
  static from(object) {
    // TODO: create object
    const {
      level,
      steps,
      points,
      bestResult,
      allTypesPositions,
    } = object;
    return new GameState(level, steps, points, bestResult, allTypesPositions);
  }

  constructor(level, steps, points, bestResult, allTypesPositions) {
    this.level = level;
    this.steps = steps;
    this.points = points;
    this.bestResult = bestResult;
    this.allTypesPositions = allTypesPositions;
  }

  saveBestResult(points) {
    if (points > this.bestResult) {
      this.bestResult = points;
    }
  }
}
