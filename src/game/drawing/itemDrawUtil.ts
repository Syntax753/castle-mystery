/* v8 ignore file -- @preserve visual canvas drawing module with low contract-test value. */
/* This module groups item-focused drawing helpers, including item boxes, labels, hover hit-testing,
   and item popovers. Items are drawn as flat front-elevation boxes standing on the room floor; their
   foot position and the floor band come from roomSideViewLayoutUtil so drawing and hit-testing agree. */

import { roomWidthToColumnCount } from "../roomUtil";
import Rect from "../types/Rect";
import { canvasToGamePosition, gameToCanvasPosition } from "./drawUtil";
import { COLOR_BLACK } from "./drawConstants";
import Item from "../types/Item";
import Room from "../types/Room";
import ScalingFactors from "../types/ScalingFactors";
import Effect from "../effects/types/Effect";
import EffectType from "../effects/types/EffectType";
import { drawTextPopover } from "./popoverDrawUtil";

const ITEM_LABEL_FONT_RATIO = 0.55;
const ITEM_FILL_COLOR = "#c58b57";
const ITEM_BOX_WIDTH_RATIO = 0.6;
const ITEM_BOX_HEIGHT_RATIO = 0.62;
const ITEM_LINE_WIDTH_RATIO = 0.25;
const ITEM_LID_RATIO = 0.34;
const ITEM_CLASP_WIDTH_RATIO = 0.16;
const ITEM_CLASP_HEIGHT_RATIO = 0.22;

// Field names are retained (cuboid*) for compatibility with the item-animation effects that build and
// pass these metrics; in the side view they describe a flat box rather than an oblique cuboid.
type ItemDrawMetrics = {
  cuboidWidthPixels:number,
  cuboidHeightPixels:number,
  cuboidDepthXPixels:number,
  cuboidDepthYPixels:number,
  cuboidLineWidthPixels:number,
  labelFontSize:number,
  labelOffsetY:number
}

type RoomItemVisibilityOptions = {
  includeUndiscovered?:boolean,
  ignoreRoomObscured?:boolean
}

function _getItemLabelFontSize(scalingFactors:ScalingFactors):number {
  return Math.max(7, Math.round(scalingFactors.roomFontHeight * ITEM_LABEL_FONT_RATIO));
}

export function calcItemDrawMetrics(room:Room, scalingFactors:ScalingFactors):ItemDrawMetrics {
  const columnWidthGame = room.rect.width / roomWidthToColumnCount(room.rect.width);
  const columnWidthPixels = columnWidthGame * scalingFactors.scaleX;
  const boxWidthPixels = Math.max(4, columnWidthPixels * ITEM_BOX_WIDTH_RATIO);
  const boxHeightPixels = Math.max(4, boxWidthPixels * ITEM_BOX_HEIGHT_RATIO);
  const labelFontSize = _getItemLabelFontSize(scalingFactors);
  return {
    cuboidWidthPixels:boxWidthPixels,
    cuboidHeightPixels:boxHeightPixels,
    cuboidDepthXPixels:Math.max(2, scalingFactors.roomLineWidth),
    cuboidDepthYPixels:Math.max(1, scalingFactors.roomLineWidth * 0.5),
    cuboidLineWidthPixels:Math.max(0.5, scalingFactors.roomLineWidth * ITEM_LINE_WIDTH_RATIO),
    labelFontSize,
    labelOffsetY:-(boxHeightPixels + labelFontSize * 0.8)
  };
}

function _getApproxTextWidth(text:string, fontSize:number):number {
  return Math.max(fontSize, text.length * fontSize * 0.6);
}

export function getItemCanvasPosition(item:Item, scalingFactors:ScalingFactors):[number, number] {
  return gameToCanvasPosition(item.position.x, item.position.y, scalingFactors);
}

export function getItemCanvasPositionInRoom(_room:Room, item:Item, scalingFactors:ScalingFactors):[number, number] {
  // item.position.y encodes the floor grid cell, so the foot is just the projected position.
  return gameToCanvasPosition(item.position.x, item.position.y, scalingFactors);
}

function _getItemHoverRect(room:Room, item:Item, scalingFactors:ScalingFactors):Rect {
  const metrics = calcItemDrawMetrics(room, scalingFactors);
  const [footX, footY] = getItemCanvasPositionInRoom(room, item, scalingFactors);
  const widthPixels = Math.max(metrics.cuboidWidthPixels, _getApproxTextWidth(item.title, metrics.labelFontSize));
  const topPixels = item.isExamined ? metrics.labelOffsetY - metrics.labelFontSize * 0.8 : -metrics.cuboidHeightPixels;
  const leftCanvas = footX - widthPixels / 2;
  const [gameLeft, gameTop] = canvasToGamePosition(leftCanvas, footY + topPixels, scalingFactors);
  const [gameRight, gameBottom] = canvasToGamePosition(leftCanvas + widthPixels, footY, scalingFactors);
  return { x:gameLeft, y:gameTop, width:gameRight - gameLeft, height:gameBottom - gameTop };
}

export function discoverVisibleItemsInRoom(room:Room) {
  if (room.isObscured) return [];
  const newlyDiscoveredItems:Item[] = [];
  room.items.forEach(item => {
    if (item.isDiscovered) return;
    item.isDiscovered = true;
    newlyDiscoveredItems.push(item);
  });
  return newlyDiscoveredItems;
}

export function drawItemAtCanvasPosition(item:Item, x:number, y:number, metrics:ItemDrawMetrics, context:CanvasRenderingContext2D) {
  const left = x - metrics.cuboidWidthPixels / 2;
  const top = y - metrics.cuboidHeightPixels;
  context.save();
  context.fillStyle = ITEM_FILL_COLOR;
  context.strokeStyle = COLOR_BLACK;
  context.lineWidth = metrics.cuboidLineWidthPixels;
  context.fillRect(left, top, metrics.cuboidWidthPixels, metrics.cuboidHeightPixels);
  context.strokeRect(left, top, metrics.cuboidWidthPixels, metrics.cuboidHeightPixels);
  const lidY = top + metrics.cuboidHeightPixels * ITEM_LID_RATIO;
  context.beginPath();
  context.moveTo(left, lidY);
  context.lineTo(left + metrics.cuboidWidthPixels, lidY);
  context.stroke();
  const claspWidth = Math.max(2, metrics.cuboidWidthPixels * ITEM_CLASP_WIDTH_RATIO);
  const claspHeight = Math.max(2, metrics.cuboidHeightPixels * ITEM_CLASP_HEIGHT_RATIO);
  context.fillStyle = COLOR_BLACK;
  context.fillRect(x - claspWidth / 2, lidY - claspHeight * 0.35, claspWidth, claspHeight);
  if (item.isExamined) {
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `${metrics.labelFontSize}px Jellee`;
    context.fillStyle = COLOR_BLACK;
    context.fillText(item.title, x, y + metrics.labelOffsetY);
  }
  context.restore();
}

function drawItem(room:Room, item:Item, scalingFactors:ScalingFactors, context:CanvasRenderingContext2D) {
  const [x, y] = getItemCanvasPositionInRoom(room, item, scalingFactors);
  drawItemAtCanvasPosition(item, x, y, calcItemDrawMetrics(room, scalingFactors), context);
}

export function drawRoomItem(room:Room, item:Item, scalingFactors:ScalingFactors, context:CanvasRenderingContext2D) {
  drawItem(room, item, scalingFactors, context);
}

function _isItemSuppressedByEffect(item:Item, effects:Effect[]):boolean {
  return effects.some(effect => effect.type === EffectType.DROP_ITEM && "item" in effect && effect.item.id === item.id);
}

function _getVisibleItemsInDrawOrder(room:Room, effects:Effect[], includeUndiscovered:boolean):Item[] {
  return room.items
    .filter(item => (includeUndiscovered || item.isDiscovered) && !_isItemSuppressedByEffect(item, effects))
    .sort((item1, item2) => item1.position.y - item2.position.y || item2.position.x - item1.position.x || item1.id.localeCompare(item2.id));
}

export function findVisibleRoomItemsInDrawOrder(room:Room, effects:Effect[], includeUndiscovered:boolean):Item[] {
  return _getVisibleItemsInDrawOrder(room, effects, includeUndiscovered);
}

export function findDiscoveredItemAtPosition(room:Room, x:number, y:number, scalingFactors:ScalingFactors,
  options:RoomItemVisibilityOptions = {}):Item|null {
  const { includeUndiscovered = false, ignoreRoomObscured = false } = options;
  if (room.isObscured && !ignoreRoomObscured) return null;
  const itemsInDrawOrder = _getVisibleItemsInDrawOrder(room, [], includeUndiscovered);
  for (let i = itemsInDrawOrder.length - 1; i >= 0; --i) {
    const item = itemsInDrawOrder[i];
    const rect = _getItemHoverRect(room, item, scalingFactors);
    const isInside = x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
    if (isInside) return item;
  }
  return null;
}

export function drawItemPopover(room:Room, item:Item, scalingFactors:ScalingFactors, context:CanvasRenderingContext2D) {
  const [anchorX, anchorY] = getItemCanvasPositionInRoom(room, item, scalingFactors);
  drawTextPopover({ anchorX, anchorY, title:item.title, bodyTexts:[item.description], scalingFactors, context });
}
