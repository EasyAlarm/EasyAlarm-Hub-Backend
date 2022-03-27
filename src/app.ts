import express, { Application, Request, Response, NextFunction } from 'express';
import PayloadType from './hub/payloadType';
import UnitCommander from './hub/unitCommander';
import errorHandler from './middleware/errorHandler';
import protect from './middleware/protect';

import unitRouter from './routes/unitRoutes';
import userRouter from './routes/userRoutes';
import logRouter from './routes/logRoutes';
import ApiError from './utils/apiError';

class App
{
    public express: Application;
    public port: number;

    constructor(port: number)
    {
        this.express = express();
        this.port = port;

        this.initializeLoader();
        this.initalizeMiddleware();
        this.initializeRouters();
        this.initializeErrorHandling();
    }

    public listen(): void
    {
        this.express.listen(this.port, () => 
        {
            console.log(`App listening on port ${this.port}`);
        });
    }

    private initalizeMiddleware(): void 
    {
        this.express.use(express.json());
    }

    private initializeRouters(): void
    {
        this.express.use('/api/user', userRouter);
        this.express.use('/api/unit', unitRouter);
        this.express.use('/api/log', logRouter);

        this.express.get('/', protect, (req: Request, res: Response) => res.send("Auth route"));
        //test routes

        this.express.post('/test/shh', (req: Request, res: Response) => 
        {
            UnitCommander.send("02", PayloadType.CEASE);
            res.send("shh");
        });

        this.express.post('/test/buzz', (req: Request, res: Response) => 
        {
            UnitCommander.send("02", PayloadType.FIRE);
            res.send("buzz");
        });


        this.express.all('*', (req: Request, res: Response, next: NextFunction) =>
        {
            next(new ApiError(" Route not found", 404));
        });


    }


    private initializeErrorHandling(): void
    {
        this.express.use(errorHandler);
    }

    private async initializeLoader(): Promise<void>
    {
        await require('./loaders').default();
    }

}

export default App;