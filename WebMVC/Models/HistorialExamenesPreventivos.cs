using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace WebMVC.Models
{
    
        public class HistorialExamenesPreventivos 
        {

            public int Id { get; set; }
            public int IdUsuario { get; set; }
            public int IdCliente { get; set; }
            public int Edad { get; set; }
            public int Peso { get; set; }
            public string Estatura { get; set; }
            public List<string> Examenes { get; set; }
            public DateTime FechaSolicitud { get; set; }
            public List<Archivo> Archivos { get; set; }
            public int IdEntidadAsociada { get; set; }
            public string Nombre { get; set; }
            public string Estado { get; set; }

        public string idenc
        {
            get
            {
                return Encriptar(Id.ToString());

            }

        }
        public String Encriptar(string cadena)
        {
            byte[] keyArray;

            MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
            keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes("88dkE#$Rfg32eNN?l7"));

            hashmd5.Clear();
            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
            tdes.Key = keyArray;
            tdes.Mode = CipherMode.ECB;
            tdes.Padding = PaddingMode.PKCS7;
            ICryptoTransform cEncriptor = tdes.CreateEncryptor();

            byte[] inBlock = Encoding.UTF8.GetBytes(cadena);
            byte[] cadenaEcnriptada = cEncriptor.TransformFinalBlock(inBlock, 0, inBlock.Length);
            string base64String = Convert.ToBase64String(cadenaEcnriptada, 0, cadenaEcnriptada.Length);

            return HttpUtility.UrlEncode(base64String);
        }

    }
    }
