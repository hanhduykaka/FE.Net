

using System.Collections.Generic;
using System.IO;
using System.Web;

namespace NghiepVuModule.Models
{
    public class FileDinhKemViewModel
    {
        public FileDinhKem file { get; set; }
   
    }
    public class FileDinhKem
    {
        public string lastMod { get; set; }
        public string lastModDate { get; set; }
        public string name { get; set; }
        public string size { get; set; }
        public string type { get; set; }
        public string id { get; set; }
    }
    public class IdModel
    {
        public string id { get; set; }
    }

}