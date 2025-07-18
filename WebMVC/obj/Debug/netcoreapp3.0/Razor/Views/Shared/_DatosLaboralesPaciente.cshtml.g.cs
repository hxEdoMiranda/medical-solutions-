#pragma checksum "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "e0a42a568a5163ed2a3892804cfcced9c909cd78"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Shared__DatosLaboralesPaciente), @"mvc.1.0.view", @"/Views/Shared/_DatosLaboralesPaciente.cshtml")]
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
#line 1 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
using Microsoft.Extensions.Configuration;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"e0a42a568a5163ed2a3892804cfcced9c909cd78", @"/Views/Shared/_DatosLaboralesPaciente.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"d07e873f05b36c9d83cd6a184d4bfbe1720fee4b", @"/Views/_ViewImports.cshtml")]
    #nullable restore
    public class Views_Shared__DatosLaboralesPaciente : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<WebMVC.Models.PersonasDatosLaboral>
    #nullable disable
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("id", new global::Microsoft.AspNetCore.Html.HtmlString("form_edit_perfil"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_1 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("type", new global::Microsoft.AspNetCore.Html.HtmlString("module"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
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
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper;
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.RenderAtEndOfFormTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper;
        private global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper;
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            WriteLiteral("\r\n\r\n");
            WriteLiteral("\r\n<div class=\"container-fluid\">\r\n    <div class=\"row\">\r\n        <div class=\"col p-0\">\r\n            <div class=\"nom035form_inner card-profile\">\r\n                ");
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("form", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "e0a42a568a5163ed2a3892804cfcced9c909cd784574", async() => {
                WriteLiteral(@"
                    <div class=""card-body py-0"">
                        <div class=""row"">
                            <div class=""col-lg-12"">
                                <h3>Datos Laborales</h3>
                                
                               <div class=""row"">
                                       <div class=""col"">
                                        <div class=""form-group"">
                                            <label class=""form-label"">Experiencia Laboral (Años) <span style=""color:red"">*</span></label>
                                            ");
#nullable restore
#line 22 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
                                       Write(Html.HiddenFor(m => m.IdPersona));

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                                            ");
#nullable restore
#line 23 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
                                       Write(Html.TextBoxFor(m => m.Experiencia_Laboral, new { @class = "form-control", maxlength = "2", required = "required", type = "number" , min = "0" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                        </div>
                                    </div>
                                    
                                    <div class=""col"">
                                        <div class=""form-group"">
                                            <label class=""form-label"">Fecha de ingreso Empresa<span style=""color:red"">*</span></label>
                                            ");
#nullable restore
#line 30 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
                                       Write(Html.TextBoxFor(m => m.Fecha_Ingreso, "{0:dd/MM/yyyy}", new { @class = "form-control", type = "text", required = "required" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                         </div>
                                    </div>
                                </div>
                                <div class=""row"">
                                        <div class=""col"">
                                        <div class=""form-group"">
                                         <label class=""form-label"">Area<span style=""color:red"">*</span></label>
                                            ");
#nullable restore
#line 38 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
                                       Write(Html.DropDownListFor(m => m.Id_Area, Model.ObtenerAreas(), new { @class = "form-control m-input",required = "required", title = "Ingresa tu Area" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                        </div>
                                    </div>
                                    <div class=""col"">
                                        <div class=""form-group"">
                                             <label class=""form-label"">Puesto<span style=""color:red"">*</span></label>
                                            ");
#nullable restore
#line 44 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
                                       Write(Html.DropDownListFor(m => m.Id_Puesto, Model.ObtenerPuestos(), new { @class = "form-control m-input", required = "required" , title = "Ingresa tu Puesto" }));

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                                        </div>\r\n                                    </div>\r\n                                </div>                                                             \r\n");
                WriteLiteral(@"                                <div class=""row"">
                                    <div class=""col"">
                                        <div class=""form-group"">
                                            <label class=""form-label"">Fecha de inicio función<span style=""color:red"">*</span></label>
                                            ");
#nullable restore
#line 66 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
                                       Write(Html.TextBoxFor(m => m.Fecha_Ingreso_Puesto, "{0:dd/MM/yyyy}", new { @class = "form-control", type = "text", required = "required", title = "Ingresa una fecha valida" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                        </div>
                                    </div>
                                    <div class=""col"">
                                        <div class=""form-group"">
                                            <label class=""form-label"">Tipo de Contrato<span style=""color:red"">*</span></label>
                                            ");
#nullable restore
#line 72 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
                                       Write(Html.DropDownListFor(m => m.Id_Tipo_Contrato, Model.ObtenerTipoContrato(), new { @class = "form-control m-input",required = "required", title = "Ingresa el tipo de contrato" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                        </div>
                                    </div>
                                </div>                               
                                <div class=""row"">
                                    <div class=""col"">
                                        <div class=""form-group"">
                                             <label class=""form-label"">Tipo de Jornada <span style=""color:red"">*</span></label>
                                            ");
#nullable restore
#line 80 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
                                       Write(Html.DropDownListFor(m => m.Id_Tipo_Jornada, Model.ObtenerTipoJornada(), new { @class = "form-control m-input",required = "required" , title = "Ingresa la Jornada"}));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                        </div>
                                    </div>
                                     <div class=""col"">
                                        <div class=""form-group"">
                                            <label class=""form-label"">Rotación de Turnos<span style=""color:red"">*</span></label>
                                            ");
#nullable restore
#line 86 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
                                       Write(Html.DropDownListFor(m => m.Rotacion_Turno, Model.ObtenerRotacionTurno(), new { @class = "form-control m-input",required = "required" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class=""row"">
                            <div class=""col cont-guardar-info"">
                                <button type=""submit"" id=""btn_guardar_info"" class=""btn btn-success btn-guardar-info"">Siguiente</button>
                            </div>
                        </div>
                    </div>
                ");
            }
            );
            __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper);
            __Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.RenderAtEndOfFormTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper);
            __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_0);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            WriteLiteral("\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<!--end::Nuevo Perfil-->\r\n\r\n\r\n\r\n");
            DefineSection("Scripts", async() => {
                WriteLiteral("\r\n    ");
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("script", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "e0a42a568a5163ed2a3892804cfcced9c909cd7813965", async() => {
                }
                );
                __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper);
                BeginAddHtmlAttributeValues(__tagHelperExecutionContext, "src", 2, global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
                AddHtmlAttributeValue("", 7204, "~/js/Usuario/config.js?9rnd=", 7204, 28, true);
#nullable restore
#line 111 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
AddHtmlAttributeValue("", 7232, NumeroRandom.GetRandom(), 7232, 25, false);

#line default
#line hidden
#nullable disable
                EndAddHtmlAttributeValues(__tagHelperExecutionContext);
                __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_1);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                WriteLiteral("\r\n    <script type=\"module\">\r\n        import { init } from \'../../js/Cuestionario/PacienteDatosLaboral.js\';\r\n        init(");
#nullable restore
#line 114 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
        Write(Html.Raw(Json.Serialize(Model)));

#line default
#line hidden
#nullable disable
                WriteLiteral(")\r\n    </script>\r\n    <script type=\"text/javascript\">\r\n        (function () {\r\n\r\n            var uid = ");
#nullable restore
#line 119 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
                 Write(ViewBag.uid);

#line default
#line hidden
#nullable disable
                WriteLiteral(";\r\n\r\n            window.uid = uid;\r\n             var idEdit = ");
#nullable restore
#line 122 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
                     Write(ViewBag.idEdit);

#line default
#line hidden
#nullable disable
                WriteLiteral(";\r\n                window.idEdit = idEdit;\r\n             var idCliente = \'");
#nullable restore
#line 124 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_DatosLaboralesPaciente.cshtml"
                         Write(ViewBag.idCliente);

#line default
#line hidden
#nullable disable
                WriteLiteral("\';\r\n            window.idCliente = idCliente;\r\n\r\n        })()\r\n    </script>\r\n");
            }
            );
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
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<WebMVC.Models.PersonasDatosLaboral> Html { get; private set; } = default!;
        #nullable disable
    }
}
#pragma warning restore 1591
