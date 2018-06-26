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
using System.Reflection;
using System.Text;
using Business.Entities.HoSo;
using System.Globalization;
using System.Web.Script.Serialization;
using log4net;
using System.Data;
using Aspose.Words;

namespace NghiepVuModule.Controllers
{
    public class MotCuaController : BaseController
    {
        // GET: MotCua
        protected static readonly ILog Logger = LogManager.GetLogger(typeof(MotCuaController));

        public ActionResult Index(string hoSoId, string prev,string trangthai)
        {
            try
            {
                ViewBag.HoSoId = hoSoId;
                ViewBag.prev = prev + (!string.IsNullOrEmpty(trangthai) ? ("/trangthai/" + trangthai) :"");
                return View();
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        #region Thêm hồ sơ
        List<HttpPostedFileBase> _files = new List<HttpPostedFileBase>();
        public JsonResult SaveHoSo()
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var hoso = Request.Form["hoso"];
                    var chungtukemtheo = Request.Form["chungtukemtheo"];
                    var lstChungTu = JsonConvert.DeserializeObject<List<MotCua_ChungTuKemTheoViewModel>>(chungtukemtheo ?? "");
                    var lstChungTuKemTheo = new List<ChungTuKemTheo>();
                    foreach (var item in lstChungTu)
                    {
                        var file = Request.Files[item.DinhKemID];
                        var link = "";
                        if (file != null)
                        {
                            link = XuLyLuuFile(file);
                        }
                        lstChungTuKemTheo.Add(new ChungTuKemTheo
                        {
                            TenChungTu = item.TenChungTu,
                            SLBanChinh = item.SLBanChinh,
                            SLBanSao = item.SLBanSao,
                            SLPhoto = item.SLBanPhoTo,
                            GhiChu = item.GhiChu,
                            AttachFile = link != "" ? link : item.AttachFile
                        });
                    }
                    //var trangthaihoso = MotCuaService.c;

                    //var objFileDinhKemName = XuLyLuuFileMultiple(_files);
                    var objHoSoTiepNhan = JsonConvert.DeserializeObject<MotCua_HoSoTiepNhanViewModel>(hoso);
                    var hoSoTiepNhanSave = new HoSoTiepNhanSave
                    {
                        HoSoTiepNhan = new HoSoTiepNhan
                        {
                            HoSoID = objHoSoTiepNhan.HoSoID,
                            SoBienNhan = objHoSoTiepNhan.SoBienNhan,
                            NgayNhan = objHoSoTiepNhan.NgayNhan.ToDateTimeNullable(),
                            NgayHenTra = objHoSoTiepNhan.NgayHenTra.ToDateTimeNullable(),
                            LinhVucID = objHoSoTiepNhan.LinhVuc,
                            TenLinhVuc = objHoSoTiepNhan.LinhVuc_Name,
                            ThuTucID = objHoSoTiepNhan.ThuTuc,
                            TenThuTuc = objHoSoTiepNhan.ThuTuc_Name,
                            HoTenNguoiNop = objHoSoTiepNhan.HoTenNguoiNop,
                            GioiTinhID = objHoSoTiepNhan.GioiTinh,
                            NgaySinh = objHoSoTiepNhan.NgaySinh,
                            TinhThanhID = objHoSoTiepNhan.ThuongTruTinh,
                            TenTinhThanh = objHoSoTiepNhan.ThuongTruTinh_Name,
                            QuanHuyenID = objHoSoTiepNhan.ThuongTruHuyen,
                            TenQuanHuyen = objHoSoTiepNhan.ThuongTruHuyen_Name,
                            PhuongXaID = objHoSoTiepNhan.ThuongTruPhuong,
                            TenPhuongXa = objHoSoTiepNhan.ThuongTruPhuong_Name,
                            SoNha = objHoSoTiepNhan.ThuongTruSoNha,
                            LoaiGiayToID = objHoSoTiepNhan.LoaiGiayTo,
                            SoGiayTo = objHoSoTiepNhan.SoGiayTo,
                            NgayCapGiayTo = objHoSoTiepNhan.NgayCap.ToDateTimeNullable(),
                            NoiCapGiayTo = objHoSoTiepNhan.NoiCap,
                            Phone = objHoSoTiepNhan.DienThoai,
                            Email = objHoSoTiepNhan.Email,
                            CreatedUserID = User.UserID,
                            LastUpdUserID = User.UserID,
                            HienNayTinhThanhID = objHoSoTiepNhan.HienNayTinh,
                            HienNayTenTinhThanh = objHoSoTiepNhan.HienNayTinh_Name,
                            HienNayQuanHuyenID = objHoSoTiepNhan.HienNayHuyen,
                            HienNayTenQuanHuyen = objHoSoTiepNhan.HienNayHuyen_Name,
                            HienNayPhuongXaID = objHoSoTiepNhan.HienNayPhuong,
                            HienNayTenPhuongXa = objHoSoTiepNhan.HienNayPhuong_Name,
                            HienNaySoNha = objHoSoTiepNhan.HienNaySoNha,
                            LePhi = objHoSoTiepNhan.LePhi,
                            GhiChu = objHoSoTiepNhan.GhiChu,
                            TrinhDoChuyenMonID = objHoSoTiepNhan.TrinhDoChuyenMon,
                            TenTrinhDoChuyenMon = objHoSoTiepNhan.TrinhDoChuyenMon_Name,
                            HinhThucToChucID = objHoSoTiepNhan.HinhThucToChuc,
                            TenHinhThucToChuc = objHoSoTiepNhan.HinhThucToChuc_Name,
                            NoiNhanKetQuaID = objHoSoTiepNhan.NoiNhanKetQua
                        },
                        lstChungTuKemTheo = lstChungTuKemTheo
                    };
                    var json = new JavaScriptSerializer().Serialize(hoSoTiepNhanSave);
                    var response = MotCuaService.MotCua_HoSoTiepNhan_Save(hoSoTiepNhanSave);
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult XoaHoSoByHoSoID(long hosoId,string trangThaiHoSoID)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_HoSoTiepNhan_DelFullProcess(new HoSoTiepNhanFullProcessDel
                    {
                        HoSoID = hosoId,
                        UserId = User.UserID,
                        TrangThaiHoSoId = trangThaiHoSoID.ToIntNullable(),
                    });
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public ActionResult InBienNhan(int hoSoID)
        {
            try
            {

                var tableChungTu = new DataTable();
                //Thong tin chung
                var hosotiepnhan = new DataTableViewModel();
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var data = MotCuaService.MotCua_HoSoTiepNhan_InBienNhan(hoSoID);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        hosotiepnhan = data.Data;
                    else
                        return new JsonResult() { };
                }
                var fields = new List<string>();
                var value = new List<object>();
                foreach (var col in hosotiepnhan.Columns)
                {
                    fields.Add(col.Name);
                }
                foreach (var row in hosotiepnhan.Rows)
                {
                    foreach (var cell in row.Cells)
                    {
                        value.Add(cell.Value);
                    }
                }
                //Chung tu kem theo
                var chungtukemtheo = new List<ChungTuKemTheo>();
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var data = MotCuaService.MotCua_ChungTuKemTheo_GetByHoSoID(hoSoID);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        chungtukemtheo = data.Data;
                    else
                        return new JsonResult() { };
                }
                if (chungtukemtheo.Count ==0)
                {
                    chungtukemtheo.Add(new ChungTuKemTheo { STT = 0,TenChungTu="" });
                }
                tableChungTu = chungtukemtheo.ToDataTable();
                tableChungTu.TableName = "tableChungTu";
                var template = Server.MapPath(@"~/Upload/Template/InBienNhan.doc");
                var doc = new Document(template);
                doc.MailMerge.Execute(fields.ToArray(), value.ToArray());

                doc.MailMerge.ExecuteWithRegions(tableChungTu);
                doc.MailMerge.ExecuteWithRegions(tableChungTu);
                MemoryStream stream = new MemoryStream();
                doc.Save(stream, SaveFormat.Doc);
                stream.Position = 0;

                return new JsonResult()
                {
                    Data = new { Data = Convert.ToBase64String(stream.ToArray()), FileName = "InBienNhan" + hoSoID + ".doc" }
                };
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }

        }
        #endregion

        #region Func Dung chung
        public JsonResult GetHoSoById(string hosoId)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_HoSoTiepNhan_GetByHoSoId(hosoId.ToLong());
                    return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult GetDanhMucLinhVuc()
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_DM_LinhVuc_GetAll();
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult GetDanhMucTrinhDoChuyenMon()
        {
            try
            {
                using (DbMasterService = new DBMasterServiceClient())
                {
                    var response = DbMasterService.DBMaster_DM_TrinhDoChuyenMon_GetAll();
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult GetDanhMucHinhThucToChuc()
        {
            try
            {
                using (DbMasterService = new DBMasterServiceClient())
                {
                    var response = DbMasterService.DBMaster_DM_HinhThucToChuc_GetAll();
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult GetDanhMucNoiNhanKetQua()
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_E_NoiNhanKetQua_GetAll();
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult GetThuTucByLinhVucIDJsonResult(int linhvucID = 0)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_DM_ThuTuc_GetByLinhVucID(linhvucID);
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult GetThuTucByThuTucIDJsonResult(int thutucID = 0)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_DM_ThuTuc_GetByThuTucID(thutucID);
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult MotCua_GenSoBienNhanByThuTucIDJsonResult(int thutucID = 0)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_GenSoBienNhanByThuTucID(thutucID);
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult MotCua_KiemTraSoBienNhan(string SoBienNhan)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_KiemTraSoBienNhan(SoBienNhan);
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult GetDMChungTuKemTheoByThuTucIDJsonResult(int thutucID = 0)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_DM_ChungTuKemTheo_GetByThuTucID(thutucID);
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult GetChungTuKemTheoByHoSoIDJsonResult(int hoSoID = 0)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_ChungTuKemTheo_GetByHoSoID(hoSoID);
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult GetDanhMucTinhThanh()
        {
            try
            {
                using (DbMasterService = new DBMasterServiceClient())
                {
                    var response = DbMasterService.DBMaster_DM_TinhThanh_GetAll();
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult GetQuanHuyenByTinhIdJsonResult(string tinhId)
        {
            try
            {
                using (DbMasterService = new DBMasterServiceClient())
                {
                    var response = DbMasterService.DBMaster_DM_QuanHuyen_GetByTinhID(tinhId.ToInt());
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult GetPhuongXaByQuanIdJsonResult(string quanId)
        {
            try
            {
                using (DbMasterService = new DBMasterServiceClient())
                {
                    var response = DbMasterService.DBMaster_DM_PhuongXa_GetByQuanID(quanId.ToInt());
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public ActionResult GetModule(string module)
        {
            try
            {
                if (string.IsNullOrEmpty(module))
                    return Json(null, JsonRequestBehavior.AllowGet);
                var mc = new ModuleController();
                var existMods = mc.GetModulesByDefinition(PortalSettings.PortalId, module);
                if (existMods == null)
                    return Json(null, JsonRequestBehavior.AllowGet);
                foreach (var obj in existMods)
                {
                    if (obj == null) continue;
                    var pi = obj.GetType().GetProperty("ModuleID");
                    if (pi == null) continue;
                    var moduleId = (int)pi.GetValue(obj, null);
                    var tabidInfo = obj.GetType().GetProperty("TabID");
                    if (tabidInfo == null) continue;
                    var tabId = (int)tabidInfo.GetValue(obj, null);
                    var tabidstring = Globals.NavigateURL(tabId);
                    return Json(new { ModuleID = moduleId, TabID = tabidstring }, JsonRequestBehavior.AllowGet);
                }
                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
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

                var path = Path.Combine(Server.MapPath("~/Upload/MotCua/"));
                EnsureFolder(path);
                var newFile = Path.Combine(path, fileName);
                file.SaveAs(newFile);
                return "~/Upload/MotCua/" + fileName;
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
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
                {
                    if (!string.IsNullOrWhiteSpace(file.FileName))
                    {
                        var fileName = Path.GetFileName(file.FileName);
                        var uploadName = Guid.NewGuid() + "_" + DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day
                                         + DateTime.Now.Hour + DateTime.Now.Minute +
                                         DateTime.Now.Second + Path.GetExtension(file.FileName);
                        var path = Path.Combine(Server.MapPath("~/Upload/MotCua/"));
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
                }
                return new Files
                {
                    TenGoc = sTenGoc.ToString(),
                    TenUpload = sTenUpload.ToString()
                };
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        private string XuLyLuuFileMultipleString(FileDinhKemViewModel[] files)
        {
            try
            {
                if (files.Length > 0)
                {
                    foreach (var file in files)
                    {
                        if (!string.IsNullOrWhiteSpace(file.file.name))
                        {
                            string fileName = Path.GetFileNameWithoutExtension(file.file.name)
                                              + "_yyyy_MM_dd_" +
                                              +DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day
                                              + DateTime.Now.Hour + DateTime.Now.Minute +
                                              DateTime.Now.Second + Path.GetExtension(file.file.name);
                            var path = Path.Combine(Server.MapPath("~/img/"));






                            return fileName;
                        }
                        return null;
                    }
                }
                return null;
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public HttpPostedFile ConstructHttpPostedFile(byte[] data, string filename, string contentType)
        {
            try
            {
                // Get the System.Web assembly reference
                System.Reflection.Assembly systemWebAssembly = typeof(HttpPostedFileBase).Assembly;
                // Get the types of the two internal types we need
                Type typeHttpRawUploadedContent = systemWebAssembly.GetType("System.Web.HttpRawUploadedContent");
                Type typeHttpInputStream = systemWebAssembly.GetType("System.Web.HttpInputStream");

                // Prepare the signatures of the constructors we want.
                Type[] uploadedParams = { typeof(int), typeof(int) };
                Type[] streamParams = { typeHttpRawUploadedContent, typeof(int), typeof(int) };
                Type[] parameters = { typeof(string), typeof(string), typeHttpInputStream };

                // Create an HttpRawUploadedContent instance
                object uploadedContent = typeHttpRawUploadedContent
                    .GetConstructor(BindingFlags.NonPublic | BindingFlags.Instance, null, uploadedParams, null)
                    .Invoke(new object[] { data.Length, data.Length });

                // Call the AddBytes method
                typeHttpRawUploadedContent
                    .GetMethod("AddBytes", BindingFlags.NonPublic | BindingFlags.Instance)
                    .Invoke(uploadedContent, new object[] { data, 0, data.Length });

                // This is necessary if you will be using the returned content (ie to Save)
                typeHttpRawUploadedContent
                    .GetMethod("DoneAddingBytes", BindingFlags.NonPublic | BindingFlags.Instance)
                    .Invoke(uploadedContent, null);

                // Create an HttpInputStream instance
                object stream = (Stream)typeHttpInputStream
                    .GetConstructor(BindingFlags.NonPublic | BindingFlags.Instance, null, streamParams, null)
                    .Invoke(new object[] { uploadedContent, 0, data.Length });

                // Create an HttpPostedFile instance
                HttpPostedFile postedFile = (HttpPostedFile)typeof(HttpPostedFile)
                    .GetConstructor(BindingFlags.NonPublic | BindingFlags.Instance, null, parameters, null)
                    .Invoke(new object[] { filename, contentType, stream });

                return postedFile;
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        void EnsureFolder(string path)
        {
            try
            {
                string directoryName = Path.GetDirectoryName(path);
                if (!string.IsNullOrEmpty(directoryName) && !Directory.Exists(directoryName))
                {
                    Directory.CreateDirectory(directoryName);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        #endregion
    }
}