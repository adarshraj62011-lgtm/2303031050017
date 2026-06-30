import "dotenv/config";
import app from "./app.js";
import { Log } from "../../logging-middleware/index.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  Log("backend", "info", "config", `Notification backend running on port ${PORT}`);
});
