import BadRequestError from "../badRequestError";

class ProfileDoesNotExist extends BadRequestError
{
    private static readonly customErrorCode = "PROFILE_DOES_NOT_EXIST";
    private static readonly customMessage = "Profile does not exist";

    constructor()
    {
        super(ProfileDoesNotExist.customMessage, ProfileDoesNotExist.customErrorCode);
    }
}

export default ProfileDoesNotExist;
