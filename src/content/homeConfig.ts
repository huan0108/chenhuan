import { toAssetPath } from '../utils/assetPath';

/**
 * 首页内容配置
 *
 * 替换图片时：
 * 1. 先把图片放进 public/assets/template-content/ 对应目录；
 * 2. 运行 npm run template:prepare；
 * 3. 在下面填写生成后的 .webp 路径。
 */
const withAssetPath = (paths: readonly string[]) => paths.map(toAssetPath);

export const homeConfig = {
  hero: {
    desktop: [
      { src: '/assets/hero-media/1.webp', type: 'image', alt: '首页轮播 1' },
      { src: '/assets/hero-media/2.mp4', type: 'video', alt: '首页轮播 2' },
      { src: '/assets/hero-media/3.webp', type: 'image', alt: '首页轮播 3' },
      { src: '/assets/hero-media/4.mp4', type: 'video', alt: '首页轮播 4' },
    ],
    mobile: [
      { src: '/assets/hero-media/1.webp', type: 'image', alt: '首页轮播 1' },
      { src: '/assets/hero-media/2.mp4', type: 'video', alt: '首页轮播 2' },
      { src: '/assets/hero-media/3.webp', type: 'image', alt: '首页轮播 3' },
      { src: '/assets/hero-media/4.mp4', type: 'video', alt: '首页轮播 4' },
    ],
  },

  creativeWork: {
    subtitle: '一些有趣的创意化内容探索',
    aboutCopy: [
      '这里是一处仍在生长中的实验现场，让技术成为放大想象力的引擎，而不是替代判断与感受力的答案。',
      '我更关心 AI 如何参与创作、触发偏离、制造新秩序；这里展示的是正在生长中的方向。',
    ],
  },

  workFuture: {
    showcase: {
      line1: {
        text: 'EVERYTHING',
        accents: [{ index: 5, color: '#9CFF3F' }],
      },
      line2Start: {
        text: 'TO',
        accents: [],
      },
      buttonLabel: '→',
      line2End: {
        text: 'CREATE',
        accents: [{ index: 4, color: '#FFB8DF' }],
      },
      line3: {
        text: 'ANYTHING',
        accents: [{ index: 6, color: '#9CFF3F' }],
      },
      floatingImages: withAssetPath([
        '/assets/work-future-showcase/1.webp',
        '/assets/work-future-showcase/2.webp',
        '/assets/work-future-showcase/3.webp',
        '/assets/work-future-showcase/4.webp',
      ]),
    },
    heading: {
      eyebrowFirst: 'CREATE',
      eyebrowSecond: {
        text: 'DESIGN',
        accents: [{ index: 2, color: '#FFB8DF' }],
      },
      line1: 'WORK',
      line2Prefix: 'A',
      line2: {
        text: 'FUTURE',
        accents: [
          { index: 0, color: '#9CFF3F' },
          { index: 1, color: '#9CFF3F' },
        ],
      },
    },
    slidingCards: [
      withAssetPath([
        '/assets/scroll-cards/Mask group.webp',
        '/assets/scroll-cards/Mask group-1.webp',
        '/assets/scroll-cards/Mask group-2.webp',
        '/assets/scroll-cards/Mask group-3.webp',
        '/assets/scroll-cards/Mask group-4.webp',
      ]),
      withAssetPath([
        '/assets/scroll-cards/Mask group-5.webp',
        '/assets/scroll-cards/Mask group-6.webp',
        '/assets/scroll-cards/Mask group-7.webp',
        '/assets/scroll-cards/Mask group-8.webp',
        '/assets/scroll-cards/Mask group-9.webp',
      ]),
      withAssetPath([
        '/assets/scroll-cards/Mask group-10.webp',
        '/assets/scroll-cards/Mask group-11.webp',
        '/assets/scroll-cards/Mask group-12.webp',
        '/assets/scroll-cards/Group 1912056496.webp',
        '/assets/scroll-cards/Mask grou6p.webp',
      ]),
    ],
  },

  bweModdy: {
    bannerImages: withAssetPath([
      '/assets/bwe-moddy-banner/1.webp',
      '/assets/bwe-moddy-banner/2.webp',
      '/assets/bwe-moddy-banner/3.webp',
    ]),
    cards: withAssetPath([
      '/assets/bwe-moddy-cards/1.webp',
      '/assets/bwe-moddy-cards/2.webp',
      '/assets/bwe-moddy-cards/3.webp',
      '/assets/bwe-moddy-cards/4.webp',
    ]),
    bannerIntervalMs: 5000,
    cardHighlightIntervalMs: 1500,
  },

  cta: {
    lines: [
      { text: 'STOP OVERTHINKING', accentIndexes: [2], accentColor: '#FFB8DF' },
      { text: 'JUST DO IT', accentIndexes: [6], accentColor: '#9CFF3F' },
      { text: 'FOR FUTURE', accentIndexes: [], accentColor: '#9CFF3F' },
    ],
  },
} as const;
