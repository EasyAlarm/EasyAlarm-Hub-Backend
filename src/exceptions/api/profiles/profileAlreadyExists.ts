import BadRequestError from "../badRequestError";

class ProfileAlreadyExistsError extends BadRequestError
{
    private static readonly customErrorCode = "PROFILE_ALREADY_EXISTS";
    private static readonly customMessage = "Profile already exists";

    constructor()
    {
        super(ProfileAlreadyExistsError.customMessage, ProfileAlreadyExistsError.customErrorCode);
    }
}

export default ProfileAlreadyExistsError;
