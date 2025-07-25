#pragma checksum "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "61a5ff5b5844e007e9923bb44ab9b72332e41c9b"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Medico_InformeTeledoc), @"mvc.1.0.view", @"/Views/Medico/InformeTeledoc.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\_ViewImports.cshtml"
using WebMVC;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\_ViewImports.cshtml"
using WebMVC.Models;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
using Microsoft.Extensions.Configuration;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"61a5ff5b5844e007e9923bb44ab9b72332e41c9b", @"/Views/Medico/InformeTeledoc.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"d07e873f05b36c9d83cd6a184d4bfbe1720fee4b", @"/Views/_ViewImports.cshtml")]
    #nullable restore
    public class Views_Medico_InformeTeledoc : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<AtencionesTeledocViewModel>
    #nullable disable
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("rel", new global::Microsoft.AspNetCore.Html.HtmlString("stylesheet"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_1 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("type", new global::Microsoft.AspNetCore.Html.HtmlString("text/css"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_2 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("src", new global::Microsoft.AspNetCore.Html.HtmlString("~/metronic_demo7/assets/media/sinResultado.PNG"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        #line hidden
        #pragma warning disable 0649
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperExecutionContext __tagHelperExecutionContext;
        #pragma warning restore 0649
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner __tagHelperRunner = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner();
        #pragma warning disable 0169
        private string __tagHelperStringValueBuffer;
        #pragma warning restore 0169
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __backed__tagHelperScopeManager = null;
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __tagHelperScopeManager
        {
            get
            {
                if (__backed__tagHelperScopeManager == null)
                {
                    __backed__tagHelperScopeManager = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager(StartTagHelperWritingScope, EndTagHelperWritingScope);
                }
                return __backed__tagHelperScopeManager;
            }
        }
        private global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper;
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#nullable restore
#line 4 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
  
    ViewData["Title"] = "InformeTeledoc";
    Layout = "_Layout";

    var archivoOrientacion = "SIN-ATENCIONES";
    if (ViewBag.idEspecialidad == 77)
    {
        archivoOrientacion = "ATENCIONES-CERTIFICADOS"; // ESTE CODIGO ENTIDAD NO EXISTE, SE USA PARA QUE HAGA NADA EL FILTRO CUANDO NO ES ORIENTACION
    }

    var hiddenAchs = string.Empty;
    var isAchs = false;
    if (ViewBag.HostURL.ToString().Contains("achs."))
    {
        isAchs = true;
        hiddenAchs = "hidden";
    }

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n");
            DefineSection("Styles", async() => {
                WriteLiteral("\r\n    ");
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("link", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.SelfClosing, "61a5ff5b5844e007e9923bb44ab9b72332e41c9b5156", async() => {
                }
                );
                __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper);
                BeginAddHtmlAttributeValues(__tagHelperExecutionContext, "href", 2, global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
                AddHtmlAttributeValue("", 672, "~/css/Home/index.css?rnd=", 672, 25, true);
#nullable restore
#line 24 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
AddHtmlAttributeValue("", 697, NumeroRandom.GetRandom(), 697, 25, false);

#line default
#line hidden
#nullable disable
                EndAddHtmlAttributeValues(__tagHelperExecutionContext);
                __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_0);
                __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_1);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                WriteLiteral("\r\n");
            }
            );
            WriteLiteral(@"
<!-- begin:: Subheader -->
<!-- begin:: Content -->
<div class=""kt-container kt-container--fluid kt-grid__item kt-grid__item--fluid"">
    <div class=""kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app"">
        <!--Begin:: App Aside Mobile Toggle-->
        <button class=""kt-app__aside-close"" id=""kt_user_profile_aside_close"">
            <i class=""la la-close""></i>
        </button>


        <div class=""container-fluid cont-informe"" style=""overflow-x: hidden;"">
            <div class=""row"">
                <div class=""col-12 col-md-auto"">
                    <h3 class=""mb-3 titulo-seccion titulo-informe"">Resumen de Atención</h3>
                    <div class=""card-informe informe""");
            BeginWriteAttribute("style", " style=\"", 1486, "\"", 1535, 2);
            WriteAttributeValue("", 1494, "height:", 1494, 7, true);
#nullable restore
#line 41 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
WriteAttributeValue(" ", 1501, isAchs ? "auto" : string.Empty, 1502, 33, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(">\r\n                        <div class=\"container-fluid\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col-12 col-md columna-paciente scrollable\">\r\n                                    ");
#nullable restore
#line 45 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                               Write(Html.Hidden("uid", (object)ViewBag.uid));

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n                                    ");
#nullable restore
#line 46 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                               Write(Html.HiddenFor(m => m.idPaciente));

#line default
#line hidden
#nullable disable
            WriteLiteral(@"
                                    <!--Paciente-->
                                    <div class=""item-resumen"">
                                        <div class=""legend-resumen"">
                                            Paciente
                                        </div>
                                        <div class=""info-resumen"">
                                            <div class=""nombre-paciente"">
                                                <p>Nombre del paciente</p>
                                            </div>
                                            <div class=""rut-paciente"">
                                                ");
#nullable restore
#line 57 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                           Write(Model.idPaciente);

#line default
#line hidden
#nullable disable
            WriteLiteral(@"
                                            </div>
                                        </div>
                                    </div>
                                    <!--Paciente-->
                                    <!--Profesional-->
                                    <div class=""item-resumen"">
                                        <div class=""legend-resumen"">
                                            Profesional
                                        </div>
                                        <div class=""info-resumen"">
                                            <div class=""nombre-profesional"">
                                                ");
#nullable restore
#line 69 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                           Write(Model.nombreDoctor);

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n                                            </div>\r\n                                            <div class=\"especialidad\">\r\n                                                ");
#nullable restore
#line 72 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                           Write(Model.especialidad);

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n                                            </div>\r\n                                            <!--HORA DE LA ATENCION-->\r\n                                                <div class=\"especialidad\">\r\n                                                    ");
#nullable restore
#line 76 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                               Write(Model.tsCreacion);

#line default
#line hidden
#nullable disable
            WriteLiteral(@"
                                                </div>
                                            
                                        </div>
                                    </div>
                                    <!--Profesional-->
                                    <!--Motivo de consulta-->
                                    <div class=""item-resumen"">
                                        <div class=""legend-resumen"">
                                            Motivo de la consulta
                                        </div>
                                        <div class=""info-resumen"">
                                            <div class=""nombre-paciente"">
                                                ");
#nullable restore
#line 89 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                           Write(Model.motivoConsulta);

#line default
#line hidden
#nullable disable
            WriteLiteral(@"
                                            </div>
                                        </div>
                                    </div>
                                    <!--Diagnóstico-->
                                    <div class=""item-resumen"" ");
#nullable restore
#line 94 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                         Write(hiddenAchs);

#line default
#line hidden
#nullable disable
            WriteLiteral(@">
                                        <div class=""legend-resumen"">
                                            Diagnóstico
                                        </div>
                                        <div class=""info-resumen"">
                                            <span class=""kt-widget1__desc"">
");
#nullable restore
#line 100 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                 if (Model.ficha_medica.diagnostico != null)
                                                {
                                                    

#line default
#line hidden
#nullable disable
#nullable restore
#line 102 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                               Write(Model.ficha_medica.diagnostico);

#line default
#line hidden
#nullable disable
#nullable restore
#line 102 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                                                   
                                                }
                                                else
                                                {
                                                    

#line default
#line hidden
#nullable disable
            WriteLiteral(" <!-- Muestra un espacio en blanco si diagnostico es null -->\r\n");
#nullable restore
#line 107 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                }

#line default
#line hidden
#nullable disable
            WriteLiteral(@"                                            </span>
                                        </div>
                                    </div>
                                    <!--Diagnóstico-->
                                    <!--Anamnesis/Hipótesis diagnóstica-->
                                    <div class=""item-resumen"" ");
#nullable restore
#line 113 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                         Write(hiddenAchs);

#line default
#line hidden
#nullable disable
            WriteLiteral(@">
                                        <div class=""legend-resumen"">
                                            Anamnesis próxima
                                        </div>
                                        <div class=""info-resumen"">
                                            ");
#nullable restore
#line 118 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                       Write(Model.ficha_medica.anamnesis_proxima);

#line default
#line hidden
#nullable disable
            WriteLiteral(@"
                                        </div>
                                    </div>
                                    <!--Anamnesis/Hipótesis diagnóstica-->
                                    <!--Indicaciones-->
                                    <div class=""item-resumen"" ");
#nullable restore
#line 123 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                         Write(hiddenAchs);

#line default
#line hidden
#nullable disable
            WriteLiteral(@">
                                        <div class=""legend-resumen"">
                                            Indicación o Plan
                                        </div>
                                        <div class=""info-resumen"">
                                            ");
#nullable restore
#line 128 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                       Write(Model.ficha_medica.indicaciones);

#line default
#line hidden
#nullable disable
            WriteLiteral(@"
                                        </div>
                                    </div>
                                    <!--Indicaciones-->
                                    <!--Control-->
                                    <div class=""item-resumen"" ");
#nullable restore
#line 133 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                         Write(hiddenAchs);

#line default
#line hidden
#nullable disable
            WriteLiteral(@">
                                        <div class=""legend-resumen"">
                                            Control
                                        </div>
                                        <div class=""info-resumen"">
                                        </div>
                                    </div>

                                    <!--Control-->
                                    <div class=""item-resumen"" ");
#nullable restore
#line 142 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                         Write(hiddenAchs);

#line default
#line hidden
#nullable disable
            WriteLiteral(@">
                                        <div class=""legend-resumen"">
                                            Resumen última consulta:
                                        </div>
                                        <div class=""info-resumen"">
                                            <div>
                                                <p class=""legend-resumen"" style=""display: inline;"">- Dia</p>
                                                <span class=""no-legend-resumen"" style=""display: inline;"">");
#nullable restore
#line 149 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                                                                    Write(Model.tsCreacion);

#line default
#line hidden
#nullable disable
            WriteLiteral(@"</span>
                                            </div>
                                            <div>
                                                <p class=""legend-resumen"" style=""display: inline;"">- Tratante</p>
                                                <span class=""no-legend-resumen"" style=""display: inline;"">");
#nullable restore
#line 153 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                                                                    Write(Model.nombreDoctor);

#line default
#line hidden
#nullable disable
            WriteLiteral("</span>\r\n                                            </div>\r\n\r\n                                        </div>\r\n                                    </div>\r\n  \r\n");
#nullable restore
#line 159 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                     if (ViewData["view"].Equals(Roles.Medico))
                                    {

#line default
#line hidden
#nullable disable
            WriteLiteral("                                        <div class=\"item-resumen\" ");
#nullable restore
#line 161 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                             Write(hiddenAchs);

#line default
#line hidden
#nullable disable
            WriteLiteral(@">
                                            <div class=""legend-resumen"">
                                                <p>Observaciones</p>
                                            </div>
                                            <div class=""info-resumen"">
                                                ");
#nullable restore
#line 166 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                           Write(Model.ficha_medica.diagnostico_observaciones);

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n                                            </div>\r\n                                        </div>\r\n");
#nullable restore
#line 169 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                    }

#line default
#line hidden
#nullable disable
            WriteLiteral(@"                                </div>


                                <!-- CONFIGURACION DEL ARCHIVO ------------------------------------------------------------------------------------------->

                                <div class=""col-12 col-md columna-archivos"" style=""border-left: 1px dashed #C4ECF0; "">
                                    <div class=""legend-resumen"" ");
#nullable restore
#line 176 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                           Write(hiddenAchs);

#line default
#line hidden
#nullable disable
            WriteLiteral(">\r\n                                        Archivos de la Atenci&oacute;n\r\n                                    </div>\r\n\r\n");
#nullable restore
#line 180 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                     if (Model.archivos.ToList().Count == 0)
                                    {

#line default
#line hidden
#nullable disable
            WriteLiteral(@"                                        <div id=""pnlArchivos"" class=""align-self-center"" style=""display:block"">
                                            <div class=""row"">
                                                <div class=""col-lg-12 kt-align-center"">
                                                    ");
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("img", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.SelfClosing, "61a5ff5b5844e007e9923bb44ab9b72332e41c9b23103", async() => {
            }
            );
            __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper);
            __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_2);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            WriteLiteral(@"
                                                </div>
                                            </div>
                                            <div class=""row"">
                                                <div class=""col-lg-12 text-center"" ");
#nullable restore
#line 189 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                                              Write(hiddenAchs);

#line default
#line hidden
#nullable disable
            WriteLiteral(@">
                                                    <h5>No existen archivos asociados a esta atención.</h5>
                                                </div>
                                            </div>
                                        </div>
");
#nullable restore
#line 194 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                    }
                                    else
                                    {
                                        

#line default
#line hidden
#nullable disable
#nullable restore
#line 197 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                         if (ViewData["view"].Equals(Roles.Medico) || ViewData["view"].Equals(Roles.Administrador))
                                        {
                                            

#line default
#line hidden
#nullable disable
#nullable restore
#line 199 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                             foreach (var archivo in Model.archivos.Where(x => x.nombreArchivo != null))
                                            {

#line default
#line hidden
#nullable disable
            WriteLiteral("                                                <div class=\"archivos-atencion\">\r\n\r\n                                                    <ul>\r\n");
#nullable restore
#line 204 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                         if (archivo.nombreArchivo != null)
                                                        {

#line default
#line hidden
#nullable disable
            WriteLiteral("                                                            <li>\r\n                                                                <div class=\"tipo-archivo\">\r\n                                                                    ");
#nullable restore
#line 208 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                               Write(archivo.nombreArchivo);

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n                                                                </div>\r\n                                                                <a");
            BeginWriteAttribute("href", " href=\"", 12182, "\"", 12201, 1);
#nullable restore
#line 210 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
WriteAttributeValue("", 12189, archivo.url, 12189, 12, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(@" class=""btn-archivo"" style=""text-decoration: none;"">
                                                                    <i class=""fal fa-file-pdf""></i>
                                                                </a>
                                                            </li>
");
#nullable restore
#line 214 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                        }
                                                        else if (archivo.nombreArchivo != null)
                                                        {

#line default
#line hidden
#nullable disable
            WriteLiteral("                                                            <li>\r\n                                                                <div class=\"tipo-archivo\">\r\n                                                                    ");
#nullable restore
#line 219 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                               Write(archivo.nombreArchivo);

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n                                                                </div>\r\n                                                                <button");
            BeginWriteAttribute("onclick", " onclick=\"", 13102, "\"", 13140, 3);
            WriteAttributeValue("", 13112, "location.href=\'", 13112, 15, true);
#nullable restore
#line 221 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
WriteAttributeValue("", 13127, archivo.url, 13127, 12, false);

#line default
#line hidden
#nullable disable
            WriteAttributeValue("", 13139, "\'", 13139, 1, true);
            EndWriteAttribute();
            WriteLiteral(@" class=""btn-archivo"" style="" background-color: transparent;  border-radius: 4px;  color: #285394;"">
                                                                    <i class=""fal fa-file-word""></i>
                                                                </button>
                                                            </li>
");
#nullable restore
#line 225 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                        }
                                                        else
                                                        {

#line default
#line hidden
#nullable disable
            WriteLiteral("                                                            <li>\r\n                                                                <div class=\"tipo-archivo\">\r\n                                                                    ");
#nullable restore
#line 230 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                               Write(archivo.nombreArchivo);

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n                                                                </div>\r\n                                                                <a");
            BeginWriteAttribute("href", " href=\"", 14054, "\"", 14073, 1);
#nullable restore
#line 232 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
WriteAttributeValue("", 14061, archivo.url, 14061, 12, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(@" class=""btn-archivo"" style=""text-decoration: none;"">
                                                                    <i class=""fal fa-file-pdf""></i>
                                                                </a>
                                                            </li>
");
#nullable restore
#line 236 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                        }

#line default
#line hidden
#nullable disable
            WriteLiteral("                                                    </ul>\r\n                                                    <p class=\"kt-widget4__text\">\r\n                                                        ");
#nullable restore
#line 239 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                   Write(archivo.nombreArchivo);

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n                                                    </p>\r\n                                                </div>\r\n");
#nullable restore
#line 242 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                            }

#line default
#line hidden
#nullable disable
#nullable restore
#line 242 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                             
                                        }
                                        else
                                        {
                                            

#line default
#line hidden
#nullable disable
#nullable restore
#line 246 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                             foreach (var archivo in Model.archivos)
                                            {

#line default
#line hidden
#nullable disable
            WriteLiteral("                                                <div class=\"archivos-atencion\">\r\n\r\n                                                    <ul>\r\n");
#nullable restore
#line 251 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                         if (archivo.nombreArchivo != null)
                                                        {

#line default
#line hidden
#nullable disable
            WriteLiteral("                                                            <li>\r\n                                                                <div class=\"tipo-archivo\">\r\n                                                                    ");
#nullable restore
#line 255 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                               Write(archivo.nombreArchivo);

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n                                                                </div>\r\n                                                                <button");
            BeginWriteAttribute("onclick", " onclick=\"", 15758, "\"", 15796, 3);
            WriteAttributeValue("", 15768, "location.href=\'", 15768, 15, true);
#nullable restore
#line 257 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
WriteAttributeValue("", 15783, archivo.url, 15783, 12, false);

#line default
#line hidden
#nullable disable
            WriteAttributeValue("", 15795, "\'", 15795, 1, true);
            EndWriteAttribute();
            WriteLiteral(@" class=""btn-archivo"">
                                                                    <i class=""fal fa-file-pdf""></i>
                                                                </button>
                                                            </li>
");
#nullable restore
#line 261 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                                        }

#line default
#line hidden
#nullable disable
            WriteLiteral("                                                    </ul>\r\n                                                </div>\r\n");
#nullable restore
#line 264 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                            }

#line default
#line hidden
#nullable disable
#nullable restore
#line 264 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                             
                                        }

#line default
#line hidden
#nullable disable
#nullable restore
#line 265 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\InformeTeledoc.cshtml"
                                         
                                    }

#line default
#line hidden
#nullable disable
            WriteLiteral(@"
                                </div>
                                <!---------------  FIN DE LA CONFIGURACION ------------------------------------------------------------------------------------->

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
");
        }
        #pragma warning restore 1998
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public IConfiguration Configuration { get; private set; } = default!;
        #nullable disable
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; } = default!;
        #nullable disable
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; } = default!;
        #nullable disable
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; } = default!;
        #nullable disable
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; } = default!;
        #nullable disable
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<AtencionesTeledocViewModel> Html { get; private set; } = default!;
        #nullable disable
    }
}
#pragma warning restore 1591
