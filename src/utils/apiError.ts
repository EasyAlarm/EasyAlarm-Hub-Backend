class ApiError extends Error
{
    private statusCode?: number;

    public getStatusCode(): number
    {
        return this.statusCode || 500;
    }

    constructor(message: string, statusCode: number)
    {
        super(message);
        this.statusCode = statusCode;
    }
}

export default ApiError;
