#pragma checksum "D:\PRODUCTOBASE001-FULL\WebMVC\Views\AsistenciaTomaExamenes\AsistenciaClinicaCaja.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "cf09511010faf04a2c742c6689ea01ec794b1b13"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_AsistenciaTomaExamenes_AsistenciaClinicaCaja), @"mvc.1.0.view", @"/Views/AsistenciaTomaExamenes/AsistenciaClinicaCaja.cshtml")]
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
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"cf09511010faf04a2c742c6689ea01ec794b1b13", @"/Views/AsistenciaTomaExamenes/AsistenciaClinicaCaja.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"d07e873f05b36c9d83cd6a184d4bfbe1720fee4b", @"/Views/_ViewImports.cshtml")]
    #nullable restore
    public class Views_AsistenciaTomaExamenes_AsistenciaClinicaCaja : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    #nullable disable
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            WriteLiteral("\r\n<div");
            BeginWriteAttribute("class", " class=\"", 129, "\"", 256, 2);
            WriteAttributeValue("", 137, "container-fluid", 137, 15, true);
#nullable restore
#line 5 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\AsistenciaTomaExamenes\AsistenciaClinicaCaja.cshtml"
WriteAttributeValue("  ", 152, !ViewBag.HostURL.Contains("masproteccionsalud.") ? "cont-toma-examenes" : "div-masproteccion-salud", 154, 102, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" \">\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-12 col-md-auto\">\r\n            \r\n                \r\n\r\n");
#nullable restore
#line 12 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\AsistenciaTomaExamenes\AsistenciaClinicaCaja.cshtml"
             if (!ViewBag.HostURL.Contains("masproteccionsalud."))
            {

#line default
#line hidden
#nullable disable
            WriteLiteral(@"                <div class=""title_cajaasistencia"">
                <p><b>¡Estamos contigo!</b></p>
                 <h2>Te ayudamos a agendar  tus <br /> exámenes médicos.</h2>
                </div>
                <div class=""card cdac"">


                    <form id=""form"">
                        <div class=""form-group-input"">
                            <label for=""exampleFormControlSelect1"">Selecciona el (los) exámen(es) a agendar:</label>
                            <div class=""card_box"">
                                <div class=""typeahead"">
                                    <input class=""form-control"" placeholder=""Buscar por palabra clave"" id=""input_codigoExamen_0"" type=""text"" dir=""ltr"">

                                </div>
                                <ul id=""listaTipoExamen""></ul>
                                <button id=""btnAdd"" class=""file-select"" />
                            </div>
                            <div class=""form-text text-muted"">Ingrese mínimo 3 cará");
            WriteLiteral(@"cteres y seleccione una opción</div>
                        </div>
                        <div class=""form-group"">
                            <label for=""exampleFormControlSelect1"">Selecciona tu región:</label>
                            <div class=""typeahead"">
                                <select class=""form-control"" id=""listaRegion"" name=""regiones"">
                                    <option value=""0"">Seleccionar...</option>
                                </select>
                            </div>
                        </div>
                        <div class=""form-group"">
                            <label for=""exampleFormControlSelect1"">Selecciona tu comuna:</label>
                            <div class=""typeahead"">
                                <select class=""form-control"" id=""listaComunas"" name=""comunas"">
                                    <option value=""0"">Seleccionar...</option>
                                </select>
                            </div>
            ");
            WriteLiteral("            </div>\r\n                    </form>\r\n                </div>\r\n");
#nullable restore
#line 52 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\AsistenciaTomaExamenes\AsistenciaClinicaCaja.cshtml"
            }

#line default
#line hidden
#nullable disable
            WriteLiteral("            \r\n        </div>\r\n        <div class=\"");
#nullable restore
#line 55 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\AsistenciaTomaExamenes\AsistenciaClinicaCaja.cshtml"
                Write(!ViewBag.HostURL.Contains("masproteccionsalud.") ? "col-12 col-md" : "div-masproteccion-salud");

#line default
#line hidden
#nullable disable
            WriteLiteral(@""">
            <div class=""acontent_box"">
               <div class=""acontent_ti"">
                    <div class=""cont-ilustracion-ccd""></div>
                </div>
               <div class=""box_tex"">
                    <p>En nuestro Centro de Atención, podrás agendar de forma simple y rápida, tus exámenes médicos. Dinos qué fecha prefieres, el lugar que más te acomode para encontrar una hora y un laboratorio o centro médico, perfecto para tus necesidades. </p>
                    <p><strong>Contáctanos directamente pinchando acá:</strong></p>
                </div>
                <div class=""nota-asistencia"">
                    <div class=""col-md-6"">
                       
                        <a class=""btn btn-primary ");
#nullable restore
#line 67 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\AsistenciaTomaExamenes\AsistenciaClinicaCaja.cshtml"
                                              Write("nroPlan="+ViewBag.idCliente);

#line default
#line hidden
#nullable disable
            WriteLiteral("\" href=\"tel:");
#nullable restore
#line 67 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\AsistenciaTomaExamenes\AsistenciaClinicaCaja.cshtml"
                                                                                        Write(ViewBag.Numero);

#line default
#line hidden
#nullable disable
            WriteLiteral("\">Llamar</a>\r\n                           <small class=\"data-asistencia\">\r\n                            Llamarás directamente al <br />\r\n                            ");
#nullable restore
#line 70 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\AsistenciaTomaExamenes\AsistenciaClinicaCaja.cshtml"
                       Write(ViewBag.Numero);

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n                        </small>\r\n                    </div>\r\n                    \r\n");
#nullable restore
#line 74 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\AsistenciaTomaExamenes\AsistenciaClinicaCaja.cshtml"
                     if (!ViewBag.HostURL.Contains("masproteccionsalud.") && !ViewBag.HostURL.Contains("clinicamundoscotia."))
                    {

#line default
#line hidden
#nullable disable
            WriteLiteral("                        <div class=\"col-md-6\">\r\n                            <button id=\"btnAsistencia\" class=\"btn btn-primary\">Videollamada</button>\r\n                        </div>\r\n");
#nullable restore
#line 79 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\AsistenciaTomaExamenes\AsistenciaClinicaCaja.cshtml"
                    }

#line default
#line hidden
#nullable disable
            WriteLiteral("                </div>\r\n            </div>\r\n\r\n           \r\n");
            WriteLiteral("            \r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n            ");
        }
        #pragma warning restore 1998
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
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; } = default!;
        #nullable disable
    }
}
#pragma warning restore 1591
