const http = require("http");
const express = require("express");
const app = express();
const httpServer = http.createServer(app); //server creation by http inbuit node module;
const { connection } = require("./Configs/Configs");
require("dotenv").config();
const cors = require("cors"); //This middleware allows you to define which origins can access your API, what methods (GET, POST, etc.) are allowed, and what headers can be included in the request.
const PORT = process.env.PORT || 3000; //defined port 8080 (default 3000) excluding 27017 (reserved port by Mongod);

//Different Routers for different frontend pages in UI;
const { userRouter } = require("./Routes/users.route");
const { validate } = require("./Middleware/validate.middleware");
const { EventRouter } = require("./Routes/event.route");
const { availableRouter } = require("./Routes/availability.route");
const { calenderIntegrationRoute } = require("./Routes/calenderIntegration.route");
const { notificationRouter } = require("./Routes/notification.route");


//Inbuilt middlewares;
app.use(express.text());
app.use(express.json());
app.use(cors());

//Landing/default route;
app.get("/", async (req, res) => {
    res.send("Welcome to Appointment Easy 😊!!!");
});

//Fixed starting end points for making nested dynamic route;
app.use('/users', userRouter);
app.use('/', calenderIntegrationRoute);
app.use('/notification', notificationRouter);
app.use(validate); // use custom middleware
app.use('/events', EventRouter);
app.use('/availability', availableRouter);


//server code for start or live my server at defined port;
httpServer.listen(PORT, async () => {
    try {
        await connection;
        console.log("connected to DB");
    } catch (e) {
        console.log({ message: e.message });
    }
    console.log(`Server is running at port ${PORT}`);
});