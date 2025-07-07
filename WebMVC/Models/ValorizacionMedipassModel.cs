using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{

    public class ValorizacionMedipass
    {
        public Response response { get; set; }
    }

    public class Response
    {
        public Data data { get; set; }
    }

    public class Data
    {
        public Validarresponse validarResponse { get; set; }
        public Prestaciones prestaciones { get; set; }
    }

    public class Validarresponse
    {
        public int estado { get; set; }
        public string gloEstado { get; set; }
    }

    public class Prestaciones
    {
        public Bonificadas bonificadas { get; set; }
    }

    public class Bonificadas
    {
        public Prestacion[] prestacion { get; set; }
    }

    public class Prestacion
    {
        public string codigoPrestacionPrestador { get; set; }
        public int categoriaPrestacion { get; set; }
        public int copago { get; set; }
        public int valorConvenido { get; set; }
        public Bonificaciones bonificaciones { get; set; }
        public int otros { get; set; }
        public int finanInt { get; set; }
    }

    public class Bonificaciones
    {
        public int aporteFinanciador { get; set; }
        public Aporteseguro aporteSeguro { get; set; }
        public int aporteCaff { get; set; }
    }

    public class Aporteseguro
    {
        public int aporteTotal { get; set; }
        public object[] seguros { get; set; }
        public int deducible { get; set; }
    }

}
