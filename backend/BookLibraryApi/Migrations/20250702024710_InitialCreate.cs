using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BookLibraryApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Books",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 250, nullable: false),
                    Author = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Genre = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    PublishedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "Id", "Author", "Genre", "PublishedDate", "Rating", "Title" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Douglas Adams", "Science Fiction", new DateTime(1979, 10, 12, 0, 0, 0, 0, DateTimeKind.Utc), 5, "The Hitchhiker's Guide to the Galaxy" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "George Orwell", "Dystopian", new DateTime(1949, 6, 8, 0, 0, 0, 0, DateTimeKind.Utc), 4, "1984" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "Jane Austen", "Romance", new DateTime(1813, 1, 28, 0, 0, 0, 0, DateTimeKind.Utc), 5, "Pride and Prejudice" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "Harper Lee", "Fiction", new DateTime(1960, 7, 11, 0, 0, 0, 0, DateTimeKind.Utc), 5, "To Kill a Mockingbird" },
                    { new Guid("55555555-5555-5555-5555-555555555555"), "F. Scott Fitzgerald", "Fiction", new DateTime(1925, 4, 10, 0, 0, 0, 0, DateTimeKind.Utc), 4, "The Great Gatsby" },
                    { new Guid("66666666-6666-6666-6666-666666666666"), "Frank Herbert", "Science Fiction", new DateTime(1965, 8, 1, 0, 0, 0, 0, DateTimeKind.Utc), 5, "Dune" },
                    { new Guid("77777777-7777-7777-7777-777777777777"), "J.R.R. Tolkien", "Fantasy", new DateTime(1937, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), 5, "The Hobbit" },
                    { new Guid("88888888-8888-8888-8888-888888888888"), "J.R.R. Tolkien", "Fantasy", new DateTime(1954, 7, 29, 0, 0, 0, 0, DateTimeKind.Utc), 5, "The Lord of the Rings" },
                    { new Guid("99999999-9999-9999-9999-999999999999"), "Aldous Huxley", "Dystopian", new DateTime(1932, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 4, "Brave New World" },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "Charlotte Brontë", "Romance", new DateTime(1847, 10, 16, 0, 0, 0, 0, DateTimeKind.Utc), 4, "Jane Eyre" },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "J.D. Salinger", "Fiction", new DateTime(1951, 7, 16, 0, 0, 0, 0, DateTimeKind.Utc), 3, "The Catcher in the Rye" },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), "Ray Bradbury", "Dystopian", new DateTime(1953, 10, 19, 0, 0, 0, 0, DateTimeKind.Utc), 4, "Fahrenheit 451" },
                    { new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd"), "Paulo Coelho", "Fiction", new DateTime(1988, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 4, "The Alchemist" },
                    { new Guid("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), "Andy Weir", "Science Fiction", new DateTime(2011, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 4, "The Martian" },
                    { new Guid("ffffffff-ffff-ffff-ffff-ffffffffffff"), "Gillian Flynn", "Thriller", new DateTime(2012, 6, 5, 0, 0, 0, 0, DateTimeKind.Utc), 4, "Gone Girl" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Books");
        }
    }
}
