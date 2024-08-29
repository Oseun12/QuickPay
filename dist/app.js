"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const auth_1 = __importDefault(require("./routes/auth"));
require("./config/passport");
const bodyParser = require("body-parser");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//To connect to the database
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to Database'))
    .catch(err => console.log(err));
app.use('/api', auth_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
