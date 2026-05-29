/* Pure screen-space geometry for the side-view rooms: splits a room into a far-wall band (upper) and a
   floor band (lower) in canvas pixels, and counts the tiles needed to cover a band. The floor's 2D
   depth grid lives in the game model (roomUtil); characters/items already carry their grid-cell game
   position, so this module only handles the bands used for tiling and the floor grid overlay. */

import { gameToCanvasPosition } from "./drawUtil";
import { FLOOR_BAND_HEIGHT_RATIO, GRID_DEPTH_ROWS } from "../roomUtil";
import Room from "../types/Room";
import ScalingFactors from "../types/ScalingFactors";

export { FLOOR_BAND_HEIGHT_RATIO, GRID_DEPTH_ROWS };

export type CanvasBand = { x:number, y:number, width:number, height:number };

export type RoomSideViewBands = {
  roomLeft:number,
  roomTop:number,
  roomRight:number,
  roomBottom:number,
  floorTopY:number,
  wallBand:CanvasBand,
  floorBand:CanvasBand
};

export function calcRoomSideViewBands(room:Room, scalingFactors:ScalingFactors):RoomSideViewBands {
  const [roomLeft, roomTop] = gameToCanvasPosition(room.rect.x, room.rect.y, scalingFactors);
  const [roomRight, roomBottom] = gameToCanvasPosition(room.rect.x + room.rect.width, room.rect.y + room.rect.height, scalingFactors);
  const roomWidth = roomRight - roomLeft;
  const roomHeight = roomBottom - roomTop;
  const floorHeight = roomHeight * FLOOR_BAND_HEIGHT_RATIO;
  const floorTopY = roomBottom - floorHeight;
  return {
    roomLeft,
    roomTop,
    roomRight,
    roomBottom,
    floorTopY,
    wallBand:{ x:roomLeft, y:roomTop, width:roomWidth, height:floorTopY - roomTop },
    floorBand:{ x:roomLeft, y:floorTopY, width:roomWidth, height:floorHeight }
  };
}

export function calcTileGrid(band:CanvasBand, tilePx:number):{ cols:number, rows:number, tilePx:number } {
  const safeTilePx = Math.max(1, tilePx);
  return {
    cols:Math.max(1, Math.ceil(band.width / safeTilePx)),
    rows:Math.max(1, Math.ceil(band.height / safeTilePx)),
    tilePx:safeTilePx
  };
}
