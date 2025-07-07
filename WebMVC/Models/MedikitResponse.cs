using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class MedikitResponse
    {
        public bool operationSuccess { get; set; }
        public string objectResponse { get; set; }
        public string successMessage { get; set; }
        public string errorMessage { get; set; }
        public DateTime operationDate { get; set; }
    }
}
