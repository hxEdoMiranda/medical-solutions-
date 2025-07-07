using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class PersonasDatos
    {
        public int Id { get; set; }
        public int IdPersona { get; set; }
        public int ValorAtencion { get; set; }
        public string InfoPersona1 { get; set; }
        public int IdUsuarioCreacion { get; set; }
        public int? IdUsuarioModifica { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaModifica { get; set; }
        public string Estado { get; set; }
        public int NumeroRegistro { get; set; }
        public int IdTituloMedico { get; set; }
        
        public DateTime? FechaRegistroMedico { get; set; }
        public string AlmaMater { get; set; }
        
        public DateTime? FechaGraduacion { get; set; }
        public int IdDuracionAtencion { get; set; }
        public int PrefijoProf { get; set; }
        public int ZonaHoraria { get; set; }
        public string RedesSociales { get; set; }
        public string PrefijoDetalle { get; set; }
        public string DuracionAtencionDetalle { get; set; }
        public string TituloMedicoDetalle { get; set; }
        public List<Especialidades> Especialidades { get; set; }
        public int IdEspecialidad { get; set; }
        public string FotoPerfil { get; set; }
        public string CertificadoRegistroPDF { get; set; }
        public string FirmaMedico { get; set; }
        public string Especialidad { get; set; }
        public string NombreCertificadoRegistro { get; set; }
        public int IdCertificadoRegistro { get; set; }
        public int TempID { get; set; }
        public Boolean HabilitarAtencion { get; set; }
        public string CodigoPrestacion { get; set; }

        public string CVP { get; set; }
        public int IdSucursal { get; set; }
        public int IdLugarAtencion { get; set; }
        public int IdPrestador { get; set; }
        public int IdPuntoAtencion { get; set; }
        public int ValorConvenio { get; set; }
        public bool AtiendeHapp { get; set; }
        public bool RestriccionPacienteFila { get; set; }
    }


    public class SimpleUserModel 
    {
        public int UserId { get; set; }
        public string token { get; set; }
    }
    public class UsersViewModel
    {

        
        public string Username { get; set; }
        public string RoleName { get; set; }
        public string Identificador { get; set; }
        
        
        

    }

    public class UsersViewIdModel
    {

        public int UserId { get; set; }
        public string Username { get; set; }
        public string RoleName { get; set; }
        public string Identificador { get; set; }




    }
}
