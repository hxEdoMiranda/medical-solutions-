#pragma checksum "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Paciente\ExamenesConsalud.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "bafe95b4c84f8cc7cfce7fe5686208fb0aadbd83"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Paciente_ExamenesConsalud), @"mvc.1.0.view", @"/Views/Paciente/ExamenesConsalud.cshtml")]
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
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"bafe95b4c84f8cc7cfce7fe5686208fb0aadbd83", @"/Views/Paciente/ExamenesConsalud.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"d07e873f05b36c9d83cd6a184d4bfbe1720fee4b", @"/Views/_ViewImports.cshtml")]
    #nullable restore
    public class Views_Paciente_ExamenesConsalud : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    #nullable disable
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("href", new global::Microsoft.AspNetCore.Html.HtmlString("~/css/medismart/main.css"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_1 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("rel", new global::Microsoft.AspNetCore.Html.HtmlString("stylesheet"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_2 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("type", new global::Microsoft.AspNetCore.Html.HtmlString("text/css"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
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
#line 4 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Paciente\ExamenesConsalud.cshtml"
  
    Layout = "_LayoutPaciente";

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n");
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("link", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.SelfClosing, "bafe95b4c84f8cc7cfce7fe5686208fb0aadbd834376", async() => {
            }
            );
            __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper);
            __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_0);
            __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_1);
            __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_2);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            WriteLiteral(@"

<div id=""solicitud-examenes-consalud"" class=""container-fluid cont-toma-examenes lab-blanco"">

    <div class=""row"">
        <div class=""col-12 col-md-auto"">

            <h1 class=""titulo-seccion d-md-none"">Asistencia Exámenes</h1>

            <div class=""card"">
                <h4>Datos personales</h4>
                <div class=""form-group"">
                    <label for=""nombre-completo"">Nombre completo</label>
                    <div class=""typeahead"">
                        <input class=""form-control validate"" id=""nombre-completo"" name=""nombre-completo"" />
                        <div class=""invalid-feedback"">
                            Campo obligatorio
                        </div>
                    </div>
                </div>
                <div class=""form-group"">
                    <label for=""exampleFormControlSelect1"">Fecha de nacimiento</label>
                    <div class=""typeahead"">
                        <input class=""form-control validate"" id=""fecha-na");
            WriteLiteral(@"cimiento"" name=""fecha-nacimiento"" />
                        <div class=""invalid-feedback"">
                            Ingresa una fecha válida
                        </div>
                    </div>
                </div>
                <div class=""form-group"">
                    <label for=""rut"">RUT</label>
                    <div class=""typeahead"">
                        <input class=""form-control validate"" id=""rut"" name=""rut"" />
                        <div class=""invalid-feedback"">
                            Ingresa un RUT válido
                        </div>
                    </div>
                </div>
                <div class=""form-group"">
                    <label for=""direccion"">Dirección</label>
                    <div class=""typeahead"">
                        <input class=""form-control validate"" id=""direccion"" name=""direccion"" />
                        <div class=""invalid-feedback"">
                            Campo obligatorio
                        </div>");
            WriteLiteral(@"
                    </div>
                </div>
                <div class=""form-group"">
                    <label for=""correo"">Correo</label>
                    <div class=""typeahead"">
                        <input class=""form-control validate"" id=""correo"" name=""correo"" />
                        <div class=""invalid-feedback"">
                            Ingresa un correo válido
                        </div>
                    </div>
                </div>
                <div class=""form-group"">
                    <label for=""telefono"">Teléfono</label>
                    <div class=""typeahead"">
                        <input class=""form-control validate"" id=""telefono"" name=""telefono"" />
                        <div class=""invalid-feedback"">
                            Campo obligatorio
                        </div>
                    </div>
                </div>
                <div class=""form-group"">
                    <label for=""orden"">Orden médica</label>
          ");
            WriteLiteral(@"          <div class=""typeahead"">
                        <input class=""form-control-file validate"" type=""file"" id=""orden"" name=""orden"" />
                        <div class=""invalid-feedback"">
                            Debes adjuntar la órden médica
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class=""col-12 col-md"">
            <div class=""acontent_box"">
                <div class=""acontent_ti"">
                    <div class=""cont-ilustracion""></div>
                    <!--<img src=""~/img/scotiabank/examenes/ilustracion.svg"" alt=""..."">-->
                    <h2>Te ayudamos a agendar tus exámenes</h2>
                </div>
                <div class=""box_tex"">
                    <p>
                        Selecciona los exámenes del listado.
                    </p>
                    <span  id=""mensaje-sin-examenes"" style=""display: none; color: red;"">Debe seleccionar al menos un examen del listado<");
            WriteLiteral(@"/span>
                </div>

                <div class=""cont-tabla table-responsive"">
                    <table id=""tabla-examenes"">
                        <thead>
                            <tr>
                                <th></th>
                                <th class=""text-left"">EXAMEN</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type=""checkbox"" name=""examenes"" value=""Hemograma"" /></td>
                                <td class=""text-left"">Hemograma</td>
                            </tr>
                            <tr>
                                <td><input type=""checkbox"" name=""examenes"" value=""Perfil lipídico"" /></td>
                                <td class=""text-left"">Perfil lipídico</td>
                            </tr>
                            <tr>
                                <td><input type=""checkbox"" name=""examenes"" ");
            WriteLiteral(@"value=""Antígeno prostático"" /></td>
                                <td class=""text-left"">Antígeno prostático</td>
                            </tr>
                            <tr>
                                <td><input type=""checkbox"" name=""examenes"" value=""Perfil bioquímico"" /></td>
                                <td class=""text-left"">Perfil bioquímico</td>
                            </tr>
                            <tr>
                                <td><input type=""checkbox"" name=""examenes"" value=""GGT ( gamma glutamil transferasa)"" /></td>
                                <td class=""text-left"">GGT ( gamma glutamil transferasa)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class=""nota-asistencia"">
                    <div class=""col-md-12"">
                        <button id=""btnsend"" class=""btn btn-primary"">Enviar</button>
                    </div>
                </div>
        ");
            WriteLiteral("    </div>\r\n\r\n\r\n");
            WriteLiteral("\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n\r\n\r\n\r\n");
            DefineSection("Scripts", async() => {
                WriteLiteral("\r\n    <script type=\"text/javascript\">\r\n        (function() {\r\n            var host = \'");
#nullable restore
#line 156 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Paciente\ExamenesConsalud.cshtml"
                   Write(ViewBag.HostURL);

#line default
#line hidden
#nullable disable
                WriteLiteral("\';\r\n            window.host = host;\r\n            var idCliente = \'");
#nullable restore
#line 158 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Paciente\ExamenesConsalud.cshtml"
                        Write(ViewBag.idCliente);

#line default
#line hidden
#nullable disable
                WriteLiteral("\';\r\n            window.idCliente = idCliente;\r\n        })();\r\n    </script>\r\n\r\n    <script type=\"module\">\r\n        import { init } from \'../../js/Paciente/examenesConsalud.js?rnd=");
#nullable restore
#line 164 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Paciente\ExamenesConsalud.cshtml"
                                                                   Write(NumeroRandom.GetRandom());

#line default
#line hidden
#nullable disable
                WriteLiteral("\';\r\n        init();\r\n    </script>\r\n");
            }
            );
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
