using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using WebMVC.Models;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using RestSharp;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using Newtonsoft.Json.Linq;



namespace WebMVC.Controllers
{
    [Authorize(AuthenticationSchemes = "PacienteInvitadoSchemes")]
    public class PacienteInvitadoController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _config;
        public PacienteInvitadoController(IConfiguration config = null)
        {
            _config = config;
        }

        private void campos(string empresa)
        {

            EmpresaConfig empresaC = JsonConvert.DeserializeObject<EmpresaConfig>(empresa);
            ViewBag.imgSuscripcion = empresaC.ImgSuscripcion;
            ViewBag.textoSuscripcion = empresaC.TextoSuscripcion;
            ViewBag.subTextoSuscripcion = empresaC.SubTextoSuscripcion;
            ViewBag.visibleSuscripcion = "";
            if (!empresaC.VisibleSuscripcion)
                ViewBag.visibleSuscripcion = "hidden";

            ViewBag.imgAtencionmg = empresaC.ImgAtencionmg;
            ViewBag.textoAtencionmg = empresaC.TextoAtencionmg;
            ViewBag.subTextoAtencionmg = empresaC.SubTextoAtencionmg;
            ViewBag.visibleAtencionmg = "";
            if (!empresaC.VisibleAtencionmg)
                ViewBag.visibleAtencionmg = "hidden";

            ViewBag.imgAtencionPed = empresaC.ImgAtencionPed;
            ViewBag.textoAtencionPed = empresaC.TextoAtencionPed;
            ViewBag.subTextoAtencionPed = empresaC.SubTextoAtencionPed;
            ViewBag.visibleAtencionPed = "";
            if (!empresaC.VisibleAtencionPed)
                ViewBag.visibleAtencionPed = "hidden";

            ViewBag.imgOndemand = empresaC.ImgOndemand;
            ViewBag.textoOndemand = empresaC.TextoOndemand;
            ViewBag.subTextoOndemand = empresaC.SubTextoOndemand;
            ViewBag.visibleOndemand = "";
            if (!empresaC.VisibleOndemand)
                ViewBag.visibleOndemand = "hidden";

            ViewBag.imgVet = empresaC.ImgVet;
            ViewBag.textoVet = empresaC.TextoVet;
            ViewBag.subTextoVet = empresaC.SubTextoVet;
            ViewBag.visibleVet = "";
            if (!empresaC.VisibleVet)
                ViewBag.visibleVet = "hidden";

            ViewBag.imgAsistenciaSalud = empresaC.ImgAsistenciaSalud;
            ViewBag.textoAsistenciaSalud = empresaC.TextoAsistenciaSalud;
            ViewBag.visibleAsistenciaSalud = "";
            if (!empresaC.VisibleAsistenciaSalud)
                ViewBag.visibleAsistenciaSalud = "hidden";

            ViewBag.imgPortalFarmacias = empresaC.ImgPortalFarmacias;
            ViewBag.textoPortalFarmacias = empresaC.TextoPortalFarmacias;
            ViewBag.visiblePortalFarmacias = "";
            if (!empresaC.VisiblePortalFarmacias)
                ViewBag.visiblePortalFarmacias = "hidden";

            ViewBag.imgExamenesDomicilio = empresaC.ImgExamenesDomicilio;
            ViewBag.textoExamenesDomicilio = empresaC.TextoExamenesDomicilio;
            ViewBag.visibleExamenesDomicilio = "";
            if (!empresaC.VisibleExamenesDomicilio)
                ViewBag.visibleExamenesDomicilio = "hidden";

            ViewBag.imgOrientacionEnfermeria = empresaC.ImgOrientacionEnfermeria;
            ViewBag.textoOrientacionEnfermeria = empresaC.TextoOrientacionEnfermeria;
            ViewBag.visibleOrientacionEnfermeria = "";
            if (!empresaC.VisibleOrientacionEnfermeria)
                ViewBag.visibleOrientacionEnfermeria = "hidden";

            ViewBag.imgPremiosBeneficios = empresaC.ImgPremiosBeneficios;
            ViewBag.textoPremiosBeneficios = empresaC.TextoPremiosBeneficios;
            ViewBag.visiblePremiosBeneficios = "";
            if (!empresaC.VisiblePremiosBeneficios)
                ViewBag.visiblePremiosBeneficios = "hidden";
            //Nuevo Boton 
            ViewBag.ImgAtencionPresencial = empresaC.ImgAtencionPresencial;
            ViewBag.TextoAtencionPresencial = empresaC.TextoAtencionPresencial;
            ViewBag.SubTextoAtencionPresencial = empresaC.SubTextoAtencionPresencial;
            ViewBag.VisibleAtencionPresencial = "";
            if (!empresaC.VisibleAtencionPresencial)
                ViewBag.VisibleAtencionPresencial = "hidden";

            //Nuevo Boton 
            ViewBag.ImgBiblioteca = empresaC.ImgBiblioteca;
            ViewBag.TextoBiblioteca = empresaC.TextoBiblioteca;
            ViewBag.VisibleBiblioteca = "";
            if (!empresaC.VisibleBiblioteca)
                ViewBag.VisibleBiblioteca = "hidden";

            ViewBag.visibleBanners = "";
            if (!empresaC.VisibleBanners)
                ViewBag.visibleBanners = "hidden";


            ViewBag.logoEmpresa = empresaC.LogoEmpresa;
            ViewBag.imgUsuario = empresaC.ImgUsuario;
            ViewBag.nombreUsuario = empresaC.NombreUsuario;
            ViewBag.VisibleNotice = empresaC.VisibleNotice;

            // botones mx co
            ViewBag.ImgDermapp = "/img/home/iconos/dermapp.png";
            ViewBag.ImgMedicinaOcupacional = "/img/home/iconos/medicina-ocupacional.svg";

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

        }

        [Route("AgendarInvitado")]
        public async Task<IActionResult> Agendar_Invitado(string tipo, string tipoEspecialidad, string IdclienteVC = "", int IdEspecialidad = 0)       
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            Empresa empresaCargas;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getConfigCargasEmpresa?idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    empresaCargas = JsonConvert.DeserializeObject<Empresa>(apiResponse);
                }
            }
            ViewBag.Empresa = empresaCargas;

            if (IdclienteVC.Length > 0)
            {

                var userr = User as ClaimsPrincipal;
                var identity = userr.Identity as ClaimsIdentity;

                foreach (var c in userr.Claims)
                {
                    if (c.Type == ClaimTypes.PrimarySid)
                    {
                        identity.RemoveClaim(c);
                        break;
                    }

                }

                identity.AddClaim(new Claim(ClaimTypes.PrimarySid, IdclienteVC));
                await HttpContext.SignInAsync($"PacienteInvitadoSchemes",
                    new ClaimsPrincipal(new ClaimsIdentity(userr.Claims, "Cookies", "user", "role")),
                    new AuthenticationProperties
                    {
                        IsPersistent = true,
                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                    });



            }

            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tipo = tipo;
            ViewBag.tipoEspecialidad = tipoEspecialidad;
            ViewBag.IdEspecialidad = IdEspecialidad;
            var empresa = HttpContext.User.FindFirstValue("empresa");
            if (empresa == null || empresa == "null" || empresa == "")
                return Redirect("/Account/loginPaciente");
            campos(empresa);

            var fecha = DateTime.Now.Date;

            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente invitado ingresa a Agendar";
                log.IdPaciente = Convert.ToInt32(uid);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
        
            PersonasViewModel paciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }


            AgendaViewModel agendaModel = new AgendaViewModel() { fichaPaciente = paciente, idCliente = idCliente };
            return View(agendaModel);
        }


        // GET: Paciente/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Paciente/Create
        public ActionResult Create()
        {
            return View();
        }


        // GET: Paciente/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }


        // GET: Paciente/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }


        public async Task<ActionResult> agenda_Invitado_1Async(int idMedico, string fechaPrimeraHora, string m, string r, string c, int? especialidad = 0, string tipoatencion = "")
        {

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.idMedico = idMedico;
            ViewBag.fechaPrimeraHora = fechaPrimeraHora;
            ViewBag.m = m;
            ViewBag.r = r;
            ViewBag.c = c;
            ViewBag.especialidad = especialidad;
            ViewBag.tipoatencion = tipoatencion;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;



            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Agenda 1";
                log.IdPaciente = Convert.ToInt32(uid);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            if (idCliente == "108")
            {
                ViewData["FondoBlanco"] = "true";
            }
            return View();
        }

        public async Task<IActionResult> agenda_Invitado_2(int idMedico, string fechaPrimeraHora, string m, string r, string c, int especialidad, string tipoatencion = "", string tipoEspecialidad = "")
        {

            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.idMedico = idMedico;
            ViewBag.fechaPrimeraHora = fechaPrimeraHora;
            ViewBag.m = m;
            ViewBag.r = r;
            ViewBag.c = c;
            ViewBag.idCliente = idCliente;
            ViewBag.tipoatencion = tipoatencion;
            ViewBag.especialidad = especialidad;
            ViewBag.tipoEspecialidad = tipoEspecialidad;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Agenda 2";
                log.IdPaciente = Convert.ToInt32(uid);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            PersonasViewModel persona;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{idMedico}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            PersonasViewModel personaUsu;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
                if(personaUsu != null)
                {
                    ViewBag.codigoPais = personaUsu.CodigoTelefono;
                }
            }

            PersonasDatos personaDatos;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/personasDatosByUser/{idMedico}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaDatos = JsonConvert.DeserializeObject<PersonasDatos>(apiResponse);
                }
            }
            int precioConvenioEspecialidad = 0;
            using (var httpClient = new HttpClient())
            {
                int idConvenio = Convert.ToInt32(c);
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Parametro/getPrecioEspecialidad/{idCliente}/{especialidad}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    precioConvenioEspecialidad = JsonConvert.DeserializeObject<int>(apiResponse);
                }
            }
            if (precioConvenioEspecialidad > 0)
                personaDatos.ValorAtencion = precioConvenioEspecialidad;
            SpGetValorizacionExcepciones valorizacion = new SpGetValorizacionExcepciones();
            if (!String.IsNullOrEmpty(c))
            {
                Convenios convenio;
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Convenios/getConvenio/{c}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        convenio = JsonConvert.DeserializeObject<Convenios>(apiResponse);

                        if (convenio != null)
                        {
                            ViewBag.urlConvenio = convenio.UrlConvenio;
                            ViewBag.textoMarca = convenio.TextoMarca;
                            ViewBag.logoConvenio = convenio.FotoConvenio;
                            if (convenio.IdModeloAtencion == 2) //cobra
                            {
                                if (convenio.IdReglaPago == 1) //porcentaje
                                {
                                    personaDatos.ValorAtencion =
                                        Convert.ToInt32(personaDatos.ValorAtencion * (Convert.ToDouble(convenio.ValorReglaPago) / 100));

                                }
                                else if (convenio.IdReglaPago == 2) //valor
                                {
                                    personaDatos.ValorAtencion = convenio.ValorReglaPago;
                                }
                            }


                            if ((idCliente != null && Convert.ToInt32(idCliente) == 2) || Convert.ToInt32(idCliente) == 148)
                            {
                                //[Route("getValorizacionExcepcion/{idCliente}/{idPaciente}/{idMedico}")]
                                //public int GetValorizacionExcepcion(int idCliente, int idPaciente, int idMedico)

                                using (var httpClientValorizacion = new HttpClient())
                                {
                                    using (var responseValorizacion = await httpClientValorizacion.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/getValorizacionExcepcion/{idCliente}/{uid}/{especialidad}"))
                                    {
                                        string apiResponseValorizacion = await responseValorizacion.Content.ReadAsStringAsync();
                                        valorizacion = JsonConvert.DeserializeObject<SpGetValorizacionExcepciones>(apiResponseValorizacion);

                                        if (valorizacion.ValorAtencion == 0 && (idCliente != null && Convert.ToInt32(idCliente) == 2))
                                        {
                                            ViewBag.m = 1;
                                        }
                                        else
                                        {
                                            personaDatos.ValorAtencion = valorizacion.ValorAtencion;
                                        }



                                    }
                                }

                            }
                        }
                    }
                }
            }


            //ViewBag.valorAtencion = personaDatos.ValorAtencion;


            FichaMedicoViewModel fichaMedico = new FichaMedicoViewModel() { personas = persona, personasDatos = personaDatos, ValorizacionExcepciones = valorizacion };


            if (idCliente == "108")
            {
                ViewData["FondoBlanco"] = "true";
            }
            return View(fichaMedico);
        }

        public async Task<IActionResult> agenda_Invitado_3(int idMedicoHora, int idMedico, int idBloqueHora, DateTime fechaSeleccion, string hora, bool horario, int idAtencion, string m, string r, string c, string tipoatencion = "", int especialidad = 0, string tipoEspecialidad = "")
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.uid = uid;
            ViewBag.idMedicoHora = idMedicoHora;
            ViewBag.idMedico = idMedico;
            ViewBag.idBloqueHora = idBloqueHora;
            ViewBag.fechaSeleccion = fechaSeleccion.ToString();
            ViewBag.fechaText = fechaSeleccion.ToString("dd 'de' MMMMMMM 'del' yyyy");
            ViewBag.fechaAgenda2 = fechaSeleccion.ToString("yyyy'-'MM'-'dd");
            ViewBag.horaText = hora;
            ViewBag.horario = horario;
            ViewBag.idAtencion = idAtencion;
            ViewBag.m = m;
            ViewBag.r = r;
            ViewBag.c = c;
            ViewBag.tipoatencion = tipoatencion;
            ViewBag.especialidad = especialidad;
            ViewBag.tipoEspecialidad = tipoEspecialidad;
            ViewBag.tipoatencion = tipoatencion;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Agenda 3";
                log.IdPaciente = Convert.ToInt32(uid);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            PersonasViewModel persona;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }



            PersonasDatos personaDatos;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/personasDatosByUser/{idMedico}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaDatos = JsonConvert.DeserializeObject<PersonasDatos>(apiResponse);
                }
            }
            int precioConvenioEspecialidad = 0;
            using (var httpClient = new HttpClient())
            {
                int idConvenio = Convert.ToInt32(c);
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Parametro/getPrecioEspecialidad/{idCliente}/{especialidad}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    precioConvenioEspecialidad = JsonConvert.DeserializeObject<int>(apiResponse);
                }
            }
            if (precioConvenioEspecialidad > 0)
                personaDatos.ValorAtencion = precioConvenioEspecialidad;
            SpGetValorizacionExcepciones valorizacion = new SpGetValorizacionExcepciones();
            if (!String.IsNullOrEmpty(c))
            {
                Convenios convenio;
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Convenios/getConvenio/{c}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        convenio = JsonConvert.DeserializeObject<Convenios>(apiResponse);

                        if (convenio != null)
                        {
                            ViewBag.urlConvenio = convenio.UrlConvenio;
                            ViewBag.textoMarca = convenio.TextoMarca;
                            ViewBag.logoConvenio = convenio.FotoConvenio;

                            if (convenio.IdModeloAtencion == 2) //cobra
                            {
                                if (convenio.IdReglaPago == 1) //porcentaje
                                {
                                    personaDatos.ValorAtencion =
                                        Convert.ToInt32(personaDatos.ValorAtencion * (Convert.ToDouble(convenio.ValorReglaPago) / 100));

                                }
                                else if (convenio.IdReglaPago == 2) //valor
                                {
                                    personaDatos.ValorAtencion = convenio.ValorReglaPago;
                                }
                            }
                        }
                    }
                }
            }


            PersonasViewModel personaPaciente;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaPaciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            Especialidades especialidades = new Especialidades();
            var isFonasa = false;
            if (tipoatencion == "I")
            {

                CertificacionResponse certificacion;

                using (var httpClientAtencionConfirma = new HttpClient())
                {
                    httpClientAtencionConfirma.DefaultRequestHeaders.TryAddWithoutValidation("x-api-key", _config["API-KEY-MEDIPASS"]);
                    httpClientAtencionConfirma.DefaultRequestHeaders.TryAddWithoutValidation("idSucursal", _config["ID-SUCURSAL"]);
                    using (var response = await httpClientAtencionConfirma.GetAsync(_config["BASE-VALORIZACION"] + $"/ram/cache/afiliacion/identificacion/{personaPaciente.Identificador}/usuario/1"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        certificacion = JsonConvert.DeserializeObject<CertificacionResponse>(apiResponse);
                    }
                }
                if (certificacion.response.data.ValidarResponse.gloEstado == "Beneficiario afiliado")
                {
                    isFonasa = true;
                    using (var httpClient = new HttpClient())
                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/especialidades/getEspecialidadById?id={especialidad}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            especialidades = JsonConvert.DeserializeObject<Especialidades>(apiResponse);

                        }
                    }
                    using (var httpClient = new HttpClient())
                    {
                        Atenciones atenciones = new Atenciones();
                        atenciones.Id = idAtencion;
                        var jsonString = JsonConvert.SerializeObject(atenciones);
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateAtencionFonasa", httpContent))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                        }
                    }
                    personaDatos.ValorAtencion = especialidades.MontoTotalCopago;
                }
            }
            ViewBag.isFonasa = isFonasa;
            ViewBag.valorAtencion = personaDatos.ValorAtencion;

            if ((idCliente != null && Convert.ToInt32(idCliente) == 2) || Convert.ToInt32(idCliente) == 148)
            {
                //[Route("getValorizacionExcepcion/{idCliente}/{idPaciente}/{idMedico}")]
                //public int GetValorizacionExcepcion(int idCliente, int idPaciente, int idMedico)

                using (var httpClientValorizacion = new HttpClient())
                {
                    using (var responseValorizacion = await httpClientValorizacion.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/getValorizacionExcepcion/{idCliente}/{uid}/{especialidad}"))
                    {
                        string apiResponseValorizacion = await responseValorizacion.Content.ReadAsStringAsync();
                        valorizacion = JsonConvert.DeserializeObject<SpGetValorizacionExcepciones>(apiResponseValorizacion);

                        if (valorizacion != null)
                        {
                            if (valorizacion.ValorAtencion == 0)
                            {
                                ViewBag.m = 1;
                            }
                            else
                            {
                                personaDatos.ValorAtencion = valorizacion.ValorAtencion;
                            }
                        }




                    }
                }

            }
            FichaMedicoViewModel fichaMedico = new FichaMedicoViewModel() { personas = persona, personasDatos = personaDatos, ValorizacionExcepciones = valorizacion, especialidad = especialidades };
            fichaMedico.FechaAtencion = fechaSeleccion.ToString("dd MMM yyyy");
            fichaMedico.HorarioText = hora;
            fichaMedico.amPm = horario ? "AM" : "PM";

            if (idCliente == "108")
            {
                ViewData["FondoBlanco"] = "true";
            }



            /// 3Datos emision pre bono
            fichaMedico.atencion = new Atenciones();

            using (var httpClientAtencionConfirma = new HttpClient())
            {
                httpClientAtencionConfirma.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", "bearer " + auth);
                using (var response = await httpClientAtencionConfirma.GetAsync(_config["ServicesUrl"] + $"/agendamientos/agendar/getAtecionPreBono?idAtencion={idAtencion}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    fichaMedico.atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }


            fichaMedico.atencion.datosMedico = persona;
            fichaMedico.atencion.infoMedico = personaDatos;


            PersonasViewModel paciente;

            using (var httpClientFichaPaciente = new HttpClient())
            {
                using (var responseFichaPaciente = await httpClientFichaPaciente.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={Convert.ToInt32(uid)}"))
                {
                    string apiResponse = await responseFichaPaciente.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                    fichaMedico.atencion.FichaPaciente = paciente;
                }
            }

            //fin datos emision pre bono
            return View(fichaMedico);
        }


        public async Task<IActionResult> ConfirmarAtencion(int idMedicoHora, int idMedico, int idBloqueHora, DateTime fechaSeleccion, string hora, bool horario, int idAtencion, string m, string r, string tipoatencion = "", int especialidad = 0)
        {
            //ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            var uid = 0;
            ViewBag.tipoatencion = tipoatencion;
            ViewBag.idEspecialidad = especialidad;
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var atencion = new Atenciones();
            if (idAtencion != 0)
            {
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + "/agendamientos/Agendar/getAtencionConfirma?idAtencion=" + idAtencion))
                    {
                        var respService = await response.Content.ReadAsStringAsync();
                        atencion = JsonConvert.DeserializeObject<Atenciones>(respService);
                        uid = Convert.ToInt32(atencion.IdUsuarioModifica);
                        ViewBag.uid = uid;

                        PersonasViewModel persona;
                        using (var httpClientPersona = new HttpClient())
                        {
                            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                            using (var responsePersona = await httpClientPersona.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{atencion.HoraMedico.IdMedico}"))
                            {
                                string apiResponse = await responsePersona.Content.ReadAsStringAsync();
                                persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                                atencion.datosMedico = persona;
                            }
                        }
                    }
                }
                PersonasViewModel personaUsu;
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{atencion.IdPaciente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                    }
                    if (personaUsu != null)
                    {
                        atencion.CodigoTelefono = personaUsu.CodigoTelefono;
                        ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                    }
                }


                var log = new LogPacienteViaje();
                using (var httpClient = new HttpClient())
                {
                    log.Evento = "Confirma hora";
                    log.IdPaciente = Convert.ToInt32(uid);
                    var jsonString = JsonConvert.SerializeObject(log);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                    }
                }
            }
            return View(atencion);
        }

        [HttpPost]
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult>confirmacionPago(string hash = null)
        {
            string idCliente = "";
            var atencion = new Atenciones();
            if (!String.IsNullOrWhiteSpace(hash))
            {
                var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
                ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

                //ViewBag.uid = uid;
                var respuestanew = new RespuestaPagoMedipass();
                var respuesta = new RespuestaPago();              
                
            
                var hashDecoded = Base64Decode(hash);

                Console.Write(hashDecoded);
                respuestanew = JsonConvert.DeserializeObject<RespuestaPagoMedipass>(Base64Decode(hash));
                respuesta.transaction_id = respuestanew.response_pago.transaction.id;
                respuesta.status = respuestanew.status;
                respuesta.id = respuestanew.payment_id.ToString();
                //respuesta.verification_key = "sin dato";
                //respuesta.order= "sin dato"
                //respuesta.url = "sin dato";


                respuesta.collection_status = respuestanew.collection_status;
                respuesta.nro_pago = respuestanew.nro_pago;
                respuesta.subject = respuestanew.response_pago.subject;
                respuesta.email = respuestanew.response_pago.email;
                respuesta.created_at = respuestanew.response_pago.created_at;
                respuesta.transaction = new Transaction();



                respuesta.transaction.id = respuestanew.response_pago.transaction.id;
                respuesta.transaction.media = respuestanew.response_pago.transaction.media;
                respuesta.transaction.amount = respuestanew.response_pago.transaction.amount;
                respuesta.transaction.authorization_code = respuestanew.response_pago.transaction.authorization_code;
                respuesta.transaction.last_4_digits = respuestanew.response_pago.transaction.last_4_digits;
                respuesta.transaction.card_type = respuestanew.response_pago.transaction.card_type;
                respuesta.transaction.additional = respuestanew.response_pago.transaction.additional;
                respuesta.transaction.currency = respuestanew.response_pago.transaction.currency;

                var jsonString = JsonConvert.SerializeObject(respuesta);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + "/agendamientos/Agendar/grabarRespuestaPago", httpContent))
                    {
                        var respService = await response.Content.ReadAsStringAsync();
                        atencion = JsonConvert.DeserializeObject<Atenciones>(respService);
                        ViewBag.uid = atencion.IdPaciente;
                        // SETEO UID PACIENTE, EL QUE ESTA EN EL CLAIMS QUEDA NULO, PORQUE SALIO DEL SITIO A LA PASARELA DE PAGO
                        uid = atencion.IdPaciente.ToString();

                        // Autenticamos al usuario

                        if (atencion.IdPaciente != null)
                        {
                            var user = await getUser(atencion.IdPaciente);

                            //var claims = new List<Claim>
                            //{
                            //    new Claim(ClaimTypes.Name, user.Username),
                            //    new Claim(ClaimTypes.Role, user.RoleName),
                            //    new Claim(ClaimTypes.NameIdentifier, atencion.IdUsuarioModifica.Value.ToString())
                            //};

                            //await HttpContext.SignInAsync($"{user.RoleName}Schemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                            //{
                            //    IsPersistent = true,
                            //    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                            //});

                            var host = GetHostValue(HttpContext.Request.Host.Value);
                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, user.Username),
                                new Claim(ClaimTypes.Role, user.RoleName),
                                new Claim(ClaimTypes.NameIdentifier, atencion.IdPaciente.ToString()),
                                new Claim(ClaimTypes.PrimarySid, atencion.IdCliente.Value.ToString()),
                                new Claim(ClaimTypes.Authentication, NewToken(user.Username))
                            };

                            if (Convert.ToInt32(atencion.IdUsuarioModifica) > 0)
                            {
                                //var model = await UsuarioConvenio(user.Username, Convert.ToInt32(ViewBag.uid));

                                List<EmpresaConfig> listaConfig = new List<EmpresaConfig>();
                                listaConfig = await UsersClientLogin(user.Username, host);
                                List<EmpresaGlobal> empresaGlobal = new List<EmpresaGlobal>();

                                EmpresaConfig empresaConfig = new EmpresaConfig();
                                if (listaConfig == null || listaConfig.Count == 0) // VALIDA QUE EXISTE EN ALGUNA EMPRESA
                                    return Json(new { msg = "Inactivo" });
                                if (!listaConfig[0].Existe) //VALIDA QUE EXISTA EN LA EMPRESA QUE SE ESTÁ LOGGEANDO
                                    return Json(new { msg = "Inactivo" });


                                if (listaConfig.Count == 1)
                                {
                                    try
                                    {
                                        empresaConfig = listaConfig[0];
                                        idCliente = empresaConfig.IdCliente.ToString();

                                    }
                                    catch (Exception e)
                                    {

                                        Console.WriteLine(e.Message);
                                    }
                                }

                                string empresa = ""; // model.Value.ToString();

                                empresa = JsonConvert.SerializeObject(empresaConfig).ToString();
                                claims.Add(new Claim("Empresa", empresa));
                                claims.Add(new Claim("CodigoTelefono", empresaConfig.CodTelefono));
                                claims.Add(new Claim("Cla", empresaConfig.IdEmpresa.ToString()));
                                var userr = User as ClaimsPrincipal;
                                var identity = userr.Identity as ClaimsIdentity;

                                foreach (var c in userr.Claims)
                                {
                                    if (c.Type == "Empresa")
                                    {
                                        identity.RemoveClaim(c);
                                        break;
                                    }

                                }
                                identity.AddClaim(new Claim("Empresa", empresa));
                                identity.AddClaim(new Claim(ClaimTypes.PrimarySid, idCliente));
                                identity.AddClaim(new Claim("CodigoTelefono", empresaConfig.CodTelefono.ToString()));
                                identity.AddClaim(new Claim("Cla", empresaConfig.IdEmpresa.ToString()));

                                await HttpContext.SignInAsync($"{user.RoleName}Schemes",
                               new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                               new AuthenticationProperties
                               {
                                   IsPersistent = true,
                                   ExpiresUtc = DateTime.UtcNow.AddDays(1)

                               });

                            }
                            //var host = GetHostValue(HttpContext.Request.Host.Value);
                            //var host = "colmena.medical.medismart.live";
                            //if (host.Contains("doctoronline.")) //login viene de colmena
                            //{
                            //    claims.Add(new Claim(ClaimTypes.PrimarySid, "148"));
                            //}
                            //else if (host.Contains("clini."))
                            //{
                            //    claims.Add(new Claim(ClaimTypes.PrimarySid, "313"));
                            //}
                            //else
                            //{
                            //    claims.Add(new Claim(ClaimTypes.PrimarySid, "0"));
                            //}


                            await HttpContext.SignInAsync($"{user.RoleName}Schemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }

                        // Fin autenticacion del usuario 

                        if (respuesta.status == "VALID")
                        {
                            //using (var httpClientAtencion = new HttpClient())
                            //{
                            //    var jsonStringatencion = JsonConvert.SerializeObject(atencion);
                            //    var httpContentAtencion = new StringContent(jsonStringatencion, Encoding.UTF8, "application/json");
                            //    using (
                            //        var responseAtencion = await httpClientAtencion.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendComprobanteAtencionPaciente", httpContentAtencion))
                            //    {
                            //        string apiResponse = await responseAtencion.Content.ReadAsStringAsync();

                            //    }
                            //}

                            atencion.PagoAprobado = true;
                        }
                        else
                        {
                            atencion.PagoAprobado = false;
                        }
                        PersonasViewModel persona;
                        using (var httpClientPersona = new HttpClient())
                        {
                            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                            using (var responsePersona = await httpClientPersona.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{atencion.HoraMedico.IdMedico}"))
                            {
                                string apiResponse = await responsePersona.Content.ReadAsStringAsync();
                                persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                                atencion.datosMedico = persona;
                            }
                        }

                        PersonasDatos personaDatos;
                        using (var httpClientPersonaDatos = new HttpClient())
                        {
                            using (var responsePersonaDatos = await httpClientPersonaDatos.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/personasDatosByUser/{atencion.HoraMedico.IdMedico}"))
                            {
                                string apiResponse = await responsePersonaDatos.Content.ReadAsStringAsync();
                                personaDatos = JsonConvert.DeserializeObject<PersonasDatos>(apiResponse);
                                atencion.infoMedico = personaDatos;
                            }
                        }


                        PersonasViewModel paciente;

                        using (var httpClientFichaPaciente = new HttpClient())
                        {
                            using (var responseFichaPaciente = await httpClientFichaPaciente.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}"))
                            {
                                string apiResponse = await responseFichaPaciente.Content.ReadAsStringAsync();
                                paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                                atencion.FichaPaciente = paciente;
                            }
                        }

                        //atencion.valorConvenio = Convert.ToInt32( respuesta.transaction.amount);
                    }
                }
            }
            else
            {

                atencion.PagoAprobado = false;
            }
            ViewBag.idCliente = atencion.IdCliente;
       
            if(atencion.PagoAprobado)
            {
                return View( atencion);
            }
            else
            {
                var idAtencionNP = HttpContext.User.FindFirstValue("idatencion");
                if (Convert.ToInt32(idAtencionNP) != 0)                  
                atencion.Id = Convert.ToInt32(idAtencionNP);
                ViewBag.idAtencionNP = Convert.ToInt32(idAtencionNP);
                return View("confirmacionPagoNP", atencion);
            }
        }


        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> confirmacionPagoPayzen()
        {
            //ViewBag.uid = uid;
            var respuestanew = new RespuestaPagoMedipass();
            var respuesta = new RespuestaPago();
            var atencion = new Atenciones();
            if (!String.IsNullOrWhiteSpace(Request.Form["vads_hash"]))
            {
                //var hashDecoded = Base64Decode(null);

                //Console.Write(hashDecoded);
                respuesta.transaction_id = Request.Form["vads_trans_id"].ToString();
                respuesta.status = Request.Form["vads_trans_status"].ToString();
                respuesta.id = Request.Form["vads_tid"].ToString();
                respuesta.collection_status = Request.Form["vads_trans_status"].ToString();
                respuesta.nro_pago = Request.Form["vads_order_id"].ToString();
                respuesta.subject = "Pago PAYZEN País - " + Request.Form["vads_pays_ip"].ToString();
                respuesta.email = "";
                respuesta.created_at = Request.Form["vads_trans_date"].ToString();
                respuesta.transaction = new Transaction();
                string numeroTarjeta = Request.Form["vads_card_number"].ToString();
                string Var_Sub = "";
                if (numeroTarjeta.Length > 0)
                {
                    int tamNumeroTarjeta = numeroTarjeta.Length;
                    Var_Sub = numeroTarjeta.Substring((tamNumeroTarjeta - 4), 4);
                }

                respuesta.transaction.id = Request.Form["vads_tid"].ToString();
                respuesta.transaction.media = "PAYZEN";
                respuesta.transaction.amount = (Convert.ToInt32(Request.Form["vads_amount"]) / 100).ToString();
                respuesta.transaction.authorization_code = Request.Form["vads_auth_number"].ToString();
                respuesta.transaction.last_4_digits = Var_Sub;//numeroTarjeta.Substring(numeroTarjeta.Length - 4, numeroTarjeta.Length);
                respuesta.transaction.card_type = Request.Form["vads_card_brand"].ToString();
                respuesta.transaction.additional = "";
                respuesta.transaction.currency = Request.Form["vads_currency"].ToString();

                var jsonString = JsonConvert.SerializeObject(respuesta);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + "/agendamientos/Agendar/grabarRespuestaPagoPayzen", httpContent))
                    {
                        var respService = await response.Content.ReadAsStringAsync();
                        atencion = JsonConvert.DeserializeObject<Atenciones>(respService);
                        ViewBag.uid = atencion.IdUsuarioModifica;

                        if (Request.Form["vads_url_check_src"].ToString() == "PAY")
                        {
                            if (Request.Form["vads_trans_status"].ToString() == "CAPTURED")
                            {
                                atencion.PagoAprobado = true;
                            }
                            else
                            {
                                atencion.PagoAprobado = false;
                            }
                        }

                        PersonasViewModel paciente;
                        using (var httpClientFichaPaciente = new HttpClient())
                        {
                            using (var responseFichaPaciente = await httpClientFichaPaciente.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}"))
                            {
                                string apiResponse = await responseFichaPaciente.Content.ReadAsStringAsync();
                                paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                                atencion.FichaPaciente = paciente;
                            }
                        }

                        if (atencion.PagoAprobado)
                        {
                            List<Examenes> examenes;
                            using (var httpClientFichaPaciente = new HttpClient())
                            {
                                using (var responseFichaPaciente = await httpClientFichaPaciente.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Examenes/getExamenesPayzenPagos?idAtencion={respuesta.nro_pago}"))
                                {
                                    string apiResponse = await responseFichaPaciente.Content.ReadAsStringAsync();
                                    examenes = JsonConvert.DeserializeObject<List<Examenes>>(apiResponse);
                                }
                            }

                            string apiResponseWs = string.Empty;
                            using (var httpClientEnviarInfoLME = new HttpClient())
                            {                             

                                EnvioLME datosEnvio = new EnvioLME();
                                datosEnvio.Paciente = paciente;
                                datosEnvio.Examenes = examenes;
                                datosEnvio.UsuarioLME = _config["UsuarioLME"];
                                datosEnvio.PaswordLME = _config["PaswordLME"];
                                datosEnvio.ParametroD1LME = _config["ParametroD1LME"];
                                datosEnvio.ParametroD7LME = _config["ParametroD7LME"];

                                string jsonStringPago = JsonConvert.SerializeObject(datosEnvio);
                                var httpContentPago = new StringContent(jsonStringPago, Encoding.UTF8, "application/json");
                                //using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateClienteExterno?idAtencion={usuario.IdAtencion}&idCliente={usuario.IdCliente}&idSesion={usuario.CD_SESSION_ID}", httpContent);

                                using (var responseClientEnviarInfoLME = await httpClientEnviarInfoLME.PostAsync(_config["ServicesUrl"] + $"/soap/ConsumoSoap/getEnviarPagoLME", httpContentPago))
                                {
                                    apiResponseWs = await responseClientEnviarInfoLME.Content.ReadAsStringAsync();
                                }

                                //Enviar correo con notificación de los Examenes pagados
                                datosEnvio.RespuestaPago = respuesta;
                                bool envioCorreo = await EnviarCorreo(datosEnvio);
                            }
                        }
                    }
                }
            }
            var idCliente = atencion.IdCliente; // idCliente
            ViewBag.idCliente = atencion.IdCliente;
            return View(atencion);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> PagoPayzenVolver()
        {

            //var userr = User as ClaimsPrincipal;
            //var identity = userr.Identity as ClaimsIdentity;

            //identity.AddClaim(new Claim("PayzenPago", "Probarpago"));
            //await HttpContext.SignInAsync($"PacienteSchemes",
            //    new ClaimsPrincipal(new ClaimsIdentity(userr.Claims, "Cookies", "user", "role")),
            //    new AuthenticationProperties
            //    {
            //        IsPersistent = true,
            //        ExpiresUtc = DateTime.UtcNow.AddDays(1)
            //    });


            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var AtencionPayzen = HttpContext.User.FindFirstValue("PayzenPagoAtencion");
            //var EstadoPayzen = HttpContext.User.FindFirstValue("PayzenEstadoAtencion");

            //var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            //ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            int idAtencion = uid == null ? 0 : Convert.ToInt32(AtencionPayzen);
            //ViewBag.uid = uid;
            //var respuestanew = new RespuestaPagoMedipass();
            //var respuesta = new RespuestaPago();
            Atenciones atencion;

            using (var httpClient = new HttpClient())
            {

                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }

                List<AtencionesExamenes> atencionExamen;
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/AtencionesExamenes/getAtencionesPayzenEnPagos?idAtencion={idAtencion}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencionExamen = JsonConvert.DeserializeObject<List<AtencionesExamenes>>(apiResponse);
                }

                if (atencionExamen.Count > 0)
                {
                    foreach (AtencionesExamenes item in atencionExamen)
                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/AtencionesExamenes/updateAtencionesPayzenEnPagos?idAtencion={item.IdAtencion}&idExamen={item.IdExamen}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                        }
                    }
                    if (atencionExamen[0].EstadoPago == "CAPTURED")
                    {
                        atencion.PagoAprobado = true; 
                    }
                    else
                    {
                        atencion.PagoAprobado = false;
                    }
                }

                PersonasViewModel persona;
                using (var httpClientPersona = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                    using (var responsePersona = await httpClientPersona.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{atencion.HoraMedico.IdMedico}"))
                    {
                        string apiResponse = await responsePersona.Content.ReadAsStringAsync();
                        persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                        atencion.datosMedico = persona;
                    }
                }

                PersonasDatos personaDatos;
                using (var httpClientPersonaDatos = new HttpClient())
                {
                    using (var responsePersonaDatos = await httpClientPersonaDatos.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/personasDatosByUser/{atencion.HoraMedico.IdMedico}"))
                    {
                        string apiResponse = await responsePersonaDatos.Content.ReadAsStringAsync();
                        personaDatos = JsonConvert.DeserializeObject<PersonasDatos>(apiResponse);
                        atencion.infoMedico = personaDatos;
                    }
                }

                PersonasViewModel paciente;
                using (var httpClientFichaPaciente = new HttpClient())
                {
                    using (var responseFichaPaciente = await httpClientFichaPaciente.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}"))
                    {
                        string apiResponse = await responseFichaPaciente.Content.ReadAsStringAsync();
                        paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                        atencion.FichaPaciente = paciente;
                    }
                }
            }


                var idCliente = atencion.IdCliente; // idCliente
                ViewBag.idCliente = atencion.IdCliente;
                return View(atencion);


            //            ViewBag.uid = atencion.IdUsuarioModifica;


            //            // Autenticamos al usuario

            //            if (atencion.IdUsuarioModifica != null)
            //            {
            //                var user = await getUser(atencion.IdUsuarioModifica.Value);

            //                //var claims = new List<Claim>
            //                //{
            //                //    new Claim(ClaimTypes.Name, user.Username),
            //                //    new Claim(ClaimTypes.Role, user.RoleName),
            //                //    new Claim(ClaimTypes.NameIdentifier, atencion.IdUsuarioModifica.Value.ToString())
            //                //};

            //                //await HttpContext.SignInAsync($"{user.RoleName}Schemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
            //                //{
            //                //    IsPersistent = true,
            //                //    ExpiresUtc = DateTime.UtcNow.AddDays(1)

            //                //});

            //                var claims = new List<Claim>
            //                {
            //                    new Claim(ClaimTypes.Name, user.Username),
            //                    new Claim(ClaimTypes.Role, user.RoleName),
            //                    new Claim(ClaimTypes.NameIdentifier, atencion.IdUsuarioModifica.Value.ToString()),
            //                    new Claim(ClaimTypes.Authentication, NewToken(user.Username))
            //                };

            //                if (Convert.ToInt32(atencion.IdUsuarioModifica) > 0)
            //                {
            //                    var model = await UsuarioConvenio(user.Username, Convert.ToInt32(uid));
            //                    string empresa = model.Value.ToString();

            //                    claims.Add(new Claim("Empresa", empresa));
            //                }
            //                var host = GetHostValue(HttpContext.Request.Host.Value);
            //                //var host = "colmena.medical.medismart.live";
            //                if (host.Contains("doctoronline.")) //login viene de colmena
            //                {
            //                    claims.Add(new Claim(ClaimTypes.PrimarySid, "148"));
            //                }
            //                else
            //                {
            //                    claims.Add(new Claim(ClaimTypes.PrimarySid, "0"));
            //                }
            //                await HttpContext.SignInAsync($"{user.RoleName}Schemes",
            //                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
            //                    new AuthenticationProperties
            //                    {
            //                        IsPersistent = true,
            //                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

            //                    });
            //            }

            //            // Fin autenticacion del usuario 

            //            if (respuesta.status == "VALID")
            //            {
            //                //using (var httpClientAtencion = new HttpClient())
            //                //{
            //                //    var jsonStringatencion = JsonConvert.SerializeObject(atencion);
            //                //    var httpContentAtencion = new StringContent(jsonStringatencion, Encoding.UTF8, "application/json");
            //                //    using (
            //                //        var responseAtencion = await httpClientAtencion.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendComprobanteAtencionPaciente", httpContentAtencion))
            //                //    {
            //                //        string apiResponse = await responseAtencion.Content.ReadAsStringAsync();

            //                //    }
            //                //}

            //                atencion.PagoAprobado = true;
            //            }
            //            else
            //            {
            //                atencion.PagoAprobado = false;
            //            }
            //            PersonasViewModel persona;
            //            using (var httpClientPersona = new HttpClient())
            //            {
            //                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
            //                using (var responsePersona = await httpClientPersona.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{atencion.HoraMedico.IdMedico}"))
            //                {
            //                    string apiResponse = await responsePersona.Content.ReadAsStringAsync();
            //                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
            //                    atencion.datosMedico = persona;
            //                }
            //            }

            //            PersonasDatos personaDatos;
            //            using (var httpClientPersonaDatos = new HttpClient())
            //            {
            //                using (var responsePersonaDatos = await httpClientPersonaDatos.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/personasDatosByUser/{atencion.HoraMedico.IdMedico}"))
            //                {
            //                    string apiResponse = await responsePersonaDatos.Content.ReadAsStringAsync();
            //                    personaDatos = JsonConvert.DeserializeObject<PersonasDatos>(apiResponse);
            //                    atencion.infoMedico = personaDatos;
            //                }
            //            }


            //            PersonasViewModel paciente;

            //            using (var httpClientFichaPaciente = new HttpClient())
            //            {
            //                using (var responseFichaPaciente = await httpClientFichaPaciente.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}"))
            //                {
            //                    string apiResponse = await responseFichaPaciente.Content.ReadAsStringAsync();
            //                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
            //                    atencion.FichaPaciente = paciente;
            //                }
            //            }

            //            //atencion.valorConvenio = Convert.ToInt32( respuesta.transaction.amount);
            //        }
            //    }
            //}
            //var idCliente = atencion.IdCliente; // idCliente
            //ViewBag.idCliente = atencion.IdCliente;
            //switch (atencion.IdCliente)
            //{
            //    case 148:
            //        if (atencion.PagoAprobado)
            //        {
            //            if (atencion.AtencionDirecta)
            //            {
            //                ViewBag.tipoatencion = "I";
            //                return Redirect($"/Paciente/SalaEspera?idAtencion={atencion.Id}");
            //            }

            //            else
            //            {
            //                return View(atencion);
            //            }

            //        }

            //        else
            //            return View(atencion);
            //    default:
            //        return View(atencion);

            //}
        }
        public string GetHostValue(string value)
        {
            string demoVip = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid);
            if (demoVip == _config["DEMO-CHILE"])
                return "demo.";
            else if (demoVip == _config["DEMO-COLOMBIA"])
                return "demo.";
            else if (demoVip == _config["DEMO-MEXICO"])
                return "mx.medical";


            var hostTest = _config["HostTest"];
            if (!string.IsNullOrEmpty(hostTest))
                return hostTest;
            else
                return value;
        }
        public async Task<int> GetActivaBlanco()
        {
            int activaBlanco = 0;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getLaboratorioBlanco"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    activaBlanco = JsonConvert.DeserializeObject<int>(apiResponse);
                }
            }
            return activaBlanco;
        }

        public async Task<IActionResult>agenda_Invitado_4(int idMedicoHora, int idMedico, int idBloqueHora, DateTime fechaSeleccion, string hora, bool horario, int idAtencion, string m, string r, string c, string tipoatencion = "", int especialidad = 0, int newUid = 0)
        {
            var uid = "";
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;

            if (newUid > 0)
            {
                var userr = User as ClaimsPrincipal;
                var identity = userr.Identity as ClaimsIdentity;

                foreach (var claim in userr.Claims)
                {
                    if (claim.Type == ClaimTypes.NameIdentifier)
                    {
                        identity.RemoveClaim(claim);
                        break;
                    }

                }
                identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, newUid.ToString()));
                identity.AddClaim(new Claim("Idatencion", idAtencion.ToString()));

                 uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                //var uid = newUid.ToString();
             

                //await HttpContext.SignInAsync($"PacienteInvitadoSchemes",
                await HttpContext.SignInAsync($"PacienteInvitadoSchemes",
                    new ClaimsPrincipal(new ClaimsIdentity(userr.Claims, "Cookies", "user", "role")),
                    new AuthenticationProperties
                    {
                        IsPersistent = true,
                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                    });
            }


            ViewBag.uid = uid;
            ViewBag.idMedicoHora = idMedicoHora;
            ViewBag.idMedico = idMedico;
            ViewBag.idBloqueHora = idBloqueHora;
            ViewBag.fechaSeleccion = fechaSeleccion.ToString();
            ViewBag.fechaText = fechaSeleccion.ToString("dd 'de' MMMMMMM 'del' yyyy");
            ViewBag.horaText = hora;
            ViewBag.horario = horario;
            ViewBag.idAtencion = idAtencion;
            ViewBag.m = m;
            ViewBag.r = r;
            ViewBag.c = c;
            ViewBag.tipoatencion = tipoatencion;
            ViewBag.especialidad = especialidad;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Agenda 4";
                log.IdPaciente = Convert.ToInt32(uid);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            PersonasViewModel persona;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{idMedico}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            PersonasDatos personaDatos;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/personasDatosByUser/{idMedico}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaDatos = JsonConvert.DeserializeObject<PersonasDatos>(apiResponse);
                }
            }
            int precioConvenioEspecialidad = 0;
            using (var httpClient = new HttpClient())
            {
                int idConvenio = Convert.ToInt32(c);
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Parametro/getPrecioEspecialidad/{idCliente}/{especialidad}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    precioConvenioEspecialidad = JsonConvert.DeserializeObject<int>(apiResponse);
                }
            }
            if (precioConvenioEspecialidad > 0)
                personaDatos.ValorAtencion = precioConvenioEspecialidad;
            SpGetValorizacionExcepciones valorizacion = new SpGetValorizacionExcepciones();
            if (!String.IsNullOrEmpty(c))
            {
                Convenios convenio;
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Convenios/getConvenio/{c}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        convenio = JsonConvert.DeserializeObject<Convenios>(apiResponse);

                        if (convenio != null)
                        {
                            ViewBag.urlConvenio = convenio.UrlConvenio;
                            ViewBag.textoMarca = convenio.TextoMarca;
                            ViewBag.logoConvenio = convenio.FotoConvenio;

                            if (convenio.IdModeloAtencion == 2) //cobra
                            {
                                if (convenio.IdReglaPago == 1) //porcentaje
                                {
                                    personaDatos.ValorAtencion =
                                        Convert.ToInt32(personaDatos.ValorAtencion * (Convert.ToDouble(convenio.ValorReglaPago) / 100));

                                }
                                else if (convenio.IdReglaPago == 2) //valor
                                {
                                    personaDatos.ValorAtencion = convenio.ValorReglaPago;
                                }
                            }
                        }
                    }
                }
            }


            PersonasViewModel personaPaciente;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaPaciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            Especialidades especialidades = new Especialidades();
            var isFonasa = false;
            if (tipoatencion == "I")
            {

                CertificacionResponse certificacion;

                using (var httpClientAtencionConfirma = new HttpClient())
                {
                    httpClientAtencionConfirma.DefaultRequestHeaders.TryAddWithoutValidation("x-api-key", _config["API-KEY-MEDIPASS"]);
                    httpClientAtencionConfirma.DefaultRequestHeaders.TryAddWithoutValidation("idSucursal", _config["ID-SUCURSAL"]);
                    using (var response = await httpClientAtencionConfirma.GetAsync(_config["BASE-VALORIZACION"] + $"/ram/cache/afiliacion/identificacion/{personaPaciente.Identificador}/usuario/1"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        certificacion = JsonConvert.DeserializeObject<CertificacionResponse>(apiResponse);
                    }
                }
                if (certificacion.response.data.ValidarResponse.gloEstado == "Beneficiario afiliado")
                {
                    isFonasa = true;
                    using (var httpClient = new HttpClient())
                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/especialidades/getEspecialidadById?id={especialidad}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            especialidades = JsonConvert.DeserializeObject<Especialidades>(apiResponse);

                        }
                    }
                    using (var httpClient = new HttpClient())
                    {
                        Atenciones atenciones = new Atenciones();
                        atenciones.Id = idAtencion;
                        var jsonString = JsonConvert.SerializeObject(atenciones);
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateAtencionFonasa", httpContent))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                        }
                    }
                    personaDatos.ValorAtencion = especialidades.MontoTotalCopago;
                }
            }
            ViewBag.isFonasa = isFonasa;
            ViewBag.valorAtencion = personaDatos.ValorAtencion;

            if ((idCliente != null && Convert.ToInt32(idCliente) == 2) || Convert.ToInt32(idCliente) == 148)
            {
                //[Route("getValorizacionExcepcion/{idCliente}/{idPaciente}/{idMedico}")]
                //public int GetValorizacionExcepcion(int idCliente, int idPaciente, int idMedico)

                using (var httpClientValorizacion = new HttpClient())
                {
                    using (var responseValorizacion = await httpClientValorizacion.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/getValorizacionExcepcion/{idCliente}/{uid}/{especialidad}"))
                    {
                        string apiResponseValorizacion = await responseValorizacion.Content.ReadAsStringAsync();
                        valorizacion = JsonConvert.DeserializeObject<SpGetValorizacionExcepciones>(apiResponseValorizacion);

                        if (valorizacion != null)
                        {
                            if (valorizacion.ValorAtencion == 0)
                            {
                                ViewBag.m = 1;
                            }
                            else
                            {
                                personaDatos.ValorAtencion = valorizacion.ValorAtencion;
                            }
                        }




                    }
                }

            }
            FichaMedicoViewModel fichaMedico = new FichaMedicoViewModel() { personas = persona, personasDatos = personaDatos, ValorizacionExcepciones = valorizacion, especialidad = especialidades };
            fichaMedico.FechaAtencion = fechaSeleccion.ToString("dd MMM yyyy");
            fichaMedico.HorarioText = hora;
            fichaMedico.amPm = horario ? "AM" : "PM";

            if (idCliente == "108")
            {
                ViewData["FondoBlanco"] = "true";
            }



            /// 3Datos emision pre bono
            fichaMedico.atencion = new Atenciones();

            using (var httpClientAtencionConfirma = new HttpClient())
            {
                httpClientAtencionConfirma.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", "bearer " + auth);
                using (var response = await httpClientAtencionConfirma.GetAsync(_config["ServicesUrl"] + $"/agendamientos/agendar/getAtecionPreBono?idAtencion={idAtencion}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    fichaMedico.atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }


            fichaMedico.atencion.datosMedico = persona;
            fichaMedico.atencion.infoMedico = personaDatos;


            PersonasViewModel paciente;

            using (var httpClientFichaPaciente = new HttpClient())
            {
                using (var responseFichaPaciente = await httpClientFichaPaciente.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={Convert.ToInt32(uid)}"))
                {
                    string apiResponse = await responseFichaPaciente.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                    fichaMedico.atencion.FichaPaciente = paciente;
                }
            }

            //fin datos emision pre bono

            return View(fichaMedico);
        }

        public static string Base64Decode(string str)
        {
            return Encoding.Default.GetString(Convert.FromBase64String(str));
        }


        private async Task<UsersViewModel> getUser(int idUsuario)
        {

            UsersViewModel userdata = null;

            using (var httpClient = new HttpClient())
            {
                var token = NewToken(idUsuario.ToString());
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/getUser?userId={idUsuario}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    userdata = JsonConvert.DeserializeObject<UsersViewModel>(apiResponse);
                }
            }

            return userdata;
        }

        //box sala espera, nueva implementación para consalud

        public async Task<IActionResult> AtencionEspera()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idSesion = HttpContext.User.FindFirstValue(ClaimTypes.Sid);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            var canal = HttpContext.User.FindFirstValue(ClaimTypes.Spn);
            ViewBag.canal = canal;
            ViewBag.uid = uid;


            Atenciones atencion;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionUrgencia?idUser={uid}&idSesion={idSesion}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }
            if (atencion == null || atencion.IdPaciente != int.Parse(uid) || atencion.Estado != "I") return Redirect("https://clientes.consalud.cl/clickdoctor/");
            //if (atencion.Id == -1) return Redirect("https://clientes.consalud.cl/clickdoctor/");
            if (atencion.Id == -1) return Redirect("https://clientes.consalud.cl/clickdoctor/");
            if (atencion.NSP == true && atencion.IdPaciente == int.Parse(uid))
            {
                return Redirect("https://clientes.consalud.cl/clickdoctor/");
            }
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a box de atención desde sala de espera.";
                log.IdPaciente = Convert.ToInt32(uid);
                log.IdAtencion = atencion.Id;
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            if (string.IsNullOrEmpty(atencion.IdVideoCall))
            {
                using (var httpClient = new HttpClient())
                {
                    var jsonString = JsonConvert.SerializeObject(atencion.Id);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                    using (
                        var response = await httpClient.PutAsync(_config["ServicesUrl"] + $"/agendamientos/Vonage", httpContent))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        string sessionId = apiResponse;
                        atencion.IdVideoCall = sessionId;
                    }
                }
            }

            List<Atenciones> historialAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialAtencionesByPaciente/{atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtenciones = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, HistorialAtenciones = historialAtenciones };

            return View(atencionModel);
        }
        public async Task<IActionResult> IngresoSala()
        {
            var idUser = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idSesion = HttpContext.User.FindFirstValue(ClaimTypes.Sid);
            var canal = HttpContext.User.FindFirstValue(ClaimTypes.Spn);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente



            ViewBag.uid = idUser;
            ViewBag.idSesion = idSesion;
            ViewBag.canal = canal;
            ViewBag.idCliente = idCliente;
            var preAtencion = new PreAtencion();
            preAtencion.IdPaciente = Convert.ToInt32(idUser);
            preAtencion.IdSesionPlataforma = idSesion;

            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente Ingreso a sala de espera";
                log.IdPaciente = Convert.ToInt32(idUser);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            Atenciones atencion;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getEstadoFilaUnica?accion=A3&idPaciente={idUser}&idAtencion=0"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }

            var idClienteAtencion = atencion.IdCliente;
            using (var httpClient = new HttpClient())
            {
                var jsonString = JsonConvert.SerializeObject(preAtencion);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/preatencion/insertPreAtencion", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    preAtencion = JsonConvert.DeserializeObject<PreAtencion>(apiResponse);
                }
            }
            PersonasViewModel paciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={idUser}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = paciente };
            return View(atencionModel);
        }

        public async Task<IActionResult> AtencionDirecta(int idAtencion)
        {

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idSesion = HttpContext.User.FindFirstValue(ClaimTypes.Sid);
            if (idSesion == null)
                idSesion = "COLMENA";
            var canal = HttpContext.User.FindFirstValue(ClaimTypes.Spn);
            if (canal == null || canal.Equals(""))
                canal = "plataforma";
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.idSesion = idSesion;
            ViewBag.canal = canal;
            ViewBag.idCliente = idCliente;


            Atenciones atencion;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }

            if (atencion == null || atencion.HoraMedico.IdPaciente != int.Parse(uid) || atencion.Estado != "I") return RedirectToAction("Index");

            if (atencion.NSP == true && atencion.HoraMedico.IdPaciente == int.Parse(uid))
            {
                return RedirectToAction("Index", new { Nombre = atencion.NombrePaciente, Profesional = atencion.NombreMedico });
            }
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a box de atención desde sala de espera colmena.";
                log.IdPaciente = Convert.ToInt32(uid);
                log.IdAtencion = atencion.Id;
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            if (string.IsNullOrEmpty(atencion.IdVideoCall))
            {
                using (var httpClient = new HttpClient())
                {
                    var jsonString = JsonConvert.SerializeObject(atencion.Id);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                    using (
                        var response = await httpClient.PutAsync(_config["ServicesUrl"] + $"/agendamientos/Vonage", httpContent))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        string sessionId = apiResponse;
                        atencion.IdVideoCall = sessionId;
                    }
                }
            }

            List<Atenciones> historialAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialAtencionesByPaciente/{atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtenciones = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, HistorialAtenciones = historialAtenciones };

            return View(atencionModel);
        }

        public async Task<IActionResult> Crear_Paciente()
        {
            return View();
        }


        private async Task<JsonResult> UsuarioConvenio(string username, int uid)
        {
            IntegracionEnroll enroll = null;
            EmpresaConfig empresaConfig = null;
            try
            {
                var jsonString = JsonConvert.SerializeObject(username);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.PostAsync(_config["ServicesEnroll"] + $"/api/getEnroladoRut?rut=" + username, httpContent))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        enroll = JsonConvert.DeserializeObject<IntegracionEnroll>(apiResponse);
                    }
                }
                var host = GetHostValue(HttpContext.Request.Host.Value);
                if (host.Contains("qa.") || HttpContext.Request.Host.Value.Contains("localhost"))
                {
                    enroll = new IntegracionEnroll();
                    enroll.IdUsuario = uid;
                    enroll.Convenio = "COD_SUS";
                    enroll.Activo = "1";
                }
                var jsonStringEnroll = "";
                string apiResponseEmpresa = "";
                string empresa = "";
                enroll.IdUsuario = uid;
                if (enroll.Status != "200")
                {
                    //enroll.Convenio = "MEDISMART";
                    enroll.Convenio = "COD_SUS";

                }
                //var host = "colmena.medical.medismart.live";
                if (host.Contains("inmv."))//login viene de nueva mas vida
                {
                    enroll.Convenio = "INMV";
                }
                else if (host.Contains("doctoronline."))//login viene de colmena
                {
                    enroll.Convenio = "COLMENA";
                }
                else if (host.Contains("vidacamara."))//login viene de colmena
                {
                    enroll.Convenio = "VIDACAMARA";//VIDACAMARA
                }


                if (enroll.Convenio == "VIDACAMARA")
                {
                    jsonStringEnroll = JsonConvert.SerializeObject(enroll);
                    var httpContentEnroll = new StringContent(jsonStringEnroll, Encoding.UTF8, "application/json");
                    using (var httpClient = new HttpClient())
                    {
                        using (var responseEmpresa = await httpClient.PostAsync(_config["Servicesurl"] + $"/usuarios/integracionEnroll/personaConvenio", httpContentEnroll))
                        {
                            apiResponseEmpresa = await responseEmpresa.Content.ReadAsStringAsync();


                        }
                    }
                }
                else
                {
                    jsonStringEnroll = JsonConvert.SerializeObject(enroll);
                    var httpContentEnroll = new StringContent(jsonStringEnroll, Encoding.UTF8, "application/json");
                    using (var httpClient = new HttpClient())
                    {
                        using (var responseEmpresa = await httpClient.PostAsync(_config["Servicesurl"] + $"/usuarios/integracionEnroll/personaConvenio", httpContentEnroll))
                        {
                            apiResponseEmpresa = await responseEmpresa.Content.ReadAsStringAsync();
                            empresaConfig = JsonConvert.DeserializeObject<EmpresaConfig>(apiResponseEmpresa);
                            empresa = JsonConvert.SerializeObject(empresaConfig);
                        }
                    }
                }


                return Json(apiResponseEmpresa);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Json(new { msg = "Inactivo" });
            }
        }

        [HttpGet]
        public async Task<JsonResult> CambioIdCliente(int idCliente = 0)
        {
            try
            {
                var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                ViewBag.uid = uid;
                if (idCliente > 0)
                {

                    var userr = User as ClaimsPrincipal;
                    var identity = userr.Identity as ClaimsIdentity;

                    foreach (var c in userr.Claims)
                    {
                        if (c.Type == ClaimTypes.PrimarySid)
                        {
                            identity.RemoveClaim(c);
                            break;
                        }

                    }
                    identity.AddClaim(new Claim(ClaimTypes.PrimarySid, idCliente.ToString()));

                    await HttpContext.SignInAsync($"PacienteSchemes",
                        new ClaimsPrincipal(new ClaimsIdentity(userr.Claims, "Cookies", "user", "role")),
                        new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTime.UtcNow.AddDays(1)

                        });
                }



                return Json("ok");
            }


            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Json(new { msg = "Inactivo" });
            }
        }
        private async Task<List<EmpresaConfig>> UsersClientLogin(string username, string domain)
        {
            IntegracionEnroll enroll = new IntegracionEnroll();
            List<EmpresaConfig> empresaConfig = null;
            try
            {

                var host = GetHostValue(HttpContext.Request.Host.Value);

                var jsonStringEnroll = "";
                string apiResponseEmpresa = "";
                string empresa = "";

                enroll.Host = domain;
                enroll.Username = username;
                jsonStringEnroll = JsonConvert.SerializeObject(enroll);
                var httpContentEnroll = new StringContent(jsonStringEnroll, Encoding.UTF8, "application/json");
                using (var httpClient = new HttpClient())
                {
                    using (var responseEmpresa = await httpClient.PostAsync(_config["Servicesurl"] + $"/usuarios/configurationUsersClient/UserClient", httpContentEnroll))
                    {

                        apiResponseEmpresa = await responseEmpresa.Content.ReadAsStringAsync();
                        empresaConfig = JsonConvert.DeserializeObject<List<EmpresaConfig>>(apiResponseEmpresa);
                        empresa = JsonConvert.SerializeObject(empresaConfig);
                    }
                }


                return empresaConfig;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return empresaConfig;
            }
        }
        public async Task GrabarLog(LogPacienteViaje log)
        {
            var jsonString = JsonConvert.SerializeObject(log);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
        }
        public string NewToken(string name)
        {

            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = Encoding.ASCII.GetBytes("HYUANJYCCRWJAQNGBUVWEGYWNTCFGGLG");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[] { new Claim(ClaimTypes.Name, name) }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(secretKey),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtString = tokenHandler.WriteToken(token);
            return jwtString;
        }
        private void LogUso(int idTipoServicio, int idAccionServicio, int idUsuario, int idCliente, string urL_Proceso)
        {

            //try del Log de uso de servicio
            try
            {

                //int idTipoServicio = 5;
                //int idAccionServicio = 9;
                //int idUsuario = Convert.ToInt32(uid);
                //int idCliente = idCliente;// model.IdCliente.Value;
                //string urL_Proceso = "Login/userName=" + userName + "&rol=" + rol;// + "&JsonData=" + JsonData + "&returnUrl=" + returnUrl;


                string URL_LogUso = _config["LogUso"] + "/loguso/LogUsoServicio";
                //var client = new RestClient("http://localhost:7000/loguso/LogUsoServicio");
                var client = new RestClient(URL_LogUso);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddHeader("Content-Type", "application/json");
                var body = "{\"idTipoServicio\": " + idTipoServicio + ", \"idAccionServicio\": " + idAccionServicio + ", \"idUsuario\": " + idUsuario + ", \"urL_Proceso\": \"" + urL_Proceso + "\", \"idCliente\": " + idCliente + "}";
                request.AddParameter("application/json", body, ParameterType.RequestBody);
                IRestResponse response = client.Execute(request);
            }
            catch
            {

            }
        }
        private async Task<bool> EnviarCorreo(EnvioLME datosEnvio)
        {
            var jsonString = JsonConvert.SerializeObject(datosEnvio);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            using var httpClient = new HttpClient();
            using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/enviarCorreoPagosPayzen", httpContent);
            string apiResponse = await response.Content.ReadAsStringAsync();
            //var result = new JsonResult(apiResponse);
            //var enroll = JsonConvert.DeserializeObject(apiResponse);

            return apiResponse.Contains("\"OK\"");
        }

    }
}


