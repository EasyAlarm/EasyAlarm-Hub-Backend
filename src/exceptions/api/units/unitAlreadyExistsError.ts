import BadRequestError from "../badRequestError";

class UnitAlreadyExistsError extends BadRequestError
{
    private static readonly customErrorCode = "UNIT_ALREADY_EXISTS";
    private static readonly customMessage = "Unit already exists";

    constructor()
    {
        super(UnitAlreadyExistsError.customMessage, UnitAlreadyExistsError.customErrorCode);
    }
}

export default UnitAlreadyExistsError;
