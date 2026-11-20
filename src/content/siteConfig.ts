/**
 * 全站基础配置
 *
 * 零基础用户通常只需要修改这个文件和 homeConfig.ts。
 * 修改文字时请保留引号、逗号和括号。
 */
export const siteConfig = {
  site: {
    name: 'YOUR NAME',
    title: 'YOUR NAME · Creative Portfolio',
    description: '一个关于创意、设计与数字体验的个人作品集。',
    language: 'zh-CN',
  },

  brand: {
    icon: '/assets/site-icon.webp',
    iconAlt: '个人品牌图标',
    wordmark: '/assets/site-wordmark.svg',
    wordmarkAlt: '个人品牌',
  },

  navigation: {
    links: [
      { label: 'Home', href: '#hero' },
      { label: 'Work', href: '#features-grid' },
    ],
    cta: {
      label: 'Explore',
      href: '#more-gallery',
    },
  },

  footer: {
    tagline: [
      '在这里填写一句介绍自己的话。',
      '也可以填写你的设计理念或合作方向。',
    ],
    sections: [
      {
        title: '个人信息',
        items: [
          { label: '身份', value: '视觉设计师' },
          { label: '方向', value: '品牌 / AI / 数字体验' },
          { label: '状态', value: '接受合作机会' },
        ],
      },
      {
        title: '社媒主页',
        items: [
          { label: '小红书', value: '填写你的小红书账号', href: '#' },
          { label: 'Behance', value: '填写你的 Behance', href: '#' },
          { label: '微博 / 抖音', value: '填写你的社媒账号', href: '#' },
        ],
      },
      {
        title: '联系我',
        items: [
          { label: '邮箱', value: 'hello@example.com', href: 'mailto:hello@example.com' },
          { label: '微信', value: '填写你的微信号' },
          { label: '合作咨询', value: '欢迎通过邮箱或社媒联系' },
        ],
      },
    ],
    socialLinks: [
      { label: '小红书', href: '#' },
      { label: 'Behance', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
    copyright: 'YOUR NAME · Creative Portfolio',
    backgroundImage: '/assets/footer-parallax-4.webp',
  },

  clickEffect: {
    enabled: true,
    emojis: ['✨', '💫', '🌟', '🎨', '🫧', '💥', '🌈', '🍀', '💖', '🎵'],
    messages: [
      '欢迎光临',
      '今天也灵感满格',
      '祝你灵感大爆发',
      '好审美正在发生',
      '你的创意被看见了',
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
