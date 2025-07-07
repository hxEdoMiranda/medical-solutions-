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

namespace WebMVC.Controllers
{
    [Authorize(AuthenticationSchemes = "ContralorSchemes")]
    public class ContralorController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _config;
        public ContralorController(IConfiguration config = null)
        {
            _config = config;
        }
        // GET: Contralor
        public ActionResult Index()
        {
            return View();
        }

        // GET: Contralor/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Contralor/Create
        public ActionResult Create()
        {
            return View();
        }

       

        // GET: Contralor/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        
        // GET: Contralor/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        
    }
}