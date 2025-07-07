namespace WebMVC.Models
{
    public class AtencionesExamenes
    {
        public int Id { get; set; }
        public int IdAtencion { get; set; }
        public int IdExamen { get; set; }
        public string SeleccionPago { get; set; }
        public int CiudadPago { get; set; }
        public string EstadoPago { get; set; }
        public int EnProcesoPagoPayzen { get; set; }
    }
}
