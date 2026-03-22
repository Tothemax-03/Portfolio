import "./App.css";
import Header from "./components/Header";
import ToggleMode from "./components/ToggleMode";
import Content from "./components/Content";
import BackgroundMusicPlayer from "./components/BackgroundMusicPlayer";
import PortfolioChatWidget from "./components/PortfolioChatWidget";
import { ThemeProvider } from "./components/theme-provider";
import { useTheme } from "./hooks/use-theme";

const PortfolioLayout = () => {
  const { isTransitioning } = useTheme();

  return (
    <div
      className={`theme-root flex flex-col min-h-screen w-full items-center bg-background text-foreground ${
        isTransitioning ? "theme-switching" : ""
      }`}
    >
      <div
        className={`theme-transition-stage w-full max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-4 pop-scope ${
          isTransitioning ? "is-theme-switching" : ""
        }`}
      >
        <Header />
        <ToggleMode />
        <Content />
      </div>
      <BackgroundMusicPlayer isThemeTransitioning={isTransitioning} />
      <PortfolioChatWidget isThemeTransitioning={isTransitioning} />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <PortfolioLayout />
    </ThemeProvider>
  );
}

export default App;
