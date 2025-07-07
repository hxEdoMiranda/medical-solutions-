using Dapper.Contrib.Extensions;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;

namespace WebMVC.Models
{
    public class PersonasViewModel
    {
        public int Id { get; set; }
        public string Identificador { get; set; }
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Correo { get; set; }
        public string Telefono { get; set; }
        public string TelefonoMovil { get; set; }
        public string Estado { get; set; }
        public string Genero { get; set; }
        public DateTime? FNacimiento { get; set; }
        public float? Altura { get; set; }
        public int? Peso { get; set; }
        public string Alergias { get; set; }
        public string Direccion { get; set; }
        public string Comuna { get; set; }
        public int IdUsuarioModifica { get; set; } = 0;
        public int IdUsuarioCreacion { get; set; } = 0;
        public DateTime? FechaCreacion { get; set; } = null;
        public DateTime? FechaModifica { get; set; } = null;
        public DateTime? FechaCambioEstado { get; set; } = null;
        public string Nacionalidad { get; set; }
        public string ZonaHoraria { get; set; }
        public string Prevision { get; set; }
        public string CorreoPlataformaTercero { get; set; }
        public string TelefonoPlataformaTercero { get; set; }
        public string Enfermedades { get; set; }
        public string Medicamentos { get; set; }
        public string Cirugias { get; set; }
        public string Habitos { get; set; }
        public string Ocupacion { get; set; }
        [Computed] public int CantCargas { get; set; } = 0;
        public string CodigoTelefono { get; set; }
        [Computed] public int IdEmpresa { get; set; }
        [Computed] public int UserId { get; set; }
        [Computed] public string Empresa { get; set; }
        [Computed] public string nombreCompleto { get; set; }
        [Computed] public string rutaAvatar { get; set; }
        [Computed] public int TempID { get; set; } = 0;
        [Computed] public int duracionAtencionId { get; set; } = 0;
        [Computed] public int duracionAtencionMin { get; set; } = 0;
        [Computed] public bool ChangePassword { get; set; } = false;
        [Computed] public bool AcceptNotice { get; set; } = false;
        [Computed] public string TituloMedico { get; set; } = string.Empty;
        [Computed] public string AlmaMater { get; set; } = string.Empty;
        [Computed] public bool esCarga { get; set; } = false;
        [Computed] public int IdPersonaCarga { get; set; } = 0;
        [Computed] public int IdPersonaTitular { get; set; } = 0;
        [Computed] public string IdentificadorFirebase { get; set; } = string.Empty;
        public string Ciudad { get; set; }
        [Computed] public string IdAdmin { get; set; }
        [Computed] public int IdCentroClinico { get; set; }
        public string EstadoCivil { get; set; }
        public string Escolaridad { get; set; }
        public string PaisNacimiento { get; set; }
        public string CiudadNacimiento { get; set; }
        public string TipoDocumento { get; set; }
        public string ClaseDeRiesgo { get; set; } //new
        public string municipio { get; set; } //new
        public string departamento { get; set; } //new
        public string eps { get; set; } //new
        public List<Empresa> Empresas { get; set; }
        public List<Prevision> Previsiones { get; set; } = new List<Prevision>();
        public List<Parametros> EstadosCiviles { get; set; } = new List<Parametros>();
        public List<Parametros> Escolaridades { get; set; } = new List<Parametros>();
        [Computed] public string Rol { get; set; }
        [Computed] public string IdentificadorProfesorAsociado { get; set; }
        public int Edad { get; set; }
        [Computed] public string FullName { get { return Nombre + " " + ApellidoPaterno + " " + ApellidoMaterno; } }
        [Computed] public bool AceptaTerminos { get; set; } = false;
        //CORRELATIVO PARA MASPROTECCION
        [Computed] public int Correlativo { get; set; } = 0;
        [Computed] public string Iniciales { get; set; }
        public List<SelectListItem> ObtenerSexo()
        {
            return new List<SelectListItem>
            {
                new SelectListItem { Text = "Seleccione", Value = "" },
                new SelectListItem { Text = "Femenino", Value = "F" },
                new SelectListItem { Text = "Masculino", Value = "M" }
            };
        }

        public List<SelectListItem> ObtenerEstadoCivil()
        {
            return new List<SelectListItem>
            {
                new SelectListItem { Text = "Seleccione", Value = "" },
                new SelectListItem { Text = "Casado", Value = "C" },
                new SelectListItem { Text = "Soltero", Value = "S"}
            };
        }

        

        public List<SelectListItem> ObtenerPrevision()
        {
            var lista = new List<SelectListItem>
            {
                new SelectListItem { Text = "Seleccione", Value = string.Empty }
            };

            foreach (Prevision prevision in Previsiones)
            {
                lista.Add(new SelectListItem
                {
                    Text = prevision.Entidad,
                    Value = prevision.Codigo
                });
            }

            return lista;
        }

        public List<SelectListItem> ObtenerEstadosCiviles(string codigoTelefono)
        {
            var lista = new List<SelectListItem>
            {
                new SelectListItem { Text = "Seleccione", Value = string.Empty }
            };

            foreach (Parametros parametro in EstadosCiviles.Where(el => el.Util1 == codigoTelefono))
            {
                lista.Add(new SelectListItem
                {
                    Text = parametro.Detalle,
                    Value = parametro.Codigo
                });
            }

            return lista;
        }

        public List<SelectListItem> ObtenerEscolaridades(string codigoTelefono)
        {
            var lista = new List<SelectListItem>
            {
                new SelectListItem { Text = "Seleccione", Value = string.Empty }
            };

            foreach (Parametros parametro in Escolaridades.Where(el => el.Util1 == codigoTelefono))
            {
                lista.Add(new SelectListItem
                {
                    Text = parametro.Detalle,
                    Value = parametro.Codigo
                });
            }

            return lista;
        }

        public List<SelectListItem> EstadoPersona()
        {
            return new List<SelectListItem>
            {
                new SelectListItem { Text = "Seleccione", Value = "" },
                new SelectListItem { Text = "Activo", Value = "V" },
                new SelectListItem { Text = "Inactivo", Value = "I" }
            };
        }


        public List<SelectListItem> ZonasHorarias()
        {
            int start = -12;
            int count = 25;
            List<SelectListItem> lista = new List<SelectListItem>();

            // Si es Colombia
            if (CodigoTelefono == "CO")
            {
                start = -5;
                count = 1;
            }

            // Desarrollo
            if (IdEmpresa == 259 || IdEmpresa == 258)
            {
                start = -5;
                count = 1;
            }

            //Producción

            if (IdEmpresa == 270 || IdEmpresa == 206 || IdEmpresa == 119 && CodigoTelefono == "CO" || IdEmpresa == 255 || IdEmpresa == 259)
            {
                start = -5;
                count = 1;
            }

            return lista.Union(Enumerable.Range(start, count).Select(i => new SelectListItem
            {
                Text = $"GMT{(i >= 0 ? $"+{i}" : i.ToString())}",
                Value = i.ToString(),
                Selected = ZonaHoraria == i.ToString()
            })).ToList();
        }

        public List<SelectListItem> ZonasHorariasChile()
        {

            return new List<SelectListItem>
            {
                new SelectListItem { Text = "GMT-6 / Isla de Pascua", Value = "-6" },
                new SelectListItem { Text = "GMT-4 / Santiago", Value = "-4" }
            };

        }

        public List<SelectListItem> GetTipoDocumento()
        {
            return new List<SelectListItem>
            {
                new SelectListItem { Text = "Seleccione", Value = "" },
                new SelectListItem { Text = "Cédula de Ciudadanía", Value = string.Concat("C.C") },
                new SelectListItem { Text = "Cédula de Extranjería", Value = "C.E" },
                new SelectListItem { Text = "Tarjeta de Identidad", Value = "T.I" }
            };
        }
    }
}
