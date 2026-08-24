import type { Profile, Publication, Project, NewsItem } from '../types';

export const profileFixture: Profile = {
  nameEn: 'Jane Doe',
  nameZh: '杜娟',
  photos: ['/images/profile/a.jpg', '/images/profile/b.jpg'],
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
    authors: ['Alice Smith', 'Jane Doe', 'Bob Lee'],
    venue: 'CoRL 2026',
    tags: ['Tactile', 'Grasping'],
    selected: true,
    links: { paper: 'https://paper.example.com/1', code: 'https://github.com/x/1' },
  },
  {
    title: 'Manipulation Paper',
    authors: ['Jane Doe', 'Carol Wang'],
    venue: 'ICRA 2026',
    tags: ['Manipulation'],
    links: { paper: 'https://paper.example.com/2' },
  },
  {
    title: 'Other Paper',
    authors: ['Dan Brown'],
    venue: 'arXiv 2025',
    tags: ['Other'],
    links: { paper: 'https://paper.example.com/3' },
  },
];

export const projectsFixture: Project[] = [
  {
    title: 'Project One',
    description: 'First project description.',
    links: { code: 'https://github.com/x/p1' },
  },
  {
    title: 'Project Two',
    description: 'Second project description.',
    links: { report: 'https://example.com/report' },
  },
];

export const newsFixture: NewsItem[] = [
  { date: 'Aug 2026', content: 'Paper accepted to CoRL 2026.' },
  { date: 'May 2026', content: 'Gave a talk at Workshop.' },
  { date: 'Feb 2026', content: 'Started internship.' },
  { date: 'Jan 2026', content: 'New preprint.' },
  { date: 'Dec 2025', content: 'Award.' },
];
