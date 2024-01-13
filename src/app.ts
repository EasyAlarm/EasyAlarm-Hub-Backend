import express, { Application, Request, Response, NextFunction } from 'express';
import errorHandler from './middleware/errorHandler';
import protect from './middleware/protect';

import unitRouter from './routes/unitRoutes';
import userRouter from './routes/userRoutes';
import logRouter from './routes/logRoutes';
import profileRouter from './routes/profileRoute';
import rfidRouter from './routes/rfidRoute';
import hubRouter from './routes/hubRoute';
import settingsRouter from './routes/settingsRoute';
import cors from 'cors';
import RouteNotFoundError from './exceptions/api/routeNotFoundError';

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
        this.express.use(cors());
    }

    private initializeRouters(): void
    {
        this.express.use('/api/user', userRouter);
        this.express.use('/api/unit', protect, unitRouter);
        this.express.use('/api/log', protect, logRouter);
        this.express.use('/api/profile', protect, profileRouter);
        this.express.use('/api/hub', protect, hubRouter);
        this.express.use('/api/settings', protect, settingsRouter);
        this.express.use('/api/rfid', protect, rfidRouter);

        this.express.get('/', protect, (req: Request, res: Response) => res.send("Auth route"));

        this.express.all('*', (req: Request, res: Response, next: NextFunction) =>
        {
            next(new RouteNotFoundError());
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