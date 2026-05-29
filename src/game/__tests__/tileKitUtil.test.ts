import { describe, expect, it } from 'vitest';

import { BUILT_IN_TILE_URLS, TILE_WALL_STONE_URL, TILE_FLOOR_FLAGSTONE_URL } from '../tileKitUtil';

describe('tileKitUtil.ts', () => {
  describe('BUILT_IN_TILE_URLS', () => {
    it('lists every tile under the medieval tile directory as an svg', () => {
      BUILT_IN_TILE_URLS.forEach(tileUrl => {
        expect(tileUrl.startsWith('/tiles/medieval/')).toBe(true);
        expect(tileUrl.endsWith('.svg')).toBe(true);
      });
    });

    it('contains no duplicate URLs', () => {
      expect(new Set(BUILT_IN_TILE_URLS).size).toBe(BUILT_IN_TILE_URLS.length);
    });

    it('includes the default wall and floor surfaces', () => {
      expect(BUILT_IN_TILE_URLS).toContain(TILE_WALL_STONE_URL);
      expect(BUILT_IN_TILE_URLS).toContain(TILE_FLOOR_FLAGSTONE_URL);
    });
  });
});
