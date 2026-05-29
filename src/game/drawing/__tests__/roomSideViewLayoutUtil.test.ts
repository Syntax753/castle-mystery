import { describe, expect, it } from 'vitest';

import Room from '../../types/Room';
import ScalingFactors from '../../types/ScalingFactors';
import { calcRoomSideViewBands, calcTileGrid, FLOOR_BAND_HEIGHT_RATIO } from '../roomSideViewLayoutUtil';

const IDENTITY_SCALING:ScalingFactors = {
  sourceX:0, sourceY:0, sourceWidth:100, sourceHeight:100,
  scaleX:1, translateX:0, scaleY:1, translateY:0,
  roomFontHeight:10, roomLineWidth:2, destWidth:100, destHeight:100
};

function makeRoom(x:number, y:number, width:number, height:number):Room {
  return { id:'r', title:'Room', rect:{ x, y, width, height }, isObscured:false,
    items:[], exits:[], stairs:[], waypoints:[], isDiscovered:true };
}

describe('roomSideViewLayoutUtil.ts', () => {
  describe('calcRoomSideViewBands()', () => {
    it('splits the room into wall and floor bands that cover the full height', () => {
      const bands = calcRoomSideViewBands(makeRoom(0, 0, 100, 100), IDENTITY_SCALING);
      expect(bands.roomTop).toBe(0);
      expect(bands.roomBottom).toBe(100);
      expect(bands.floorBand.height).toBeCloseTo(100 * FLOOR_BAND_HEIGHT_RATIO);
      expect(bands.wallBand.height + bands.floorBand.height).toBeCloseTo(100);
      expect(bands.floorTopY).toBeCloseTo(bands.wallBand.y + bands.wallBand.height);
      expect(bands.floorBand.y).toBeCloseTo(bands.floorTopY);
    });

    it('honors translation and scaling when placing the bands', () => {
      const scaling:ScalingFactors = { ...IDENTITY_SCALING, scaleX:2, scaleY:2, translateX:10, translateY:20 };
      const bands = calcRoomSideViewBands(makeRoom(5, 5, 20, 20), scaling);
      expect(bands.roomLeft).toBe(5 * 2 + 10);
      expect(bands.roomTop).toBe(5 * 2 + 20);
      expect(bands.roomRight).toBe(25 * 2 + 10);
      expect(bands.roomBottom).toBe(25 * 2 + 20);
    });
  });

  describe('calcTileGrid()', () => {
    it('counts the tiles needed to cover a band, rounding up', () => {
      const grid = calcTileGrid({ x:0, y:0, width:100, height:34 }, 17);
      expect(grid.cols).toBe(6);
      expect(grid.rows).toBe(2);
      expect(grid.tilePx).toBe(17);
    });

    it('never returns fewer than one tile or a zero tile size', () => {
      const grid = calcTileGrid({ x:0, y:0, width:0, height:0 }, 0);
      expect(grid.cols).toBe(1);
      expect(grid.rows).toBe(1);
      expect(grid.tilePx).toBe(1);
    });
  });
});
