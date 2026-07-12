/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const productsPath = path.join(__dirname, "../data/affiliate-products.json");
if (!fs.existsSync(productsPath)) {
  console.error("❌ Không tìm thấy affiliate-products.json");
  process.exit(1);
}

let products;
try {
  products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
} catch (error) {
  console.error("❌ Không thể parse file affiliate-products.json:", error);
  process.exit(1);
}

let hasError = false;

// BR-403-2: Nghiêm cấm giới thiệu sản phẩm sức khỏe, thực phẩm chức năng
const forbiddenKeywords = ["thuốc", "thực phẩm chức năng", "viên uống", "supplement", "vaccine"];
products.forEach((prod) => {
  const text = `${prod.title} ${prod.description}`.toLowerCase();
  forbiddenKeywords.forEach((kw) => {
    if (text.includes(kw)) {
      console.error(`❌ Vi phạm BR-403-2: Sản phẩm "${prod.title}" chứa từ khóa cấm "${kw}"`);
      hasError = true;
    }
  });

  // Kiểm tra rawProductUrl hợp lệ nếu có
  if (prod.rawProductUrl && !prod.rawProductUrl.startsWith("https://")) {
    console.error(`❌ rawProductUrl không hợp lệ: ${prod.id} → ${prod.rawProductUrl}`);
    hasError = true;
  }
});

if (hasError) {
  console.error("❌ Validate affiliate data: THẤT BẠI.");
  process.exit(1);
} else {
  console.log(`✅ Validate affiliate data: THÀNH CÔNG. ${products.length} sản phẩm hợp lệ.`);
}
