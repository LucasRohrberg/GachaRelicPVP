import express from "express";
import cors from "cors";
import { EnkaClient } from "enka-network-api";
import { StarRail } from "starrail.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const enka = new EnkaClient();
const starRail = new StarRail();

app.use(cors());
app.use(express.json());

function getCircularReplacer() {
  const seen = new WeakSet();
  return (key: string, value: unknown) => {
    if (key === "enka") {
      return undefined;
    }
    if (typeof value === "bigint") {
      return value.toString();
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

app.get("/api/user/:game/:uid", async (req, res) => {
  const { game, uid } = req.params;

  if (Number.isNaN(Number(uid))) {
    return res.status(400).json({ error: "Invalid uid" });
  }

  try {
    let user;

    switch (game) {
      case "genshin":
        user = await enka.fetchUser(uid);
        break;
      case "hsr":
        user = await starRail.fetchUser(uid);
        break;
      default:
        return res.status(400).json({ error: "Invalid game" });
    }

    const safeUser = JSON.parse(JSON.stringify(user, getCircularReplacer()));
    // normalize data format
    if (game === "hsr") {
      safeUser.characters = [
        ...(safeUser.supportCharacters ?? []),
        ...(safeUser.starfaringCompanions ?? []),
      ];
    }
    // fix asset reference
    if (game === "genshin") {
      for (let i = 0; i < safeUser.characters.length; i++) {
        const character = safeUser.characters[i].characterData._nameId;
        safeUser.characters[i].characterData.splashImage.url =
          `https://api.lunaris.moe/data/assets/gachaimg/UI_Gacha_AvatarImg_${character}.png`;
      }
    }
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
