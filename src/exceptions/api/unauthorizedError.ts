import ApiError from "./apiError";

class UnauthorizedError extends ApiError
{
    private static readonly defaultStatusCode = 401;
    private static readonly defaultErrorCode = "UNAUTHORIZED";

    constructor(message: string = "Unauthorized access", errorCode: string = UnauthorizedError.defaultErrorCode)
    {
        super(message, UnauthorizedError.defaultStatusCode, errorCode);
    }
}

export default UnauthorizedError;