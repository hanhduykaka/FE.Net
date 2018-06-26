

using System.Collections.Generic;

namespace NghiepVuModule.Models
{
    public class LuongYViewModel
    {
       
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public string HoSoID { get; set; }
        public string HoTenRequire { get; set; }
        public string Id { get; set; }
        public string IsDauKy { get; set; }
        public string LinhVucId { get; set; }
        public string NgayCapChungChi { get; set; }
        public string NgayCapGiayTo { get; set; }
        public string NgayHenTra { get; set; }
        public string NgayNhan { get; set; }
        public string NgayQuyetDinh { get; set; }
        public string NgaySinh { get; set; }
        public string NoiCapGiayTo { get; set; }
        public string SoGiayToRequire { get; set; }
        public string SoQuyetDinh { get; set; }
        public string PhuongXa01 { get; set; }
        public string PhuongXa01_Name { get; set; }
        public string PhuongXa02 { get; set; }
        public string PhuongXa02_Name { get; set; }
        public string QuanHuyen01 { get; set; }
        public string QuanHuyen02 { get; set; }
        public string QuanHuyen01_Name { get; set; }
        public string QuanHuyen02_Name { get; set; }
        public string SoBienNhan { get; set; }
        public string SoChungNhan { get; set; }
        public string SoNha01 { get; set; }
        public string SoNha02 { get; set; }
        public string ThuTucId { get; set; }
        public string TinhThanh01 { get; set; }
        public string TinhThanh02 { get; set; }
        public string TinhThanh01_Name { get; set; }
        public string TinhThanh02_Name { get; set; }
        public string gioi_tinh { get; set; }
        public string lgt { get; set; }
        public string[] du_dieu_kien_hanh_nghe { get; set; }
        public IEnumerable<QuaTrinhHanhNgheViewModel> ArrLuongY { get; set; }
        public string DataHinh { get; set; }

    }

    public class QuaTrinhHanhNgheViewModel
    {
        public string ChucVu { get; set; }
        public string NoiLamViec { get; set; }
        public string PhamViHoatDong { get; set; }
        public string ThoiGian { get; set; }
    }

  
}