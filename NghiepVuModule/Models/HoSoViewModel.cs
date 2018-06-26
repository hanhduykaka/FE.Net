/*
' Copyright (c) 2017 
'  All rights reserved.
' 
' THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
' TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
' THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
' CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
' DEALINGS IN THE SOFTWARE.
' 
*/

using System;
using System.Collections;
using System.Collections.Generic;

namespace NghiepVuModule.Models
{
    public class HoSoViewModel
    {
        public string CreatedDate { get; set; }
        public int? CreatedUserID { get; set; }
        public string Email { get; set; }
        public int? GioiTinhID { get; set; }
        public string GioiTinh { get; set; }
        public long HoSoID { get; set; }
        public string HoTen { get; set; }
        public string HoTenRequire { get; set; }
        public string LastUpdDate { get; set; }
        public int? LastUpdUserID { get; set; }
        public int? LinhVucID { get; set; }
        public string LoaiGiayTo { get; set; }
        public string LoaiGiayTo_Name { get; set; }
        public int? LoaiGiayToID { get; set; }
        public string TenLoaiGiayTo { get; set; }
        public string NgayCapGiayTo { get; set; }
        public string NgayHenTra { get; set; }
        public string NgayNhan { get; set; }
        public string NgaySinh { get; set; }
        public string NoiCapGiayTo { get; set; }
        public string Phone { get; set; }
        public long? PhuongXaID { get; set; }
        public long? QuanHuyenID { get; set; }
        public long? QuaTrinhXuLyHienTaiID { get; set; }
        public string SoBienNhan { get; set; }
        public string SoGiayTo { get; set; }

        public string TenLinhVuc { get; set; }

        public string TenPhuongXa { get; set; }
        public string TenQuanHuyen { get; set; }
        public string TenThuTuc { get; set; }
        public string TenTinhThanh { get; set; }
        public string TenTrangThaiHoSo { get; set; }
        public int? ThuTucID { get; set; }
        public long? TinhThanhID { get; set; }
        public int? TrangThaiHoSoID { get; set; }
        public string DotHoiDong { get; set; }
        public string NgayHoiDong { get; set; }
        public string NgayTrinhCap { get; set; }
        public string SoChungChi { get; set; }
        public string NgayCapChungChi { get; set; }
        public string SoQuyetDinh { get; set; }
        public string NgayQuyetDinh { get; set; }
        public string SoGiayToRequire { get; set; }
        public string SoNha01 { get; set; }
        public string SoNha02 { get; set; }
        public string DienThoai { get; set; }
        public string[] hoat_dong_chuyen_mon { get; set; }
        public string[] du_dieu_kien_hanh_nghe { get; set; }
        public string gioi_tinh { get; set; }
        public string lgt { get; set; }
        public string NoiCapChungChi { get; set; }
        public string NoiCapChungChi_Name { get; set; }
        public string ThuongTru_TinhID { get; set; }
        public string ThuongTru_TinhID_Name { get; set; }
        public string ThuongTru_HuyenID { get; set; }
        public string ThuongTru_HuyenID_Name { get; set; }
        public string ThuongTru_XaID { get; set; }
        public string ThuongTru_XaID_Name { get; set; }
        public string ThuongTru_SoNha { get; set; }
        public string ChoO_TinhID { get; set; }
        public string ChoO_TinhID_Name { get; set; }
        public string ChoO_HuyenID { get; set; }
        public string ChoO_HuyenID_Name { get; set; }
        public string ChoO_XaID { get; set; }
        public string ChoO_SoNha { get; set; }
        public string TinhThanh01 { get; set; }
        public string TinhThanh01_Name { get; set; }
        public string QuanHuyen01 { get; set; }
        public string QuanHuyen01_Name { get; set; }
        public string PhuongXa01 { get; set; }
        public string PhuongXa01_Name { get; set; }
        public string TinhThanh02 { get; set; }
        public string TinhThanh02_Name { get; set; }
        public string QuanHuyen02 { get; set; }
        public string QuanHuyen02_Name { get; set; }
        public string PhuongXa02 { get; set; }
        public string PhuongXa02_Name { get; set; }
        public long ChungChiHanhNgheYID { get; set; }
        public long ChungChiDuocID { get; set; }
        public string IsDauKy { get; set; }
        public string SoBienNhanDauKy { get; set; }
        public string NgayNhanDauKy { get; set; }
        public string NgayHenTraDauKy { get; set; }
        public string DataHinh { get; set; }
        public string NameGoc { get; set; }
        public string NameUpload { get; set; }
        public string LanCapLai { get; set; }
        public string NgayCapLai { get; set; }
        public string LyDoCapLaiId { get; set; }
        public string CapLaiId { get; set; }
        public string BoSungId { get; set; }
        public string LyDoDieuChinh { get; set; }
        public string LyDoDieuChinh_Name { get; set; }
        public string SoLanDieuChinh { get; set; }
        public string NgayDieuChinh { get; set; }
        public IEnumerable<TrinhDoViewModel> ArrTrinhDo { get; set; }
        public IEnumerable<CongTacViewModel> ArrCongTac { get; set; }

    }

    public class TrinhDoViewModel
    {
        public string NamTotNghiep { get; set; }
        public string TenTruongDaoTao { get; set; }
        public string TrinhDoChuyenMonID { get; set; }

    }

    public class CongTacViewModel
    {
        public string ThoiGianThucHanh { get; set; }
        public string TenDonViThucHanh { get; set; }
        public string IsDonViNhaNuoc { get; set; }

    }

}