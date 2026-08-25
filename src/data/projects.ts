import type { Project } from '../types';

export const projects: Project[] = [
  {
    title: 'Example Project One',
    description:
      'A short description of an open-source robotics project, shown as a justified paragraph below the link row.',
    thumbnail: '/images/projects/project1.jpg',
    links: [
      { kind: 'code', href: 'https://github.com/yourname/project1' },
      { kind: 'report', href: 'https://example.com/report1' },
    ],
  },
  {
    title: 'Example Project Two',
    description: 'A short description of another project.',
    thumbnail: '/images/projects/project2.jpg',
    links: [{ kind: 'code', href: 'https://github.com/yourname/project2' }],
  },
];
