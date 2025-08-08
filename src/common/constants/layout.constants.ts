export const BLOG_LAYOUTS = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
  GRID: 'grid',
  MAGAZINE: 'magazine',
  STORY: 'story',
} as const;

export type BlogLayout = typeof BLOG_LAYOUTS[keyof typeof BLOG_LAYOUTS];

export const LAYOUT_DESCRIPTIONS = {
  [BLOG_LAYOUTS.LEFT]: 'Images on the left, text on the right',
  [BLOG_LAYOUTS.RIGHT]: 'Images on the right, text on the left',
  [BLOG_LAYOUTS.CENTER]: 'Images centered with text above and below',
  [BLOG_LAYOUTS.GRID]: 'Grid layout with images and text',
  [BLOG_LAYOUTS.MAGAZINE]: 'Magazine-style layout',
  [BLOG_LAYOUTS.STORY]: 'Story-style layout with full-width images',
} as const; 