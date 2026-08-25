import type { Publication } from '../types';

export const publications: Publication[] = [
  {
    title: 'Example Tactile Manipulation Paper',
    authors: [
      { name: 'Coauthor One' },
      { name: 'Your Name', isOwn: true, equalContrib: true },
      { name: 'Coauthor Two' },
    ],
    venue: { name: 'CoRL 2026', type: 'conference' },
    tags: [
      { label: 'Tactile', category: 'manipulation' },
      { label: 'Manipulation', category: 'manipulation' },
    ],
    selected: true,
    honor: 'oral',
    thumbnail: '/images/papers/tactile.jpg',
    links: [
      { kind: 'paper', href: 'https://example.com/paper1' },
      { kind: 'code', href: 'https://github.com/yourname/paper1' },
      { kind: 'project', href: 'https://example.com/project1' },
    ],
    note: 'code coming soon',
    abstract:
      'We propose a method for tactile-rich robotic manipulation. This placeholder abstract demonstrates the justified paragraph shown below each paper.',
  },
  {
    title: 'Example Grasping Paper',
    authors: [
      { name: 'Your Name', isOwn: true },
      { name: 'Coauthor Three' },
    ],
    venue: { name: 'ICRA 2026', type: 'conference' },
    tags: [{ label: 'Grasping', category: 'grasping' }],
    thumbnail: '/images/papers/grasping.jpg',
    links: [
      { kind: 'paper', href: 'https://example.com/paper2' },
      { kind: 'code', href: 'https://github.com/yourname/paper2' },
    ],
    abstract: 'A grasping paper placeholder.',
  },
  {
    title: 'Example Preprint on Data Collection',
    authors: [
      { name: 'Your Name', isOwn: true, corresponding: true },
      { name: 'Coauthor Four' },
    ],
    venue: { name: 'arXiv 2025', type: 'preprint' },
    tags: [
      { label: 'Dataset', category: 'data' },
      { label: 'Generalization', category: 'other' },
    ],
    links: [{ kind: 'paper', href: 'https://example.com/paper3' }],
    abstract: 'A data-collection preprint placeholder.',
  },
];
