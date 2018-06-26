

using System.Collections.Generic;
using System.IO;
using System.Web;

namespace NghiepVuModule.Models
{
    public class MotCua_ChungTuKemTheoViewModel
    {
        public string TenChungTu { get; set; }
        public int SLBanChinh { get; set; }
        public int SLBanSao { get; set; }
        public int SLBanPhoTo { get; set; }
        public string GhiChu { get; set; }
        public string DinhKemID { get; set; }
        public string AttachFile { get; set; }
        public long HoSoID { get; set; }
    }

}