/**
 * update.json (SearchParkInfoService API) → park.json 형식으로 변환
 * - 필드 매핑 적용 후 RGN(구) 기준 그룹화
 * 실행시 터미널 명령어 = node scripts/update-to-park.js
 */
const fs = require('fs');
const path = require('path');

const updatePath = path.join(__dirname, '..', 'data', 'update.json');
const parkPath = path.join(__dirname, '..', 'data', 'park.json');

// localInfoData 순서(서울 구) → 선택 시 맞추기 위해 구 순서 유지
const SEOUL_GU_ORDER = [
  '중구', '강동구', '성동구', '마포구', '종로구', '은평구', '영등포구', '강서구',
  '동대문구', '동작구', '광진구', '용산구', '서대문구', '서초구', '관악구', '금천구',
  '성북구', '구로구', '양천구', '강남구', '송파구', '도봉구', '강북구', '중랑구', '노원구',
];

function emptyToNull(v) {
  if (v === '' || v === undefined) return null;
  return v;
}

function mapRowToPark(row) {
  return {
    p_addr: emptyToNull(row.PARK_ADDR),
    guidance: emptyToNull(row.GD_DOC),
    p_zone: emptyToNull(row.RGN),
    p_name: emptyToNull(row.MNG_DEPT),
    use_refer: emptyToNull(row.UTZTN_REF),
    p_admintel: emptyToNull(row.TELNO),
    open_dt: emptyToNull(row.OPEN_YMD),
    main_equip: emptyToNull(row.MAIN_FCLT),
    template_url: emptyToNull(row.URL),
    g_latitude: emptyToNull(row.YCRD_G),
    p_park: emptyToNull(row.PARK_NM),
    p_list_content: emptyToNull(row.PARK_OTLN),
    g_longitude: emptyToNull(row.XCRD_G),
    area: emptyToNull(row.AREA),
    p_img: emptyToNull(row.IMG),
    visit_road: emptyToNull(row.VST_ROAD),
    main_plants: emptyToNull(row.MAIN_PLNT),
    longitude: emptyToNull(row.XCRD),
    latitude: emptyToNull(row.YCRD),
    p_idx: row.SN != null && row.SN !== '' ? parseInt(String(row.SN), 10) : null,
  };
}

function main() {
  const raw = fs.readFileSync(updatePath, 'utf-8');
  const data = JSON.parse(raw);
  const rows = data.SearchParkInfoService?.row;
  if (!Array.isArray(rows)) {
    throw new Error('update.json: SearchParkInfoService.row not found or not array');
  }

  const byLocation = new Map();
  for (const row of rows) {
    const rgn = row.RGN || '기타';
    if (!byLocation.has(rgn)) byLocation.set(rgn, []);
    byLocation.get(rgn).push(mapRowToPark(row));
  }

  const result = [];
  const orderedGu = [...SEOUL_GU_ORDER];
  const rest = [...byLocation.keys()].filter((gu) => !orderedGu.includes(gu));
  for (const gu of [...orderedGu, ...rest]) {
    if (!byLocation.has(gu)) continue;
    result.push({
      location: gu,
      data: byLocation.get(gu),
    });
  }

  fs.writeFileSync(parkPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log('park.json written:', result.length, 'locations,', rows.length, 'parks');
}

main();
