import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Switch } from "@headlessui/react";
import { useTheme } from "@/hooks/use-theme";

const ToggleMode = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="absolute right-3 md:right-24 lg:right-52 xl:right-130 top-6">
      <Switch
        checked={isDark}
        onChange={() => setTheme(isDark ? "light" : "dark")}
        className="group inline-flex h-5 w-10 xl:h-6 xl:w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-gray-800 dark:bg-gray-700"
      >
        <span className="size-3 xl:size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6 flex items-center justify-center shadow-sm">
          {isDark ? (
            <MdDarkMode className="h-6 w-6 text-gray-700" />
          ) : (
            <MdLightMode className="h-6 w-6 text-yellow-500" />
          )}
        </span>
      </Switch>
    </div>
  );
};

export default ToggleMode;
