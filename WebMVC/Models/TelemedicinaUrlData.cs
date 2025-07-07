using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class TelemedicinaUrlData
    {
        public Titular Titular { get; set; } //Informacion del titular de la cuenta
        public Carga Carga { get; set; }// Información de la carga que se esta logueando
        public int Timestamp { get; set; } //Timestamp en el que fue generado 
        public string Modalidad { get; set; } //m
        public string CD_SESSION_ID { get; set; }
        public string Canal { get; set; }
        public string IdAtencion { get; set; }
        public string IdCliente { get; set; }
        public string CodEspecialidad { get; set; }

    }


    public class Titular
    {
        public string Rut { get; set; }
        public string Nombres { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Sexo { get; set; }
        public string Fecha_Nacimiento { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
    }

    public class Carga
    {
        public string Rut { get; set; }
        public string Nombres { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Sexo { get; set; }
        public string Fecha_Nacimiento { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
    }

    public class MokCO
    {
        public TitularCO Titular { get; set; }
        public int Timestamp { get; set; }
        public string TipoPlan { get; set; }
    }

    public class TitularCO
    {
        public string CedulaIdentidad { get; set; }
        public string TipoCedula { get; set; }
        public string PrimerNombre { get; set; }
        public string Apellidos { get; set; }
        public string Email { get; set; }
        public string Socio { get; set; }
        public string SubSocio { get; set; }
        public string Servicio { get; set; }
    }



}
