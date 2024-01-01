import ApiError from "./apiError";

class InternalServerError extends ApiError
{
    private static readonly statusCode = 500;
    private static readonly errorCode = "INTERNAL_SERVER_ERROR";

    constructor(message: string = "Internal Server Error")
    {
        super(message, InternalServerError.statusCode, InternalServerError.errorCode);
    }
}

export default InternalServerError;