// Export all generated Directus types
export type * from './directus';
export type { paths, components } from './directus';
import type { components, paths } from './directus';

// Re-export commonly used types with cleaner names
export type DirectusFile = components['schemas']['Files'];
export type DirectusUser = components['schemas']['Users'];

// Content collection types
export type BlockButton = components['schemas']['ItemsBlockButton'];
export type BlockButtonGroup = components['schemas']['ItemsBlockButtonGroup'];
export type BlockForm = components['schemas']['ItemsBlockForm'];
export type BlockGallery = components['schemas']['ItemsBlockGallery'];
export type BlockGalleryItem = components['schemas']['ItemsBlockGalleryItems'];
export type BlockHero = components['schemas']['ItemsBlockHero'];
export type BlockPosts = components['schemas']['ItemsBlockPosts'];
export type BlockPricing = components['schemas']['ItemsBlockPricing'];
export type BlockPricingCard = components['schemas']['ItemsBlockPricingCards'];
export type BlockRichtext = components['schemas']['ItemsBlockRichtext'];

export type Form = components['schemas']['ItemsForms'];
export type FormField = components['schemas']['ItemsFormFields'];
export type Global = components['schemas']['ItemsGlobals'];
export type Navigation = components['schemas']['ItemsNavigation'];
export type NavigationItem = components['schemas']['ItemsNavigationItems'];
export type Page = components['schemas']['ItemsPages'];
export type PageBlock = components['schemas']['ItemsPageBlocks'];
export type Post = components['schemas']['ItemsPosts'];
export type Redirect = components['schemas']['ItemsRedirects'];

// API response types
export type DirectusResponse<T> = {
  data: T;
  meta?: components['schemas']['x-metadata'];
};

export type DirectusListResponse<T> = {
  data: T[];
  meta?: components['schemas']['x-metadata'];
};

// Path types for API endpoints
export type DirectusPaths = paths;

// Query parameters type
export type DirectusQuery = components['schemas']['Query']; 