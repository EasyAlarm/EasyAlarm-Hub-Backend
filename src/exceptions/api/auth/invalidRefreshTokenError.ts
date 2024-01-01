import UnauthorizedError from "../unauthorizedError";

class InvalidRefreshTokenError extends UnauthorizedError
{
    private static readonly customErrorCode = "INVALID_REFRESH_TOKEN";
    private static readonly customMessage = "Invalid Refresh Token";

    constructor()
    {
        super(InvalidRefreshTokenError.customMessage, InvalidRefreshTokenError.customErrorCode);
    }
}

export default InvalidRefreshTokenError;