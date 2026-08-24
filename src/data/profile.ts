import type { Profile } from '../types';

export const profile: Profile = {
  nameEn: 'Your Name',
  nameZh: '你的名字',
  photos: [
    '/images/profile/photo1.jpg',
    '/images/profile/photo2.jpg',
    '/images/profile/photo3.jpg',
  ],
  bio: 'I am a Ph.D. student at [Your University], advised by Prof. [Advisor]. My research focuses on robotic manipulation and tactile perception.',
  contacts: [
    { type: 'email', label: 'Email', href: 'you@example.com' },
    { type: 'scholar', label: 'Google Scholar', href: 'https://scholar.google.com/' },
    { type: 'github', label: 'GitHub', href: 'https://github.com/yourusername' },
    { type: 'twitter', label: 'X', href: 'https://twitter.com/yourusername' },
    {
      type: 'wechat',
      label: 'WeChat',
      href: '#',
      qrcode: '/images/qrcode/wechat.png',
    },
    { type: 'cv', label: 'CV', href: '/cv.pdf' },
  ],
};
