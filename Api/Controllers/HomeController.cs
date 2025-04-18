using System.Net;
using Api.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[Action]")]
    public class Home : ControllerBase
    {
        private readonly IFileUploadService _fileUploadService;

        public Home(IFileUploadService fileUploadService)
        {
            _fileUploadService = fileUploadService;
        }

        [HttpPost]
        public async Task<ActionResult> Upload(IFormFile file)
        {
            try
            {
                var res = await _fileUploadService.UploadAsync(file);

                if (!res.IsSuccess) return BadRequest(res.ErrorMessage);

                return Ok(res.Result);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}