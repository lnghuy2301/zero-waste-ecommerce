# Zero Waste E-commerce Platform 🌿

[![Project Status: Active](https://img.shields.io/badge/Project%20Status-Active-green.svg)](https://github.com/lnghuy2301/zero-waste-ecommerce)

**Zero Waste E-commerce** là một nền tảng thương mại điện tử cấp doanh nghiệp chuyên về các sản phẩm thủ công (Handmade) và không rác thải (Zero-waste). Dự án được xây dựng với kiến trúc **Monorepo**, đảm bảo tính mở rộng và dễ quản lý.

---

## 🚀 Công nghệ sử dụng

Dự án sử dụng bộ công nghệ (Tech Stack) hiện đại:

-   **Frontend:** [Vue.js 3](https://vuejs.org/) (Composition API) + Vite.
-   **Backend:** [NestJS](https://nestjs.com/) (Node.js Framework).
-   **Database:** [PostgreSQL](https://www.postgresql.org/).
-   **ORM:** [Prisma](https://www.prisma.io/).
-   **AI Chatbot:** Python, tích hợp [Groq API](https://groq.com/).
-   **DevOps:** [Docker](https://www.docker.com/) & Docker Compose.

---

## 📂 Cấu trúc dự án (Monorepo)

```text
zero-waste-ecommerce/
├── backend/            # NestJS API, xử lý logic nghiệp vụ và thanh toán.
├── frontend/           # Giao diện Vue.js 3 cho khách hàng và quản trị.
├── chatbot/            # Dịch vụ AI Chatbot hỗ trợ khách hàng (Python).
├── docker-compose.yml  # Cấu hình khởi chạy Docker cho DB và Services.
└── package-lock.json   # Quản lý dependency.
```

---

## ✨ Tính năng chính

-   **Quản lý sản phẩm:** Hiển thị và phân loại sản phẩm thân thiện với môi trường.
-   **Giỏ hàng & Thanh toán:** Quy trình mua hàng tối ưu.
-   **AI Chatbot:** Hỗ trợ tư vấn khách hàng thông minh tích hợp Groq AI.
-   **Quản trị hệ thống (Admin Panel):** Quản lý đơn hàng, người dùng và sản phẩm.
-   **Dockerized:** Dễ dàng triển khai trên mọi môi trường.

---

## 🛠 Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- Node.js (v18+)
- Docker & Docker Compose
- Python 3.10+ (cho Chatbot)

### 2. Cài đặt các biến môi trường
Tạo file `.env` tại thư mục root và các thư mục con tương ứng (`backend`, `chatbot`) dựa trên các file `.env.example`.

### 3. Khởi chạy bằng Docker
```bash
# Khởi chạy Database và các services
docker-compose up -d
```

### 4. Cài đặt thủ công
**Backend:**
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Chatbot:**
```bash
cd chatbot
pip install -r requirements.txt
python main.py
```

---

## 🤝 Liên hệ
- **Tác giả:** [lnghuy2301](https://github.com/lnghuy2301)
- **Project Link:** [https://github.com/lnghuy2301/zero-waste-ecommerce](https://github.com/lnghuy2301/zero-waste-ecommerce)

---
*Cảm ơn bạn đã quan tâm đến dự án hướng tới môi trường của chúng tôi!* 🌍
```