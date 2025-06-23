import { ThemeProvider, CssBaseline, Container, Typography, Divider } from "@mui/material";
import theme from "./theme.js";
import ShortenerForm from "./components/ShortenerForm.js";
import StatsPage from "./components/StatsPage.js";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h2" align="center">URL Shortener</Typography>
        <ShortenerForm />
        <Divider sx={{ my: 4 }} />
        <StatsPage />
      </Container>
    </ThemeProvider>
  );
}

export default App;

