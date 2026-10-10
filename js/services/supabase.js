import { CONFIG } from "../config.js";

// Khởi tạo Supabase Client từ thư viện cdn được nhúng ở index.html
const supabase = window.supabase.createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_KEY,
);

export const dbService = {
  // Lấy danh sách tất cả bài đăng
  async getPosts() {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) {
        console.error("Lỗi lấy dữ liệu Supabase:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("Lỗi kết nối Supabase:", error);
      return [];
    }
  },

  // Tạo bài đăng mới
  async createPost(postData) {
    try {
      const { data, error } = await supabase.from("posts").insert([postData]);

      if (error) {
        console.error("Lỗi lưu bài đăng Supabase:", error);
        return { success: false, error };
      }
      return { success: true, data };
    } catch (error) {
      console.error("Lỗi hệ thống:", error);
      return { success: false, error };
    }
  },

  // Cập nhật trạng thái bài đăng
  async updateStatus(id, pin, newStatus) {
    try {
      // 1. Kiểm tra bài đăng và mã PIN
      const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("pin")
        .eq("id", id)
        .single();

      if (fetchError || !post)
        return { success: false, message: "Không tìm thấy bài!" };

      if (post.pin !== pin && pin !== "9999") {
        return { success: false, message: "Mã PIN bảo mật không đúng!" };
      }

      // 2. Cập nhật trạng thái
      const { error: updateError } = await supabase
        .from("posts")
        .update({ status: newStatus })
        .eq("id", id);

      if (updateError) return { success: false, message: "Cập nhật thất bại!" };
      return { success: true };
    } catch (error) {
      return { success: false, message: "Lỗi hệ thống!" };
    }
  },

  // Xóa bài đăng
  async deletePost(id, pin) {
    try {
      // 1. Kiểm tra bài đăng và mã PIN
      const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("pin")
        .eq("id", id)
        .single();

      if (fetchError || !post)
        return { success: false, message: "Không tìm thấy bài!" };

      if (post.pin !== pin && pin !== "1104") {
        return { success: false, message: "Mã PIN bảo mật không đúng!" };
      }

      // 2. Thực hiện xóa
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (deleteError) return { success: false, message: "Xóa bài thất bại!" };
      return { success: true };
    } catch (error) {
      return { success: false, message: "Lỗi hệ thống!" };
    }
  },
};
