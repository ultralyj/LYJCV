import type { Profile, Publication, Project, NewsItem } from '../types';

export const profileFixture: Profile = {
  nameEn: 'Jane Doe',
  nameZh: '杜娟',
  photos: [
    { src: '/images/profile/a.jpg', caption: 'Photo A' },
    { src: '/images/profile/b.jpg', caption: 'Photo B' },
  ],
  bio: 'Ph.D. student at Example University working on robotic manipulation.',
  contacts: [
    { type: 'email', label: 'Email', href: 'jane@example.com' },
    { type: 'github', label: 'GitHub', href: 'https://github.com/jane' },
    { type: 'scholar', label: 'Google Scholar', href: 'https://scholar.example.com' },
  ],
};

export const publicationsFixture: Publication[] = [
  {
    title: 'Tactile Grasping Paper',
    authors: [
      { name: 'Alice Smith' },
      { name: 'Jane Doe', isOwn: true },
      { name: 'Bob Lee' },
    ],
    venue: { name: 'CoRL 2026', type: 'conference' },
    tags: [
      { label: 'Tactile', category: 'manipulation' },
      { label: 'Grasping', category: 'grasping' },
    ],
    selected: true,
    links: [
      { kind: 'paper', href: 'https://paper.example.com/1' },
      { kind: 'code', href: 'https://github.com/x/1' },
    ],
  },
  {
    title: 'Manipulation Paper',
    authors: [
      { name: 'Jane Doe', isOwn: true },
      { name: 'Carol Wang' },
    ],
    venue: { name: 'ICRA 2026', type: 'conference' },
    tags: [{ label: 'Manipulation', category: 'manipulation' }],
    links: [{ kind: 'paper', href: 'https://paper.example.com/2' }],
  },
  {
    title: 'Other Paper',
    authors: [{ name: 'Dan Brown' }],
    venue: { name: 'arXiv 2025', type: 'preprint' },
    tags: [{ label: 'Other', category: 'other' }],
    links: [{ kind: 'paper', href: 'https://paper.example.com/3' }],
  },
];

export const projectsFixture: Project[] = [
  {
    title: 'Project One',
    description: 'First project description.',
    links: [{ kind: 'code', href: 'https://github.com/x/p1' }],
  },
  {
    title: 'Project Two',
    description: 'Second project description.',
    links: [{ kind: 'report', href: 'https://example.com/report' }],
  },
];

export const newsFixture: NewsItem[] = [
  { date: 'Aug 2026', content: 'Paper accepted to CoRL 2026.' },
  { date: 'May 2026', content: 'Gave a talk at Workshop.' },
  { date: 'Feb 2026', content: 'Started internship.' },
  { date: 'Jan 2026', content: 'New preprint.' },
  { date: 'Dec 2025', content: 'Award.' },
];
