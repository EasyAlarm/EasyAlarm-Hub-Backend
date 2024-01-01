import BadRequestError from "../badRequestError";

class AccountAlreadyRegisteredError extends BadRequestError
{
    private static readonly customErrorCode = "ACCOUNT_ALREADY_REGISTERED";
    private static readonly customMessage = "You have already registered an account";

    constructor()
    {
        super(AccountAlreadyRegisteredError.customMessage, AccountAlreadyRegisteredError.customErrorCode);
    }
}

export default AccountAlreadyRegisteredError;
