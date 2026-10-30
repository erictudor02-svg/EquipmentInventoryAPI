import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool, testConnection } from "./config/database";
import equipmentRoutes from "./routes/equipment.routes";
import { errorHandler } from "./middleware/error-handler";
import { ApiError } from "./errors/api-error";

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use(cors({
  origin: ["http://localhost:4200", "http://localhost:3000"]
}));

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Equipment Inventory API is running." });
});

app.use("/api/equipment-items", equipmentRoutes);

app.use((_req, _res, next) => {
  next(new ApiError(404, "NOT_FOUND", "API route not found."));
});

app.use(errorHandler);

async function startServer(): Promise<void> {
  try {
    await testConnection();

    app.listen(port, () => {
      console.log(
        `Equipment Inventory API listening at http://localhost:${port}`
      );
    });
  } catch (error) {
    console.error("Unable to start the API:", error);
    await pool.end();
    process.exitCode = 1;
  }
}

void startServer();