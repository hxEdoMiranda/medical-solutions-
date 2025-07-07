namespace WebMVC.Models
{
    public class PositivaCertificacion
    {
        public string numDocEmpleador { get; set; }
        public string nombreEmpleador { get; set; }
        public string tipoViculacion { get; set; }
        public string fechaUltAfiliacion { get; set; }
        public string claseRiesgo { get; set; }
        public string estado { get; set; }
    }
    public class PositivaCarnet
    {
        public string nombresPersona { get; set; }
        public string apellidosPersona { get; set; }
        public string tipoDocPersona { get; set; }
        public string numDocPersona { get; set; }
        public string correoPersona { get; set; }
        public string estadoPersona { get; set; }
        public string tipoDocEmpleador { get; set; }
        public string numDocEmpleador { get; set; }
        public string nombreEmpleador { get; set; }
        public string estadoEmpleador { get; set; }
        public string topmil { get; set; }
        public string claseRiesgo { get; set; }
        public string codError { get; set; }
    }

    public class PositivaCertificacionMSService
    { 
        public bool existe { get; set; }
        public PositivaCertificacion certificado { get; set; }
        public PositivaCarnet carnet { get; set; }

    }
}
