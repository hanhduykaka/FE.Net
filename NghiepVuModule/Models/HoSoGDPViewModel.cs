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
    public class HoSoGDPViewModel
    {
        public long THTGDPId { get; set; }
        public string CreatedDate { get; set; }
        public int? CreatedUserID { get; set; }
        public int? LastUpdUserID { get; set; }
        public string LastUpdDate { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public long? HoSoID { get; set; }
        public string HoTen { get; set; }
        public string KetLuan { get; set; }
        public int? LinhVucId { get; set; }
        public string NgayCapChungNhan { get; set; }
        public string NgayHenTra { get; set; }
        public string NgayNhan { get; set; }
        public string NgayQuyetDinh { get; set; }
        public int[] PhamViKinhDoanh { get; set; }
        public int? PhuongXa01 { get; set; }
        public string PhuongXa01_Name { get; set; }
        public int? QuanHuyen01 { get; set; }
        public string QuanHuyen01_Name { get; set; }
        public string SoBienNhan { get; set; }
        public int? ChungChiDuocID { get; set; }
        public string SoChungChi { get; set; }
        public string SoDKKD { get; set; }
        public string SoGiayChungNhan { get; set; }
        public string SoNha01 { get; set; }
        public string SoQuyetDinh { get; set; }
        public string TenCoSo { get; set; }
        public int? ThoiHan { get; set; }
        public string ThoiHan_Name { get; set; }
        public int? ThuTucId { get; set; }
        public int? TinhThanh01 { get; set; }
        public string TinhThanh01_Name { get; set; }
        public string TonTai { get; set; }
        public string UuDiem { get; set; }
        public string TruongDoan { get; set; }
        public string NgayKiemTra { get; set; }
        public int TrangThai { get; set; }
    }


}