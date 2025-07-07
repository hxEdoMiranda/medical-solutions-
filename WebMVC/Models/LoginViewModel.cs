using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebMVC.Models
{
    public class LoginViewModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public string RepeatPassword { get; set; }
        public bool RememberLogin { get; set; }
        public string ReturnUrl { get; set; }
        public string rol { get; set; }
        public string JsonData { get; set; }
        public string Codigo { get; set; }
        public string CodigoProm { get; set; }
        public Guid ActivationCode { get; set; }
        public int NumberActivationCode { get; set; }
        public string Tipo { get; set; }
    }

    
}


