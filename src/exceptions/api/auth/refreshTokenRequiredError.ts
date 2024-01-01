import UnauthorizedError from "../unauthorizedError";

class RefreshTokenRequiredError extends UnauthorizedError
{
    private static readonly customErrorCode = "REFRESH_TOKEN_REQUIRED";
    private static readonly customMessage = "Refresh Token required";

    constructor()
    {
        super(RefreshTokenRequiredError.customMessage, RefreshTokenRequiredError.customErrorCode);
    }
}

export default RefreshTokenRequiredError;
