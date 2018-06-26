using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Aspose.Cells;
using Business.Entities;
using Business.Entities.Paging;
using Business.Entities.ViewModels;
using Core.Common.Utilities;
using DotNetNuke.Common;
using DotNetNuke.Entities.Modules;
using log4net;
using Module.Framework.UltimateClient;
using Newtonsoft.Json;
using NghiepVuModule.Models;

namespace NghiepVuModule.Controllers
{
    public class HoSoController : BaseController
    {
        protected static readonly ILog Logger = LogManager.GetLogger(typeof(HoSoController));

        #region Hồ sơ đang xử lý

        public ActionResult Index(string trangThai)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(trangThai))
                    ViewBag.TrangThai = trangThai;
                return View();
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult GetWorkList(bool isFilter = false, string linhvucid = "", string thuTucId = "",
            string soBienNhan = "", string ngayNhanTu = "", string ngayNhanDen = "", string nguoiNop = "",
            string soCMND = "")
        {
            if (!isFilter)
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var userId = User.UserID;
                    var data = MotCuaService.MotCua_WorkList_CountByTrangThaiHoSoIDId_UserID(userId);
                    if (data.StatusCode == HttpStatusCode.OK)
                        return Json(data.Data, JsonRequestBehavior.AllowGet);
                }
            else
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var userId = User.UserID;
                    var data = MotCuaService.MotCua_WorkList_CountByFilter(linhvucid, thuTucId, soBienNhan
                        , ngayNhanTu, ngayNhanDen, nguoiNop, soCMND, userId);
                    if (data.StatusCode == HttpStatusCode.OK)
                        return Json(data.Data, JsonRequestBehavior.AllowGet);
                }
            return Json(null, JsonRequestBehavior.AllowGet);
        }

        public IList<HoSoTiepNhanViewModel> GetDanhSachHoSoFromDbase(DataTableAjaxPostModel model,
            out int filteredResultsCount, string trangThai, string linhvucid, string thuTucId,
            string soBienNhan, string ngayNhanTu, string ngayNhanDen, string nguoiNop, string soCMND,
            out int totalResultsCount)
        {
            try
            {
                var take = model.length;
                var skip = model.start != 0 ? model.start / take : 0;
                var pageindex = skip + 1;
                var result = new List<HoSoTiepNhanViewModel>();

                using (MotCuaService = new MotCuaServiceClient())
                {
                    var data = MotCuaService.MotCua_HoSoTiepNhan_GetByCondition(linhvucid, thuTucId, soBienNhan
                        , ngayNhanTu, ngayNhanDen, nguoiNop, soCMND, User.UserID.ToString(), trangThai, pageindex,
                        take);
                    if (data.StatusCode == HttpStatusCode.OK)
                        result = data.Data.Data;
                }

                var totalCount = 0;

                if (result != null && result.Any())
                    totalCount = result.First().TotalItems ?? 0;

                filteredResultsCount = totalCount;
                totalResultsCount = totalCount;

                if (result == null)
                    return new List<HoSoTiepNhanViewModel>();
                return result;
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult DanhSachHoSoByPage(int draw, int start, int length,
            string trangThai, string linhVucId, string thuTucId,
            string soBienNhan, string ngayNhanTu, string ngayNhanDen, string nguoiNop, string soCMND
        )
        {
            try
            {
                int filteredResultsCount;
                int totalResultsCount;
                var vSearch = Request.QueryString["search[value]"];

                var model = new DataTableAjaxPostModel();
                model.draw = draw;
                model.start = start;
                model.length = length;
                model.search = new Search { value = vSearch };

                var res = GetDanhSachHoSoFromDbase(model, out filteredResultsCount,
                    trangThai, linhVucId, thuTucId, soBienNhan, ngayNhanTu, ngayNhanDen, nguoiNop, soCMND,
                    out totalResultsCount);
                var result = new List<HoSoTiepNhanViewModel>(res.Count);
                result.AddRange(res.Select(s => new HoSoTiepNhanViewModel
                {
                    HoSoID = s.HoSoID,
                    HoTenNguoiNop = s.HoTenNguoiNop,
                    NgayHenTra = s.NgayHenTra,
                    TenLinhVuc = s.TenLinhVuc,
                    NgayNhan = s.NgayNhan,
                    NoiDungXuLy = s.NoiDungXuLy,
                    RowNo = s.RowNo,
                    SoBienNhan = s.SoBienNhan,
                    TenThuTuc = s.TenThuTuc,
                    TenTrangThaiHoSo = s.TenTrangThaiHoSo,
                    TotalItems = s.TotalItems,
                    ThuTucID = s.ThuTucID,
                    LinhVucID = s.LinhVucID,
                    Star = s.Star,
                    Alert = s.Alert
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

        public ActionResult MotCua_HoSoTiepNhan_XuatDanhSachHoSo(string trangThai, string linhVucId, string thuTucId,
            string soBienNhan, string ngayNhanTu, string ngayNhanDen, string nguoiNop, string soCMND, string listHoSoID
        )
        {
            try
            {
                var dataTable = new DataTable("DanhSachHoSo");
                var dataTableView = new DataTableViewModel();
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var data = MotCuaService.MotCua_HoSoTiepNhan_XuatDanhSach(linhVucId, thuTucId, soBienNhan
                        , ngayNhanTu, ngayNhanDen, nguoiNop, soCMND, User.UserID.ToString(), trangThai, listHoSoID);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data == null)
                        dataTableView = data.Data;
                    else
                        return new JsonResult();
                }
                foreach (var col in dataTableView.Columns)
                    dataTable.Columns.Add(col.Name, Type.GetType(col.Type));
                foreach (var row in dataTableView.Rows)
                {
                    var dataRow = dataTable.NewRow();
                    foreach (var cell in row.Cells)
                        dataRow[cell.Name] = cell.Value;
                    dataTable.Rows.Add(dataRow);
                }
                var template = Server.MapPath(@"~/Upload/Template/DanhSachHoSo_Template.xls");
                var workbook = new Workbook(template);
                var worksheet = workbook.Worksheets[0];
                var cells = worksheet.Cells;
                var opts = new FindOptions();
                opts.LookInType = LookInType.Values;
                Cell startcell = null;
                do
                {
                    startcell = cells.Find("startTable:" + dataTable.TableName, startcell, opts);
                    if (startcell != null)
                    {
                        startcell.Value = "";
                        cells.ImportDataTable(dataTable, false, startcell.Name);
                        cells.ClearFormats(startcell.Row, startcell.Column, startcell.Row,
                            startcell.Column + dataTable.Columns.Count);
                    }
                } while (startcell != null);
                var stream = workbook.SaveToStream();
                stream.Position = 0;

                return new JsonResult
                {
                    Data = new
                    {
                        Data = Convert.ToBase64String(stream.ToArray()),
                        FileName = "DanhSachHoSo" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xls"
                    }
                };
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult MotCua_QuyTrinhs_GetByThuTucIDandTrangThaiHienTaiID(string listThuTuc, int trangThaiID)
        {
            try
            {
                var listQuyTrinh = new List<QuyTrinhViewModel>();
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var arrThuTuc = listThuTuc.Split(';');

                    foreach (var item in arrThuTuc)
                    {
                        var ThuTucID = 0;
                        int.TryParse(item, out ThuTucID);
                        if (ThuTucID > 0)
                        {
                            var data = MotCuaService.MotCua_QuyTrinhs_GetByThuTucIDandTrangThaiHienTaiID(ThuTucID,
                                trangThaiID);
                            if (data.StatusCode == HttpStatusCode.OK)
                                listQuyTrinh.AddRange(data.Data);
                        }
                    }
                }
                return Json(new
                {
                    result = JsonConvert.SerializeObject(listQuyTrinh)
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult MotCua_HoSoTiepNhan_ChuyenTrangThai(string listHoSoID, int trangThaiHienTaiID,
            int trangThaiTiepTheoID, int nguoiNhanID, string ngay = "", string noiDung = "")
        {
            try
            {
                var count = 0;
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var arrHoSo = listHoSoID.Split(',');
                    foreach (var item in arrHoSo)
                    {
                        long HoSoID = 0;
                        long.TryParse(item, out HoSoID);
                        if (HoSoID > 0)
                        {
                            var checkHoSo =
                                MotCuaService.MotCua_QuyTrinhs_CheckByHoSoIDandTrangThaiTiepTheoID(HoSoID,
                                    trangThaiTiepTheoID, nguoiNhanID);
                            if (checkHoSo.StatusCode == HttpStatusCode.OK)
                            {
                                if (checkHoSo.Content == "" || checkHoSo.Content == "false")
                                    continue;
                                var hoSoTiepNhanFullProcessTrans = new HoSoTiepNhanFullProcessTrans
                                {
                                    HoSoID = HoSoID,
                                    NguoiXuLyHienTaiID = User.UserID,
                                    NguoiXuLyTiepTheoID = nguoiNhanID,
                                    TrangThaiHienTaiID = trangThaiHienTaiID,
                                    TrangThaiTiepTheoID = trangThaiTiepTheoID,
                                    hosotiepnhan = new HoSoTiepNhan
                                    {
                                        TrangThaiHoSoID = trangThaiTiepTheoID,
                                        HoSoID = HoSoID
                                    }
                                };
                                //Cac nghiep vu lien quan
                                switch (hoSoTiepNhanFullProcessTrans.hosotiepnhan.TrangThaiHoSoID.Value)
                                {
                                    case 9: //Tam ngung
                                        hoSoTiepNhanFullProcessTrans.tamngungthamdinh = new TamNgungThamDinh
                                        {
                                            NgayYeuCauTamNgung = ngay.ToDateTimeNullable(),
                                            LyDoTamNgung = noiDung
                                        };
                                        break;
                                    case 4: //Yeu cau bo sung
                                        hoSoTiepNhanFullProcessTrans.yeucaubosung = new YeuCauBoSung
                                        {
                                            NgayYeuCauBoSung = ngay.ToDateTimeNullable(),
                                            ThongTinYeuCau = noiDung
                                        };
                                        break;
                                    case 10: //Khong giai quyet
                                        hoSoTiepNhanFullProcessTrans.khonggiaiquyet = new KhongGiaiQuyet
                                        {
                                            LyDoKhongGiaiQuyet = noiDung
                                        };
                                        break;
                                    case 12: //Khong Phe Duyet
                                        hoSoTiepNhanFullProcessTrans.khongpheduyet = new KhongPheDuyet
                                        {
                                            LyDoKhongPheDuyet = noiDung
                                        };
                                        break;
                                }
                                var data = MotCuaService.MotCua_HoSoTiepNhan_TransFullProcess(
                                    hoSoTiepNhanFullProcessTrans);
                                if (data.StatusCode == HttpStatusCode.OK && data.Content != "" && data.Content != "0")
                                    count++;
                            }
                        }
                    }
                }
                return Json(new
                {
                    result = count
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult MotCua_HoSoTiepNhan_TheoDoiHoSo(long hoSoID, bool isTheoDoi)
        {
            try
            {
                var result = false;
                using (MotCuaService = new MotCuaServiceClient())
                {
                    if (isTheoDoi)
                    {
                        var data = MotCuaService.MotCua_HoSoTheoDoi_Save(new HoSoTheoDoi
                        {
                            HoSoID = hoSoID,
                            UserID = User.UserID,
                            HoSoTheoDoiID = 0
                        });
                        if (data.StatusCode == HttpStatusCode.OK)
                            result = !string.IsNullOrEmpty(data.Content);
                    }
                    else
                    {
                        var data = MotCuaService.MotCua_HoSoTheoDoi_Del(hoSoID, User.UserID);
                        if (data.StatusCode == HttpStatusCode.OK)
                            result = !string.IsNullOrEmpty(data.Content);
                    }
                }
                return Json(new
                {
                    result = JsonConvert.SerializeObject(result)
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult MotCua_QuaTrinhXuLys_GetByHoSoID(long hoSoID)
        {
            try
            {
                var listQuaTrinh = new List<QuaTrinhXuLyViewModel>();
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var data = MotCuaService.MotCua_QuaTrinhXuLys_GetByHoSoID(hoSoID);
                    if (data.StatusCode == HttpStatusCode.OK && data.Data != null)
                        listQuaTrinh.AddRange(data.Data);
                }
                return Json(new
                {
                    result = JsonConvert.SerializeObject(listQuaTrinh)
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public ActionResult MotCua_HoSoTiepNhan_XuatThongTinChiTietHoSo(long hoSoID)
        {
            try
            {
                var dataTable = new DataTable();
                var quytrinhxuly = new DataTableViewModel();
                var hosotiepnhan = new DataTableViewModel();
                var template = Server.MapPath(@"~/Upload/Template/ThongTinChiTietHoSo_Template.xls");
                var workbook = new Workbook(template);
                var worksheet = workbook.Worksheets[0];
                var cells = worksheet.Cells;
                var opts = new FindOptions();
                opts.LookInType = LookInType.Values;
                Cell findCell = null;
                //Thong tin chung
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var data = MotCuaService.MotCua_HoSoTiepNhan_XuatThongTinChiTietHoSo(hoSoID);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data != null)
                        hosotiepnhan = data.Data;
                    else
                        return new JsonResult();
                }

                foreach (var row in hosotiepnhan.Rows)
                    foreach (var cell in row.Cells)
                        do
                        {
                            findCell = cells.Find("<<" + cell.Name + ">>", findCell, opts);
                            if (findCell != null)
                                findCell.Value = cell.Value;
                        } while (findCell != null);

                using (MotCuaService = new MotCuaServiceClient())
                {
                    var data = MotCuaService.MotCua_QuaTrinhXuLys_XuatThongTinChiTietHoSo(hoSoID);
                    if (data.StatusCode == HttpStatusCode.OK || data.Data != null)
                        quytrinhxuly = data.Data;
                    else
                        return new JsonResult();
                }
                dataTable.TableName = quytrinhxuly.Name;
                foreach (var col in quytrinhxuly.Columns)
                    dataTable.Columns.Add(col.Name, Type.GetType(col.Type));
                foreach (var row in quytrinhxuly.Rows)
                {
                    var dataRow = dataTable.NewRow();
                    foreach (var cell in row.Cells)
                        dataRow[cell.Name] = cell.Value;
                    dataTable.Rows.Add(dataRow);
                }
                findCell = null;
                do
                {
                    findCell = cells.Find("startTable:" + dataTable.TableName, findCell, opts);
                    if (findCell != null)
                    {
                        findCell.Value = "";
                        cells.ImportDataTable(dataTable, false, findCell.Name);
                        cells.ClearFormats(findCell.Row, findCell.Column, findCell.Row,
                            findCell.Column + dataTable.Columns.Count);
                    }
                } while (findCell != null);
                var stream = workbook.SaveToStream();
                stream.Position = 0;

                return new JsonResult
                {
                    Data = new
                    {
                        Data = Convert.ToBase64String(stream.ToArray()),
                        FileName = "ThongTinChiTietHoSo" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + ".xls"
                    }
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

        #region Tra cứu hồ sơ

        public ActionResult TraCuuHoSo(string val)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(val))
                    ViewBag.Val = val;
                return View();
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult TraCuuHoSoByPage(int draw, int start, int length,
            string trangThai, string linhVucId, string thuTucId,
            string soBienNhan, string ngayNhanTu, string ngayNhanDen, string nguoiNop, string soCMND
        )
        {
            try
            {
                int filteredResultsCount;
                int totalResultsCount;
                var vSearch = Request.QueryString["search[value]"];

                var model = new DataTableAjaxPostModel();
                model.draw = draw;
                model.start = start;
                model.length = length;
                model.search = new Search { value = vSearch };

                var res = MotCua_HoSoTiepNhan_Search(model, out filteredResultsCount,
                    trangThai, linhVucId, thuTucId, soBienNhan, ngayNhanTu, ngayNhanDen, nguoiNop, soCMND,
                    out totalResultsCount);
                var result = new List<HoSoTiepNhanViewModel>(res.Count);
                result.AddRange(res.Select(s => new HoSoTiepNhanViewModel
                {
                    HoSoID = s.HoSoID,
                    HoTenNguoiNop = s.HoTenNguoiNop,
                    NgayHenTra = s.NgayHenTra,
                    TenLinhVuc = s.TenLinhVuc,
                    NgayNhan = s.NgayNhan,
                    NoiDungXuLy = s.NoiDungXuLy,
                    RowNo = s.RowNo,
                    SoBienNhan = s.SoBienNhan,
                    TenThuTuc = s.TenThuTuc,
                    TenTrangThaiHoSo = s.TenTrangThaiHoSo,
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

        public IList<HoSoTiepNhanViewModel> MotCua_HoSoTiepNhan_Search(DataTableAjaxPostModel model,
            out int filteredResultsCount, string trangThai, string linhvucid, string thuTucId,
            string soBienNhan, string ngayNhanTu, string ngayNhanDen, string nguoiNop, string soCMND,
            out int totalResultsCount)
        {
            try
            {
                var take = model.length;
                var skip = model.start != 0 ? model.start / take : 0;
                var pageindex = skip + 1;
                var result = new List<HoSoTiepNhanViewModel>();
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var data = MotCuaService.MotCua_HoSoTiepNhan_Search(linhvucid, thuTucId, soBienNhan
                        , ngayNhanTu, ngayNhanDen, nguoiNop, soCMND, trangThai, pageindex, take);
                    if (data.StatusCode == HttpStatusCode.OK)
                        result = data.Data.Data;
                }
                var totalCount = 0;

                if (result != null && result.Any())
                    totalCount = result.First().TotalItems ?? 0;

                filteredResultsCount = totalCount;
                totalResultsCount = totalCount;

                if (result == null)
                    return new List<HoSoTiepNhanViewModel>();
                return result;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        #endregion

        #region Thêm hồ sơ Chứng chỉ

        private readonly List<HttpPostedFileBase> _files = new List<HttpPostedFileBase>();

        public ActionResult ThemHoSo(string hoSoId, string linhVucId
            , string thuTucId, string trangThaiId, string dauKy, string prev, string soChungChi, string id)
        {
            try
            {
                ViewBag.HoSoId = hoSoId;
                ViewBag.LinhVucId = linhVucId;
                ViewBag.ThuTucId = thuTucId;
                ViewBag.TrangThaiId = trangThaiId;
                ViewBag.DauKy = dauKy;
                ViewBag.Prev = prev;
                ViewBag.SoChungChi = soChungChi;
                ViewBag.Id = id;
                return View();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public ActionResult ThuTucOnchange(string parentid, string ID, string Ten, string dataid)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(ID)) return Json(null, JsonRequestBehavior.AllowGet);
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_DM_ThuTuc_GetByThuTucID(ID.ToInt());
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        var thutuc = JsonConvert.DeserializeObject<DM_ThuTuc>(response.Content);
                        if (thutuc != null)
                            return PartialView(thutuc.MapURL);
                    }
                    return Json(null, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult SaveHoSoChungChiY()
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var chungchi = PreparingSaveChungChi("0");
                    var response = NganhYService.NganhY_ChungChiHanhNgheY_Save(chungchi);
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

        public JsonResult SaveHoSoChungChiYCapLai()
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var chung = PreparingSaveChungChi("0");
                    var noiDungTruoc = ColectionNoiDungTruoc();
                    var item = ColectionItemChungChi("model");
                    var capLai = new ChungChiHanhNgheY_CapLai
                    {
                        HoSoID = chung.chungChiHanhNgheY.HoSoID,
                        ChungChiHanhNgheYIDGoc = noiDungTruoc.chungChiHanhNgheY.ChungChiHanhNgheYID,
                        SoChungChi = chung.chungChiHanhNgheY.SoChungChi,
                        SoChungChiCu = chung.chungChiHanhNgheY.SoChungChi,
                        NgayCapCu = noiDungTruoc.chungChiHanhNgheY.NgayCap,
                        NgayCap = item.NgayCapLai.ToDateTimeNullable(),
                        LanCapLai = item.LanCapLai.ToIntNullable(),
                        LyDoCapLaiID = item.LyDoCapLaiId.ToIntNullable(),
                        LastUpdDate = DateTime.Now,
                        CreatedUserID = User.UserID,
                        CreatedDate = DateTime.Now,
                        LastUpdUserID = User.UserID,
                        CapLaiID = item.CapLaiId.ToLong()
                    };

                    var capLaiSave = new ChungChiHanhNgheYCapLaiSave
                    {
                        chungChiHanhNgheY_caplai = capLai,
                        noidungsau = chung,
                        noidungtruoc = noiDungTruoc
                    };
                    var response = NganhYService.NganhY_ChungChiHanhNgheY_CapLai_Save(capLaiSave);
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

        public JsonResult SaveHoSoChungChiYBoSung()
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var chung = PreparingSaveChungChi("1");
                    var noiDungTruoc = ColectionNoiDungTruoc();
                    var item = ColectionItemChungChi("model");
                    var formBoSung = ColectionItemChungChi("modelHoSo");
                    var modelCheck = Request.Form["objBoSungCheck"];
                    var objBoSungCheck = JsonConvert.DeserializeObject<BoSungViewModel>(modelCheck);
                    chung = ColectionNoiDungBoSungSau(noiDungTruoc, chung, objBoSungCheck);
                    var capLai = new ChungChiHanhNgheY_DieuChinh
                    {
                        HoSoID = chung.chungChiHanhNgheY.HoSoID,
                        ChungChiHanhNgheYIDGoc = noiDungTruoc.chungChiHanhNgheY.ChungChiHanhNgheYID,
                        SoChungChi = chung.chungChiHanhNgheY.SoChungChi,
                        SoChungChiCu = chung.chungChiHanhNgheY.SoChungChi,
                        NgayCapCu = noiDungTruoc.chungChiHanhNgheY.NgayCap,
                        NgayCap = formBoSung.NgayDieuChinh.ToDateTimeNullable(),
                        LanDieuChinh = formBoSung.SoLanDieuChinh.ToIntNullable(),
                        LyDoDieuChinhID = formBoSung.LyDoDieuChinh.ToIntNullable(),
                        LastUpdDate = DateTime.Now,
                        CreatedUserID = User.UserID,
                        CreatedDate = DateTime.Now,
                        LastUpdUserID = User.UserID,
                        DieuChinhID = formBoSung.BoSungId.ToLong()
                    };
                    var boSungSave = new ChungChiHanhNgheYDieuChinhSave
                    {
                        chungChiHanhNgheY_dieuchinh = capLai,
                        noidungsau = chung, //nguyên cục
                        noidungtruoc = noiDungTruoc,
                        chungChiHanhNgheY_dieuchinhct = new ChungChiHanhNgheY_DieuChinhCT
                        {
                            DieuChinhID = item.BoSungId.ToLong(),
                            FieldChange = modelCheck
                        }
                    };
                    var response = NganhYService.NganhY_ChungChiHanhNgheY_DieuChinh_Save(boSungSave);
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

        public JsonResult GetHoSoById(string hosoId)
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_HoSoTiepNhan_GetByHoSoId(hosoId.ToLong());
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

        public JsonResult GetChungChiHanhNgheY_CapLai_GetByHoSoID(string hosoId)
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var response = NganhYService.NganhY_ChungChiHanhNgheY_CapLai_GetByHoSoID(hosoId.ToLong());
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

        public JsonResult GetChungChiHanhNgheY_BoSung_GetByHoSoID(string hosoId)
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var response = NganhYService.NganhY_ChungChiHanhNgheY_DieuChinh_GetByHoSoID(hosoId.ToLong());
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

        public JsonResult GetChungChiBySoChungChi(string soChungChi)
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var response = NganhYService.NganhY_ChungChiHanhNgheY_GetBySoChungChi(soChungChi);
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

        public JsonResult LoadHoSoChungChi(string id, string hoSoId)
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    if (string.IsNullOrWhiteSpace(hoSoId))
                    {
                        var response = NganhYService.NganhY_ChungChiHanhNgheY_GetByID(id.ToLong());
                        return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content },
                            JsonRequestBehavior.AllowGet);
                    }
                    var responseHoSo = NganhYService.NganhY_ChungChiHanhNgheY_GetByHoSoID(hoSoId.ToLong());
                    return Json(responseHoSo.StatusCode != HttpStatusCode.OK ? null : new { responseHoSo.Content },
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

        #region Quảng cáo trang thiết bị

        public JsonResult SaveHoSoQuangCaoTrangThietBi()
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var viewModel = ColectionItemQuangCaoTrangThietBi("model");
                    var saveModel = ParseViewModelToSaveModelQuangCaoTrangThietBi(viewModel);
                    var response = NganhYService.NganhY_DangKyQCTrangThietBi_Save(saveModel);
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

        protected QuangCaoTrangThietBiViewModel ColectionItemQuangCaoTrangThietBi(string nameRequest)
        {
            try
            {
                var model = Request.Form[nameRequest];
                var item = JsonConvert.DeserializeObject<QuangCaoTrangThietBiViewModel>(model);
                return item;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        protected DangKyQCTrangThietBi ParseViewModelToSaveModelQuangCaoTrangThietBi(
            QuangCaoTrangThietBiViewModel viewModel)
        {
            try
            {
                if (viewModel == null) return null;
                var objReturn = new DangKyQCTrangThietBi
                {
                    HoSoID = viewModel.HoSoID,
                    CreatedUserID = User.UserID,
                    LastUpdUserID = User.UserID,
                    LastUpdDate = DateTime.Now,
                    DangKyQCTrangThietBiID = viewModel.Id.ToLong(),
                    CreatedDate = DateTime.Now,
                    DichVuQuangCao = viewModel.DichVuQuangCao,
                    DonViDK_DiaChi = viewModel.SoNha01,
                    DonViDK_Email = viewModel.Email,
                    DonViDK_HuyenID = viewModel.QuanHuyen01.ToLongNullable(),
                    DonViDK_MaDoanhNghiep = viewModel.MaDoanhNghiep,
                    DonViDK_Phone = viewModel.DienThoai,
                    DonViDK_SoNha = viewModel.SoNha01,
                    DonViDK_Ten = viewModel.TenDonVi,
                    DonViDK_TinhID = viewModel.TinhThanh01.ToLongNullable(),
                    DonViDK_XaID = viewModel.PhuongXa01.ToLongNullable(),
                    NCTN_Email = viewModel.Email2,
                    NCTN_GioiTinhID = viewModel.gioi_tinh.ToIntNullable(),
                    NCTN_LoaiGiayToID = viewModel.lgt.ToIntNullable(),
                    NCTN_NgayCap = viewModel.NgayCapGiayTo.ToDateTimeNullable(),
                    NCTN_NgaySinh = viewModel.NgaySinh,
                    NCTN_NoiCap = viewModel.NoiCapGiayTo,
                    NCTN_Phone = viewModel.DienThoai2,
                    NCTN_SoGiayTo = viewModel.SoGiayTo,
                    NCTN_Ten = viewModel.HoTen,
                    NgayTiepNhan = viewModel.NgayTiepNhan.ToDateTimeNullable(),
                    SoGiayDangKy = viewModel.SoGiayDangKy,
                    SoTiepNhan = viewModel.SoTiepNhan,
                    TrangThaiGiayPhepID = viewModel.TrangThaiHoSoID,
                    IsDauKy = viewModel.IsDauKy == "1" ? "true".ToBoolNullable() : false
                };

                if (viewModel.IsDauKy != "1") return objReturn;
                objReturn.SoBienNhanDauKy = viewModel.SoBienNhan;
                objReturn.NgayHenTraDauKy = viewModel.NgayHenTra.ToDateTimeNullable();
                objReturn.NgayNhanDauKy = viewModel.NgayNhan.ToDateTimeNullable();
                return objReturn;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult LoadHoSoQuangCaoTrangThietBi(string id, string hoSoId)
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    if (string.IsNullOrWhiteSpace(hoSoId))
                    {
                        var response = NganhYService.NganhY_DangKyQCTrangThietBi_GetByID(id.ToLong());
                        return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content },
                            JsonRequestBehavior.AllowGet);
                    }
                    var responseHoSo = NganhYService.NganhY_DangKyQCTrangThietBi_GetByHoSoID(hoSoId.ToLong());
                    return Json(responseHoSo.StatusCode != HttpStatusCode.OK ? null : new { responseHoSo.Content },
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

        #region ATSH

        public JsonResult SaveHoSoATSHCapMoi()
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var viewModel = ColectionItemATSH("model");
                    var saveModel = ParseViewModelToSaveModelATSH(viewModel);
                    var response = NganhYService.NganhY_GiayChungNhanATSH_Save(saveModel);
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

        protected ATSHViewModel ColectionItemATSH(string nameRequest)
        {
            try
            {
                var model = Request.Form[nameRequest];
                var item = JsonConvert.DeserializeObject<ATSHViewModel>(model);
                return item;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        protected GiayChungNhanATSHSave ParseViewModelToSaveModelATSH(ATSHViewModel viewModel)
        {
            try
            {
                if (viewModel == null) return null;
                var lstNhanSu = new List<GiayChungNhanATSH_DSNhanSu>();
                var lstThietBi = new List<GiayChungNhanATSH_DSThietBi>();
                if (viewModel.ArrNhanSu?.Any() == true)
                    lstNhanSu.AddRange(viewModel.ArrNhanSu.Select(i =>
                        new GiayChungNhanATSH_DSNhanSu
                        {
                            HoTen = i.HoTen,
                            ChucDanh = i.ChucDanh,
                            CongViecPhuTrach = i.CongViecPhuTrach,
                            GiayChungNhanATSHID = viewModel.Id.ToLongNullable(),
                            TrinhDoChuyenMonID = i.TrinhDoChuyenMonID.ToIntNullable()
                        }));
                if (viewModel.ArrTrangThietBi?.Any() == true)
                    lstThietBi.AddRange(viewModel.ArrTrangThietBi.Select(i => new GiayChungNhanATSH_DSThietBi
                    {
                        GiayChungNhanATSHID = viewModel.Id.ToLongNullable(),
                        BaoDuong = i.BaoDuong,
                        GhiChu = i.GhiChu,
                        HangSX = i.HangSX,
                        KyHieu = i.KyHieu,
                        NamSX = i.NamSX,
                        NuocSX = i.NuocSX,
                        TenThietBi = i.TenThietBi,
                        TinhTrangSuDung = i.TinhTrangSuDung
                    }));
                var objGiayChungNhan = new GiayChungNhanATSH
                {
                    HoSoID = viewModel.HoSoID.ToLongNullable(),
                    CreatedUserID = User.UserID,
                    LastUpdUserID = User.UserID,
                    LastUpdDate = DateTime.Now,
                    CreatedDate = DateTime.Now,
                    NgayCap = viewModel.NgayCap.ToDateTimeNullable(),
                    Cap = viewModel.CapDoAnToanSinhHoc.ToIntNullable(),
                    DiaChi = FuncDiaChi(viewModel.SoNha01, viewModel.PhuongXa01_Name, viewModel.QuanHuyen01_Name, viewModel.TinhThanh01_Name),
                    Email = viewModel.Email,
                    GiayChungNhanATSHID = viewModel.Id.ToLong(),
                    HuyenID = viewModel.QuanHuyen01.ToLongNullable(),
                    Phone = viewModel.DienThoai,
                    SoGiayChungNhan = viewModel.SoChungNhan,
                    SoNha = viewModel.SoNha01,
                    TenCoSo = viewModel.TenCoSo,
                    TenPhongXetNghiem = viewModel.PhongXetNghiem,
                    ThoiHan = viewModel.ThoiHan.ToIntNullable(),
                    TinhID = viewModel.TinhThanh01.ToLongNullable(),
                    TrangThaiGiayPhepID = 0,
                    XaID = viewModel.PhuongXa01.ToLongNullable(),
                    //TrangThaiGiayPhepID = viewModel.TrangThaiHoSoID,
                    IsDauKy = viewModel.IsDauKy == "1" ? "true".ToBoolNullable() : false
                };
                var objReturn = new GiayChungNhanATSHSave
                {
                    giayChungNhanATSH = objGiayChungNhan,
                    lstGiayChungNhanATSH_DSNhanSu = lstNhanSu,
                    lstGiayChungNhanATSH_DSThietBi = lstThietBi
                };

                if (viewModel.IsDauKy != "1") return objReturn;
                objReturn.giayChungNhanATSH.SoBienNhanDauKy = viewModel.SoBienNhan;
                objReturn.giayChungNhanATSH.NgayHenTraDauKy = viewModel.NgayHenTra.ToDateTimeNullable();
                objReturn.giayChungNhanATSH.NgayNhanDauKy = viewModel.NgayNhan.ToDateTimeNullable();
                return objReturn;

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult LoadHoSoATSHCapMoi(string id, string hoSoId)
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    if (string.IsNullOrWhiteSpace(hoSoId))
                    {
                        var response = NganhYService.NganhY_GiayChungNhanATSH_GetByID(id.ToLong());
                        return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content },
                            JsonRequestBehavior.AllowGet);
                    }
                    var responseHoSo = NganhYService.NganhY_GiayChungNhanATSH_GetByHoSoID(hoSoId.ToLong());
                    return Json(responseHoSo.StatusCode != HttpStatusCode.OK ? null : new { responseHoSo.Content },
                        JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }


        public JsonResult LoadATSHBySoChungNhan(string soChungNhan)
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var responseHoSo = NganhYService.NganhY_GiayChungNhanATSH_GetBySoGiayChungNhan(soChungNhan);
                    return Json(responseHoSo.StatusCode != HttpStatusCode.OK ? null : new { responseHoSo.Content },
                        JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }


        public JsonResult SaveHoSoATSHCapLai()
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var viewModel = ColectionItemATSH("model");
                    var saveModel = ParseViewModelToSaveModelATSH(viewModel);
                    var noiDungTruoc = ColectionNoiDungTruocATSH();
                    var thongTinCapLai = ColectionThongTinCapLaiATSH();

                    var capLaiObj = new GiayChungNhanATSH_CapLai
                    {
                        NgayCap = thongTinCapLai.NgayCapLai.ToDateTimeNullable(),
                        LastUpdDate = DateTime.Now,
                        LastUpdUserID = User.UserID,
                        HoSoID = saveModel.giayChungNhanATSH.HoSoID,
                        Cap = noiDungTruoc.giayChungNhanATSH.Cap,
                        CapLaiID = thongTinCapLai.CapLaiId.ToLong(),
                        CreatedDate = DateTime.Now,
                        CreatedUserID = User.UserID,
                        //DaCapLai = ,
                        GiayChungNhanATSHIDGoc = noiDungTruoc.giayChungNhanATSH.GiayChungNhanATSHID,
                        LanCapLai = thongTinCapLai.LanCapLai.ToIntNullable(),
                        LyDoCapLaiID = thongTinCapLai.LyDoCapLai.ToIntNullable(),
                        NgayCapCu = noiDungTruoc.giayChungNhanATSH.NgayCap,
                        SoGiayChungNhan = saveModel.giayChungNhanATSH.SoGiayChungNhan,
                        SoGiayChungNhanCu = saveModel.giayChungNhanATSH.SoGiayChungNhan,
                        ThoiHan = saveModel.giayChungNhanATSH.ThoiHan,
                        ThoiHanCu = noiDungTruoc.giayChungNhanATSH.ThoiHan

                    };
                    var capLai = new GiayChungNhanATSHCapLaiSave
                    {
                        giayChungNhanATSH_caplai = capLaiObj,
                        noidungtruoc = noiDungTruoc,
                        noidungsau = saveModel
                    };

                    var response = NganhYService.NganhY_GiayChungNhanATSH_CapLai_Save(capLai);
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

        protected GiayChungNhanATSHSave ColectionNoiDungTruocATSH()
        {
            try
            {
                var model = Request.Form["modelTruoc"];
                var item = JsonConvert.DeserializeObject<GiayChungNhanATSHSave>(model);
                return item;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        protected CapLaiATSHViewModel ColectionThongTinCapLaiATSH()
        {
            try
            {
                var model = Request.Form["modelCapLai"];
                var item = JsonConvert.DeserializeObject<CapLaiATSHViewModel>(model);
                return item;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult LoadGiayChungNhanATSH_CapLai(string hoSoId)
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var responseHoSo = NganhYService.NganhY_GiayChungNhanATSH_CapLai_GetByHoSoID(hoSoId.ToLong());
                    return Json(responseHoSo.StatusCode != HttpStatusCode.OK ? null : new { responseHoSo.Content },
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

        #region Lương Y

        public JsonResult SaveHoSoLuongY()
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var viewModel = ColectionItemLuongY("model");
                    var saveModel = ParseViewModelToSaveModelLuongY(viewModel);
                    var response = NganhYService.NganhY_GiayChungNhanLuongY_Save(saveModel);
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
        protected LuongYViewModel ColectionItemLuongY(string nameRequest)
        {
            try
            {
                var model = Request.Form[nameRequest];
                var item = JsonConvert.DeserializeObject<LuongYViewModel>(model);
                return item;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        protected GiayChungNhanLuongYSave ParseViewModelToSaveModelLuongY(LuongYViewModel viewModel)
        {
            try
            {
                if (viewModel == null) return null;
                var fileHinhAnh = Request.Files["img"];
                var lstQuaTrinh = new List<GiayChungNhanLuongY_QTHanhNghe>();
                var anhMinhHoa = fileHinhAnh != null ? XuLyLuuFile(fileHinhAnh) : viewModel.DataHinh;
                if (viewModel.ArrLuongY?.Any() == true)
                    lstQuaTrinh.AddRange(viewModel.ArrLuongY.Select(i => new GiayChungNhanLuongY_QTHanhNghe
                    {
                        GiayChungNhanLuongYID = viewModel.Id.ToLongNullable(),
                        ChucVu = i.ChucVu,
                        NoiLamViec = i.NoiLamViec,
                        PhamViHoatDong = i.PhamViHoatDong,
                        ThoiGian = i.ThoiGian
                    }));
                var objGiayChungNhan = new GiayChungNhanLuongY
                {
                    HoSoID = viewModel.HoSoID.ToLongNullable(),
                    CreatedUserID = User.UserID,
                    LastUpdUserID = User.UserID,
                    LastUpdDate = DateTime.Now,
                    CreatedDate = DateTime.Now,
                    NgayCap = viewModel.NgayCapChungChi.ToDateTimeNullable(),
                    ThuongTru_DiaChi = FuncDiaChi(viewModel.SoNha01, viewModel.PhuongXa01_Name, viewModel.QuanHuyen01_Name, viewModel.TinhThanh01_Name),
                    Email = viewModel.Email,
                    GiayChungNhanLuongYID = viewModel.Id.ToLong(),
                    ThuongTru_HuyenID = viewModel.QuanHuyen01.ToLongNullable(),
                    Phone = viewModel.DienThoai,
                    SoGiayChungNhan = viewModel.SoChungNhan,
                    ThuongTru_SoNha = viewModel.SoNha01,
                    ThuongTru_TinhID = viewModel.TinhThanh01.ToLongNullable(),
                    ThuongTru_XaID = viewModel.PhuongXa01.ToLongNullable(),
                    ChoO_DiaChi = FuncDiaChi(viewModel.SoNha02, viewModel.PhuongXa02_Name, viewModel.QuanHuyen02_Name, viewModel.TinhThanh02_Name),
                    ChoO_HuyenID = viewModel.QuanHuyen02.ToLongNullable(),
                    ChoO_SoNha = viewModel.SoNha02,
                    ChoO_TinhID = viewModel.TinhThanh02.ToLongNullable(),
                    ChoO_XaID = viewModel.PhuongXa02.ToLongNullable(),
                    NgayCapGiayTo = viewModel.NgayCapGiayTo.ToDateTimeNullable(),
                    HoTen = viewModel.HoTenRequire,
                    NoiCapGiayTo = viewModel.NoiCapGiayTo,
                    SoGiayTo = viewModel.SoGiayToRequire,
                    NgaySinh = viewModel.NgaySinh,
                    GioiTinh = viewModel.gioi_tinh.ToIntNullable(),
                    HinhAnh = anhMinhHoa,
                    LoaiGiayTo = viewModel.lgt.ToIntNullable(),
                    NgayQuyetDinh = viewModel.NgayQuyetDinh.ToDateTimeNullable(),
                    PhamViHoatDongID = viewModel.du_dieu_kien_hanh_nghe != null
                    ? string.Join("-", viewModel.du_dieu_kien_hanh_nghe)
                        : null,
                    //PhamViHoatDongs = ,
                    SoQuyetDinh = viewModel.SoQuyetDinh,
                    //TrangThaiGiayPhepID = viewModel.TrangThaiHoSoID,
                     IsDauKy = viewModel.IsDauKy == "1" ? "true".ToBoolNullable() : false
                };
                var objReturn = new GiayChungNhanLuongYSave
                {
                    giayChungNhanLuongY = objGiayChungNhan,
                    lstgiayChungNhanLuongY_QTHanhNghe = lstQuaTrinh

                };

                if (viewModel.IsDauKy != "1") return objReturn;
                objReturn.giayChungNhanLuongY.SoBienNhanDauKy = viewModel.SoBienNhan;
                objReturn.giayChungNhanLuongY.NgayHenTraDauKy = viewModel.NgayHenTra.ToDateTimeNullable();
                objReturn.giayChungNhanLuongY.NgayNhanDauKy = viewModel.NgayNhan.ToDateTimeNullable();
                return objReturn;

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult LoadHoSoLuongY(string id, string hoSoId)
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    if (string.IsNullOrWhiteSpace(hoSoId))
                    {
                        var response = NganhYService.NganhY_GiayChungNhanLuongY_GetByID(id.ToLong());
                        return Json(response.StatusCode != HttpStatusCode.OK ? null : new { response.Content },
                            JsonRequestBehavior.AllowGet);
                    }
                    var responseHoSo = NganhYService.NganhY_GiayChungNhanLuongY_GetByHoSoID(hoSoId.ToLong());
                    return Json(responseHoSo.StatusCode != HttpStatusCode.OK ? null : new { responseHoSo.Content },
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

        #region Func Dung chung

        protected string FuncDiaChi(string soNha, string xa, string huyen, string tinh)
        {
            var diachi = new StringBuilder();
            diachi.Append(soNha);
            diachi.Append(string.IsNullOrWhiteSpace(xa) ? "" : ", " + xa);
            diachi.Append(string.IsNullOrWhiteSpace(huyen) ? "" : ", " + huyen);
            diachi.Append(string.IsNullOrWhiteSpace(tinh) ? "" : ", " + tinh);
            return diachi.ToString();
        }


        protected ChungChiHanhNgheYSave PreparingSaveChungChi(string loai)
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
            var lstTrinhDo = new List<ChungChiHanhNgheY_TDCM>();
            var lstQuatrinh = new List<ChungChiHanhNgheY_QTTH>();

            if (item.ArrTrinhDo?.Any() == true)
                lstTrinhDo.AddRange(item.ArrTrinhDo.Select(i =>
                    new ChungChiHanhNgheY_TDCM
                    {
                        ChungChiHanhNgheYID = item.ChungChiHanhNgheYID,
                        NamTotNghiep = i.NamTotNghiep,
                        TenTruongDaoTao = i.TenTruongDaoTao,
                        TrinhDoChuyenMonID = i.TrinhDoChuyenMonID.ToIntNullable()
                    }));
            if (item.ArrCongTac?.Any() == true)
                lstQuatrinh.AddRange(item.ArrCongTac.Select(i => new ChungChiHanhNgheY_QTTH
                {
                    ChungChiHanhNgheYID = item.ChungChiHanhNgheYID,
                    IsDonViNhaNuoc = i.IsDonViNhaNuoc.ToBoolNullable(),
                    TenDonViThucHanh = i.TenDonViThucHanh,
                    ThoiGianThucHanh = i.ThoiGianThucHanh
                }));
            var chungChiHanhNgheY = loai == "1"
                ? PreparingChungChiBoSung(item, anhMinhHoa, objFileDinhKemName)
                : PreparingChungChiMoi_vs_CapLai(item, anhMinhHoa, objFileDinhKemName);
            var chungChi = new ChungChiHanhNgheYSave
            {
                chungChiHanhNgheY = chungChiHanhNgheY,
                lstChungChiHanhNgheY_TDCM = lstTrinhDo,
                lstChungChiHanhNgheY_QTTH = lstQuatrinh
            };
            if (item.IsDauKy != "1") return chungChi;
            chungChi.chungChiHanhNgheY.SoBienNhanDauKy = item.SoBienNhan;
            chungChi.chungChiHanhNgheY.NgayHenTraDauKy = item.NgayHenTra.ToDateTimeNullable();
            chungChi.chungChiHanhNgheY.NgayNhanDauKy = item.NgayNhan.ToDateTimeNullable();
            return chungChi;
        }

        protected ChungChiHanhNgheY PreparingChungChiBoSung(HoSoViewModel item, string anhMinhHoa,
            Files objFileDinhKemName)
        {
            var chungChiHanhNgheY = new ChungChiHanhNgheY
            {
                SoGiayTo = item.SoGiayTo,
                SoChungChi = item.SoChungChi,
                ChungChiHanhNgheYID = item.ChungChiHanhNgheYID,
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
                ChoO_DiaChi = item.ChoO_SoNha,
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
                ThuongTru_DiaChi = item.ThuongTru_SoNha,
                ThuongTru_HuyenID = item.ThuongTru_HuyenID.ToLongNullable(),
                ThuongTru_SoNha = item.ThuongTru_SoNha,
                ThuongTru_TinhID = item.ThuongTru_TinhID.ToLongNullable(),
                ThuongTru_XaID = item.ThuongTru_XaID.ToLongNullable(),
                TrangThaiGiayPhepID = item.TrangThaiHoSoID
            };
            return chungChiHanhNgheY;
        }

        protected ChungChiHanhNgheY PreparingChungChiMoi_vs_CapLai(HoSoViewModel item, string anhMinhHoa,
            Files objFileDinhKemName)
        {
            var chungChiHanhNgheY = new ChungChiHanhNgheY
            {
                SoGiayTo = item.SoGiayToRequire,
                SoChungChi = item.SoChungChi,
                ChungChiHanhNgheYID = item.ChungChiHanhNgheYID,
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
                ChoO_SoNha = item.SoNha01,
                ChoO_TinhID = item.TinhThanh01.ToLongNullable(),
                ChoO_XaID = item.PhuongXa01.ToLongNullable(),
                ChoO_DiaChi = FuncDiaChi(item.SoNha01, item.PhuongXa01_Name, item.QuanHuyen01_Name, item.TinhThanh01_Name),
                ChoO_HuyenID = item.QuanHuyen01.ToLongNullable(),
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
                ThuongTru_DiaChi = FuncDiaChi(item.SoNha02, item.PhuongXa02_Name, item.QuanHuyen02_Name, item.TinhThanh02_Name),
                ThuongTru_HuyenID = item.QuanHuyen02.ToLongNullable(),
                ThuongTru_SoNha = item.SoNha02,
                ThuongTru_TinhID = item.TinhThanh02.ToLongNullable(),
                ThuongTru_XaID = item.PhuongXa02.ToLongNullable(),
                TrangThaiGiayPhepID = item.TrangThaiHoSoID,
                IsDauKy = item.IsDauKy == "1" ? "true".ToBoolNullable() : false
            };
            return chungChiHanhNgheY;
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

        protected HoSoViewModel ColectionChungChiBoSung()
        {
            try
            {
                var model = Request.Form["model"];
                var item = JsonConvert.DeserializeObject<HoSoViewModel>(model);
                return item;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        protected ChungChiHanhNgheYSave ColectionNoiDungTruoc()
        {
            try
            {
                var model = Request.Form["noidungtruoc"];
                var item = JsonConvert.DeserializeObject<ChungChiHanhNgheYSave>(model);
                return item;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        protected ChungChiHanhNgheYSave ColectionNoiDungBoSungSau(ChungChiHanhNgheYSave objTruoc,
            ChungChiHanhNgheYSave obj, BoSungViewModel check)
        {
            try
            {
                if (check == null) return obj;
                if (obj == null) return null;
                obj.chungChiHanhNgheY.HoTen = check.HoTen == "True"
                    ? obj.chungChiHanhNgheY.HoTen
                    : objTruoc
                        .chungChiHanhNgheY.HoTen;
                obj.chungChiHanhNgheY.NgaySinh = check.NgaySinh == "True"
                    ? obj.chungChiHanhNgheY.NgaySinh
                    : objTruoc
                        .chungChiHanhNgheY.NgaySinh;
                obj.chungChiHanhNgheY.GioiTinh = check.GioiTinh == "True"
                    ? obj.chungChiHanhNgheY.GioiTinh
                    : objTruoc
                        .chungChiHanhNgheY.GioiTinh;
                obj.chungChiHanhNgheY.LoaiGiayTo = check.LoaiGiayTo == "True"
                    ? obj.chungChiHanhNgheY.LoaiGiayTo
                    : objTruoc
                        .chungChiHanhNgheY.LoaiGiayTo;
                obj.chungChiHanhNgheY.SoGiayTo = check.SoGiayTo == "True"
                    ? obj.chungChiHanhNgheY.SoGiayTo
                    : objTruoc
                        .chungChiHanhNgheY.SoGiayTo;
                obj.chungChiHanhNgheY.NgayCapGiayTo = check.NgayCapGiayTo == "True"
                    ? obj.chungChiHanhNgheY.NgayCapGiayTo
                    : objTruoc
                        .chungChiHanhNgheY.NgayCapGiayTo;
                obj.chungChiHanhNgheY.NoiCapGiayTo = check.NoiCapGiayTo == "True"
                    ? obj.chungChiHanhNgheY.NoiCapGiayTo
                    : objTruoc
                        .chungChiHanhNgheY.NoiCapGiayTo;
                if (check.DiaChiThuongTru != "True")
                {
                    obj.chungChiHanhNgheY.ThuongTru_TinhID = objTruoc.chungChiHanhNgheY.ThuongTru_TinhID;
                    obj.chungChiHanhNgheY.ThuongTru_HuyenID = objTruoc.chungChiHanhNgheY.ThuongTru_HuyenID;
                    obj.chungChiHanhNgheY.ThuongTru_XaID = objTruoc.chungChiHanhNgheY.ThuongTru_XaID;
                    obj.chungChiHanhNgheY.ThuongTru_SoNha = objTruoc.chungChiHanhNgheY.ThuongTru_SoNha;
                }
                if (check.ChoOHienNay != "True")
                {
                    obj.chungChiHanhNgheY.ChoO_TinhID = objTruoc.chungChiHanhNgheY.ChoO_TinhID;
                    obj.chungChiHanhNgheY.ChoO_HuyenID = objTruoc.chungChiHanhNgheY.ChoO_HuyenID;
                    obj.chungChiHanhNgheY.ChoO_XaID = objTruoc.chungChiHanhNgheY.ChoO_XaID;
                    obj.chungChiHanhNgheY.ChoO_SoNha = objTruoc.chungChiHanhNgheY.ChoO_SoNha;
                }
                if (check.DienThoai != "True")
                    obj.chungChiHanhNgheY.Phone = objTruoc.chungChiHanhNgheY.Phone;
                if (check.Email != "True")
                    obj.chungChiHanhNgheY.Email = objTruoc.chungChiHanhNgheY.Email;
                if (check.HinhAnh != "True")
                    obj.chungChiHanhNgheY.HinhAnh = objTruoc.chungChiHanhNgheY.HinhAnh;
                if (check.TrinhDoChuyenMon != "True")
                    obj.lstChungChiHanhNgheY_TDCM = objTruoc.lstChungChiHanhNgheY_TDCM;
                if (check.QuaTrinhCongTac != "True")
                    obj.lstChungChiHanhNgheY_QTTH = objTruoc.lstChungChiHanhNgheY_QTTH;
                if (check.VanBangChuyenMon != "True")
                    obj.chungChiHanhNgheY.PhamViHoatDongID = objTruoc.chungChiHanhNgheY.PhamViHoatDongID;
                if (check.DieuKienHanhNghe != "True")
                    obj.chungChiHanhNgheY.DuDieuKienHanhNghe = objTruoc.chungChiHanhNgheY.DuDieuKienHanhNghe;
                obj.chungChiHanhNgheY.NoiCapChungChiID = objTruoc.chungChiHanhNgheY.NoiCapChungChiID;
                obj.chungChiHanhNgheY.NgayTrinhCap = objTruoc.chungChiHanhNgheY.NgayTrinhCap;
                obj.chungChiHanhNgheY.NgayCap = objTruoc.chungChiHanhNgheY.NgayCap;
                obj.chungChiHanhNgheY.NgayHoiDong = objTruoc.chungChiHanhNgheY.NgayHoiDong;
                obj.chungChiHanhNgheY.NgayQuyetDinh = objTruoc.chungChiHanhNgheY.NgayQuyetDinh;
                return obj;
            }
            catch (Exception e)
            {
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

        public JsonResult GetTrangThaiHoSo()
        {
            try
            {
                using (MotCuaService = new MotCuaServiceClient())
                {
                    var response = MotCuaService.MotCua_E_TrangThaiHoSo_GetAll();
                    return Json(response.StatusCode != HttpStatusCode.OK ? new { result = "" } : new { result = response.Content }, JsonRequestBehavior.AllowGet);
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

        public JsonResult GetParamJsonResult()
        {
            try
            {
                using (DbMasterService = new DBMasterServiceClient())
                {
                    var response = DbMasterService.DBMaster_DM_GetAll();
                    if (response.StatusCode != HttpStatusCode.OK)
                        return Json(new { result = "" }, JsonRequestBehavior.AllowGet);
                    return Json(new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public JsonResult GetDanhMucTrinhDo()
        {
            try
            {
                using (DbMasterService = new DBMasterServiceClient())
                {
                    var response = DbMasterService.DBMaster_DM_TrinhDoChuyenMon_GetAll();
                    return Json(response.StatusCode != HttpStatusCode.OK ? new { result = "" } : new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
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
                    return Json(response.StatusCode != HttpStatusCode.OK ? new { result = "" } : new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
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
                    return Json(response.StatusCode != HttpStatusCode.OK ? new { result = "" } : new { result = response.Content }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
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


        #endregion

        #region Check Exist

        public JsonResult CheckExistSoChungChi(string id, string soChungChi)
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var response = NganhYService.CheckExistSoChungChi(id, soChungChi);
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

        public JsonResult CheckExistSoTiepNhanDangKyQuangCaoNganhY(string id, string soChungChi)
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var response = NganhYService.CheckExistSoTiepNhanDangKyQuangCaoNganhY(id, soChungChi);
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

        public JsonResult CheckExistSoGiayChungNhanATSH(string id, string soChungChi)
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var response = NganhYService.CheckExistSoGiayChungNhanATSH(id, soChungChi);
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


        public JsonResult CheckExistSoChungNhanLuongY(string id, string soChungChi)
        {
            try
            {
                using (NganhYService = new NganhYServiceClient())
                {
                    var response = NganhYService.CheckExistSoChungNhanLuongY(id, soChungChi);
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


        

        #endregion
    }
}