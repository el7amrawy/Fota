namespace Api.Common
{
    public class ServiceResult<TResult>
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }
        public TResult Result { get; set; }
        public ServiceResult(bool isSuccess, TResult result, string errorMessage = null)
        {
            IsSuccess = isSuccess;
            ErrorMessage = errorMessage;
            Result = result;
        }
        public static ServiceResult<TResult> Success(TResult result) => new(true, result);
        public static ServiceResult<TResult> Failure(string errorMessage) => new(false, default, errorMessage);
    }
}