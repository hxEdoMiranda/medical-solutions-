using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class IntegracionCreaMedico
    {
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Identificador { get; set; }
        public string Correo { get; set; }
        public string FechaNacimiento { get; set; }
        public string Genero { get; set; }
        public string Telefono { get; set; }
        public string Comuna { get; set; }
        public string Direccion { get; set; }
        public string Password { get; set; }
        public byte[] Stamp { get; set; }
        public int ValorAtencion { get; set; } = 0;
        public string InfoPersona1 { get; set; }
        public string Nacionalidad { get; set; }
        public int IdUsuarioCreacion { get; set; }
        public int? IdUsuarioModifica { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModifica { get; set; }
        public string Estado { get; set; }
        public int NumeroRegistro { get; set; }
        public int IdTituloMedico { get; set; }
        public DateTime? FechaRegistroMedico { get; set; }
        public string AlmaMater { get; set; }
        public DateTime? FechaGraduacion { get; set; }
        public int IdDuracionAtencion { get; set; }
        public int TempID { get; set; }
        public int IdEspecialidad { get; set; }
        public int PrefijoProf { get; set; }
        public string RedesSociales { get; set; }
        public string CVP { get; set; }
        public int IdSucursal { get; set; }
        public int IdLugarAtencion { get; set; }
        public int IdPrestador { get; set; }
        public int IdPuntoAtencion { get; set; }
        public string ZonaHoraria { get; set; }
        public int ValorConvenio { get; set; }
        public int IdCentroClinico { get; set; }
        public bool AtiendeHapp { get; set; }
        public string Rol { get; set; }
        public string IdentificadorProfesorAsociado { get; set; }
    }
}
