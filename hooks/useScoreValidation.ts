"use client";

export interface ValidationResult {
  isValid: boolean;
  error: string;
  cleanedVal: string;
}

export function useScoreValidation() {
  const sanitizeInput = (val: string): string => {
    // Thay thế dấu phẩy thành dấu chấm
    let cleaned = val.replace(/,/g, ".");
    // Chỉ giữ lại các chữ số và tối đa một dấu chấm
    cleaned = cleaned.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }
    // Giới hạn chỉ cho phép nhập tối đa 2 chữ số thập phân
    if (cleaned.includes(".")) {
      const dotIndex = cleaned.indexOf(".");
      cleaned = cleaned.substring(0, dotIndex + 3);
    }
    return cleaned;
  };

  const validateScore = (val: string, type: "subject" | "total", required = false): ValidationResult => {
    const cleaned = sanitizeInput(val);
    if (cleaned === "") {
      if (required) {
        return { isValid: false, error: "Vui lòng nhập điểm số", cleanedVal: "" };
      }
      return { isValid: true, error: "", cleanedVal: "" };
    }

    const num = parseFloat(cleaned);
    if (isNaN(num)) {
      return { isValid: false, error: "Điểm số phải là một số hợp lệ", cleanedVal: cleaned };
    }

    if (type === "subject") {
      if (num < 0 || num > 10) {
        return { isValid: false, error: "Điểm môn học phải nằm trong khoảng từ 0 đến 10", cleanedVal: cleaned };
      }
    } else if (type === "total") {
      if (num < 0 || num > 30) {
        return { isValid: false, error: "Tổng điểm xét tuyển phải nằm trong khoảng từ 0 đến 30", cleanedVal: cleaned };
      }
    }

    // Làm tròn tối đa 2 chữ số thập phân
    const rounded = Math.round(num * 100) / 100;
    return { isValid: true, error: "", cleanedVal: rounded.toString() };
  };

  return { validateScore, sanitizeInput };
}
