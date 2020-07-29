
using System.Linq;
using System.Collections.Generic;
using System.Web.Mvc;
using TimerToy.Models;


namespace TimerToy.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index(string id)
        {
            using (DWKDBDataContext db = new DWKDBDataContext())
            {

                string pageKey = "";

                if (string.IsNullOrWhiteSpace(id))
                {
                    db.InsertNewPage(ref pageKey);
                    return Redirect(pageKey);
                }
                else
                {
                    var Page = db.SelectPageData(id).SingleOrDefault();
                    if (Page != null) return View(Page);
                    else
                    {
                        db.InsertNewPage(ref pageKey);
                        return Redirect(pageKey);
                    }
                }

            }

        }

    }
}