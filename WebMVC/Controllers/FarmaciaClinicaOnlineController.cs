using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using WebMVC.Models;
using System.Security.Principal;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using RestSharp;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace WebMVC.Controllers
{
    public class FarmaciaOnlineController : Controller
    {
        private readonly IConfiguration _config;
        public FarmaciaOnlineController(IConfiguration config = null)
        {
            _config = config;
        }
        public async Task<ActionResult> Index()
        {
            var urls = new List<string>();
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getUrlScotiabankFarmacia"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    urls = JsonConvert.DeserializeObject<List<string>>(apiResponse); ;
                }
            }

            ViewBag.hasTitleLayout = 1;
            if (urls.Count > 0){
                ViewBag.Urls = urls;

            }else{
                urls.Add("www.google.com");
                urls.Add("www.google.com");
            }
           
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public string GetHostValue(string value)
        {
            var hostTest = _config["HostTest"];
            if (!string.IsNullOrEmpty(hostTest))
                return hostTest;
            else
                return value;
        }
    }
}
