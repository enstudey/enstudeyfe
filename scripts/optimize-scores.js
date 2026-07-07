/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');

const SCORES_DIR = path.join(__dirname, '../data/scores');
const FILE_JSON_2025 = path.join(SCORES_DIR, 'diem_chuan.json');
const FILE_CSV_2024 = path.join(SCORES_DIR, 'data_diem_chuan_cleaned.txt');
const FILE_OUTPUT = path.join(__dirname, '../public/data/diem_chuan_optimized.json');

// Hàm chuẩn hóa chuỗi để so khớp
function normalizeString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
    .replace(/[^\w\s]/g, '')        // Loại bỏ ký tự đặc biệt
    .replace(/\s+/g, '');           // Loại bỏ khoảng trắng
}

// Chuẩn hóa tên trường để so khớp chính xác
function normalizeUniversityName(name) {
  let normalized = normalizeString(name);
  // Loại bỏ các từ khóa phổ biến ở đầu và cuối
  normalized = normalized.replace(/^(truongdaihoc|daihoc|hocvien|phanvien)/, '');
  normalized = normalized.replace(/(2025chinhxac|chinhxac)$/, '');
  return normalized;
}

// Chuẩn hóa tên ngành học
function normalizeMajorName(name) {
  let normalized = normalizeString(name);
  normalized = normalized.replace(/^nganh/, '');
  normalized = normalized.replace(/clc$/, 'chatluongcao');
  return normalized;
}

// Phân tích dòng CSV thủ công hỗ trợ trường có chứa dấu nháy kép và dấu phẩy
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function run() {
  console.log('--- Bắt đầu hợp nhất toàn bộ dữ liệu điểm chuẩn đại học ---');

  if (!fs.existsSync(FILE_JSON_2025)) {
    console.error(`Không tìm thấy file JSON 2025 tại: ${FILE_JSON_2025}`);
    return;
  }
  if (!fs.existsSync(FILE_CSV_2024)) {
    console.error(`Không tìm thấy file CSV 2024 tại: ${FILE_CSV_2024}`);
    return;
  }

  // 1. Đọc dữ liệu JSON (chứa điểm chuẩn các năm từ diem_chuan.json)
  console.log('Đang đọc file JSON diem_chuan.json...');
  const rawJson2025 = fs.readFileSync(FILE_JSON_2025, 'utf-8');
  const data2025 = JSON.parse(rawJson2025);

  const optimizedData = {}; // Object lưu trữ kết quả cuối cùng theo mã trường
  const universityNameToCode = {}; // Bản đồ từ tên trường đã chuẩn hóa sang code
  const universityCodeToOriginalName = {};

  // Xây dựng danh sách trường
  data2025.forEach(uni => {
    const code = uni.code ? uni.code.trim().toUpperCase() : null;
    if (!code) return;

    let displayName = uni.name.replace(/\s*2025\s*chính xác\s*$/i, '').trim();
    if (displayName.startsWith('Trường Đại học')) {
      // Giữ nguyên
    } else if (displayName.startsWith('Đại học')) {
      displayName = 'Trường ' + displayName;
    }

    universityCodeToOriginalName[code] = displayName;

    const normUniName = normalizeUniversityName(uni.name);
    universityNameToCode[normUniName] = code;

    optimizedData[code] = {
      name: displayName,
      majors: []
    };

    // Parse majors từ dữ liệu
    if (uni.admission_data && Array.isArray(uni.admission_data)) {
      uni.admission_data.forEach(adm => {
        const method = adm.method ? adm.method.trim() : 'THPT';
        const year = adm.year || 2025; // Giữ toàn bộ các năm, không lọc bỏ năm cũ

        let methodKey = 'THPT';
        if (method.toLowerCase().includes('hoc ba')) {
          methodKey = 'HOC_BA';
        } else if (method.toLowerCase().includes('danh gia nang luc') || method.toLowerCase().includes('dgnl')) {
          methodKey = 'DGNL';
        } else if (method.toLowerCase().includes('danh gia tu duy') || method.toLowerCase().includes('dgtd')) {
          methodKey = 'DGTD';
        }

        if (adm.majors && Array.isArray(adm.majors)) {
          adm.majors.forEach(major => {
            const majorName = major.major_name ? major.major_name.trim() : '';
            if (!majorName) return;

            let existingMajor = optimizedData[code].majors.find(m => normalizeMajorName(m.name) === normalizeMajorName(majorName));

            const groups = major.subject_group 
              ? major.subject_group.split(/[;,\/]+/).map(g => g.trim().toUpperCase()).filter(g => g && g !== 'KHONG RO') 
              : [];

            if (!existingMajor) {
              existingMajor = {
                code: '', // Mã ngành sẽ được map từ file CSV 2024 sang sau
                name: majorName,
                groups: groups,
                scores: {},
                scale: 30,
                note: major.note ? major.note.trim() : ''
              };
              optimizedData[code].majors.push(existingMajor);
            } else {
              groups.forEach(g => {
                if (!existingMajor.groups.includes(g)) {
                  existingMajor.groups.push(g);
                }
              });
              if (major.note && !existingMajor.note) {
                existingMajor.note = major.note.trim();
              }
            }

            if (!existingMajor.scores[methodKey]) {
              existingMajor.scores[methodKey] = {};
            }
            
            const scoreVal = parseFloat(major.score);
            if (!isNaN(scoreVal) && scoreVal > 0) {
              existingMajor.scores[methodKey][year] = scoreVal;
              if (scoreVal > 30) {
                existingMajor.scale = 40;
              }
            }
          });
        }
      });
    }
  });

  console.log(`Đã nạp dữ liệu điểm chuẩn cho ${Object.keys(optimizedData).length} trường từ file JSON.`);

  // 2. Đọc dữ liệu CSV 2024 để bổ sung mã ngành và điểm chuẩn 2024 bị thiếu
  console.log('Đang đọc file CSV 2024 để map mã ngành và đồng bộ điểm chuẩn...');
  const rawCsv2024 = fs.readFileSync(FILE_CSV_2024, 'utf-8');
  const lines = rawCsv2024.split('\n');

  let csvHeaders = [];
  let unmatchedUniversitiesCount = 0;
  const unmatchedUniversities = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (i === 0) {
      csvHeaders = parseCSVLine(line);
      continue;
    }

    const row = parseCSVLine(line);
    if (row.length < 7) continue;

    const uniNameRaw = row[2];
    const majorCodeRaw = row[3] ? row[3].trim() : '';
    const majorNameRaw = row[4] ? row[4].trim() : '';
    const groupsRaw = row[5] ? row[5].trim() : '';
    const score2024Raw = row[6] ? row[6].trim() : '';
    const noteRaw = row[7] ? row[7].trim() : '';

    const normUniName = normalizeUniversityName(uniNameRaw);
    let code = universityNameToCode[normUniName];

    // Thử so khớp tương đối tên trường nếu chưa khớp trực tiếp
    if (!code) {
      const keys = Object.keys(universityNameToCode);
      const match = keys.find(k => k.includes(normUniName) || normUniName.includes(k));
      if (match) {
        code = universityNameToCode[match];
      }
    }

    // Nếu trường chỉ có trong CSV 2024, sinh mã trường tạm thời
    if (!code) {
      unmatchedUniversities.add(uniNameRaw);
      const codeTmp = uniNameRaw
        .split(/\s+/)
        .map(w => w[0])
        .join('')
        .replace(/[^A-Za-z]/g, '')
        .toUpperCase()
        .substring(0, 5);
      
      code = 'TMP_' + codeTmp;
      universityNameToCode[normUniName] = code;
      optimizedData[code] = {
        name: uniNameRaw.startsWith('Trường') ? uniNameRaw : 'Trường ' + uniNameRaw,
        majors: []
      };
    }

    const targetUni = optimizedData[code];
    const normMajorName = normalizeMajorName(majorNameRaw);
    
    // Tìm xem ngành này đã được khởi tạo từ JSON chưa
    let existingMajor = targetUni.majors.find(m => normalizeMajorName(m.name) === normMajorName);

    const groups = groupsRaw
      ? groupsRaw.split(/[;,\/]+/).map(g => g.trim().toUpperCase()).filter(g => g && g !== 'KHONG RO')
      : [];

    const score2024 = parseFloat(score2024Raw);
    const hasScore = !isNaN(score2024) && score2024 > 0;
    let noteClean = noteRaw && noteRaw.toLowerCase() !== 'khong ro' ? noteRaw.trim() : '';

    if (!existingMajor) {
      existingMajor = {
        code: majorCodeRaw,
        name: majorNameRaw,
        groups: groups,
        scores: {},
        scale: 30,
        note: noteClean
      };
      targetUni.majors.push(existingMajor);
    } else {
      if (!existingMajor.code && majorCodeRaw) {
        existingMajor.code = majorCodeRaw;
      }
      groups.forEach(g => {
        if (!existingMajor.groups.includes(g)) {
          existingMajor.groups.push(g);
        }
      });
      if (noteClean && !existingMajor.note) {
        existingMajor.note = noteClean;
      }
    }

    // Cập nhật điểm chuẩn 2024
    if (hasScore) {
      if (!existingMajor.scores['THPT']) {
        existingMajor.scores['THPT'] = {};
      }
      if (!existingMajor.scores['THPT']['2024']) {
        existingMajor.scores['THPT']['2024'] = score2024;
      }
      if (score2024 > 30) {
        existingMajor.scale = 40;
      }
    }
  }

  console.log(`Đã map xong mã ngành. Số trường tự sinh mã tạm: ${unmatchedUniversities.size}`);

  // 3. Dọn dẹp dữ liệu trống và chuẩn hóa định dạng đầu ra
  console.log('Đang dọn dẹp và tối giản dữ liệu...');
  const finalData = {};
  let totalMajorsCount = 0;

  Object.keys(optimizedData).forEach(code => {
    const uni = optimizedData[code];
    
    // Chỉ giữ lại các ngành có ít nhất một năm có điểm chuẩn
    const validMajors = uni.majors.filter(major => {
      const methods = Object.keys(major.scores);
      if (methods.length === 0) return false;
      return methods.some(m => Object.keys(major.scores[m]).length > 0);
    });

    if (validMajors.length > 0) {
      validMajors.sort((a, b) => a.name.localeCompare(b.name));
      
      finalData[code] = {
        name: uni.name,
        majors: validMajors.map(m => {
          let note = m.note;
          if (note.toLowerCase() === 'khong ro' || note.toLowerCase() === 'không rõ') {
            note = '';
          }
          return {
            code: m.code || 'N/A',
            name: m.name,
            groups: m.groups,
            scores: m.scores,
            scale: m.scale,
            note: note
          };
        })
      };
      totalMajorsCount += validMajors.length;
    }
  });

  // 4. Ghi file kết quả
  console.log(`Đang ghi dữ liệu tối ưu hóa vào: ${FILE_OUTPUT}`);
  fs.writeFileSync(FILE_OUTPUT, JSON.stringify(finalData, null, 2), 'utf-8');

  const stats = fs.statSync(FILE_OUTPUT);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log('--- HỢP NHẤT DỮ LIỆU THÀNH CÔNG ---');
  console.log(`Tổng số trường giữ lại: ${Object.keys(finalData).length}`);
  console.log(`Tổng số ngành học: ${totalMajorsCount}`);
  console.log(`Kích thước file đầu ra: ${sizeInMB} MB`);
}

run();
