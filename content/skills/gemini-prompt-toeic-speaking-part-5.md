---
title: "Thiết lập Prompt Gemini AI đóng vai giám khảo chấm điểm thi nói TOEIC Part 5 theo chuẩn format mới"
description: "Hướng dẫn chi tiết cách viết Prompt cho Gemini AI đóng vai giám khảo chấm điểm và nhận xét chi tiết phần thi nói TOEIC Speaking Part 5."
date: "2026-07-12"
category: "skills"
tags:
  - "toeic"
  - "speaking"
  - "gemini prompt"
  - "ai tự học"
---

# Thiết lập Prompt Gemini AI đóng vai giám khảo chấm điểm thi nói TOEIC Part 5 theo chuẩn format mới

Trong cấu trúc đề thi TOEIC 4 kỹ năng, phần thi Speaking luôn là nỗi lo lắng lớn nhất của đa số thí sinh Việt Nam. Đặc biệt là câu hỏi số 11 ở Part 5 (Express an Opinion - Trình bày quan điểm cá nhân) được coi là phần thi khó nhằn nhất, quyết định điểm số của bạn có thể bứt phá lên các thang điểm cao (band điểm xuất sắc) hay không.

Khó khăn lớn nhất khi tự ôn luyện kỹ năng nói tại nhà là bạn thiếu một người giám khảo có chuyên môn để chấm điểm, chỉ ra các lỗi ngữ pháp và đưa ra lời khuyên cải thiện cụ thể. Bạn ghi âm bài nói của mình nhưng khi nghe lại, bạn chỉ có thể nhận xét một cách chung chung: *mình nói có vẻ hơi ngập ngừng* hoặc *từ vựng của mình nghe chưa được sang lắm*.

Để giải quyết triệt để vấn đề này, EnStudey sẽ hướng dẫn bạn cách thiết kế một Prompt (câu lệnh) cực kỳ chi tiết biến Gemini AI thành một giám khảo chấm điểm TOEIC Speaking nghiêm khắc và có chuyên môn ngay tại nhà nhé.

## Khó khăn lớn nhất khi tự ôn luyện TOEIC Speaking

Khi tự học, học viên thường gặp phải tình trạng thiếu động lực và thiếu định hướng. Bạn làm các đề thi thử TOEIC Speaking nhưng không biết bài nói của mình đang nằm ở mức điểm nào (level 6, level 7, hay level 8). 

Một số bạn lựa chọn dán transcript bài nói của mình cho AI và hỏi ngắn gọn *chấm điểm giúp tôi*. Kết quả là AI thường đưa ra những lời khen ngợi sáo rỗng hoặc đánh giá điểm số không chính xác do không được cung cấp tiêu chí chấm điểm (rubrics) chuẩn của tổ chức khảo thí ETS.

Để AI chấm điểm chuẩn xác, chúng mình phải ép nó đóng vai một giám khảo chuyên nghiệp, cung cấp cho nó thang điểm chi tiết và yêu cầu nó phân tích bài nói của bạn dựa theo các tiêu chí khắt khe nhất.

## Cấu trúc phản hồi chuẩn 3S để đạt điểm tối đa Part 5

Trong câu hỏi trình bày quan điểm của TOEIC Speaking Part 5, bạn có 45 giây chuẩn bị và 60 giây để nói. Để đạt điểm tối đa, bài nói của bạn phải có cấu trúc lập luận cực kỳ mạch lạc. EnStudey khuyên bạn nên áp dụng cấu trúc 3S kinh điển sau:

- **State (Trình bày quan điểm - Phút 0 - 15s)**: Đưa ra câu trả lời trực tiếp cho câu hỏi của đề bài, nêu rõ bạn đồng ý hay không đồng ý.
- **Support (Luận điểm và ví dụ chứng minh - Phút 16 - 45s)**: Đưa ra 1-2 lý do thuyết phục kèm theo ví dụ cụ thể (tốt nhất là ví dụ từ kinh nghiệm cá nhân hoặc thực tế đời sống công sở).
- **Suggest (Giải pháp/Đề xuất mở rộng - Phút 46 - 60s)**: Tóm tắt lại quan điểm và đưa ra một đề xuất hoặc lời khuyên tổng quan liên quan đến chủ đề.

## Câu lệnh mẫu chi tiết ép Gemini AI đóng vai giám khảo nghiêm khắc

Để Gemini AI hoạt động như một giám khảo thực thụ, bạn hãy sao chép toàn bộ đoạn Prompt dưới đây và dán vào ô chat của Gemini:

> [!IMPORTANT]
> **Prompt giám khảo TOEIC Speaking Part 5 cho Gemini:**
> Hãy đóng vai là một giám khảo chấm thi nói TOEIC Speaking chuyên nghiệp theo tiêu chuẩn mới nhất của ETS. Tôi sẽ gửi cho bạn một đề bài TOEIC Speaking Part 5 (câu 11) kèm theo đoạn văn ghi lại bài nói của tôi (transcript).
>
> Nhiệm vụ của bạn là:
> 1. Đánh giá bài nói dựa trên 3 tiêu chí: Phát âm/Ngữ điệu (Pronunciation/Intonation), Ngữ pháp/Từ vựng (Grammar/Vocabulary), và Tính mạch lạc của lập luận (Coherence/Cohesion).
> 2. Chấm điểm bài nói theo thang điểm từ 1 đến 5 (trong đó 5 là điểm tối đa).
> 3. Chỉ ra cụ thể các lỗi sai ngữ pháp, các từ dùng sai ngữ cảnh và đề xuất từ vựng nâng band tốt hơn.
> 4. Viết lại bài nói của tôi thành một bài nói mẫu hoàn chỉnh đạt điểm 5/5 dựa trên chính ý tưởng gốc của tôi.
>
> Hãy trả lời bằng tiếng Việt trang trọng, ngắn gọn và có cấu trúc bảng rõ ràng. Đề bài và bài nói của tôi sẽ được gửi dưới đây.

Sau khi gửi câu lệnh này, bạn chỉ cần dán đề bài và transcript bài nói của mình vào để nhận được phản hồi chi tiết từ Gemini.

## Bảng ví dụ phân tích phản hồi từ AI

Dưới đây là một ví dụ minh họa về cách Gemini AI phân tích lỗi và đề xuất nâng band từ vựng cho học viên sau khi nhận Prompt:

| Câu nói gốc của bạn (Transcript) | Lỗi phát hiện từ AI | Đề xuất từ vựng nâng band của AI | Bài học rút ra |
| :--- | :--- | :--- | :--- |
| *I think working in team is good.* | Thiếu mạo từ và danh từ hóa chưa chuẩn. | `I believe that collaborating in a team environment is highly beneficial.` | Dùng từ chuyên ngành công sở (`collaborate`, `beneficial`) thay vì từ đơn giản. |
| *It help people make many ideas.* | Sai chia động từ ngôi thứ ba và collocation chưa tự nhiên. | `It enables team members to brainstorm creative solutions.` | Sử dụng cụm từ chuẩn công sở (`brainstorm solutions`). |

## Điều đáng nhớ

- Cấu trúc bài nói TOEIC Speaking Part 5 bắt buộc phải tuân thủ quy tắc 3S: State - Support - Suggest để đạt tính mạch lạc tối đa.
- Prompt gửi cho AI phải cung cấp vai trò rõ ràng và tiêu chí chấm điểm chi tiết để tránh nhận được kết quả nhận xét chung chung.
- Không lạm dụng AI viết hộ toàn bộ bài; hãy tự nói, ghi âm, chuyển thành text rồi mới đưa cho AI chấm điểm để cải thiện khả năng phản xạ tự nhiên.
- Dành thời gian học thuộc các cụm từ đề xuất nâng band (collocations) từ AI để chủ động áp dụng vào các bài nói tiếp theo.
