import { imageService } from "../services/cloudinary.js";
import { dbService } from "../services/supabase.js";

export function setupFormHandler(onSuccess) {
  const form = document.getElementById("shareForm");
  const submitBtn = document.getElementById("submitBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "Đang nén & Tải ảnh lên...";

    try {
      const imageFiles = document.getElementById("itemImage").files;

      // Tải & nén danh sách nhiều ảnh
      const imageUrls = await imageService.uploadMultipleImages(imageFiles);

      const newPost = {
        id: "post_" + Date.now(),
        title: document.getElementById("itemTitle").value,
        category: document.getElementById("itemCategory").value,
        price: document.getElementById("itemPrice").value,
        description: document.getElementById("itemDescription").value,
        sellerName: document.getElementById("sellerName").value,
        phone: document.getElementById("sellerPhone").value,
        facebook: document.getElementById("sellerFb").value,
        address: document.getElementById("sellerAddress").value,
        pin: document.getElementById("postPin").value,
        imageUrls: imageUrls, // Lưu mảng tất cả ảnh
        imageUrl: imageUrls[0] || "", // Ảnh đầu tiên làm ảnh đại diện
        status: "available",
        createdAt: new Date().toISOString(),
      };

      await dbService.createPost(newPost);

      alert("Đăng bài thành công!");
      form.reset();
      onSuccess();
    } catch (error) {
      alert("Đã xảy ra lỗi khi đăng bài!");
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = "Đăng Tin Nhanh";
    }
  });
}
