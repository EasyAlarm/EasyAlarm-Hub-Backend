class ApiError extends Error
{
    private statusCode: number;
    private errorCode: string;

    public getStatusCode(): number
    {
        return this.statusCode;
    }

    public getErrorCode(): string
    {
        return this.errorCode;
    }

    constructor(message: string, statusCode: number, errorCode: string)
    {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}

export default ApiError;
