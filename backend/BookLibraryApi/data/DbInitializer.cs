using BookLibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookLibraryApi.Data
{
    public static class DbInitializer
    {
        public static void SeedData(ApplicationDbContext context)
        {
            // Remove the check to allow reseeding

            var books = new List<Book>
            {
                new Book { Title = "The Great Gatsby", Author = "F. Scott Fitzgerald", Genre = "Fiction", PublishedDate = new DateTime(1925, 4, 10), Rating = 4 },
                new Book { Title = "To Kill a Mockingbird", Author = "Harper Lee", Genre = "Fiction", PublishedDate = new DateTime(1960, 7, 11), Rating = 5 },
                new Book { Title = "1984", Author = "George Orwell", Genre = "Science Fiction", PublishedDate = new DateTime(1949, 6, 8), Rating = 4 },
                new Book { Title = "Pride and Prejudice", Author = "Jane Austen", Genre = "Romance", PublishedDate = new DateTime(1813, 1, 28), Rating = 4 },
                new Book { Title = "The Hobbit", Author = "J.R.R. Tolkien", Genre = "Fantasy", PublishedDate = new DateTime(1937, 9, 21), Rating = 5 },
                new Book { Title = "The Catcher in the Rye", Author = "J.D. Salinger", Genre = "Fiction", PublishedDate = new DateTime(1951, 7, 16), Rating = 3 },
                new Book { Title = "Lord of the Flies", Author = "William Golding", Genre = "Fiction", PublishedDate = new DateTime(1954, 9, 17), Rating = 4 },
                new Book { Title = "Animal Farm", Author = "George Orwell", Genre = "Fiction", PublishedDate = new DateTime(1945, 8, 17), Rating = 4 },
                new Book { Title = "The Alchemist", Author = "Paulo Coelho", Genre = "Fiction", PublishedDate = new DateTime(1988, 1, 1), Rating = 4 },
                new Book { Title = "The Little Prince", Author = "Antoine de Saint-Exupéry", Genre = "Fiction", PublishedDate = new DateTime(1943, 4, 6), Rating = 5 },
                new Book { Title = "Harry Potter and the Philosopher's Stone", Author = "J.K. Rowling", Genre = "Fantasy", PublishedDate = new DateTime(1997, 6, 26), Rating = 5 },
                new Book { Title = "The Da Vinci Code", Author = "Dan Brown", Genre = "Thriller", PublishedDate = new DateTime(2003, 3, 18), Rating = 3 },
                new Book { Title = "The Hunger Games", Author = "Suzanne Collins", Genre = "Science Fiction", PublishedDate = new DateTime(2008, 9, 14), Rating = 4 },
                new Book { Title = "The Fault in Our Stars", Author = "John Green", Genre = "Romance", PublishedDate = new DateTime(2012, 1, 10), Rating = 4 },
                new Book { Title = "Gone Girl", Author = "Gillian Flynn", Genre = "Thriller", PublishedDate = new DateTime(2012, 6, 5), Rating = 4 },
                new Book { Title = "The Martian", Author = "Andy Weir", Genre = "Science Fiction", PublishedDate = new DateTime(2011, 9, 27), Rating = 4 },
                new Book { Title = "Ready Player One", Author = "Ernest Cline", Genre = "Science Fiction", PublishedDate = new DateTime(2011, 8, 16), Rating = 3 },
                new Book { Title = "The Girl on the Train", Author = "Paula Hawkins", Genre = "Thriller", PublishedDate = new DateTime(2015, 1, 13), Rating = 3 },
                new Book { Title = "Big Little Lies", Author = "Liane Moriarty", Genre = "Fiction", PublishedDate = new DateTime(2014, 7, 29), Rating = 4 },
                new Book { Title = "The Silent Patient", Author = "Alex Michaelides", Genre = "Thriller", PublishedDate = new DateTime(2019, 2, 5), Rating = 4 },
                new Book { Title = "Educated", Author = "Tara Westover", Genre = "Memoir", PublishedDate = new DateTime(2018, 2, 20), Rating = 5 },
                new Book { Title = "Becoming", Author = "Michelle Obama", Genre = "Memoir", PublishedDate = new DateTime(2018, 11, 13), Rating = 5 },
                new Book { Title = "Sapiens", Author = "Yuval Noah Harari", Genre = "Non-Fiction", PublishedDate = new DateTime(2011, 1, 1), Rating = 4 },
                new Book { Title = "Atomic Habits", Author = "James Clear", Genre = "Self-Help", PublishedDate = new DateTime(2018, 10, 16), Rating = 5 },
                new Book { Title = "The Subtle Art of Not Giving a F*ck", Author = "Mark Manson", Genre = "Self-Help", PublishedDate = new DateTime(2016, 9, 13), Rating = 3 },
                new Book { Title = "Rich Dad Poor Dad", Author = "Robert Kiyosaki", Genre = "Finance", PublishedDate = new DateTime(1997, 4, 1), Rating = 3 },
                new Book { Title = "The 7 Habits of Highly Effective People", Author = "Stephen Covey", Genre = "Self-Help", PublishedDate = new DateTime(1989, 8, 15), Rating = 4 },
                new Book { Title = "Think and Grow Rich", Author = "Napoleon Hill", Genre = "Self-Help", PublishedDate = new DateTime(1937, 3, 1), Rating = 3 },
                new Book { Title = "The Power of Now", Author = "Eckhart Tolle", Genre = "Spirituality", PublishedDate = new DateTime(1997, 1, 1), Rating = 4 },
                new Book { Title = "A Brief History of Time", Author = "Stephen Hawking", Genre = "Science", PublishedDate = new DateTime(1988, 4, 1), Rating = 4 },
                new Book { Title = "The Selfish Gene", Author = "Richard Dawkins", Genre = "Science", PublishedDate = new DateTime(1976, 1, 1), Rating = 4 },
                new Book { Title = "Cosmos", Author = "Carl Sagan", Genre = "Science", PublishedDate = new DateTime(1980, 1, 1), Rating = 5 },
                new Book { Title = "The Art of War", Author = "Sun Tzu", Genre = "Strategy", PublishedDate = new DateTime(1900, 1, 1), Rating = 4 },
                new Book { Title = "The Prince", Author = "Niccolò Machiavelli", Genre = "Politics", PublishedDate = new DateTime(1900, 1, 1), Rating = 3 },
                new Book { Title = "The Republic", Author = "Plato", Genre = "Philosophy", PublishedDate = new DateTime(1900, 1, 1), Rating = 4 },
                new Book { Title = "Meditations", Author = "Marcus Aurelius", Genre = "Philosophy", PublishedDate = new DateTime(1900, 1, 1), Rating = 4 },
                new Book { Title = "The Art of Happiness", Author = "Dalai Lama", Genre = "Spirituality", PublishedDate = new DateTime(1998, 10, 1), Rating = 4 },
                new Book { Title = "The Four Agreements", Author = "Don Miguel Ruiz", Genre = "Self-Help", PublishedDate = new DateTime(1997, 11, 7), Rating = 4 },
                new Book { Title = "The Road Less Traveled", Author = "M. Scott Peck", Genre = "Psychology", PublishedDate = new DateTime(1978, 1, 1), Rating = 4 },
                new Book { Title = "Man's Search for Meaning", Author = "Viktor Frankl", Genre = "Psychology", PublishedDate = new DateTime(1946, 1, 1), Rating = 5 },
                new Book { Title = "The Psychology of Money", Author = "Morgan Housel", Genre = "Finance", PublishedDate = new DateTime(2020, 9, 8), Rating = 4 },
                new Book { Title = "The Intelligent Investor", Author = "Benjamin Graham", Genre = "Finance", PublishedDate = new DateTime(1949, 1, 1), Rating = 4 },
                new Book { Title = "A Random Walk Down Wall Street", Author = "Burton Malkiel", Genre = "Finance", PublishedDate = new DateTime(1973, 1, 1), Rating = 4 },
                new Book { Title = "The Millionaire Next Door", Author = "Thomas Stanley", Genre = "Finance", PublishedDate = new DateTime(1996, 10, 1), Rating = 4 },
                new Book { Title = "Your Money or Your Life", Author = "Vicki Robin", Genre = "Finance", PublishedDate = new DateTime(1992, 1, 1), Rating = 4 },
                new Book { Title = "The Total Money Makeover", Author = "Dave Ramsey", Genre = "Finance", PublishedDate = new DateTime(2003, 9, 1), Rating = 3 },
                new Book { Title = "I Will Teach You To Be Rich", Author = "Ramit Sethi", Genre = "Finance", PublishedDate = new DateTime(2009, 3, 23), Rating = 4 },
                new Book { Title = "The Simple Path to Wealth", Author = "JL Collins", Genre = "Finance", PublishedDate = new DateTime(2016, 6, 1), Rating = 4 },
                new Book { Title = "Bogleheads' Guide to Investing", Author = "Taylor Larimore", Genre = "Finance", PublishedDate = new DateTime(2006, 1, 1), Rating = 4 },
                new Book { Title = "The Little Book of Common Sense Investing", Author = "John Bogle", Genre = "Finance", PublishedDate = new DateTime(2007, 1, 1), Rating = 4 },
                new Book { Title = "Common Stocks and Uncommon Profits", Author = "Philip Fisher", Genre = "Finance", PublishedDate = new DateTime(1958, 1, 1), Rating = 4 },
                new Book { Title = "Security Analysis", Author = "Benjamin Graham", Genre = "Finance", PublishedDate = new DateTime(1934, 1, 1), Rating = 3 },
                new Book { Title = "The Essays of Warren Buffett", Author = "Warren Buffett", Genre = "Finance", PublishedDate = new DateTime(1997, 1, 1), Rating = 5 }
            };

            context.Books.AddRange(books);
            context.SaveChanges();
        }
    }
} 