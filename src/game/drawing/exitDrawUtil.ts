/* This module groups exit/door drawing helpers, drawn as flat front-elevation arched doors on a room's
   side wall, plus exit hover hit-testing and popovers. */

import { describeExit } from "../exitUtil";
import Item from "../types/Item";
import ExitType from "../types/ExitType";
import Rect from "../types/Rect";
import Room from "../types/Room";
import RoomExit from "../types/RoomExit";
import ScalingFactors from "../types/ScalingFactors";
import { COLOR_BLACK } from "./drawConstants";
import { canvasToGamePosition, gameToCanvasPosition } from "./drawUtil";
import { drawTextPopover } from "./popoverDrawUtil";

const DOOR_WIDTH_SCALE = 6.75;
const DOOR_HEIGHT_SCALE = DOOR_WIDTH_SCALE * 548 / 313;
const DOOR_ARCH_HEIGHT_RATIO = 0.35;
const DOOR_FILL_BROWN = "#766850";
const DOOR_OUTLINE_WIDTH_RATIO = 0.5;
const KEYHOLE_RADIUS_RATIO = 0.06;
const KEYHOLE_STEM_HALF_WIDTH_RATIO = 0.5;
const KEYHOLE_STEM_HEIGHT_RATIO = 0.13;
const KEYHOLE_CENTER_HEIGHT_RATIO = 0.48;

function _getExitDrawHeightPixels(roomLineWidth:number):number {
  return roomLineWidth * DOOR_HEIGHT_SCALE;
}

export function getExitCanvasRect(exit:Pick<RoomExit, 'x' | 'y'>, scalingFactors:ScalingFactors):Rect {
  const { roomLineWidth } = scalingFactors;
  const [exitX, exitY] = gameToCanvasPosition(exit.x, exit.y, scalingFactors);
  const width = roomLineWidth * DOOR_WIDTH_SCALE;
  const height = _getExitDrawHeightPixels(roomLineWidth);
  return { x:exitX - width / 2, y:exitY - height, width, height };
}

function _findDoorFillColor(exitType:ExitType):string {
  return exitType === ExitType.doorway ? "#fff" : DOOR_FILL_BROWN;
}

function _traceDoorArchPath(left:number, right:number, bottom:number, top:number, context:CanvasRenderingContext2D) {
  const centerX = (left + right) / 2;
  const shoulderY = top + (bottom - top) * DOOR_ARCH_HEIGHT_RATIO;
  context.beginPath();
  context.moveTo(left, bottom);
  context.lineTo(left, shoulderY);
  context.quadraticCurveTo(left, top, centerX, top);
  context.quadraticCurveTo(right, top, right, shoulderY);
  context.lineTo(right, bottom);
  context.closePath();
}

function _drawDoorKeyhole(centerX:number, doorBottomY:number, doorHeight:number, context:CanvasRenderingContext2D) {
  const radius = doorHeight * KEYHOLE_RADIUS_RATIO;
  const centerY = doorBottomY - doorHeight * KEYHOLE_CENTER_HEIGHT_RATIO;
  context.fillStyle = COLOR_BLACK;
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.fill();
  context.fillRect(centerX - radius * KEYHOLE_STEM_HALF_WIDTH_RATIO, centerY, radius * KEYHOLE_STEM_HALF_WIDTH_RATIO * 2, doorHeight * KEYHOLE_STEM_HEIGHT_RATIO);
}

export function drawTemporaryRightWallDoorVectorOverlay(_room:Room, exit:RoomExit, displayedExitType:ExitType, scalingFactors:ScalingFactors,
  context:CanvasRenderingContext2D, doorHeightPixels:number) {
  const [exitCanvasX, exitCanvasY] = gameToCanvasPosition(exit.x, exit.y, scalingFactors);
  const width = scalingFactors.roomLineWidth * DOOR_WIDTH_SCALE;
  const left = exitCanvasX - width / 2;
  const right = exitCanvasX + width / 2;
  const bottom = exitCanvasY;
  const top = exitCanvasY - doorHeightPixels;

  context.fillStyle = _findDoorFillColor(displayedExitType);
  _traceDoorArchPath(left, right, bottom, top, context);
  context.fill();

  context.strokeStyle = COLOR_BLACK;
  context.lineWidth = scalingFactors.roomLineWidth * DOOR_OUTLINE_WIDTH_RATIO;
  _traceDoorArchPath(left, right, bottom, top, context);
  context.stroke();

  if (displayedExitType === ExitType.lockableDoor) _drawDoorKeyhole(exitCanvasX, bottom, doorHeightPixels, context);
}

export function getExitHoverRect(exit:RoomExit, scalingFactors:ScalingFactors):Rect {
  const canvasRect = getExitCanvasRect(exit, scalingFactors);
  const [left, top] = canvasToGamePosition(canvasRect.x, canvasRect.y, scalingFactors);
  const [right, bottom] = canvasToGamePosition(canvasRect.x + canvasRect.width, canvasRect.y + canvasRect.height, scalingFactors);
  return { x:left, y:top, width:right - left, height:bottom - top };
}

export function drawExitPopover(exit:RoomExit, room1:Room, room2:Room, itemsById:ReadonlyMap<string, Item>,
  scalingFactors:ScalingFactors, context:CanvasRenderingContext2D) {
  const canvasRect = getExitCanvasRect(exit, scalingFactors);
  const anchorX = canvasRect.x + canvasRect.width / 2;
  const anchorY = canvasRect.y;
  drawTextPopover({ anchorX, anchorY, bodyTexts:[describeExit(exit, room1, room2, itemsById)], scalingFactors, context });
}
