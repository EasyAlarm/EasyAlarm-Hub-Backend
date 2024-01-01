import BadRequestError from "../badRequestError";


class PairingFailedError extends BadRequestError
{
    private static readonly customErrorCode = "PAIRING_FAILED";
    private static readonly customMessage = "Pairing failed or timed out";

    constructor()
    {
        super(PairingFailedError.customMessage, PairingFailedError.customErrorCode);
    }
}

export default PairingFailedError;
