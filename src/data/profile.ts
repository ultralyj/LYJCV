import type { Profile } from '../types';

export const profile: Profile = {
  nameEn: 'Your Name',
  nameZh: '你的名字',
  photos: [
    {
      src: '/images/profile/photo1.jpg',
      caption: 'Photo at Campus (2026)<br/>Credit to Your Friend',
    },
    {
      src: '/images/profile/photo2.jpg',
      caption: 'Photo at Conference (2025)',
    },
    {
      src: '/images/profile/photo3.jpg',
      caption: 'Photo in the Lab',
    },
  ],
  bio: 'I am a Ph.D. student at [Your University], advised by Prof. [Advisor]. My research focuses on robotic manipulation and tactile perception.',
  contacts: [
    { type: 'email', label: 'Email', href: 'you@example.com' },
    {
      type: 'scholar',
      label: 'Google Scholar',
      href: 'https://scholar.google.com/',
    },
    { type: 'github', label: 'GitHub', href: 'https://github.com/yourusername' },
    { type: 'twitter', label: 'X', href: 'https://twitter.com/yourusername' },
    {
      type: 'wechat',
      label: 'WeChat',
      href: '#',
      qrcode: '/images/qrcode/wechat.png',
    },
    { type: 'cv', label: 'CV (07/2026)', href: '/cv.pdf' },
  ],
};
