using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller=Home]")]
    public class Home : ControllerBase
    {
        [HttpPost]
        public ActionResult Upload(IFormFile file)
        {
            return Ok();
        }
    }
}