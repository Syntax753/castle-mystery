/* Derives a medieval side-view composition (wall tile, floor tile, placed furniture) for a room from
   its title plus optional authored hints. Title keywords give sensible defaults; an authored
   `wall=`/`floor=`/`furniture=` hint overrides them. Each placement carries an x fraction (across the
   room width) and a depth fraction (0 = back/against the wall, 1 = front), so pieces spread across the
   floor's 2D depth grid. Pure logic — no canvas or image work here. */

import { parseOptions } from "@/common/markdownUtil";
import {
  FIXTURE_BANNER_URL,
  FIXTURE_FIREPLACE_URL,
  FIXTURE_SHIELD_URL,
  FIXTURE_TAPESTRY_URL,
  FIXTURE_TORCH_URL,
  FIXTURE_WINDOW_URL,
  FURNITURE_BARREL_URL,
  FURNITURE_BED_URL,
  FURNITURE_BOOKSHELF_URL,
  FURNITURE_BRAZIER_URL,
  FURNITURE_CANDELABRA_URL,
  FURNITURE_CHAIR_URL,
  FURNITURE_CHEST_URL,
  FURNITURE_TABLE_URL,
  FURNITURE_THRONE_URL,
  FURNITURE_WARDROBE_URL,
  TILE_FLOOR_FLAGSTONE_URL,
  TILE_FLOOR_WOOD_URL,
  TILE_WALL_STONE_URL
} from "./tileKitUtil";

export type RoomDecorHint = { wall:string|null, floor:string|null, furniture:string[] };

export type RoomFurniturePlacement = { url:string, surface:'wall'|'floor', xFraction:number, depthFraction:number };

export type RoomComposition = {
  wallTileUrl:string,
  floorTileUrl:string,
  furniture:RoomFurniturePlacement[]
};

// depth: preferred floor row (0 = back/against wall, 1 = front). Ignored for wall fixtures.
type FurnitureKind = { url:string, surface:'wall'|'floor', depth:number };

const FURNITURE_BY_NAME:Record<string, FurnitureKind> = {
  bookshelf:{ url:FURNITURE_BOOKSHELF_URL, surface:'floor', depth:0.12 },
  wardrobe:{ url:FURNITURE_WARDROBE_URL, surface:'floor', depth:0.15 },
  throne:{ url:FURNITURE_THRONE_URL, surface:'floor', depth:0.18 },
  bed:{ url:FURNITURE_BED_URL, surface:'floor', depth:0.22 },
  candelabra:{ url:FURNITURE_CANDELABRA_URL, surface:'floor', depth:0.45 },
  table:{ url:FURNITURE_TABLE_URL, surface:'floor', depth:0.5 },
  chest:{ url:FURNITURE_CHEST_URL, surface:'floor', depth:0.58 },
  barrel:{ url:FURNITURE_BARREL_URL, surface:'floor', depth:0.64 },
  chair:{ url:FURNITURE_CHAIR_URL, surface:'floor', depth:0.72 },
  brazier:{ url:FURNITURE_BRAZIER_URL, surface:'floor', depth:0.78 },
  window:{ url:FIXTURE_WINDOW_URL, surface:'wall', depth:0 },
  tapestry:{ url:FIXTURE_TAPESTRY_URL, surface:'wall', depth:0 },
  banner:{ url:FIXTURE_BANNER_URL, surface:'wall', depth:0 },
  shield:{ url:FIXTURE_SHIELD_URL, surface:'wall', depth:0 },
  torch:{ url:FIXTURE_TORCH_URL, surface:'wall', depth:0 },
  fireplace:{ url:FIXTURE_FIREPLACE_URL, surface:'wall', depth:0 }
};

const WALL_TILE_BY_NAME:Record<string, string> = {
  stone:TILE_WALL_STONE_URL,
  brick:TILE_WALL_STONE_URL
};

const FLOOR_TILE_BY_NAME:Record<string, string> = {
  flagstone:TILE_FLOOR_FLAGSTONE_URL,
  stone:TILE_FLOOR_FLAGSTONE_URL,
  wood:TILE_FLOOR_WOOD_URL,
  timber:TILE_FLOOR_WOOD_URL
};

const FURNITURE_SPREAD_MIN = 0.16;
const FURNITURE_SPREAD_RANGE = 0.68;

function _assignXFractions(count:number):number[] {
  if (count <= 0) return [];
  if (count === 1) return [0.5];
  return Array.from({ length:count }, (_unused, index) => FURNITURE_SPREAD_MIN + FURNITURE_SPREAD_RANGE * (index / (count - 1)));
}

function _placeFurnitureGroup(kinds:FurnitureKind[]):RoomFurniturePlacement[] {
  const xFractions = _assignXFractions(kinds.length);
  return kinds.map((kind, index) => ({ url:kind.url, surface:kind.surface, xFraction:xFractions[index], depthFraction:kind.depth }));
}

function _toFurniturePlacements(names:string[]):RoomFurniturePlacement[] {
  const kinds = names
    .map(name => FURNITURE_BY_NAME[name.trim().toLowerCase()])
    .filter((kind):kind is FurnitureKind => Boolean(kind));
  return [
    ..._placeFurnitureGroup(kinds.filter(kind => kind.surface === 'floor')),
    ..._placeFurnitureGroup(kinds.filter(kind => kind.surface === 'wall'))
  ];
}

function _resolveWallTileUrl(name:string|null):string {
  return (name && WALL_TILE_BY_NAME[name.trim().toLowerCase()]) || TILE_WALL_STONE_URL;
}

function _resolveFloorTileUrl(name:string|null):string {
  return (name && FLOOR_TILE_BY_NAME[name.trim().toLowerCase()]) || TILE_FLOOR_FLAGSTONE_URL;
}

function _findFloorNameForTitle(title:string):string|null {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('library') || lowerTitle.includes('study')
    || lowerTitle.includes('bed') || lowerTitle.includes('chamber') || lowerTitle.includes('quarters')) return 'wood';
  return null;
}

function _findFurnitureNamesForTitle(title:string):string[] {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('kitchen')) return ['table', 'barrel', 'chest', 'brazier'];
  if (lowerTitle.includes('library') || lowerTitle.includes('study')) return ['bookshelf', 'table', 'chair', 'candelabra', 'tapestry'];
  if (lowerTitle.includes('chapel') || lowerTitle.includes('sanctum') || lowerTitle.includes('shrine')) return ['tapestry', 'window', 'candelabra', 'banner'];
  if (lowerTitle.includes('throne')) return ['throne', 'tapestry', 'banner', 'candelabra', 'torch'];
  if (lowerTitle.includes('guard')) return ['table', 'chair', 'barrel', 'shield', 'torch'];
  if (lowerTitle.includes('bed') || lowerTitle.includes('chamber') || lowerTitle.includes('quarters')) return ['bed', 'wardrobe', 'chest', 'candelabra'];
  if (lowerTitle.includes('aerie') || lowerTitle.includes('auditorium') || lowerTitle.includes('tower') || lowerTitle.includes('aviary')) return ['window', 'barrel', 'candelabra'];
  if (lowerTitle.includes('hall') || lowerTitle.includes('foyer') || lowerTitle.includes('corridor')) return ['banner', 'barrel', 'shield', 'torch'];
  if (lowerTitle.includes('stair')) return ['torch', 'candelabra'];
  return ['barrel', 'torch', 'candelabra'];
}

export function parseRoomDecorHint(nameValues:{ wall?:string, floor?:string, furniture?:string }):RoomDecorHint|null {
  const wall = nameValues.wall?.trim() || null;
  const floor = nameValues.floor?.trim() || null;
  const furniture = nameValues.furniture ? parseOptions(nameValues.furniture) : [];
  if (!wall && !floor && furniture.length === 0) return null;
  return { wall, floor, furniture };
}

export function deriveRoomComposition(title:string, hint:RoomDecorHint|null):RoomComposition {
  const wallTileUrl = _resolveWallTileUrl(hint?.wall ?? null);
  const floorTileUrl = _resolveFloorTileUrl(hint?.floor ?? _findFloorNameForTitle(title));
  const furnitureNames = hint && hint.furniture.length ? hint.furniture : _findFurnitureNamesForTitle(title);
  return { wallTileUrl, floorTileUrl, furniture:_toFurniturePlacements(furnitureNames) };
}
