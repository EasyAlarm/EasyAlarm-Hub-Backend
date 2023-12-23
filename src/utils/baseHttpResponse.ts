export class BaseHttpResponse
{
    status: number;
    message?: string;
    data?: unknown;
    error?: string;

    constructor(status: number)
    {
        this.status = status;
    }

    public setMessage(message?: string): this
    {
        this.message = message;
        return this;
    }

    public setData(data: unknown): this
    {
        this.data = data;
        return this;
    }

    public setError(error: string): this
    {
        this.error = error;
        return this;
    }


    static successResponse(data: unknown, status = 200, message?: string): BaseHttpResponse
    {
        return new BaseHttpResponse(status).setData(data).setMessage(message);
    }

    static successMessageResponse(message: string, status = 200): BaseHttpResponse
    {
        return new BaseHttpResponse(status).setMessage(message);
    }

    static errorResponse(status: number, error: string)
    {
        return new BaseHttpResponse(status).setError(error);
    }
}