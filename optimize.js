const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './originals';
const outputDir = './public/images';
const widths = [800, 1600];

// how wide each folder's images are displayed (used for the "sizes" attribute)
const SIZES = {
  illustration: '(max-width: 500px) 100vw, (max-width: 900px) 50vw, 33vw',
  sketch: '(max-width: 500px) 50vw, (max-width: 1200px) 33vw, 25vw',
  'hot-summer-day': '(max-width: 900px) 50vw, 48vw'
};
const DEFAULT_SIZES = '100vw';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const p = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(p) : [p];
  });
}

(async () => {
  const files = walk(inputDir)
    .filter(f => /\.(jpe?g|png|webp|tiff?)$/i.test(f))
    .sort();

  const tagsByFolder = {};

  for (const file of files) {
    const rel = path.relative(inputDir, file);
    const folder = path.dirname(rel) === '.' ? '' : path.dirname(rel).split(path.sep).join('/');
    const name = path.parse(file).name;
    const destDir = path.join(outputDir, folder);
    fs.mkdirSync(destDir, { recursive: true });

    // real displayed size (handles photos that are rotated by EXIF data)
    const meta = await sharp(file).metadata();
    const swap = meta.orientation >= 5;
    const W = swap ? meta.height : meta.width;
    const H = swap ? meta.width : meta.height;

    for (const w of widths) {
      const dest = path.join(destDir, `${name}-${w}.webp`);
      if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs > fs.statSync(file).mtimeMs) continue;
      await sharp(file)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(dest);
    }

    const base = `public/images/${folder ? folder + '/' : ''}${name}`;
    const sizes = SIZES[folder] || DEFAULT_SIZES;
    const h800 = Math.round(800 * (H / W));
    const alt = name.replace(/[-_]/g, ' ');

    const tag = `<img src="${base}-800.webp" srcset="${base}-800.webp 800w, ${base}-1600.webp 1600w" sizes="${sizes}" width="800" height="${h800}" alt="${alt}" loading="lazy" decoding="async">`;

    (tagsByFolder[folder || 'root'] = tagsByFolder[folder || 'root'] || []).push(tag);
    console.log(`done: ${rel}`);
  }

  let out = '';
  for (const [folder, tags] of Object.entries(tagsByFolder)) {
    out += `<!-- ===== ${folder} ===== -->\n${tags.join('\n')}\n\n`;
  }
  fs.writeFileSync('image-tags.txt', out);
  console.log('\nWrote image-tags.txt (copy tags from there into your HTML)');
})();