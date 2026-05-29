// Validates the authored "And Then There Were None" level loads exactly as the app loads it.
import { describe, expect, it } from 'vitest';

import levelText from '../../../public/levels/and-then-there-were-none.md?raw';
import { loadLevelFromText } from '../levelUtil';

describe('and-then-there-were-none level', () => {
  it('loads all rooms, characters, and a validated solution without errors', () => {
    const level = loadLevelFromText(levelText, 'and-then-there-were-none.md', { validateUnlockPhrases:true });
    expect(level.rooms).toHaveLength(9);
    expect(level.characters).toHaveLength(10);
    expect(level.characters.map(character => character.title)).toEqual(
      expect.arrayContaining(['Justice Wargrave', 'Vera Claythorne', 'Philip Lombard', 'Thomas Rogers', 'Ethel Rogers'])
    );
    // authored "The Hidden Judge" solution + the generated identities solution
    expect(level.solutions.length).toBeGreaterThanOrEqual(1);
  });
});
