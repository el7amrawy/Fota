using System.Net.Http.Headers;
using System.Text.Json;
using Api.Common;
using Api.Interfaces;

namespace Api.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IHttpClientFactory _factory;
        public FileUploadService(IHttpClientFactory factory)
        {
            _factory = factory;
        }
        public async Task<ServiceResult<string>> UploadAsync(IFormFile file)
        {
            if (file == null || file.Length < 1) return ServiceResult<string>.Failure("invalid file");

            var client = _factory.CreateClient("PixelDrain");

            var form = new MultipartFormDataContent();

            var fileContent = new StreamContent(file.OpenReadStream());
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(file.ContentType);

            form.Add(fileContent, "file", file.FileName);

            var response = await client.PostAsync("file", form);

            var result = await response.Content.ReadFromJsonAsync<PixelDrainResponse>();

            if (!result.Success) return ServiceResult<string>.Failure(result.Message);

            return ServiceResult<string>.Success("https://pixeldrain.com/api/file/" + result.Id);
        }
    }
}