import { compressImage } from "../modules/utils.js";

export const imageService = {
  async uploadMultipleImages(files) {
    // Giới hạn tối đa lấy 4 ảnh đầu tiên nếu người dùng chọn quá nhiều
    const fileList = Array.from(files).slice(0, 4);

    // Nén song song toàn bộ ảnh
    const uploadPromises = fileList.map((file) =>
      compressImage(file, 800, 0.7),
    );
    return await Promise.all(uploadPromises);
  },
};
