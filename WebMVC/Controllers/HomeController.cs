using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
//using IdentityModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using WebMVC.Models;
using System.Security.Principal;
using System.Text;
//using Microsoft.AspNetCore.Authentication;

namespace WebMVC.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _config;

        //public HomeController(IHttpContextAccessor httpContextAccessor, IConfiguration config)
        //                    : base(httpContextAccessor, config)
        //{

        //}

        public HomeController(IConfiguration config = null)
        {
            _config = config;
        }

        //public async Task<IActionResult> FichaPacienteMedico()
        //{
        //    ViewBag.user = HttpContext.User.Claims.First(x => x.Type.Equals(JwtClaimTypes.Subject))?.Value;


        //    if (User.IsInRole("SuperAdmin"))
        //        return RedirectToAction("IndexSuperAdmin");
        //    else
        //        return View();
        //}

        //[Authorize(Roles = "Admin")]
        public IActionResult IndexAdmin()
        {
            if (User.IsInRole("Admin"))
                return View();
            else
                return RedirectToAction("Index");
        }

        //[Authorize(Roles = "SuperAdmin")]
        public IActionResult IndexSuperAdmin()
        {
            if (User.IsInRole("SuperAdmin"))
                return View();
            else
                return RedirectToAction("Index");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
