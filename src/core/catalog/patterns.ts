/** Background patterns from Hero Patterns (by Steve Schoger, via the `hero-patterns` package). */
export const HERO_PATTERNS = [
  'anchorsAway',
  'architect',
  'autumn',
  'aztec',
  'bamboo',
  'bankNote',
  'bathroomFloor',
  'bevelCircle',
  'boxes',
  'brickWall',
  'bubbles',
  'cage',
  'charlieBrown',
  'churchOnSunday',
  'circlesAndSquares',
  'circuitBoard',
  'connections',
  'corkScrew',
  'current',
  'curtain',
  'cutout',
  'deathStar',
  'diagonalLines',
  'diagonalStripes',
  'dominos',
  'endlessClouds',
  'eyes',
  'fallingTriangles',
  'fancyRectangles',
  'flippedDiamonds',
  'floatingCogs',
  'floorTile',
  'formalInvitation',
  'fourPointStars',
  'glamorous',
  'graphPaper',
  'groovy',
  'happyIntersection',
  'heavyRain',
  'hexagons',
  'hideout',
  'houndstooth',
  'iLikeFood',
  'intersectingCircles',
  'jigsaw',
  'jupiter',
  'kiwi',
  'leaf',
  'linesInMotion',
  'lips',
  'lisbon',
  'melt',
  'moroccan',
  'morphingDiamonds',
  'overcast',
  'overlappingCircles',
  'overlappingDiamonds',
  'overlappingHexagons',
  'parkayFloor',
  'pianoMan',
  'pieFactory',
  'pixelDots',
  'plus',
  'polkaDots',
  'rails',
  'rain',
  'randomShapes',
  'roundedPlusConnected',
  'signal',
  'skulls',
  'slantedStars',
  'squares',
  'squaresInSquares',
  'stampCollection',
  'steelBeams',
  'stripes',
  'temple',
  'texture',
  'ticTacToe',
  'tinyCheckers',
  'topography',
  'volcanoLamp',
  'wallpaper',
  'wiggle',
  'xEquals',
  'yyy',
  'zigZag',
] as const;

/** Patterns drawn by Vibecard itself, used by several themes. */
export const CUSTOM_PATTERNS = [
  'grid',
  'dots',
  'scanlines',
  'grain',
  'diagonal',
  'crosshatch',
] as const;

/** The 15 patterns the original Cardivo documented, shown first in the builder. */
export const CLASSIC_PATTERNS = [
  'plus',
  'topography',
  'texture',
  'hideout',
  'fallingTriangles',
  'iLikeFood',
  'fourPointStars',
  'brickWall',
  'wiggle',
  'bubbles',
  'floatingCogs',
  'leaf',
  'rain',
  'polkaDots',
  'ticTacToe',
] as const;

export type HeroPatternId = (typeof HERO_PATTERNS)[number];
export type CustomPatternId = (typeof CUSTOM_PATTERNS)[number];
export type PatternId = HeroPatternId | CustomPatternId;

const lookup = new Map<string, PatternId>(
  [...HERO_PATTERNS, ...CUSTOM_PATTERNS].map((id) => [id.toLowerCase(), id]),
);

/** Case-insensitive lookup, so both `polkaDots` and `polkadots` work. */
export const findPattern = (value: string): PatternId | undefined =>
  lookup.get(
    value
      .trim()
      .toLowerCase()
      .replace(/[\s_-]/g, ''),
  );

export const isCustomPattern = (id: PatternId): id is CustomPatternId =>
  (CUSTOM_PATTERNS as readonly string[]).includes(id);
