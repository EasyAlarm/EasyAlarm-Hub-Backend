import App from './app';
import 'dotenv/config';

const PORT: number = Number(process.env.PORT) || 5000;

const app = new App(PORT);

app.listen();

