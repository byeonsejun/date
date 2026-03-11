/**
 * park / dodreamgil / culturalSpace JSON에서 앱 미사용 필드만 제거 (초기 로딩 경량화)
 * - SelectShowMapType.jsx 등에서 참조하는 필드만 유지
 * 실행: node scripts/strip-unused-fields.js
 */
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

// 앱에서 실제 사용하는 필드만 유지 (SelectShowMapType.jsx, RecommendPlace 등 기준)
const USED_KEYS = {
  park: ['latitude', 'longitude', 'p_park', 'p_list_content', 'p_img', 'template_url', 'p_admintel', 'p_addr', 'p_name'],
  dodreamgil: ['latitude', 'longitude', 'CPI_NAME', 'COURSE_CATEGORY_NM', 'CONTENT', 'COURSE_NAME', 'DISTANCE', 'LEAD_TIME', 'DETAIL_COURSE', 'COURSE_LEVEL'],
  culturalSpace: ['X_COORD', 'Y_COORD', 'FAC_NAME', 'SUBJCODE', 'FAC_DESC', 'MAIN_IMG', 'HOMEPAGE', 'PHNE', 'address'],
};

function pickUsed(item, usedKeys) {
  const out = {};
  usedKeys.forEach((k) => {
    if (Object.prototype.hasOwnProperty.call(item, k)) {
      out[k] = item[k];
    }
  });
  return out;
}

function processFile(filename, key) {
  const filePath = path.join(dataDir, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error(`${filename}: expected array of { location, data }`);

  const out = data.map(({ location, data: items }) => ({
    location,
    data: items.map((item) => pickUsed(item, USED_KEYS[key])),
  }));

  fs.writeFileSync(filePath, JSON.stringify(out, null, 2), 'utf-8');
  const before = Buffer.byteLength(raw, 'utf8');
  const after = Buffer.byteLength(JSON.stringify(out), 'utf8');
  console.log(`${filename}: ${(before / 1024).toFixed(1)} KB → ${(after / 1024).toFixed(1)} KB (${(((before - after) / before) * 100).toFixed(1)}% 감소)`);
}

function main() {
  processFile('park.json', 'park');
  processFile('dodreamgil.json', 'dodreamgil');
  processFile('culturalSpace.json', 'culturalSpace');
  console.log('Done. Unused fields removed.');
}

main();
