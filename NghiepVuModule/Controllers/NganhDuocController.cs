using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using Business.Entities;
using Business.Entities.Paging;
using Business.Entities.ViewModels;
using Core.Common.Utilities;
using DotNetNuke.Common;
using DotNetNuke.Entities.Modules;
using Module.Framework.UltimateClient;
using Newtonsoft.Json;
using NghiepVuModule.Models;
using System.Web;
using System.IO;
using System;
using System.Text;
using log4net;
using Aspose.Cells;
using System.Threading;
using System.Data;
using Aspose.Words;

namespace NghiepVuModule.Controllers
{
    public class NganhDuocController : BaseController
    {
        protected static readonly ILog Logger = LogManager.GetLogger(typeof(NganhDuocController));
        private readonly List<HttpPostedFileBase> _files = new List<HttpPostedFileBase>();
        // GET: NganhDuoc
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult PhiMauDich()
        {
            return View();
        }
        public ActionResult HoaChat()
        {
            return View();
        }
        public ActionResult NhaThuocGPP()
        {
            return View();
        }
        public ActionResult PhanPhoiGPP()
        {
            return View();
        }
        public ActionResult TamThan()
        {
            return View();
        }
        public ActionResult Methadone()
        {
            return View();
        }
        public ActionResult NhanDao()
        {
            return View();
        }
        public ActionResult ChungChiDuoc()
        {
            return View();
        }
        public ActionResult KinhDoanhThuoc()
        {
            return View();
        }
        public ActionResult BaoCaoTongHop()
        {
            return View();
        }

        #region GPP
        public JsonResult TraCuuGPPByPage(int draw, int start, int length,
         CNSearchViewModel chungchi
    )
        {
            try
            {
                int filteredResultsCount;
                int totalResultsCount;
                var vSearch = Request.QueryString["search[value]"];

                var model = new DataTableAjaxPostModel
                {
                    draw = draw,
                    start = start,
                    length = length,
                    search = new Search { value = vSearch }
                };

                var res = NganhDuoc_CN_GPP_Lst(model, out filteredResultsCount,
                    chungchi,
                    out totalResultsCount);
                var result = new List<CN_GPPViewModel>(res.Count);
                result.AddRange(res);
                return Json(new
                {
                    model.draw,
                    recordsTotal = totalResultsCount,
                    recordsFiltered = filteredResultsCount,
                    data = result
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public IList<CN_GPPViewModel> NganhDuoc_CN_GPP_Lst(DataTableAjaxPostModel model,
            out int filteredResultsCount, CNSearchViewModel chungchi,
            out int totalResultsCount)
        {
            try
            {
                var take = model.length;
                var skip = model.start != 0 ? model.start / take : 0;
                var pageindex = skip + 1;
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var result = new List<CN_GPPViewModel>();
                    var data = NganhDuocService.NganhDuoc_CN_GPP_Search(chungchi.SoGiayChungNhan, chungchi.NgayCapTu,
                        chungchi.NgayCapDen, chungchi.TenCoSo, chungchi.SoDKKD,
                        pageindex, take);
                    if (data.StatusCode == HttpStatusCode.OK)
                        result = data.Data.Data;

                    var totalCount = 0;

                    if (result != null && result.Any())
                        totalCount = result.First().TotalItems ?? 0;
                    filteredResultsCount = totalCount;
                    totalResultsCount = totalCount;
                    return result;
                }
            }
            catch (Exception e)
            {
                filteredResultsCount = 0;
                totalResultsCount = 0;
                Console.WriteLine(e);
                return new List<CN_GPPViewModel>();
            }

        }
        public JsonResult SaveHoSoGPP()
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var GPP = PreparingSaveGPP();
                    var response = NganhDuocService.NganhDuoc_CN_GPP_Save(GPP);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult DeleteHoSoGPPByTHTGPPI(long THTGPPID = 0)
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var response = NganhDuocService.NganhDuoc_CN_GPP_DelByTHTGPPID(THTGPPID);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult NganhDuoc_CN_GPP_XuatDanhSach(
       CNSearchViewModel chungchi)
        {
            try
            {
                var dataTable = new DataTable("DanhSachGPP");
                var dataTableView = new DataTableViewModel();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CN_GPP_XuatDanhSach(chungchi.SoGiayChungNhan, chungchi.NgayCapTu,
                        chungchi.NgayCapDen, chungchi.TenCoSo, chungchi.SoDKKD);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        dataTableView = data.Data;
                    else
                        return new JsonResult() { };
                }
                foreach (var col in dataTableView.Columns)
                {
                    dataTable.Columns.Add(col.Name, Type.GetType(col.Type));
                }
                foreach (var row in dataTableView.Rows)
                {
                    var dataRow = dataTable.NewRow();
                    foreach (var cell in row.Cells)
                    {
                        dataRow[cell.Name] = cell.Value;
                    }
                    dataTable.Rows.Add(dataRow);
                }
                var template = Server.MapPath(@"~/Upload/Template/DanhSachGPP_Template.xls");
                var workbook = new Workbook(template);
                var worksheet = workbook.Worksheets[0];
                var cells = worksheet.Cells;
                FindOptions opts = new FindOptions();
                opts.LookInType = LookInType.Values;
                Cell startcell = null;
                do
                {
                    startcell = cells.Find("startTable:" + dataTable.TableName, startcell, opts);
                    if (startcell != null)
                    {
                        startcell.Value = "";
                        cells.ImportDataTable(dataTable, false, startcell.Name);
                        cells.ClearFormats(startcell.Row, startcell.Column, startcell.Row, startcell.Column + dataTable.Columns.Count);
                    }
                } while (startcell != null);
                var stream = workbook.SaveToStream();
                stream.Position = 0;

                return new JsonResult()
                {
                    Data = new { Data = Convert.ToBase64String(stream.ToArray()), FileName = "DanhSachGPP" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xls" }
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult NganhDuoc_CN_GPP_CongBoWebsite(
      CNSearchViewModel chungchi)
        {
            try
            {
                var dataTable = new DataTable("DanhSachGPP");
                var dataTableView = new DataTableViewModel();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CN_GPP_XuatDanhSach(chungchi.SoGiayChungNhan, chungchi.NgayCapTu,
                        chungchi.NgayCapDen, chungchi.TenCoSo, chungchi.SoDKKD);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        dataTableView = data.Data;
                    else
                        return new JsonResult() { };
                }
                foreach (var col in dataTableView.Columns)
                {
                    dataTable.Columns.Add(col.Name, Type.GetType(col.Type));
                }
                foreach (var row in dataTableView.Rows)
                {
                    var dataRow = dataTable.NewRow();
                    foreach (var cell in row.Cells)
                    {
                        dataRow[cell.Name] = cell.Value;
                    }
                    dataTable.Rows.Add(dataRow);
                }
                var template = Server.MapPath(@"~/Upload/Template/CongBoGPP_Template.xls");
                var workbook = new Workbook(template);
                var worksheet = workbook.Worksheets[0];
                var cells = worksheet.Cells;
                FindOptions opts = new FindOptions();
                opts.LookInType = LookInType.Values;
                Cell startcell = null;
                do
                {
                    startcell = cells.Find("startTable:" + dataTable.TableName, startcell, opts);
                    if (startcell != null)
                    {
                        startcell.Value = "";
                        cells.ImportDataTable(dataTable, false, startcell.Name);
                        cells.ClearFormats(startcell.Row, startcell.Column, startcell.Row, startcell.Column + dataTable.Columns.Count);
                    }
                } while (startcell != null);
                var stream = workbook.SaveToStream();
                stream.Position = 0;

                return new JsonResult()
                {
                    Data = new { Data = Convert.ToBase64String(stream.ToArray()), FileName = "CongBoGPP" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xls" }
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        protected CN_GPP PreparingSaveGPP()
        {
            var item = ColectionItemGPP("model");
            var GPP = new CN_GPP
            {
                Active = 1,
                ChungChiDuocId = item.ChungChiDuocID,
                SoChungChi = item.SoChungChi,
                THTGPPId = item.THTGPPId,
                HoSoID = item.HoSoID,
                SoBienNhan = item.SoBienNhan,
                SoGiayChungNhan = item.SoGiayChungNhan,
                NgayCapChungNhan = item.NgayCapChungNhan.ToDateTimeNullable(),
                ThoiHan = item.ThoiHan_Name,
                SoQuyetDinh = item.SoQuyetDinh,
                NgayQuyetDinh = item.NgayQuyetDinh.ToDateTimeNullable(),
                TenCoSo = item.TenCoSo,
                SoDKKD = item.SoDKKD,
                TrucThuoc = item.TrucThuoc,
                TinhThanhCSId = item.TinhThanh01,
                TinhThanhCS = item.TinhThanh01_Name,
                PhuongCSId = item.PhuongXa01,
                PhuongCS = item.PhuongXa01_Name,
                QuanCSId = item.QuanHuyen01,
                QuanCS = item.QuanHuyen01_Name,
                SoNhaCS = item.SoNha01,
                DiaChiCS = item.SoNha01 + ", " + item.PhuongXa01_Name + ", " + item.QuanHuyen01_Name + ", " + item.TinhThanh01_Name,
                SoDienThoai = item.DienThoai,
                Email = item.Email,
                TruongDoanKiemTra = item.TruongDoan,
                NgayKiemTra = item.NgayKiemTra.ToDateTimeNullable(),
                UuDiem = item.UuDiem,
                TonTai = item.TonTai,
                KetLuan = item.KetLuan,
                TrangThaiGiayPhepID= (item.TrangThai != 0 && item.TrangThai !=7 && item.TrangThai !=11) ? 1 : 2,
                CreateUserId = User.UserID,
                UpdateUserId = User.UserID
            };
            if(item.PhamViKinhDoanh != null)
                foreach (var id in item.PhamViKinhDoanh)
                {
                    GPP.PhamViKinhDoanhIds += string.IsNullOrEmpty(GPP.PhamViKinhDoanhIds) ? id.ToString() : ("-" + id.ToString());
                }
            return GPP;

        }
        protected HoSoGPPViewModel ColectionItemGPP(string nameRequest)
        {
            try
            {
                var model = Request.Form[nameRequest];
                var item = JsonConvert.DeserializeObject<HoSoGPPViewModel>(model);
                return item;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
      

     
        public JsonResult GetCN_GPPByHoSoID(long HoSoID = 0)
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var response = NganhDuocService.NganhDuoc_CN_GPP_GetByHoSoID(HoSoID);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult GetCN_GPPByID(long THTGPPID = 0)
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var response = NganhDuocService.NganhDuoc_CN_GPP_GetByID(THTGPPID);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult InDeXuatGPP(long Id = 0)
        {
            try
            {
                //Thong tin chung
                var chungchi = new DataTableViewModel();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CN_GPP_InDeXuat(Id);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        chungchi = data.Data;
                    else
                        return new JsonResult() { };
                }
                var fields = new List<string>();
                var value = new List<object>();
                foreach (var col in chungchi.Columns)
                {
                    fields.Add(col.Name);
                }
                foreach (var row in chungchi.Rows)
                {
                    foreach (var cell in row.Cells)
                    {
                        value.Add(cell.Value);
                    }
                }
              
                var template = Server.MapPath(@"~/Upload/Template/InDeXuat_GPP.doc");
                var doc = new Document(template);
                doc.MailMerge.Execute(fields.ToArray(), value.ToArray());
                MemoryStream stream = new MemoryStream();
                doc.Save(stream, Aspose.Words.SaveFormat.Doc);
                stream.Position = 0;

                return new JsonResult()
                {
                    Data = new { Data = Convert.ToBase64String(stream.ToArray()), FileName = "InDeXuat_GPP_" + Id + ".doc" }
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult InChungChiGPP(long Id = 0)
        {
            try
            {
                //Thong tin chung
                var chungchi = new DataTableViewModel();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CN_GPP_InChungChi(Id);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        chungchi = data.Data;
                    else
                        return new JsonResult() { };
                }
                var fields = new List<string>();
                var value = new List<object>();
                foreach (var col in chungchi.Columns)
                {
                    fields.Add(col.Name);
                }
                foreach (var row in chungchi.Rows)
                {
                    foreach (var cell in row.Cells)
                    {
                        value.Add(cell.Value);
                    }
                }

                var template = Server.MapPath(@"~/Upload/Template/InChungChi_GPP.doc");
                var doc = new Document(template);
                doc.MailMerge.Execute(fields.ToArray(), value.ToArray());
                MemoryStream stream = new MemoryStream();
                doc.Save(stream, Aspose.Words.SaveFormat.Doc);
                stream.Position = 0;

                return new JsonResult()
                {
                    Data = new { Data = Convert.ToBase64String(stream.ToArray()), FileName = "InChungChi_GPP_" + Id + ".doc" }
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        #endregion
        #region GDP
        public JsonResult TraCuuGDPByPage(int draw, int start, int length,
         CNSearchViewModel chungchi
    )
        {
            try
            {
                int filteredResultsCount;
                int totalResultsCount;
                var vSearch = Request.QueryString["search[value]"];

                var model = new DataTableAjaxPostModel
                {
                    draw = draw,
                    start = start,
                    length = length,
                    search = new Search { value = vSearch }
                };

                var res = NganhDuoc_CN_GDP_Lst(model, out filteredResultsCount,
                    chungchi,
                    out totalResultsCount);
                var result = new List<CN_GDPViewModel>(res.Count);
                result.AddRange(res);
                return Json(new
                {
                    model.draw,
                    recordsTotal = totalResultsCount,
                    recordsFiltered = filteredResultsCount,
                    data = result
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }

        public IList<CN_GDPViewModel> NganhDuoc_CN_GDP_Lst(DataTableAjaxPostModel model,
            out int filteredResultsCount, CNSearchViewModel chungchi,
            out int totalResultsCount)
        {
            try
            {
                var take = model.length;
                var skip = model.start != 0 ? model.start / take : 0;
                var pageindex = skip + 1;
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var result = new List<CN_GDPViewModel>();
                    var data = NganhDuocService.NganhDuoc_CN_GDP_Search(chungchi.SoGiayChungNhan, chungchi.NgayCapTu,
                        chungchi.NgayCapDen, chungchi.TenCoSo, chungchi.SoDKKD,
                        pageindex, take);
                    if (data.StatusCode == HttpStatusCode.OK)
                        result = data.Data.Data;

                    var totalCount = 0;

                    if (result != null && result.Any())
                        totalCount = result.First().TotalItems ?? 0;
                    filteredResultsCount = totalCount;
                    totalResultsCount = totalCount;
                    return result;
                }
            }
            catch (Exception e)
            {
                filteredResultsCount = 0;
                totalResultsCount = 0;
                Console.WriteLine(e);
                return new List<CN_GDPViewModel>();
            }

        }
        public JsonResult SaveHoSoGDP()
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var GDP = PreparingSaveGDP();
                    var response = NganhDuocService.NganhDuoc_CN_GDP_Save(GDP);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult DeleteHoSoGDPByTHTGDPID(long THTGDPID = 0)
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var response = NganhDuocService.NganhDuoc_CN_GDP_DelByTHTGDPID(THTGDPID);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult NganhDuoc_CN_GDP_XuatDanhSach(
       CNSearchViewModel chungchi)
        {
            try
            {
                var dataTable = new DataTable("DanhSachGDP");
                var dataTableView = new DataTableViewModel();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CN_GDP_XuatDanhSach(chungchi.SoGiayChungNhan, chungchi.NgayCapTu,
                        chungchi.NgayCapDen, chungchi.TenCoSo, chungchi.SoDKKD);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        dataTableView = data.Data;
                    else
                        return new JsonResult() { };
                }
                foreach (var col in dataTableView.Columns)
                {
                    dataTable.Columns.Add(col.Name, Type.GetType(col.Type));
                }
                foreach (var row in dataTableView.Rows)
                {
                    var dataRow = dataTable.NewRow();
                    foreach (var cell in row.Cells)
                    {
                        dataRow[cell.Name] = cell.Value;
                    }
                    dataTable.Rows.Add(dataRow);
                }
                var template = Server.MapPath(@"~/Upload/Template/DanhSachGDP_Template.xls");
                var workbook = new Workbook(template);
                var worksheet = workbook.Worksheets[0];
                var cells = worksheet.Cells;
                FindOptions opts = new FindOptions();
                opts.LookInType = LookInType.Values;
                Cell startcell = null;
                do
                {
                    startcell = cells.Find("startTable:" + dataTable.TableName, startcell, opts);
                    if (startcell != null)
                    {
                        startcell.Value = "";
                        cells.ImportDataTable(dataTable, false, startcell.Name);
                        cells.ClearFormats(startcell.Row, startcell.Column, startcell.Row, startcell.Column + dataTable.Columns.Count);
                    }
                } while (startcell != null);
                var stream = workbook.SaveToStream();
                stream.Position = 0;

                return new JsonResult()
                {
                    Data = new { Data = Convert.ToBase64String(stream.ToArray()), FileName = "DanhSachGDP" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xls" }
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult NganhDuoc_CN_GDP_CongBoWebsite(
      CNSearchViewModel chungchi)
        {
            try
            {
                var dataTable = new DataTable("DanhSachGDP");
                var dataTableView = new DataTableViewModel();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CN_GDP_XuatDanhSach(chungchi.SoGiayChungNhan, chungchi.NgayCapTu,
                        chungchi.NgayCapDen, chungchi.TenCoSo, chungchi.SoDKKD);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        dataTableView = data.Data;
                    else
                        return new JsonResult() { };
                }
                foreach (var col in dataTableView.Columns)
                {
                    dataTable.Columns.Add(col.Name, Type.GetType(col.Type));
                }
                foreach (var row in dataTableView.Rows)
                {
                    var dataRow = dataTable.NewRow();
                    foreach (var cell in row.Cells)
                    {
                        dataRow[cell.Name] = cell.Value;
                    }
                    dataTable.Rows.Add(dataRow);
                }
                var template = Server.MapPath(@"~/Upload/Template/CongBoGDP_Template.xls");
                var workbook = new Workbook(template);
                var worksheet = workbook.Worksheets[0];
                var cells = worksheet.Cells;
                FindOptions opts = new FindOptions();
                opts.LookInType = LookInType.Values;
                Cell startcell = null;
                do
                {
                    startcell = cells.Find("startTable:" + dataTable.TableName, startcell, opts);
                    if (startcell != null)
                    {
                        startcell.Value = "";
                        cells.ImportDataTable(dataTable, false, startcell.Name);
                        cells.ClearFormats(startcell.Row, startcell.Column, startcell.Row, startcell.Column + dataTable.Columns.Count);
                    }
                } while (startcell != null);
                var stream = workbook.SaveToStream();
                stream.Position = 0;

                return new JsonResult()
                {
                    Data = new { Data = Convert.ToBase64String(stream.ToArray()), FileName = "CongBoGDP" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xls" }
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        protected CN_GDPSave PreparingSaveGDP()
        {
            var item = ColectionItemGDP("model");
            var GDP = new CN_GDP
            {
                Active = 1,
                ChungChiDuocId = item.ChungChiDuocID,
                SoChungChi = item.SoChungChi,
                THTGDPId = item.THTGDPId,
                HoSoID = item.HoSoID,
                SoBienNhan = item.SoBienNhan,
                SoGiayChungNhan = item.SoGiayChungNhan,
                NgayCapChungNhan = item.NgayCapChungNhan.ToDateTimeNullable(),
                ThoiHan = item.ThoiHan_Name,
                SoQuyetDinh = item.SoQuyetDinh,
                NgayQuyetDinh = item.NgayQuyetDinh.ToDateTimeNullable(),
                TenCoSo = item.TenCoSo,
                SoDKKD = item.SoDKKD,
                TinhThanhCSId = item.TinhThanh01,
                TinhThanhCS = item.TinhThanh01_Name,
                PhuongCSId = item.PhuongXa01,
                PhuongCS = item.PhuongXa01_Name,
                QuanCSId = item.QuanHuyen01,
                QuanCS = item.QuanHuyen01_Name,
                SoNhaCS = item.SoNha01,
                DiaChiCS = item.SoNha01 + ", " + item.PhuongXa01_Name + ", " + item.QuanHuyen01_Name + ", " + item.TinhThanh01_Name,
                SoDienThoai = item.DienThoai,
                Email = item.Email,
                TruongDoanKiemTra = item.TruongDoan,
                NgayKiemTra = item.NgayKiemTra.ToDateTimeNullable(),
                UuDiem = item.UuDiem,
                TonTai = item.TonTai,
                KetLuan = item.KetLuan,
                TrangThaiGiayPhepID = (item.TrangThai != 0 && item.TrangThai != 7 && item.TrangThai != 11) ? 1 : 2,
                CreateUserId = User.UserID,
                UpdateUserId = User.UserID
            };
            if (item.PhamViKinhDoanh != null)
                foreach (var id in item.PhamViKinhDoanh)
                {
                    GDP.PhamViKinhDoanhIds += string.IsNullOrEmpty(GDP.PhamViKinhDoanhIds) ? id.ToString() : ("-" + id.ToString());
                }
            var dsKhoView = ColectionItemGDP_DSKho("dsKho");
            var dsKhoDelView = ColectionItemGDP_DSKho("dsKhoDel");
            var dsKho = new List<CN_GDP_DSKho>();
            foreach(var ele in dsKhoView)
            {
                dsKho.Add(new CN_GDP_DSKho
                {
                    THTGDPDSKhoId = ele.THTGDPDSKhoId,
                    THTGDPId = item.THTGDPId,
                    TenKho = ele.TenKho,
                    DiaChiKho = ele.DiaChiKho,
                    Active = 1,
                    GhiChu = ele.GhiChu,
                    CreateUserId = User.UserID,
                    UpdateUserId = User.UserID
                });
            }
            foreach (var ele in dsKhoDelView)
            {
                dsKho.Add(new CN_GDP_DSKho
                {
                    THTGDPDSKhoId = ele.THTGDPDSKhoId,
                    THTGDPId = item.THTGDPId,
                    Active = 0,
                });
            }
            return  new CN_GDPSave {
                gDP=GDP,
                lstgDP_DSKho= dsKho
            };

        }
        protected HoSoGDPViewModel ColectionItemGDP(string nameRequest)
        {
            try
            {
                var model = Request.Form[nameRequest];
                var item = JsonConvert.DeserializeObject<HoSoGDPViewModel>(model);
                return item;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        protected List<HoSoGDP_DSKhoViewModel> ColectionItemGDP_DSKho(string nameRequest)
        {
            try
            {
                var model = Request.Form[nameRequest];
                var item = JsonConvert.DeserializeObject<List<HoSoGDP_DSKhoViewModel>>(model);
                return item;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }


        public JsonResult GetCN_GDPByHoSoID(long HoSoID = 0)
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var response = NganhDuocService.NganhDuoc_CN_GDP_GetByHoSoID(HoSoID);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult GetCN_GDPByID(long THTGDPID = 0)
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var response = NganhDuocService.NganhDuoc_CN_GDP_GetByID(THTGDPID);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult InDeXuatGDP(long Id = 0)
        {
            try
            {
                //Thong tin chung
                var chungchi = new DataTableViewModel();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CN_GDP_InDeXuat(Id);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        chungchi = data.Data;
                    else
                        return new JsonResult() { };
                }
                var fields = new List<string>();
                var value = new List<object>();
                foreach (var col in chungchi.Columns)
                {
                    fields.Add(col.Name);
                }
                foreach (var row in chungchi.Rows)
                {
                    foreach (var cell in row.Cells)
                    {
                        value.Add(cell.Value);
                    }
                }
                //DSKho
                var DSKho = new List<CN_GDP_DSKho>();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CN_GDP_DSKho_GetByTHTGDPId(Id);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        DSKho = data.Data;
                    else
                        return new JsonResult() { };
                }
                if (DSKho.Count == 0)
                {
                    DSKho.Add(new CN_GDP_DSKho());
                }
                DataTable tableDSKho = new DataTable();
                tableDSKho = DSKho.ToDataTable();
                tableDSKho.TableName = "tableDSKho";
                var template = Server.MapPath(@"~/Upload/Template/InDeXuat_GDP.doc");
                var doc = new Document(template);
                doc.MailMerge.Execute(fields.ToArray(), value.ToArray());
                doc.MailMerge.ExecuteWithRegions(tableDSKho);
                MemoryStream stream = new MemoryStream();
                doc.Save(stream, Aspose.Words.SaveFormat.Doc);
                stream.Position = 0;

                return new JsonResult()
                {
                    Data = new { Data = Convert.ToBase64String(stream.ToArray()), FileName = "InDeXuat_GDP_" + Id + ".doc" }
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult InChungChiGDP(long Id = 0)
        {
            try
            {
                //Thong tin chung
                var chungchi = new DataTableViewModel();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CN_GDP_InChungChi(Id);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        chungchi = data.Data;
                    else
                        return new JsonResult() { };
                }
                var fields = new List<string>();
                var value = new List<object>();
                foreach (var col in chungchi.Columns)
                {
                    fields.Add(col.Name);
                }
                foreach (var row in chungchi.Rows)
                {
                    foreach (var cell in row.Cells)
                    {
                        value.Add(cell.Value);
                    }
                }
                //DSKho
                var DSKho = new List<CN_GDP_DSKho>();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CN_GDP_DSKho_GetByTHTGDPId(Id);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        DSKho = data.Data;
                    else
                        return new JsonResult() { };
                }
                if (DSKho.Count == 0)
                {
                    DSKho.Add(new CN_GDP_DSKho ());
                }
                DataTable tableDSKho = new DataTable();
                tableDSKho = DSKho.ToDataTable();
                tableDSKho.TableName = "tableDSKho";
                var template = Server.MapPath(@"~/Upload/Template/InChungChi_GDP.doc");
                var doc = new Document(template);
                doc.MailMerge.Execute(fields.ToArray(), value.ToArray());
                doc.MailMerge.ExecuteWithRegions(tableDSKho);
                MemoryStream stream = new MemoryStream();
                doc.Save(stream, Aspose.Words.SaveFormat.Doc);
                stream.Position = 0;

                return new JsonResult()
                {
                    Data = new { Data = Convert.ToBase64String(stream.ToArray()), FileName = "InChungChi_GDP_" + Id + ".doc" }
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        #endregion

        #region CCDuoc

        public JsonResult SaveHoSoCCDuoc()
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var chungchi = PreparingSaveCCDuoc("0");
                    var response = NganhDuocService.NganhDuoc_CC_Duoc_Save(chungchi);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content },
                        JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        protected CC_DuocSave PreparingSaveCCDuoc(string loai)
        {
            var fileHinhAnh = Request.Files["img"];
            for (var i = 0; i < Request.Files.Count; i++)
            {
                if (Request.Files.AllKeys[i] == "img") continue;
                var itemF = Request.Files[i];
                _files.Add(itemF);
            }
            var item = ColectionItemChungChi("model");
            var objFileDinhKemName = _files.Count > 0 ? XuLyLuuFileMultiple(_files) : new Files();
            var anhMinhHoa = fileHinhAnh != null ? XuLyLuuFile(fileHinhAnh) : item.DataHinh;
            var lstTrinhDo = new List<CC_Duoc_TDCM>();
            var lstQuatrinh = new List<CC_Duoc_QTTH>();

            if (item.ArrTrinhDo?.Any() == true)
                lstTrinhDo.AddRange(item.ArrTrinhDo.Select(i =>
                    new CC_Duoc_TDCM
                    {
                        ChungChiDuocID = item.ChungChiDuocID,
                        NamTotNghiep = i.NamTotNghiep,
                        TenTruongDaoTao = i.TenTruongDaoTao,
                        TrinhDoChuyenMonID = i.TrinhDoChuyenMonID.ToIntNullable()
                    }));
            if (item.ArrCongTac?.Any() == true)
                lstQuatrinh.AddRange(item.ArrCongTac.Select(i => new CC_Duoc_QTTH
                {
                    ChungChiDuocID = item.ChungChiDuocID,
                    IsDonViNhaNuoc = i.IsDonViNhaNuoc.ToBoolNullable(),
                    TenDonViThucHanh = i.TenDonViThucHanh,
                    ThoiGianThucHanh = i.ThoiGianThucHanh
                }));
            var cC_Duoc = loai == "1"
                ? PreparingChungChiBoSung(item, anhMinhHoa, objFileDinhKemName)
                : PreparingChungChiMoi_vs_CapLai(item, anhMinhHoa, objFileDinhKemName);
            var chungChi = new CC_DuocSave
            {
                cC_Duoc = cC_Duoc,
                lstCC_Duoc_TDCM = lstTrinhDo,
                lstCC_Duoc_QTTH = lstQuatrinh
            };
            chungChi.cC_Duoc.SoBienNhanDauKy = item.SoBienNhan;
            chungChi.cC_Duoc.NgayHenTraDauKy = item.NgayHenTra.ToDateTimeNullable();
            chungChi.cC_Duoc.NgayNhanDauKy = item.NgayNhan.ToDateTimeNullable();
            return chungChi;
        }
        protected CC_Duoc PreparingChungChiBoSung(HoSoViewModel item, string anhMinhHoa,
           Files objFileDinhKemName)
        {
            var cC_Duoc = new CC_Duoc
            {
                SoGiayTo = item.SoGiayTo,
                SoChungChi = item.SoChungChi,
                ChungChiDuocId = item.ChungChiDuocID,
                HinhAnh = anhMinhHoa,
                AttachOriginalName = Join2StringByKeyCheckNull(item.NameGoc, objFileDinhKemName.TenGoc, "|"),
                AttachUploadName = Join2StringByKeyCheckNull(item.NameUpload, objFileDinhKemName.TenUpload, "|"),
                DuDieuKienHanhNghe = item.du_dieu_kien_hanh_nghe != null
                    ? string.Join("-", item.du_dieu_kien_hanh_nghe)
                    : null,
                PhamViHoatDongID =
                    item.hoat_dong_chuyen_mon != null ? string.Join("-", item.hoat_dong_chuyen_mon) : null,
                Email = item.Email,
                HoTen = item.HoTen,
                GioiTinh = item.GioiTinh.ToIntNullable(),
                ChoO_SoNha = item.ChoO_SoNha,
                ChoO_TinhID = item.ChoO_TinhID.ToLongNullable(),
                ChoO_XaID = item.ChoO_XaID.ToLongNullable(),
                ChoO_DiaChi = FuncDiaChi(item.SoNha02, item.PhuongXa02_Name, item.QuanHuyen02_Name, item.TinhThanh02_Name),
                ChoO_HuyenID = item.ChoO_HuyenID.ToLongNullable(),
                CreatedDate = item.CreatedDate.ToDateTimeNullable(),
                CreatedUserID = item.CreatedUserID ?? User.UserID,
                DotHoiDong = item.DotHoiDong,
                DuDieuKienHanhNghes = item.du_dieu_kien_hanh_nghe != null
                    ? string.Join("-", item.du_dieu_kien_hanh_nghe)
                    : null,
                HoSoID = item.HoSoID,
                LastUpdUserID = User.UserID,
                LoaiGiayTo = item.LoaiGiayTo.ToIntNullable(),
                NgaySinh = item.NgaySinh,
                NoiCapGiayTo = item.NoiCapGiayTo,
                NgayCapGiayTo = item.NgayCapGiayTo.ToDateTimeNullable(),
                Id = "",

                PhamViHoatDongs =
                    item.hoat_dong_chuyen_mon != null ? string.Join("-", item.hoat_dong_chuyen_mon) : null,
                Phone = item.DienThoai,
                SoQuyetDinh = item.SoQuyetDinh,
                ThuongTru_DiaChi = FuncDiaChi(item.SoNha01, item.PhuongXa01_Name, item.QuanHuyen01_Name, item.TinhThanh01_Name),
                ThuongTru_HuyenID = item.ThuongTru_HuyenID.ToLongNullable(),
                ThuongTru_SoNha = item.ThuongTru_SoNha,
                ThuongTru_TinhID = item.ThuongTru_TinhID.ToLongNullable(),
                ThuongTru_XaID = item.ThuongTru_XaID.ToLongNullable(),
                TrangThaiGiayPhepID = (item.TrangThaiHoSoID != 0 && item.TrangThaiHoSoID != 7 && item.TrangThaiHoSoID != 11) ? 1 : 2
            };
            return cC_Duoc;
        }

        protected CC_Duoc PreparingChungChiMoi_vs_CapLai(HoSoViewModel item, string anhMinhHoa,
            Files objFileDinhKemName)
        {
            var cC_Duoc = new CC_Duoc
            {
                SoGiayTo = item.SoGiayToRequire,
                SoChungChi = item.SoChungChi,
                ChungChiDuocId = item.ChungChiDuocID,
                HinhAnh = anhMinhHoa,
                AttachOriginalName = Join2StringByKeyCheckNull(item.NameGoc, objFileDinhKemName.TenGoc, "|"),
                AttachUploadName = Join2StringByKeyCheckNull(item.NameUpload, objFileDinhKemName.TenUpload, "|"),
                DuDieuKienHanhNghe = item.du_dieu_kien_hanh_nghe != null
                    ? string.Join("-", item.du_dieu_kien_hanh_nghe)
                    : null,
                PhamViHoatDongID =
                    item.hoat_dong_chuyen_mon != null ? string.Join("-", item.hoat_dong_chuyen_mon) : null,
                Email = item.Email,
                HoTen = item.HoTenRequire,
                GioiTinh = item.gioi_tinh.ToIntNullable(),
                ChoO_SoNha = item.SoNha02,
                ChoO_TinhID = item.TinhThanh02.ToLongNullable(),
                ChoO_XaID = item.PhuongXa02.ToLongNullable(),
                ChoO_DiaChi = FuncDiaChi(item.SoNha02, item.PhuongXa02_Name, item.QuanHuyen02_Name, item.TinhThanh02_Name),
                ChoO_HuyenID = item.QuanHuyen02.ToLongNullable(),
                CreatedDate = item.CreatedDate.ToDateTimeNullable(),
                CreatedUserID = item.CreatedUserID ?? User.UserID,
                DotHoiDong = item.DotHoiDong,
                DuDieuKienHanhNghes = item.du_dieu_kien_hanh_nghe != null
                    ? string.Join("-", item.du_dieu_kien_hanh_nghe)
                    : null,
                HoSoID = item.HoSoID,
                LastUpdUserID = User.UserID,
                LoaiGiayTo = item.lgt.ToIntNullable(),
                NgayCap = item.NgayCapChungChi.ToDateTimeNullable(),
                NgayCapGiayTo = item.NgayCapGiayTo.ToDateTimeNullable(),
                NgayHoiDong = item.NgayHoiDong.ToDateTimeNullable(),
                NgayQuyetDinh = item.NgayQuyetDinh.ToDateTimeNullable(),
                NgaySinh = item.NgaySinh,
                NgayTrinhCap = item.NgayTrinhCap.ToDateTimeNullable(),
                NoiCapGiayTo = item.NoiCapGiayTo,
                Id = "",
                NoiCapChungChiID = item.NoiCapChungChi.ToIntNullable(),
                PhamViHoatDongs =
                    item.hoat_dong_chuyen_mon != null ? string.Join("-", item.hoat_dong_chuyen_mon) : null,
                Phone = item.DienThoai,
                SoQuyetDinh = item.SoQuyetDinh,
                ThuongTru_DiaChi = FuncDiaChi(item.SoNha01, item.PhuongXa01_Name, item.QuanHuyen01_Name, item.TinhThanh01_Name),
                ThuongTru_HuyenID = item.QuanHuyen01.ToLongNullable(),
                ThuongTru_SoNha = item.SoNha01,
                ThuongTru_TinhID = item.TinhThanh01.ToLongNullable(),
                ThuongTru_XaID = item.PhuongXa01.ToLongNullable(),
                TrangThaiGiayPhepID = (item.TrangThaiHoSoID != 0 && item.TrangThaiHoSoID != 7 && item.TrangThaiHoSoID != 11) ? 1 : 2,
                IsDauKy = item.HoSoID == 0 ? true : false
            };
            return cC_Duoc;
        }
        protected HoSoViewModel ColectionItemChungChi(string nameRequest)
        {
            try
            {
                var model = Request.Form[nameRequest];
                var item = JsonConvert.DeserializeObject<HoSoViewModel>(model);
                return item;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult GetCCDuocByHoSoID(long HoSoID = 0)
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var response = NganhDuocService.NganhDuoc_CC_Duoc_GetByHoSoID(HoSoID);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult GetCCDuocByID(long ChungChiDuocID = 0)
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var response = NganhDuocService.NganhDuoc_CC_Duoc_GetByID(ChungChiDuocID);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult DeleteHoSoCCDuocByChungChiDuocID(long ChungChiDuocID = 0)
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var response = NganhDuocService.NganhDuoc_CC_Duoc_DelByChungChiDuocId(ChungChiDuocID);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult InDeXuatCCDuoc(long Id = 0)
        {
            try
            {
                //Thong tin chung
                var chungchi = new DataTableViewModel();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CC_Duoc_InDeXuat(Id);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        chungchi = data.Data;
                    else
                        return new JsonResult() { };
                }
                var fields = new List<string>();
                var value = new List<object>();
                foreach (var col in chungchi.Columns)
                {
                    fields.Add(col.Name);
                }
                foreach (var row in chungchi.Rows)
                {
                    foreach (var cell in row.Cells)
                    {
                        value.Add(cell.Value);
                    }
                }
                //QTTH
                var QTTH = new List<CC_Duoc_QTTH>();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CC_Duoc_QTTH_GetByChungChiDuocID(Id);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        QTTH = data.Data;
                    else
                        return new JsonResult() { };
                }
                if (QTTH.Count == 0)
                {
                    QTTH.Add(new CC_Duoc_QTTH());
                }
                DataTable tableQTTH = new DataTable();
                tableQTTH = QTTH.ToDataTable();
                tableQTTH.TableName = "tableQTTH";
                //TDCM
                var TDCM = new List<CC_Duoc_TDCM>();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CC_Duoc_TDCM_GetByChungChiDuocID(Id);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        TDCM = data.Data;
                    else
                        return new JsonResult() { };
                }
                if (TDCM.Count == 0)
                {
                    TDCM.Add(new CC_Duoc_TDCM());
                }
                DataTable tableTDCM = new DataTable();
                tableTDCM = TDCM.ToDataTable();
                tableTDCM.TableName = "tableTDCM";
                var template = Server.MapPath(@"~/Upload/Template/InDeXuat_CCDuoc.doc");
                var doc = new Document(template);
                doc.MailMerge.Execute(fields.ToArray(), value.ToArray());
                doc.MailMerge.ExecuteWithRegions(tableQTTH);
                doc.MailMerge.ExecuteWithRegions(tableTDCM);
                MemoryStream stream = new MemoryStream();
                doc.Save(stream, Aspose.Words.SaveFormat.Doc);
                stream.Position = 0;

                return new JsonResult()
                {
                    Data = new { Data = Convert.ToBase64String(stream.ToArray()), FileName = "InDeXuat_CCDuoc_" + Id + ".doc" }
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult InChungChiCCDuoc(long Id = 0)
        {
            try
            {
                //Thong tin chung
                var chungchi = new DataTableViewModel();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CC_Duoc_InDeXuat(Id);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        chungchi = data.Data;
                    else
                        return new JsonResult() { };
                }
                var fields = new List<string>();
                var value = new List<object>();
                foreach (var col in chungchi.Columns)
                {
                    fields.Add(col.Name);
                }
                foreach (var row in chungchi.Rows)
                {
                    foreach (var cell in row.Cells)
                    {
                        value.Add(cell.Value);
                    }
                }
                //QTTH
                var QTTH = new List<CC_Duoc_QTTH>();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CC_Duoc_QTTH_GetByChungChiDuocID(Id);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        QTTH = data.Data;
                    else
                        return new JsonResult() { };
                }
                if (QTTH.Count == 0)
                {
                    QTTH.Add(new CC_Duoc_QTTH());
                }
                DataTable tableQTTH = new DataTable();
                tableQTTH = QTTH.ToDataTable();
                tableQTTH.TableName = "tableQTTH";
                //TDCM
                var TDCM = new List<CC_Duoc_TDCM>();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CC_Duoc_TDCM_GetByChungChiDuocID(Id);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        TDCM = data.Data;
                    else
                        return new JsonResult() { };
                }
                if (TDCM.Count == 0)
                {
                    TDCM.Add(new CC_Duoc_TDCM());
                }
                DataTable tableTDCM = new DataTable();
                tableTDCM = TDCM.ToDataTable();
                tableTDCM.TableName = "tableTDCM";
                var template = Server.MapPath(@"~/Upload/Template/InChungChi_CCDuoc.doc");
                var doc = new Document(template);
                doc.MailMerge.Execute(fields.ToArray(), value.ToArray());
                doc.MailMerge.ExecuteWithRegions(tableQTTH);
                doc.MailMerge.ExecuteWithRegions(tableTDCM);
                MemoryStream stream = new MemoryStream();
                doc.Save(stream, Aspose.Words.SaveFormat.Doc);
                stream.Position = 0;

                return new JsonResult()
                {
                    Data = new { Data = Convert.ToBase64String(stream.ToArray()), FileName = "InChungChi_CCDuoc_" + Id + ".doc" }
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult NganhDuoc_CC_Duoc_XuatDanhSach(
       ChungChiDuocSearchViewModel chungchi)
        {
            try
            {
                var dataTable = new DataTable("DanhSachCCDuoc");
                var dataTableView = new DataTableViewModel();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CC_Duoc_XuatDanhSach(chungchi.SoChungChi_Search, chungchi.NgayNhanTu_Search,
                        chungchi.NgayNhanDen_Search, chungchi.NguoiNop_Search, chungchi.SoGiayTo_Search, chungchi.TrangThai);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        dataTableView = data.Data;
                    else
                        return new JsonResult() { };
                }
                foreach (var col in dataTableView.Columns)
                {
                    dataTable.Columns.Add(col.Name, Type.GetType(col.Type));
                }
                foreach (var row in dataTableView.Rows)
                {
                    var dataRow = dataTable.NewRow();
                    foreach (var cell in row.Cells)
                    {
                        dataRow[cell.Name] = cell.Value;
                    }
                    dataTable.Rows.Add(dataRow);
                }
                var template = Server.MapPath(@"~/Upload/Template/DanhSachCCDuoc_Template.xls");
                var workbook = new Workbook(template);
                var worksheet = workbook.Worksheets[0];
                var cells = worksheet.Cells;
                FindOptions opts = new FindOptions();
                opts.LookInType = LookInType.Values;
                Cell startcell = null;
                do
                {
                    startcell = cells.Find("startTable:" + dataTable.TableName, startcell, opts);
                    if (startcell != null)
                    {
                        startcell.Value = "";
                        cells.ImportDataTable(dataTable, false, startcell.Name);
                        cells.ClearFormats(startcell.Row, startcell.Column, startcell.Row, startcell.Column + dataTable.Columns.Count);
                    }
                } while (startcell != null);
                var stream = workbook.SaveToStream();
                stream.Position = 0;

                return new JsonResult()
                {
                    Data = new { Data = Convert.ToBase64String(stream.ToArray()), FileName = "DanhSachCCDuoc" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xls" }
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult NganhDuoc_CC_Duoc_CongBoWebsite(
      ChungChiDuocSearchViewModel chungchi)
        {
            try
            {
                var dataTable = new DataTable("DanhSachCCDuoc");
                var dataTableView = new DataTableViewModel();
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var data = NganhDuocService.NganhDuoc_CC_Duoc_CongBoWebsite(chungchi.SoChungChi_Search, chungchi.NgayNhanTu_Search,
                        chungchi.NgayNhanDen_Search, chungchi.NguoiNop_Search, chungchi.SoGiayTo_Search, chungchi.TrangThai);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        dataTableView = data.Data;
                    else
                        return new JsonResult() { };
                }
                foreach (var col in dataTableView.Columns)
                {
                    dataTable.Columns.Add(col.Name, Type.GetType(col.Type));
                }
                foreach (var row in dataTableView.Rows)
                {
                    var dataRow = dataTable.NewRow();
                    foreach (var cell in row.Cells)
                    {
                        dataRow[cell.Name] = cell.Value;
                    }
                    dataTable.Rows.Add(dataRow);
                }
                var template = Server.MapPath(@"~/Upload/Template/CongBoCCDuoc_Template.xls");
                var workbook = new Workbook(template);
                var worksheet = workbook.Worksheets[0];
                var cells = worksheet.Cells;
                FindOptions opts = new FindOptions();
                opts.LookInType = LookInType.Values;
                Cell startcell = null;
                do
                {
                    startcell = cells.Find("startTable:" + dataTable.TableName, startcell, opts);
                    if (startcell != null)
                    {
                        startcell.Value = "";
                        cells.ImportDataTable(dataTable, false, startcell.Name);
                        cells.ClearFormats(startcell.Row, startcell.Column, startcell.Row, startcell.Column + dataTable.Columns.Count);
                    }
                } while (startcell != null);
                var stream = workbook.SaveToStream();
                stream.Position = 0;

                return new JsonResult()
                {
                    Data = new { Data = Convert.ToBase64String(stream.ToArray()), FileName = "CongBoCCDuoc" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xls" }
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        #endregion

        #region CCDuoc Cap lai
        public JsonResult GetChungChiDuoc_CapLai_GetByHoSoID(string hoSoID)
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var response = NganhDuocService.NganhDuoc_CC_Duoc_CapLai_GetByHoSoID(hoSoID.ToLong());
                    return Json(
                        response.StatusCode != HttpStatusCode.OK ? null : new { response.StatusCode, response.Content },
                        JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        #endregion

        public JsonResult GetDanhMucGoiYByLoaiGoiYID(int loaiGoiYID = 0, int thuTucId = 0, string search = "")
        {
            try
            {
                using (DbMasterService = new DBMasterServiceClient())
                {
                    var response = DbMasterService.DBMaster_DM_GoiY_GetByLoaiGoiYID(loaiGoiYID, thuTucId, search);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult GetChungChiBySoChungChi(string soChungChi)
        {
            try
            {
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var response = NganhDuocService.NganhDuoc_CC_Duoc_GetBySoChungChi(soChungChi);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public JsonResult TraCuuChungChiByPage(int draw, int start, int length,
          ChungChiDuocSearchViewModel chungchi
     )
        {
            try
            {
                int filteredResultsCount;
                int totalResultsCount;
                var vSearch = Request.QueryString["search[value]"];

                var model = new DataTableAjaxPostModel
                {
                    draw = draw,
                    start = start,
                    length = length,
                    search = new Search { value = vSearch }
                };

                var res = NganhDuoc_CC_Duoc_Lst(model, out filteredResultsCount,
                    chungchi,
                    out totalResultsCount);
                var result = new List<CC_DuocViewModel>(res.Count);
                result.AddRange(res.Select(s => new CC_DuocViewModel
                {
                    SoChungChi = s.SoChungChi,
                    NgayCap = s.NgayCap,
                    HoTen = s.HoTen,
                    ChungChiDuocID = s.ChungChiDuocID,
                    SoGiayTo = s.SoGiayTo,
                    ChoO_DiaChi = s.ChoO_DiaChi,
                    PhamViHoatDongChuyenMons = s.PhamViHoatDongChuyenMons,
                    TrangThaiGiayPhep = s.TrangThaiGiayPhep,
                    TrangThaiGiayPhepID = s.TrangThaiGiayPhepID,
                    RowNo = s.RowNo,
                    TotalItems = s.TotalItems
                }));
                return Json(new
                {
                    model.draw,
                    recordsTotal = totalResultsCount,
                    recordsFiltered = filteredResultsCount,
                    data = result
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
        public IList<CC_DuocViewModel> NganhDuoc_CC_Duoc_Lst(DataTableAjaxPostModel model,
         out int filteredResultsCount, ChungChiDuocSearchViewModel chungchi,
         out int totalResultsCount)
        {
            try
            {
                var take = model.length;
                var skip = model.start != 0 ? model.start / take : 0;
                var pageindex = skip + 1;
                using (NganhDuocService = new NganhDuocServiceClient())
                {
                    var result = new List<CC_DuocViewModel>();
                    var data = NganhDuocService.NganhDuoc_CC_Duoc_Lst(chungchi.SoChungChi_Search, chungchi.NgayNhanTu_Search,
                        chungchi.NgayNhanDen_Search, chungchi.NguoiNop_Search, chungchi.SoGiayTo_Search, chungchi.TrangThai,
                        pageindex, take);
                    if (data.StatusCode == HttpStatusCode.OK)
                        result = data.Data.Data;

                    var totalCount = 0;

                    if (result != null && result.Any())
                        totalCount = result.First().TotalItems ?? 0;
                    filteredResultsCount = totalCount;
                    totalResultsCount = totalCount;
                    return result;
                }
            }
            catch (Exception e)
            {
                filteredResultsCount = 0;
                totalResultsCount = 0;
                Console.WriteLine(e);
                return new List<CC_DuocViewModel>();
            }

        }
        #region function dung chung
        protected string FuncDiaChi(string soNha, string xa, string huyen, string tinh)
        {
            var diachi = new StringBuilder();
            diachi.Append(soNha);
            diachi.Append(string.IsNullOrWhiteSpace(xa) ? "" : ", " + xa);
            diachi.Append(string.IsNullOrWhiteSpace(huyen) ? "" : ", " + huyen);
            diachi.Append(string.IsNullOrWhiteSpace(tinh) ? "" : ", " + tinh);
            return diachi.ToString();
        }
        private string XuLyLuuFile(HttpPostedFileBase file)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(file?.FileName)) return null;
                var fileName = Path.GetFileNameWithoutExtension(file.FileName)
                               + "_yyyy_MM_dd_" +
                               +DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day
                               + DateTime.Now.Hour + DateTime.Now.Minute +
                               DateTime.Now.Second + Path.GetExtension(file.FileName);

                var path = Path.Combine(Server.MapPath(AppSetting.PathFileUpload));
                EnsureFolder(path);
                var newFile = Path.Combine(path, fileName);
                file.SaveAs(newFile);
                return fileName;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        private Files XuLyLuuFileMultiple(List<HttpPostedFileBase> files)
        {
            try
            {
                if (files.Count <= 0) return null;
                var sTenGoc = new StringBuilder();
                var sTenUpload = new StringBuilder();
                var flag = 1;
                foreach (var file in files)
                    if (!string.IsNullOrWhiteSpace(file.FileName))
                    {
                        var fileName = Path.GetFileName(file.FileName);
                        var uploadName = Guid.NewGuid() + "_" + DateTime.Now.Year + DateTime.Now.Month +
                                         DateTime.Now.Day
                                         + DateTime.Now.Hour + DateTime.Now.Minute +
                                         DateTime.Now.Second + Path.GetExtension(file.FileName);
                        var path = Path.Combine(Server.MapPath(AppSetting.PathFileUpload));
                        EnsureFolder(path);
                        file.SaveAs(Path.Combine(path, uploadName));
                        if (flag != 1)
                        {
                            sTenGoc.Append("|");
                            sTenUpload.Append("|");
                        }
                        sTenGoc.Append(fileName);
                        sTenUpload.Append(uploadName);
                        flag = 2;
                    }
                return new Files
                {
                    TenGoc = sTenGoc.ToString(),
                    TenUpload = sTenUpload.ToString()
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        private void EnsureFolder(string path)
        {
            try
            {
                var directoryName = Path.GetDirectoryName(path);
                if (!string.IsNullOrEmpty(directoryName) && !Directory.Exists(directoryName))
                    Directory.CreateDirectory(directoryName);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        protected string Join2StringByKeyCheckNull(string strA, string strB, string key)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(strA))
                    return strB;
                if (string.IsNullOrWhiteSpace(strB)) return strA;
                return strA + key + strB;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult DBMaster_DM_GoiY_PopupUpd(int goiYID,string ten,int thuTucId,int loaiGoiYID)
        {
            try
            {
                var obj = new DM_GoiYSave
                {
                    GoiYID = goiYID,
                    Ten = ten,
                    ThuTucID = thuTucId,
                    LoaiGoiYID = loaiGoiYID,
                    Used=true
                };
                using (DbMasterService = new DBMasterServiceClient())
                {
                    var response = DbMasterService.DBMaster_DM_GoiY_PopupUpd(obj);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return null;
            }

        }
        public JsonResult DBMaster_DM_GoiY_PopupDel(int goiYID)
        {
            try
            {
                using (DbMasterService = new DBMasterServiceClient())
                {
                    var response = DbMasterService.DBMaster_DM_GoiY_PopupDel(goiYID);
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return null;
            }

        }
        #endregion

    }
}