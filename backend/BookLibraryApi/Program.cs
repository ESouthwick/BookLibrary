using BookLibraryApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Configure SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer(); // This is often already there for new webapi projects
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "BookLibraryApi", Version = "v1" });
});

// Add CORS policy for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policyBuilder => policyBuilder.WithOrigins("http://localhost:5173", "http://localhost:3000") // Vite default port and React default port
                                  .AllowAnyMethod()
                                  .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline (equivalent to 'Configure' method).
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BookLibraryApi v1"));
}

app.UseHttpsRedirection();

app.UseRouting(); // Often implicitly used with app.UseEndpoints or app.MapControllers

app.UseCors("AllowReactApp"); // Apply CORS policy

app.UseAuthorization();

app.MapControllers(); // Maps controller routes

app.Run();