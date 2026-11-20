import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const publicDirectory = path.join(projectRoot, 'public');
const assetsDirectory = path.join(publicDirectory, 'assets');
const templateContentDirectory = path.join(assetsDirectory, 'template-content');
const sourceFiles = [
  'src/content/siteConfig.ts',
  'src/content/homeConfig.ts',
  'src/content/heroMedia.ts',
  'src/content/showcases.ts',
];

let errorCount = 0;
let warningCount = 0;

function reportError(message) {
  errorCount += 1;
  console.error(`❌ 错误：${message}`);
}

function reportWarning(message) {
  warningCount += 1;
  console.warn(`⚠️ 警告：${message}`);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function extractAssetPaths(source) {
  const results = new Set();
  const stringWithAssetPattern = /(['"`])([^'"`\r\n]*?\/assets\/[^'"`\r\n]*?)\1/g;

  for (const line of source.split(/\r?\n/u)) {
    const trimmedLine = line.trimStart();
    if (
      trimmedLine.startsWith('//')
      || trimmedLine.startsWith('/*')
      || trimmedLine.startsWith('*')
    ) {
      continue;
    }

    for (const match of line.matchAll(stringWithAssetPattern)) {
      const value = match[2];
      const assetPath = value
        .slice(value.indexOf('/assets/'))
        .split(/[?#]/, 1)[0]
        .replace(/\\\//g, '/');

      if (assetPath && !assetPath.includes('${')) {
        results.add(assetPath);
      }
    }
  }

  return results;
}

function assetPathToPublicFile(assetPath) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(assetPath);
  } catch {
    reportError(`资源路径无法解码，请检查百分号编码：${assetPath}`);
    return null;
  }

  const relativePath = decodedPath.replace(/^\/+/, '');
  const resolvedPath = path.resolve(publicDirectory, ...relativePath.split('/'));
  const relativeToPublic = path.relative(publicDirectory, resolvedPath);

  if (
    relativeToPublic === '..'
    || relativeToPublic.startsWith(`..${path.sep}`)
    || path.isAbsolute(relativeToPublic)
  ) {
    reportError(`资源路径超出了 public 目录：${assetPath}`);
    return null;
  }

  return resolvedPath;
}

async function validateReferencedAssets() {
  console.log('\n一、检查配置文件引用的资源');
  const referencedAssets = new Set();

  for (const relativeFile of sourceFiles) {
    const absoluteFile = path.join(projectRoot, ...relativeFile.split('/'));
    try {
      const source = await readFile(absoluteFile, 'utf8');
      const extractedPaths = extractAssetPaths(source);
      extractedPaths.forEach((assetPath) => referencedAssets.add(assetPath));
      console.log(`  ✓ 已读取 ${relativeFile}，找到 ${extractedPaths.size} 个资源路径`);
    } catch (error) {
      reportError(`无法读取 ${relativeFile}：${error.code === 'ENOENT' ? '文件不存在' : error.message}`);
    }
  }

  if (referencedAssets.size === 0) {
    reportWarning('没有从现有配置源码中提取到 /assets/... 路径，请确认配置是否已填写。');
    return;
  }

  let existingAssetCount = 0;
  for (const assetPath of [...referencedAssets].sort()) {
    if (assetPath === '/assets/' || assetPath === '/assets') {
      continue;
    }

    const publicFile = assetPathToPublicFile(assetPath);
    if (publicFile && await exists(publicFile)) {
      existingAssetCount += 1;
    } else if (publicFile) {
      reportError(`找不到资源 ${assetPath}（应放在 public${assetPath.replaceAll('/', path.sep)}）`);
    }
  }

  console.log(`  ✓ 已确认 ${existingAssetCount} 个配置资源存在`);
}

async function inspectAssetNames(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    reportError(`无法读取 ${path.relative(projectRoot, directory)}：${error.code === 'ENOENT' ? '目录不存在' : error.message}`);
    return;
  }

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await inspectAssetNames(absolutePath);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const problems = [];
    if (/[\u3400-\u9fff]/u.test(entry.name)) problems.push('中文');
    if (/\s/u.test(entry.name)) problems.push('空格');
    if (/[()（）]/u.test(entry.name)) problems.push('括号');

    if (problems.length > 0) {
      const displayPath = path.relative(projectRoot, absolutePath);
      reportWarning(`${displayPath} 的文件名包含${problems.join('、')}，建议改为英文、数字和连字符。`);
    }
  }
}

async function checkLocalEnvironmentFile() {
  console.log('\n三、检查本地环境文件');
  const envLocalPath = path.join(projectRoot, '.env.local');
  if (await exists(envLocalPath)) {
    reportWarning('发现 .env.local。交付模板前请删除它，避免泄露本地配置或密钥。');
  } else {
    console.log('  ✓ 未发现 .env.local');
  }
}

console.log('开始检查零基础模板，请稍候……');
await validateReferencedAssets();

console.log('\n二、检查用户新增素材的文件名');
await inspectAssetNames(templateContentDirectory);

await checkLocalEnvironmentFile();

console.log('\n检查完成');
console.log(`错误：${errorCount} 个`);
console.log(`警告：${warningCount} 个`);

if (errorCount > 0) {
  console.error('\n模板检查未通过：请先处理上面的错误，再重新运行 npm run template:check。');
  process.exitCode = 1;
} else {
  console.log('\n模板检查通过，可以继续构建。');
}
