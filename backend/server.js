import app from "./src/app.js";
import dotenv from 'dotenv';
import connectDB from "./src/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
        console.log(`Server health check http://localhost:${PORT}/api/health`);
    });
};

start();
