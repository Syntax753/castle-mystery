import { baseUrl } from "@/common/urlUtil";
import { KEY_IMAGE_URL } from "./effects/lockEffectUtil";
import { BUILT_IN_TILE_URLS } from "./tileKitUtil";
import ClozeImage from "./solutions/types/ClozeImage";
import ClozePartType from "./solutions/types/ClozePartType";
import Level from "./types/Level";
import ImageSet from "./types/ImageSet";

export function createEmptyImageSet():ImageSet {
  return new Map<string, ImageBitmap>();
}

function _findReferencedImageUrls(level:Level):string[] {
  const imageUrls = new Set<string>([KEY_IMAGE_URL, ...BUILT_IN_TILE_URLS]);
  const sourceCharacters = level.initialCharacters.length ? level.initialCharacters : level.characters;
  sourceCharacters.forEach(character => {
    if (character.faceImageUrl) imageUrls.add(character.faceImageUrl);
  });
  level.solutions.forEach(solution => solution.parts.forEach(part => {
    if (part.type === ClozePartType.image) imageUrls.add((part as ClozeImage).imageUrl);
  }));
  return [...imageUrls];
}

// Chromium's createImageBitmap() is unreliable directly on an SVG blob, so SVGs are rasterized through
// an <img> + canvas first. The result is still an ImageBitmap, keeping the ImageSet contract (ADR-005).
async function _decodeSvgBlobToImageBitmap(blob:Blob):Promise<ImageBitmap|null> {
  if (typeof document === 'undefined' || typeof Image !== 'function') return null;
  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    const width = image.naturalWidth || image.width || 64;
    const height = image.naturalHeight || image.height || 64;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.drawImage(image, 0, 0, width, height);
    return await createImageBitmap(canvas);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function _loadImageBitmap(imageUrl:string):Promise<ImageBitmap|null> {
  if (typeof createImageBitmap !== 'function') return null;
  try {
    const response = await fetch(baseUrl(imageUrl));
    if (!response.ok) return null;
    const blob = await response.blob();
    if (blob.type.includes('svg')) return await _decodeSvgBlobToImageBitmap(blob);
    return await createImageBitmap(blob);
  } catch {
    return null;
  }
}

export async function createImageSetFromLevel(level:Level):Promise<ImageSet> {
  const imageSet = createEmptyImageSet();
  const imageUrls = _findReferencedImageUrls(level);
  const imageEntries = await Promise.all(imageUrls.map(async imageUrl => [imageUrl, await _loadImageBitmap(imageUrl)] as const));
  imageEntries.forEach(([imageUrl, imageBitmap]) => {
    if (imageBitmap) imageSet.set(imageUrl, imageBitmap);
  });
  return imageSet;
}