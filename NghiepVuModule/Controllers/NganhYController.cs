using System.Web.Mvc;
using Business.Entities.Paging;
using Business.Entities.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Collections;
using Module.Framework.UltimateClient;
using System.Net;
using NghiepVuModule.Models;

namespace NghiepVuModule.Controllers
{
    public class NganhYController : BaseController
    {

        #region Chứng Chỉ
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult TraCuuChungChiByPage(int draw, int start, int length,
            ChungChiSearchViewModel chungchi
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

                var res = NganhY_ChungChiHanhNgheY_Lst(model, out filteredResultsCount,
                    chungchi,
                    out totalResultsCount);
                var result = new List<ChungChiHanhNgheYViewModel>(res.Count);
                result.AddRange(res.Select(s => new ChungChiHanhNgheYViewModel
                {
                    SoChungChi = s.SoChungChi,
                    NgayCap = s.NgayCap,
                    HoTen = s.HoTen,
                    ChungChiHanhNgheYID = s.ChungChiHanhNgheYID,
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

        public IList<ChungChiHanhNgheYViewModel> NganhY_ChungChiHanhNgheY_Lst(DataTableAjaxPostModel model,
            out int filteredResultsCount, ChungChiSearchViewModel chungchi,
            out int totalResultsCount)
        {
            try
            {
                var take = model.length;
                var skip = model.start != 0 ? model.start / take : 0;
                var pageindex = skip + 1;
                using (NganhYService = new NganhYServiceClient())
                {
                    var result = new List<ChungChiHanhNgheYViewModel>();
                    var data = NganhYService.NganhY_ChungChiHanhNgheY_Lst(chungchi.SoChungChi, chungchi.NgayNhanTu,
                        chungchi.NgayNhanDen, chungchi.NguoiNop, chungchi.SoGiayTo, chungchi.TrangThai,
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
                return new List<ChungChiHanhNgheYViewModel>();
            }

        }
        #endregion



        public ActionResult QuangCaoLst()
        {
            return View();
        }

        public ActionResult AnToanSinhHocLst()
        {
            return View();
        }
        public ActionResult LuongYLst()
        {
            return View();
        }
        public ActionResult GiaTruyenLst()
        {
            return View();
        }
        public ActionResult NhanDaoLst()
        {
            return View();
        }
        public ActionResult ChuThapDoLst()
        {
            return View();
        }
        public ActionResult BaoCaoNganhY()
        {
            return View();
        }
        public ActionResult BaoCaoDonVi()
        {
            return View();
        }
        public ActionResult NhapDauKyBaoCao()
        {
            return View();
        }
        public ActionResult ThuHoi()
        {
            return View();
        }
        public ActionResult RutChungChi()
        {
            return View();
        }

        public ActionResult CoSoKCB()
        {
            return View();
        }

    }
}