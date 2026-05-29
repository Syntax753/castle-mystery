import { describe, expect, it } from 'vitest';

import { deriveRoomComposition, parseRoomDecorHint } from '../roomCompositionUtil';
import {
  FURNITURE_BED_URL,
  FURNITURE_BRAZIER_URL,
  FURNITURE_TABLE_URL,
  FURNITURE_WARDROBE_URL,
  TILE_FLOOR_FLAGSTONE_URL,
  TILE_FLOOR_WOOD_URL,
  TILE_WALL_STONE_URL
} from '../tileKitUtil';

describe('roomCompositionUtil.ts', () => {
  describe('parseRoomDecorHint()', () => {
    it('returns null when no decor keys are present', () => {
      expect(parseRoomDecorHint({})).toBeNull();
    });

    it('parses wall, floor and a pipe-separated furniture list', () => {
      expect(parseRoomDecorHint({ wall:'stone', floor:'wood', furniture:'bed | window' }))
        .toEqual({ wall:'stone', floor:'wood', furniture:['bed', 'window'] });
    });

    it('keeps a hint with only a furniture list', () => {
      expect(parseRoomDecorHint({ furniture:'table' })).toEqual({ wall:null, floor:null, furniture:['table'] });
    });
  });

  describe('deriveRoomComposition()', () => {
    it('defaults to stone wall and flagstone floor', () => {
      const composition = deriveRoomComposition('Stairwell', null);
      expect(composition.wallTileUrl).toBe(TILE_WALL_STONE_URL);
      expect(composition.floorTileUrl).toBe(TILE_FLOOR_FLAGSTONE_URL);
    });

    it('chooses furniture from title keywords (case-insensitive)', () => {
      const composition = deriveRoomComposition('KITCHEN', null);
      const urls = composition.furniture.map(furniture => furniture.url);
      expect(urls).toContain(FURNITURE_TABLE_URL);
      expect(urls).toContain(FURNITURE_BRAZIER_URL);
    });

    it('gives a bedroom a wooden floor and a corner wardrobe', () => {
      const composition = deriveRoomComposition('Bedchamber', null);
      expect(composition.floorTileUrl).toBe(TILE_FLOOR_WOOD_URL);
      const wardrobe = composition.furniture.find(furniture => furniture.url === FURNITURE_WARDROBE_URL);
      expect(wardrobe).toBeDefined();
      expect(wardrobe?.surface).toBe('floor');
      expect(wardrobe?.xFraction).toBeLessThan(0.5);
    });

    it('lets an authored hint override title-derived defaults', () => {
      const composition = deriveRoomComposition('Kitchen', { wall:'stone', floor:'wood', furniture:['bed'] });
      expect(composition.floorTileUrl).toBe(TILE_FLOOR_WOOD_URL);
      expect(composition.furniture.map(furniture => furniture.url)).toEqual([FURNITURE_BED_URL]);
    });

    it('ignores unknown furniture names in a hint', () => {
      const composition = deriveRoomComposition('Hallway', { wall:null, floor:null, furniture:['dragon', 'bed'] });
      expect(composition.furniture.map(furniture => furniture.url)).toEqual([FURNITURE_BED_URL]);
    });

    it('spreads floor pieces across the room width and over a range of depth rows', () => {
      const composition = deriveRoomComposition('Kitchen', null);
      const floorPieces = composition.furniture.filter(furniture => furniture.surface === 'floor');
      expect(floorPieces.length).toBeGreaterThanOrEqual(3);
      expect(floorPieces[0].xFraction).toBeLessThan(0.25);
      expect(floorPieces[floorPieces.length - 1].xFraction).toBeGreaterThan(0.75);
      expect(new Set(floorPieces.map(piece => piece.depthFraction)).size).toBeGreaterThan(1);
    });
  });
});
