/* v8 ignore file -- @preserve visual canvas drawing module with low contract-test value. */
/* Draws a room as a pure side-view (elevation) medieval chamber: a tiled far wall, a tiled floor, and
   furniture/fixtures placed from the room's RoomComposition. All geometry comes from
   roomSideViewLayoutUtil so drawing and hit-testing stay consistent. */

import { COLOR_BLACK } from "./drawConstants";
import { CanvasBand, calcRoomSideViewBands, calcTileGrid, GRID_DEPTH_ROWS, RoomSideViewBands } from "./roomSideViewLayoutUtil";
import { roomWidthToColumnCount } from "../roomUtil";
import { gameToCanvasPosition } from "./drawUtil";
import { RoomComposition, RoomFurniturePlacement } from "../roomCompositionUtil";
import ImageSet from "../types/ImageSet";
import Room from "../types/Room";
import ScalingFactors from "../types/ScalingFactors";

const WALL_TILES_HIGH = 4;
const FLOOR_TILES_HIGH = 2;
const MIN_TILE_PIXELS = 8;
const WALL_FALLBACK_COLOR = "#6b6b66";
const FLOOR_FALLBACK_COLOR = "#9a9082";
const FURNITURE_FALLBACK_COLOR = "#6b4423";
const FURNITURE_FLOOR_HEIGHT_RATIO = 0.34;
const FLOOR_FURNITURE_DEFAULT_ASPECT = 0.7;
const FIXTURE_WALL_HEIGHT_RATIO = 0.6;
const FIXTURE_WALL_TOP_RATIO = 0.18;
const FIXTURE_DEFAULT_ASPECT = 0.5;
const DIVIDER_LINE_WIDTH_RATIO = 0.5;
const GRID_LINE_COLOR = "rgba(20,16,10,0.22)";
const GRID_LINE_WIDTH_RATIO = 0.25;
const FURNITURE_BACK_SCALE = 0.72;
const DEPTH_DOOR_DARK = "rgba(12,10,8,0.94)";
const DEPTH_DOOR_RECESS_TOP_SHADE = "rgba(0,0,0,0.55)";
const DEPTH_DOOR_RECESS_BOTTOM_SHADE = "rgba(0,0,0,0.1)";
const BACK_DOOR_HEIGHT_RATIO = 0.98;
const BACK_DOOR_WIDTH_FRAC = 0.6;
const FRONT_DOOR_HEIGHT_RATIO = 0.72;
const FRONT_DOOR_ASPECT = 0.95;
const DEPTH_DOOR_OUTLINE_RATIO = 0.5;
const DEPTH_DOOR_SHOULDER_RATIO = 0.3;

function _drawTiledBand(band:CanvasBand, tileUrl:string, tilePx:number, imageSet:ImageSet, fallbackColor:string, context:CanvasRenderingContext2D) {
  context.save();
  context.beginPath();
  context.rect(band.x, band.y, band.width, band.height);
  context.clip();
  const bitmap = imageSet.get(tileUrl) || null;
  if (!bitmap || !bitmap.width || !bitmap.height) {
    context.fillStyle = fallbackColor;
    context.fillRect(band.x, band.y, band.width, band.height);
    context.restore();
    return;
  }
  const grid = calcTileGrid(band, tilePx);
  for (let row = 0; row < grid.rows; ++row) {
    for (let col = 0; col < grid.cols; ++col) {
      context.drawImage(bitmap, band.x + col * grid.tilePx, band.y + row * grid.tilePx, grid.tilePx, grid.tilePx);
    }
  }
  context.restore();
}

function _drawWallFixture(bands:RoomSideViewBands, centerX:number, bitmap:ImageBitmap|null, context:CanvasRenderingContext2D) {
  const height = bands.wallBand.height * FIXTURE_WALL_HEIGHT_RATIO;
  const aspect = bitmap && bitmap.height ? bitmap.width / bitmap.height : FIXTURE_DEFAULT_ASPECT;
  const width = height * aspect;
  const top = bands.wallBand.y + bands.wallBand.height * FIXTURE_WALL_TOP_RATIO;
  if (bitmap) { context.drawImage(bitmap, centerX - width / 2, top, width, height); return; }
  context.fillStyle = FURNITURE_FALLBACK_COLOR;
  context.fillRect(centerX - width / 2, top, width, height);
}

function _drawFloorFurniture(bands:RoomSideViewBands, centerX:number, depthFraction:number, bitmap:ImageBitmap|null, context:CanvasRenderingContext2D) {
  const depthScale = FURNITURE_BACK_SCALE + (1 - FURNITURE_BACK_SCALE) * depthFraction;
  const height = (bands.roomBottom - bands.roomTop) * FURNITURE_FLOOR_HEIGHT_RATIO * depthScale;
  const aspect = bitmap && bitmap.height ? bitmap.width / bitmap.height : FLOOR_FURNITURE_DEFAULT_ASPECT;
  const width = height * aspect;
  const baseY = bands.floorTopY + bands.floorBand.height * depthFraction;
  if (bitmap) { context.drawImage(bitmap, centerX - width / 2, baseY - height, width, height); return; }
  context.fillStyle = FURNITURE_FALLBACK_COLOR;
  context.fillRect(centerX - width / 2, baseY - height, width, height);
}

function _drawFurniturePlacement(bands:RoomSideViewBands, placement:RoomFurniturePlacement, imageSet:ImageSet, context:CanvasRenderingContext2D) {
  const centerX = bands.roomLeft + placement.xFraction * (bands.roomRight - bands.roomLeft);
  const bitmap = imageSet.get(placement.url) || null;
  if (placement.surface === 'wall') { _drawWallFixture(bands, centerX, bitmap, context); return; }
  _drawFloorFurniture(bands, centerX, placement.depthFraction, bitmap, context);
}

function _drawFloorGrid(room:Room, bands:RoomSideViewBands, scalingFactors:ScalingFactors, context:CanvasRenderingContext2D) {
  context.save();
  context.strokeStyle = GRID_LINE_COLOR;
  context.lineWidth = Math.max(0.5, scalingFactors.roomLineWidth * GRID_LINE_WIDTH_RATIO);
  context.beginPath();
  for (let row = 1; row < GRID_DEPTH_ROWS; ++row) {
    const y = bands.floorTopY + (row / GRID_DEPTH_ROWS) * bands.floorBand.height;
    context.moveTo(bands.roomLeft, y);
    context.lineTo(bands.roomRight, y);
  }
  const columnCount = roomWidthToColumnCount(room.rect.width);
  for (let column = 1; column < columnCount; ++column) {
    const x = bands.roomLeft + (column / columnCount) * (bands.roomRight - bands.roomLeft);
    context.moveTo(x, bands.floorTopY);
    context.lineTo(x, bands.roomBottom);
  }
  context.stroke();
  context.restore();
}

function _traceDepthDoorArch(centerX:number, bottom:number, height:number, width:number, context:CanvasRenderingContext2D) {
  const left = centerX - width / 2;
  const right = centerX + width / 2;
  const top = bottom - height;
  const shoulderY = top + height * DEPTH_DOOR_SHOULDER_RATIO;
  context.beginPath();
  context.moveTo(left, bottom);
  context.lineTo(left, shoulderY);
  context.quadraticCurveTo(left, top, centerX, top);
  context.quadraticCurveTo(right, top, right, shoulderY);
  context.lineTo(right, bottom);
  context.closePath();
}

// A depth exit goes INTO the screen, so it is just a dark recessed opening in the wall — never a window
// into the neighbouring room (no foreign floor, no other room rendered in depth).
function _drawDepthDoors(room:Room, bands:RoomSideViewBands, scalingFactors:ScalingFactors, context:CanvasRenderingContext2D) {
  room.exits.forEach(exit => {
    if (!exit.isDepthExit) return;
    const [centerX] = gameToCanvasPosition(exit.x, room.rect.y, scalingFactors);
    const isBackWall = Math.abs(exit.y - room.rect.y) <= Math.abs(exit.y - (room.rect.y + room.rect.height));
    const height = isBackWall
      ? bands.wallBand.height * BACK_DOOR_HEIGHT_RATIO
      : bands.floorBand.height * FRONT_DOOR_HEIGHT_RATIO;
    const width = isBackWall
      ? (bands.roomRight - bands.roomLeft) * BACK_DOOR_WIDTH_FRAC
      : height * FRONT_DOOR_ASPECT;
    const bottom = isBackWall ? bands.floorTopY : bands.roomBottom;
    const top = bottom - height;
    context.save();
    _traceDepthDoorArch(centerX, bottom, height, width, context);
    context.clip();
    context.fillStyle = DEPTH_DOOR_DARK;
    context.fillRect(centerX - width / 2, top, width, height);
    const recess = context.createLinearGradient(0, top, 0, bottom);
    recess.addColorStop(0, DEPTH_DOOR_RECESS_TOP_SHADE);
    recess.addColorStop(1, DEPTH_DOOR_RECESS_BOTTOM_SHADE);
    context.fillStyle = recess;
    context.fillRect(centerX - width / 2, top, width, height);
    context.restore();
    context.strokeStyle = COLOR_BLACK;
    context.lineWidth = Math.max(1, scalingFactors.roomLineWidth * DEPTH_DOOR_OUTLINE_RATIO);
    _traceDepthDoorArch(centerX, bottom, height, width, context);
    context.stroke();
  });
}

export function drawRoomSideView(room:Room, scalingFactors:ScalingFactors, context:CanvasRenderingContext2D,
  imageSet:ImageSet, composition:RoomComposition) {
  const bands = calcRoomSideViewBands(room, scalingFactors);
  const wallTilePx = Math.max(MIN_TILE_PIXELS, bands.wallBand.height / WALL_TILES_HIGH);
  const floorTilePx = Math.max(MIN_TILE_PIXELS, bands.floorBand.height / FLOOR_TILES_HIGH);
  _drawTiledBand(bands.wallBand, composition.wallTileUrl, wallTilePx, imageSet, WALL_FALLBACK_COLOR, context);
  _drawTiledBand(bands.floorBand, composition.floorTileUrl, floorTilePx, imageSet, FLOOR_FALLBACK_COLOR, context);
  _drawFloorGrid(room, bands, scalingFactors, context);
  context.strokeStyle = COLOR_BLACK;
  context.lineWidth = Math.max(1, scalingFactors.roomLineWidth * DIVIDER_LINE_WIDTH_RATIO);
  context.beginPath();
  context.moveTo(bands.roomLeft, bands.floorTopY);
  context.lineTo(bands.roomRight, bands.floorTopY);
  context.stroke();
  _drawDepthDoors(room, bands, scalingFactors, context);
  [...composition.furniture]
    .sort((placement1, placement2) => placement1.depthFraction - placement2.depthFraction)
    .forEach(placement => _drawFurniturePlacement(bands, placement, imageSet, context));
}
