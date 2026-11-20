import { toAssetPath } from '../utils/assetPath';
import { homeConfig } from './homeConfig';

export type HeroMediaItem = {
  src: string;
  type: 'video' | 'image';
  alt?: string;
};

const withAssetPath = (item: HeroMediaItem): HeroMediaItem => ({
  ...item,
  src: toAssetPath(item.src),
});

// 兼容层：零基础用户请在 homeConfig.ts 的 hero 中修改轮播。
export const heroMediaDesktop = homeConfig.hero.desktop
  .map((item) => withAssetPath(item as HeroMediaItem));

export const heroMediaMobile = homeConfig.hero.mobile
  .map((item) => withAssetPath(item as HeroMediaItem));
