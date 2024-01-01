import UnauthorizedError from "../unauthorizedError";

class InvalidCredentialsError extends UnauthorizedError
{
    private static readonly customErrorCode = "INVALID_CREDENTIALS";
    private static readonly customMessage = "Invalid credentials";

    constructor()
    {
        super(InvalidCredentialsError.customMessage, InvalidCredentialsError.customErrorCode);
    }
}

export default InvalidCredentialsError;
