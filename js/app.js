import { dbService } from "./services/supabase.js";
import { renderProductGrid, renderDetailModal } from "./modules/render.js";
import { copyToClipboard } from "./modules/utils.js";
import { setupFormHandler } from "./modules/form.js";

let allPosts = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadPosts();
  setupModals();

  setupFormHandler(() => {
    document.getElementById("postModal").classList.remove("active");
    loadPosts();
  });

  setupCategoryFilter();
  setupSearch();
});

async function loadPosts() {
  allPosts = await dbService.getPosts();
  const productGrid = document.getElementById("productGrid");
  renderProductGrid(productGrid, allPosts);
  setupCardClickEvents();
}

function setupCardClickEvents() {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const post = allPosts.find((p) => p.id === id);
      if (post) {
        const detailContent = document.getElementById("detailContent");
        renderDetailModal(detailContent, post);
        document.getElementById("detailModal").classList.add("active");
        setupCopyButtons();
        setupManageActions(post);
      }
    });
  });
}

// Bắt sự kiện Quản lý (Đổi trạng thái / Xóa bài)
function setupManageActions(post) {
  document.querySelectorAll(".btn-manage").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pinInput = document.getElementById("managePinInput").value.trim();

      if (!pinInput || pinInput.length !== 4) {
        alert(
          "Vui lòng nhập đúng mã PIN (4 chữ số) mà bạn đã tạo lúc đăng bài!",
        );
        return;
      }

      const action = btn.dataset.action;

      if (action === "delete") {
        if (confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")) {
          const res = await dbService.deletePost(post.id, pinInput);
          if (res.success) {
            alert("Đã xóa bài đăng thành công!");
            document.getElementById("detailModal").classList.remove("active");
            await loadPosts();
          } else {
            alert(res.message);
          }
        }
      } else if (action === "status") {
        const newStatus = btn.dataset.value;
        const res = await dbService.updateStatus(post.id, pinInput, newStatus);
        if (res.success) {
          alert("Đã cập nhật trạng thái món đồ!");
          document.getElementById("detailModal").classList.remove("active");
          await loadPosts();
        } else {
          alert(res.message);
        }
      }
    });
  });
}

function setupCopyButtons() {
  document.querySelectorAll(".btn-copy[data-copy]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      copyToClipboard(btn.dataset.copy, btn);
    });
  });
}

function setupModals() {
  const fabPostBtn = document.getElementById("fabPostBtn");
  if (fabPostBtn) {
    fabPostBtn.onclick = () => postModal.classList.add("active");
  }
  const postModal = document.getElementById("postModal");
  const detailModal = document.getElementById("detailModal");

  document.getElementById("openPostModalBtn").onclick = () =>
    postModal.classList.add("active");
  document.getElementById("closePostModal").onclick = () =>
    postModal.classList.remove("active");
  document.getElementById("closeDetailModal").onclick = () =>
    detailModal.classList.remove("active");

  window.onclick = (e) => {
    if (e.target === postModal) postModal.classList.remove("active");
    if (e.target === detailModal) detailModal.classList.remove("active");
  };
}

function setupCategoryFilter() {
  document.querySelectorAll(".cat-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document
        .querySelectorAll(".cat-pill")
        .forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      const cat = pill.dataset.cat;
      const filtered =
        cat === "all" ? allPosts : allPosts.filter((p) => p.category === cat);
      renderProductGrid(document.getElementById("productGrid"), filtered);
      setupCardClickEvents();
    });
  });
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  const handleSearch = () => {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query),
    );
    renderProductGrid(document.getElementById("productGrid"), filtered);
    setupCardClickEvents();
  };

  document.getElementById("searchBtn").onclick = handleSearch;
  searchInput.onkeyup = (e) => {
    if (e.key === "Enter") handleSearch();
  };
}
