using Dapper.Contrib.Extensions;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;

namespace WebMVC.Models
{
    public class InvoiceViewModel
    {
        public long Id { get; set; }
        public int IdFacturacionConfig { get; set; }
        public int IdUser { get; set; }
        public DateTime? FechaPago { get; set; }
        public DateTime FechaCorte { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public DateTime FechaCreacionFactura { get; set; }
        public string Estado { get; set; }
    }
}
