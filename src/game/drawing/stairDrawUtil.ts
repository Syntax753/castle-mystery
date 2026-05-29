/* This module draws staircases for the side-view rooms as discrete stepped blocks (one filled block per
   step), mimicking the original stairs. The background between/under the steps is left transparent so
   the floor tiles show through. Stair navigation logic lives in stairFlightUtil/stairUtil. */

import { COLOR_BLACK } from "./drawConstants";
import { gameToCanvasPosition } from "./drawUtil";
import { FLOOR_WAYPOINT_Y_OFFSET } from "../roomUtil";
import { STAIR_POSITION_TOLERANCE } from "../stairUtil";
import Position from "../types/Position";
import Room from "../types/Room";
import ScalingFactors from "../types/ScalingFactors";

const PREFERRED_STEP_RISE_RUN = 1;
const STAIRS_LINE_WIDTH_MULTIPLIER = 0.2;
const STAIR_ANGLE_TOLERANCE = FLOOR_WAYPOINT_Y_OFFSET + STAIR_POSITION_TOLERANCE;
const STAIR_FILL = "rgb(154, 154, 154)";

function _calcStairStepCount(totalDistance:number):number {
  return Math.max(1, Math.round(totalDistance / PREFERRED_STEP_RISE_RUN));
}

function _applyStairStrokeStyle(scalingFactors:ScalingFactors, context:CanvasRenderingContext2D) {
  context.strokeStyle = COLOR_BLACK;
  context.lineWidth = Math.max(1, scalingFactors.roomLineWidth * STAIRS_LINE_WIDTH_MULTIPLIER);
}

function _snapFlightTo45DegreesForDrawing(fromPosition:Position, toPosition:Position):{ fromPosition:Position, toPosition:Position } {
  const totalRise = toPosition.y - fromPosition.y;
  const totalRun = toPosition.x - fromPosition.x;
  const riseMagnitude = Math.abs(totalRise);
  const runMagnitude = Math.abs(totalRun);
  if (Math.abs(riseMagnitude - runMagnitude) > STAIR_ANGLE_TOLERANCE) return { fromPosition, toPosition };
  return {
    fromPosition,
    toPosition:{ x:toPosition.x, y:fromPosition.y + Math.sign(totalRise) * runMagnitude }
  };
}

function _drawSideViewStaircase(fromPosition:Position, toPosition:Position, scalingFactors:ScalingFactors, context:CanvasRenderingContext2D) {
  const snappedFlight = _snapFlightTo45DegreesForDrawing(fromPosition, toPosition);
  const totalRise = snappedFlight.toPosition.y - snappedFlight.fromPosition.y;
  const totalRun = snappedFlight.toPosition.x - snappedFlight.fromPosition.x;
  const stepCount = _calcStairStepCount(Math.max(Math.abs(totalRise), Math.abs(totalRun)));
  const stepRise = totalRise / stepCount;
  const stepRun = totalRun / stepCount;

  context.fillStyle = STAIR_FILL;
  _applyStairStrokeStyle(scalingFactors, context);
  let currentX = snappedFlight.fromPosition.x;
  let currentY = snappedFlight.fromPosition.y;
  for (let i = 0; i < stepCount; ++i) {
    const nextX = currentX + stepRun;
    const nextY = currentY + stepRise;
    const [left, top] = gameToCanvasPosition(Math.min(currentX, nextX), Math.min(currentY, nextY), scalingFactors);
    const [right, bottom] = gameToCanvasPosition(Math.max(currentX, nextX), Math.max(currentY, nextY), scalingFactors);
    context.fillRect(left, top, right - left, bottom - top);
    context.strokeRect(left, top, right - left, bottom - top);
    currentX = nextX;
    currentY = nextY;
  }
}

export function drawRoomStairs(room:Room, scalingFactors:ScalingFactors, context:CanvasRenderingContext2D) {
  room.stairs.forEach(flight => _drawSideViewStaircase(flight.startPosition, flight.endPosition, scalingFactors, context));
}
