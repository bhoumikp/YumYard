import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./db.js";

import { userRouter } from "./src/routes/users.js";
import { recipesRouter } from "./src/routes/recipes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/auth", userRouter);
app.use("/api/recipes", recipesRouter);

connection()

app.get('/', (req, res) => {
    res.send("API is running");
})

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server running on ${port}`)
);
