import "./App.css";
import Header from "./components/Header";
import ToggleMode from "./components/ToggleMode";
import Content from "./components/Content";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen w-full items-center bg-background text-foreground">
        <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 xl:px-4">
          <Header />
          <ToggleMode />
          <Content />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
