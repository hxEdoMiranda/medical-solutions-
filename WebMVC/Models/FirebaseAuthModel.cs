using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class FirebaseAuthModel
    {
        public string Token { get; set; }
        public string Uid { get; set; }
        public string Nombre { get; set; }
        public int IdCliente { get; set; }
        public string Correo { get; set; }
        public string? Celular { get; set; }
        public string Foto { get; set; }
        public bool Verificado { get; set; }
        public string MetodoSignIn { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}
