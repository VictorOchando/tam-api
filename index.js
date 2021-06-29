const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//DB connection
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.MONGO_CONNECT, () => console.log("DB connected"));

//Routes
const authRoute = require("./routers/auth");
const customersRoute = require("./routers/customer");
const usersRoute = require("./routers/users");

//Middlewares
app.use(express.json());

//Route Middlewares
app.use("/", authRoute);
app.use("/customers", customersRoute);
app.use("/users", usersRoute);

app.listen(3000, () => console.log("Server listening on port 3000"));
