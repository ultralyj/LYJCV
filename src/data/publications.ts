import type { Publication } from '../types';

export const publications: Publication[] = [
  {
    title: 'Example Tactile Manipulation Paper',
    authors: ['Coauthor One', 'Your Name', 'Coauthor Two'],
    venue: 'CoRL 2026',
    venueType: 'conference',
    tags: ['Tactile', 'Manipulation'],
    selected: true,
    thumbnail: '/images/papers/tactile.jpg',
    links: {
      paper: 'https://example.com/paper1',
      code: 'https://github.com/yourname/paper1',
      project: 'https://example.com/project1',
    },
  },
  {
    title: 'Example Grasping Paper',
    authors: ['Your Name', 'Coauthor Three'],
    venue: 'ICRA 2026',
    venueType: 'conference',
    tags: ['Grasping'],
    links: { paper: 'https://example.com/paper2', code: 'https://github.com/yourname/paper2' },
  },
  {
    title: 'Example Preprint',
    authors: ['Your Name', 'Coauthor Four'],
    venue: 'arXiv 2025',
    venueType: 'preprint',
    tags: ['Tactile'],
    links: { paper: 'https://example.com/paper3' },
  },
];
