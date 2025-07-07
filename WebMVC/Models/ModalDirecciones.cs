using System.Collections.Generic;

namespace WebMVC.Models
{
    public class ModalDirecciones
    {
        public int UserId { get; set; } = 0;
        public string Type { get; set; } = string.Empty;
        public IList<Address> Addresses { get; set; } = new List<Address>();
        public PersonasViewModel Patient { get; set; } = new PersonasViewModel();
    }
}
