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
    
    if (cleaned.includes(".")) {
      const dotIndex = cleaned.indexOf(".");
      const beforeDot = cleaned.substring(0, dotIndex);
      const afterDot = cleaned.substring(dotIndex + 1);
      
      // Phần trước dấu chấm tối đa là 2 ký tự (cho điểm 10)
      let finalBefore = beforeDot.substring(0, 2);
      if (parseInt(finalBefore, 10) > 10) {
        finalBefore = finalBefore.substring(0, 1);
      }
      
      // Phần sau dấu chấm tối đa là 2 ký tự
      const finalAfter = afterDot.substring(0, 2);
      cleaned = finalBefore + "." + finalAfter;
    } else {
      // Nếu không có dấu chấm, chỉ cho phép tối đa 3 chữ số (ví dụ 775 -> 7.75)
      if (cleaned.length > 3) {
        cleaned = cleaned.substring(0, 3);
      }
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
