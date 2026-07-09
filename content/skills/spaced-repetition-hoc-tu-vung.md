---
title: "Spaced Repetition: Khoa học đằng sau phương pháp lặp lại ngắt quãng"
description: "Khám phá thuật toán SuperMemo-2 và phương pháp hộp Leitner để tự thiết lập hệ thống ghi nhớ từ vựng tiếng Anh tối ưu."
date: "2026-07-07"
category: "skills"
tags:
  - "spaced repetition"
  - "phương pháp học"
  - "ghi nhớ từ vựng"
---

# Spaced Repetition: Khoa học đằng sau phương pháp lặp lại ngắt quãng

Ghi nhớ từ vựng luôn là thử thách lớn nhất đối với bất kỳ người học ngoại ngữ nào.

Nhiều người dành hàng giờ mỗi ngày để chép từ vựng ra giấy, nhưng chỉ sau một tuần, hầu hết chúng đều biến mất khỏi bộ não.

Phương pháp học vẹt, nhồi nhét này hoàn toàn đi ngược lại cơ chế lưu trữ thông tin sinh học của con người. Để giữ thông tin lâu dài trong bộ nhớ, bạn bắt buộc phải hiểu rõ cơ chế khoa học của phương pháp **Lặp lại ngắt quãng (Spaced Repetition)** và các thuật toán toán học đằng sau nó.

## Bẻ gãy Đường cong lãng quên của Hermann Ebbinghaus

Năm 1885, nhà tâm lý học người Đức Hermann Ebbinghaus đã thực hiện một nghiên cứu chấn động về trí nhớ con người.

Ông phát hiện ra rằng thông tin mới nạp vào não bộ sẽ bị lãng quên với tốc độ cực kỳ nhanh theo một mô hình toán học gọi là **Đường cong lãng quên (Forgetting Curve)**.

- Chỉ sau 20 phút: Bạn quên đi 42% lượng thông tin vừa nạp.
- Sau 24 giờ: Khoảng 70% lượng thông tin biến mất khỏi bộ nhớ.
- Sau 30 ngày: Bạn chỉ còn giữ lại được khoảng 20% thông tin ban đầu.

Spaced Repetition bẻ gãy đường cong này bằng cách tính toán thời điểm ôn tập tối ưu: **Ngay tại thời điểm bạn chuẩn bị quên đi thông tin đó**.

Mỗi lần bạn thực hiện hành động truy xuất thông tin chủ động (Active Recall) ngay trước thời điểm sắp quên, đường cong lãng quên sẽ được thiết lập lại từ đầu, đồng thời góc dốc của đường cong sẽ phẳng hơn ở các chu kỳ tiếp theo. Điều này có nghĩa là thời gian lưu trữ thông tin trong não bộ cho từ vựng đó sẽ tăng lên gấp đôi, gấp ba sau mỗi lần ôn tập thành công.

## Giải mã thuật toán SuperMemo-2 (SM-2) đằng sau ứng dụng Anki

Hầu hết các phần mềm học từ vựng thông minh hiện nay (như Anki) đều hoạt động dựa trên một thuật toán toán học nổi tiếng gọi là **SuperMemo-2 (SM-2)**, được phát triển bởi nhà khoa học Ba Lan Piotr Woźniak vào những năm 1980.

Thuật toán SM-2 tính toán khoảng cách ngày ôn tập tiếp theo (Interval - $I$) dựa trên độ khó của từ vựng và phản hồi trực tiếp của người học:

1. **Hệ số dễ (Easiness Factor - E-Factor / $EF$)**: Bắt đầu ở mức mặc định là $2.5$. Đây là hệ số mô tả mức độ dễ nhớ của một từ.
2. **Khoảng cách ngày ôn tập ($I$)**:
   - Lần ôn tập thứ nhất ($I(1)$): Sau $1$ ngày.
   - Lần ôn tập thứ hai ($I(2)$): Sau $6$ ngày.
   - Lần ôn tập thứ $n$ ($I(n)$): Được tính bằng công thức: $I(n) = I(n-1) \times EF$
3. **Phản hồi của người học (Quality of response - $q$)**: Sau mỗi lần ôn tập, bạn sẽ tự đánh giá mức độ nhớ từ trên thang điểm từ $0$ đến $5$:
   - $5$: Nhớ hoàn hảo không chút ngập ngừng.
   - $4$: Nhớ đúng nhưng có chút ngập ngừng nhẹ.
   - $3$: Nhớ đúng nhưng mất nhiều nỗ lực suy nghĩ.
   - $2$: Nhìn đáp án mới nhớ ra, cảm thấy quen thuộc.
   - $1$: Đoán sai từ.
   - $0$: Hoàn toàn không nhớ gì.

Thuật toán sẽ tự động điều chỉnh $EF$ dựa trên điểm số $q$ của bạn. Nếu bạn chọn nút "Dễ" ($q=5$), $EF$ tăng lên, khiến khoảng cách ngày ôn tập tiếp theo phình to ra rất nhanh. Nếu bạn chọn nút "Khó" ($q<3$), $EF$ giảm xuống và từ đó sẽ xuất hiện thường xuyên hơn để bạn ôn tập.

Cơ chế toán học này đảm bảo bạn luôn dành thời gian cho những từ mình thực sự yếu, thay vì lãng phí thời gian ôn tập những từ đã thuộc lòng.

## Cách quản lý hệ thống hộp Leitner thủ công khi số lượng thẻ lên hàng nghìn

Nếu không muốn sử dụng phần mềm trên điện thoại, bạn hoàn toàn có thể tự xây dựng một hệ thống lặp lại ngắt quãng vật lý tại nhà bằng phương pháp **Hộp Leitner (Leitner Box System)** sử dụng các thẻ giấy (flashcards).

Hệ thống gồm 5 chiếc hộp được đánh số thứ tự từ 1 đến 5 đại diện cho các chu kỳ ôn tập khác nhau:

- **Hộp 1**: Ôn tập hằng ngày (Mỗi ngày).
- **Hộp 2**: Ôn tập cách ngày (3 ngày/lần).
- **Hộp 3**: Ôn tập hằng tuần (7 ngày/lần).
- **Hộp 4**: Ôn tập hai tuần một lần (14 ngày/lần).
- **Hộp 5**: Ôn tập hằng tháng (30 ngày/lần).

### Quy trình vận hành và quản lý khi quy mô thẻ tăng lên hàng ngàn:
1. **Khởi đầu**: Tất cả thẻ từ vựng mới đều được đặt vào Hộp 1.
2. **Quy tắc dịch chuyển**:
   - Khi ôn tập một thẻ ở bất kỳ hộp nào, nếu bạn trả lời **Đúng**: Thẻ đó được thăng cấp lên hộp tiếp theo (Ví dụ: từ Hộp 2 lên Hộp 3).
   - Nếu bạn trả lời **Sai**: Thẻ đó lập tức bị giáng chức trở về **Hộp 1**, bất kể trước đó nó đang nằm ở Hộp 4 hay Hộp 5. Quy tắc nghiêm ngặt này buộc bạn phải học lại từ đầu những từ đã bị lãng quên.
3. **Quản lý dung lượng lớn (Hơn 1000 thẻ)**:
   - Khi số lượng thẻ tăng lên quá lớn, Hộp 1 và Hộp 2 sẽ bị quá tải, gây cảm giác nản lòng khi học hằng ngày.
   - **Giải pháp**: Áp dụng quy tắc khống chế số lượng thẻ học mới. Chỉ nạp tối đa **15 thẻ mới** vào Hộp 1 mỗi ngày. Chỉ khi nào số lượng thẻ trong Hộp 1 giảm xuống dưới 30 thẻ (nhờ việc bạn học thuộc và đẩy chúng lên Hộp 2), bạn mới được phép nạp thêm thẻ mới vào Hộp 1.
   - Sử dụng các tấm vách ngăn màu (color dividers) trong mỗi hộp để phân chia thẻ theo từng tuần học, giúp việc định vị lịch ôn tập trở nên khoa học và không bị nhầm lẫn.

## Điều đáng nhớ

- Spaced Repetition bẻ gãy đường cong lãng quên Ebbinghaus bằng cách lên lịch ôn tập đúng thời điểm sắp quên.
- Thuật toán SM-2 (dùng trong Anki) tính toán khoảng cách ngày ôn tập dựa trên hệ số dễ (EF) và phản hồi thực tế của người học.
- Trả lời sai trên hệ thống Spaced Repetition sẽ đưa từ vựng đó trở lại vạch xuất phát ban đầu để củng cố lại.
- Phương pháp hộp Leitner vật lý là giải pháp thay thế tuyệt vời cho app, đòi hỏi tính kỷ luật hệ thống cao.
- Khống chế số lượng thẻ học mới hằng ngày để tránh hiện tượng quá tải hệ thống khi quy mô thẻ lên hàng ngàn.
