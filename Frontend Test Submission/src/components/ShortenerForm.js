import { useState } from "react";
import { TextField, Button, Box, Alert, Link } from "@mui/material";
import { styled } from "@mui/system";

const FormRow = styled(Box)({ display: "flex", gap: "1rem", flexWrap: "wrap" });

export default function ShortenerForm() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState(30);
  const [shortcode, setShortcode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    if (!url) return setError("Please enter a URL.");

    try {
      const res = await fetch("/shorturls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          validity: Number(validity),
          ...(shortcode && { shortcode }),
        }),
      });

      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || "Server error");
    } catch (err) {
      console.error(err);
      setError("Network error: could not reach backend");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <FormRow>
        <TextField label="Long URL" value={url} onChange={e => setUrl(e.target.value)} fullWidth />
        <TextField label="Expiry (minutes)" type="number" value={validity}
          sx={{ width: 120 }} onChange={e => setValidity(e.target.value)} />
      </FormRow>

      <TextField label="Custom shortcode (optional)" value={shortcode}
        onChange={e => setShortcode(e.target.value)} />

      <Button variant="contained" onClick={handleSubmit} disableElevation
        sx={{
          backgroundColor: "tomato", color: "#fff",
          transform: "scale(1)",
          transition: theme => theme.transitions.create(["transform","box-shadow"], {
            duration: theme.transitions.duration.short, easing: theme.transitions.easing.easeInOut}),
          boxShadow: 1,
          "&:hover": { transform: "scale(1.05)", boxShadow: 4, backgroundColor: "darkred" },
          "&:active": { transform: "scale(0.98)", boxShadow: 2 }
        }}>
        Shorten
      </Button>

      {result && (
        <Alert severity="success" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span>Short URL created!<br/></span>
          <Link href={result.shortLink} target="_blank" rel="noopener">{result.shortLink}<br/></Link>
          <em>Expires at: {new Date(result.expiry).toLocaleString()}</em>
        </Alert>
      )}
    </Box>
  );
}
