import type { Project } from '../types';

export const projects: Project[] = [
  {
    title: 'RoboLLM: Vision-Language-Action Model for Embodied Manipulation',
    description:
      'An end-to-end vision-language-action model that unifies perception, reasoning, and action for robotic manipulation. A multimodal tokenizer (MMVQ-VAE) encodes vision, touch, and proprioception into shared discrete tokens, while a hybrid-sequence transformer with structured attention performs cross-modal reasoning and action generation. Multi-stage pre-training gives the model generation, understanding, and action capabilities in one architecture, reaching strong manipulation success across varied contact-rich tasks.',
    thumbnail: '/images/projects/robollm.png',
    links: [],
  },
  {
    title: 'Multimodal Bio-Inspired Flexible E-Skin',
    description:
      'A fully flexible, multimodal electronic skin inspired by crocodile dome pressure receptors, combining neuromorphic encoding with active compliance control. It provides high-resolution embodied perception across proximity, 3D force, pose, and temperature, enabling fast avoidance, adaptive following, and human-like compliant interaction for safe human-robot coexistence. Awarded the Rising Star Award at the 2025 Zhangjiang Humanoid Robot Innovation & Entrepreneurship Competition (Core Component track).',
    thumbnail: '/images/projects/eskin.gif',
    links: [],
  },
  {
    title: 'ARES: A Five-Stage Pipelined RISC-V Processor',
    description:
      'A RISC-V processor design with two cores: CERES, a single-cycle RV32I implementation, and ARES, an advanced five-stage pipelined version. Built as a Vivado FPGA project with a complete GCC-based C-to-COE toolchain for compiling and running bare-metal programs, covering the full design flow from instruction-set implementation through synthesis and simulation.',
    thumbnail: '/images/projects/ares.png',
    links: [
      { kind: 'code', href: 'https://github.com/ultralyj/ares-riscv/tree/master' },
    ],
  },
];
