import { access, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const templateContentDirectory = path.join(
  projectRoot,
  'public',
  'assets',
  'template-content',
);
const quality = 88;

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const images = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      images.push(...await collectImages(absolutePath));
    } else if (entry.isFile() && /\.(?:jpe?g|png)$/i.test(entry.name)) {
      images.push(absolutePath);
    }
  }

  return images;
}

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

if (!await exists(templateContentDirectory)) {
  console.log('没有找到待处理目录：public/assets/template-content');
  console.log('请先创建该目录并放入 JPG、JPEG 或 PNG 图片，然后重新运行 npm run template:prepare。');
  process.exit(0);
}

console.log('开始准备模板图片……');
console.log('只会处理 public/assets/template-content，不会删除原图。');

let images;
try {
  images = await collectImages(templateContentDirectory);
} catch (error) {
  console.error(`❌ 无法读取待处理目录：${error.message}`);
  process.exit(1);
}

if (images.length === 0) {
  console.log('\n没有找到 JPG、JPEG 或 PNG 图片，无需转换。');
  process.exit(0);
}

console.log(`\n找到 ${images.length} 张图片，将以 quality ${quality} 转换为 WebP。\n`);

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.error('❌ 无法加载图片转换工具 sharp。');
  console.error('请先在项目目录运行 npm install，安装完成后再运行 npm run template:prepare。');
  process.exit(1);
}

let successCount = 0;
let failureCount = 0;

for (const sourcePath of images) {
  const outputPath = sourcePath.replace(/\.(?:jpe?g|png)$/i, '.webp');
  const displaySource = path.relative(projectRoot, sourcePath);
  const displayOutput = path.relative(projectRoot, outputPath);

  try {
    const sourceSize = (await stat(sourcePath)).size;
    await sharp(sourcePath).webp({ quality }).toFile(outputPath);
    const outputSize = (await stat(outputPath)).size;
    successCount += 1;
    console.log(`✓ ${displaySource}`);
    console.log(`  → ${displayOutput}（${formatSize(sourceSize)} → ${formatSize(outputSize)}）`);
  } catch (error) {
    failureCount += 1;
    console.error(`❌ 转换失败：${displaySource}`);
    console.error(`   原因：${error.message}`);
  }
}

console.log('\n图片准备完成');
console.log(`成功：${successCount} 张`);
console.log(`失败：${failureCount} 张`);
console.log('原始图片均已保留。');

if (failureCount > 0) {
  console.error('\n有图片转换失败，请根据上面的原因处理后重试。');
  process.exitCode = 1;
}
