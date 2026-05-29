import { describe, expect, it } from 'vitest';

import { loadLevelFromText } from '../levelUtil';

const LEVEL_WITH_DECOR_HINTS = [
  '# general',
  '* activeCharacter=Hero',
  '',
  '# map',
  '```',
  'AB',
  '```',
  '* A=Library',
  '* B=Hall',
  '',
  '# rooms',
  '',
  '## Library',
  '',
  '```',
  '....',
  '.H..',
  '....',
  '```',
  '',
  '* H=Hero',
  '* wall=stone',
  '* floor=wood',
  '* furniture=bed | window',
  '* exits=Hall',
  '',
  '## Hall',
  '',
  '# characters',
  '',
  '## Hero',
  '',
  '* description=A brave soul.'
].join('\n');

describe('room decor hints', () => {
  it('parses wall/floor/furniture hints into Room.decorHint without colliding with the room grid legend', () => {
    const level = loadLevelFromText(LEVEL_WITH_DECOR_HINTS);
    const library = level.rooms.find(room => room.id === 'library');
    expect(library?.decorHint).toEqual({ wall:'stone', floor:'wood', furniture:['bed', 'window'] });
  });

  it('leaves decorHint absent for rooms without decor hints', () => {
    const level = loadLevelFromText(LEVEL_WITH_DECOR_HINTS);
    const hall = level.rooms.find(room => room.id === 'hall');
    expect(hall?.decorHint ?? null).toBeNull();
  });
});
