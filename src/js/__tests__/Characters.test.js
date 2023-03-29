import Character from '../Character';
import Bowman from '../characters/bowman';
import Daemon from '../characters/daemon';
import Magician from '../characters/magician';
import Swordsman from '../characters/swordsman';
import Undead from '../characters/undead';
import Vampire from '../characters/vampire';

test.each([
  [Bowman, {
    level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', radiusMovement: 2, radiusAttack: 2,
  }],
  [Magician, {
    level: 1, attack: 10, defence: 40, health: 50, type: 'magician', radiusMovement: 1, radiusAttack: 4,
  }],
  [Swordsman, {
    level: 1, attack: 40, defence: 10, health: 50, type: 'swordsman', radiusMovement: 4, radiusAttack: 1,
  }],
  [Daemon, {
    level: 1, attack: 10, defence: 10, health: 50, type: 'daemon', radiusMovement: 1, radiusAttack: 4,
  }],
  [Undead, {
    level: 1, attack: 40, defence: 10, health: 50, type: 'undead', radiusMovement: 4, radiusAttack: 1,
  }],
  [Vampire, {
    level: 1, attack: 25, defence: 25, health: 50, type: 'vampire', radiusMovement: 2, radiusAttack: 2,
  }],
])('create childs %s Character return $s', (Characters, expected) => {
  const result = new Characters(1);
  expect(result).toEqual(expected);
});

test('new Character error', () => {
  expect(() => new Character(1)).toThrow('You can not create an object of the Character class!');
});
