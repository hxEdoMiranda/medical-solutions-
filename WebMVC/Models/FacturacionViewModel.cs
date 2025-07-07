using System.Collections.Generic;

namespace WebMVC.Models
{
    public class FacturacionViewModel
    {
       
        public PersonasViewModel fichaPaciente { get; set; }
        public DatosCardMercadopPago DatosTarjetasMercadoPago { get; set; }
        public List<Especialidades> Especialidad { get; set; }
        public List<AseguradoraEspecialidadUsuario> Planes { get; set; }
        public OrderHeader OrderAttention { get; set; }
        public InvoiceViewModel InvoiceModel { get; set; }
        public InvoiceConfig InvoiceCf { get; set; }
    }
}
