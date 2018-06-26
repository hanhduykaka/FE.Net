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
using DanhMucModule.Models;
using System.Web;
using System.IO;
using System;
using System.Text;
using log4net;
using Aspose.Cells;
using System.Threading;
using System.Data;

namespace DanhMucModule.Controllers
{
    public class DMLoaiHoSoController : BaseController
    {
        protected static readonly ILog Logger = LogManager.GetLogger(typeof(DMLoaiHoSoController));
        MotCuaServiceClient MotCuaService;
        DBMasterServiceClient DBMasterService;
        public ActionResult Index()
        {
            return View();
        }

        #region Common
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
        public JsonResult GetTrangThai()
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_E_TrangThaiHoSo_GetAll();
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
        public JsonResult ListUserRole()
        {
            try
            {
                using (DBMasterService = new DBMasterServiceClient())
                {
                    var response = DBMasterService.DBMaster_ListCanBo_PhongBan();
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
        public JsonResult GetLoaiCapPhep()
        {
            try
            {
                using (DBMasterService = new DBMasterServiceClient())
                {
                    var response = DBMasterService.DBMaster_E_LoaiCapPhep_GetAll();
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
        public JsonResult GetLoaiLyDo()
        {
            try
            {
                using (DBMasterService = new DBMasterServiceClient())
                {
                    var response = DBMasterService.DBMaster_E_LoaiLyDo_GetAll();
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
        public JsonResult GetLoaiGoiY()
        {
            try
            {
                using (DBMasterService = new DBMasterServiceClient())
                {
                    var response = DBMasterService.DBMaster_E_LoaiGoiY_GetAll();
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

        #endregion

        #region DM_LinhVuc
        public JsonResult DM_LinhVucList(int draw, int start, int length, string tuKhoa)
        {
            try
            {
                int filteredResultsCount;
                int totalResultsCount;

                var model = new DataTableAjaxPostModel();
                model.draw = draw;
                model.start = start;
                model.length = length;

                var res = MotCua_DM_LinhVucList(model, out filteredResultsCount,
                    tuKhoa,
                    out totalResultsCount);
                var result = new List<DM_LinhVucList>(res.Count);
                result.AddRange(res.Select(s => new DM_LinhVucList
                {
                    LinhVucID = s.LinhVucID,
                    MaLinhVuc = s.MaLinhVuc,
                    TenLinhVuc = s.TenLinhVuc,
                    MoTa = s.MoTa,
                    Used = s.Used,
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
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public IList<DM_LinhVucList> MotCua_DM_LinhVucList(DataTableAjaxPostModel model,
            out int filteredResultsCount, string tuKhoa, out int totalResultsCount)
        {
            try
            {
                var take = model.length;
                var skip = model.start != 0 ? model.start / take : 0;
                var pageindex = skip + 1;
                var result = new List<DM_LinhVucList>();
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var data = MotCuaService.MotCua_DM_LinhVuc_List(tuKhoa, pageindex, take);
                    if (data.StatusCode == HttpStatusCode.OK)
                        result = data.Data.Data;
                }
                var totalCount = 0;

                if (result != null && result.Any())
                    totalCount = result.First().TotalItems ?? 0;

                filteredResultsCount = totalCount;
                totalResultsCount = totalCount;

                if (result == null)
                    return new List<DM_LinhVucList>();
                return result;
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult SaveDMLinhVuc()
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var model = Request.Form["model"];
                    var item = JsonConvert.DeserializeObject<DM_LinhVuc>(model);
                    if (Session["DMLinhVucID"] != null && Session["DMLinhVucID"].ToString() != "0")
                    {
                        item.LinhVucID = Session["DMLinhVucID"].ToString().ToInt();
                    }
                    var response = MotCuaService.MotCua_DM_LinhVuc_Save(item);
                    Session["DMLinhVucID"] = null;
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
        public JsonResult GetLinhVucByLinhVucID(string LinhVucID)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    Session["DMLinhVucID"] = LinhVucID;
                    var response = MotCuaService.MotCua_DM_LinhVuc_GetByLinhVucID(int.Parse(LinhVucID));
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
        #endregion

        #region DM_QuyTrinh_Buoc + DM_QuyTrinh_Buoc_NguoiNhan
        public JsonResult DM_QuyTrinh_Buoc_NguoiNhanList(int draw, int start, int length, string thuTucID)
        {
            try
            {
                int filteredResultsCount;
                int totalResultsCount;

                var model = new DataTableAjaxPostModel();
                model.draw = draw;
                model.start = start;
                model.length = length;

                var res = MotCua_DM_QuyTrinh_Buoc_NguoiNhanList(model, out filteredResultsCount,
                    thuTucID,
                    out totalResultsCount);
                var result = new List<DM_QuyTrinh_Buoc_NguoiNhanList>(res.Count);
                result.AddRange(res.Select(s => new DM_QuyTrinh_Buoc_NguoiNhanList
                {
                    RowNo = s.RowNo,
                    BuocID = s.BuocID,
                    TrangThaiHienTaiID = s.TrangThaiHienTaiID,
                    TrangThaiHienTai = s.TrangThaiHienTai,
                    TrangThaiTiepTheoID = s.TrangThaiTiepTheoID,
                    TrangThaiTiepTheo = s.TrangThaiTiepTheo,
                    NguoiXuLyTiepTheo = s.NguoiXuLyTiepTheo,
                    Used = s.Used,
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
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public IList<DM_QuyTrinh_Buoc_NguoiNhanList> MotCua_DM_QuyTrinh_Buoc_NguoiNhanList(DataTableAjaxPostModel model,
            out int filteredResultsCount, string thuTucID, out int totalResultsCount)
        {
            try
            {
                var take = model.length;
                var skip = model.start != 0 ? model.start / take : 0;
                var pageindex = skip + 1;
                var result = new List<DM_QuyTrinh_Buoc_NguoiNhanList>();
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var data = MotCuaService.MotCua_DM_QuyTrinh_Buoc_NguoiNhan_List(Convert.ToInt32(thuTucID), pageindex, take);
                    if (data.StatusCode == HttpStatusCode.OK)
                        result = data.Data.Data;
                }
                var totalCount = 0;

                if (result != null && result.Any())
                    totalCount = result.First().TotalItems ?? 0;

                filteredResultsCount = totalCount;
                totalResultsCount = totalCount;

                if (result == null)
                    return new List<DM_QuyTrinh_Buoc_NguoiNhanList>();
                return result;
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult SaveDMQuyTrinhThuTuc()
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var nguoixulylength = Request.Form["nguoixulylength"];
                    int nxllen = int.Parse(nguoixulylength);

                    var modelquytrinh = Request.Form["modelquytrinh"];
                    var itemquytrinh = JsonConvert.DeserializeObject<DM_QuyTrinh_Buoc>(modelquytrinh);
                    if (Session["DMBuocID"] != null && Session["DMBuocID"].ToString() != "0")
                    {
                        itemquytrinh.BuocID = Session["DMBuocID"].ToString().ToInt();
                    }

                    var lstDM_QuyTrinh_Buoc_NguoiNhan = new List<DM_QuyTrinh_Buoc_NguoiNhan>();
                    for (int i = 0; i < nxllen; i++)
                    {
                        var modelquytrinh_nguoinhan = Request.Form["model" + i.ToString()];
                        var itemquytrinh_nguoinhan = JsonConvert.DeserializeObject<DM_QuyTrinh_Buoc_NguoiNhan>(modelquytrinh_nguoinhan);

                        if (itemquytrinh.BuocID != 0) itemquytrinh_nguoinhan.BuocID = itemquytrinh.BuocID;
                        lstDM_QuyTrinh_Buoc_NguoiNhan.Add(itemquytrinh_nguoinhan);
                    }

                    var dM_QuyTrinh_Buoc_NguoiNhanSave = new DM_QuyTrinh_Buoc_NguoiNhanSave();
                    dM_QuyTrinh_Buoc_NguoiNhanSave.dm_QuyTrinh_Buoc = itemquytrinh;
                    dM_QuyTrinh_Buoc_NguoiNhanSave.lstDM_QuyTrinh_Buoc_NguoiNhan = lstDM_QuyTrinh_Buoc_NguoiNhan;

                    var response = MotCuaService.MotCua_DM_QuyTrinh_Buoc_NguoiNhan_Save(dM_QuyTrinh_Buoc_NguoiNhanSave);
                    Session["DMBuocID"] = null;
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
        public JsonResult GetQuyTrinhBuocByBuocID(string BuocID)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    Session["DMBuocID"] = BuocID;
                    var response = MotCuaService.MotCua_DM_QuyTrinh_Buoc_GetByBuocID(int.Parse(BuocID));
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
        public JsonResult GetQuyTrinhBuocNguoiNhanByBuocID(string BuocID)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_DM_QuyTrinh_Buoc_NguoiNhan_ListByBuocID(int.Parse(BuocID));
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
        #endregion

        #region DM_ThuTuc
        public JsonResult DM_ThuTucList(int draw, int start, int length, string tuKhoa)
        {
            try
            {
                int filteredResultsCount;
                int totalResultsCount;

                var model = new DataTableAjaxPostModel();
                model.draw = draw;
                model.start = start;
                model.length = length;

                var res = MotCua_DM_ThuTucList(model, out filteredResultsCount,
                    tuKhoa,
                    out totalResultsCount);
                var result = new List<DM_ThuTucList>(res.Count);
                result.AddRange(res.Select(s => new DM_ThuTucList
                {
                    LinhVucID = s.LinhVucID,
                    LoaiCapPhepID = s.LoaiCapPhepID,
                    RowNo = s.RowNo,
                    SoNgayGiaiQuyet = s.SoNgayGiaiQuyet,
                    TenLinhVuc = s.TenLinhVuc,
                    TenThuTuc = s.TenThuTuc,
                    ThoiGianNhacDenHan = s.ThoiGianNhacDenHan,
                    ThuTucID = s.ThuTucID,
                    Used = s.Used,
                    MaThuTuc = s.MaThuTuc,
                    LePhi = s.LePhi,
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
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public IList<DM_ThuTucList> MotCua_DM_ThuTucList(DataTableAjaxPostModel model,
            out int filteredResultsCount, string tuKhoa, out int totalResultsCount)
        {
            try
            {
                var take = model.length;
                var skip = model.start != 0 ? model.start / take : 0;
                var pageindex = skip + 1;
                var result = new List<DM_ThuTucList>();
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var data = MotCuaService.MotCua_DM_ThuTuc_List(tuKhoa, pageindex, take);
                    if (data.StatusCode == HttpStatusCode.OK)
                        result = data.Data.Data;
                }
                var totalCount = 0;

                if (result != null && result.Any())
                    totalCount = result.First().TotalItems ?? 0;

                filteredResultsCount = totalCount;
                totalResultsCount = totalCount;

                if (result == null)
                    return new List<DM_ThuTucList>();
                return result;
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult SaveDMThuTuc()
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var modelDM_ThuTuc = Request.Form["model"];
                    var dm_ThuTuc = JsonConvert.DeserializeObject<DM_ThuTuc>(modelDM_ThuTuc);
                    if (Session["DMThuTucID"] != null && Session["DMThuTucID"].ToString() != "0")
                    {
                        dm_ThuTuc.ThuTucID = Session["DMThuTucID"].ToString().ToInt();
                    }

                    var modelDM_ChungTuKemTheo = Request.Form["chungtukemtheo"];
                    var lstdm_ChungTuKemTheo = JsonConvert.DeserializeObject<List<DM_ChungTuKemTheo>>(modelDM_ChungTuKemTheo ?? "");

                    if (dm_ThuTuc.ThuTucID != 0)
                    {
                        foreach (var item in lstdm_ChungTuKemTheo)
                        {
                            item.ThuTucID = dm_ThuTuc.ThuTucID;
                        }
                    }

                    var dM_ThuTucSave = new DM_ThuTucSave();
                    dM_ThuTucSave.dm_ThuTuc = dm_ThuTuc;
                    dM_ThuTucSave.lstDM_ChungTuKemTheo = lstdm_ChungTuKemTheo;

                    var response = MotCuaService.MotCua_DM_ThuTuc_Save(dM_ThuTucSave);
                    Session["DMThuTucID"] = null;
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
        public JsonResult GetThuTucByThuTucID(string ThuTucID)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    Session["DMThuTucID"] = ThuTucID;
                    var response = MotCuaService.MotCua_DM_ThuTuc_GetByThuTucID(int.Parse(ThuTucID));
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
        public JsonResult GetDMChungTuKemTheoByThuTucID(string ThuTucID)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_DM_ChungTuKemTheo_GetByThuTucID(int.Parse(ThuTucID));
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
        #endregion

        #region DM_LyDo
        public JsonResult DM_LyDo_List(int draw, int start, int length, string LoaiCapPhepID, string LoaiLyDoID, string tuKhoa)
        {
            try
            {
                int filteredResultsCount;
                int totalResultsCount;

                var model = new DataTableAjaxPostModel();
                model.draw = draw;
                model.start = start;
                model.length = length;

                var res = DBMaster_DM_LyDo_List(model, out filteredResultsCount,
                    LoaiCapPhepID, LoaiLyDoID, tuKhoa,
                    out totalResultsCount);
                var result = new List<DM_LyDoList>(res.Count);
                result.AddRange(res.Select(s => new DM_LyDoList
                {
                    RowNo = s.RowNo,
                    LyDoID = s.LyDoID,
                    LoaiCapPhepID = s.LoaiCapPhepID,
                    LoaiCapPhep = s.LoaiCapPhep,
                    LoaiLyDoID = s.LoaiLyDoID,
                    LoaiLyDo = s.LoaiLyDo,
                    Ten = s.Ten,
                    Used = s.Used,
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
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public IList<DM_LyDoList> DBMaster_DM_LyDo_List(DataTableAjaxPostModel model,
            out int filteredResultsCount, string LoaiCapPhepID, string LoaiLyDoID, string tuKhoa, out int totalResultsCount)
        {
            try
            {
                var take = model.length;
                var skip = model.start != 0 ? model.start / take : 0;
                var pageindex = skip + 1;
                var result = new List<DM_LyDoList>();
                using (DBMasterService = new DBMasterServiceClient())
                {
                    var data = DBMasterService.DBMaster_DM_LyDo_List(LoaiCapPhepID, LoaiLyDoID, tuKhoa, pageindex, take);
                    if (data.StatusCode == HttpStatusCode.OK)
                        result = data.Data.Data;
                }
                var totalCount = 0;

                if (result != null && result.Any())
                    totalCount = result.First().TotalItems ?? 0;

                filteredResultsCount = totalCount;
                totalResultsCount = totalCount;

                if (result == null)
                    return new List<DM_LyDoList>();
                return result;
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult SaveDMLyDo()
        {
            try
            {
                using (DBMasterService = new DBMasterServiceClient())
                {
                    var model = Request.Form["model"];
                    var item = JsonConvert.DeserializeObject<DM_LyDo>(model);
                    if (Session["DMLyDoID"] != null && Session["DMLyDoID"].ToString() != "0")
                    {
                        item.LyDoID = Session["DMLyDoID"].ToString().ToInt();
                    }
                    var response = DBMasterService.DBMaster_DM_LyDo_Save(item);
                    Session["DMLyDoID"] = null;
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
        public JsonResult GetLyDoByLyDoID(string LyDoID)
        {
            try
            {
                using (DBMasterService = new DBMasterServiceClient())
                {
                    Session["DMLyDoID"] = LyDoID;
                    var response = DBMasterService.DBMaster_DM_LyDo_GetByLyDoID(int.Parse(LyDoID));
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
        #endregion

        #region DM_GoiY
        public JsonResult DM_GoiY_List(int draw, int start, int length, string LoaiCapPhepID, string LoaiGoiYID, string tuKhoa)
        {
            try
            {
                int filteredResultsCount;
                int totalResultsCount;

                var model = new DataTableAjaxPostModel();
                model.draw = draw;
                model.start = start;
                model.length = length;

                var res = DBMaster_DM_GoiY_List(model, out filteredResultsCount,
                    LoaiCapPhepID, LoaiGoiYID, tuKhoa,
                    out totalResultsCount);
                var result = new List<DM_GoiYList>(res.Count);
                result.AddRange(res.Select(s => new DM_GoiYList
                {
                    RowNo = s.RowNo,
                    GoiYID = s.GoiYID,
                    LoaiCapPhepID = s.LoaiCapPhepID,
                    LoaiCapPhep = s.LoaiCapPhep,
                    LoaiGoiYID = s.LoaiGoiYID,
                    LoaiGoiY = s.LoaiGoiY,
                    Ten = s.Ten,
                    Used = s.Used,
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
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public IList<DM_GoiYList> DBMaster_DM_GoiY_List(DataTableAjaxPostModel model,
            out int filteredResultsCount, string LoaiCapPhepID, string LoaiGoiYID, string tuKhoa, out int totalResultsCount)
        {
            try
            {
                var take = model.length;
                var skip = model.start != 0 ? model.start / take : 0;
                var pageindex = skip + 1;
                var result = new List<DM_GoiYList>();
                using (DBMasterService = new DBMasterServiceClient())
                {
                    var data = DBMasterService.DBMaster_DM_GoiY_List(LoaiCapPhepID, LoaiGoiYID, tuKhoa, pageindex, take);
                    if (data.StatusCode == HttpStatusCode.OK)
                        result = data.Data.Data;
                }
                var totalCount = 0;

                if (result != null && result.Any())
                    totalCount = result.First().TotalItems ?? 0;

                filteredResultsCount = totalCount;
                totalResultsCount = totalCount;

                if (result == null)
                    return new List<DM_GoiYList>();
                return result;
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }
        public JsonResult SaveDMGoiY()
        {
            try
            {
                using (DBMasterService = new DBMasterServiceClient())
                {
                    var model = Request.Form["model"];
                    var item = JsonConvert.DeserializeObject<DM_GoiY>(model);
                    if (Session["DMGoiYID"] != null && Session["DMGoiYID"].ToString() != "0")
                    {
                        item.GoiYID = Session["DMGoiYID"].ToString().ToInt();
                    }
                    var response = DBMasterService.DBMaster_DM_GoiY_Save(item);
                    Session["DMGoiYID"] = null;
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
        public JsonResult GetGoiYByGoiYID(string GoiYID)
        {
            try
            {
                using (DBMasterService = new DBMasterServiceClient())
                {
                    Session["DMGoiYID"] = GoiYID;
                    var response = DBMasterService.DBMaster_DM_GoiY_GetByGoiYID(int.Parse(GoiYID));
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
        #endregion
    }
}