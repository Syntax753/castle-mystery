/* Reusable medieval vector tile kit. Each URL resolves to a checked-in SVG under
   public/tiles/medieval/ and is seeded into every level's ImageSet (see imageSetUtil.ts),
   so the kit is available to any levelset without the author referencing it. */

const TILE_DIR = '/tiles/medieval';

export const TILE_WALL_STONE_URL = `${TILE_DIR}/wall-stone.svg`;
export const TILE_FLOOR_FLAGSTONE_URL = `${TILE_DIR}/floor-flagstone.svg`;
export const TILE_FLOOR_WOOD_URL = `${TILE_DIR}/floor-wood.svg`;
export const FURNITURE_WARDROBE_URL = `${TILE_DIR}/furniture-wardrobe.svg`;
export const FURNITURE_TABLE_URL = `${TILE_DIR}/furniture-table.svg`;
export const FURNITURE_BED_URL = `${TILE_DIR}/furniture-bed.svg`;
export const FURNITURE_BRAZIER_URL = `${TILE_DIR}/furniture-brazier.svg`;
export const FURNITURE_CHEST_URL = `${TILE_DIR}/furniture-chest.svg`;
export const FURNITURE_BARREL_URL = `${TILE_DIR}/furniture-barrel.svg`;
export const FURNITURE_BOOKSHELF_URL = `${TILE_DIR}/furniture-bookshelf.svg`;
export const FURNITURE_THRONE_URL = `${TILE_DIR}/furniture-throne.svg`;
export const FURNITURE_CHAIR_URL = `${TILE_DIR}/furniture-chair.svg`;
export const FURNITURE_CANDELABRA_URL = `${TILE_DIR}/furniture-candelabra.svg`;
export const FIXTURE_WINDOW_URL = `${TILE_DIR}/fixture-window.svg`;
export const FIXTURE_TAPESTRY_URL = `${TILE_DIR}/fixture-tapestry.svg`;
export const FIXTURE_TORCH_URL = `${TILE_DIR}/fixture-torch.svg`;
export const FIXTURE_BANNER_URL = `${TILE_DIR}/fixture-banner.svg`;
export const FIXTURE_SHIELD_URL = `${TILE_DIR}/fixture-shield.svg`;
export const FIXTURE_FIREPLACE_URL = `${TILE_DIR}/fixture-fireplace.svg`;

export const BUILT_IN_TILE_URLS:readonly string[] = [
  TILE_WALL_STONE_URL,
  TILE_FLOOR_FLAGSTONE_URL,
  TILE_FLOOR_WOOD_URL,
  FURNITURE_WARDROBE_URL,
  FURNITURE_TABLE_URL,
  FURNITURE_BED_URL,
  FURNITURE_BRAZIER_URL,
  FURNITURE_CHEST_URL,
  FURNITURE_BARREL_URL,
  FURNITURE_BOOKSHELF_URL,
  FURNITURE_THRONE_URL,
  FURNITURE_CHAIR_URL,
  FURNITURE_CANDELABRA_URL,
  FIXTURE_WINDOW_URL,
  FIXTURE_TAPESTRY_URL,
  FIXTURE_TORCH_URL,
  FIXTURE_BANNER_URL,
  FIXTURE_SHIELD_URL,
  FIXTURE_FIREPLACE_URL
];
