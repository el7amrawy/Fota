using Api.Common;

namespace Api.Interfaces
{
    public interface IFileUploadService
    {
        public Task<ServiceResult<string>> UploadAsync(IFormFile file);
    }
}