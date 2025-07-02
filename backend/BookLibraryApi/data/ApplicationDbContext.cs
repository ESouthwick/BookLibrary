// backend/BookLibraryApi/Data/ApplicationDbContext.cs
using BookLibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookLibraryApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Book> Books { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Optional: Seed initial data for testing
            modelBuilder.Entity<Book>().HasData(
                new Book { Id = Guid.NewGuid(), Title = "The Hitchhiker's Guide to the Galaxy", Author = "Douglas Adams", Genre = "Science Fiction", PublishedDate = new DateTime(1979, 10, 12, 0, 0, 0, DateTimeKind.Utc), Rating = 5 },
                new Book { Id = Guid.NewGuid(), Title = "1984", Author = "George Orwell", Genre = "Dystopian", PublishedDate = new DateTime(1949, 6, 8, 0, 0, 0, DateTimeKind.Utc), Rating = 4 },
                new Book { Id = Guid.NewGuid(), Title = "Pride and Prejudice", Author = "Jane Austen", Genre = "Romance", PublishedDate = new DateTime(1813, 1, 28, 0, 0, 0, DateTimeKind.Utc), Rating = 5 }
            );
        }
    }
}