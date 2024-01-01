import NotFoundError from "./notFoundError";

class RouteNotFoundError extends NotFoundError
{
    private static readonly customMessage = "Route not found";

    constructor()
    {
        super(RouteNotFoundError.customMessage);
    }
}

export default RouteNotFoundError;
