//using System;
//using System.Collections.Generic;
//using Business.Entities;
//using Business.Entities.ViewModels;
//using Core.Common.Utilities;
//using Module.Framework.UltimateClient;
//using RestSharp;
//using System.Web.Script.Serialization;

//namespace NghiepVuModule.API
//{
//    public class MotCuaServiceClient : BaseClient, IDisposable
//    {
//        private bool _isDisposed;

//        public MotCuaServiceClient() : base(AppSetting.MCApiBaseUrl)
//        {

//        }

//        #region Dispose

//        public void Dispose()
//        {
//            Dispose(true);
//            GC.SuppressFinalize(this);
//        }

//        private void Dispose(bool disposing)
//        {
//            if (!_isDisposed && disposing)
//            {
//                DisposeCore();
//            }

//            _isDisposed = true;
//        }

//        protected virtual void DisposeCore()
//        {
//        }

//        #endregion



//        //public IRestResponse MotCua_HoSoTiepNhan_SaveFullProcess(HoSoTiepNhanFullProcessSave hoSoTiepNhanInsFullProcess)
//        //{
//        //    var request = new RestRequest("MC/MotCua_HoSoTiepNhan_SaveFullProcess", Method.POST)
//        //    {
//        //        RequestFormat = DataFormat.Json,
//        //        JsonSerializer = new JsonSerializer()
//        //    };
//        //    var json = new JavaScriptSerializer().Serialize(hoSoTiepNhanInsFullProcess);
//        //    request.AddBody(new { json });
//        //    return Execute(request);
//        //}

//    }
//}
