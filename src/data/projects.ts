import type { Project } from '../types';

export const projects: Project[] = [
  {
    title: 'Example Project One',
    description: 'A short description of an open-source robotics project.',
    thumbnail: '/images/projects/project1.jpg',
    links: { code: 'https://github.com/yourname/project1', report: 'https://example.com/report1' },
  },
  {
    title: 'Example Project Two',
    description: 'A short description of another project.',
    thumbnail: '/images/projects/project2.jpg',
    links: { code: 'https://github.com/yourname/project2' },
  },
];
