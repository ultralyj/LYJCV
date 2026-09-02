import type { Publication } from '../types';

export const publications: Publication[] = [
  {
    title: 'CoFlex-VTLA: Spatiotemporal Tactile Grounding for Adaptive Directional Compliance in Contact-Rich Manipulation',
    authors: [
      { name: 'Yijie Luo', isOwn: true, equalContrib: true },
      { name: 'Guanghui Qin', equalContrib: true },
      { name: 'Wei Wang' },
      { name: 'Xingyu Li' },
      { name: 'Zhipeng Wang' },
      { name: 'Yanmin Zhou', corresponding: true},
      { name: 'Bin He' },
    ],
    venue: { name: 'arXiv 2026', type: 'preprint' },
    tags: [
      { label: 'Tactile', category: 'tactile' },
      { label: 'Manipulation', category: 'manipulation' },
    ],
    selected: true,
    thumbnail: '/images/papers/coflex-vtla.png',
    links: [
      { kind: 'paper', href: '/coflex.pdf' },
      { kind: 'project', href: 'https://ultralyj.github.io/CoFlexVTLA' },
    ],
    note: 'code coming soon',
    abstract:
      'CoFlex-VTLA grounds spatial-temporal tactile signals to adaptively regulate directional compliance during contact-rich manipulation. The method lets a robot continuously adjust its contact strategy online, enabling safer and more dexterous interaction across varied objects.',
  },
  {
    title: 'TacMagPie: A Fast, High-Fidelity Soft Magnetic Tactile Sensor Simulator for Sim-to-Real Robotic Manipulation',
    authors: [
      { name: 'Yijie Luo', isOwn: true },
      { name: 'Bingze Du' },
      { name: 'Xingyu Li' },
      { name: 'Wei Wang' },
      { name: 'Feng Luan' },
      { name: 'Zhipeng Wang', corresponding: true},
      { name: 'Yanmin Zhou' },
      { name: 'Bin He' },
    ],
    venue: { name: 'IROS 2026', type: 'conference' },
    tags: [
        { label: 'Simulation', category: 'simulation' },
        { label: 'Tactile', category: 'tactile' },
    ],
    thumbnail: '/images/papers/tacmagpie.png',
    selected: true,
    links: [
      { kind: 'paper', href: '/IROS26_0521_FI.pdf' },
      { kind: 'code', href: 'https://github.com/ultralyj/TacMagPie' },
    ],
    abstract:
      'A fast, high-fidelity simulator for magnetic tactile sensing that supports large-scale sim-to-real learning for robotic manipulation. It generates realistic tactile feedback at scale, allowing policies and perception models to be trained in simulation and transferred to real robots.',
  },
  {
    title: 'FTFNet: A Frequency-Time Fusion Network for Slip Prediction in Dexterous Robotic Manipulation',
    authors: [
      { name: 'Xingyu Li' },
      { name: 'Yijie Luo', isOwn: true },
      { name: 'Wei Wang' },
      { name: 'Qian Xie' },
      { name: 'Zhipeng Wang' },
      { name: 'Zhongjie Wang' },
      { name: 'Yanmin Zhou', corresponding: true },
      { name: 'Bin He', corresponding: true },
    ],
    venue: {
      name: 'IEEE/ASME Transactions on Mechatronics (2026)',
      type: 'journal',
    },
    tags: [
      { label: 'Manipulation', category: 'manipulation' },
      { label: 'Tactile', category: 'tactile' },
    ],
    thumbnail: '/images/papers/ftfnet.png',
    links: [
      {
        kind: 'paper',
        href: 'https://ieeexplore.ieee.org/document/11477109/',
      },
      {
        kind: 'generic',
        label: 'DOI',
        href: 'https://doi.org/10.1109/TMECH.2026.3676123',
      },
    ],
    abstract:
      'FTFNet is a frequency-time fusion network that predicts slip from tactile signals during dexterous robotic manipulation. By embedding frequency-domain analysis into a learned architecture, it captures subtle slip cues earlier and more reliably, supporting reactive in-hand control.',
  },
  {
    title:
      'Dynamic Tactile Sensor (DTS) With Data-Driven Super-Resolution for Edge Applications',
    authors: [
      { name: 'Yanmin Zhou', corresponding: true },
      { name: 'Yijie Luo', isOwn: true },
      { name: 'Jie Li' },
      { name: 'Yafei Wang' },
      { name: 'Zhipeng Wang' },
      { name: 'Yongkang Jiang' },
      { name: 'Bin He' },
    ],
    venue: {
      name: 'IEEE Transactions on Industrial Electronics (2025)',
      type: 'journal',
    },
    tags: [
      { label: 'Tactile', category: 'tactile' },
      { label: 'Sensors', category: 'other' },
    ],
    selected: true,
    thumbnail: '/images/papers/dts_tie.png',
    links: [
      {
        kind: 'paper',
        href: 'https://ieeexplore.ieee.org/document/11205512/',
      },
      {
        kind: 'generic',
        label: 'DOI',
        href: 'https://doi.org/10.1109/TIE.2025.3598207',
      },
    ],
    note: 'Advisor first author; student second author.',
    abstract:
      'We develop a data-driven super-resolution approach that reconstructs dense tactile feedback from a sparse sensor array, with perception run directly on the sensor\u2019s embedded microcontroller. This edge DTS architecture greatly reduces data transmission while providing high-resolution contact information, enabling responsive, on-device tactile perception for autonomous manipulation.',
  },
  {
    title:
      'Predicting Tactile Sensory Outcome of Physical Human-Robot Interaction Through Embodied Learning Strategy',
    authors: [
      { name: 'Zheng Yan' },
      { name: 'Yanmin Zhou', corresponding: true },
      { name: 'Yijie Luo', isOwn: true },
      { name: 'Chengjin Wang' },
      { name: 'Zhipeng Wang' },
      { name: 'Yuxi Lu' },
      { name: 'Bin He' },
    ],
    venue: {
      name: 'IEEE Robotics and Automation Letters (2026)',
      type: 'journal',
    },
    tags: [
      { label: 'Tactile', category: 'tactile' },
      { label: 'Manipulation', category: 'manipulation' },
    ],
    thumbnail: '/images/papers/tso_ral.png',
    links: [
      {
        kind: 'paper',
        href: 'https://ieeexplore.ieee.org/document/11513897/',
      },
      {
        kind: 'generic',
        label: 'DOI',
        href: 'https://doi.org/10.1109/LRA.2026.3692059',
      },
    ],
    abstract:
      'We propose an embodied learning strategy that lets a robot model its own tactile sensorimotor dynamics during physical human-robot interaction. The approach predicts future tactile outcomes from current signals in an end-to-end, real-time manner, allowing the robot to anticipate contact and generalize its response to new interaction scenarios.',
  },
  {
    title:
      'A Bio-Inspired Cross-Domain Robotic Manipulator with Tactile Sensing and Edge Intelligence',
    authors: [
      { name: 'Wei Wang' },
      { name: 'Yijie Luo', isOwn: true },
      { name: 'Qianqian Chen' },
      { name: 'Juelong Xiao' },
      { name: 'Yanmin Zhou', corresponding: true },
      { name: 'Bin He', corresponding: true },
    ],
    venue: {
      name: 'IEEE/ASME Transactions on Mechatronics (2026)',
      type: 'journal',
    },
    tags: [
      { label: 'Tactile', category: 'tactile' },
    ],
    thumbnail: '/images/papers/cdg_tmech.png',
    links: [
      {
        kind: 'project',
        href: 'https://weiwanguu.github.io/WW-CV/papers/tmech/index.html',
      },
      {
        kind: 'code',
        href: 'https://github.com/weiwanguu/C-GraRes',
      },
    ],
    note: 'Accepted',
    abstract:
      'We present a bio-inspired robotic hand that performs robust grasping across water and land, combining tactile perception with an edge-recognition-driven force-control policy. The on-device model recognizes objects in real time and closes the loop on contact force, enabling the system to adapt its grasp across domains and generalize to unseen objects.',
  },
  {
    title:
      'Simulation, Design, and Application of Intelligent-Edge-Based Soft Magnetic Tactile Sensor With Super-Resolution',
    authors: [
      { name: 'Yanmin Zhou', corresponding: true },
      { name: 'Yijie Luo', isOwn: true },
      { name: 'Zheng Yan' },
      { name: 'Yiyang Jin' },
      { name: 'Shuo Jiang' },
      { name: 'Zhipeng Wang' },
      { name: 'Bin He' },
    ],
    venue: {
      name: 'IEEE Sensors Journal (2025)',
      type: 'journal',
    },
    tags: [
      { label: 'Tactile', category: 'tactile' },
      { label: 'Sensors', category: 'other' },
    ],
    thumbnail: '/images/papers/isj.png',
    selected: true,
    links: [
      {
        kind: 'paper',
        href: 'https://ieeexplore.ieee.org/document/10741244/',
      },
      {
        kind: 'generic',
        label: 'DOI',
        href: 'https://doi.org/10.1109/JSEN.2024.3486921',
      },
    ],
    note: 'Advisor first author; student second author.',
    abstract:
      'We present an edge-intelligence perception pipeline that reconstructs high-resolution tactile fields from a sparse magnetic sensor array using a compact quantized CNN. Simulation guides the sensor design while on-device inference provides dense, real-time contact estimates with low data transfer, supporting responsive tactile feedback for robotic manipulation.',
  },
  {
    title:
      'Bioinspired Self-Assembled Gradient-Structured Dual-Modal Sensor with Extended Range and Durability',
    authors: [
      { name: 'Yangchen Gao', equalContrib: true },
      { name: 'Jie Yang', equalContrib: true },
      { name: 'Yijie Luo', isOwn: true, equalContrib: true },
      { name: 'Xiaoyu Zhang' },
      { name: 'Huaiyu Gao' },
      { name: 'Li Li' },
      { name: 'Junyao Zhang' },
      { name: 'Tongrui Sun' },
      { name: 'Guoqing Zu' },
      { name: 'Yanmin Zhou' },
      { name: 'Jia Huang' },
    ],
    venue: {
      name: 'Advanced Functional Materials (2025)',
      type: 'journal',
    },
    tags: [
      { label: 'Sensors', category: 'other' },
    ],
    thumbnail: '/images/papers/afm.png',
    links: [
      {
        kind: 'paper',
        href: 'https://advanced.onlinelibrary.wiley.com/doi/10.1002/adfm.202507079',
      },
      {
        kind: 'generic',
        label: 'DOI',
        href: 'https://doi.org/10.1002/adfm.202507079',
      },
    ],
    abstract:
      'A collaborative materials-science work on a bio-inspired dual-modal tactile and touchless sensing interface, demonstrated in interactive robotic tasks such as object sorting and contact-free control.',
  },
  {
    title:
      'Bio-inspired Encoding in Neuromorphic Tactile Sensor Enables Rapid, Precise Robot-Environment Interaction',
    authors: [
      { name: 'Yijie Luo', isOwn: true },
      { name: 'Wei Wang' },
      { name: 'Xinyu Li' },
      { name: 'Bin Lei' },
      { name: 'Zhipeng Wang' },
      { name: 'Yanmin Zhou' },
      { name: 'Bin He' },
    ],
    venue: {
      name: 'Under review at IEEE RAL',
      type: 'journal',
    },
    tags: [
      { label: 'Tactile', category: 'tactile' },
      { label: 'Sensors', category: 'other' },
    ],
    thumbnail: '/images/papers/hsts.png',
    links: [],
    note: 'Under review',
    abstract:
      'We present a neuromorphic tactile perception system that couples heterogeneous, biology-inspired spike encoding with a lightweight spiking neural network for rapid edge inference. By processing multiple encoding schemes together, the robot classifies tactile interactions within a handful of time steps with very low data bandwidth, enabling fast, reflex-like responses during dexterous interaction.',
  },
  {
    title:
      'Design and Implementation of a Multimodal Perception Intelligent Skin for Amphibious Autonomous Vehicles',
    authors: [
      { name: 'Bin Lei' },
      { name: 'Yijie Luo', isOwn: true },
      { name: 'Wei Wang' },
      { name: 'Siyuan He' },
      { name: 'Zhipeng Wang' },
      { name: 'Bin Cheng' },
      { name: 'Yanmin Zhou' },
      { name: 'Bin He' },
    ],
    venue: {
      name: '16th IFAC Conference on Control Applications in Marine Systems (2025)',
      type: 'conference',
    },
    tags: [
      { label: 'Tactile', category: 'tactile' },
      { label: 'Sensors', category: 'other' },
    ],
    thumbnail: '/images/papers/ifac.png',
    links: [
      {
        kind: 'paper',
        href: 'https://www.sciencedirect.com/science/article/pii/S2405896325023328',
      }
    ],
    abstract:
      'We developed a multimodal intelligent skin for amphibious agents, achieving reliable environmental sensing and 90.94% accuracy in medium-transition recognition.',
  }
];
