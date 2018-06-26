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

namespace NghiepVuModule.Models
{
    public class MotCua_HoSoTiepNhanViewModel
    {
        public long HoSoID { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public string GhiChu { get; set; }
        public int? GioiTinh { get; set; }
        public int? HienNayHuyen { get; set; }
        public string HienNayHuyen_Name { get; set; }
        public int? HienNayPhuong { get; set; }
        public string HienNayPhuong_Name { get; set; }
        public string HienNaySoNha { get; set; }
        public int? HienNayTinh { get; set; }
        public string HienNayTinh_Name { get; set; }
        public string HoTenNguoiNop { get; set; }
        public int? LinhVuc { get; set; }
        public string LinhVuc_Name { get; set; }
        public int? LoaiGiayTo { get; set; }
        public string NgayCap { get; set; }
        public string NgayHenTra { get; set; }
        public string NgayNhan { get; set; }
        public string NgaySinh { get; set; }
        public string NoiCap { get; set; }
        public string SoBienNhan { get; set; }
        public string SoGiayTo { get; set; }
        public int? ThuTuc { get; set; }
        public string ThuTuc_Name { get; set; }
        public int? ThuongTruHuyen { get; set; }
        public string ThuongTruHuyen_Name { get; set; }
        public int? ThuongTruPhuong { get; set; }
        public string ThuongTruPhuong_Name { get; set; }
        public string ThuongTruSoNha { get; set; }
        public int? ThuongTruTinh { get; set; }
        public string ThuongTruTinh_Name { get; set; }
        public long? LePhi { get; set; }
        public int? TrinhDoChuyenMon { get; set; }
        public string TrinhDoChuyenMon_Name { get; set; }
        public int? HinhThucToChuc { get; set; }
        public string HinhThucToChuc_Name { get; set; }
        public int? NoiNhanKetQua { get; set; }
    }
}