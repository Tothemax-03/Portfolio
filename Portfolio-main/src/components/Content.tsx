import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  HiOutlineBriefcase,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineXMark,
} from "react-icons/hi2";
import { experienceData } from "../constants/experience";
import { HiOutlineBeaker } from "react-icons/hi";
import { HiOutlineFolderOpen } from "react-icons/hi";
import { IoIosLink } from "react-icons/io";
import { MdOutlineVideoLibrary } from "react-icons/md";
import {
  backEndStacks,
  frontEndStacks,
  otherStacks,
} from "../constants/stacks";
import { projects } from "../constants/projects";
import { galleryData } from "@/constants/gallery";
import { HiOutlinePhotograph } from "react-icons/hi";
import { socialLinks } from "../constants/socials";
import {
  SiFigma,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiJavascript,
  SiMysql,
  SiNetlify,
  SiNodedotjs,
  SiPhp,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
  SiWix,
} from "react-icons/si";

type StackVisual = {
  icon: IconType;
  bgClass: string;
  iconClass: string;
};

const STACK_VISUALS: Record<string, StackVisual> = {
  Javascript: {
    icon: SiJavascript,
    bgClass: "bg-yellow-200/80 dark:bg-yellow-500/20",
    iconClass: "text-yellow-700 dark:text-yellow-300",
  },
  TypeScript: {
    icon: SiTypescript,
    bgClass: "bg-blue-200/80 dark:bg-blue-500/20",
    iconClass: "text-blue-700 dark:text-blue-300",
  },
  React: {
    icon: SiReact,
    bgClass: "bg-cyan-200/80 dark:bg-cyan-500/20",
    iconClass: "text-cyan-700 dark:text-cyan-300",
  },
  "Vue.js": {
    icon: SiVuedotjs,
    bgClass: "bg-emerald-200/80 dark:bg-emerald-500/20",
    iconClass: "text-emerald-700 dark:text-emerald-300",
  },
  "Tailwind CSS": {
    icon: SiTailwindcss,
    bgClass: "bg-sky-200/80 dark:bg-sky-500/20",
    iconClass: "text-sky-700 dark:text-sky-300",
  },
  "Node.js": {
    icon: SiNodedotjs,
    bgClass: "bg-green-200/80 dark:bg-green-500/20",
    iconClass: "text-green-700 dark:text-green-300",
  },
  PHP: {
    icon: SiPhp,
    bgClass: "bg-indigo-200/80 dark:bg-indigo-500/20",
    iconClass: "text-indigo-700 dark:text-indigo-300",
  },
  MySQL: {
    icon: SiMysql,
    bgClass: "bg-blue-200/80 dark:bg-blue-500/20",
    iconClass: "text-blue-700 dark:text-blue-300",
  },
  Figma: {
    icon: SiFigma,
    bgClass: "bg-rose-200/80 dark:bg-rose-500/20",
    iconClass: "text-rose-700 dark:text-rose-300",
  },
  Github: {
    icon: SiGithub,
    bgClass: "bg-gray-200/80 dark:bg-gray-500/20",
    iconClass: "text-gray-700 dark:text-gray-300",
  },
  Git: {
    icon: SiGit,
    bgClass: "bg-orange-200/80 dark:bg-orange-500/20",
    iconClass: "text-orange-700 dark:text-orange-300",
  },
  "Github Actions": {
    icon: SiGithubactions,
    bgClass: "bg-blue-200/80 dark:bg-blue-500/20",
    iconClass: "text-blue-700 dark:text-blue-300",
  },
  Netlify: {
    icon: SiNetlify,
    bgClass: "bg-teal-200/80 dark:bg-teal-500/20",
    iconClass: "text-teal-700 dark:text-teal-300",
  },
  Wix: {
    icon: SiWix,
    bgClass: "bg-violet-200/80 dark:bg-violet-500/20",
    iconClass: "text-violet-700 dark:text-violet-300",
  },
};

const DEFAULT_STACK_VISUAL: StackVisual = {
  icon: HiOutlineBeaker,
  bgClass: "bg-gray-200/80 dark:bg-gray-600/40",
  iconClass: "text-gray-700 dark:text-gray-200",
};

const SOCIAL_ICON_COLORS: Record<string, string> = {
  LinkedIn: "text-[#0A66C2]",
  GitHub: "text-[#24292F] dark:text-[#F0F6FC]",
  Instagram: "text-[#E4405F]",
  Facebook: "text-[#1877F2]",
};

const Content = () => {
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(
    null
  );
  const selectedGalleryItem =
    selectedGalleryIndex === null ? null : galleryData[selectedGalleryIndex];
  const currentImageNumber =
    selectedGalleryIndex === null ? null : selectedGalleryIndex + 1;

  const closeGalleryPreview = () => {
    setSelectedGalleryIndex(null);
  };

  const showPreviousImage = () => {
    setSelectedGalleryIndex((current) => {
      if (current === null) return current;
      return (current - 1 + galleryData.length) % galleryData.length;
    });
  };

  const showNextImage = () => {
    setSelectedGalleryIndex((current) => {
      if (current === null) return current;
      return (current + 1) % galleryData.length;
    });
  };

  useEffect(() => {
    const track = marqueeTrackRef.current;
    if (!track) return;

    let animationFrameId = 0;
    let translateX = 0;
    const speedPxPerFrame = 0.15;

    const animate = () => {
      const loopWidth = track.scrollWidth / 2;
      if (!loopWidth) {
        animationFrameId = window.requestAnimationFrame(animate);
        return;
      }

      translateX -= speedPxPerFrame;
      if (Math.abs(translateX) >= loopWidth) {
        translateX = 0;
      }

      track.style.transform = `translate3d(${translateX}px, 0, 0)`;
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      track.style.transform = "translate3d(0, 0, 0)";
    };
  }, []);

  useEffect(() => {
    if (selectedGalleryIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGalleryPreview();
        return;
      }
      if (event.key === "ArrowLeft") showPreviousImage();
      if (event.key === "ArrowRight") showNextImage();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedGalleryIndex]);

  return (
    <div className="w-full h-auto mt-6 lg:mt-8 flex flex-col gap-5 lg:gap-6 pb-8 xl:px-4 pop-scope">
      {/* Row 1: About + Experience Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        {/* About Section - Left Column */}
        <div className="lg:col-span-7">
          <div className="theme-card border border-gray-200 dark:border-gray-700 py-5 px-5 rounded-xl h-full bg-white dark:bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h3 className="text-md font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <HiOutlineBriefcase className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              About
            </h3>

            <div className="flex flex-col gap-3 mt-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                I am a BSIT student and aspiring Web Developer who enjoys building modern, responsive,
                 and user-focused websites and web applications. I have hands-on experience working with Vue.js, React, Node.js,
                  TypeScript, and other modern web technologies, and I continuously improve my skills by exploring new tools, frameworks, and best practices in web development.
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                During my college journey, I actively participated in website and web design competitions,
                 where I developed my problem-solving skills, creativity, and teamwork.
                  These experiences also helped me learn how to write clean, efficient, and maintainable code.
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                I am driven by a strong passion for learning, building meaningful projects,
                 and turning ideas into functional digital experiences. My goal is to grow as a developer while contributing
                  to impactful projects that solve real-world problems.
              </p>
            </div>
          </div>
        </div>

        {/* Experience Section - Right Column */}
        <div className="lg:col-span-5">
          <div className="theme-card border border-gray-200 dark:border-gray-700 py-5 px-5 rounded-xl h-full bg-white dark:bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h3 className="text-md font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
              <HiOutlineBriefcase className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              Experience
            </h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1.25 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

              {/* Timeline items */}
              <div className="space-y-4">
                {experienceData.map((exp, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    {/* Timeline dot */}
                    <div
                      className={`w-3 h-3 rounded-full z-10 shrink-0 ${exp.current
                        ? "bg-black dark:bg-white"
                        : "bg-gray-300 dark:bg-gray-600"
                        }`}
                    ></div>

                    {/* Content */}
                    <div className="flex-1 flex justify-between items-start min-w-0">
                      <div className="min-w-0 flex-1 pr-2">
                        <h4 className="text-sm font-semibold text-black dark:text-white">
                          {exp.jobTitle}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {exp.companyName}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 shrink-0">
                        {exp.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Tech Stack - Full Width */}
      <div className="theme-card border border-gray-200 dark:border-gray-700 py-5 px-5 rounded-xl bg-white dark:bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
            <HiOutlineBeaker className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            Tech Stack
          </h3>
          <span className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer">
            View All {"->"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Frontend */}
          <div>
            <h4 className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-3">
              Frontend
            </h4>
            <div className="flex flex-wrap gap-2">
              {frontEndStacks.map((stack, index) => (
                (() => {
                  const visual = STACK_VISUALS[stack.name] ?? DEFAULT_STACK_VISUAL;
                  const StackIcon = visual.icon;
                  return (
                    <div
                      key={index}
                      className="text-xs py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-md text-gray-800 dark:text-gray-200 inline-flex items-center gap-2"
                    >
                      <span
                        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${visual.bgClass}`}
                      >
                        <StackIcon className={`w-3.5 h-3.5 ${visual.iconClass}`} />
                      </span>
                      <span>{stack.name}</span>
                    </div>
                  );
                })()
              ))}
            </div>
          </div>

          {/* Backend */}
          <div>
            <h4 className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-3">
              Backend
            </h4>
            <div className="flex flex-wrap gap-2">
              {backEndStacks.map((stack, index) => (
                (() => {
                  const visual = STACK_VISUALS[stack.name] ?? DEFAULT_STACK_VISUAL;
                  const StackIcon = visual.icon;
                  return (
                    <div
                      key={index}
                      className="text-xs py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-md text-gray-800 dark:text-gray-200 inline-flex items-center gap-2"
                    >
                      <span
                        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${visual.bgClass}`}
                      >
                        <StackIcon className={`w-3.5 h-3.5 ${visual.iconClass}`} />
                      </span>
                      <span>{stack.name}</span>
                    </div>
                  );
                })()
              ))}
            </div>
          </div>

          {/* DevOps & Cloud */}
          <div>
            <h4 className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-3">
              DevOps & Cloud
            </h4>
            <div className="flex flex-wrap gap-2">
              {otherStacks.map((stack, index) => (
                (() => {
                  const visual = STACK_VISUALS[stack.name] ?? DEFAULT_STACK_VISUAL;
                  const StackIcon = visual.icon;
                  return (
                    <div
                      key={index}
                      className="text-xs py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-md text-gray-800 dark:text-gray-200 inline-flex items-center gap-2"
                    >
                      <span
                        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${visual.bgClass}`}
                      >
                        <StackIcon className={`w-3.5 h-3.5 ${visual.iconClass}`} />
                      </span>
                      <span>{stack.name}</span>
                    </div>
                  );
                })()
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Beyond Coding + Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        {/* Beyond Coding Section */}
        <div className="theme-card border border-gray-200 dark:border-gray-700 py-5 px-5 rounded-xl bg-white dark:bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <h3 className="text-md font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
            <IoIosLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            Social Links
          </h3>
          <div className="flex flex-col gap-3">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              const iconColorClass =
                SOCIAL_ICON_COLORS[social.name] ??
                "text-gray-700 dark:text-gray-300";
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                >
                  <IconComponent
                    className={`w-5 h-5 ${iconColorClass} group-hover:scale-115 transition-all duration-300 shrink-0`}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {social.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-5 lg:gap-6">
          <div className="theme-card border border-gray-200 dark:border-gray-700 py-5 px-5 rounded-xl bg-white dark:bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h3 className="text-md font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
              <MdOutlineVideoLibrary className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              Beyond Coding
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              When not writing code, I enjoy staying active and entertained. I'm
              passionate about{" "}
              <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                jogging
              </span>
              ,{" "}
              <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                basketball
              </span>
              , and{" "}
              <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                online gaming
              </span>
              . These activities help me maintain a healthy work-life balance and
              provide a great way to unwind and relax.
            </p>
          </div>

          {/* Projects Section */}
          <div className="theme-card border border-gray-200 dark:border-gray-700 py-5 px-5 rounded-xl bg-white dark:bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <HiOutlineFolderOpen className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                Recent Projects
              </h3>
              <span className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer">
                View All {"->"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.slice(0, 4).map((project, index) => (
                <a
                  key={index}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-white dark:bg-gray-800"
                >
                  <div className="mb-3 rounded-md overflow-hidden aspect-video bg-gray-100 dark:bg-gray-700">
                    <img
                      src={project.screenshotSrc ?? project.imageSrc}
                      alt={project.imageAlt ?? `${project.title} project preview`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = project.imageSrc;
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {project.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 text-fade-out">
                    {project.description}
                  </p>
                  <span className="inline-block mt-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs rounded text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                    {project.domainName}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Gallery Section */}
      <div className="theme-card border border-gray-200 dark:border-gray-700 py-5 px-5 rounded-xl bg-white dark:bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <h3 className="text-md font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
          <HiOutlinePhotograph className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          Gallery
        </h3>

        <div className="relative overflow-hidden">
          <div
            ref={marqueeTrackRef}
            className="flex w-max gap-2 md:gap-4 will-change-transform"
          >
            {[...galleryData, ...galleryData].map((item, index) => {
              const baseImageIndex = galleryData.findIndex(
                (galleryItem) => galleryItem.id === item.id
              );
              return (
                <button
                  key={`${item.id}-${index}`}
                  type="button"
                  onClick={() => setSelectedGalleryIndex(baseImageIndex)}
                  aria-label={`Open gallery image ${item.id}`}
                  className="group w-52 sm:w-56 md:w-60 lg:w-56 xl:w-60 shrink-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-4/5">
                    <img
                      src={item.imgSrc}
                      alt={`Gallery image ${item.id}`}
                      className="w-full h-full object-cover transition-all duration-500 grayscale contrast-110 brightness-100 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105 group-focus-visible:grayscale-0 group-focus-visible:contrast-100 group-focus-visible:brightness-100"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedGalleryItem && (
        <div
          className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm p-4 pt-16 sm:pt-8 flex items-start sm:items-center justify-center overflow-y-auto"
          onClick={closeGalleryPreview}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
        >
          <div
            className="relative w-full max-w-5xl flex flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeGalleryPreview}
              aria-label="Close image preview"
              className="absolute top-3 right-3 z-10 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-black shadow-lg inline-flex items-center justify-center transition-colors"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>

            <img
              src={selectedGalleryItem.imgSrc}
              alt={`Gallery image ${selectedGalleryItem.id}`}
              className="w-full max-h-[82vh] object-contain rounded-xl bg-black/80"
            />

            {galleryData.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  aria-label="Previous image"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/90 hover:bg-white text-black shadow-lg inline-flex items-center justify-center transition-colors"
                >
                  <HiOutlineChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  aria-label="Next image"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/90 hover:bg-white text-black shadow-lg inline-flex items-center justify-center transition-colors"
                >
                  <HiOutlineChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {currentImageNumber !== null && (
              <p className="mt-2 text-xs sm:text-sm text-white/85">
                Image {currentImageNumber} of {galleryData.length}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
