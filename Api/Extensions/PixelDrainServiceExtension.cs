using System.Text;
using Api.Helpers;
using Api.Interfaces;
using Api.Services;
using Microsoft.Extensions.Options;

namespace Api.Extensions
{
    public static class PixelDrainServiceExtension
    {
        public static IServiceCollection AddPixelDrainService(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<PixelDrainSettings>(config.GetSection("PixelDrain"));

            services.AddHttpClient("PixelDrain", (serviceProvider, client) =>
            {
                var settings = serviceProvider.GetRequiredService<IOptions<PixelDrainSettings>>().Value;

                var header = "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes(":" + settings.ApiKey));

                client.DefaultRequestHeaders.Add("Authorization", header);
                client.BaseAddress = new Uri(settings.BaseUrl);
            });

            services.AddScoped<IFileUploadService, FileUploadService>();

            return services;
        }
    }
}