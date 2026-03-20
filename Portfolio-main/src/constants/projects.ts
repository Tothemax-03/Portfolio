import type { Projects } from "../types";
import HeartBananaFriesPreview from "@/assets/images/projects/heart-banana-fries.svg?url";
import RigNationPreview from "@/assets/images/projects/rignation.svg?url";

const assetFromBase = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const projects: Projects[] = [
  {
    title: "Heart Banana Fries",
    description: "An e-commerce website for a food business",
    link: "https://paulczarcataylo13.wixsite.com/bananaheartfries",
    domainName: "paulczarcataylo13.wixsite.com",
    imageSrc: HeartBananaFriesPreview,
    screenshotSrc: assetFromBase("projects/heart-banana-fries.png"),
    imageAlt: "Heart Banana Fries website preview",
  },
  {
    title: "RigNation",
    description: "An e-commerce website for a gaming community",
    link: "https://cataylorignationph.netlify.app/",
    domainName: "cataylorignationph.netlify.app",
    imageSrc: RigNationPreview,
    screenshotSrc: assetFromBase("projects/rigination.png"),
    imageAlt: "RigNation website preview",
  },
];
