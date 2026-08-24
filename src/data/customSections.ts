import type { CustomSection } from '../types';

/**
 * Register additional homepage sections here. Each entry renders as its own
 * section with an anchor link in the navbar automatically.
 *
 * Layout options:
 *   - 'cards': grid of thumbnail cards with title/description/link
 *   - 'list':  bulleted list of titled items with descriptions
 *   - 'paragraph': single block of paragraph text per item
 *
 * Example:
 * export const customSections: CustomSection[] = [
 *   {
 *     id: 'hobbies',
 *     title: 'Hobbies',
 *     layout: 'cards',
 *     items: [
 *       { title: 'Photography', description: 'Travel photos.', href: 'https://example.com' },
 *     ],
 *   },
 * ];
 */
export const customSections: CustomSection[] = [];
