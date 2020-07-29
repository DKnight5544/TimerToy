using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using TimerToy.Models;



namespace TimerToy.Controllers
{
    public class ApiController : Controller
    {

        [HttpPost]
        public string SelectAll(Parameters parms)
        {
            using (DWKDBDataContext db = new DWKDBDataContext())
            {
                var timerList = db.SelectAllByPage(parms.PageKey).ToList();
                string response = new JavaScriptSerializer().Serialize(timerList);
                return response;
            }
        }

        [HttpPost]
        public string UpdatePageName(Parameters parms)
        {
            string msg;

            string description = parms.PageName.Trim();
            if (description.Length > 150) description = description.Substring(0, 150);

            using (DWKDBDataContext db = new DWKDBDataContext())
            {
                try
                {
                    db.UpdatePageName(parms.PageKey, description);
                    msg = "OK";
                }
                catch (System.Exception e)
                {
                    msg = "Page Name Failed: " + e.Message;
                }
            }

            return msg;

        }

        [HttpPost]
        public string UpdateTimerName(Parameters parms)
        {

            string newName = parms.TimerName.Trim();
            if (newName.Length > 150) newName = newName.Substring(0, 150);

            using (DWKDBDataContext db = new DWKDBDataContext())
            {
                var timer = db.UpdateTimerName(parms.TimerKey, newName).SingleOrDefault();
                string response = new JavaScriptSerializer().Serialize(timer);
                return response;
            }


        }

        [HttpPost]
        public string AddTimer(Parameters parms)
        {
            using (DWKDBDataContext db = new DWKDBDataContext())
            {
                var timer = db.InsertNewTimer(parms.PageKey, false).SingleOrDefault();
                string response = new JavaScriptSerializer().Serialize(timer);
                return response;
            }
        }

        [HttpPost]
        public string ToggleTimer(Parameters parms)
        {
            using (DWKDBDataContext db = new DWKDBDataContext())
            {
                var timer = db.ToggleTimer(parms.TimerKey).SingleOrDefault();
                string response = new JavaScriptSerializer().Serialize(timer);
                return response;
            }
        }

        [HttpPost]
        public string DeleteTimer(Parameters parms)
        {
            string msg;
            using (DWKDBDataContext db = new DWKDBDataContext())
            {
                try
                {
                    db.DeleteTimer(parms.TimerKey);
                    msg = "OK";
                }
                catch (System.Exception e)
                {
                    msg = "Failed: " + e.Message;
                }
            }

            return msg;

        }

        [HttpPost]
        public string AdjustTimer(Parameters parms)
        {
            using (DWKDBDataContext db = new DWKDBDataContext())
            {
                var timer =  db.AdjustTimer(parms.TimerKey, parms.Seconds).SingleOrDefault();
                string response = new JavaScriptSerializer().Serialize(timer);
                return response;
            }

        }

        [HttpPost]
        public string ResetTimer(Parameters parms)
        {
            using (DWKDBDataContext db = new DWKDBDataContext())
            {
                var timer = db.ResetTimer(parms.TimerKey).SingleOrDefault();
                string response = new JavaScriptSerializer().Serialize(timer);
                return response;
            }

        }


    }

}