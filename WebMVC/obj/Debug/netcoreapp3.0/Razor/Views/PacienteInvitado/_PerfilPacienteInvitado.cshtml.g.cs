#pragma checksum "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "4fa380355b3c881cdaeb6240fb42f0bb49f8ada0"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_PacienteInvitado__PerfilPacienteInvitado), @"mvc.1.0.view", @"/Views/PacienteInvitado/_PerfilPacienteInvitado.cshtml")]
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
#line 1 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
using Microsoft.Extensions.Configuration;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"4fa380355b3c881cdaeb6240fb42f0bb49f8ada0", @"/Views/PacienteInvitado/_PerfilPacienteInvitado.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"d07e873f05b36c9d83cd6a184d4bfbe1720fee4b", @"/Views/_ViewImports.cshtml")]
    #nullable restore
    public class Views_PacienteInvitado__PerfilPacienteInvitado : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<WebMVC.Models.PersonasViewModel>
    #nullable disable
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("id", new global::Microsoft.AspNetCore.Html.HtmlString("form_edit_perfil"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_1 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("class", new global::Microsoft.AspNetCore.Html.HtmlString("kt-form kt-form--label-right"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_2 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("type", new global::Microsoft.AspNetCore.Html.HtmlString("module"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
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
            WriteLiteral("\r\n\r\n<!--Nuevo Perfil-->\r\n\r\n<div class=\"container-fluid\">\r\n    <div class=\"row\">\r\n        <div class=\"col p-0\">\r\n            <div class=\"card card-profile\">\r\n                ");
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("form", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "4fa380355b3c881cdaeb6240fb42f0bb49f8ada04979", async() => {
                WriteLiteral(@"
                    <div class=""card-body py-0"">
                        <div class=""row"">
                            <div class=""col-12 col-lg-6 pr-md-5"">
                                <h3>Datos personales</h3>

                     

                     

                                <div class=""form-group"">
                                    <label class=""form-label"">Nombres <span style=""color:red"">*</span></label>
                                    ");
#nullable restore
#line 24 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                               Write(Html.TextBoxFor(m => m.Nombre, new { @class = "form-control", maxlength = "50", required = "required" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                </div>

                                <div class=""form-group"">
                                    <label class=""form-label"">Apellido paterno <span style=""color:red"">*</span></label>
                                    ");
#nullable restore
#line 29 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                               Write(Html.TextBoxFor(m => m.ApellidoPaterno, new { @class = "form-control", maxlength = "50", required = "required" }));

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                                </div>\r\n\r\n                                <div class=\"form-group\">\r\n                                    <label class=\"form-label\">Apellido materno</label>\r\n                                    ");
#nullable restore
#line 34 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                               Write(Html.TextBoxFor(m => m.ApellidoMaterno, new { @class = "form-control", maxlength = "50" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                </div>



                                <div class=""form-group datos-identidad"">
                                    <div class=""row"">
                                        <div class=""col"">
                                            <label class=""form-label"">");
#nullable restore
#line 42 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                                                  Write("CL" == "CO" ? "Documento de identidad" : "Cédula de identidad");

#line default
#line hidden
#nullable disable
                WriteLiteral("</label>\r\n");
#nullable restore
#line 43 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                             if (ViewData["view"].Equals(Roles.PacienteInvitado))
                                            {
                                                

#line default
#line hidden
#nullable disable
#nullable restore
#line 45 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                           Write(Html.TextBoxFor(m => m.Identificador, new { @class = "form-control", maxlength = "12", required = "required", disabled = "disabled" }));

#line default
#line hidden
#nullable disable
#nullable restore
#line 46 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                           Write(Html.HiddenFor(m => m.Identificador));

#line default
#line hidden
#nullable disable
#nullable restore
#line 46 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                                                                     
                                            }
                                            else
                                            {
                                                

#line default
#line hidden
#nullable disable
#nullable restore
#line 50 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                           Write(Html.TextBoxFor(m => m.Identificador, new { @class = "form-control", maxlength = "12", required = "required", id = "identificador" }));

#line default
#line hidden
#nullable disable
#nullable restore
#line 50 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                                                                                                                                                                      
                                            }

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                                            ");
#nullable restore
#line 53 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                       Write(Html.Hidden("idEntidad", ViewData["idEntidad"]));

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                                            ");
#nullable restore
#line 54 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                       Write(Html.Hidden("codEntidad", ViewData["codEntidad"]));

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                                            ");
#nullable restore
#line 55 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                       Write(Html.Hidden("uid", (object)ViewBag.uid));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                        </div>                                      
                                    </div>
                                </div>
                                <div class=""form-group"">
                                    <label class=""form-label"">Género <span style=""color:red"">*</span></label>
");
                WriteLiteral(@"                                
                                 </div>
                                <div class=""form-group"">
                                    <label class=""form-label"">Correo <span style=""color:red"">*</span></label>									
										");
#nullable restore
#line 66 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                   Write(Html.TextBoxFor(m => m.Correo, new { @class = "form-control", type = "text", required = "required", maxlength = "100" }));

#line default
#line hidden
#nullable disable
                WriteLiteral("\t\t\t\t\t\r\n                                </div> \r\n");
#nullable restore
#line 68 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                if (ViewData["view"].Equals(Roles.PacienteInvitado))
                                {

                                }
                                else
                                {

#line default
#line hidden
#nullable disable
                WriteLiteral(@"                                    <div class=""form-group"">
                                        <label class=""form-label"">Convenio</label>
                                        <select name=""convenio"" id=""convenio"" class=""form-control show-tick ms select2"" multiple data-placeholder=""Select""></select>
");
                WriteLiteral("                                    </div>\r\n");
#nullable restore
#line 79 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                }

#line default
#line hidden
#nullable disable
                WriteLiteral(@"                            <div class=""col-12 col-lg-6 pl-md-5 columna-datos-contacto"">
                                                                                          
                      
                            </div>


                        </div>
                        <div class=""row"">
                            <div class=""col cont-guardar-info"">
                                <button type=""submit"" id=""btn_guardar_info"" class=""btn btn-success btn-guardar-info"">Guardar</button>
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
            WriteLiteral(@"
            </div>

        </div>
    </div>
</div>

<!--end::Nuevo Perfil-->

<div class=""kt-portlet d-none"">
    <div class=""kt-portlet__head"">
        <div class=""kt-portlet__head-label"">
            <h3 class=""kt-portlet__head-title"" metadata=""configuracionPerfilTitle"">Información Personal</h3>
        </div>

    </div>
    ");
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("form", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "4fa380355b3c881cdaeb6240fb42f0bb49f8ada015369", async() => {
                WriteLiteral(@"
        <div class=""kt-portlet__body"">
            <div class=""kt-section kt-section--first mb-0"">
                <div class=""kt-section__body"">


                    <div class=""row"">
                        <div class=""col-md-auto"">
                            <div class=""row"">
                                <div class=""col-lg-12 mb-4"">
                                    <div class=""row"">


                                        <div class=""col-lg-12 col-xl-12 text-center"">

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class=""col-md"">

                            <!--Nuevo layout de formulario-->

                            <h5 class=""label-title mb-4"" metadata=""configuracionDatosTitle"">Datos Personales</h5>

                            <div class=""form-group row mb-4"">
                         ");
                WriteLiteral("       <div class=\"col-12 col-md mb-4 mb-md-0\">\r\n                                    <label class=\"form-label\"><span metadata=\"configuracionDatosNombre\">Nombres </span><span style=\"color:red\">*</span></label>\r\n                                    ");
#nullable restore
#line 140 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                               Write(Html.TextBoxFor(m => m.Nombre, new { @class = "form-control", maxlength = "50", required = "required" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                </div>
                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                    <label class=""form-label""><span metadata=""configuracionDatosApellido"">Apellido paterno </span><span style=""color:red"">*</span></label>
                                    ");
#nullable restore
#line 144 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                               Write(Html.TextBoxFor(m => m.ApellidoPaterno, new { @class = "form-control", maxlength = "50", required = "required" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                </div>
                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                    <label class=""form-label"" metadata=""configuracionDatosApellido2"">Apellido materno</label>
                                    ");
#nullable restore
#line 148 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                               Write(Html.TextBoxFor(m => m.ApellidoMaterno, new { @class = "form-control", maxlength = "50" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                </div>
                            </div>

                            <div class=""form-group row mb-4"">
                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                    <label class=""form-label"" metadata=""configuracionDatosDni"">Cédula de Identidad</label>
");
#nullable restore
#line 155 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                     if (ViewData["view"].Equals(Roles.PacienteInvitado))
                                    {
                                        

#line default
#line hidden
#nullable disable
#nullable restore
#line 157 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                   Write(Html.TextBoxFor(m => m.Identificador, new { @class = "form-control", maxlength = "12", required = "required", disabled = "disabled" }));

#line default
#line hidden
#nullable disable
#nullable restore
#line 158 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                   Write(Html.HiddenFor(m => m.Identificador));

#line default
#line hidden
#nullable disable
#nullable restore
#line 158 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                                                             
                                    }
                                    else
                                    {
                                        

#line default
#line hidden
#nullable disable
#nullable restore
#line 162 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                   Write(Html.TextBoxFor(m => m.Identificador, new { @class = "form-control", maxlength = "12", required = "required", id = "identificador" }));

#line default
#line hidden
#nullable disable
#nullable restore
#line 163 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                   Write(Html.HiddenFor(m => m.Identificador));

#line default
#line hidden
#nullable disable
#nullable restore
#line 163 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                                                             
                                    }

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                                    ");
#nullable restore
#line 166 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                               Write(Html.Hidden("idEntidad", ViewData["idEntidad"]));

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                                    ");
#nullable restore
#line 167 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                               Write(Html.Hidden("codEntidad", ViewData["codEntidad"]));

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                                    ");
#nullable restore
#line 168 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                               Write(Html.Hidden("IdCliente", ViewData["uid"]));

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                                    ");
#nullable restore
#line 169 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                               Write(Html.Hidden("uid", (object)ViewBag.uid));

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                                    ");
#nullable restore
#line 170 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                               Write(Html.Hidden("IdCentroClinico", (object)ViewBag.IdCentroClinico));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                </div>
                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                    <label class=""form-label"" metadata=""configuracionDatosNacimiento"">Fecha de nacimiento</label>
                                    ");
#nullable restore
#line 174 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                               Write(Html.TextBoxFor(m => m.FNacimiento, "{0:dd/MM/yyyy}", new { @class = "form-control", type = "text" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                </div>
                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                    <label class=""form-label""><span metadata=""configuracionDatosGenero"">Género </span><span style=""color:red"">*</span></label>
");
                WriteLiteral(@"                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div class=""col-12"">

                        <h5 class=""label-title mb-4"" metadata=""configuracionDatosContacto"">Datos de Contacto</h5>

                        <div class=""form-group row mb-4 "">
                            <div class=""col-12 col-md-6 mb-4"">
                                <label class=""form-label""><span metadata=""configuracionDatosCorreo"">Correo </span><span style=""color:red"">*</span></label>
                                ");
#nullable restore
#line 191 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                           Write(Html.TextBoxFor(m => m.Correo, new { @class = "form-control", type = "text", required = "required", maxlength = "100" }));

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                            </div>\r\n                            <div class=\"col-12 col-md-3 mb-4\">\r\n                                <label class=\"form-label\" metadata=\"configuracionDatosCelular\">Celular</label>\r\n                                ");
#nullable restore
#line 195 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                           Write(Html.TextBoxFor(m => m.TelefonoMovil, new { @class = "form-control" }));

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                            </div>\r\n                            <div class=\"col-12 col-md-3 mb-4\">\r\n                                <label class=\"form-label\" metadata=\"configuracionDatosTel\">Teléfono</label>\r\n                                ");
#nullable restore
#line 199 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                           Write(Html.TextBoxFor(m => m.Telefono, new { @class = "form-control", type = "text" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                            </div>
                            <div class=""col-12 col-md-6 mb-4"">
                                <label class=""form-label""><span metadata=""configuracionDatosDireccion"">Dirección</span><span style=""color:red"">*</span></label>
                                ");
#nullable restore
#line 203 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                           Write(Html.TextBoxFor(m => m.Direccion, new { @class = "form-control", type = "text", required = "required" }));

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                            </div>\r\n                            <div class=\"col-12 col-md-6 mb-4\">\r\n                                <label class=\"form-label\" metadata=\"configuracionDatosZona\">Zona Horaria</label>\r\n");
                WriteLiteral("                            </div>\r\n                        </div>\r\n");
                WriteLiteral(@"                    </div>
                    <div class=""col-12"" id=""datosPrevisionales"">
                        <hr />
                        <h5 class=""label-title mb-4"" metadata=""configuracionDatosPrevision"">Datos previsionales</h5>
                        <div class=""form-group row mb-0"">
                            <div class=""col-12 col-md mb-4 mb-md-0"">
                                <label class=""form-label"" metadata=""configuracionDatosPrevTtile"">Previsión</label>
");
                WriteLiteral("                            </div>\r\n                            <div class=\"col-12 col-md\">\r\n\r\n");
#nullable restore
#line 227 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                 if (ViewData["view"].Equals(Roles.PacienteInvitado))
                                {

                                }
                                else
                                {

#line default
#line hidden
#nullable disable
                WriteLiteral(@"                                    <label class=""form-label"" metadata=""configuracionDatosConvenio"">Convenio</label>
                                    <select name=""convenio"" id=""convenio"" class=""form-control show-tick ms select2"" multiple data-placeholder=""Select""></select>
");
#nullable restore
#line 235 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                                                                                                                                                                                                                                   
                                }

#line default
#line hidden
#nullable disable
                WriteLiteral(@"                            </div>
                        </div>
                    </div>


                    <!--end:: Nuevo layout de formulario-->


                </div>
            </div>

        </div>
        <div class=""kt-portlet__foot"">
            <div class=""kt-form__actions"">
                <div class=""row"">
                    <div class=""col-12 ml-md-auto col-md-auto"">
                        <br/>
                        <button type=""submit"" id=""btn_guardar_info"" class=""btn btn-success btn-block"" metadata=""configuracionGuardarPerfil"">Guardar</button>
                    </div>
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
            __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_1);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            WriteLiteral("\r\n\r\n\r\n\r\n</div>\r\n\r\n\r\n");
            DefineSection("Scripts", async() => {
                WriteLiteral("\r\n    ");
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("script", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "4fa380355b3c881cdaeb6240fb42f0bb49f8ada030849", async() => {
                }
                );
                __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper);
                BeginAddHtmlAttributeValues(__tagHelperExecutionContext, "src", 2, global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
                AddHtmlAttributeValue("", 15704, "~/js/Usuario/config.js?9rnd=", 15704, 28, true);
#nullable restore
#line 271 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
AddHtmlAttributeValue("", 15732, NumeroRandom.GetRandom(), 15732, 25, false);

#line default
#line hidden
#nullable disable
                EndAddHtmlAttributeValues(__tagHelperExecutionContext);
                __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_2);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                WriteLiteral("\r\n    <script type=\"module\">\r\n        import { init } from \'../../js/Paciente/config.js?rnd=");
#nullable restore
#line 273 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                                                         Write(NumeroRandom.GetRandom());

#line default
#line hidden
#nullable disable
                WriteLiteral("\';\r\n        init(");
#nullable restore
#line 274 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
        Write(Html.Raw(Json.Serialize(Model)));

#line default
#line hidden
#nullable disable
                WriteLiteral(")\r\n    </script>\r\n    <script type=\"text/javascript\">\r\n        (function () {\r\n\r\n            var uid = ");
#nullable restore
#line 279 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                 Write(ViewBag.uid);

#line default
#line hidden
#nullable disable
                WriteLiteral(";\r\n\r\n            window.uid = uid;\r\n             var idEdit = ");
#nullable restore
#line 282 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
                     Write(ViewBag.idEdit);

#line default
#line hidden
#nullable disable
                WriteLiteral(";\r\n                window.idEdit = idEdit;\r\n             var idCliente = \'");
#nullable restore
#line 284 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\PacienteInvitado\_PerfilPacienteInvitado.cshtml"
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
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<WebMVC.Models.PersonasViewModel> Html { get; private set; } = default!;
        #nullable disable
    }
}
#pragma warning restore 1591
