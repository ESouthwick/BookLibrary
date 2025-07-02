using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using BookLibraryApi.Controllers;
using BookLibraryApi.Data;
using BookLibraryApi.Models;

namespace BookLibraryApi.Tests
{
    public class BooksControllerTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly BooksController _controller;

        public BooksControllerTests()
        {
            // Setup in-memory database with unique name for each test
            var databaseName = Guid.NewGuid().ToString();
            var services = new ServiceCollection();
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase(databaseName));

            var serviceProvider = services.BuildServiceProvider();
            _context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            _context.Database.EnsureCreated();

            // Clear any seeded data for clean test state
            _context.Books.RemoveRange(_context.Books);
            _context.SaveChanges();

            _controller = new BooksController(_context);
        }

        [Fact]
        public async Task GetBooks_ReturnsAllBooks()
        {
            // Arrange
            var books = new List<Book>
            {
                new Book { Title = "Test Book 1", Author = "Author 1", Genre = "Fiction", PublishedDate = DateTime.UtcNow, Rating = 4 },
                new Book { Title = "Test Book 2", Author = "Author 2", Genre = "Non-Fiction", PublishedDate = DateTime.UtcNow, Rating = 5 }
            };
            await _context.Books.AddRangeAsync(books);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetBooks();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Book>>>(result);
            var returnedBooks = Assert.IsType<List<Book>>(actionResult.Value);
            Assert.Equal(2, returnedBooks.Count);
        }

        [Fact]
        public async Task GetBooks_ReturnsEmptyList_WhenNoBooksExist()
        {
            // Act
            var result = await _controller.GetBooks();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Book>>>(result);
            var returnedBooks = Assert.IsType<List<Book>>(actionResult.Value);
            Assert.Empty(returnedBooks);
        }

        [Fact]
        public async Task GetBook_ReturnsBook_WhenBookExists()
        {
            // Arrange
            var book = new Book { Title = "Test Book", Author = "Test Author", Genre = "Fiction", PublishedDate = DateTime.UtcNow, Rating = 4 };
            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetBook(book.Id);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Book>>(result);
            var returnedBook = Assert.IsType<Book>(actionResult.Value);
            Assert.Equal(book.Id, returnedBook.Id);
            Assert.Equal(book.Title, returnedBook.Title);
        }

        [Fact]
        public async Task GetBook_ReturnsNotFound_WhenBookDoesNotExist()
        {
            // Arrange
            var nonExistentId = Guid.NewGuid();

            // Act
            var result = await _controller.GetBook(nonExistentId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Book>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async Task GetBookStats_ReturnsCorrectStats()
        {
            // Arrange
            var books = new List<Book>
            {
                new Book { Title = "Book 1", Author = "Author 1", Genre = "Fiction", PublishedDate = DateTime.UtcNow, Rating = 4 },
                new Book { Title = "Book 2", Author = "Author 2", Genre = "Fiction", PublishedDate = DateTime.UtcNow, Rating = 5 },
                new Book { Title = "Book 3", Author = "Author 3", Genre = "Non-Fiction", PublishedDate = DateTime.UtcNow, Rating = 3 }
            };
            await _context.Books.AddRangeAsync(books);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetBookStats();

            // Assert
            var actionResult = Assert.IsType<ActionResult<Dictionary<string, int>>>(result);
            var stats = Assert.IsType<Dictionary<string, int>>(actionResult.Value);
            Assert.Equal(2, stats["Fiction"]);
            Assert.Equal(1, stats["Non-Fiction"]);
        }

        [Fact]
        public async Task PostBook_CreatesNewBook()
        {
            // Arrange
            var book = new Book { Title = "New Book", Author = "New Author", Genre = "Fiction", PublishedDate = DateTime.UtcNow, Rating = 4 };

            // Act
            var result = await _controller.PostBook(book);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Book>>(result);
            var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var createdBook = Assert.IsType<Book>(createdResult.Value);
            Assert.NotEqual(Guid.Empty, createdBook.Id);
            Assert.Equal(book.Title, createdBook.Title);
            Assert.Equal(book.Author, createdBook.Author);
        }

        [Fact]
        public async Task PostBook_GeneratesNewId_WhenIdIsEmpty()
        {
            // Arrange
            var book = new Book { Id = Guid.Empty, Title = "New Book", Author = "New Author", Genre = "Fiction", PublishedDate = DateTime.UtcNow, Rating = 4 };

            // Act
            var result = await _controller.PostBook(book);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Book>>(result);
            var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var createdBook = Assert.IsType<Book>(createdResult.Value);
            Assert.NotEqual(Guid.Empty, createdBook.Id);
        }

        [Fact]
        public async Task PostBook_ConvertsPublishedDateToUtc()
        {
            // Arrange
            var localDate = DateTime.Now;
            var book = new Book { Title = "New Book", Author = "New Author", Genre = "Fiction", PublishedDate = localDate, Rating = 4 };

            // Act
            var result = await _controller.PostBook(book);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Book>>(result);
            var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var createdBook = Assert.IsType<Book>(createdResult.Value);
            Assert.Equal(DateTimeKind.Utc, createdBook.PublishedDate.Kind);
        }

        [Fact]
        public async Task PutBook_UpdatesExistingBook()
        {
            // Arrange
            var book = new Book { Title = "Original Title", Author = "Original Author", Genre = "Fiction", PublishedDate = DateTime.UtcNow, Rating = 4 };
            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            book.Title = "Updated Title";
            book.Author = "Updated Author";

            // Act
            var result = await _controller.PutBook(book.Id, book);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var updatedBook = await _context.Books.FindAsync(book.Id);
            Assert.Equal("Updated Title", updatedBook.Title);
            Assert.Equal("Updated Author", updatedBook.Author);
        }

        [Fact]
        public async Task PutBook_ReturnsBadRequest_WhenIdMismatch()
        {
            // Arrange
            var book = new Book { Id = Guid.NewGuid(), Title = "Test Book", Author = "Test Author", Genre = "Fiction", PublishedDate = DateTime.UtcNow, Rating = 4 };
            var differentId = Guid.NewGuid();

            // Act
            var result = await _controller.PutBook(differentId, book);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task PutBook_ReturnsNotFound_WhenBookDoesNotExist()
        {
            // Arrange
            var nonExistentId = Guid.NewGuid();
            var book = new Book { Id = nonExistentId, Title = "Test Book", Author = "Test Author", Genre = "Fiction", PublishedDate = DateTime.UtcNow, Rating = 4 };

            // Act
            var result = await _controller.PutBook(nonExistentId, book);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task DeleteBook_RemovesBook_WhenBookExists()
        {
            // Arrange
            var book = new Book { Title = "Book to Delete", Author = "Author", Genre = "Fiction", PublishedDate = DateTime.UtcNow, Rating = 4 };
            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteBook(book.Id);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var deletedBook = await _context.Books.FindAsync(book.Id);
            Assert.Null(deletedBook);
        }

        [Fact]
        public async Task DeleteBook_ReturnsNotFound_WhenBookDoesNotExist()
        {
            // Arrange
            var nonExistentId = Guid.NewGuid();

            // Act
            var result = await _controller.DeleteBook(nonExistentId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
} 