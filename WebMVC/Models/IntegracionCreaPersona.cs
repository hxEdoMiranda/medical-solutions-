using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class IntegracionCreaPersona
    {
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Identificador { get; set; }
        public string Correo { get; set; }
        public string FechaNacimiento { get; set; }
        public string Genero { get; set; }
        public string Telefono { get; set; }
        public string TelefonoMovil { get; set; }
        public string Comuna { get; set; }
        public string Direccion { get; set; }
        public string RutTitular { get; set; }
        public string Password { get; set; }
        public bool AtencionDirecta { get; set; }
        public int IdCliente { get; set; }
        public byte[] Stamp { get; set; }
        public string CodConvenio { get; set; }
        public string CodConvenioB2C { get; set; }
        public string CodigoTelefono { get; set; }
    }

    public class CreatePersonaEmpresa
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
        public string RutTitular { get; set; }
        public string Password { get; set; }
        public byte[] Stamp { get; set; }
        public int IdUsuarioCreacion { get; set; }
        public int TempID { get; set; }
        public string TelefonoMovil { get; set; }
        public string Prevision { get; set; }
        public string ZonaHoraria { get; set; }
        public string Nacionalidad { get; set; }
        public int IdEmpresa { get; set; }
        public string EstadoCivil { get; set; }
    }

        public class ResultServiceNewUser
    {
        public int status { get; set; }
        public Result result { get; set; }
    }

    public class Result
    {
        public Transactstatus transactStatus { get; set; }
        public User user { get; set; }
    }

    public class Transactstatus
    {
        public string estado { get; set; }
        public string descEstado { get; set; }
    }

    public class User
    {
        public int userId { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public bool isActive { get; set; }
        public string activationCode { get; set; }
        public string stamp { get; set; }
        public bool changePassword { get; set; }
        public object estado { get; set; }
        public object repeatPassword { get; set; }
        public bool rememberLogin { get; set; }
        public object returnUrl { get; set; }
        public object descEstado { get; set; }
        public object correo { get; set; }
        public object nombreCompleto { get; set; }
        public object roleName { get; set; }
        public object configuration { get; set; }
        public bool AtencionDirecta { get; set; }
        public string usernameFirebase { get; set; }
    }






}
