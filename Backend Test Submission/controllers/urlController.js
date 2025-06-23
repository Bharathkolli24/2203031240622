import { urlDatabase } from "../models/Url.js";
import logger from "../../Logging Middleware/logMiddleware.js"
const { log } = logger;

const generateShortCode = () => Math.random().toString(36).substring(2, 8);

export const createShortUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    const code = shortcode || generateShortCode();

    if (!url || typeof validity !== "number") {
      await log("backend", "error", "urlController", "Invalid input");
      return res.status(400).json({ error: "Invalid input" });
    }
    if (urlDatabase[code]) {
      await log("backend", "error", "urlController", "Shortcode exists");
      return res.status(400).json({ error: "Shortcode already exists" });
    }

    const expiry = new Date(Date.now() + validity * 60000).toISOString();
    urlDatabase[code] = {
      originalUrl: url,
      expiry,
      createdAt: new Date().toISOString(),
      clickStats: [],
    };

    await log("backend", "info", "urlController", `Created ${code}`);
    return res.status(201).json({
      shortLink: `http://localhost:3001/shorturls/r/${code}`,
      expiry,
    });
  } catch (err) {
    await log("backend", "error", "urlController", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const redirectToOriginalUrl = async (req, res) => {
  const { shortcode } = req.params;
  const record = urlDatabase[shortcode];
  if (!record) {
    await log("backend", "error", "urlController", "Shortcode not found");
    return res.status(404).json({ error: "Shortcode not found" });
  }
  if (new Date().toISOString() > record.expiry) {
    await log("backend", "error", "urlController", "Link expired");
    return res.status(410).json({ error: "Link expired" });
  }

  record.clickStats.push({
    timestamp: new Date().toISOString(),
    source: req.get("referer") || "direct",
    location: "India",
  });

  await log("backend", "info", "urlController", `Redirected ${shortcode}`);
  return res.redirect(record.originalUrl);
};

export const getShortUrlStats = async (req, res) => {
  const { shortcode } = req.params;
  const record = urlDatabase[shortcode];
  if (!record) {
    await log("backend", "error", "urlController", "Stats not found");
    return res.status(404).json({ error: "Shortcode not found" });
  }

  await log("backend", "info", "urlController", `Stats for ${shortcode}`);
  return res.status(200).json({
    originalUrl: record.originalUrl,
    createdAt: record.createdAt,
    expiry: record.expiry,
    totalClicks: record.clickStats.length,
    clickStats: record.clickStats,
  });
};
