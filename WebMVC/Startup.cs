using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Text;
using WebMVC.Logging;
//using Sustainsys.Saml2.Metadata;
//using Sustainsys.Saml2;

namespace WebMVC
{
    public class Startup
    {
        public const string MedicoScheme = Roles.Medico + "Schemes";
        public const string PacienteScheme = Roles.Paciente + "Schemes";
        public const string AdministradorScheme = Roles.Administrador + "Schemes";
        public const string ContralorScheme = Roles.Contralor + "Schemes";
        public const string AdministradorCentroScheme = Roles.AdministradorCentroClinico + "Schemes";
        public const string PacienteInvitadoScheme = Roles.PacienteInvitado + "Schemes";
        public const string AdministradorTeleperitaje = Roles.AdministradorTeleperitaje + "Schemes";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.o
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews().AddRazorRuntimeCompilation();

            services.AddAuthentication(PacienteScheme) // Sets the default scheme to cookies
                .AddCookie(MedicoScheme, options =>
                {
                    options.AccessDeniedPath = "/account/denied";
                    options.LoginPath = "/account/login";
                    options.SlidingExpiration = true;
                    options.ExpireTimeSpan = TimeSpan.FromDays(1);
                })
                .AddCookie(PacienteScheme, options =>
                {
                    options.AccessDeniedPath = "/account/denied";
                    options.LoginPath = "/account/loginpaciente";
                    options.SlidingExpiration = true;
                    options.ExpireTimeSpan = TimeSpan.FromDays(1);
                })
                .AddCookie(AdministradorScheme, options =>
                {
                    options.AccessDeniedPath = "/account/denied";
                    options.LoginPath = "/account/loginadmin";
                    options.SlidingExpiration = true;
                    options.ExpireTimeSpan = TimeSpan.FromDays(1);
                })
                .AddCookie(ContralorScheme, options =>
                {
                    options.AccessDeniedPath = "/account/denied";
                    options.LoginPath = "/account/logincontralor";
                    options.SlidingExpiration = true;
                    options.ExpireTimeSpan = TimeSpan.FromDays(1);
                }).AddCookie(AdministradorCentroScheme, options =>
                {
                    options.AccessDeniedPath = "/account/denied";
                    options.LoginPath = "/centroclinico/login";
                    options.SlidingExpiration = true;
                    options.ExpireTimeSpan = TimeSpan.FromDays(1);
                }).AddCookie(PacienteInvitadoScheme, options =>
                {
                    options.AccessDeniedPath = "/account/denied";
                    options.LoginPath = "/account/loginpaciente";
                    options.SlidingExpiration = true;
                    options.ExpireTimeSpan = TimeSpan.FromDays(1);
                })
                .AddCookie(AdministradorTeleperitaje, options =>
                {
                    options.AccessDeniedPath = "/account/denied";
                    options.LoginPath = "/account/loginadminteleperitaje";
                    options.SlidingExpiration = true;
                    options.ExpireTimeSpan = TimeSpan.FromDays(1);
                });
                //.AddSaml2("Saml2", options => // Esto agrega SAML con un esquema de autenticaci�n llamado "Saml2"
                //{
                //    options.SPOptions.EntityId = new EntityId("urn:federation:metlife");
                //    options.SPOptions.ReturnUrl = new Uri("https://qa.federation.metlife.com/affwebservices/public/saml2sso");
                //    options.IdentityProviders.Add(new IdentityProvider(
                //        new EntityId("urn:federation:metlife"), options.SPOptions) // Actualizar con la info de metlife
                //    {
                //        MetadataLocation = "https://qa.federation.metlife.com/affwebservices/public/saml2sso", // Utiliza la URL del IdP del XML
                //        LoadMetadata = true
                //    });
                //});


            // Example of how to customize a particular instance of cookie options and
            // is able to also use other services.
            services.AddSingleton<IConfigureOptions<CookieAuthenticationOptions>, ConfigureMyCookie>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            //services.AddHttpContextAccessor();
            services.AddSingleton<ILog, LogNLog>();

            services.AddMvc(options =>
            {
                options.Filters.Add(
                    new ResponseCacheAttribute() { NoStore = true, Location = ResponseCacheLocation.None });
            });

            // HttpClient services
            services.AddHttpClient(HttpClientNames.Services, options =>
            {
                options.BaseAddress = new Uri(Configuration["ServicesUrl"]);
            });

            // HttpClient enrool
            services.AddHttpClient(HttpClientNames.Enroll, options =>
            {
                options.BaseAddress = new Uri(Configuration["ServicesEnroll"]);
            });

            // HttpClient api-pago
            services.AddHttpClient(HttpClientNames.ApiPago, options =>
            {
                options.BaseAddress = new Uri(Configuration["ServicesUrlApiPago"]);
            });

            // HttpClient sekure
            services.AddHttpClient(HttpClientNames.Sekure, options =>
            {
                options.BaseAddress = new Uri(Configuration["ServicesSekure"]);
            });

            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILog logger)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error/index");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            //app.ConfigureExceptionHandler(logger);

            //app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseSentryTracing();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Paciente}/{action=Home}/{id?}");
            });
        }
    }
}
