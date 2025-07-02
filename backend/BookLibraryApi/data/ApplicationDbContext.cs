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
                new Book { Id = new Guid("11111111-1111-1111-1111-111111111111"), Title = "The Hitchhiker's Guide to the Galaxy", Author = "Douglas Adams", Genre = "Science Fiction", PublishedDate = new DateTime(1979, 10, 12, 0, 0, 0, DateTimeKind.Utc), Rating = 5 },
                new Book { Id = new Guid("22222222-2222-2222-2222-222222222222"), Title = "1984", Author = "George Orwell", Genre = "Dystopian", PublishedDate = new DateTime(1949, 6, 8, 0, 0, 0, DateTimeKind.Utc), Rating = 4 },
                new Book { Id = new Guid("33333333-3333-3333-3333-333333333333"), Title = "Pride and Prejudice", Author = "Jane Austen", Genre = "Romance", PublishedDate = new DateTime(1813, 1, 28, 0, 0, 0, DateTimeKind.Utc), Rating = 5 },
                new Book { Id = new Guid("44444444-4444-4444-4444-444444444444"), Title = "To Kill a Mockingbird", Author = "Harper Lee", Genre = "Fiction", PublishedDate = new DateTime(1960, 7, 11, 0, 0, 0, DateTimeKind.Utc), Rating = 5 },
                new Book { Id = new Guid("55555555-5555-5555-5555-555555555555"), Title = "The Great Gatsby", Author = "F. Scott Fitzgerald", Genre = "Fiction", PublishedDate = new DateTime(1925, 4, 10, 0, 0, 0, DateTimeKind.Utc), Rating = 4 },
                new Book { Id = new Guid("66666666-6666-6666-6666-666666666666"), Title = "Dune", Author = "Frank Herbert", Genre = "Science Fiction", PublishedDate = new DateTime(1965, 8, 1, 0, 0, 0, DateTimeKind.Utc), Rating = 5 },
                new Book { Id = new Guid("77777777-7777-7777-7777-777777777777"), Title = "The Hobbit", Author = "J.R.R. Tolkien", Genre = "Fantasy", PublishedDate = new DateTime(1937, 9, 21, 0, 0, 0, DateTimeKind.Utc), Rating = 5 },
                new Book { Id = new Guid("88888888-8888-8888-8888-888888888888"), Title = "The Lord of the Rings", Author = "J.R.R. Tolkien", Genre = "Fantasy", PublishedDate = new DateTime(1954, 7, 29, 0, 0, 0, DateTimeKind.Utc), Rating = 5 },
                new Book { Id = new Guid("99999999-9999-9999-9999-999999999999"), Title = "Brave New World", Author = "Aldous Huxley", Genre = "Dystopian", PublishedDate = new DateTime(1932, 1, 1, 0, 0, 0, DateTimeKind.Utc), Rating = 4 },
                new Book { Id = new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), Title = "Jane Eyre", Author = "Charlotte Brontë", Genre = "Romance", PublishedDate = new DateTime(1847, 10, 16, 0, 0, 0, DateTimeKind.Utc), Rating = 4 },
                new Book { Id = new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), Title = "The Catcher in the Rye", Author = "J.D. Salinger", Genre = "Fiction", PublishedDate = new DateTime(1951, 7, 16, 0, 0, 0, DateTimeKind.Utc), Rating = 3 },
                new Book { Id = new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), Title = "Fahrenheit 451", Author = "Ray Bradbury", Genre = "Dystopian", PublishedDate = new DateTime(1953, 10, 19, 0, 0, 0, DateTimeKind.Utc), Rating = 4 },
                new Book { Id = new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), Title = "The Alchemist", Author = "Paulo Coelho", Genre = "Fiction", PublishedDate = new DateTime(1988, 1, 1, 0, 0, 0, DateTimeKind.Utc), Rating = 4 },
                new Book { Id = new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), Title = "The Martian", Author = "Andy Weir", Genre = "Science Fiction", PublishedDate = new DateTime(2011, 1, 1, 0, 0, 0, DateTimeKind.Utc), Rating = 4 },
                new Book { Id = new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), Title = "Gone Girl", Author = "Gillian Flynn", Genre = "Thriller", PublishedDate = new DateTime(2012, 6, 5, 0, 0, 0, DateTimeKind.Utc), Rating = 4 }
            );
        }
    }
}