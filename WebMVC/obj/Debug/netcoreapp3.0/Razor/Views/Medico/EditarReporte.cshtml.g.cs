#pragma checksum "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "ab4f3d8f878e98f0b0c4b30de64f1ddb72c244de"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Medico_EditarReporte), @"mvc.1.0.view", @"/Views/Medico/EditarReporte.cshtml")]
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
#line 1 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
using Microsoft.Extensions.Configuration;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"ab4f3d8f878e98f0b0c4b30de64f1ddb72c244de", @"/Views/Medico/EditarReporte.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"d07e873f05b36c9d83cd6a184d4bfbe1720fee4b", @"/Views/_ViewImports.cshtml")]
    #nullable restore
    public class Views_Medico_EditarReporte : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<WebMVC.Models.ReportePaciente>
    #nullable disable
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("rel", new global::Microsoft.AspNetCore.Html.HtmlString("stylesheet"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_1 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("type", new global::Microsoft.AspNetCore.Html.HtmlString("text/css"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_2 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("id", new global::Microsoft.AspNetCore.Html.HtmlString("form_edit_reporte"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_3 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("class", new global::Microsoft.AspNetCore.Html.HtmlString("kt-form kt-form--label-right"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
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
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper;
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.RenderAtEndOfFormTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper;
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#nullable restore
#line 4 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
  
    ViewData["Title"] = "Reporte Enfermería";
    Layout = "_Layout";


#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n\r\n");
            DefineSection("Styles", async() => {
                WriteLiteral("\r\n    ");
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("link", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.SelfClosing, "ab4f3d8f878e98f0b0c4b30de64f1ddb72c244de5339", async() => {
                }
                );
                __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper);
                BeginAddHtmlAttributeValues(__tagHelperExecutionContext, "href", 2, global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
                AddHtmlAttributeValue("", 240, "~/css/Shared/atencion.css?rnd=", 240, 30, true);
#nullable restore
#line 12 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
AddHtmlAttributeValue("", 270, NumeroRandom.GetRandom(), 270, 25, false);

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

<div class=""kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid"">

    <!--Begin::App-->
    <div class=""kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app"">

        <!--Begin:: App Aside Mobile Toggle-->
        <button class=""kt-app__aside-close"" id=""kt_user_profile_aside_close"">
            <i class=""la la-close""></i>
        </button>
        <!--End:: App Aside Mobile Toggle-->
        <!--End:: App Aside Mobile Toggle-->
        <div class=""col-xl-12"">
            <div class=""kt-portlet"">
                <div class=""kt-portlet__head"">
                    <div class=""kt-portlet__head-label"">
                        <h3 class=""kt-portlet__head-title"">Reporte Enfermería</h3>
                    </div>

                </div>
                ");
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("form", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "ab4f3d8f878e98f0b0c4b30de64f1ddb72c244de7965", async() => {
                WriteLiteral(@"
                    <div class=""kt-portlet__body kt-portlet__body--fit"">
                        <div class=""row col-lg-12"">
                            <div class=""kt-widget1 col-lg-6"">
                                <div class=""kt-widget1__item"">
                                    <div class=""kt-widget1__info col-lg-12"">
                                        <div class=""form-group row mb-4"">
                                            <div class=""col-6 col-md mb-4 mb-md-0"">
                                                <label class=""form-label"">Paciente</label>
                                                <span class=""kt-widget1__desc"">");
#nullable restore
#line 44 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                                                          Write(Model.persona.Nombre);

#line default
#line hidden
#nullable disable
                WriteLiteral(" ");
#nullable restore
#line 44 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                                                                                Write(Model.persona.ApellidoPaterno);

#line default
#line hidden
#nullable disable
                WriteLiteral("</span><br>\r\n                                            </div>\r\n                                            <div class=\"col-6 col-md mb-4 mb-md-0\">\r\n");
#nullable restore
#line 47 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                                  
                                                    DateTime fechaMayor = DateTime.Parse(DateTime.Now.ToShortDateString());
                                                    DateTime fechaMenor = DateTime.Parse(Convert.ToDateTime(Model.persona.FNacimiento).ToShortDateString());

                                                    var diferencia = fechaMayor.Year - fechaMenor.Year;
                                                    int añosDiferencia = diferencia;

                                                

#line default
#line hidden
#nullable disable
                WriteLiteral("                                                <label class=\"form-label\">Edad</label>\r\n                                                <span class=\"kt-widget1__desc\">");
#nullable restore
#line 56 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                                                          Write(añosDiferencia);

#line default
#line hidden
#nullable disable
                WriteLiteral(@"</span><br>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class=""row row-no-padding row-col-separator-xl"">
                            <div class=""col-md-12 col-lg-12 col-xl-6"">
                                ");
#nullable restore
#line 65 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                           Write(Html.HiddenFor(m => m.reporteEnfermeria.Id));

#line default
#line hidden
#nullable disable
                WriteLiteral("\r\n                                ");
#nullable restore
#line 66 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                           Write(Html.HiddenFor(m => m.reporteEnfermeria.IdPaciente));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                <!--begin:: Widgets/Stats2-1 -->
                                <div class=""kt-widget1"">
                                    
                                    <div class=""kt-widget1__item"">
                                        <div class=""kt-widget1__info col-lg-12"">
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Motivo de Consulta </label>
                                                    ");
#nullable restore
#line 75 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.DropDownListFor(m => m.reporteEnfermeria.MotivoConsulta, Enumerable.ToList(Model.motivoConsulta).Select(x => new SelectListItem { Text = x.Detalle.ToString(), Value = x.Id.ToString() }), new { @class = "form-control m-input", style = "text-transform: uppercase" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                                <div class=""col-12 col-md mb-4 mb-md-0"" id=""derivacion"" hidden>
                                                    <label class=""form-label"">Derivación Profesional</label>
                                                    ");
#nullable restore
#line 79 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextBoxFor(m => m.reporteEnfermeria.DerivacionProfesional, new { @class = "form-control"}));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div class=""kt-widget1__item"">
                                        <div class=""kt-widget1__info col-lg-12"">
                                            <h5 class=""label-title mb-4"">Valoración y diagnósticos de enfermería </h5>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Antecedentes Psicosociales</label>
                                                    ");
#nullable restore
#line 91 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.AntecedentesPsicosociales, new { @class = "form-control" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Antecedentes Laborales</label>
                                                    ");
#nullable restore
#line 95 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.AntecedentesLaborales, new { @class = "form-control" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Antecedentes Académicos</label>
                                                    ");
#nullable restore
#line 101 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.AntecedentesAcademicos, new { @class = "form-control" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Red de apoyo</label>
                                                    ");
#nullable restore
#line 105 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.RedApoyo, new { @class = "form-control" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Observaciones</label>
                                                    ");
#nullable restore
#line 111 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.Observacion, new { @class = "form-control"}));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=""kt-widget1__item"">
                                        <div class=""kt-widget1__info col-lg-12"">
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Indicaciones de enfermería</label>
                                                    ");
#nullable restore
#line 121 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.IndicacionEnfermeria, new { @class = "form-control" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div class=""kt-widget1__item"">
                                        <div class=""kt-widget1__info col-lg-12"">
                                            <div class=""form-group col-12 mb-4 pl-0"">
                                                <div class=""col-12 col-md mb-4 mb-md-0 pl-0"">
                                                    <label class=""form-label"">Control</label>
                                                    ");
#nullable restore
#line 132 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.DropDownListFor(m => m.reporteEnfermeria.Control, Enumerable.ToList(Model.control).Select(x => new SelectListItem { Text = x.Detalle.ToString(), Value = x.Id.ToString() }), new { @class = "form-control m-input", style = "text-transform: uppercase" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div class=""kt-widget1__item"">
                                        <div class=""kt-widget1__info col-lg-12"">
                                            <h5 class=""label-title mb-4"">Antecedentes Médicos</h5>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Alergias</label>
                                                    ");
#nullable restore
#line 144 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.Alergias, new { @class = "form-control" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Medicamentos de uso habitual</label>
                                                    ");
#nullable restore
#line 148 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.Medicamentos, new { @class = "form-control" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <!--end:: Widgets/Stats2-1 -->
                            </div>
                            <div class=""col-md-12 col-lg-12 col-xl-6"">
                                <div class=""kt-widget1"">
                                    <div class=""kt-widget1__item"">
                                        <div class=""kt-widget1__info col-lg-12"">
                                            <h5 class=""label-title mb-4"">Antecedentes Mórbidos</h5>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">HTA</label>
                                     ");
                WriteLiteral("               ");
#nullable restore
#line 166 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.CheckBoxFor(m => m.reporteEnfermeria.Hta, new { @class = "" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">DMII</label>
                                                    ");
#nullable restore
#line 172 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.CheckBoxFor(m => m.reporteEnfermeria.Dm));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Asma</label>
                                                    ");
#nullable restore
#line 178 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.CheckBoxFor(m => m.reporteEnfermeria.Asma));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">EPOC</label>
                                                    ");
#nullable restore
#line 184 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.CheckBoxFor(m => m.reporteEnfermeria.Epoc));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Dislipidemia</label>
                                                    ");
#nullable restore
#line 190 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.CheckBoxFor(m => m.reporteEnfermeria.Dislipidemia));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Depresión</label>
                                                    ");
#nullable restore
#line 196 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.CheckBoxFor(m => m.reporteEnfermeria.Depresion));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Trastorno del sueño</label>
                                                    ");
#nullable restore
#line 202 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.CheckBoxFor(m => m.reporteEnfermeria.TrastornoSueno));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Otros</label>
                                                    ");
#nullable restore
#line 208 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.OtrosAntecedentesMorbidos, new { @class = "form-control col-6"}));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=""kt-widget1__item"">
                                        <div class=""kt-widget1__info col-lg-12"">
                                            <div class=""form-group col-12 mb-4 pl-0"">
                                                <div class=""col-12 col-md mb-4 mb-md-0 pl-0"">
                                                    <label class=""form-label"">Antecedentes Quirúrgicos</label>
                                                    ");
#nullable restore
#line 218 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.AntecedentesQuirurgicos, new { @class = "form-control col-12"}));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div class=""kt-widget1__item"">
                                        <div class=""kt-widget1__info col-lg-12"">
                                            <h5 class=""label-title mb-4"">Hábitos</h5>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Alcohol</label>
                                                    ");
#nullable restore
#line 230 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.CheckBoxFor(m => m.reporteEnfermeria.Alcohol, new { @class = "" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                                <div class=""col-12 col-md mb-4 mb-md-0 pl-0"">
                                                    <label class=""form-label"">Observación Alcohol</label>
                                                    ");
#nullable restore
#line 234 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.ObsAlcohol, new { @class = "form-control col-12"}));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Tabaco</label>
                                                    ");
#nullable restore
#line 240 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.CheckBoxFor(m => m.reporteEnfermeria.Tabaco));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                                <div class=""col-12 col-md mb-4 mb-md-0 pl-0"">
                                                    <label class=""form-label"">Observación Tabaco</label>
                                                    ");
#nullable restore
#line 244 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.ObsTabaco, new { @class = "form-control col-12" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Actividad Física</label>
                                                    ");
#nullable restore
#line 250 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.CheckBoxFor(m => m.reporteEnfermeria.ActividadFisica));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                                <div class=""col-12 col-md mb-4 mb-md-0 pl-0"">
                                                    <label class=""form-label"">Observación Actividad Física</label>
                                                    ");
#nullable restore
#line 254 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.ObsActividadFisica, new { @class = "form-control col-12" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                            <div class=""form-group row mb-4"">
                                                <div class=""col-12 col-md mb-4 mb-md-0"">
                                                    <label class=""form-label"">Otras Drogas</label>
                                                    ");
#nullable restore
#line 260 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.CheckBoxFor(m => m.reporteEnfermeria.OtrasDrogas));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                                <div class=""col-12 col-md mb-4 mb-md-0 pl-0"">
                                                    <label class=""form-label"">Observación Otras Drogas</label>
                                                    ");
#nullable restore
#line 264 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                               Write(Html.TextAreaFor(m => m.reporteEnfermeria.ObsOtrasDrogas, new { @class = "form-control col-12" }));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div><!--end:: Widgets/Stats2-2 -->
                            </div>
                        </div>


                    </div>
                    <div class=""kt-portlet__foot"">
                        <div class=""kt-form__actions"">
                            <div class=""row"">
                                <div class=""col-12 col-md-6 offset-md-6 col-lg-3 offset-lg-9 text-right"">
                                    <button type=""submit"" id=""btn_guardar_info"" class=""btn btn-success btn-block"">Guardar</button>
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
            __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_2);
            __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_3);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            WriteLiteral("\r\n            </div>\r\n        </div>\r\n       \r\n\r\n    </div>\r\n</div>\r\n\r\n\r\n");
            DefineSection("Scripts", async() => {
                WriteLiteral("\r\n\r\n    <script type=\"module\">\r\n        import { init } from \'../../js/Medico/editar-reporte-enfermeria.js?rnd=");
#nullable restore
#line 296 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                                                                          Write(NumeroRandom.GetRandom());

#line default
#line hidden
#nullable disable
                WriteLiteral("\';\r\n        init(");
#nullable restore
#line 297 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
        Write(Html.Raw(Json.Serialize(Model)));

#line default
#line hidden
#nullable disable
                WriteLiteral(")\r\n    </script>\r\n    <script type=\"text/javascript\">\r\n        (function () {\r\n\r\n            var uid = ");
#nullable restore
#line 302 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                 Write(ViewBag.uid);

#line default
#line hidden
#nullable disable
                WriteLiteral(";\r\n            window.uid = uid;\r\n            var idPaciente = ");
#nullable restore
#line 304 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Medico\EditarReporte.cshtml"
                        Write(ViewBag.idPaciente);

#line default
#line hidden
#nullable disable
                WriteLiteral(";\r\n            window.idPaciente = idPaciente;\r\n        })()\r\n    </script>\r\n    <!-- Global site tag (gtag.js) - Google Analytics -->\r\n   \r\n");
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
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<WebMVC.Models.ReportePaciente> Html { get; private set; } = default!;
        #nullable disable
    }
}
#pragma warning restore 1591
