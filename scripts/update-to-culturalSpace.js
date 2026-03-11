/**
 * update.json (문화공간 API) → culturalSpace.json 형식으로 변환
 * - culturalSpaceInfo.row 추출 후 GNGU(구) 기준 그룹화
 * - 각 항목에 address 필드 추가 (앱에서 사용)
 * 실행시 터미널 명령어 = node scripts/update-to-culturalSpace.js
 */
const fs = require('fs');
const path = require('path');

const updatePath = path.join(__dirname, '..', 'data', 'update.json');
const outPath = path.join(__dirname, '..', 'data', 'culturalSpace.json');

const SEOUL_GU_ORDER = [
  '중구', '강동구', '성동구', '마포구', '종로구', '은평구', '영등포구', '강서구',
  '동대문구', '동작구', '광진구', '용산구', '서대문구', '서초구', '관악구', '금천구',
  '성북구', '구로구', '양천구', '강남구', '송파구', '도봉구', '강북구', '중랑구', '노원구',
];

function mapRow(row) {
  return {
    ...row,
    address: row.ADDR != null ? String(row.ADDR) : '',
  };
}

function main() {
  const raw = fs.readFileSync(updatePath, 'utf-8');
  const data = JSON.parse(raw);
  const rows = data.culturalSpaceInfo?.row;
  if (!Array.isArray(rows)) {
    throw new Error('update.json: culturalSpaceInfo.row not found or not array');
  }

  const byLocation = new Map();
  for (const row of rows) {
    const gu = row.GNGU || '기타';
    if (!byLocation.has(gu)) byLocation.set(gu, []);
    byLocation.get(gu).push(mapRow(row));
  }

  const result = [];
  const rest = [...byLocation.keys()].filter((gu) => !SEOUL_GU_ORDER.includes(gu));
  for (const gu of [...SEOUL_GU_ORDER, ...rest]) {
    if (!byLocation.has(gu)) continue;
    result.push({
      location: gu,
      data: byLocation.get(gu),
    });
  }

  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log('culturalSpace.json written:', result.length, 'locations,', rows.length, 'items');
}

main();
