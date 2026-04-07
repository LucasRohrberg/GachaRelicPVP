import express from "express";
import cors from "cors";
import { EnkaClient } from "enka-network-api";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const enka = new EnkaClient();

app.use(cors());
app.use(express.json());

function getCircularReplacer() {
  const seen = new WeakSet();
  return (key: string, value: unknown) => {
    if (key === "enka") {
      return undefined;
    }
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  };
}

app.get("/api/user/:uid", async (req, res) => {
  const uid = Number(req.params.uid);
  if (Number.isNaN(uid)) {
    return res.status(400).json({ error: "Invalid uid" });
  }

  try {
    const user = await enka.fetchUser(uid);
    const safeUser = JSON.parse(JSON.stringify(user, getCircularReplacer()));
    return res.json(safeUser);
  } catch (error) {
    console.error("fetchUser error", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
