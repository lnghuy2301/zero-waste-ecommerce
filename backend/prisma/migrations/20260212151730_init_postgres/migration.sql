-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'FIXED_AMOUNT');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('RETAIL', 'BUNDLE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "SAN_PHAM" (
    "id" SERIAL NOT NULL,
    "id_danh_muc" INTEGER NOT NULL,
    "ten_san_pham" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "loai_san_pham" "ProductType" NOT NULL DEFAULT 'RETAIL',
    "trang_thai" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "mo_ta" TEXT,
    "chat_lieu" VARCHAR(255),
    "muc_do_than_thien" INTEGER,
    "kha_nang_tai_su_dung" VARCHAR(255),
    "hinh_anh_chinh" VARCHAR(500),
    "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ngay_cap_nhat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SAN_PHAM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DANH_MUC_SAN_PHAM" (
    "id" SERIAL NOT NULL,
    "ten_danh_muc" VARCHAR(100) NOT NULL,
    "mo_ta" VARCHAR(255),

    CONSTRAINT "DANH_MUC_SAN_PHAM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CHUNG_NHAN_XANH" (
    "id" SERIAL NOT NULL,
    "ten_chung_nhan" VARCHAR(255) NOT NULL,
    "ma_chung_nhan" VARCHAR(50),
    "mo_ta" TEXT,

    CONSTRAINT "CHUNG_NHAN_XANH_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SAN_PHAM_BIEN_THE" (
    "id" SERIAL NOT NULL,
    "id_san_pham" INTEGER NOT NULL,
    "id_khuyen_mai" INTEGER,
    "sku" VARCHAR(50) NOT NULL,
    "ten_bien_the" VARCHAR(255) NOT NULL,
    "gia_ban" DECIMAL(18,2) NOT NULL,
    "ton_kho" INTEGER NOT NULL DEFAULT 0,
    "trong_luong_gram" INTEGER,
    "dung_tich_ml" INTEGER,
    "mau_sac" VARCHAR(50),
    "kich_thuoc" VARCHAR(50),

    CONSTRAINT "SAN_PHAM_BIEN_THE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CHI_TIET_SET_QUA_TANG" (
    "id" SERIAL NOT NULL,
    "id_san_pham_set" INTEGER NOT NULL,
    "id_bien_the_thanh_phan" INTEGER NOT NULL,
    "so_luong" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CHI_TIET_SET_QUA_TANG_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KHUYEN_MAI" (
    "id" SERIAL NOT NULL,
    "ma_khuyen_mai" VARCHAR(50) NOT NULL,
    "ten_chuong_trinh" VARCHAR(255) NOT NULL,
    "loai_giam_gia" "DiscountType" NOT NULL DEFAULT 'PERCENT',
    "gia_tri_giam" DECIMAL(18,2) NOT NULL,
    "ngay_bat_dau" TIMESTAMP(3) NOT NULL,
    "ngay_ket_thuc" TIMESTAMP(3) NOT NULL,
    "kich_hoat" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "KHUYEN_MAI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TAI_KHOAN" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "mat_khau" VARCHAR(255) NOT NULL,
    "quyen" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "trang_thai" BOOLEAN NOT NULL DEFAULT true,
    "id_thong_tin_khach_hang" INTEGER NOT NULL,

    CONSTRAINT "TAI_KHOAN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "THONG_TIN_KHACH_HANG" (
    "id" SERIAL NOT NULL,
    "ho_ten" VARCHAR(100) NOT NULL,
    "sdt" VARCHAR(15),
    "dia_chi" VARCHAR(255),
    "gioi_tinh" VARCHAR(10),
    "ngay_sinh" DATE,

    CONSTRAINT "THONG_TIN_KHACH_HANG_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GIO_HANG" (
    "id" SERIAL NOT NULL,
    "id_tai_khoan" INTEGER NOT NULL,
    "so_luong" INTEGER NOT NULL DEFAULT 1,
    "id_bien_the" INTEGER NOT NULL,
    "id_set_qua_tang" INTEGER,

    CONSTRAINT "GIO_HANG_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DON_HANG" (
    "id" SERIAL NOT NULL,
    "ma_don_hang" VARCHAR(20) NOT NULL,
    "id_tai_khoan" INTEGER NOT NULL,
    "tong_tien" DECIMAL(18,2) NOT NULL,
    "trang_thai" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "dia_chi_giao_hang" VARCHAR(500) NOT NULL,
    "id_phuong_thuc_tt" INTEGER NOT NULL,
    "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DON_HANG_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CHI_TIET_DON_HANG" (
    "id" SERIAL NOT NULL,
    "id_don_hang" INTEGER NOT NULL,
    "id_bien_the" INTEGER NOT NULL,
    "id_set_qua_tang" INTEGER,
    "so_luong" INTEGER NOT NULL,
    "don_gia_luc_mua" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "CHI_TIET_DON_HANG_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PHUONG_THUC_THANH_TOAN" (
    "id" SERIAL NOT NULL,
    "ten_phuong_thuc" VARCHAR(100) NOT NULL,
    "ma_phuong_thuc" VARCHAR(50) NOT NULL,
    "kich_hoat" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PHUONG_THUC_THANH_TOAN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BINH_LUAN" (
    "id" SERIAL NOT NULL,
    "noi_dung" TEXT NOT NULL,
    "danh_gia_sao" INTEGER NOT NULL DEFAULT 5,
    "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_tai_khoan" INTEGER NOT NULL,
    "id_san_pham" INTEGER NOT NULL,
    "id_binh_luan_cha" INTEGER,

    CONSTRAINT "BINH_LUAN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MEDIA_BINH_LUAN" (
    "id" SERIAL NOT NULL,
    "id_binh_luan" INTEGER NOT NULL,
    "duong_dan" VARCHAR(500) NOT NULL,
    "loai_media" VARCHAR(20) NOT NULL DEFAULT 'IMAGE',

    CONSTRAINT "MEDIA_BINH_LUAN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductGreenCert" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SAN_PHAM_slug_key" ON "SAN_PHAM"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SAN_PHAM_BIEN_THE_sku_key" ON "SAN_PHAM_BIEN_THE"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "KHUYEN_MAI_ma_khuyen_mai_key" ON "KHUYEN_MAI"("ma_khuyen_mai");

-- CreateIndex
CREATE UNIQUE INDEX "TAI_KHOAN_email_key" ON "TAI_KHOAN"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TAI_KHOAN_id_thong_tin_khach_hang_key" ON "TAI_KHOAN"("id_thong_tin_khach_hang");

-- CreateIndex
CREATE UNIQUE INDEX "DON_HANG_ma_don_hang_key" ON "DON_HANG"("ma_don_hang");

-- CreateIndex
CREATE UNIQUE INDEX "PHUONG_THUC_THANH_TOAN_ma_phuong_thuc_key" ON "PHUONG_THUC_THANH_TOAN"("ma_phuong_thuc");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductGreenCert_AB_unique" ON "_ProductGreenCert"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductGreenCert_B_index" ON "_ProductGreenCert"("B");

-- AddForeignKey
ALTER TABLE "SAN_PHAM" ADD CONSTRAINT "SAN_PHAM_id_danh_muc_fkey" FOREIGN KEY ("id_danh_muc") REFERENCES "DANH_MUC_SAN_PHAM"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SAN_PHAM_BIEN_THE" ADD CONSTRAINT "SAN_PHAM_BIEN_THE_id_san_pham_fkey" FOREIGN KEY ("id_san_pham") REFERENCES "SAN_PHAM"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SAN_PHAM_BIEN_THE" ADD CONSTRAINT "SAN_PHAM_BIEN_THE_id_khuyen_mai_fkey" FOREIGN KEY ("id_khuyen_mai") REFERENCES "KHUYEN_MAI"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CHI_TIET_SET_QUA_TANG" ADD CONSTRAINT "CHI_TIET_SET_QUA_TANG_id_san_pham_set_fkey" FOREIGN KEY ("id_san_pham_set") REFERENCES "SAN_PHAM"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CHI_TIET_SET_QUA_TANG" ADD CONSTRAINT "CHI_TIET_SET_QUA_TANG_id_bien_the_thanh_phan_fkey" FOREIGN KEY ("id_bien_the_thanh_phan") REFERENCES "SAN_PHAM_BIEN_THE"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TAI_KHOAN" ADD CONSTRAINT "TAI_KHOAN_id_thong_tin_khach_hang_fkey" FOREIGN KEY ("id_thong_tin_khach_hang") REFERENCES "THONG_TIN_KHACH_HANG"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GIO_HANG" ADD CONSTRAINT "GIO_HANG_id_tai_khoan_fkey" FOREIGN KEY ("id_tai_khoan") REFERENCES "TAI_KHOAN"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GIO_HANG" ADD CONSTRAINT "GIO_HANG_id_bien_the_fkey" FOREIGN KEY ("id_bien_the") REFERENCES "SAN_PHAM_BIEN_THE"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GIO_HANG" ADD CONSTRAINT "GIO_HANG_id_set_qua_tang_fkey" FOREIGN KEY ("id_set_qua_tang") REFERENCES "SAN_PHAM"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DON_HANG" ADD CONSTRAINT "DON_HANG_id_tai_khoan_fkey" FOREIGN KEY ("id_tai_khoan") REFERENCES "TAI_KHOAN"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DON_HANG" ADD CONSTRAINT "DON_HANG_id_phuong_thuc_tt_fkey" FOREIGN KEY ("id_phuong_thuc_tt") REFERENCES "PHUONG_THUC_THANH_TOAN"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CHI_TIET_DON_HANG" ADD CONSTRAINT "CHI_TIET_DON_HANG_id_don_hang_fkey" FOREIGN KEY ("id_don_hang") REFERENCES "DON_HANG"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CHI_TIET_DON_HANG" ADD CONSTRAINT "CHI_TIET_DON_HANG_id_bien_the_fkey" FOREIGN KEY ("id_bien_the") REFERENCES "SAN_PHAM_BIEN_THE"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BINH_LUAN" ADD CONSTRAINT "BINH_LUAN_id_tai_khoan_fkey" FOREIGN KEY ("id_tai_khoan") REFERENCES "TAI_KHOAN"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BINH_LUAN" ADD CONSTRAINT "BINH_LUAN_id_san_pham_fkey" FOREIGN KEY ("id_san_pham") REFERENCES "SAN_PHAM"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BINH_LUAN" ADD CONSTRAINT "BINH_LUAN_id_binh_luan_cha_fkey" FOREIGN KEY ("id_binh_luan_cha") REFERENCES "BINH_LUAN"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MEDIA_BINH_LUAN" ADD CONSTRAINT "MEDIA_BINH_LUAN_id_binh_luan_fkey" FOREIGN KEY ("id_binh_luan") REFERENCES "BINH_LUAN"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductGreenCert" ADD CONSTRAINT "_ProductGreenCert_A_fkey" FOREIGN KEY ("A") REFERENCES "CHUNG_NHAN_XANH"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductGreenCert" ADD CONSTRAINT "_ProductGreenCert_B_fkey" FOREIGN KEY ("B") REFERENCES "SAN_PHAM"("id") ON DELETE CASCADE ON UPDATE CASCADE;
