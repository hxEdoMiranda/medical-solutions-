using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace WebMVC.Models
{
    public class EncuestaCondiciones
    {
        public string Titulo { get; set; }
        public List<Condiciones> Condiciones { get; set; }
    }

    public class Condiciones
    {
        public string Condicion { get; set; }
        public string Asset_url { get; set; }
    }
}
