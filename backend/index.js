import express from "express";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/shorturls", urlRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
