// backend/BookLibraryApi/Models/Book.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookLibraryApi.Models
{
    public class Book
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } // GUID [cite: 10]

        [Required]
        [StringLength(250)]
        public string Title { get; set; } // string [cite: 11]

        [Required]
        [StringLength(150)]
        public string Author { get; set; } // string [cite: 12]

        [Required]
        [StringLength(100)]
        public string Genre { get; set; } // string [cite: 13]

        [Required]
        public DateTime PublishedDate { get; set; } // DateTime [cite: 14]

        [Range(1, 5)]
        public int Rating { get; set; } // int, 1-5 [cite: 15]
    }
}