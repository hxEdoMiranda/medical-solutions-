#pragma checksum "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "e3d8294d19e3a553622df04b0a7957a5ec576957"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Shared__ConfigAccount), @"mvc.1.0.view", @"/Views/Shared/_ConfigAccount.cshtml")]
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
#line 1 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
using System.Globalization;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"e3d8294d19e3a553622df04b0a7957a5ec576957", @"/Views/Shared/_ConfigAccount.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"d07e873f05b36c9d83cd6a184d4bfbe1720fee4b", @"/Views/_ViewImports.cshtml")]
    #nullable restore
    public class Views_Shared__ConfigAccount : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    #nullable disable
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("id", new global::Microsoft.AspNetCore.Html.HtmlString("form_change_pw"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_1 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("class", new global::Microsoft.AspNetCore.Html.HtmlString("kt-form kt-form--label-right"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
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
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            WriteLiteral("\r\n");
#nullable restore
#line 3 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
  
    var largoPass = 15;
    var minimoPass = 5;
    string textoClave = "clave";

    

#line default
#line hidden
#nullable disable
#nullable restore
#line 8 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
     if (ViewData["view"].Equals(Roles.Paciente))
    {
        if (ViewBag.idCliente == "108" || ViewBag.HostURL.ToString().Contains("clinicamundoscotia.")){
        largoPass = 8;
        minimoPass = 6;
        textoClave = "contraseña";
        }
    }

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n\r\n<div class=\"kt-portlet mb-4 cont-cambio-clave\">\r\n    <div class=\"kt-portlet__head\">\r\n        <div class=\"kt-portlet__head-label\">\r\n            <h3 class=\"kt-portlet__head-title\" metadata=\"configuracionChangePass\">Cambiar ");
#nullable restore
#line 24 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
                                                                                     Write(textoClave);

#line default
#line hidden
#nullable disable
            WriteLiteral("</h3>\r\n        </div>\r\n\r\n    </div>\r\n    ");
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("form", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "e3d8294d19e3a553622df04b0a7957a5ec5769575390", async() => {
                WriteLiteral(@"
        <div class=""kt-portlet__body"">
            <div class=""kt-section kt-section--first mb-0"">
                <div class=""kt-section__body"">
                    
                    <div class=""row"">
                        <div class=""col-lg-12"">

                            <div class=""kt-widget kt-widget--user-profile-1 mb-0"">

                                <div class=""row inputs-order-width"">
                                    <div class=""form-group col-12 passw-input"">
                                        <label class=""form-label"">Nueva ");
#nullable restore
#line 40 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
                                                                    Write(new CultureInfo("en-US").TextInfo.ToTitleCase(textoClave));

#line default
#line hidden
#nullable disable
                WriteLiteral("</label>\r\n                                        <div class=\"input-group\" id=\"show_hide_password\">\r\n\r\n                                            <input type=\"password\" name=\"Password\"");
                BeginWriteAttribute("maxlength", " maxlength=", 1558, "", 1579, 1);
#nullable restore
#line 43 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
WriteAttributeValue("", 1569, largoPass, 1569, 10, false);

#line default
#line hidden
#nullable disable
                EndWriteAttribute();
                WriteLiteral(" id=\"Password\"");
                BeginWriteAttribute("minlength", " minlength=", 1593, "", 1615, 1);
#nullable restore
#line 43 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
WriteAttributeValue("", 1604, minimoPass, 1604, 11, false);

#line default
#line hidden
#nullable disable
                EndWriteAttribute();
                WriteLiteral(" class=\"form-control\"");
                BeginWriteAttribute("placeholder", " placeholder=\"", 1636, "\"", 1710, 1);
#nullable restore
#line 43 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
WriteAttributeValue("", 1650, new CultureInfo("en-US").TextInfo.ToTitleCase(textoClave), 1650, 60, false);

#line default
#line hidden
#nullable disable
                EndWriteAttribute();
                WriteLiteral(" required>\r\n                                            <div class=\"input-group-append\">\r\n                                                <span class=\"input-group-text\">\r\n                                                    <a");
                BeginWriteAttribute("href", " href=\"", 1936, "\"", 1943, 0);
                EndWriteAttribute();
                WriteLiteral(@"><i class=""fa fa-eye-slash"" aria-hidden=""true""></i></a>
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                    <div class=""form-group mb-0 col-12 passw-input"">
                                        <label class=""form-label"">Repetir ");
#nullable restore
#line 53 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
                                                                      Write(new CultureInfo("en-US").TextInfo.ToTitleCase(textoClave));

#line default
#line hidden
#nullable disable
                WriteLiteral("</label>\r\n                                        <div class=\"input-group\" id=\"show_hide_rpassword\">\r\n\r\n                                            <input type=\"password\" name=\"PasswordRepeat\"");
                BeginWriteAttribute("maxlength", " maxlength=", 2616, "", 2637, 1);
#nullable restore
#line 56 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
WriteAttributeValue("", 2627, largoPass, 2627, 10, false);

#line default
#line hidden
#nullable disable
                EndWriteAttribute();
                WriteLiteral(" id=\"PasswordRepeat\"");
                BeginWriteAttribute("minlength", " minlength=", 2657, "", 2679, 1);
#nullable restore
#line 56 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
WriteAttributeValue("", 2668, minimoPass, 2668, 11, false);

#line default
#line hidden
#nullable disable
                EndWriteAttribute();
                WriteLiteral(" class=\"form-control\"");
                BeginWriteAttribute("placeholder", " placeholder=\"", 2700, "\"", 2733, 2);
                WriteAttributeValue("", 2714, "Repetir", 2714, 7, true);
#nullable restore
#line 56 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
WriteAttributeValue(" ", 2721, textoClave, 2722, 11, false);

#line default
#line hidden
#nullable disable
                EndWriteAttribute();
                WriteLiteral(" required>\r\n                                            <div class=\"input-group-append\">\r\n                                                <span class=\"input-group-text\">\r\n                                                    <a");
                BeginWriteAttribute("href", " href=\"", 2959, "\"", 2966, 0);
                EndWriteAttribute();
                WriteLiteral(@"><i class=""fa fa-eye-slash"" aria-hidden=""true""></i></a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                                
                                <div class=""condiciones-validacion-clave"">
                                    <h6 metadata=""configuracionPassInfo"">La ");
#nullable restore
#line 69 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
                                                                       Write(textoClave);

#line default
#line hidden
#nullable disable
                WriteLiteral(" debe tener: </h6>\r\n                                    <ul>\r\n                                        \r\n");
#nullable restore
#line 72 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
                                          
                                            if (ViewData["view"].Equals(Roles.Paciente) || ViewData["view"].Equals(Roles.Medico))
                                            {
                                                if (ViewBag.idCliente == "108" || ViewBag.HostURL.ToString().Contains("clinicamundoscotia."))
                                                {

#line default
#line hidden
#nullable disable
                WriteLiteral(@"                                                       <li><span metadata=""configuracionPassInfo2""> Entre 6 a 8 caracteres</span> </li>
                                                        <li><span metadata=""configuracionPassInfo2""> Una letra mayúscula y una minúscula</span> </li>
                                                        <li><span metadata=""configuracionPassInfo2""> Al menos un número</span> </li>
");
#nullable restore
#line 80 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
                                                }else{

#line default
#line hidden
#nullable disable
                WriteLiteral(@"                                                        <li><span metadata=""configuracionPassInfo2""> Entre 5 a 15 caracteres.</span> </li>
                                                        <li><span metadata=""configuracionPassInfo2""> Una letra mayúscula y una minúscula</span> </li>
                                                        <li><span metadata=""configuracionPassInfo2""> Al menos un número</span> </li>
");
#nullable restore
#line 84 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
                                                }
                                           
                                            }
                                            else
                                            {

#line default
#line hidden
#nullable disable
                WriteLiteral("                                                    <li>\r\n                                                            <span metadata=\"configuracionPassInfo2\">- Entre 5 a 15 caracteres.</span>\r\n                                                     </li>\r\n");
#nullable restore
#line 92 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
                                            }
                                         

#line default
#line hidden
#nullable disable
                WriteLiteral(@"                                        
                                    </ul>
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class=""kt-portlet__foot"">
            <div class=""kt-form__actions"">
                <div class=""row"">
                    
                    <div class=""col-12 ml-md-auto col-md-auto text-right"">
                        <button type=""submit"" id=""btn_guardar_pw"" class=""btn btn-success btn-block"" metadata=""configuracionPassGuardar"">Guardar Nueva ");
#nullable restore
#line 109 "D:\PRODUCTOBASE001-FULL\WebMVC\Views\Shared\_ConfigAccount.cshtml"
                                                                                                                                                  Write(new CultureInfo("en-US").TextInfo.ToTitleCase(textoClave));

#line default
#line hidden
#nullable disable
                WriteLiteral("</button>\r\n");
                WriteLiteral("                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    ");
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
            WriteLiteral("\r\n</div>\r\n\r\n\r\n\r\n\r\n");
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
