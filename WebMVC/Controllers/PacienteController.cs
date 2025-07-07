using DocumentFormat.OpenXml.Office.CustomUI;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using Sentry;
using System;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using PagedList.Mvc;
using WebMVC.Models;
using PagedList;
using IdentityModel;
using System.IO;
using DocumentFormat.OpenXml.Office2010.Excel;

namespace WebMVC.Controllers
{
    [Authorize(AuthenticationSchemes = "PacienteSchemes")]
    public class PacienteController : Controller
    {

        private readonly ILogger<PacienteController> _logger;
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        public PacienteController(IHttpClientFactory httpClientFactory, IConfiguration config = null)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
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

            //Nuevo Boton Tratame
            ViewBag.ImgTratame = empresaC.ImgTratame;
            ViewBag.TextoTratame = empresaC.TextoTratame;
            ViewBag.SubTextoTratame = empresaC.SubTextoTratame;
            ViewBag.VisibleTratame = "";
            if (!empresaC.VisibleTratame)
                ViewBag.VisibleTratame = "hidden";

            //Nuevo Boton Oncologia
            ViewBag.ImgOncologia = empresaC.ImgOncologia;
            ViewBag.TextoOncologia = empresaC.TextoOncologia;
            ViewBag.SubTextoOncologia = empresaC.SubTextoOncologia;
            ViewBag.VisibleOncologia = "";
            if (!empresaC.VisibleOncologia)
                ViewBag.VisibleOncologia = "hidden";

            //Nuevo Boton Contactos de emergencia
            ViewBag.ImgContactoEmergencia = empresaC.ImgContactoEmergencia;
            ViewBag.TextoContactoEmergencia = empresaC.TextoContactoEmergencia;
            ViewBag.SubTextoContactoEmergencia = empresaC.SubTextoContactoEmergencia;
            ViewBag.VisibleContactoEmergencia = "";
            if (!empresaC.VisibleContactoEmergencia)
                ViewBag.VisibleContactoEmergencia = "hidden";

            ViewBag.visibleBanners = "";
            if (!empresaC.VisibleBanners)
                ViewBag.visibleBanners = "hidden";


            ViewBag.logoEmpresa = empresaC.LogoEmpresa;
            ViewBag.imgUsuario = empresaC.ImgUsuario;
            ViewBag.nombreUsuario = empresaC.NombreUsuario;
            ViewBag.VisibleNotice = empresaC.VisibleNotice;

            ViewBag.VisibleAnura = empresaC.VisibleAnura;

            // botones mx co
            ViewBag.ImgDermapp = "/img/home/iconos/dermapp.png";
            ViewBag.ImgMedicinaOcupacional = "/img/home/iconos/medicina-ocupacional.svg";

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);


            //BOTONES ESPECIALIDADES INDIVIDUALES 
            ViewBag.imgNutricion = empresaC.ImgNutricion;
            ViewBag.textoNutricion = empresaC.TextoNutricion;
            ViewBag.subTextoNutricion = empresaC.SubTextoNutricion;
            ViewBag.accionNutricion = empresaC.AccionNutricion;
            ViewBag.visibleNutricion = "";
            if (!empresaC.VisibleNutricion)
                ViewBag.visibleNutricion = "hidden";

            ViewBag.imgPsicologia = empresaC.ImgPsicologia;
            ViewBag.textoPsicologia = empresaC.TextoPsicologia;
            ViewBag.subTextoPsicologia = empresaC.SubTextoPsicologia;
            ViewBag.accionPsicologia = empresaC.AccionPsicologia;
            ViewBag.visiblePsicologia = "";
            if (!empresaC.VisiblePsicologia)
                ViewBag.visiblePsicologia = "hidden";

            ViewBag.imgVeterinaria = empresaC.ImgVeterinaria;
            ViewBag.textoVeterinaria = empresaC.TextoVeterinaria;
            ViewBag.subTextoVeterinaria = empresaC.SubTextoVeterinaria;
            ViewBag.accionVeterinaria = empresaC.AccionVeterinaria;
            ViewBag.visibleVeterinaria = "";
            if (!empresaC.VisibleVeterinaria)
                ViewBag.visibleVeterinaria = "hidden";

            ViewBag.imgKinesiologia = empresaC.ImgKinesiologia;
            ViewBag.textoKinesiologia = empresaC.TextoKinesiologia;
            ViewBag.subTextoKinesiologia = empresaC.SubTextoKinesiologia;
            ViewBag.accionKinesiologia = empresaC.AccionKinesiologia;
            ViewBag.visibleKinesiologia = "";
            if (!empresaC.VisibleKinesiologia)
                ViewBag.visibleKinesiologia = "hidden";

            ViewBag.imgPediatria = empresaC.ImgPediatria;
            ViewBag.textoPediatria = empresaC.TextoPediatria;
            ViewBag.subTextoPediatria = empresaC.SubTextoPediatria;
            ViewBag.accionPediatria = empresaC.AccionPediatria;
            ViewBag.visiblePediatria = "";
            if (!empresaC.VisiblePediatria)
                ViewBag.visiblePediatria = "hidden";

            //BOTONES MASCOTAS
            //DIRECTORIO VETERINARIO
            ViewBag.imgDirectorioVet = empresaC.ImgDirectorioVet;
            ViewBag.textoDirectorioVet = empresaC.TextoDirectorioVet;
            ViewBag.subTextoDirectorioVet = empresaC.SubTextoDirectorioVet;
            ViewBag.accionDirectorioVet = empresaC.AccionDirectorioVet;
            ViewBag.visibleDirectorioVet = "";
            if (!empresaC.VisibleDirectorioVet)
                ViewBag.visibleDirectorioVet = "hidden";

            //PELUQUERIA VETERINARIA
            ViewBag.imgPeluqueriaVet = empresaC.ImgPeluqueriaVet;
            ViewBag.textoPeluqueriaVet = empresaC.TextoPeluqueriaVet;
            ViewBag.subTextoPeluqueriaVet = empresaC.SubTextoPeluqueriaVet;
            ViewBag.accionPeluqueriaVet = empresaC.AccionPeluqueriaVet;
            ViewBag.visiblePeluqueriaVet = "";
            if (!empresaC.VisiblePeluqueriaVet)
                ViewBag.visiblePeluqueriaVet = "hidden";

            //GUARDERIA VETERINARIA
            ViewBag.imgGuarderiaVet = empresaC.ImgGuarderiaVet;
            ViewBag.textoGuarderiaVet = empresaC.TextoGuarderiaVet;
            ViewBag.subTextoGuarderiaVet = empresaC.SubTextoGuarderiaVet;
            ViewBag.accionGuarderiaVet = empresaC.AccionGuarderiaVet;
            ViewBag.visibleGuarderiaVet = "";
            if (!empresaC.VisibleGuarderiaVet)
                ViewBag.visibleGuarderiaVet = "hidden";

            //muevetepositiva
            ViewBag.ImgMuevetePositiva = empresaC.ImgMuevetePositiva;
            ViewBag.TextoMuevetePositiva = empresaC.TextoMuevetePositiva;
            ViewBag.SubTextoMuevetePositiva = empresaC.SubTextoMuevetePositiva;
            ViewBag.AccionMuevetePositiva = empresaC.AccionMuevetePositiva;
            ViewBag.VisibleMuevetePositiva = "";
            if (!empresaC.VisibleMuevetePositiva)
                ViewBag.VisibleMuevetePositiva = "hidden";

            //CoachingFinanciero
            ViewBag.ImgCoachingFinanciero = empresaC.ImgCoachingFinanciero;
            ViewBag.TextoCoachingFinanciero = empresaC.TextoCoachingFinanciero;
            ViewBag.SubTextoCoachingFinanciero = empresaC.SubTextoCoachingFinanciero;
            ViewBag.AccionCoachingFinanciero = empresaC.AccionCoachingFinanciero;
            ViewBag.VisibleCoachingFinanciero = "";
            if (!empresaC.VisibleCoachingFinanciero)
                ViewBag.VisibleCoachingFinanciero = "hidden";

            // SegMedMXAmbulancia
            ViewBag.ImgSegMedMXAmbulancia = empresaC.ImgSegMedMXAmbulancia;
            ViewBag.TextoSegMedMXAmbulancia = empresaC.TextoSegMedMXAmbulancia;
            ViewBag.SubTextoSegMedMXAmbulancia = empresaC.SubTextoSegMedMXAmbulancia;
            ViewBag.AccionSegMedMXAmbulancia = empresaC.AccionSegMedMXAmbulancia;
            ViewBag.VisibleSegMedMXAmbulancia = "";
            if (!empresaC.VisibleSegMedMXAmbulancia)
                ViewBag.VisibleSegMedMXAmbulancia = "hidden";
            //SegMedMXSeguros
            ViewBag.ImgSegMedMXSeguros = empresaC.ImgSegMedMXSeguros;
            ViewBag.TextoSegMedMXSeguros = empresaC.TextoSegMedMXSeguros;
            ViewBag.SubTextoSegMedMXSeguros = empresaC.SubTextoSegMedMXSeguros;
            ViewBag.AccionSegMedMXSeguros = empresaC.AccionSegMedMXSeguros;
            ViewBag.VisibleSegMedMXSeguros = "";
            if (!empresaC.VisibleSegMedMXSeguros)
                ViewBag.VisibleSegMedMXSeguros = "hidden";

            //SegMedMXLaboratorios
            ViewBag.ImgSegMedMXLaboratorios = empresaC.ImgSegMedMXLaboratorios;
            ViewBag.TextoSegMedMXLaboratorios = empresaC.TextoSegMedMXLaboratorios;
            ViewBag.SubTextoSegMedMXLaboratorios = empresaC.SubTextoSegMedMXLaboratorios;
            ViewBag.AccionSegMedMXLaboratorios = empresaC.AccionSegMedMXLaboratorios;
            ViewBag.VisibleSegMedMXLaboratorios = "";
            if (!empresaC.VisibleSegMedMXLaboratorios)
                ViewBag.VisibleSegMedMXLaboratorios = "hidden";

            //SegMedMXFarmacias
            ViewBag.ImgSegMedMXFarmacias = empresaC.ImgSegMedMXFarmacias;
            ViewBag.TextoSegMedMXFarmacias = empresaC.TextoSegMedMXFarmacias;
            ViewBag.SubTextoSegMedMXFarmacias = empresaC.SubTextoSegMedMXFarmacias;
            ViewBag.AccionSegMedMXFarmacias = empresaC.AccionSegMedMXFarmacias;
            ViewBag.VisibleSegMedMXFarmacias = "";
            if (!empresaC.VisibleSegMedMXFarmacias)
                ViewBag.VisibleSegMedMXFarmacias = "hidden";

            //HanuVidaSana
            ViewBag.ImgHanuVidaSana = empresaC.ImgHanuVidaSana;
            ViewBag.TextoHanuVidaSana = empresaC.TextoHanuVidaSana;
            ViewBag.SubTextoHanuVidaSana = empresaC.SubTextoHanuVidaSana;
            ViewBag.AccionHanuVidaSana = empresaC.AccionHanuVidaSana;
            ViewBag.VisibleHanuVidaSana = "";
            if (!empresaC.VisibleHanuVidaSana)
                ViewBag.VisibleHanuVidaSana = "hidden";

            //BOTON SEGURO SEKURE EMBEBIDO

            ViewBag.imgSeguros = empresaC.ImgSeguros;
            ViewBag.textoSeguros = empresaC.TextoSeguros;
            ViewBag.subTextoSeguros = empresaC.SubTextoSeguros;
            ViewBag.visibleSeguros = "";
            if (!empresaC.VisibleSeguros)
                ViewBag.visibleSeguros = "hidden";

            ViewBag.imgNom035 = empresaC.ImgNom035;
            ViewBag.textoNom035 = empresaC.TextoNom035;
            ViewBag.visibleNom035 = "";
            if (!empresaC.VisibleNom035)
                ViewBag.visibleNom035 = "hidden";

            //MOMENTO WOW
            ViewBag.MomentoWow = empresaC.MomentoWow;
            //CONCIERGE
            ViewBag.ChatGpt = empresaC.ChatGpt;
            //PACIENTE CRONICO
            ViewBag.imgPacienteCronico = empresaC.ImgPacienteCronico;
            ViewBag.textoPacienteCronico = empresaC.TextoPacienteCronico;
            ViewBag.subTextoPacienteCronico = empresaC.SubTextoPacienteCronico;
            ViewBag.accionPacienteCronico = empresaC.AccionPacienteCronico;
            ViewBag.visiblePacienteCronico = "";
            if (!empresaC.VisiblePacienteCronico)
                ViewBag.visiblePacienteCronico = "hidden";

            //CLINICA SUEÑO
            ViewBag.imgClinicaSueno = empresaC.ImgClinicaSueno;
            ViewBag.textoClinicaSueno = empresaC.TextoClinicaSueno;
            ViewBag.subTextoClinicaSueno = empresaC.SubTextoClinicaSueno;
            ViewBag.accionClinicaSueno = empresaC.AccionClinicaSueno;
            ViewBag.visibleClinicaSueno = "";
            if (!empresaC.VisibleClinicaSueno)
                ViewBag.visibleClinicaSueno = "hidden";

            //TEST OCUPACIONAL
            ViewBag.imgTestOcupacional = empresaC.ImgTestOcupacional;
            ViewBag.textoTestOcupacional = empresaC.TextoTestOcupacional;
            ViewBag.subTextoTestOcupacionalo = empresaC.SubTextoTestOcupacional;
            ViewBag.accionTestOcupacional = empresaC.AccionTestOcupacional;
            ViewBag.visibleTestOcupacional = "";
            if (!empresaC.VisibleTestOcupacional)
                ViewBag.visibleTestOcupacional = "hidden";

            //Nuevo Boton Receta electronica
            ViewBag.imgRecetaElectronica = empresaC.ImgRecetaElectronica;
            ViewBag.textoRecetaElectronica = empresaC.TextoRecetaElectronica;
            ViewBag.subTextoRecetaElectronica = empresaC.SubTextoRecetaElectronica;
            ViewBag.accionRecetaElectronica = empresaC.AccionRecetaElectronica;
            ViewBag.visibleRecetaElectronica = "";
            if (!empresaC.VisibleRecetaElectronica)
                ViewBag.visibleRecetaElectronica = "hidden";
            //TEST OCUPACIONAL
            ViewBag.imgSmartCheck = empresaC.ImgSmartCheck;
            ViewBag.textoSmartCheck = empresaC.TextoSmartCheck;
            ViewBag.subTextoSmartCheck = empresaC.SubTextoSmartCheck;
            ViewBag.accionSmartCheck = empresaC.AccionSmartCheck;
            ViewBag.visibleSmartCheck = "";
            if (!empresaC.VisibleSmartCheck)
                ViewBag.visibleSmartCheck = "hidden";

            ViewBag.nombreServicio = empresaC.Textplan == null ? "" : empresaC.Textplan;
            ViewBag.imgServicios = empresaC.Imgplan == null ? "" : empresaC.Imgplan;
        }

        private string Encrypt(string texto)
        {
            try
            {
                string clave = "qualityinfosolutions";
                using (var md5 = MD5.Create())
                {
                    byte[] key = md5.ComputeHash(Encoding.UTF8.GetBytes(clave));
                    byte[] desKey = new byte[24];
                    Array.Copy(key, desKey, 16);
                    Array.Copy(key, 0, desKey, 16, 8);

                    using (var tripleDes = TripleDESCryptoServiceProvider.Create())
                    {
                        tripleDes.Key = desKey;
                        tripleDes.Mode = CipherMode.ECB;
                        tripleDes.Padding = PaddingMode.PKCS7;

                        using (var encryptor = tripleDes.CreateEncryptor())
                        {
                            byte[] inputBytes = Encoding.UTF8.GetBytes(texto);
                            byte[] encryptedBytes = encryptor.TransformFinalBlock(inputBytes, 0, inputBytes.Length);
                            string encryptedText = Convert.ToBase64String(encryptedBytes);
                            return encryptedText;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return string.Empty;
            }
        }


        private void camposusuarioempresas(string empresasusuario)
        {
            List<EmpresaConfig> empresasusers = JsonConvert.DeserializeObject<List<EmpresaConfig>>(empresasusuario);
            List<JsonArrayAttribute> lista = new List<JsonArrayAttribute>();
            ViewBag.ListaEmpresas = empresasusers;
            EmpresaConfig empresaConfig = empresasusers.FirstOrDefault();

            ViewBag.imgSuscripcion = empresaConfig.ImgSuscripcion;
            ViewBag.textoSuscripcion = empresaConfig.TextoSuscripcion;
            ViewBag.subTextoSuscripcion = empresaConfig.SubTextoSuscripcion;
            ViewBag.visibleSuscripcion = "";
            if (!empresaConfig.VisibleSuscripcion)
                ViewBag.visibleSuscripcion = "hidden";


            ViewBag.logoEmpresa = empresaConfig.LogoEmpresa;
            ViewBag.imgUsuario = empresaConfig.ImgUsuario;
            ViewBag.nombreUsuario = empresaConfig.NombreUsuario;
            ViewBag.VisibleNotice = empresaConfig.VisibleNotice;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.IsEmpresa = empresaConfig.IsEmpresa;
            ViewBag.ActionUrl = empresaConfig.ActionUrl;


        }

        public async Task<ActionResult> Farmacias(int? page, string? filter = "todos")
        {
            var host = GetHostValue(HttpContext.Request.Host.Value);

            if (host.Contains("segurossura.") || host.Contains("saludproteccion.") || host.Contains("teamco.") || host.Contains("metlife."))
            {
                return Redirect("/Paciente/FarmaciaV1");
            }
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var existeHistorial = 0;
            List<Atenciones> historialAtencionesFarmacia;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialAtencionesByPacienteFarmacia?uid={Convert.ToInt32(uid)}&idCliente={Convert.ToInt32(idCliente)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtencionesFarmacia = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

            List<AtencionMedicamentos> medicamentosAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Medicamentos/getMedicamentosByPacienteFarmacia?uid={Convert.ToInt32(uid)}&idCliente={Convert.ToInt32(idCliente)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    medicamentosAtenciones = JsonConvert.DeserializeObject<List<AtencionMedicamentos>>(apiResponse);
                }
            }
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            PersonasViewModel personaUsu;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
                if (personaUsu != null)
                {
                    ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                }
            }
            existeHistorial = historialAtencionesFarmacia.Count() > 0 ? 1 : 0;
            int pageSize = 4;
            int pageNumber = (page ?? 1);

            ViewBag.historialAtencionesFarmacia = historialAtencionesFarmacia;
            ViewBag.medicamentosAtenciones = medicamentosAtenciones;
            ViewBag.existeHistorial = existeHistorial;
            ViewBag.filter = filter;
            if (filter == "mes")
            {
                historialAtencionesFarmacia = historialAtencionesFarmacia.FindAll(x => x.FechaCreacion > DateTime.Now.AddMonths(-1));
            }
            if (filter == "año")
            {
                historialAtencionesFarmacia = historialAtencionesFarmacia.FindAll(x => x.FechaCreacion > DateTime.Now.AddYears(-1));
            }
            var historialAtencionFilter = historialAtencionesFarmacia.FindAll(x => x.Id != historialAtencionesFarmacia[0].Id);
            //AtencionViewModel atencionModel = new AtencionViewModel() { HistorialAtenciones = historialAtencionesFarmacia };
            return View(historialAtencionFilter.ToPagedList(pageNumber, pageSize));
        }

        public async Task<ActionResult> FarmaciaV1()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var existeHistorial = 0;
            List<Atenciones> historialAtencionesFarmacia;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialAtencionesByPacienteFarmacia?uid={Convert.ToInt32(uid)}&idCliente={Convert.ToInt32(idCliente)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtencionesFarmacia = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

            List<AtencionMedicamentos> medicamentosAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Medicamentos/getMedicamentosByPacienteFarmacia?uid={Convert.ToInt32(uid)}&idCliente={Convert.ToInt32(idCliente)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    medicamentosAtenciones = JsonConvert.DeserializeObject<List<AtencionMedicamentos>>(apiResponse);
                }
            }
            existeHistorial = historialAtencionesFarmacia.Count() > 0 ? 1 : 0;

            ViewBag.historialAtencionesFarmacia = historialAtencionesFarmacia;
            ViewBag.medicamentosAtenciones = medicamentosAtenciones;
            ViewBag.existeHistorial = existeHistorial;
            //AtencionViewModel atencionModel = new AtencionViewModel() { HistorialAtenciones = historialAtencionesFarmacia };
            return View();
        }
        public async Task<ActionResult> FAQ()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var existeHistorial = 0;
            List<Atenciones> historialAtencionesFarmacia;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialAtencionesByPacienteFarmacia?uid={Convert.ToInt32(uid)}&idCliente={Convert.ToInt32(idCliente)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtencionesFarmacia = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

            List<AtencionMedicamentos> medicamentosAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Medicamentos/getMedicamentosByPacienteFarmacia?uid={Convert.ToInt32(uid)}&idCliente={Convert.ToInt32(idCliente)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    medicamentosAtenciones = JsonConvert.DeserializeObject<List<AtencionMedicamentos>>(apiResponse);
                }
            }
            existeHistorial = historialAtencionesFarmacia.Count() > 0 ? 1 : 0;

            ViewBag.historialAtencionesFarmacia = historialAtencionesFarmacia;
            ViewBag.medicamentosAtenciones = medicamentosAtenciones;
            ViewBag.existeHistorial = existeHistorial;
            //AtencionViewModel atencionModel = new AtencionViewModel() { HistorialAtenciones = historialAtencionesFarmacia };
            return View();
        }
        public async Task<ActionResult> FAQ2()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var existeHistorial = 0;
            List<Atenciones> historialAtencionesFarmacia;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialAtencionesByPacienteFarmacia?uid={Convert.ToInt32(uid)}&idCliente={Convert.ToInt32(idCliente)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtencionesFarmacia = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

            List<AtencionMedicamentos> medicamentosAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Medicamentos/getMedicamentosByPacienteFarmacia?uid={Convert.ToInt32(uid)}&idCliente={Convert.ToInt32(idCliente)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    medicamentosAtenciones = JsonConvert.DeserializeObject<List<AtencionMedicamentos>>(apiResponse);
                }
            }
            existeHistorial = historialAtencionesFarmacia.Count() > 0 ? 1 : 0;

            ViewBag.historialAtencionesFarmacia = historialAtencionesFarmacia;
            ViewBag.medicamentosAtenciones = medicamentosAtenciones;
            ViewBag.existeHistorial = existeHistorial;
            //AtencionViewModel atencionModel = new AtencionViewModel() { HistorialAtenciones = historialAtencionesFarmacia };
            return View();
        }
        public async Task<ActionResult> Tutoriales()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            //AtencionViewModel atencionModel = new AtencionViewModel() { HistorialAtenciones = historialAtencionesFarmacia };
            return View();
        }

        public async Task<ActionResult> Examenes(int? page, string? filter = "todos")
        {
            var host = GetHostValue(HttpContext.Request.Host.Value);

            if (host.Contains("teamco.") || host.Contains("metlife."))
            {
                return Redirect("/Paciente/ExamenesV1");
            }
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var existeHistorial = 0;
            ViewBag.activaBlanco = await GetActivaBlanco();
            List<Atenciones> historialAtencionesExamenes;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/GetHistorialAtencionesByPacienteExamenes?uid={Convert.ToInt32(uid)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtencionesExamenes = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }
            List<Examenes> examenesAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/GetExamenesHistorialByPaciente?uid={Convert.ToInt32(uid)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    examenesAtenciones = JsonConvert.DeserializeObject<List<Examenes>>(apiResponse);
                }
            }
            existeHistorial = historialAtencionesExamenes.Count() > 0 ? 1 : 0;


            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            PersonasViewModel personaUsu;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
                if (personaUsu != null)
                {
                    ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                }
            }
            int pageSize = 4;
            int pageNumber = (page ?? 1);

            ViewBag.historialAtencionesExamenes = historialAtencionesExamenes;
            ViewBag.examenesAtenciones = examenesAtenciones;
            ViewBag.existeHistorial = existeHistorial;
            ViewBag.filter = filter;
            if (filter == "mes")
            {
                historialAtencionesExamenes = historialAtencionesExamenes.FindAll(x => x.FechaCreacion > DateTime.Now.AddMonths(-1));
            }
            if (filter == "año")
            {
                historialAtencionesExamenes = historialAtencionesExamenes.FindAll(x => x.FechaCreacion > DateTime.Now.AddYears(-1));
            }
            var historialAtencionFilter = historialAtencionesExamenes.FindAll(x => x.Id != historialAtencionesExamenes[0].Id);
            //AtencionViewModel atencionModel = new AtencionViewModel() { HistorialAtenciones = historialAtencionesFarmacia };
            return View(historialAtencionFilter.ToPagedList(pageNumber, pageSize));
        }

        public async Task<ActionResult> ExamenesV1()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var existeHistorial = 0;
            ViewBag.activaBlanco = await GetActivaBlanco();
            List<Atenciones> historialAtencionesExamenes;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/GetHistorialAtencionesByPacienteExamenes?uid={Convert.ToInt32(uid)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtencionesExamenes = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }
            List<Examenes> examenesAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/GetExamenesHistorialByPaciente?uid={Convert.ToInt32(uid)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    examenesAtenciones = JsonConvert.DeserializeObject<List<Examenes>>(apiResponse);
                }
            }
            existeHistorial = historialAtencionesExamenes.Count() > 0 ? 1 : 0;


            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            PersonasViewModel personaUsu;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
                if (personaUsu != null)
                {
                    ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                }
            }

            ViewBag.historialAtencionesExamenes = historialAtencionesExamenes;
            ViewBag.examenesAtenciones = examenesAtenciones;
            ViewBag.existeHistorial = existeHistorial;
            //AtencionViewModel atencionModel = new AtencionViewModel() { HistorialAtenciones = historialAtencionesFarmacia };
            return View();
        }
        public async Task<ActionResult> PlanSalud()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            var host = GetHostValue(HttpContext.Request.Host.Value);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);

            if (host.Contains("didi.wedoctors"))
            {
                List<Empresa> empresas;
                using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
                {
                    ViewBag.PreHomeDidi = false;

                    httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                    string url = $"/usuarios/Empresa/GetEmpresasDidibyIdentificador/{uid}";
                    using (var response = await httpClient.GetAsync(url))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        // Respuesta no existosa
                        if (!response.IsSuccessStatusCode)
                        {
                            try
                            {
                                throw new HandledException($"HttpException: {url}", "apiResponse", apiResponse);
                            }
                            catch (Exception handledException)
                            {
                                SentrySdk.CaptureException(handledException);
                            }
                        }

                        empresas = JsonConvert.DeserializeObject<List<Empresa>>(apiResponse);

                        if (empresas.Count == 3)
                        { 
                            ViewBag.PreHomeDidi = true;
                        }

                    }
                }
            }

            List<AseguradoraEspecialidadUsuario> Especialidades;


            Especialidades = await GetPlanesAseguradoras();
            Especialidades = Especialidades.Where(e => e.Identificador != "DIDI-FREE").ToList();
            ViewBag.uid = uid;
            ViewBag.idCliente = idCliente;
            ViewBag.Especialidades = Especialidades;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<ActionResult> ExamenesConsalud()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }


        public async Task<ActionResult> HomeAsync(bool view)
        {

            ViewBag.isNewUserFirebase = TempData["isNewUserFirebase"];
            ViewBag.isNewUser = TempData["isNewUser"];
            ViewBag.uidFirebase = TempData["uidFirebase"];
            ViewBag.userMail = TempData["userMail"];
            ViewBag.name = TempData["name"];
            if (ViewBag.isNewUserFirebase == null && ViewBag.isNewUser == null)
            {
                ViewBag.isNewUserFirebase = Request.Cookies.FirstOrDefault(x => x.Key == "cookieNewUserFirebase").Value;
                ViewBag.isNewUser = Request.Cookies.FirstOrDefault(x => x.Key == "cookieNewUser").Value;
                ViewBag.uidFirebase = Request.Cookies.FirstOrDefault(x => x.Key == "cookieUidFirebase").Value;
                ViewBag.userMail = Request.Cookies.FirstOrDefault(x => x.Key == "cookieUserMail").Value;
                ViewBag.name = Request.Cookies.FirstOrDefault(x => x.Key == "cookieName").Value;
            }

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            var empresa = HttpContext.User.FindFirstValue("empresa");
            EmpresaConfig configEmpresa = JsonConvert.DeserializeObject<EmpresaConfig>(empresa.ToString());
            ViewBag.preHome = configEmpresa.PreHome;
            /*PARA OBTENER EL ID CON QUE SE LOGGEO EL PACIENTE. ESTO PARA FILA UNICA*/
            int idClienteSesion = 0;
            idClienteSesion = configEmpresa.IdEmpresa;
            var host = GetHostValue(HttpContext.Request.Host.Value);

            if (host.Contains("didi.wedoctors"))
            {
                List<Empresa> empresas;
                using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
                {
                    string url = $"/usuarios/Empresa/GetEmpresasDidibyIdentificador/{uid}";
                    using (var response = await httpClient.GetAsync(url))
                    {

                        string apiResponse = await response.Content.ReadAsStringAsync();
                        empresas = JsonConvert.DeserializeObject<List<Empresa>>(apiResponse);

                        if (empresas.Count == 3)
                        {
                            return Redirect("/Paciente/PlanSalud");
                        }

                    }
                }
            }

            ViewBag.idClienteSesion = idClienteSesion;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            var userName = HttpContext.User.FindFirstValue(ClaimTypes.Name); // idCliente

            ViewBag.idCliente = idCliente;

            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            PersonasViewModel personaUsu;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                string url = $"/usuarios/personas/personByUser/{uid}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
                if (personaUsu != null)
                {
                    ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                }
            }

            // AQUI VALIDAR SI ES ASEGURADORA PARA MOSTRAR EL HOME NUEVO
            //return await HomeAseguradoras();
            ViewBag.activaBlanco = await GetActivaBlanco();
            var listaempresa = new List<EmpresaConfig>();

            if (host.Contains("vidacamara."))
            {
                var model = await UsuarioConvenioVidaCamara(userName, Convert.ToInt32(uid));


                if (model != null)
                    listaempresa = JsonConvert.DeserializeObject<List<EmpresaConfig>>(model.Value.ToString());
            }


            if (empresa == null || empresa == "null" || empresa == "")//objeto nulo, se redirecciona al login para obtener info empresa
                return Redirect("/Account/loginPaciente");


            EmpresaConfig empresaC = JsonConvert.DeserializeObject<EmpresaConfig>(empresa);
            ViewBag.ChatGpt = empresaC.ChatGpt;
            if (!empresaC.RedirectHome && !view) //segun configuración de empresa se muestra home o se redirecciona a agendar.
            {
                if (idCliente == "158")
                    return Redirect("/Paciente/Index");
                else
                    return host.Contains("consalud.") ? Redirect("/Paciente/ExamenesConsalud") : Redirect("/Paciente/Agendar");
            }

            if (host.Contains("help.") || host.Contains("miahealth."))
            {
                return Redirect("/Paciente/Agendar?tipo=lifestyle");
            }

            if (idCliente == "627")
                return Redirect("/Paciente/Index");
            //Validacion Zurich

            //if (host.Contains("zurich."))
            //{
            //    return Redirect("/Paciente/HistorialCustom");
            //}


            SessionGpt chatGpt;
            try
            {
                using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
                {
                    string url = $"/agendamientos/Concierge/getIdSessionGPT?name={personaUsu.FullName}&age={personaUsu.Edad}";
                    using (var response = await httpClient.GetAsync(url))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        chatGpt = JsonConvert.DeserializeObject<SessionGpt>(apiResponse);
                    }
                }

                ViewBag.chatGptId = chatGpt.Id;
                ViewBag.chatGptResponse = chatGpt.Response;
            }
            catch(Exception e)
            {
                ViewBag.ChatGpt = false;
            }
            if (empresaC.PreHome)
            {
                return await HomeAseguradoras();
            }

            //if (listaempresa.Count() > 0)
            //{
            //    return await HomeVidaCamara();
            //}

            if (empresaC.VisibleNom035)
            {
                using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
                { 
                    bool esCarga = false;
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/verificarUsuarioCarga?idUser={uid}&idCliente={idCliente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        esCarga = JsonConvert.DeserializeObject<bool>(apiResponse);
                    }
                    if (esCarga == true)
                    {
                        empresaC.VisibleNom035 = false;
                    }
                }

            }
                if (empresaC.VisibleSeguros)  //
            {
                using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
                {
                    //VALIDACIÓN DE SEGUROS PARA PACIENTES DE COLOMBIA QUE INGRESAN BAJO MEDICAL
                    if (host.Contains("medical.") && personaUsu.CodigoTelefono == "CO")
                    {
                        string urlValidaSeguro1 = $"/usuarios/enrollPersonaSeguro/getValidaSeguro?idUsuario={uid}&idEmpresa={idClienteSesion}";
                        using (var response = await httpClient.GetAsync(urlValidaSeguro1))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            int Respuesta = JsonConvert.DeserializeObject<int>(apiResponse);

                            if (Respuesta == 0)
                                empresaC.VisibleSeguros = false;
                        }
                    }
                    else if (host.Contains("wedoctorsmx.") || personaUsu.CodigoTelefono == "MX")
                    {
                        empresaC.VisibleSeguros = empresaC.VisibleSeguros;

                        if (host.Contains("tiendared.") || host.Contains("cardif.")) // excepción que oculta el botón de seguro para beneficiarios de TIENDA RED, solo lo muestra para titulares
                        {
                            bool esCarga = false;
                            using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/verificarUsuarioCarga?idUser={uid}&idCliente={idCliente}"))
                            {
                                string apiResponse = await response.Content.ReadAsStringAsync();
                                esCarga = JsonConvert.DeserializeObject<bool>(apiResponse);
                            }
                            if (esCarga == true)
                            {
                                empresaC.VisibleSeguros = false;
                            }
                        }
                    }
                    else
                    {
                        string urlValidaSeguro2 = $"/usuarios/enrollPersonaSeguro/getValidaSeguro?idUsuario={uid}&idEmpresa={idCliente}";
                        using (var response = await httpClient.GetAsync(urlValidaSeguro2))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            int Respuesta = JsonConvert.DeserializeObject<int>(apiResponse);

                            if (Respuesta == 0)
                                empresaC.VisibleSeguros = false;
                        }
                    }
                }

            }
     

            empresa = JsonConvert.SerializeObject(empresaC);
            campos(empresa);
            //SubTextoTratame
            if (ViewBag.SubTextoTratame != null)
            {
                char[] delimiterChars = { ',' };

                string subtexto = ViewBag.SubTextoTratame;
                string SubTextoTratamesep = "";
                string[] words = subtexto.Split(delimiterChars);

                foreach (var word in words)
                {
                    SubTextoTratamesep += word + '\n';
                }
                ViewBag.SubTextoTratame = words;
            }

            List<VwHorasMedicos> horasAgendadasBloquesHoras;

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            List<VwHorasMedicos> proximasHorasPaciente;

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A3&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    proximasHorasPaciente = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }
            if (horasAgendadasBloquesHoras != null && horasAgendadasBloquesHoras.Count > 0)
                horasAgendadasBloquesHoras = horasAgendadasBloquesHoras.OrderBy(x => x.Fecha).ToList();
            AtencionViewModel atencionModel = new AtencionViewModel() { TimelineData = horasAgendadasBloquesHoras, ProximasHorasPaciente = proximasHorasPaciente };

            PersonasViewModel paciente;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            var encryptedIdentifier = Encrypt(paciente.Identificador);
            ViewBag.encryptedIdentifier = encryptedIdentifier;
            ViewBag.AccionSegMedMXAmbulancia +="code="+ encryptedIdentifier;
            ViewBag.AccionSegMedMXLaboratorios += "code=" + encryptedIdentifier;
            ViewBag.AccionSegMedMXFarmacias += "code=" + encryptedIdentifier;
            ViewBag.AccionSegMedMXSeguros += "code=" + encryptedIdentifier;


            if (host.Contains("unabactiva.") || host.Contains("activa.unab."))
            {
                return View("~/Views/Paciente/HomeUnabActiva.cshtml", atencionModel);
            }
            else if (host.Contains("masproteccionsalud."))
            {
                ViewBag.nombreServicio = configEmpresa.Textplan == null ? "" : configEmpresa.Textplan;
                ViewBag.imgServicios = configEmpresa.Imgplan == null ? "" : configEmpresa.Imgplan;
                return View("~/Views/Paciente/HomeCardifCaja.cshtml", atencionModel);
            }
            else
            {
                return View(atencionModel);
            }
        }

        [HttpGet]
        [Route("deleteCookiesFirebase")]
        public void DeleteCookiesFirebase()
        {
            if (Request.Cookies.Any(x => x.Key == "cookieNewUserFirebase"))
            {
                Response.Cookies.Delete("cookieNewUserFirebase");
            }
            if (Request.Cookies.Any(x => x.Key == "cookieNewUser"))
            {
                Response.Cookies.Delete("cookieNewUser");
            }
            if (Request.Cookies.Any(x => x.Key == "cookieUidFirebase"))
            {
                Response.Cookies.Delete("cookieUidFirebase");
            }
            if (Request.Cookies.Any(x => x.Key == "cookieUserMail"))
            {
                Response.Cookies.Delete("cookieUserMail");
            }
            if (Request.Cookies.Any(x => x.Key == "cookieName"))
            {
                Response.Cookies.Delete("cookieName");
            }
        }

        private async Task<JsonResult> UsuarioConvenioVidaCamara(string username, int uid)
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
                var jsonStringEnroll = "";
                string apiResponseEmpresa = "";
                string empresa = "";
                var empresasUsuario = "";
                enroll.IdUsuario = uid;
                if (enroll.Status != "200")
                {
                    enroll.Convenio = "COD_SUS";

                }
                var host = GetHostValue(HttpContext.Request.Host.Value);
                if (host.Contains("inmv."))//login viene de nueva mas vida
                {
                    enroll.Convenio = "INMV";
                }
                else if (host.Contains("doctoronline."))//login viene de colmena
                {
                    enroll.Convenio = "COLMENA";
                }
                else if (host.Contains("uoh."))//login viene de colmena
                {
                    enroll.Convenio = "UOH";
                }
                else if (host.Contains("saludproteccion."))//login viene de colmena
                {
                    enroll.Convenio = "COPEUCH";
                }
                else if (host.Contains("vidacamara."))//login viene de colmena
                {
                    enroll.Convenio = "VIDACAMARA";//VIDACAMARA
                }
                else if (host.Contains("claro."))//login viene de claro
                {
                    enroll.Convenio = "CLARO";//claro
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
        public async Task<ActionResult> HomeVidaCamara()
        {

            //new Claim(ClaimTypes.Name, userName),
            //            new Claim(ClaimTypes.Role, rol),
            //            new Claim(ClaimTypes.NameIdentifier, uid.UserId.ToString()),
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            var userName = HttpContext.User.FindFirstValue(ClaimTypes.Name); // idCliente
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.idCliente = idCliente;

            var model = await UsuarioConvenioVidaCamara(userName, Convert.ToInt32(uid));

            var listaempresa = model.Value.ToString();
            camposusuarioempresas(listaempresa);
            //return View("~/Views/Paciente/HomeVidaCamara.cshtml");

            List<VwHorasMedicos> horasAgendadasBloquesHoras;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            List<VwHorasMedicos> proximasHorasPaciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A3&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    proximasHorasPaciente = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { TimelineData = horasAgendadasBloquesHoras, ProximasHorasPaciente = proximasHorasPaciente };

            return View("~/Views/Paciente/HomeVidaCamara.cshtml", atencionModel);
        }

        public async Task<ActionResult> HomeAseguradoras()
        {

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            var userName = HttpContext.User.FindFirstValue(ClaimTypes.Name); // idCliente
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.idCliente = idCliente;
            int idClienteSesion = 0;
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);

            //ACTUALIZAR EL CLAIM DE EMPRESA CONFIG PARA LA NUEVA EMPRESA SELECCIONADA EN EL PREHOME
            string config = string.Empty;
            config = await GetUsuarioEmpresa();
            string empresa = config;
            var host = GetHostValue(HttpContext.Request.Host.Value);
            EmpresaConfig empresaC = JsonConvert.DeserializeObject<EmpresaConfig>(empresa);
            idClienteSesion = empresaC.IdEmpresa;
            PersonasViewModel personaUsu;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                string url = $"/usuarios/personas/personByUser/{uid}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
                if (personaUsu != null)
                {
                    ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                }
            }
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                //VALIDACIÓN DE SEGUROS PARA PACIENTES DE COLOMBIA QUE INGRESAN BAJO MEDICAL
                if (host.Contains("medical.") && personaUsu.CodigoTelefono == "CO")
                {
                    string urlValidaSeguro1 = $"/usuarios/enrollPersonaSeguro/getValidaSeguro?idUsuario={uid}&idEmpresa={idClienteSesion}";
                    using (var response = await httpClient.GetAsync(urlValidaSeguro1))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        int Respuesta = JsonConvert.DeserializeObject<int>(apiResponse);

                        if (Respuesta == 0)
                            empresaC.VisibleSeguros = false;
                    }
                }
                else if (host.Contains("wedoctorsmx.") && personaUsu.CodigoTelefono == "MX")
                {
                    empresaC.VisibleSeguros = empresaC.VisibleSeguros;
                }
                else
                {
                    string urlValidaSeguro2 = $"/usuarios/enrollPersonaSeguro/getValidaSeguro?idUsuario={uid}&idEmpresa={idCliente}";
                    using (var response = await httpClient.GetAsync(urlValidaSeguro2))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        int Respuesta = JsonConvert.DeserializeObject<int>(apiResponse);

                        if (Respuesta == 0)
                            empresaC.VisibleSeguros = false;
                    }
                }
            }

            empresa = JsonConvert.SerializeObject(empresaC);
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

            await HttpContext.SignInAsync($"PacienteSchemes",
                new ClaimsPrincipal(new ClaimsIdentity(userr.Claims, "Cookies", "user", "role")),
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                });
            //FIN ACTUALIZAR EL CLAIM
            campos(empresa);
            List<VwHorasMedicos> horasAgendadasBloquesHoras;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            List<VwHorasMedicos> proximasHorasPaciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A3&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    proximasHorasPaciente = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { TimelineData = horasAgendadasBloquesHoras, ProximasHorasPaciente = proximasHorasPaciente };
            if (host.Contains("masproteccionsalud."))
            {
                return View("~/Views/Paciente/HomeCardifCaja.cshtml", atencionModel);
            }

            return View("~/Views/Paciente/Home.cshtml", atencionModel);
        }
        public async Task<ActionResult> HomeColmenaAsync()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            List<VwHorasMedicos> horasAgendadasBloquesHoras;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            List<VwHorasMedicos> proximasHorasPaciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A3&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    proximasHorasPaciente = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { TimelineData = horasAgendadasBloquesHoras, ProximasHorasPaciente = proximasHorasPaciente };

            return View(atencionModel);
        }
       

        // GET: Paciente --------------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<ActionResult> IndexAsync(bool externo, bool v)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.externo = externo;
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var host = GetHostValue(HttpContext.Request.Host.Value);
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);

            if (!(ViewBag.HostURL.Contains("clinicamundoscotia.") || ViewBag.HostURL.Contains("prevenciononcologica.") || ViewBag.HostURL.Contains("masproteccionsalud.") || ViewBag.HostURL.Contains("saludproteccion.") || ViewBag.HostURL.Contains("saludtumundoseguro.") || ViewBag.HostURL.Contains("vivetuseguro.")))
            {
               
                return Redirect("/Paciente/HistorialCustom");
            }
            else
            {
                string config = string.Empty;
                config = await GetUsuarioEmpresa();
                string empresa = config;
                EmpresaConfig empresaC = JsonConvert.DeserializeObject<EmpresaConfig>(empresa);
                var recetaElectronica = empresaC.VisibleRecetaElectronica;
                var log = new LogPacienteViaje();
                using (var httpClient = new HttpClient())
                {
                    log.Evento = "Home paciente";
                    log.IdPaciente = Convert.ToInt32(uid);
                    var jsonString = JsonConvert.SerializeObject(log);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                    //using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                    //{
                    //    string apiResponse = await response.Content.ReadAsStringAsync();
                    //}
                }
                List<Atenciones> historialAtenciones;
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A1&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        historialAtenciones = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                    }
                }


                List<Archivo> archivosAtenciones;
                using (var httpClient = new HttpClient())
                {
                    var IdPais = 0;
                    // Obtener el historial de atenciones
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Archivo/getArchivoByPaciente?uid={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        archivosAtenciones = JsonConvert.DeserializeObject<List<Archivo>>(apiResponse);
                    }
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getIdPais?idPaciente={uid}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        var AtencionesPais = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);

                        IdPais = AtencionesPais[0].IdPais;
                    }

                    try
                    {
                        if (IdPais == 39)
                        {
                            #region Medikit
                            // Iterar sobre cada id de atención y hacer la consulta de forma individual
                            foreach (var idAtencion in historialAtenciones.Select(atencion => atencion.Id).Distinct())
                            {
                                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialMedikit?idAtencion={idAtencion}"))
                                {
                                    string medikitApiResponse = await response.Content.ReadAsStringAsync();

                                    // Deserializar un solo objeto Medikit en lugar de una lista
                                    var medikitUrl = JsonConvert.DeserializeObject<Medikit>(medikitApiResponse);

                                    // Verificar el status del objeto y mapearlo a Archivo
                                    if (!medikitUrl.status)
                                    {
                                        Archivo nuevaReceta = new Archivo
                                        {
                                            nombreArchivo = "Medikit.pdf",
                                            url = medikitUrl.id_medikit,
                                            statusMedikit = "Correcto"
                                        };
                                        archivosAtenciones.Add(nuevaReceta);
                                    }
                                    else
                                    {
                                        var medikitUrlFromAPI = await ObtenerUrlMedikitDesdeAPI(idAtencion, httpClient);
                                        if (!string.IsNullOrEmpty(medikitUrlFromAPI))
                                        {
                                            Archivo nuevaReceta = new Archivo
                                            {
                                                nombreArchivo = "Medikit.pdf",
                                                url = medikitUrlFromAPI,
                                            };

                                            var atencion = historialAtenciones.FirstOrDefault(a => a.Id == idAtencion);
                                            if (atencion != null)
                                            {
                                                atencion.statusMedikit = "Correcto";
                                                atencion.urlMedikit = medikitUrlFromAPI;
                                                atencion.nombreMedikit = "Medikit";
                                            }
                                            archivosAtenciones.Add(nuevaReceta);
                                        }
                                    }
                                }
                            }
                            #endregion
                        }
                    }
                    catch (Exception e)
                    {

                    }
                }

                async Task<string> ObtenerUrlMedikitDesdeAPI(int idAtencion, HttpClient client)
                {
                    var urls = new List<string>();

                    var medikitUrl = _config["ServicesMediKit"] + $"/api/Medikit/AddPrescription/{idAtencion}";

                    using (var response = await client.PostAsync(medikitUrl, null))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            string medikitResponseString = await response.Content.ReadAsStringAsync();
                            var medikitResponse = JsonConvert.DeserializeObject<MedikitResponse>(medikitResponseString);
                            if (medikitResponse.operationSuccess)
                            {
                                urls.Add(medikitResponse.objectResponse);
                            }
                        }
                    }

                    string combinedUrls = string.Join(",", urls);

                    return combinedUrls;
                }


                List<VwHorasMedicos> horasAgendadasBloquesHoras;

                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                    }
                }

                List<VwHorasMedicos> proximasHorasPaciente;

                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A3&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        proximasHorasPaciente = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                    }
                }

                AtencionViewModel atencionModel = new AtencionViewModel() { HistorialAtenciones = historialAtenciones, TimelineData = horasAgendadasBloquesHoras, ProximasHorasPaciente = proximasHorasPaciente, Archivo = archivosAtenciones };

                //desde login externo
                if (externo)
                    return View(atencionModel);

                if (horasAgendadasBloquesHoras.Count == 0 && proximasHorasPaciente.Count == 0 && v)
                    return Redirect("/Paciente/Agendar?redirect=true");

               
                return View(atencionModel);

            }
        }

        [Route("InformeAtencion/{idAtencion}")]
        public async Task<IActionResult> InformeAtencionAsync(int idAtencion)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewData["view"] = Roles.Paciente;
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            var log = new LogPacienteViaje();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.activaBlanco = await GetActivaBlanco();
            if (ViewBag.HostURL.Contains("positiva."))
            {
                return Redirect("/");
            }
            string config = string.Empty;
            config = await GetUsuarioEmpresa();
            string empresa = config;
            EmpresaConfig empresaC = JsonConvert.DeserializeObject<EmpresaConfig>(empresa);
            var recetaElectronica = false;
            if(empresaC != null)
            {
                recetaElectronica = empresaC.VisibleRecetaElectronica;
            }
            ViewBag.recetaElectronica = recetaElectronica;
            Atenciones atencion;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }

            List<Medicamentos> medicamentosAtencion;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Medicamentos/findMedicamentosByAtencion?IdAtencion={Convert.ToInt32(idAtencion)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    medicamentosAtencion = JsonConvert.DeserializeObject<List<Medicamentos>>(apiResponse);
                }
            }

            List<AtencionMedicamentos> medicamentosComercial;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Medicamentos/findMedicamentoComercialByAtencion?IdAtencion={Convert.ToInt32(idAtencion)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    medicamentosComercial = JsonConvert.DeserializeObject<List<AtencionMedicamentos>>(apiResponse);
                }
            }

            List<Examenes> examenesAtencion;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Examenes/getExamenesByAtencion?IdAtencion={Convert.ToInt32(idAtencion)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    examenesAtencion = JsonConvert.DeserializeObject<List<Examenes>>(apiResponse);
                }
            }

            List<Atenciones> historialAtencionesFarmacia;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialAtencionesByPacienteFarmacia?uid={Convert.ToInt32(uid)}&idCliente={Convert.ToInt32(idCliente)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtencionesFarmacia = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

            ViewBag.historialAtencionesFarmacia = historialAtencionesFarmacia;

            log.Evento = "Paciente ingresa a informe de atención" + idCliente;
            log.IdPaciente = Convert.ToInt32(uid);
            log.IdAtencion = idAtencion;
            if (atencion == null || atencion.IdPaciente != int.Parse(uid))
            {
                switch (Convert.ToInt32(idCliente))
                {
                    case 1:
                        log.Evento = "Error en atención, nula, distinto paciente, o distinta a estado = I, re redirecciona a consalud (Informe de atencion)";
                        await GrabarLog(log);
                        return Redirect("https://clientes.consalud.cl/clickdoctor/");
                        break;
                    default:
                        log.Evento = "Error en atención, nula, distinto paciente, o distinta a estado = I, re redirecciona a index de plataforma (Informe de Atencion)";
                        await GrabarLog(log);
                        return RedirectToAction("Index");
                        break;
                }

            }

            PersonasViewModel paciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);


            ViewBag.codigoTelefono = atencion.CodigoPais;
            if (atencion.CodigoPais == "CO")
            {
                int totalPagar = 0;
                foreach (Examenes item in examenesAtencion)
                {
                    if (item.EstadoPago != "CAPTURED")
                    {
                        totalPagar += Convert.ToInt32(item.TarifaOfertaMedismart);
                    }
                }
                ViewBag.vads_action_mode = "INTERACTIVE";
                ViewBag.vads_amount = totalPagar.ToString() + "00";
                ViewBag.vads_ctx_mode = _config["BackOfficeMode"].ToString();
                ViewBag.vads_currency = "170";
                ViewBag.vads_page_action = "PAYMENT";
                ViewBag.vads_payment_config = "SINGLE";
                ViewBag.vads_site_id = "26003858";
                ViewBag.vads_trans_date = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
                ViewBag.vads_trans_id = (idAtencion).ToString();
                ViewBag.vads_version = "V2";
                string cadenaConvertir = (ViewBag.vads_action_mode + "+" + ViewBag.vads_amount + "+" + ViewBag.vads_ctx_mode + "+" + ViewBag.vads_currency + "+" + ViewBag.vads_page_action + "+" +
                                    ViewBag.vads_payment_config + "+" + ViewBag.vads_site_id + "+" + ViewBag.vads_trans_date + "+" + ViewBag.vads_trans_id + "+" + ViewBag.vads_version + "+" + _config["BackOffice"].ToString());

                var secretKey = _config["BackOffice"].ToString();
                // Initialize the keyed hash object using the secret key as the key
                HMACSHA256 hashObject = new HMACSHA256(ASCIIEncoding.UTF8.GetBytes(secretKey));
                // Computes the signature by hashing the salt with the secret key as the key
                var signature = hashObject.ComputeHash(ASCIIEncoding.UTF8.GetBytes(cadenaConvertir));
                // Base 64 Encode
                var encodedSignature = Convert.ToBase64String(signature);
                ViewBag.signature = encodedSignature;
                ViewBag.cadecaCompleta = cadenaConvertir;
                ViewBag.KeySha = secretKey;

                ViewBag.pagoPayzenHabilitado = Convert.ToBoolean(_config["PagoPayzenHabilidato"]);

                var userr = User as ClaimsPrincipal;
                var identity = userr.Identity as ClaimsIdentity;

                foreach (var c in userr.Claims)
                {
                    if (c.Type == "PayzenPagoAtencion")
                    {
                        identity.RemoveClaim(c);
                        break;
                    }
                }

                identity.AddClaim(new Claim("PayzenPagoAtencion", (idAtencion).ToString()));
                await HttpContext.SignInAsync($"PacienteSchemes",
                new ClaimsPrincipal(new ClaimsIdentity(userr.Claims, "Cookies", "user", "role")),
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                });
            }

            OrderHeader objOrder = new OrderHeader();

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/Order/GetOrderbyIdAttention/{atencion.Id}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        objOrder = JsonConvert.DeserializeObject<OrderHeader>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            List<Atenciones> historialAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A1&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtenciones = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

            /* Trae Archivos anexos de atenciones */
            List<Archivo> archivosAtenciones;
            using (var httpClient = new HttpClient())
            {
                var IdPais = 0;
                // Obtener el historial de atenciones
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Archivo/getArchivoByPaciente?uid={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    archivosAtenciones = JsonConvert.DeserializeObject<List<Archivo>>(apiResponse);
                }
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getIdPais?idPaciente={uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    var AtencionesPais = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);

                    IdPais = AtencionesPais[0].IdPais;
                }

                if (IdPais == 39)
                {
                    #region Medikit
                    // Iterar sobre cada id de atención y hacer la consulta de forma individual
                   
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialMedikit?idAtencion={idAtencion}"))
                        {
                            string medikitApiResponse = await response.Content.ReadAsStringAsync();

                            // Deserializar un solo objeto Medikit en lugar de una lista
                            var medikitUrl = JsonConvert.DeserializeObject<Medikit>(medikitApiResponse);

                            // Verificar el status del objeto y mapearlo a Archivo
                            if (medikitUrl != null && medikitUrl.status)
                            {
                                Archivo nuevaReceta = new Archivo
                                {
                                    nombreArchivo = "Medikit.pdf",
                                    url = medikitUrl.id_medikit,
                                    statusMedikit = "Correcto"
                                };
                                archivosAtenciones.Add(nuevaReceta);
                            }
                            else
                            {
                                var medikitUrlFromAPI = await ObtenerUrlMedikitDesdeAPI(idAtencion, httpClient);
                                if (!string.IsNullOrEmpty(medikitUrlFromAPI))
                                {
                                    Archivo nuevaReceta = new Archivo
                                    {
                                        nombreArchivo = "Medikit.pdf",
                                        url = medikitUrlFromAPI,
                                        statusMedikit = "Correcto"
                                    };

                                    
                                        atencion.statusMedikit = "Correcto";
                                        atencion.urlMedikit = medikitUrlFromAPI;
                                        atencion.nombreMedikit = "Medikit";
                                    
                                    archivosAtenciones.Add(nuevaReceta);
                                }
                            }
                        }
                    
                    #endregion
                }


            }

            async Task<string> ObtenerUrlMedikitDesdeAPI(int idAtencion2, HttpClient client)
            {
                var urls = new List<string>();

                var medikitUrl = _config["ServicesMediKit"] + $"/api/Medikit/AddPrescription/{idAtencion2}";

                using (var response = await client.PostAsync(medikitUrl, null))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string medikitResponseString = await response.Content.ReadAsStringAsync();
                        var medikitResponse = JsonConvert.DeserializeObject<MedikitResponse>(medikitResponseString);
                        if (medikitResponse.operationSuccess)
                        {
                            urls.Add(medikitResponse.objectResponse);
                        }
                    }
                }

                string combinedUrls = string.Join(",", urls);

                return combinedUrls;
            }



            AtencionViewModel atencionModel = new AtencionViewModel() { HistorialAtenciones = historialAtenciones,  Atencion = atencion, fichaPaciente = paciente, medicamentosAtencion = medicamentosAtencion, Examenes = examenesAtencion, AtencionMedicamentos = medicamentosComercial, HistorialAtencionesFarmacia = historialAtencionesFarmacia, OrderAttention = objOrder, Archivo = archivosAtenciones };
            await GrabarLog(log);
            return View(atencionModel);
        }


        private async Task<string> ObtenerUrlMedikitDesdeAPI(int idAtencion2, HttpClient client)
        {
            var urls = new List<string>();
            var medikitUrl = _config["ServicesMediKit"] + $"/api/Medikit/AddPrescription/{idAtencion2}";

            using (var response = await client.PostAsync(medikitUrl, null))
            {
                if (response.IsSuccessStatusCode)
                {
                    string medikitResponseString = await response.Content.ReadAsStringAsync();
                    var medikitResponse = JsonConvert.DeserializeObject<MedikitResponse>(medikitResponseString);
                    if (medikitResponse.operationSuccess)
                    {
                        urls.Add(medikitResponse.objectResponse);
                    }
                }
            }

            return string.Join(",", urls);
        }



        [Route("InformeAtencionEspera/{idAtencion}")]
        public async Task<IActionResult> InformeAtencionEsperaAsync(int idAtencion)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var canal = HttpContext.User.FindFirstValue(ClaimTypes.Spn);
            ViewBag.canal = canal;
            ViewData["view"] = Roles.Paciente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente Informe atención directa";
                log.IdPaciente = Convert.ToInt32(uid);
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
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }
            if (atencion == null || atencion.IdPaciente != int.Parse(uid)) return Redirect("clientes.consalud.cl");
            PersonasViewModel paciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = paciente };
            return View(atencionModel);
        }


        [Route("Atencion/{idAtencion}")]
        public async Task<IActionResult> AtencionAsync(int idAtencion, int visible = 1)
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return RedirectToAction("Atencion_SalaEspera", new { idAtencion = idAtencion });
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var canal = "";
            ViewBag.canal = canal;
            var esperaVisible = visible;
            ViewBag.esperaVisible = esperaVisible;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a box de atención (Agenda)";
                log.IdPaciente = Convert.ToInt32(uid);
                log.IdAtencion = idAtencion;
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
            if (string.IsNullOrEmpty(atencion.IdVideoCall))
            {
                using (var httpClient = new HttpClient())
                {
                    var jsonString = JsonConvert.SerializeObject(idAtencion);
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
            List<ReporteEnfermeria> reporteEnfermeria;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/ReporteEnfermeria/historialReporteEnfermeria?idPaciente={atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reporteEnfermeria = JsonConvert.DeserializeObject<List<ReporteEnfermeria>>(apiResponse);
                }
            }
            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, HistorialAtenciones = historialAtenciones, reporteEnfermeriaList = reporteEnfermeria };


            return View(atencionModel);

        }

        [Route("AtencionAgenda/{idAtencion}")]
        public async Task<IActionResult> AtencionAgendaAsync(int idAtencion)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var canal = HttpContext.User.FindFirstValue(ClaimTypes.Spn);
            ViewBag.canal = canal;
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a box de atención desde consalud";
                log.IdPaciente = Convert.ToInt32(uid);
                log.IdAtencion = idAtencion;
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
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }

            if (atencion == null || atencion.HoraMedico.IdPaciente != int.Parse(uid) || atencion.Estado != "I") return Redirect("https://clientes.consalud.cl/clickdoctor/");

            if (atencion.NSP == true && atencion.HoraMedico.IdPaciente == int.Parse(uid))
            {
                return Redirect("https://clientes.consalud.cl/clickdoctor/");
            }
            if (string.IsNullOrEmpty(atencion.IdVideoCall))
            {
                using (var httpClient = new HttpClient())
                {
                    var jsonString = JsonConvert.SerializeObject(idAtencion);
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
            List<ReporteEnfermeria> reporteEnfermeria;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/ReporteEnfermeria/historialReporteEnfermeria?idPaciente={atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reporteEnfermeria = JsonConvert.DeserializeObject<List<ReporteEnfermeria>>(apiResponse);
                }
            }
            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, HistorialAtenciones = historialAtenciones, reporteEnfermeriaList = reporteEnfermeria };

            return View(atencionModel);
        }

        //sala de espera desde plataformas externas
        [Route("Ext_SalaEspera_A/{idAtencion}")]
        public async Task<IActionResult> SalaEspera_AgendaConsalud(int idAtencion)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var canal = HttpContext.User.FindFirstValue(ClaimTypes.Spn);
            ViewBag.canal = canal;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
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

            if (atencion == null || atencion.HoraMedico.IdPaciente != int.Parse(uid) || atencion.Estado != "I") return Redirect("https://clientes.consalud.cl/clickdoctor/");

            if (atencion.NSP == true && atencion.HoraMedico.IdPaciente == int.Parse(uid))
            {
                return Redirect("https://clientes.consalud.cl/clickdoctor/");
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion };

            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a box de atención desde consalud";
                log.IdPaciente = Convert.ToInt32(uid);
                log.IdAtencion = idAtencion;
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            return View(atencionModel);
        }

        // box de atención externo (consalud)
        [Route("Ext_Box_A/{idAtencion}")]
        public async Task<IActionResult> Box_AgendaConsalud(int idAtencion)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var canal = HttpContext.User.FindFirstValue(ClaimTypes.Spn);
            ViewBag.canal = canal;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a box de atención desde consalud";
                log.IdPaciente = Convert.ToInt32(uid);
                log.IdAtencion = idAtencion;
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
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }

            if (atencion == null || atencion.HoraMedico.IdPaciente != int.Parse(uid) || atencion.Estado != "I") return Redirect("https://clientes.consalud.cl/clickdoctor/");

            if (atencion.NSP == true && atencion.HoraMedico.IdPaciente == int.Parse(uid))
            {
                return Redirect("https://clientes.consalud.cl/clickdoctor/");
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
            List<ReporteEnfermeria> reporteEnfermeria;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/ReporteEnfermeria/historialReporteEnfermeria?idPaciente={atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reporteEnfermeria = JsonConvert.DeserializeObject<List<ReporteEnfermeria>>(apiResponse);
                }
            }
            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, HistorialAtenciones = historialAtenciones, reporteEnfermeriaList = reporteEnfermeria };

            return View(atencionModel);
        }


        public async Task<IActionResult> AgendarAsync(string tipo, string tipoEspecialidad, string IdclienteVC = "")
        {

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.activaPresencial = await GetAgendaPresencial(Convert.ToInt32(idCliente));
            var codigoTelefono = ((ClaimsIdentity)User.Identity).GetSpecificClaim("CodigoTelefono");
            ViewBag.codigoTelefono = codigoTelefono ?? "CL";
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
                await HttpContext.SignInAsync($"PacienteSchemes",
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
            var empresa = HttpContext.User.FindFirstValue("empresa");
            if (empresa == null || empresa == "null" || empresa == "")
                return Redirect("/Account/loginPaciente");
            campos(empresa);

            var fecha = DateTime.Now.Date;

            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a Agendar";
                log.IdPaciente = Convert.ToInt32(uid);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            //List<VwHorasMedicos> vwHorasMedicos;
            //using (var httpClient = new HttpClient())
            //{
            //    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getMedicosHoraProxima?paraEspecialidad=&idEspecialidad=0&idBloque=0&userId={uid}&idCliente={idCliente}"))
            //    {
            //        string apiResponse = await response.Content.ReadAsStringAsync();
            //        vwHorasMedicos = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
            //    }
            //}

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
        public async Task<IActionResult> Configuracion()
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var codigoTelefono = ((ClaimsIdentity)User.Identity).GetSpecificClaim("CodigoTelefono");
            ViewBag.codigoTelefono = codigoTelefono ?? "CL";
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a perfil";
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
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            List<CargasPacienteModel> cargasPaciente;

            using (var httpClient = new HttpClient())
            {

                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/GetValidaEmpresaCarga/{uid}"))
                {

                    string apiResponse = await response.Content.ReadAsStringAsync();
                    cargasPaciente = JsonConvert.DeserializeObject<List<CargasPacienteModel>>(apiResponse);


                }
            }
            List<PersonasViewModel> cargasEmpresaPaciente;

            using (var httpClient = new HttpClient())
            {

                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/GetEmpresasPersonaSsu/{paciente.Id}/{idCliente}"))
                {

                    string apiResponse = await response.Content.ReadAsStringAsync();
                    cargasEmpresaPaciente = JsonConvert.DeserializeObject<List<PersonasViewModel>>(apiResponse);


                }
            }

            bool esCarga = false;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/verificarUsuarioCarga?idUser={uid}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    esCarga = JsonConvert.DeserializeObject<bool>(apiResponse);
                }
            }

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getParametros?grupo=ESTADO-CIVIL"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente.EstadosCiviles = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getParametros?grupo=ESCOLARIDAD"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente.Escolaridades = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }

            if (cargasPaciente != null)
            {
                ViewBag.cargasPaciente = cargasPaciente;
            }

            using (var httpClient = new HttpClient())
                if (ViewBag.HostURL.Contains("aecsa") || ViewBag.HostURL.Contains("rappi") || ViewBag.HostURL.Contains("gallagher") || ViewBag.HostURL.Contains("ajg.medismart") || ViewBag.HostURL.Contains("bonnahealth") || ViewBag.HostURL.ToString().Contains("bu.") || ViewBag.codigoTelefono == "CO")
                {
                    codigoTelefono = "CO";


                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPrevisiones/{codigoTelefono}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            paciente.Previsiones = JsonConvert.DeserializeObject<List<Prevision>>(apiResponse);
                        }
                    }
                }
                else
                {
                    codigoTelefono = paciente.CodigoTelefono ?? codigoTelefono ?? "CL";
                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPrevisiones/{codigoTelefono}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            paciente.Previsiones = JsonConvert.DeserializeObject<List<Prevision>>(apiResponse);
                        }
                    }
                }

            List<VwHorasMedicos> horasAgendadasBloquesHoras;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            ViewBag.horasAgendadasBloquesHoras = horasAgendadasBloquesHoras;

            List<VwHorasMedicos> proximasHorasPaciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A3&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    proximasHorasPaciente = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }
            ViewBag.proximasHorasPaciente = proximasHorasPaciente;

            return View(paciente);

        }
        // Lista cargas paciente
        public async Task<IActionResult> ListaCargas()
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a ListaCargas";
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
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            bool esCarga;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/verificarUsuarioCarga?idUser={uid}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    esCarga = JsonConvert.DeserializeObject<bool>(apiResponse);
                }
            }

            if (esCarga)
                return View("ErrorCarga");

            return View(paciente);

        }
        // Lista cargas paciente
        public async Task<IActionResult> ListaContactos()
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a ListaCargas";
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
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            bool esCarga;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/verificarUsuarioCarga?idUser={uid}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    esCarga = JsonConvert.DeserializeObject<bool>(apiResponse);
                }
            }

            if (esCarga)
                return View("ErrorCarga");

            return View(paciente);

        }

        public async Task<IActionResult> NuevoBeneficiario()
        {
            Random rnd = new Random();
            int tempID = rnd.Next(-2000000000, -1000000000);

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var codigoTelefono = ((ClaimsIdentity)User.Identity).GetSpecificClaim("CodigoTelefono");
            if (codigoTelefono.Length < 1)
                codigoTelefono = "CL";
            ViewBag.uid = uid;
            ViewBag.editState = 0;
            ViewBag.idEdit = tempID;
            ViewBag.codigoTelefono = codigoTelefono;
            ViewBag.Titulo = "Adicional";
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            PersonasViewModel persona = new PersonasViewModel();
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);

            PersonasViewModel personainfo = new PersonasViewModel();

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personainfo = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }
            if (ViewBag.HostURL.Contains("aecsa") || ViewBag.HostURL.Contains("rappi") || ViewBag.HostURL.Contains("gallagher") || ViewBag.HostURL.Contains("ajg.medismart") || ViewBag.HostURL.Contains("bonnahealth") || ViewBag.HostURL.Contains("bu.") || ViewBag.codigoTelefono == "CO")
            {
                codigoTelefono = "CO";
                persona.Nacionalidad = "Colombiana";
                persona.ZonaHoraria = "-5";
            }
            else
            {
                persona.ZonaHoraria = personainfo.ZonaHoraria;
                persona.CodigoTelefono = personainfo.CodigoTelefono;
                persona.Nacionalidad = personainfo.Nacionalidad;
            }
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPrevisiones/{codigoTelefono}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona.Previsiones = JsonConvert.DeserializeObject<List<Prevision>>(apiResponse);
                }
            }

            //PersonasDatos personaDatos = new PersonasDatos();

            persona.TempID = tempID;
            persona.CodigoTelefono = codigoTelefono;
            return View("EditBeneficiario", persona);

        }

        public async Task<IActionResult> NuevoContacto()
        {
            Random rnd = new Random();
            int tempID = rnd.Next(-2000000000, -1000000000);

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var codigoTelefono = ((ClaimsIdentity)User.Identity).GetSpecificClaim("CodigoTelefono");
            if (codigoTelefono.Length < 1)
                codigoTelefono = "CL";
            ViewBag.uid = uid;
            ViewBag.editState = 0;
            ViewBag.idEdit = tempID;
            ViewBag.isContacto = true;
            ViewBag.codigoTelefono = codigoTelefono;
            ViewBag.Titulo = "Contacto de emergencia";

            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            PersonasViewModel persona = new PersonasViewModel();
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);

            PersonasViewModel personainfo = new PersonasViewModel();

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personainfo = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }
            if (ViewBag.HostURL.Contains("aecsa") || ViewBag.HostURL.Contains("rappi") || ViewBag.HostURL.Contains("gallagher") || ViewBag.HostURL.Contains("ajg.medismart") || ViewBag.HostURL.Contains("bonnahealth") || ViewBag.HostURL.Contains("bancounion") || ViewBag.codigoTelefono == "CO")
            {
                codigoTelefono = "CO";
                persona.Nacionalidad = "Colombiana";
                persona.ZonaHoraria = "-5";
            }
            else
            {
                persona.ZonaHoraria = personainfo.ZonaHoraria;
                persona.CodigoTelefono = personainfo.CodigoTelefono;
                persona.Nacionalidad = personainfo.Nacionalidad;
            }
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPrevisiones/{codigoTelefono}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona.Previsiones = JsonConvert.DeserializeObject<List<Prevision>>(apiResponse);
                }
            }

            //PersonasDatos personaDatos = new PersonasDatos();

            persona.TempID = tempID;
            persona.CodigoTelefono = codigoTelefono;
            return View("EditBeneficiario", persona);

        }
        public async Task<IActionResult> EditBeneficiario(int idPaciente)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.idEdit = idPaciente;
            ViewBag.editState = 1;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.Titulo = "Adicionales";
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            PersonasViewModel paciente = new PersonasViewModel();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            if (ViewBag.HostURL.Contains("prevenciononcologica"))
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPersonaById/{idPaciente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                    }
                }
            }
            else
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{idPaciente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                    }
                }
            }

            if (ViewBag.HostURL.Contains("aecsa"))
            {
                var codigoTelefonoCO = "CO";
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPrevisiones/{codigoTelefonoCO}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        paciente.Previsiones = JsonConvert.DeserializeObject<List<Prevision>>(apiResponse);
                    }
                }
                paciente.CodigoTelefono = codigoTelefonoCO;
                paciente.Nacionalidad = "Colombiana";
                return View(paciente);

            }
            else
            {
                var codCookie = ((ClaimsIdentity)User.Identity).GetSpecificClaim("CodigoTelefono");
                var codigoTelefono = paciente.CodigoTelefono ?? (String.IsNullOrEmpty(codCookie.ToString()) == false ? codCookie.ToString() : "CL");

                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPrevisiones/{codigoTelefono}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        paciente.Previsiones = JsonConvert.DeserializeObject<List<Prevision>>(apiResponse);
                    }
                }
                paciente.CodigoTelefono = codigoTelefono;
                return View(paciente);
            }
        }

        public async Task<IActionResult> EditContacto(int idPaciente)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.idEdit = idPaciente;
            ViewBag.editState = 1;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            PersonasViewModel paciente = new PersonasViewModel();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.Titulo = "Contacto de Emergencia";
            ViewBag.isContacto = true;
            if (ViewBag.HostURL.Contains("prevenciononcologica"))
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPersonaById/{idPaciente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                    }
                }
            }
            else
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{idPaciente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                    }
                }
            }

            if (ViewBag.HostURL.Contains("aecsa"))
            {
                var codigoTelefonoCO = "CO";
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPrevisiones/{codigoTelefonoCO}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        paciente.Previsiones = JsonConvert.DeserializeObject<List<Prevision>>(apiResponse);
                    }
                }
                paciente.CodigoTelefono = codigoTelefonoCO;
                paciente.Nacionalidad = "Colombiana";
                return View(paciente);

            }
            else
            {
                var codigoTelefono = paciente.CodigoTelefono ?? ((ClaimsIdentity)User.Identity).GetSpecificClaim("CodigoTelefono") ?? "CL";

                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPrevisiones/{codigoTelefono}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        paciente.Previsiones = JsonConvert.DeserializeObject<List<Prevision>>(apiResponse);
                    }
                }
                paciente.CodigoTelefono = codigoTelefono;
                return View("EditBeneficiario", paciente);
            }
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


        public async Task<ActionResult> agenda_1Async(int idMedico, string fechaPrimeraHora, string m, string r, string c, int? especialidad = 0, string tipoatencion = "")
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

        public async Task<IActionResult> agenda_2(int idMedico, string fechaPrimeraHora, string m, string r, string c, int especialidad, string tipoatencion = "", string tipoEspecialidad = "", bool isProgramaSalud = false, int idProgramaSalud = 0)
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
            ViewBag.isProgramaSalud = isProgramaSalud;
            ViewBag.idProgramaSalud = idProgramaSalud;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var log = new LogPacienteViaje();
            string pdfTerminos = "";
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getConfigPdfTerminos"))
                {
                    pdfTerminos = await response.Content.ReadAsStringAsync();
                }
            }
            ViewBag.pdfTerminos = pdfTerminos;
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
                if (personaUsu != null)
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

        public async Task<IActionResult> agenda_3(int idMedicoHora, int idMedico, int idBloqueHora, DateTime fechaSeleccion, string hora, bool horario, int idAtencion, string m, string r, string c, string tipoatencion = "", int especialidad = 0, string tipoEspecialidad = "", bool anura = false)
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
            ViewBag.checkAnura = anura;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);

            var empresa = HttpContext.User.FindFirstValue("empresa");
            campos(empresa);

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

            List<Parametros> opcionesOrientacion = new List<Parametros>();
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getOpcionesOrientacion"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    opcionesOrientacion = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }

            List<SmartcheckEspecialidades> smartcheckEspecialidades = new List<SmartcheckEspecialidades>();
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/especialidades/GetSmartcheckEspecialidades"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    smartcheckEspecialidades = JsonConvert.DeserializeObject<List<SmartcheckEspecialidades>>(apiResponse);
                }
            }

            if (tipoEspecialidad != "examenes")
            {
                opcionesOrientacion.RemoveAt(3);
            }
            ViewBag.opcionesOrientacion = opcionesOrientacion;
            ViewBag.smartcheckEspecialidades = smartcheckEspecialidades;

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
                            ViewBag.textoMarca = convenio.TextoMarca;
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


            FichaMedicoViewModel fichaMedico = new FichaMedicoViewModel() { personas = persona, personasDatos = personaDatos };

            if (idCliente == "108")
            {
                ViewData["FondoBlanco"] = "true";
            }
            return View(fichaMedico);
        }


        public async Task<IActionResult> ConfirmarAtencion(int idMedicoHora, int idMedico, int idBloqueHora, DateTime fechaSeleccion, string hora, bool horario, int idAtencion, string m, string r, string tipoatencion = "", int especialidad = 0, int anura = 0)
        {
            //ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            var uid = 0;
            ViewBag.tipoatencion = tipoatencion;
            ViewBag.idEspecialidad = especialidad;
            ViewBag.checkAnura = anura;
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

                        // Si la atención viene de smartcheck, actualizar estado
                        if (anura == 1 && atencion.Estado == "P")
                        {
                            string url = $"{_config["ServicesUrl"]}/agendamientos/Atenciones/{idAtencion}/estado/I";
                            await httpClient.PutAsync(url, new StringContent(string.Empty));
                            atencion.Estado = "I";

                        }
                        PersonasViewModel persona;
                        using (var httpClientPersona = new HttpClient())
                        {
                            httpClientPersona.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
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
        public async Task<IActionResult> confirmacionPago(string hash = null)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            //ViewBag.uid = uid;
            string idCliente = "";
            var respuestanew = new RespuestaPagoMedipass();
            var respuesta = new RespuestaPago();
            var atencion = new Atenciones();
            if (!String.IsNullOrWhiteSpace(hash))
            {
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
                respuesta.transaction = new Models.Transaction();



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
                        ViewBag.uid = atencion.IdUsuarioModifica;
                        // SETEO UID PACIENTE, EL QUE ESTA EN EL CLAIMS QUEDA NULO, PORQUE SALIO DEL SITIO A LA PASARELA DE PAGO
                        uid = atencion.IdUsuarioModifica.ToString();

                        // Autenticamos al usuario

                        if (atencion.IdUsuarioModifica != null)
                        {
                            var user = await getUser(atencion.IdUsuarioModifica.Value);

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
                                new Claim(ClaimTypes.NameIdentifier, atencion.IdUsuarioModifica.Value.ToString()),
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
            idCliente = atencion.IdCliente.ToString(); // idCliente
            ViewBag.idCliente = atencion.IdCliente;
            //switch (atencion.IdCliente)
            //{
            //    case 148:
            if (atencion.PagoAprobado)
            {
                if (atencion.AtencionDirecta)
                {
                    ViewBag.tipoatencion = "I";
                    return Redirect($"/Ingresar_Sala_FU/{atencion.Id}");
                }
                else
                {
                    return View(atencion);
                }

            }
            //else
            //    return View(atencion);
            else
            {
                var idAtencionNP = HttpContext.User.FindFirstValue("idatencion");
                if (Convert.ToInt32(idAtencionNP) != 0)
                    atencion.Id = Convert.ToInt32(idAtencionNP);
                ViewBag.idAtencionNP = Convert.ToInt32(idAtencionNP);
                return View("confirmacionPagoNP", atencion);
            }

            //default:
            //    return View(atencion);
            //}
        }


        [HttpPost]
        [AllowAnonymous]
        public async Task<string> confirmacionPagoPayzen()
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
                respuesta.transaction = new Models.Transaction();
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
            return "Proceso almacenado correctamete";
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
            var hostTest = _config["HostTest"];
            if (!string.IsNullOrEmpty(hostTest))
                return hostTest;
            else
                return value;
        }
        public async Task<int> GetAgendaPresencial(int idCliente)
        {
            int activaPresencial = 0;
            try
            {
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getActivaPresencial/{idCliente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        activaPresencial = JsonConvert.DeserializeObject<int>(apiResponse);
                    }
                }
            }
            catch
            {
                return 0;
            }
            return activaPresencial;
        }
        public async Task<int> GetActivaBlanco()
        {
            int activaBlanco = 0;
            try
            {
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
            catch
            {
                return 0;
            }
        }

        public async Task<IActionResult> agenda_4(int idMedicoHora, int idMedico, int idBloqueHora, DateTime fechaSeleccion, string hora, bool horario, int idAtencion, string m, string r, string c, string tipoatencion = "", int especialidad = 0, int anura = 0)
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
            ViewBag.horaText = hora;
            ViewBag.horario = horario;
            ViewBag.idAtencion = idAtencion;
            ViewBag.m = m;
            ViewBag.r = r;
            ViewBag.c = c;
            ViewBag.tipoatencion = tipoatencion;
            ViewBag.especialidad = especialidad;
            ViewBag.checkAnura = anura;
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
                    //Para Emision preBono
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


                try
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
                catch (Exception e)
                {

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

        public async Task<IActionResult> SalaEspera(int idAtencion)
        {
            var idUser = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idSesion = HttpContext.User.FindFirstValue(ClaimTypes.Sid);
            if (idSesion == null)
                idSesion = "COLMENA";
            var canal = HttpContext.User.FindFirstValue(ClaimTypes.Spn);
            if (canal == null || canal.Equals(""))
                canal = "plataforma";
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = idUser;
            ViewBag.idSesion = idSesion;
            ViewBag.canal = canal;
            ViewBag.idCliente = idCliente;
            var preAtencion = new PreAtencion();
            preAtencion.IdPaciente = Convert.ToInt32(idUser);
            preAtencion.IdSesionPlataforma = idSesion;
            var empresa = HttpContext.User.FindFirstValue("empresa");
            campos(empresa);
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente Ingreso a sala de espera Colmena";
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
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getEstadoFilaUnica?accion=A3&idPaciente={idUser}&idAtencion={idAtencion}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }
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

            using (var httpClient = new HttpClient())
            {
                var jsonString = JsonConvert.SerializeObject(idAtencion);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/ingresoAtencionPaciente?idAtencion={idAtencion}", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }


            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = paciente };
            return View(atencionModel);
        }

        [Route("Atencion_SalaEspera/{idAtencion}")]
        public async Task<IActionResult> Atencion_SalaEspera(int idAtencion)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var canal = HttpContext.User.FindFirstValue(ClaimTypes.Spn);
            if (canal == null || canal.Equals(""))
                canal = "plataforma";
            ViewBag.canal = canal;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var log = new LogPacienteViaje();

            Atenciones atencion;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }
            var empresa = HttpContext.User.FindFirstValue("empresa");
            EmpresaConfig configEmpresa = new EmpresaConfig();
            if (empresa != null)
                configEmpresa = JsonConvert.DeserializeObject<EmpresaConfig>(empresa.ToString());
            ViewBag.LogoEmpresa = configEmpresa.LogoEmpresa;
            log.Evento = "Paciente ingresa a sala de espera " + idCliente + " " + canal;
            log.IdPaciente = Convert.ToInt32(uid);
            log.IdAtencion = idAtencion;
            var host = GetHostValue(HttpContext.Request.Host.Value);
            log.Evento = "Error en atención, nula";
            await GrabarLog(log);


            if (atencion == null || atencion.IdPaciente != int.Parse(uid) || atencion.Estado != "I")
            {
                if (Convert.ToInt32(idCliente) == Convert.ToInt32(_config["CLIENTE-ACHS"]))
                {
                    log.Evento = "Error en atención, distinto paciente, o distinta a estado = I, re redirecciona a error";
                    await GrabarLog(log);
                    return View("IndexAtencionFinalizada");
                }

                if (host.Contains("happ."))
                {
                    return Redirect("https://app.happlabs.cl/");
                }
                switch (Convert.ToInt32(idCliente))
                {
                    case 1:
                        log.Evento = "Error en atención, nula, distinto paciente, o distinta a estado = I, re redirecciona a consalud";
                        await GrabarLog(log);
                        return Redirect("https://clientes.consalud.cl/clickdoctor/");
                    default:
                        log.Evento = "Error en atención, nula, distinto paciente, o distinta a estado = I, re redirecciona a index de plataforma";
                        await GrabarLog(log);
                        return View("IndexAtencionFinalizada");
                }

            }

            ViewBag.peritaje = atencion.Peritaje;

            if (atencion.Id == -1)
            {
                switch (Convert.ToInt32(idCliente))
                {
                    case 1:
                        log.Evento = "Error en atención -1";
                        await GrabarLog(log);
                        return Redirect("https://clientes.consalud.cl/clickdoctor/");
                        break;
                    default:
                        break;
                }
            }
            using (var httpClient = new HttpClient())
            {
                var jsonString = JsonConvert.SerializeObject(idAtencion);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/ingresoAtencionPaciente?idAtencion={idAtencion}", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion };



            /*Consumo smartcheck*/

            var client = new RestClient($"https://smartcheck-backend.azurewebsites.net/api/Measurement/measurementByAttentionID?attention_id={idAtencion}");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            IRestResponse r = client.Execute(request);
            var resultado = r.Content;

            if (resultado.Length > 0)
            {

                JArray data = JArray.Parse(resultado);

                for (int i = 0; i < data.Count; i++)
                {
                    var puntajeSalud1 = Convert.ToDouble(data[i]["detail"]["health_Score"]);
                    var puntajeSalud = (Math.Truncate(puntajeSalud1 * 100) / 100);
                    ViewBag.puntajeSaludSmartcheck = puntajeSalud;
                    ViewBag.idSmartcheck = 1;

                    if (puntajeSalud >= 0 && puntajeSalud <= 16.65)
                    {
                        ViewBag.colorSmartcheck = "rgba(225,82,65,1)";
                    }
                    else if (puntajeSalud >= 16.67 && puntajeSalud <= 33.3)
                    {
                        ViewBag.colorSmartcheck = "rgba(226,148,143,1)";
                    }
                    else if (puntajeSalud >= 33.4 && puntajeSalud <= 66.6)
                    {
                        ViewBag.colorSmartcheck = "rgba(249,236,161,1)";
                    }
                    else if (puntajeSalud >= 66.7 && puntajeSalud <= 83.35)
                    {
                        ViewBag.colorSmartcheck = "rgba(55,180,93,1)";
                    }
                    else if (puntajeSalud >= 83.36 && puntajeSalud <= 100)
                    {
                        ViewBag.colorSmartcheck = "rgba(36,115,60,1)";
                    }
                }

            }
            else
            {
                ViewBag.puntajeSaludSmartcheck = 0;
                ViewBag.colorSmartcheck = "";
                ViewBag.idSmartcheck = 0;
            }


            await GrabarLog(log);
            return View(atencionModel);
        }

        [Route("Atencion_Box/{idAtencion}")]
        public async Task<IActionResult> Atencion_Box(int idAtencion, int visible = 1)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var canal = HttpContext.User.FindFirstValue(ClaimTypes.Spn);
            if (canal == null || canal.Equals(""))
                canal = "plataforma";
            ViewBag.canal = canal;
            ViewBag.saludEspecialidad = _config["SaludEspecialidad"];
            var esperaVisible = visible;
            ViewBag.esperaVisible = esperaVisible;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            var log = new LogPacienteViaje();
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            Atenciones atencion;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }
            log.Evento = "Paciente ingresa a box de atención jitsi " + idCliente + " " + canal;
            log.IdPaciente = Convert.ToInt32(uid);
            log.IdAtencion = idAtencion;
            log.IdCliente = Convert.ToInt32(idCliente);
            var host = GetHostValue(HttpContext.Request.Host.Value);

            if (atencion == null || atencion.IdPaciente != int.Parse(uid) || atencion.Estado != "I")
            {
                if (host.Contains("happ."))
                {
                    return Redirect("https://app.happlabs.cl/");
                }
                switch (Convert.ToInt32(idCliente))
                {
                    case 1:
                        log.Evento = "Error en atención, nula, distinto paciente, o distinta a estado = I, re redirecciona a consalud";
                        await GrabarLog(log);
                        return Redirect("https://clientes.consalud.cl/clickdoctor/");
                        break;
                    default:
                        log.Evento = "Error en atención, nula, distinto paciente, o distinta a estado = I, re redirecciona a index de plataforma";
                        await GrabarLog(log);
                        return RedirectToAction("Index");
                        break;
                }

            }
            if (atencion.Id == -1)
            {
                switch (Convert.ToInt32(idCliente))
                {
                    case 1:
                        log.Evento = "Error en atención -1";
                        await GrabarLog(log);
                        return Redirect("https://clientes.consalud.cl/clickdoctor/");
                        break;
                    default:
                        break;
                }
            }

            ViewBag.peritaje = atencion.Peritaje;

            PersonasViewModel personaUsu;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
                if (personaUsu != null)
                {
                    ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
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
            List<ReporteEnfermeria> reporteEnfermeria;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/ReporteEnfermeria/historialReporteEnfermeria?idPaciente={atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reporteEnfermeria = JsonConvert.DeserializeObject<List<ReporteEnfermeria>>(apiResponse);
                }
            }

            string videoCallUrl = "";

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = _config["microservices_vidcallms01002"] + $"/videocall?atencionId={atencion.Id}&userId={uid}";
                using (var response = await httpClient.GetAsync(url))
                {
                    Console.WriteLine("url: " + url);
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    videoCallUrl = JsonConvert.DeserializeObject<VideoCallResponse>(apiResponse).urlRoom;
                }
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, HistorialAtenciones = historialAtenciones, reporteEnfermeriaList = reporteEnfermeria, urlVideoCall = videoCallUrl };

            LogUso(4, 15, Convert.ToInt32(uid), Convert.ToInt32(idCliente), "Atencion_Box/idAtencion=" + idAtencion);

            await GrabarLog(log);
            return View(atencionModel);
        }

        [Route("Ingresar_Sala_FU/{idAtencion}")]
        public async Task<IActionResult> Atencion_SalaEspera_FU([FromRoute] int idAtencion, [FromQuery] int anura = 0)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idSesion = HttpContext.User.FindFirstValue(ClaimTypes.Sid);
            var canal = HttpContext.User.FindFirstValue(ClaimTypes.Spn);
            if (canal == null || canal.Equals(""))
                canal = "plataforma";
            ViewBag.canal = canal;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            var log = new LogPacienteViaje();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var idespecialidadFilaUnica = HttpContext.User.FindFirstValue("especialidad");
            ViewBag.idEspecialidadFU = Convert.ToInt32(idespecialidadFilaUnica);
            bool mostrar = true;
            Atenciones atencion;

            var linkResponeAtencion = $"/agendamientos/Atenciones/{idAtencion}";
            switch (Convert.ToInt32(idCliente))
            {
                case 1:
                    linkResponeAtencion = $"/agendamientos/Atenciones/getEstadoFilaUnica?accion=A3&idPaciente={uid}&idAtencion=0";
                    mostrar = false;
                    break;
                case 148:
                    idSesion = "COLMENA";
                    break;
                case 108:
                    idSesion = "COOPEUCH";
                    break;
                default:
                    idSesion = "MEDISMART";
                    break;
            }
            if (mostrar)
            {
                var empresa = HttpContext.User.FindFirstValue("empresa");
                campos(empresa);
            }
            ViewBag.idSesion = idSesion;
            var preAtencion = new PreAtencion();
            preAtencion.IdPaciente = Convert.ToInt32(uid);
            preAtencion.IdSesionPlataforma = idSesion;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + linkResponeAtencion))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                    // Si la atención viene de smartcheck, actualizar estado
                    if (anura == 1 && atencion.Estado == "P")
                    {
                        string url = $"{_config["ServicesUrl"]}/agendamientos/Atenciones/{idAtencion}/estado/I";
                        await httpClient.PutAsync(url, new StringContent(string.Empty));

                        atencion.Estado = "I";
                    }
                }
            }
            var idClienteAtencion = atencion.IdCliente;
            if (idCliente == "1")
            {
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
            }

            log.Evento = "Paciente ingresa a sala de espera atencion directa " + idCliente + " " + canal;
            log.IdPaciente = Convert.ToInt32(uid);
            log.IdAtencion = idAtencion;
            if ((atencion == null || atencion.IdPaciente != int.Parse(uid) || atencion.Estado != "I") && idCliente != "1")
            {

                log.Evento = "Error en atención, nula, distinto paciente, o distinta a estado = I, re redirecciona a index de plataforma";
                await GrabarLog(log);
                return RedirectToAction("Index");


            }
            if (atencion.Id == -1)
            {
                switch (Convert.ToInt32(idCliente))
                {
                    case 1:
                        log.Evento = "Error en atención -1";
                        await GrabarLog(log);
                        return Redirect("https://clientes.consalud.cl/clickdoctor/");
                    default:
                        break;
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
            using (var httpClient = new HttpClient())
            {
                var jsonString = JsonConvert.SerializeObject(idAtencion);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/ingresoAtencionPaciente?idAtencion={idAtencion}", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = paciente };

            /*Consumo smartcheck*/

            var client = new RestClient($"https://smartcheck-backend.azurewebsites.net/api/Measurement/measurementByAttentionID?attention_id={idAtencion}");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            IRestResponse r = client.Execute(request);
            var resultado = r.Content;

            if (resultado.Length > 0)
            {

                JArray data = JArray.Parse(resultado);

                for (int i = 0; i < data.Count; i++)
                    if (resultado.Length > 0 && idAtencion != 0)
                    {
                        var puntajeSalud1 = Convert.ToDouble(data[i]["detail"]["health_Score"]);
                        var puntajeSalud = (Math.Truncate(puntajeSalud1 * 100) / 100);
                        ViewBag.puntajeSaludSmartcheck = puntajeSalud;
                        ViewBag.idSmartcheck = 1;

                        if (puntajeSalud >= 0 && puntajeSalud <= 16.65)
                        {
                            ViewBag.colorSmartcheck = "rgba(225,82,65,1)";
                        }
                        else if (puntajeSalud >= 16.67 && puntajeSalud <= 33.3)
                        {
                            ViewBag.colorSmartcheck = "rgba(226,148,143,1)";
                        }
                        else if (puntajeSalud >= 33.4 && puntajeSalud <= 66.6)
                        {
                            ViewBag.colorSmartcheck = "rgba(249,236,161,1)";
                        }
                        else if (puntajeSalud >= 66.7 && puntajeSalud <= 83.35)
                        {
                            ViewBag.colorSmartcheck = "rgba(55,180,93,1)";
                        }
                        else if (puntajeSalud >= 83.36 && puntajeSalud <= 100)
                        {
                            ViewBag.colorSmartcheck = "rgba(36,115,60,1)";
                        }
                    }

            }
            else
            {
                ViewBag.puntajeSaludSmartcheck = 0;
                ViewBag.colorSmartcheck = "";
                ViewBag.idSmartcheck = 0;
            }






            await GrabarLog(log);
            return View(atencionModel);
        }

        [Route("Sin_Horas_FU")]
        public async Task<IActionResult> SinHorasFUConsalud()
        {
            var idespecialidadFilaUnica = HttpContext.User.FindFirstValue("especialidad");

            RangoHorario data = new RangoHorario();
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/getListHorasPediatriaConsalud?idEspecialidad={Convert.ToInt32(idespecialidadFilaUnica)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    data = JsonConvert.DeserializeObject<RangoHorario>(apiResponse);
                    ViewBag.HoraInicio = data.HoraInicio.ToString("t");
                    ViewBag.HoraFin = data.HoraFin.ToString("t");
                }

            }
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();

        }

        [Route("SinHorasFUZurich/{idEspecialidadFilaUnica}/{uid}")]
        public async Task<IActionResult> SinHorasFUZurich(int idEspecialidadFilaUnica, int uid)
        {
#if DEBUG

            int CambioIdCliente = 359;
#else
            int CambioIdCliente = 401;
#endif
            List<Especialidades> listaRestriccion = new List<Especialidades>();

            var servicesUrl = _config["ServicesUrl"];
            var strEndPointAtenciones = $"{servicesUrl}/agendamientos/Especialidades/getEspecialidadInmediata/?uid={uid}&idCliente={CambioIdCliente}";
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(strEndPointAtenciones);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    listaRestriccion = JsonConvert.DeserializeObject<List<Especialidades>>(content);
                }
                else
                {
                    throw new Exception("Error al obtener las especialidades inmediatas.");
                }
            }

            string validacionMensaje = "";
            listaRestriccion = listaRestriccion.Where(x => x.Id == idEspecialidadFilaUnica && x.TieneRestriccion == true).Select(x => x).ToList();
            if (listaRestriccion.Count == 1)
            {
                Especialidades especialidad = listaRestriccion.First();
                DateTime horaInicio = especialidad.HoraInicio;
                DateTime horaFin = especialidad.HoraFin;
                DateTime horaActual = DateTime.UtcNow.AddHours(-4);
                if (!string.IsNullOrEmpty(especialidad.Mensaje))
                {
                    validacionMensaje = especialidad.Mensaje;
                }
                else if (horaActual <= horaInicio || horaActual > horaFin)
                {
                    validacionMensaje = $"Lo sentimos, el horario de {especialidad.Nombre} es de {horaInicio.ToString("HH:mm")} a {horaFin.ToString("HH:mm")} hrs.";
                }
                else
                {
                    validacionMensaje = "Hora permitida.";

                }
            }
            else if (listaRestriccion.Count > 1)
            {
                string horariosRestriccion = "";
                string especialidadNombre = "";
                string MensajeFeriado = "";
                foreach (var especialidad in listaRestriccion)
                {
                    DateTime horaInicio = especialidad.HoraInicio;
                    DateTime horaFin = especialidad.HoraFin;
                    DateTime horaActual = DateTime.UtcNow.AddHours(-4);
                    MensajeFeriado = especialidad.Mensaje;
                    if (horaActual <= horaInicio || horaActual > horaFin)
                    {
                        horariosRestriccion += $" - {horaInicio.ToString("HH:mm")} a {horaFin.ToString("HH:mm")} hrs <br />";
                        especialidadNombre = especialidad.Nombre;
                    }
                }
                if (!string.IsNullOrEmpty(MensajeFeriado))
                {
                    validacionMensaje = MensajeFeriado;
                }
                else if (!string.IsNullOrEmpty(horariosRestriccion))
                {
                    validacionMensaje = $"Lo sentimos, los horarios de atención para {especialidadNombre} son:  <br /><br />{horariosRestriccion}";
                }
            }
            ViewBag.MessageZurich = validacionMensaje;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();

        }

        [Route("DetalleSeguro")]
        public async Task<IActionResult> DetalleSeguroAsync()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewData["view"] = Roles.Paciente;
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            var log = new LogPacienteViaje();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.activaBlanco = await GetActivaBlanco();

            ConsultaProductoSekure sekure = new ConsultaProductoSekure();
            var jsonSettings = new JsonSerializerSettings();
            var client = new RestClient(_config["ServicesSekure"] + $"/v1/Products/207");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            request.AddHeader("skr-key", _config["skr-key"]);
            IRestResponse response = client.Execute(request);
            sekure = JsonConvert.DeserializeObject<ConsultaProductoSekure>(response.Content, jsonSettings);


            EnrollPersonaSeguro seguroContratado;
            using (var httpClient = new HttpClient())
            {
                using (var responseList = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/enrollPersonaSeguro/getSegurosContratados?idUsuario={uid}&idEmpresa={idCliente}"))
                {
                    string apiResponse = await responseList.Content.ReadAsStringAsync();
                    seguroContratado = JsonConvert.DeserializeObject<EnrollPersonaSeguro>(apiResponse);
                }
            }


            log.Evento = "Paciente ingresa a información seguro" + idCliente;
            log.IdPaciente = Convert.ToInt32(uid);

            if (sekure.productDetail == null || seguroContratado == null)
            {
                return View("~/Views/Paciente/ErrorSeguros.cshtml");
            }

            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            await GrabarLog(log);

            ModuloSeguroContratado Seguro = new ModuloSeguroContratado() { detalleProducto = sekure, seguroContratado = seguroContratado };
            return View(Seguro);
        }

        [Route("ResumenAtencionCustom")]
        public async Task<IActionResult> ResumenAtencionCustomAsync(int idAtencion)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewData["view"] = Roles.Paciente;
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            ViewBag.servicesUrl = _config["ServicesUrl"];
            ViewBag.servicesUrlPago = _config["ServicesUrlApiPago"];
            var log = new LogPacienteViaje();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);


            string config = string.Empty;
            config = await GetUsuarioEmpresa();
            string empresa = config;
            EmpresaConfig empresaC = JsonConvert.DeserializeObject<EmpresaConfig>(empresa);
            // var recetaElectronica = empresaC.VisibleRecetaElectronica;
            var recetaElectronica = empresaC?.VisibleRecetaElectronica;
            ViewBag.recetaElectronica = recetaElectronica;


            List<Pharmacy> farmacias = new List<Pharmacy>();
            Atenciones atencion = new Atenciones();
            List<Examenes> examenesAtencion = new List<Examenes>();
            AtencionesInterconsultas atencionesInterconsultas = new AtencionesInterconsultas();


            log.Evento = "Paciente ingresa a informe de atención wow";
            log.IdPaciente = Convert.ToInt32(uid);
            log.IdAtencion = idAtencion;
            log.IdCliente = Convert.ToInt32(idCliente);

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            if (atencion == null || atencion.IdPaciente != int.Parse(uid))
            {
                switch (Convert.ToInt32(idCliente))
                {
                    case 1:
                        log.Evento = "Error en atención, nula, distinto paciente, o distinta a estado = I, re redirecciona a consalud (Informe de atencion)";
                        await GrabarLog(log);
                        return Redirect("https://clientes.consalud.cl/clickdoctor/");
                    default:
                        log.Evento = "Error en atención, nula, distinto paciente, o distinta a estado = I, re redirecciona a index de plataforma (Informe de Atencion)";
                        await GrabarLog(log);
                        return RedirectToAction("Index");
                }

            }

            if (!ViewBag.HostURL.Contains("vivetuseguro.wedoctorsmx"))
            {
                using (var httpClient = new HttpClient())
                {
                    try
                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/yapp/Farmazon/FindMedicineInPharmacies?attentionId={Convert.ToInt32(idAtencion)}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            farmacias = JsonConvert.DeserializeObject<List<Pharmacy>>(apiResponse);
                            farmacias ??= new List<Pharmacy>();
                        }
                    }
                    catch (Exception e)
                    {
                        Console.Write(e);
                    }
                }
            }

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Examenes/getExamenesByAtencion?IdAtencion={Convert.ToInt32(idAtencion)}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        examenesAtencion = JsonConvert.DeserializeObject<List<Examenes>>(apiResponse);
                        examenesAtencion ??= new List<Examenes>();
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            ViewBag.interconsultaGenerada = 0;

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/AtencionesInterconsultas/getInterconsultasByIdAtencion/{idAtencion}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        atencionesInterconsultas = JsonConvert.DeserializeObject<AtencionesInterconsultas>(apiResponse);
                        if (atencionesInterconsultas != null)
                        {
                            ViewBag.interconsultaGenerada = atencionesInterconsultas.Id;
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }




            // Http Clients
            using HttpClient pacienteHttpClient = new HttpClient();
            using HttpClient proximaHoraHttpClient = new HttpClient();
            List<VwHorasMedicos> proximaHora = new List<VwHorasMedicos>();
            proximaHoraHttpClient.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", $"Bearer {auth}");

            // Llamadas en paralelo
            Task<HttpResponseMessage> pacienteTask = pacienteHttpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}");
            if (atencion.IdEspecialidadDerivacion > 0)
            {
                Task<HttpResponseMessage> proximaHoraTask = proximaHoraHttpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/agendar/GetMedicosHorasInterConsulta?idEspecialidad={atencion.IdEspecialidadDerivacion}&idBloque={0}&userId={atencion.IdPaciente}&fecha={DateTime.Now:yyyy-MM-dd}&idCliente={idCliente}&tipoEspecialidad=");
                // Espera llamadas

                string proximaHoraResponse = await proximaHoraTask.Result.Content.ReadAsStringAsync();
                proximaHora = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(proximaHoraResponse) ?? new List<VwHorasMedicos>();
            }
            // Asignación respuestas

            string pacienteResponse = await pacienteTask.Result.Content.ReadAsStringAsync();
            PersonasViewModel paciente = JsonConvert.DeserializeObject<PersonasViewModel>(pacienteResponse);
            if (paciente != null)
            {
                if (paciente.rutaAvatar != null)
                {
                    paciente.rutaAvatar = paciente.rutaAvatar.Replace("\\", "/") ?? null;
                }
            }




            string publicKey = "";
            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/PaymentCard/getAccesTokenMercadoPago/{paciente.CodigoTelefono}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        publicKey = (apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }
            ViewBag.publicKey = publicKey;

            List<PaymentCardMercadoPago> tarjetas = new List<PaymentCardMercadoPago>();

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/PaymentCard/GetPaymentCardbyIdUser/{uid}/{paciente.CodigoTelefono}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        tarjetas = JsonConvert.DeserializeObject<List<PaymentCardMercadoPago>>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }
            DatosCardMercadopPago objTarjetasUsuario = new DatosCardMercadopPago();
            objTarjetasUsuario.tarjetas = tarjetas;
            objTarjetasUsuario.idUser = Convert.ToInt32(uid);
            objTarjetasUsuario.identificador = paciente.Identificador;
            objTarjetasUsuario.nombreUser = paciente.nombreCompleto;
            objTarjetasUsuario.email = paciente.Correo;
            objTarjetasUsuario.codigotelefono = paciente.CodigoTelefono;



            OrderHeader objOrder = new OrderHeader();

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/Order/GetOrderbyIdAttention/{atencion.Id}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        objOrder = JsonConvert.DeserializeObject<OrderHeader>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            if (objOrder != null)
                if (objOrder.customer_exam_address_id > 0)
                {
                    IList<Address> direcciones = new List<Address>();

                    using var httpClient = new HttpClient();
                    using var response = await httpClient.GetAsync($"{_config["ServicesUrl"]}/usuarios/personas/getAddresses/{uid}/E");
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    direcciones = JsonConvert.DeserializeObject<List<Address>>(apiResponse) ?? new List<Address>();

                    foreach (Address direccion in direcciones)
                    {
                        if (direccion.Id == objOrder.customer_exam_address_id)
                        {
                            string direccionEx = direccion.Direccion;
                            string direccionExamenWOW = HttpUtility.UrlEncode(direccionEx, System.Text.Encoding.UTF8);
                            ViewBag.direccionExamenWOW = direccionEx;
                        }
                    }
                }

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync($"{_config["ServicesUrl"]}/usuarios/personas/getAddresses/{uid}/E"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        JArray jsonArray = JArray.Parse(apiResponse);
                        ViewBag.totalDirecciones = jsonArray.Count;
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }


            ViewBag.codigoTelefono = atencion.CodigoPais;
            /*if (atencion.CodigoPais == "CO")
            {
                int totalPagar = 0;
                foreach (Examenes item in examenesAtencion)
                {
                    if (item.EstadoPago != "CAPTURED")
                    {
                        totalPagar += Convert.ToInt32(item.TarifaOfertaMedismart);
                    }
                }
                ViewBag.vads_action_mode = "INTERACTIVE";
                ViewBag.vads_amount = totalPagar.ToString() + "00";
                ViewBag.vads_ctx_mode = _config["BackOfficeMode"].ToString();
                ViewBag.vads_currency = "170";
                ViewBag.vads_page_action = "PAYMENT";
                ViewBag.vads_payment_config = "SINGLE";
                ViewBag.vads_site_id = "26003858";
                ViewBag.vads_trans_date = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
                ViewBag.vads_trans_id = (idAtencion).ToString();
                ViewBag.vads_version = "V2";
                string cadenaConvertir = (ViewBag.vads_action_mode + "+" + ViewBag.vads_amount + "+" + ViewBag.vads_ctx_mode + "+" + ViewBag.vads_currency + "+" + ViewBag.vads_page_action + "+" +
                                    ViewBag.vads_payment_config + "+" + ViewBag.vads_site_id + "+" + ViewBag.vads_trans_date + "+" + ViewBag.vads_trans_id + "+" + ViewBag.vads_version + "+" + _config["BackOffice"].ToString());

                var secretKey = _config["BackOffice"].ToString();
                // Initialize the keyed hash object using the secret key as the key
                HMACSHA256 hashObject = new HMACSHA256(ASCIIEncoding.UTF8.GetBytes(secretKey));
                // Computes the signature by hashing the salt with the secret key as the key
                var signature = hashObject.ComputeHash(ASCIIEncoding.UTF8.GetBytes(cadenaConvertir));
                // Base 64 Encode
                var encodedSignature = Convert.ToBase64String(signature);
                ViewBag.signature = encodedSignature;
                ViewBag.cadecaCompleta = cadenaConvertir;
                ViewBag.KeySha = secretKey;

                ViewBag.pagoPayzenHabilitado = Convert.ToBoolean(_config["PagoPayzenHabilidato"]);

                var userr = User as ClaimsPrincipal;
                var identity = userr.Identity as ClaimsIdentity;

                foreach (var c in userr.Claims)
                {
                    if (c.Type == "PayzenPagoAtencion")
                    {
                        identity.RemoveClaim(c);
                        break;
                    }
                }

                identity.AddClaim(new Claim("PayzenPagoAtencion", (idAtencion).ToString()));
                await HttpContext.SignInAsync($"PacienteSchemes",
                new ClaimsPrincipal(new ClaimsIdentity(userr.Claims, "Cookies", "user", "role")),
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                });
            }*/


            /*Consulta smartcheck por idAtencion*/

            var client = new RestClient("http://smartcheck-backend.azurewebsites.net/api/Measurement/measurementByAttentionID?attention_id=" + Convert.ToInt32(idAtencion));
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            IRestResponse r = client.Execute(request);
            var resultado = r.Content;
            ViewBag.historialSmartcheck = null;
            if (resultado.Length > 0)
            {
                ViewBag.historialSmartcheck = JArray.Parse(resultado);
            }

            List<VwHorasMedicos> horasAgendadasBloquesHoras;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            List<VwHorasMedicos> proximasHorasPaciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A3&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    proximasHorasPaciente = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            List<Atenciones> historialAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A1&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtenciones = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

            /* Trae Archivos anexos de atenciones */
            List<Archivo> archivosAtenciones;
            using (var httpClient = new HttpClient())
            {
                var IdPais = 0;

                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Archivo/getArchivoByPaciente?uid={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    archivosAtenciones = JsonConvert.DeserializeObject<List<Archivo>>(apiResponse);
                }
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getIdPais?idPaciente={uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    var AtencionesPais = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);

                    IdPais = AtencionesPais[0].IdPais;
                }

                #region Medikit
                // Iterar sobre cada id de atención y hacer la consulta de forma individual
                if (IdPais == 39)
                {
                    foreach (var idAtencion2 in historialAtenciones.Select(atencion => atencion.Id).Distinct())
                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialMedikit?idAtencion={idAtencion2}"))
                        {
                            string medikitApiResponse = await response.Content.ReadAsStringAsync();

                            // Deserializar un solo objeto Medikit en lugar de una lista
                            var medikitUrl = JsonConvert.DeserializeObject<Medikit>(medikitApiResponse);

                            // Verificar el status del objeto y mapearlo a Archivo
                            if (!medikitUrl.status)
                            {
                                Archivo nuevaReceta = new Archivo
                                {
                                    nombreArchivo = "Medikit.pdf",
                                    url = medikitUrl.id_medikit,
                                    statusMedikit = "Correcto"
                                };
                                archivosAtenciones.Add(nuevaReceta);
                            }
                            else
                            {
                                var medikitUrlFromAPI = await ObtenerUrlMedikitDesdeAPI(idAtencion2, httpClient);
                                if (!string.IsNullOrEmpty(medikitUrlFromAPI))
                                {
                                    Archivo nuevaReceta = new Archivo
                                    {
                                        nombreArchivo = "Medikit",
                                        url = medikitUrlFromAPI,
                                    };

                                    atencion = historialAtenciones.FirstOrDefault(a => a.Id == idAtencion2);
                                    if (atencion != null)
                                    {
                                        atencion.statusMedikit = "Correcto";
                                        atencion.urlMedikit = medikitUrlFromAPI;
                                        atencion.nombreMedikit = "Medikit";
                                    }
                                    archivosAtenciones.Add(nuevaReceta);
                                }
                            }
                        }
                    }
                    #endregion
                }
            }

            async Task<string> ObtenerUrlMedikitDesdeAPI(int idAtencion2, HttpClient client)
            {
                var urls = new List<string>();

                var medikitUrl = _config["ServicesMediKit"] + $"/api/Medikit/AddPrescription/{idAtencion2}";

                using (var response = await client.PostAsync(medikitUrl, null))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string medikitResponseString = await response.Content.ReadAsStringAsync();
                        var medikitResponse = JsonConvert.DeserializeObject<MedikitResponse>(medikitResponseString);
                        if (medikitResponse.operationSuccess)
                        {
                            urls.Add(medikitResponse.objectResponse);
                        }
                    }
                }

                string combinedUrls = string.Join(",", urls);

                return combinedUrls;
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = paciente, HorasDerivacion = proximaHora, Examenes = examenesAtencion, Farmacias = farmacias, DatosTarjetasMercadoPago = objTarjetasUsuario, OrderAttention = objOrder, TimelineData = horasAgendadasBloquesHoras, ProximasHorasPaciente = proximasHorasPaciente, Archivo = archivosAtenciones };
            await GrabarLog(log);
            return View(atencionModel);

        }


        [Route("CompraCustom")]
        public async Task<IActionResult> CompraCustomAsync(int idAtencion)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewData["view"] = Roles.Paciente;
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            ViewBag.servicesUrl = _config["ServicesUrl"];
            ViewBag.servicesUrlPago = _config["ServicesUrlApiPago"];
            var log = new LogPacienteViaje();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.activaBlanco = await GetActivaBlanco();
            var host = GetHostValue(HttpContext.Request.Host.Value);

            // Http Clients
            using HttpClient farmaciasHttpClient = new HttpClient();
            using HttpClient atencionHttpClient = new HttpClient();
            using HttpClient examenesAtencionHttpClient = new HttpClient();

            // Llamadas en paralelo

            Task<HttpResponseMessage> atencionTask = atencionHttpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}");
            Task<HttpResponseMessage> examenesAtencionTask = examenesAtencionHttpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Examenes/getExamenesByAtencion?IdAtencion={Convert.ToInt32(idAtencion)}");

            List<Pharmacy> farmacias = new List<Pharmacy>();
            // Espera llamadas
            if (!host.Contains("vivetuseguro.wedoctorsmx"))
            {
                Task<HttpResponseMessage> farmaciasTask = farmaciasHttpClient.GetAsync(_config["ServicesUrl"] + $"/yapp/Farmazon/FindMedicineInPharmacies?attentionId={idAtencion}"); //para probar usar el id de atencion 170415
                string farmaciasResponse = await farmaciasTask.Result.Content.ReadAsStringAsync();
                farmacias = JsonConvert.DeserializeObject<List<Pharmacy>>(farmaciasResponse);

            }

            string atencionResponse = await atencionTask.Result.Content.ReadAsStringAsync();
            string examenesAtencionResponse = await examenesAtencionTask.Result.Content.ReadAsStringAsync();
            // Asignación respuestas

            Atenciones atencion = JsonConvert.DeserializeObject<Atenciones>(atencionResponse);
            List<Examenes> examenesAtencion = JsonConvert.DeserializeObject<List<Examenes>>(examenesAtencionResponse);

            log.Evento = "Paciente ingresa a informe de atención wow" + idCliente;
            log.IdPaciente = Convert.ToInt32(uid);
            log.IdAtencion = idAtencion;


            if (atencion == null || atencion.IdPaciente != int.Parse(uid))
            {
                switch (Convert.ToInt32(idCliente))
                {
                    case 1:
                        log.Evento = "Error en atención, nula, distinto paciente, o distinta a estado = I, re redirecciona a consalud (Informe de atencion)";
                        await GrabarLog(log);
                        return Redirect("https://clientes.consalud.cl/clickdoctor/");
                    default:
                        log.Evento = "Error en atención, nula, distinto paciente, o distinta a estado = I, re redirecciona a index de plataforma (Informe de Atencion)";
                        await GrabarLog(log);
                        return RedirectToAction("Index");
                }

            }

            // Http Clients
            using HttpClient pacienteHttpClient = new HttpClient();
            using HttpClient proximaHoraHttpClient = new HttpClient();
            proximaHoraHttpClient.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", $"Bearer {auth}");

            // Llamadas en paralelo
            Task<HttpResponseMessage> pacienteTask = pacienteHttpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}");
            Task<HttpResponseMessage> proximaHoraTask = proximaHoraHttpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/agendar/GetMedicosHorasInterConsulta?idEspecialidad={atencion.IdEspecialidadDerivacion}&idBloque={0}&userId={atencion.IdPaciente}&fecha={DateTime.Now:yyyy-MM-dd}&idCliente={idCliente}&tipoEspecialidad=");
            // Espera llamadas
            string pacienteResponse = await pacienteTask.Result.Content.ReadAsStringAsync();
            string proximaHoraResponse = await proximaHoraTask.Result.Content.ReadAsStringAsync();
            // Asignación respuestas
            PersonasViewModel paciente = JsonConvert.DeserializeObject<PersonasViewModel>(pacienteResponse);
            List<VwHorasMedicos> proximaHora = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(proximaHoraResponse) ?? new List<VwHorasMedicos>();

            List<Atenciones> atencionWowList = new List<Atenciones>();
            OrderHeader objOrder = new OrderHeader();

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/Order/GetOrderbyIdAttention/{atencion.Id}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        objOrder = JsonConvert.DeserializeObject<OrderHeader>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            float costoEnvio = 0;

            if (objOrder.Items_details != null)
                foreach (OrderDetail obj in objOrder.Items_details)
                {
                    if (obj.Category == 1)
                    {
                        costoEnvio = 1000;
                    }

                    if (obj.Category == 3)
                    {
                        int idAtencionExterna = int.Parse(obj.External_product_id);
                        Task<HttpResponseMessage> atencionTaskWow = atencionHttpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencionExterna}");
                        string atencionResponseWow = await atencionTaskWow.Result.Content.ReadAsStringAsync();
                        Atenciones atencionWow = JsonConvert.DeserializeObject<Atenciones>(atencionResponseWow);
                        atencionWow.Observaciones = obj.Total_cost.ToString();
                        atencionWowList.Add(atencionWow);
                    }

                }
            costoEnvio = objOrder.delivery_amount + costoEnvio;
            ViewBag.CostoEnvio = costoEnvio;

            PersonasViewModel personaUsu = new PersonasViewModel();
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
                if (personaUsu != null)
                {
                    ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                }
            }



            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = paciente, HorasDerivacion = proximaHora, Examenes = examenesAtencion, Farmacias = farmacias, AtencionWow = atencionWowList, OrderAttention = objOrder };
            await GrabarLog(log);
            return View(atencionModel);
        }

        [Route("CompraCustomExamenes")]
        public async Task<IActionResult> CompraCustomExamenesAsync(int idHistorialExamenAtencion)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewData["view"] = Roles.Paciente;
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            ViewBag.servicesUrl = _config["ServicesUrl"];
            ViewBag.servicesUrlPago = _config["ServicesUrlApiPago"];
            var log = new LogPacienteViaje();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.activaBlanco = await GetActivaBlanco();
            var host = GetHostValue(HttpContext.Request.Host.Value);

            // Http Clients
            using HttpClient farmaciasHttpClient = new HttpClient();
            using HttpClient atencionHttpClient = new HttpClient();

            // Llamadas en paralelo


            log.Evento = "Paciente ingresa a informe de atención wow" + idCliente;
            log.IdPaciente = Convert.ToInt32(uid);


            OrderHeader objOrder = new OrderHeader();

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/Order/GetOrderbyIdExamen/{idHistorialExamenAtencion}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        if (apiResponse != null && apiResponse != "No se encontró información")
                        {
                            objOrder = JsonConvert.DeserializeObject<OrderHeader>(apiResponse);
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            using HttpClient examenesAtencionHttpClient = new HttpClient();
            List<ExamenesAsistencia> examenesAsistencia = new List<ExamenesAsistencia>();
            List<Examenes> examenes = new List<Examenes>();
            try
            {
                Task<HttpResponseMessage> examenesAtencionTask = examenesAtencionHttpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/examenes/getHistorialExamenesOrientacion?idHistorial={idHistorialExamenAtencion}");
                string examenesAtencionResponse = await examenesAtencionTask.Result.Content.ReadAsStringAsync();
                var dynamicResponse = JArray.Parse(examenesAtencionResponse);

                if (dynamicResponse.Count > 0)
                {
                    var firstItem = dynamicResponse[0];

                    var examenesAsistenciaItem = new ExamenesAsistencia
                    {
                        Id = (int)firstItem["id"],
                        IdCiudad = (int)firstItem["ciudad"],
                        IdComuna = (int)firstItem["comuna"],
                        WowMx = (bool?)firstItem["wowMx"],
                        examenes = new List<Examenes>()
                    };

                    var examenesArray = (JArray)firstItem["examenes"];
                    Examenes examenDetalle;

                    foreach (var examen in examenesArray)
                    {
                        if (examen.Type == JTokenType.Integer)
                        {
                            int idExamen = (int)examen;
                            using HttpClient examenesHttpClient = new HttpClient();
                            Task<HttpResponseMessage> examenesTask = examenesHttpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Examenes/getExamenesByIdExamen?IdExamen={idExamen}");
                            HttpResponseMessage examenesResponseMessage = await examenesTask;
                            string examenesResponse = await examenesTask.Result.Content.ReadAsStringAsync();
                            examenDetalle = JsonConvert.DeserializeObject<Examenes>(examenesResponse);

                            // Agregar el examen a la lista
                            examenesAsistenciaItem.examenes.Add(examenDetalle);
                            examenes.Add(examenDetalle);
                        }
                        else
                        {
                            // Manejar el caso en el que el parámetro no es un entero válido.
                            // Esto podría ser un error o un escenario alternativo según tu lógica.
                        }
                    }
                    examenesAsistencia.Add(examenesAsistenciaItem);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al procesar el examen asistencia con ID {idHistorialExamenAtencion}: {ex.Message}");
            }


            PersonasViewModel personaUsu = new PersonasViewModel();
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
                if (personaUsu != null)
                {
                    ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                }
            }



            AtencionViewModel atencionModel = new AtencionViewModel() { fichaPaciente = personaUsu, Examenes = examenes, OrderAttention = objOrder, ExamenesAsistencias = examenesAsistencia };
            await GrabarLog(log);
            return View(atencionModel);
        }

        public async Task<IActionResult> HistorialCustomAsync()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewData["view"] = Roles.Paciente;
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.activaBlanco = await GetActivaBlanco();
            ViewBag.codigoTelefono = HttpContext.User.FindFirstValue("CodigoTelefono");
            var host = GetHostValue(HttpContext.Request.Host.Value);
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);

            if (host.Contains("positiva."))
            {
                return Redirect("/Paciente/Agendar?grupoEspecialidad=psicologia");
            }
            if (host.Contains("didi.wedoctors"))
            {
                List<Empresa> empresas;
                using (var httpClient = new HttpClient())
                {

                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/Empresa/GetEmpresasDidibyIdentificador/{uid}"))
                    {

                        string apiResponse = await response.Content.ReadAsStringAsync();
                        empresas = JsonConvert.DeserializeObject<List<Empresa>>(apiResponse);

                        if (empresas.Count == 3)
                        {
                            return Redirect("/Paciente/PlanSalud");
                        }

                    }
                }
            }
            if (host.Contains("vivetuseguro."))
            {
                return Redirect("/Paciente/Index");
            }
            // Trae Historial Atenciones
            List<Atenciones> historialAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A1&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtenciones = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

            // Trayendo el usarname
            Atenciones atencion = historialAtenciones.FirstOrDefault();
            PersonasViewModel persona;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                string url = $"/usuarios/personas/personByUser/{uid}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            string IdentificadorTeledoc = persona.Identificador.Replace("-", "");

            // PRIMER LLAMADO A TELEDOC
            var teledocAtenciones = await ConsultarTeledoc(IdentificadorTeledoc);

            if (teledocAtenciones != null && teledocAtenciones.Count > 0)
            {
                historialAtenciones.AddRange(teledocAtenciones);
            }

            /* Trae Archivos anexos de atenciones */
            List<Archivo> archivosAtenciones;
            using (var httpClient = new HttpClient())
                {

                var IdPais = 0;
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Archivo/getArchivoByPaciente?uid={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    archivosAtenciones = JsonConvert.DeserializeObject<List<Archivo>>(apiResponse);

                }
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getIdPais?idPaciente={uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    var AtencionesPais = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);

                    IdPais = AtencionesPais[0].IdPais;
                }

                if ( IdPais == 39)
                {
                #region Medikit
                // Iterar sobre cada id de atención y hacer la consulta de forma individual
                    foreach (var idAtencion in historialAtenciones.Select(atencion => atencion.Id).Distinct())
                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialMedikit?idAtencion={idAtencion}"))
                        {
                            string medikitApiResponse = await response.Content.ReadAsStringAsync();

                            // Deserializar un solo objeto Medikit en lugar de una lista
                            var medikitUrl = JsonConvert.DeserializeObject<Medikit>(medikitApiResponse);

                            // Verificar el status del objeto y mapearlo a Archivo
                            if (medikitUrl != null && medikitUrl.status)
                            {
                                Archivo nuevaReceta = new Archivo
                                {
                                    nombreArchivo = "Medikit.pdf",
                                    url = medikitUrl.id_medikit,
                                    statusMedikit = "Correcto"
                                };
                                archivosAtenciones.Add(nuevaReceta);
                            }
                            else
                            {
                                var medikitUrlFromAPI = await ObtenerUrlMedikitDesdeAPI(idAtencion, httpClient);
                                if (!string.IsNullOrEmpty(medikitUrlFromAPI))
                                {
                                    Archivo nuevaReceta = new Archivo
                                    {
                                        nombreArchivo = "Medikit.pdf",
                                        url = medikitUrlFromAPI,
                                        statusMedikit = "Correcto"
                                    };

                                    var atencionMedikit = historialAtenciones.FirstOrDefault(a => a.Id == idAtencion);
                                    if (atencion != null)
                                    {
                                        atencionMedikit.statusMedikit = "Correcto";
                                        atencionMedikit.urlMedikit = medikitUrlFromAPI;
                                        atencionMedikit.nombreMedikit = "Medikit";
                                    }
                                    archivosAtenciones.Add(nuevaReceta);
                                }
                            }
                        }
                    }
                    #endregion
                }
            }

            async Task<string> ObtenerUrlMedikitDesdeAPI(int idAtencion, HttpClient client)
            {
                var urls = new List<string>();

                // No necesitas este bucle ya que estás utilizando el idAtencion pasado como parámetro
                var medikitUrl = _config["ServicesMediKit"] + $"/api/Medikit/AddPrescription/{idAtencion}";

                using (var response = await client.PostAsync(medikitUrl, null))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string medikitResponseString = await response.Content.ReadAsStringAsync();
                        var medikitResponse = JsonConvert.DeserializeObject<MedikitResponse>(medikitResponseString);
                        if (medikitResponse.operationSuccess)
                        {
                            urls.Add(medikitResponse.objectResponse);
                        }
                    }
                }

                string combinedUrls = string.Join(",", urls);

                return combinedUrls;
            }

            List<AtencionesTeledocViewModel> teledocResponses = new List<AtencionesTeledocViewModel>();

            // SEGUNDO LLAMADO A TELEDOC
            foreach (var IdConsultaTeledoc in teledocAtenciones.Select(t => t.IdConsultaTeledoc))
            {
                var teledocResponseModel = await ConsultarTeledoc(IdentificadorTeledoc, IdConsultaTeledoc);

                if (teledocResponseModel != null)
                {
                    teledocResponses.Add(teledocResponseModel);
                }
            }

            // Procesar los resultados obtenidos
            foreach (var teledocResponseModel in teledocResponses)
            {
                if (teledocResponseModel.archivos != null)
                {
                    foreach (var archivoTeledoc in teledocResponseModel.archivos)
                    {
                        // Crear un nuevo objeto Archivo y asignarle los valores correspondientes
                        Archivo nuevoArchivo = new Archivo
                        {
                            IdConsultaTeledoc = archivoTeledoc.idConsulta,
                            nombreArchivo = archivoTeledoc.nombreArchivo,
                            url = archivoTeledoc.url,
                            diagnostico = teledocResponseModel.ficha_medica.diagnostico
                        };

                        // Agregar el nuevo archivo a la lista archivosAtenciones
                        archivosAtenciones.Add(nuevoArchivo);
                    }
                }
            }

            /*ExamenesPreventivos*/
            List<HistorialExamenesPreventivos> examenesPreventivosByIdCliente;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Examenes/getExamenesPreventivosByidCliente?uid={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    examenesPreventivosByIdCliente = JsonConvert.DeserializeObject<List<HistorialExamenesPreventivos>>(apiResponse);
                }
            }
            /*Trae archivos anexos de examenes preventivos*/
            List<HistorialExamenesPreventivos> archivoExamenesPreventivos;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Archivo/getArchivo?uid={Convert.ToInt32(uid)}&idCliente={idCliente}&codEntidad=EXAMEN-PREVENTIVO"))

                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    archivoExamenesPreventivos = JsonConvert.DeserializeObject<List<HistorialExamenesPreventivos>>(apiResponse);
                }
            }


            /*Historial Smartcheck Por userID*/

            //var client = new RestClient(_config["ServicesSmartcheck"] + $"/api/Measurement/measurementByUserID?userID={Convert.ToInt32(uid)}"); SE COMENTA PARA AGREGAR EL ENDPOINT TRAYENDO TODAS LAS PRUEBAS SMARTCHECK
            var client = new RestClient(_config["ServicesSmartcheck"] + $"/getMeasurementByUserID?userId={Convert.ToInt32(uid)}");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            IRestResponse r = client.Execute(request);
            var resultado = r.Content;
            var jsonResponse = JObject.Parse(r.Content);
            var data = jsonResponse["data"];
            ViewBag.historialCustomSmartcheck = null;
            ViewBag.historialTestOcupacionales = null;
            if (data != null && data.Type == JTokenType.Array)
            {
                ViewBag.historialCustomSmartcheck = data;
            }
            else ViewBag.historialCustomSmartcheck = null;

            List<VwHorasMedicos> horasAgendadasBloquesHoras;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            List<VwHorasMedicos> proximasHorasPaciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A3&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    proximasHorasPaciente = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            List<Archivo> testOcupacionalResult;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Archivo/GetArchivoTestOcupacional?uid={Convert.ToInt32(uid)}&codEntidad=TEST-OCUPACIONALES"))

                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    testOcupacionalResult = JsonConvert.DeserializeObject<List<Archivo>>(apiResponse);
                }
            }
            var empresa = HttpContext.User.FindFirstValue("empresa");
            campos(empresa);
            AtencionViewModel atencionModel = new AtencionViewModel() { HistorialAtenciones = historialAtenciones, Archivo = archivosAtenciones, ExamenesPreventivos = examenesPreventivosByIdCliente, ArchivoExamenPreventivo = archivoExamenesPreventivos, TimelineData = horasAgendadasBloquesHoras, ProximasHorasPaciente = proximasHorasPaciente, TestOcupacionalResult = testOcupacionalResult };
            return View(atencionModel);
        }


        public async Task<IActionResult> FacturacionSuscripcionAsync(int idEmpresa, string preapproval_id = null)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewData["view"] = Roles.Paciente;
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            ViewBag.servicesUrl = _config["ServicesUrl"];
            ViewBag.servicesUrlPago = _config["ServicesUrlApiPago"];
            ViewBag.UltimaFactura = "";
            var log = new LogPacienteViaje();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var host = GetHostValue(HttpContext.Request.Host.Value);

            if (host.Contains("didi.wedoctors"))
            {
                List<Empresa> empresas;
                using (var httpClient = new HttpClient())
                {
                    ViewBag.PreHomeDidi = false;
                    httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/Empresa/GetEmpresasDidibyIdentificador/{uid}"))
                    {

                        string apiResponse = await response.Content.ReadAsStringAsync();
                        empresas = JsonConvert.DeserializeObject<List<Empresa>>(apiResponse);

                        if (empresas.Count == 3)
                        {
                            ViewBag.PreHomeDidi = true;
                        }

                    }
                }
            }

            List<AseguradoraEspecialidadUsuario> Especiaidades = new List<AseguradoraEspecialidadUsuario>();

            Especiaidades = await GetPlanesAseguradoras();

            Especiaidades = Especiaidades.Where(x => x.IdCliente == idEmpresa).ToList();

            ViewBag.uid = uid;
            ViewBag.idCliente = idCliente;
            ViewBag.Especialidades = Especiaidades;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            PersonasViewModel personaUsu = new PersonasViewModel();
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
                if (personaUsu != null)
                {
                    ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                }
            }

            string publicKey = "";
            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/PaymentCard/getAccesTokenMercadoPago/{personaUsu.CodigoTelefono}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        publicKey = (apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }
            ViewBag.publicKey = publicKey;

            List<PaymentCardMercadoPago> tarjetas = new List<PaymentCardMercadoPago>();

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/PaymentCard/GetPaymentCardbyIdUser/{uid}/{personaUsu.CodigoTelefono}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        tarjetas = JsonConvert.DeserializeObject<List<PaymentCardMercadoPago>>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }
            DatosCardMercadopPago objTarjetasUsuario = new DatosCardMercadopPago();
            objTarjetasUsuario.tarjetas = tarjetas;
            objTarjetasUsuario.idUser = Convert.ToInt32(uid);
            objTarjetasUsuario.identificador = personaUsu.Identificador;
            objTarjetasUsuario.nombreUser = personaUsu.nombreCompleto;
            objTarjetasUsuario.email = personaUsu.Correo;
            objTarjetasUsuario.codigotelefono = personaUsu.CodigoTelefono;


            OrderHeader objOrder = new OrderHeader();

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/Order/GetOrderbyIdUIdandIdEmpresa/{idEmpresa}/{uid}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        objOrder = JsonConvert.DeserializeObject<OrderHeader>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            if (objOrder != null)
                if (objOrder.customer_exam_address_id > 0)
                {
                    IList<Address> direcciones = new List<Address>();

                    using var httpClient = new HttpClient();
                    using var response = await httpClient.GetAsync($"{_config["ServicesUrl"]}/usuarios/personas/getAddresses/{uid}/E");
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    direcciones = JsonConvert.DeserializeObject<List<Address>>(apiResponse) ?? new List<Address>();

                    foreach (Address direccion in direcciones)
                    {
                        if (direccion.Id == objOrder.customer_exam_address_id)
                        {
                            string direccionEx = direccion.Direccion;
                            string direccionExamenWOW = HttpUtility.UrlEncode(direccionEx, System.Text.Encoding.UTF8);
                            ViewBag.direccionExamenWOW = direccionEx;
                        }
                    }
                }

            ViewBag.codigoTelefono = personaUsu.CodigoTelefono;

            InvoiceViewModel invoicevm = new InvoiceViewModel();
            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var invoices = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getInvoiceByIdUser/{uid}/{idEmpresa}"))
                    {
                        string apiResponse = await invoices.Content.ReadAsStringAsync();
                        invoicevm = JsonConvert.DeserializeObject<InvoiceViewModel>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            InvoiceConfig invoiceconfig = new InvoiceConfig();
            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var invoices = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/GetInvoiceConfigByIdEmpresa/{idEmpresa}"))
                    {
                        string apiResponse = await invoices.Content.ReadAsStringAsync();
                        invoiceconfig = JsonConvert.DeserializeObject<InvoiceConfig>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }


            FacturacionViewModel facturacionModel = new FacturacionViewModel() { DatosTarjetasMercadoPago = objTarjetasUsuario, fichaPaciente = personaUsu, OrderAttention = objOrder, InvoiceModel = invoicevm, Planes = Especiaidades, InvoiceCf = invoiceconfig };  //OrderAttention = objOrder, cuando montemos carro
            await GrabarLog(log);
            return View(facturacionModel);

        }

        public async Task<IActionResult> CompraSuscripcionAsync(int idFactura, int idEmpPayed)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewData["view"] = Roles.Paciente;
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            ViewBag.servicesUrl = _config["ServicesUrl"];
            ViewBag.servicesUrlPago = _config["ServicesUrlApiPago"];
            var log = new LogPacienteViaje();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.activaBlanco = await GetActivaBlanco();
            ViewBag.PreHomeDidi = true;

            List<AseguradoraEspecialidadUsuario> Especialidades;

            int idEmp = int.Parse(idCliente);

            Especialidades = await GetPlanesAseguradoras();

            Especialidades = Especialidades.Where(x => x.IdCliente == idEmpPayed).ToList();

            ViewBag.uid = uid;
            ViewBag.idCliente = idCliente;
            ViewBag.Especialidades = Especialidades;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            PersonasViewModel personaUsu = new PersonasViewModel();
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
                if (personaUsu != null)
                {
                    ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                }
            }

            int idEmpresa = personaUsu.IdEmpresa;

            OrderHeader objOrder = new OrderHeader();

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/Order/GetOrderbyIdUIdandIdEmpresa/{idCliente}/{uid}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        objOrder = JsonConvert.DeserializeObject<OrderHeader>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }



            AtencionViewModel atencionModel = new AtencionViewModel() { OrderAttention = objOrder };
            await GrabarLog(log);
            return View(atencionModel);
        }


        [Route("ResumenExamenesPago")]
        public async Task<IActionResult> ResumenExamenesPagoAsync(int idHistorialExamenAtencion)
        {
            try
            {
                //string jsonString = await new StreamReader(Request.Body).ReadToEndAsync();
                //Examenes examenesObj = JsonConvert.DeserializeObject<Examenes>(examenes);
                //var examenesIds = new List<int>();
                //var examenesList = examenes.Split(',');
                //if (!string.IsNullOrEmpty(examenes))
                //{
                //    foreach(string examen in examenesList)
                //    {
                //        if (int.TryParse(examen, out int examenId))
                //        {
                //            examenesIds.Add(examenId);
                //        }
                //        else
                //        {
                //            // Manejar el caso en el que el parámetro no es un entero válido.
                //            // Esto podría ser un error o un escenario alternativo según tu lógica.
                //        }
                //    }                    
                //}
                //ViewBag.Region = region; 
                //ViewBag.Comuna = comuna;
                var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
                var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                ViewBag.uid = uid;
                var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
                ViewBag.idCliente = idCliente;
                ViewData["view"] = Roles.Paciente;
                ViewBag.urlBase = _config["ServicesUrlWeb"];
                ViewBag.servicesUrl = _config["ServicesUrl"];
                ViewBag.servicesUrlPago = _config["ServicesUrlApiPago"];
                ViewBag.UltimaFactura = "";
                var log = new LogPacienteViaje();
                ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
                var host = GetHostValue(HttpContext.Request.Host.Value);
                ViewBag.uid = uid;
                ViewBag.idCliente = idCliente;
                ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

                PersonasViewModel personaUsu = new PersonasViewModel();
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                    }
                    if (personaUsu != null)
                    {
                        ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                    }
                }

                using HttpClient examenesAtencionHttpClient = new HttpClient();
                List<ExamenesAsistencia> examenesAsistencia = new List<ExamenesAsistencia>();
                List<Examenes> examenes = new List<Examenes>();
                try
                {
                    Task<HttpResponseMessage> examenesAtencionTask = examenesAtencionHttpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/examenes/getHistorialExamenesOrientacion?idHistorial={idHistorialExamenAtencion}");
                    string examenesAtencionResponse = await examenesAtencionTask.Result.Content.ReadAsStringAsync();
                    var dynamicResponse = JArray.Parse(examenesAtencionResponse);

                    if (dynamicResponse.Count > 0)
                    {
                        var firstItem = dynamicResponse[0];

                        var examenesAsistenciaItem = new ExamenesAsistencia
                        {
                            Id = (int)firstItem["id"],
                            IdCiudad = (int)firstItem["ciudad"],
                            IdComuna = (int)firstItem["comuna"],
                            WowMx = (bool?)firstItem["wowMx"],
                            examenes = new List<Examenes>()
                        };

                        var examenesArray = (JArray)firstItem["examenes"];
                        Examenes examenDetalle;

                        foreach (var examen in examenesArray)
                        {
                            if (examen.Type == JTokenType.Integer)
                            {
                                int idExamen = (int)examen;
                                using HttpClient examenesHttpClient = new HttpClient();
                                Task<HttpResponseMessage> examenesTask = examenesHttpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Examenes/getExamenesByIdExamen?IdExamen={idExamen}");
                                HttpResponseMessage examenesResponseMessage = await examenesTask;
                                string examenesResponse = await examenesTask.Result.Content.ReadAsStringAsync();
                                examenDetalle = JsonConvert.DeserializeObject<Examenes>(examenesResponse);

                                // Agregar el examen a la lista
                                examenesAsistenciaItem.examenes.Add(examenDetalle);
                                examenes.Add(examenDetalle);
                            }
                            else
                            {
                                // Manejar el caso en el que el parámetro no es un entero válido.
                                // Esto podría ser un error o un escenario alternativo según tu lógica.
                            }
                        }
                        examenesAsistencia.Add(examenesAsistenciaItem);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error al procesar el examen asistencia con ID {idHistorialExamenAtencion}: {ex.Message}");
                }

                List<Pharmacy> farmacias = new List<Pharmacy>();

                string publicKey = "";
                using (var httpClient = new HttpClient())
                {
                    try
                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/PaymentCard/getAccesTokenMercadoPago/{personaUsu.CodigoTelefono}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            publicKey = (apiResponse);
                        }
                    }
                    catch (Exception e)
                    {
                        Console.Write(e);
                    }
                }
                ViewBag.publicKey = publicKey;

                List<PaymentCardMercadoPago> tarjetas = new List<PaymentCardMercadoPago>();

                using (var httpClient = new HttpClient())
                {
                    try
                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/PaymentCard/GetPaymentCardbyIdUser/{uid}/{personaUsu.CodigoTelefono}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            tarjetas = JsonConvert.DeserializeObject<List<PaymentCardMercadoPago>>(apiResponse);
                        }
                    }
                    catch (Exception e)
                    {
                        Console.Write(e);
                    }
                }
                DatosCardMercadopPago objTarjetasUsuario = new DatosCardMercadopPago();
                objTarjetasUsuario.tarjetas = tarjetas;
                objTarjetasUsuario.idUser = Convert.ToInt32(uid);
                objTarjetasUsuario.identificador = personaUsu.Identificador;
                objTarjetasUsuario.nombreUser = personaUsu.nombreCompleto;
                objTarjetasUsuario.email = personaUsu.Correo;
                objTarjetasUsuario.codigotelefono = personaUsu.CodigoTelefono;


                OrderHeader objOrder = new OrderHeader();

                using (var httpClient = new HttpClient())
                {
                    try
                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/Order/GetOrderbyIdExamen/{idHistorialExamenAtencion}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            if (apiResponse != null && apiResponse != "No se encontró información")
                            {
                                objOrder = JsonConvert.DeserializeObject<OrderHeader>(apiResponse);
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        Console.Write(e);
                    }
                }

                if (objOrder != null)
                    if (objOrder.customer_exam_address_id > 0)
                    {
                        IList<Address> direcciones = new List<Address>();

                        using var httpClient = new HttpClient();
                        using var response = await httpClient.GetAsync($"{_config["ServicesUrl"]}/usuarios/personas/getAddresses/{uid}/E");
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        direcciones = JsonConvert.DeserializeObject<List<Address>>(apiResponse) ?? new List<Address>();

                        foreach (Address direccion in direcciones)
                        {
                            if (direccion.Id == objOrder.customer_exam_address_id)
                            {
                                string direccionEx = direccion.Direccion;
                                string direccionExamenWOW = HttpUtility.UrlEncode(direccionEx, System.Text.Encoding.UTF8);
                                ViewBag.direccionExamenWOW = direccionEx;
                            }
                        }
                    }

                ViewBag.codigoTelefono = personaUsu.CodigoTelefono;




                AtencionViewModel facturacionModel = new AtencionViewModel() { DatosTarjetasMercadoPago = objTarjetasUsuario, fichaPaciente = personaUsu, OrderAttention = objOrder, ExamenesAsistencias = examenesAsistencia, Farmacias = farmacias, Examenes = examenes };
                await GrabarLog(log);
                return View(facturacionModel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error interno del servidor");
            }

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

                if (host.Contains("desa.") || host.Contains("qa.") || HttpContext.Request.Host.Value.Contains("localhost"))
                {
                    var json = await NombreConvenio(username);
                    string conveniouser = "";
                    if (json != null && json.Value.ToString() != "[]")
                    {
                        dynamic blogObject = JsonConvert.DeserializeObject<object>(json.Value.ToString());


                        if (blogObject != null)
                            conveniouser = blogObject[0].convenio;
                    }

                    enroll = new IntegracionEnroll();
                    enroll.IdUsuario = uid;
                    if (conveniouser == "CONVENIO ON DEMAND")
                    {
                        enroll.Status = "406";
                    }
                    else
                    {
                        enroll.Convenio = "MEDISMART_QA";
                        enroll.Activo = "1";
                        enroll.Status = "200";
                    }

                }
                var jsonStringEnroll = "";
                string apiResponseEmpresa = "";
                string empresa = "";
                enroll.IdUsuario = uid;
                if (enroll.Status != "200")
                {
                    enroll.Convenio = "MEDISMART";

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
                else if (host.Contains("bicevida."))// Daviplata
                {
                    enroll.Convenio = "BICEVIDA";
                }
                else if (host.Contains("bicevidapersonas.."))// BiceVidaPersonas
                {
                    enroll.Convenio = "BICEVIDAPERSONAS";
                }
                else if (host.Contains("fletcher."))//AECSA COLOMBIA
                {
                    enroll.Convenio = "FLETCHER";
                }
                else if (host.Contains("clini."))//AECSA COLOMBIA
                {
                    enroll.Convenio = "CAPITADO";
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
        private async Task<JsonResult> NombreConvenio(string username)
        {

            using var httpClient = new HttpClient();
            using var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/findUsernameConvenioNewUsers?username={username}");
            string apiResponse = await response.Content.ReadAsStringAsync();
            return new JsonResult(apiResponse);

        }
        [HttpGet]
        public async Task<JsonResult> CambioBeneficiario(int uid = 0)
        {

            var codigoTelefono = HttpContext.User.FindFirstValue("CodigoTelefono");
            var idCliente = "0";
            var isPreHome = false;
            var horaInt = HttpContext.User.FindFirstValue("HoraInt");
            if (codigoTelefono == null || horaInt == null)
                return Json(new { msg = "Sin hora o codigo país", err = 2 }); //error 2, salir a login
            try
            {
                ViewBag.uid = uid;
                try
                {
                    using (var httpClient = new HttpClient())
                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/updateZonaHorariaPersona?uid={uid}&zonaHoraria={Convert.ToInt32(horaInt)}&codigoTelefono={codigoTelefono}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                        }
                    }

                }
                catch (Exception ex)
                {
                    return Json(new { msg = "Inactivo" });
                }

                // Autenticamos al usuario

                if (uid != 0)
                {


                    var user = await getUser(uid);
                    var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, user.Username),
                                new Claim(ClaimTypes.Role, user.RoleName),
                                new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                new Claim("CodigoTelefono", codigoTelefono),
                                new Claim("HoraInt", horaInt.ToString()),
                                new Claim(ClaimTypes.Authentication, NewToken(user.Username))
                            };
                    var host = GetHostValue(HttpContext.Request.Host.Value);
                    if (uid > 0)
                    {
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
                                isPreHome = empresaConfig.PreHome;

                                string empresa = ""; // model.Value.ToString();
                                empresa = JsonConvert.SerializeObject(empresaConfig).ToString();
                                claims.Add(new Claim("Empresa", empresa));
                                claims.Add(new Claim(ClaimTypes.PrimarySid, idCliente));

                            }

                            catch (Exception e)
                            {

                                Console.WriteLine(e.Message);
                                return Json(new { msg = "Inactivo" });
                            }

                        }

                        //var host = "colmena.medical.medismart.live";

                        await HttpContext.SignInAsync($"{user.RoleName}Schemes",
                            new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                            new AuthenticationProperties
                            {
                                IsPersistent = true,
                                ExpiresUtc = DateTime.UtcNow.AddDays(1)

                            });
                    }

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

        public async Task<List<AseguradoraEspecialidadUsuario>> GetPlanesAseguradoras()
        {

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var host = GetHostValue(HttpContext.Request.Host.Value);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            var lista = new List<AseguradoraEspecialidadUsuario>();
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/usuarios/empresa/GetPlanesAseguradoras?host={host}&uid={Convert.ToInt32(uid)}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    // Respuesta no existosa
                    if (!response.IsSuccessStatusCode)
                    {
                        try
                        {
                            throw new HandledException($"HttpException: {url}", "apiResponse", apiResponse);
                        }
                        catch (Exception handledException)
                        {
                            SentrySdk.CaptureException(handledException);
                        }
                    }

                    lista = JsonConvert.DeserializeObject<List<AseguradoraEspecialidadUsuario>>(apiResponse);
                }
            }

            return lista;
        }

        public async Task<string> GetUsuarioEmpresa()
        {

            string config = string.Empty;
            try
            {
                var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                var host = GetHostValue(HttpContext.Request.Host.Value);
                var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/empresa/getUsuarioEmpresa/{idCliente}"))
                    {
                        config = await response.Content.ReadAsStringAsync();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }


            return config;
        }

        [HttpGet]
        public async Task<JsonResult> CambioIdClienteVip(string countryCode)
        {
            try
            {
                var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                ViewBag.uid = uid;
                var userr = User as ClaimsPrincipal;
                var identity = userr.Identity as ClaimsIdentity;
                var codigoTelefono = string.Empty;
                var horaInt = 0;

                string chile = _config["DEMO-CHILE"];
                string colombia = _config["DEMO-COLOMBIA"];
                string mexico = _config["DEMO-MEXICO"];

                IDictionary<string, string> map = new Dictionary<string, string>
                {
                    { "cl", chile },
                    { "co", colombia },
                    { "mx", mexico }
                };

                string idCliente = map.ContainsKey(countryCode) ? map[countryCode] : chile;

                if (idCliente == chile)
                {
                    codigoTelefono = "CL";
                    horaInt = -4;
                }
                else if (idCliente == colombia)
                {
                    codigoTelefono = "CO";
                    horaInt = -5;
                }
                else if (idCliente == mexico)
                {
                    codigoTelefono = "MX";
                    horaInt = -5;
                }
                else
                {
                    codigoTelefono = "CL";
                    horaInt = -4;
                }


                var claim = identity.FindFirst(ClaimTypes.PrimarySid);
                if (claim != null)
                {
                    identity.RemoveClaim(claim);
                    identity.AddClaim(new Claim(ClaimTypes.PrimarySid, idCliente));
                    // identity.AddClaim(new Claim("CodigoTelefono", codigoTelefono));

                }

                await HttpContext.SignInAsync($"PacienteSchemes",
                    new ClaimsPrincipal(new ClaimsIdentity(userr.Claims, "Cookies", "user", "role")),
                    new AuthenticationProperties
                    {
                        IsPersistent = true,
                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                    });

                using (var httpClient = new HttpClient())
                {
                    using var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/updateconvenioVip?uid={uid}&idCliente={idCliente}");
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }


                using (var httpClient = new HttpClient())
                {
                    using var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/updateZonaHorariaPersona?uid={uid}&zonaHoraria={horaInt}&codigoTelefono={codigoTelefono}");
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
                return Json("ok");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Json(new { msg = "Inactivo" });
            }
        }

        [HttpPost]
        [Route("ModalAgregarDireccion/{uid}/{tipo}")]
        public IActionResult ModalAgregarDireccion(
            [FromBody] PersonasViewModel paciente,
            [FromRoute] int uid,
            [FromRoute] string tipo
            )
        {
            var model = new ModalDirecciones
            {
                UserId = uid,
                Type = tipo,
                Patient = paciente
            };

            return PartialView("ModalAgregarDireccion", model);
        }
        [HttpPost]
        [Route("ModalAgregarDireccionPerfil/{uid}/{tipo}")]
        public IActionResult ModalAgregarDireccionPerfil(
        [FromBody] PersonasViewModel paciente,
        [FromRoute] int uid,
        [FromRoute] string tipo
        )
            {
                var model = new ModalDirecciones
                {
                    UserId = uid,
                    Type = tipo,
                    Patient = paciente
                };

                return PartialView("ModalAgregarDireccionPerfil", model);
        }
        [HttpPost]
        [Route("ModalSeleccionarDireccion/{uid}/{tipo}")]
        public async Task<IActionResult> ModalSeleccionarDireccion(
            [FromBody] PersonasViewModel paciente,
            [FromRoute] int uid,
            [FromRoute] string tipo
            )
        {
            try
            {
                IList<Address> direcciones = new List<Address>();

                using var httpClient = new HttpClient();
                using var response = await httpClient.GetAsync($"{_config["ServicesUrl"]}/usuarios/personas/getAddresses/{uid}/{tipo}");
                string apiResponse = await response.Content.ReadAsStringAsync();
                direcciones = JsonConvert.DeserializeObject<List<Address>>(apiResponse) ?? new List<Address>();

                if (direcciones.Count == 0)
                {
                    return StatusCode((int)HttpStatusCode.NoContent);
                }

                var model = new ModalDirecciones
                {
                    UserId = uid,
                    Type = tipo,
                    Addresses = direcciones,
                    Patient = paciente
                };

                return PartialView("ModalSeleccionarDireccion", model);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [Route("GetLibretaDireccionesCount/{uid}/{tipo}")]
        public async Task<int> GetLibretaDireccionesCount(

            [FromBody] PersonasViewModel paciente,
            [FromRoute] int uid,
            [FromRoute] string tipo)
        {
            try
            {
                using var httpClient = new HttpClient();
                using var response = await httpClient.GetAsync($"{_config["ServicesUrl"]}/usuarios/personas/getAddresses/{uid}/{tipo}");
                string apiResponse = await response.Content.ReadAsStringAsync();

                JArray jsonArray = JArray.Parse(apiResponse);
                int count = jsonArray.Count;


                return count;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener la cantidad de direcciones de la libreta: {ex.Message}");
                return 0;
            }
        }

        [HttpGet]
        [Route("GetCardsByUid/{uid}")]
        public async Task<IActionResult> GetCardsByUid(int uid)
        {
            using HttpClient pacienteHttpClient = new HttpClient();

            Task<HttpResponseMessage> pacienteTask = pacienteHttpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={uid}");

            string pacienteResponse = await pacienteTask.Result.Content.ReadAsStringAsync();
            PersonasViewModel paciente = JsonConvert.DeserializeObject<PersonasViewModel>(pacienteResponse);
            if (paciente != null)
            {
                if (paciente.rutaAvatar != null)
                {
                    paciente.rutaAvatar = paciente.rutaAvatar.Replace("\\", "/") ?? null;
                }
            }

            List<PaymentCardMercadoPago> tarjetas = new List<PaymentCardMercadoPago>();

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/PaymentCard/GetPaymentCardbyIdUser/{uid}/{paciente.CodigoTelefono}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        tarjetas = JsonConvert.DeserializeObject<List<PaymentCardMercadoPago>>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }
            DatosCardMercadopPago objTarjetasUsuario = new DatosCardMercadopPago();
            objTarjetasUsuario.tarjetas = tarjetas;
            objTarjetasUsuario.idUser = Convert.ToInt32(uid);
            objTarjetasUsuario.identificador = paciente.Identificador;
            objTarjetasUsuario.nombreUser = paciente.nombreCompleto;
            objTarjetasUsuario.email = paciente.Correo;
            objTarjetasUsuario.codigotelefono = paciente.CodigoTelefono;

            return Ok(objTarjetasUsuario);
        }

        [HttpGet]
        [Route("GetTimeLineDataCostoCero/{uid}/{idCliente}")]
        public async Task<IActionResult> GetTimeLineDataCostoCero(int uid, int idCliente)
        {
            List<VwHorasMedicos> horasAgendadasBloquesHoras;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }
            return Ok(horasAgendadasBloquesHoras);
        }

        [HttpGet]
        [Route("GetAtencionInterconsulta/{idAtencion}")]
        public async Task<IActionResult> GetAtencionInterconsulta(int idAtencion)
        {
            ViewBag.interconsultaGenerada = 0;

            using (var httpClient = new HttpClient())
            {

                AtencionesInterconsultas atencionesInterconsultas = new AtencionesInterconsultas();
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/AtencionesInterconsultas/getInterconsultasByIdAtencion/{idAtencion}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        atencionesInterconsultas = JsonConvert.DeserializeObject<AtencionesInterconsultas>(apiResponse);
                        if (atencionesInterconsultas != null)
                        {
                            ViewBag.interconsultaGenerada = atencionesInterconsultas.Id;
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }
            return Ok();
        }

        public IActionResult RecetaElectronica()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public IActionResult DirectorioVeterinario()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        class ConsultarTeledocRequest<T>
        {
            public String estado;
            public T data;
        }

        // LLAMADO A API DE TELEDOC
        public async Task<List<Atenciones>> ConsultarTeledoc(string username)
        {
            var atencionesActualizadas = new List<Atenciones>();
            try
            {
                using (var httpClient = new HttpClient())
                {
                   
                        var attentionUrl = $"https://api.medibuslive.com/prod/teledoc/GetAttentions?identificador={username}";

                        httpClient.DefaultRequestHeaders.Clear();
                        httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Host", "api.medibuslive.com");

                        var attentionResponse = await httpClient.GetAsync(attentionUrl);

                        if (attentionResponse.IsSuccessStatusCode)
                        {
                            var attentionResponseJson = await attentionResponse.Content.ReadAsStringAsync();
                            var consultasExternas = JsonConvert.DeserializeObject<ConsultarTeledocRequest<List<ConsultaTeledoc>>>(attentionResponseJson);
                            if (consultasExternas.estado.Equals("OK") )
                            foreach (var consultaExterna in consultasExternas.data)
                            {
                                var desde = consultaExterna.tsCreacion.Split("T")[1].Split(":");
                                var atencion = new Atenciones
                                {
                                    Id = consultaExterna.id_clienteMS,
                                    NombreMedico = consultaExterna.nombreDoctor,
                                    NombrePaciente = consultaExterna.nombrePaciente,
                                    //FechaText = String.Join("", consultaExterna.tsCreacion.Split("T")[0].Replace("-", "/").Reverse()),
                                    FechaText = DateTime.ParseExact(consultaExterna.tsCreacion, "yyyy-MM-ddTHH:mm:ss.FFFK", null).ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                                    //HoraDesdeText = ""+ desde[0]+":"+ desde[1],
                                    HoraDesdeText = DateTime.ParseExact(consultaExterna.tsCreacion, "yyyy-MM-ddTHH:mm:ss.FFFK", null).ToString("HH:mm", CultureInfo.InvariantCulture),
                                    Especialidad = consultaExterna.especialidad,
                                    //Fuente = "Teledoc",
                                    IdConsultaTeledoc = consultaExterna.idConsulta,
                                    username = username,
                                };

                                atencionesActualizadas.Add(atencion);
                            }
                        }
                    
                }
            }
            catch(Exception e)
            {
            
            }
            return atencionesActualizadas;
        }

        private async Task<AtencionesTeledocViewModel> ConsultarTeledoc(string username, string idConsulta)
        {
            using (var httpClient = new HttpClient())
            {

                    // Realizar la consulta al segundo endpoint usando el token obtenido
                    var detailedUrl = $"https://api.medibuslive.com/prod/teledoc/DetailsAttentions?attentionId={idConsulta}";
                    httpClient.DefaultRequestHeaders.Clear();
                    httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Host", "api.medibuslive.com");

                    var detailedResponse = await httpClient.GetAsync(detailedUrl);

                    if (detailedResponse.IsSuccessStatusCode)
                    {
                        var detailedResponseJson = await detailedResponse.Content.ReadAsStringAsync();
                        var res = JsonConvert.DeserializeObject<ConsultarTeledocRequest<AtencionesTeledocViewModel>>(detailedResponseJson);
                        AtencionesTeledocViewModel model = res.data;
                        // Actualizar URLs de archivos
                        foreach (var archivo in model.archivos)
                        {
                            archivo.url = $"https://api.medibuslive.com/prod/teledoc/FilesAttentions?idFile={archivo.idArchivo}&attentionId={model.idConsulta}";
                        }


                        return model;
                    }
                    else
                    {
                        // Error en la consulta al segundo endpoint
                        Console.WriteLine("Error en la consulta al segundo endpoint");
                    }
            }

            return null;
        }

        public async Task<ActionResult> ConsultaPresencialHAsync()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            List<VwHorasMedicos> horasAgendadasBloquesHoras;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            List<VwHorasMedicos> proximasHorasPaciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A3&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    proximasHorasPaciente = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { TimelineData = horasAgendadasBloquesHoras, ProximasHorasPaciente = proximasHorasPaciente };

            return View(atencionModel);
        }
        public async Task<ActionResult> ExamenPresencialHAsync()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            List<VwHorasMedicos> horasAgendadasBloquesHoras;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            List<VwHorasMedicos> proximasHorasPaciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A3&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    proximasHorasPaciente = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { TimelineData = horasAgendadasBloquesHoras, ProximasHorasPaciente = proximasHorasPaciente };

            return View(atencionModel);
        }
        public IActionResult DerivacionConsultaPresencial()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            AtencionViewModel atencionModel = new AtencionViewModel();

            return View(atencionModel);
        }
        public IActionResult DerivacionExamenPresencial()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            AtencionViewModel atencionModel = new AtencionViewModel();

            return View(atencionModel);
        }
    }
}


