// Chuẩn hóa đường dẫn URL (Tự động thêm https:// nếu thiếu)
export function formatUrl(url) {
  if (!url) return "";
  let trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return "https://" + trimmed;
  }
  return trimmed;
}

// Hàm copy 1-click có phản hồi nút bấm
export function copyToClipboard(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    const oldText = btnElement.innerHTML;
    btnElement.innerHTML = `<i class="fa-solid fa-check"></i> Đã Copy!`;
    btnElement.style.background = "#c8e6c9";
    btnElement.style.color = "#2e7d32";

    setTimeout(() => {
      btnElement.innerHTML = oldText;
      btnElement.style.background = "#e3f2fd";
      btnElement.style.color = "#1976d2";
    }, 2000);
  });
}

// Chống lỗi XSS nhúng mã độc
export function sanitize(str) {
  if (!str) return "";
  const temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
}

// Nén ảnh client-side siêu nhẹ (600px, quality 0.5) để tránh tràn LocalStorage
export function compressImage(file, maxWidth = 600, quality = 0.5) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
    };
  });
}
