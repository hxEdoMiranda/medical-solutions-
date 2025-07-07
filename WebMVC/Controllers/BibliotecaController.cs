using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace WebMVC.Controllers
{
    [Authorize(AuthenticationSchemes = "PacienteSchemes")]
    public class BibliotecaController : Controller
    {
        

        // GET: BibliotecaController
        private readonly IConfiguration _config;
        private IHostingEnvironment Environment;
        public BibliotecaController( IHostingEnvironment _environment,IConfiguration config = null)
        {
            _config = config;
            Environment = _environment;

        }
        public async Task<ActionResult> Index()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.hasTitleLayout = 1; //hace que se muestre el saludopaciente con el nombre de este y no con un texto custom como en el agendar/index
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

        public async Task<string> GetTituloWiki()
        {
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            string tituloWiki = "WikiDoc";
            string titulo = "";
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getTituloBiblioteca?idCliente={Convert.ToInt32(idCliente)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    titulo = apiResponse;
                }
            }
            if (titulo.Length > 1)
                tituloWiki = titulo;
            return tituloWiki;
        }
        public async Task<ActionResult> Notas()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> NotasScotia()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }


        public async Task<ActionResult> Charlas()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Capsulas()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> CapsulasScotia()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }


        public async Task<ActionResult> CapsulasMasProteccion()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        [HttpGet]
        public virtual IActionResult DescargarCaja(string file)
        {

            if (file != null)
            {
                var path = Path.Combine(Environment.WebRootPath + "\\PDFSNotas\\caja\\", file + ".pdf");
                var fs = new FileStream(path, FileMode.Open);

                // Return the file. A byte array can also be used instead of a stream
                return File(fs, "application/octet-stream", file + ".pdf");
            }
            else
            {
                return new EmptyResult();
            }
        }

        [HttpGet]
        public virtual IActionResult Descargar(string file)
        {

            if (file != null)
            {
                var path = Path.Combine(Environment.WebRootPath+ "\\PDFSNotas\\", file + ".pdf");
                var fs = new FileStream(path, FileMode.Open);

                // Return the file. A byte array can also be used instead of a stream
                return File(fs, "application/octet-stream", file + ".pdf");
            }
            else
            {
                return new EmptyResult();
            }
        }

        [HttpGet]
        public virtual IActionResult DescargarCenco(string file)
        {

            if (file != null)
            {
                try
                {
                    var path = Path.Combine(Environment.WebRootPath + "\\PDFSNotas\\MundoSeguro\\", file + ".pdf");
                    var fs = new FileStream(path, FileMode.Open);

                    // Return the file. A byte array can also be used instead of a stream
                    return File(fs, "application/octet-stream", file + ".pdf");
                }
                catch
                {
                    var path = Path.Combine(Environment.WebRootPath + "\\PDFSNotas\\MundoSeguro\\", file + ".docx");
                    var fs = new FileStream(path, FileMode.Open);

                    // Return the file. A byte array can also be used instead of a stream
                    return File(fs, "application/octet-stream", file + ".docx");
                }
            }
            else
            {
                return new EmptyResult();
            }
        }

        public async Task<ActionResult> NotaScotia(string codigoNota)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.codigoNota = codigoNota;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var view = "~/Views/Biblioteca/RecetasScotia/" + codigoNota + ".cshtml";
            return View(view);
        }


        public async Task<ActionResult> NotaCaja(string codigoNota)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.codigoNota = codigoNota;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var view = "~/Views/Biblioteca/RecetasCaja/" + codigoNota + ".cshtml";
            return View(view);
        }


        public async Task<ActionResult> NotasMundoSeguro(string codigoNota)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.codigoNota = codigoNota;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var view = "~/Views/Biblioteca/RecetasMundoSeguro/" + codigoNota + ".cshtml";
            return View(view);
        }
        public async Task<ActionResult> NotaMasProteccion(string codigoNota)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.codigoNota = codigoNota;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var view = "~/Views/Biblioteca/RecetasMasProteccion/" + codigoNota + ".cshtml";
            return View(view);
        }
        public async Task<ActionResult> NotaMundoSeguro(string codigoNota)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.codigoNota = codigoNota;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var view = "~/Views/Biblioteca/RecetasMundoSeguro/" + codigoNota + ".cshtml";
            return View(view);
        }

        public async Task<ActionResult> Nota1()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Nota2()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Nota3()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Nota4()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }


        public async Task<ActionResult> Nota5()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }


        public async Task<ActionResult> Nota6()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Nota7()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<ActionResult> Nota8()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<ActionResult> Nota9()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<ActionResult> Nota10()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<ActionResult> Nota11()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Charla1()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<ActionResult> Charla2()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<ActionResult> Charla3()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<ActionResult> Capsula1()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<ActionResult> Capsula2()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<ActionResult> Capsula3()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Capsula4()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Capsula5()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Capsula6()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Capsula7()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Capsula8()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Capsula9()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Capsula10()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Capsula11()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> Capsula12()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.hasTitleLayout = 1;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tituloBiblioteca = await GetTituloWiki();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }




    }
}