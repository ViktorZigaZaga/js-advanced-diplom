import { generateTeam } from '../generators';
import Bowman from '../characters/bowman';
import Magician from '../characters/magician';
import Swordsman from '../characters/swordsman';

const allowedTypes = [Swordsman, Bowman, Magician];

test('generateTeam must create characters in the right amount and with certain levels', () => {
  const team1 = generateTeam(allowedTypes, 4, 15);
  expect(team1.characters.length).toBe(15);
  expect(team1).not.toContain({ level: 5 });
});
