"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const routes_1 = __importDefault(require("./routes"));
const auth_1 = __importDefault(require("./routes/auth"));
const errorHandler_1 = require("./utils/errorHandler");
const logger_1 = __importDefault(require("./utils/logger"));
require("./config/passport"); // Import passport config
dotenv_1.default.config();
const app = (0, express_1.default)();
logger_1.default.info("Server is starting...");
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
    console.error('MongoDB connection error:', err);
    logger_1.default.error("An error occurred");
});
// Routes
app.use('/api', routes_1.default);
// Register the auth routes
app.use("/auth", auth_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
