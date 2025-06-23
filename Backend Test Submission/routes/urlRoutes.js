import express from "express";
import {
  createShortUrl,
  redirectToOriginalUrl,
  getShortUrlStats,
} from "../controllers/urlController.js";

const router = express.Router();

router.post("/", createShortUrl);
router.get("/r/:shortcode", redirectToOriginalUrl);
router.get("/:shortcode", getShortUrlStats);

export default router;
