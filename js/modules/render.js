import { sanitize, formatUrl } from "./utils.js";

export function renderProductGrid(container, posts) {
  if (posts.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px 0;">Chưa có món đồ nào được pass trong danh mục này.</p>`;
    return;
  }

  // Sắp xếp: Đồ "Còn đồ" & "Đã hẹn" lên trước, "Đã pass" đẩy xuống cuối
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") return 1;
    if (a.status !== "done" && b.status === "done") return -1;
    return 0;
  });

  container.innerHTML = sortedPosts
    .map((post) => {
      let statusText = "🟢 Còn đồ";
      let statusClass = "available";
      let cardStyle = "";

      if (post.status === "reserved") {
        statusText = "🟡 Đã có người hẹn";
        statusClass = "reserved";
      } else if (post.status === "done") {
        statusText = "🔴 Đã pass xong";
        statusClass = "reserved";
        cardStyle = "opacity: 0.55; filter: grayscale(40%);"; // Làm mờ bài đã pass
      }

      const displayImage =
        post.imageUrl || (post.imageUrls && post.imageUrls[0]) || "";

      return `
            <div class="product-card" data-id="${post.id}" style="${cardStyle}">
                <div class="card-img-wrapper">
                    <img src="${displayImage}" alt="${sanitize(post.title)}">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="card-body">
                    <div class="card-title">${sanitize(post.title)}</div>
                    <div class="card-price">${sanitize(post.price)}</div>
                    <div class="card-address"><i class="fa-solid fa-location-dot"></i> ${sanitize(post.address)}</div>
                </div>
            </div>
        `;
    })
    .join("");
}

export function renderDetailModal(container, post) {
  const images =
    post.imageUrls && post.imageUrls.length > 0
      ? post.imageUrls
      : [post.imageUrl];

  const imagesGalleryHtml = `
        <div class="main-image-box" style="margin-bottom: 10px;">
            <img id="currentMainImg" src="${images[0]}" class="detail-img" alt="${sanitize(post.title)}">
        </div>
        ${
          images.length > 1
            ? `
            <div class="thumb-list" style="display: flex; gap: 8px; overflow-x: auto;">
                ${images
                  .map(
                    (img, idx) => `
                    <img src="${img}" class="thumb-item" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; cursor: pointer; border: 2px solid ${idx === 0 ? "#ff5722" : "#eee"};" onclick="document.getElementById('currentMainImg').src='${img}'">
                `,
                  )
                  .join("")}
            </div>
        `
            : ""
        }
    `;

  container.innerHTML = `
        <div class="detail-grid">
            <div>
                ${imagesGalleryHtml}
            </div>
            <div>
                <h2>${sanitize(post.title)}</h2>
                <p class="card-price" style="font-size: 1.4rem; margin: 10px 0;">${sanitize(post.price)}</p>
                <p><strong>Mô tả món đồ:</strong></p>
                <p style="color: #555; margin-bottom: 15px; white-space: pre-line;">${sanitize(post.description)}</p>

                <div class="contact-box">
                    <h4 style="margin-bottom: 12px;"><i class="fa-solid fa-user-check"></i> Thông tin liên hệ lấy đồ:</h4>
                    
                    <div class="contact-row">
                        <span>👤 Người đăng: <strong>${sanitize(post.sellerName)}</strong></span>
                    </div>

                    <div class="contact-row">
                        <span>📞 SĐT/Zalo: <strong>${sanitize(post.phone)}</strong></span>
                        <button class="btn-copy" data-copy="${sanitize(post.phone)}">Copy SĐT</button>
                    </div>

                    ${
                      post.facebook
                        ? `
                    <div class="contact-row">
                        <span>🔗 Facebook: <strong>Xem Profile</strong></span>
                        <a href="${formatUrl(post.facebook)}" target="_blank" class="btn-copy" style="text-decoration:none;">Mở FB</a>
                    </div>
                    `
                        : ""
                    }

                    <div class="contact-row">
                        <span>📍 Địa chỉ: <strong>${sanitize(post.address)}</strong></span>
                        <button class="btn-copy" data-copy="${sanitize(post.address)}">Copy Địa Chỉ</button>
                    </div>
                </div>

                <!-- KHỐI QUẢN LÝ BÀI ĐĂNG (DÙNG PIN) -->
                <div style="margin-top: 15px; padding: 12px; background: #fff8f6; border: 1px dashed var(--primary-color); border-radius: 8px;">
                    <h4 style="font-size: 0.85rem; color: #d32f2f; margin-bottom: 8px;">
                        <i class="fa-solid fa-user-gear"></i> Chủ bài đăng (Nhập PIN 4 số để quản lý):
                    </h4>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                        <input type="password" id="managePinInput" placeholder="PIN" maxlength="4" style="width: 65px; padding: 6px; border: 1px solid #ccc; border-radius: 4px; text-align: center;">
                        <button class="btn-manage" data-action="status" data-value="available" style="background:#2e7d32; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; font-size:0.8rem;">Còn đồ</button>
                        <button class="btn-manage" data-action="status" data-value="reserved" style="background:#ed6c02; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; font-size:0.8rem;">Đã hẹn</button>
                        <button class="btn-manage" data-action="status" data-value="done" style="background:#757575; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; font-size:0.8rem;">Đã pass</button>
                        <button class="btn-manage" data-action="delete" style="background:#d32f2f; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; font-size:0.8rem;"><i class="fa-solid fa-trash"></i> Xóa</button>
                    </div>
                </div>

            </div>
        </div>
    `;
}
