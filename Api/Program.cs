using Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddPixelDrainService(builder.Configuration);

builder.Services.AddControllers();

builder.Services.AddCors();

var app = builder.Build();

app.UseCors(options =>
{
    if (!string.IsNullOrWhiteSpace(builder.Configuration["AllowedOrigins"]))
    {
        options.WithOrigins(builder.Configuration["AllowedOrigins"].Split(","))
            .AllowAnyHeader().AllowAnyMethod();
    }
    else
        options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
});

app.MapControllers();

app.Run();