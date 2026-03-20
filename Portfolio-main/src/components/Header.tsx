import { useEffect, useState } from "react";
import ProfileImage from "../assets/images/profile1.jpg";
import ProfileHoverImage from "../assets/images/profile.png";
import ProfileDarkImage from "../assets/images/profile2.jpg";
import { ReactComponent as VerifiedCheck } from "../assets/svg/verified-check.svg";
import { ReactComponent as Location } from "../assets/svg/location.svg";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import { IoIosSend } from "react-icons/io";
import { personalLinks } from "../constants/personal";
import { useTheme } from "@/hooks/use-theme";

const ROLE_TEXT =
  "BSIT Student | Aspiring Full Stack Developer | UI/UX Designer";

const Header = () => {
  const [isProfilePreviewActive, setIsProfilePreviewActive] = useState(false);
  const [typedRole, setTypedRole] = useState("");
  const { theme } = useTheme();
  const activeProfileBase = theme === "dark" ? ProfileDarkImage : ProfileImage;

  useEffect(() => {
    let index = 0;
    let holdTicks = 0;
    setTypedRole("");

    const typeInterval = window.setInterval(() => {
      if (index < ROLE_TEXT.length) {
        index += 1;
        setTypedRole(ROLE_TEXT.slice(0, index));
        return;
      }

      holdTicks += 1;
      if (holdTicks >= 24) {
        holdTicks = 0;
        index = 0;
        setTypedRole("");
      }
    }, 34);

    return () => {
      window.clearInterval(typeInterval);
    };
  }, []);

  return (
    <header className="theme-card w-full h-auto flex justify-between items-center pt-8 lg:pt-12 xl:px-16">
      <div className="flex gap-4 lg:gap-6">
        <div
          className="group relative w-40 h-36 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-38 xl:h-38 cursor-pointer"
          onMouseEnter={() => setIsProfilePreviewActive(true)}
          onMouseLeave={() => setIsProfilePreviewActive(false)}
          onFocus={() => setIsProfilePreviewActive(true)}
          onBlur={() => setIsProfilePreviewActive(false)}
          onTouchStart={() => setIsProfilePreviewActive((prev) => !prev)}
          tabIndex={0}
          role="button"
          aria-label="Preview alternate profile photo"
        >
          <img
            src={activeProfileBase}
            alt="Profile base"
            className="w-full h-full rounded-lg object-cover transition-opacity duration-300"
          />
          <img
            src={ProfileHoverImage}
            alt="Profile hover"
            className={`pointer-events-none absolute inset-0 w-full h-full rounded-lg object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100 group-focus-within:opacity-100 ${
              isProfilePreviewActive ? "opacity-100" : ""
            }`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg lg:text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              Paul Czar F Cataylo
              <VerifiedCheck className="w-4 h-4 lg:w-5 lg:h-5" />
            </h3>
            <h5 className="text-xs lg:text-sm text-gray-600 dark:text-white flex items-center gap-1">
              <Location className="w-4 h-4" />
              Siaton, Negros Oriental, Philippines
            </h5>
            <h4 className="text-xs lg:text-sm font-medium text-gray-800 dark:text-gray-300 mt-1 min-h-[20px]">
              {typedRole}
              <span className="inline-block w-2 text-gray-500 dark:text-gray-400 animate-pulse">
                |
              </span>
            </h4>
          </div>
          <div className="flex flex-wrap items-center mt-3 gap-2">
            <a
              href={personalLinks.resume}
              download="Paul-Cataylo-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 lg:h-9 px-3 lg:px-4 bg-black dark:bg-white text-white dark:text-black font-medium text-xs lg:text-sm rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <HiOutlineArrowDownTray className="w-3 h-3 lg:w-4 lg:h-4" />
              Download Resume
            </a>
            <a
              href={personalLinks.resumeView}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white underline-offset-4 hover:underline transition-colors px-1"
            >
              View Resume
            </a>
            <a
              href={personalLinks.email}
              className="h-8 lg:h-9 px-4 lg:px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-xs lg:text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <IoIosSend className="w-6 h-3 lg:w-4 lg:h-4" />
              Send Email
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
