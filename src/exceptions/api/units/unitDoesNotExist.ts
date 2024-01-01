import BadRequestError from "../badRequestError";

class UnitDoesNotExistError extends BadRequestError
{
    private static readonly customErrorCode = "UNIT_DOES_NOT_EXIST";
    private static readonly customMessage = "Unit does not exist";

    constructor()
    {
        super(UnitDoesNotExistError.customMessage, UnitDoesNotExistError.customErrorCode);
    }
}

export default UnitDoesNotExistError;
