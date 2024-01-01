import ApiError from "./apiError";

class BadRequestError extends ApiError
{
    private static readonly defaultStatusCode = 400;
    private static readonly defaultErrorCode = "BAD_REQUEST";

    constructor(message: string = "Bad request", errorCode: string = BadRequestError.defaultErrorCode)
    {
        super(message, BadRequestError.defaultStatusCode, errorCode);
    }
}

export default BadRequestError;
