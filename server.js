const app = require('./app');
const hubCore = require('./hub/hubCore');

const connectDB = require('./config/db');

connectDB();

const PORT = process.env.PORT || 5000;

hubCore.init();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

