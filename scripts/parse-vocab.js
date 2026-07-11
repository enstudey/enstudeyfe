/* eslint-disable */
const fs = require("fs");
const path = require("path");

// Tìm đường dẫn tương đối của file data.json dựa theo cấu trúc workspace
const dataPath = path.join(__dirname, "../../enstudeyai/.agents/tasks/2026-07/12/2-phase-2/data.json");
const outputDir = path.join(__dirname, "../public/data");
const outputFile = path.join(outputDir, "toeic-vocab.json");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (!fs.existsSync(dataPath)) {
  console.error(`Error: data.json not found at ${dataPath}`);
  process.exit(1);
}

const content = fs.readFileSync(dataPath, "utf8");
const lines = content.split("\n");
const cards = [];

lines.forEach(line => {
  if (line.startsWith("|") && !line.includes("Từ vựng") && !line.includes(":---")) {
    const parts = line.split("|").map(p => p.trim());
    if (parts.length >= 5) {
      const wordRaw = parts[1]; // e.g. **1. Abide by**
      const ipa = parts[2];
      const meaning = parts[3];
      const description = parts[4];
      
      const wordMatch = wordRaw.match(/\*\*\d+\.\s*(.*?)\*\*/);
      if (wordMatch && wordMatch[1]) {
        cards.push({
          id: `toeic-600-${cards.length + 1}`,
          word: wordMatch[1].trim(),
          ipa,
          meaning,
          description
        });
      }
    }
  }
});

fs.writeFileSync(outputFile, JSON.stringify(cards, null, 2));
console.log(`Successfully parsed ${cards.length} vocabulary words to ${outputFile}`);
