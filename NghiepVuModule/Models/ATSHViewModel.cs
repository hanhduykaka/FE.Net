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

using System.Collections.Generic;

namespace NghiepVuModule.Models
{
    public class ATSHViewModel
    {
        public string CapDoAnToanSinhHoc { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public string HoSoID { get; set; }
        public string Id { get; set; }
        public string IsDauKy { get; set; }
        public string LinhVucId { get; set; }
        public string NgayCap { get; set; }
        public string NgayHenTra { get; set; }
        public string NgayNhan { get; set; }
        public string PhongXetNghiem { get; set; }
        public string PhuongXa01 { get; set; }
        public string PhuongXa01_Name { get; set; }
        public string QuanHuyen01 { get; set; }
        public string QuanHuyen01_Name { get; set; }
        public string SoBienNhan { get; set; }
        public string SoChungNhan { get; set; }
        public string SoNha01 { get; set; }
        public string TenCoSo { get; set; }
        public string ThoiHan { get; set; }
        public string ThoiHan_Name { get; set; }
        public string ThuTucId { get; set; }
        public string TinhThanh01 { get; set; }
        public string TinhThanh01_Name { get; set; }
        public IEnumerable<NhanSuViewModel> ArrNhanSu { get; set; }
        public IEnumerable<TrangThietBiViewModel> ArrTrangThietBi { get; set; }
    }

    public class NhanSuViewModel
    {
        public string HoTen { get; set; }
        public string ChucDanh { get; set; }
        public string TrinhDoChuyenMonID { get; set; }
        public string CongViecPhuTrach { get; set; }
    }

    public class TrangThietBiViewModel
    {
        public string TenThietBi { get; set; }
        public string KyHieu { get; set; }
        public string BaoDuong { get; set; }
        public string HangSX { get; set; }
        public string NamSX { get; set; }
        public string NuocSX { get; set; }
        public string TinhTrangSuDung { get; set; }
        public string GhiChu { get; set; }
    }
}