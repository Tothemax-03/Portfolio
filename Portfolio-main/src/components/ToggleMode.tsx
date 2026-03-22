import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Switch } from "@headlessui/react";
import { useTheme } from "@/hooks/use-theme";

const ToggleMode = () => {
  const { theme, setTheme, isTransitioning } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="fixed top-4 right-4 z-50">
      <Switch
        checked={isDark}
        disabled={isTransitioning}
        onChange={() => setTheme(isDark ? "light" : "dark")}
        className={`group inline-flex h-10 w-16 items-center rounded-full border border-black/5 bg-white/90 shadow-[0_14px_34px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(15,23,42,0.18)] data-checked:bg-gray-800 dark:border-white/10 dark:bg-slate-900/90 dark:shadow-[0_16px_40px_rgba(2,6,23,0.45)] ${
          isTransitioning ? "opacity-70 pointer-events-none" : ""
        }`}
      >
        <span className="flex size-7 translate-x-1.5 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 group-data-checked:translate-x-7 dark:bg-slate-100">
          {isDark ? (
            <MdDarkMode className="h-4 w-4 text-slate-700" />
          ) : (
            <MdLightMode className="h-4 w-4 text-amber-500" />
          )}
        </span>
      </Switch>
    </div>
  );
};

export default ToggleMode;
