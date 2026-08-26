import type { Profile } from '../types';

export const profile: Profile = {
  nameEn: 'Yijie Luo',
  nameZh: '罗翊杰',
  photos: [
    {
      src: '/images/profile/lyj2.jpg',
      caption: 'haimati <br/> Shanghai, 2024',
    },
    {
      src: '/images/profile/lyj3.gif',
      caption: 'Photo in the Lab <br/> Filmed in the video for the National Scholarship',
    },
    {
      src: '/images/profile/lyj1.jpg',
      caption: 'Credit to LLQ <br/> Hangzhou, 2025',
    }
  ],
  bio: 'I am a PhD student in Intelligent Science and Technology (IST) at <a href="https://srias.tongji.edu.cn/" target="_blank" rel="noopener noreferrer">Shanghai Research Institute for Intelligent Autonomous Systems (SRIAS)</a>, <a href="https://www.tongji.edu.cn" target="_blank" rel="noopener noreferrer">Tongji University</a>, advised by Prof. <a href="https://robot.tongji.edu.cn/info/1256/2083.htm" target="_blank" rel="noopener noreferrer">Bin He</a> and Prof. <a href="https://robot.tongji.edu.cn/info/1256/2085.htm" target="_blank" rel="noopener noreferrer">Yanmin Zhou</a>. I earned my BE degree in Automation from Tongji in 2023 and transferred to the PhD program after one year of ME&#39;s study in Control Science and Engineering. I expect to graduate in 2028. <br/> My research focuses on robotic manipulation and tactile perception. I enjoy tinkering with geeky projects, such as mini PCs and DIY cameras. I also love cooking, and of course, eating what I make~',
  contacts: [
    {
      type: 'email',
      label: 'Email',
      href: 'yijie_luo@tongji.edu.cn',          // 主邮箱（保留字段；有 addresses时弹窗以此数组为准）
      addresses:[
        { label: 'School email', address: 'yijie_luo@tongji.edu.cn' },          
        { label: 'Personal email', address: 'ultralyj@outlook.com' },
      ]
    },

    {
      type: 'scholar',
      label: 'ORCID',
      href: 'https://orcid.org/0009-0002-5776-3562',
    },
    { type: 'github', label: 'GitHub', href: 'https://github.com/ultralyj' },
    {
      type: 'wechat',
      label: 'WeChat',
      href: '#',
      qrcode: '/images/qrcode/wechat.png',
    },
    { type: 'cv', label: 'CV (coming soon)', href: '/cv.pdf' },
  ],
};
