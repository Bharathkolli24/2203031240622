import { useState } from "react";
import { TextField, Button, Box, Alert, Typography } from "@mui/material";

export default function StatsPage() {
  const [input, setInput] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStatsWithCode = async (code) => {
    setError(""); setStats(null);
    if (!code) return setError("Enter shortcode or URL.");

    try {
      const res = await fetch(`/shorturls/${code}`);
      const data = await res.json();
      if (res.ok) setStats(data);
      else setError(data.error || "Not found");
    } catch (err) {
      console.error(err);
      setError("Network error: " + err.message);
    }
  };

  const handleFetch = () => {
    let code = input.trim();
    if (code.startsWith("http")) {
      try {
        const urlObj = new URL(code);
        const segments = urlObj.pathname.split("/").filter(Boolean);
        code = segments.pop() || "";
      } catch {}
    }
    fetchStatsWithCode(code);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField label="Shortcode or URL" value={input}
          placeholder="e.g. b08wuo or http://.../b08wuo"
          onChange={e=>setInput(e.target.value)} fullWidth />
        <Button variant="outlined" onClick={handleFetch} sx={{ minWidth: 120 }}>Fetch</Button>
      </Box>
      {stats && (
        <Alert severity="info" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography><b>Original:</b> {stats.originalUrl}</Typography>
          <Typography><b>Created:</b> {new Date(stats.createdAt).toLocaleString()}</Typography>
          <Typography><b>Expiry:</b> {new Date(stats.expiry).toLocaleString()}</Typography>
          <Typography><b>Total Clicks:</b> {stats.totalClicks}</Typography>
          {stats.clickStats.map((c,i) => (
            <Typography key={i} sx={{ ml: 2, fontStyle: "italic" }}>
              • {new Date(c.timestamp).toLocaleString()} — {c.source} — {c.location}
            </Typography>
          ))}
        </Alert>
      )}
    </Box>
  );
}
