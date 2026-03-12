import { FaLinkedin, FaGithub, FaInstagram, FaFacebook } from "react-icons/fa";

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/rogel-gerodiaz-4732761b6/",
    icon: FaLinkedin,
  },
  {
    name: "GitHub",
    url: "https://github.com/Rogel0",
    icon: FaGithub,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/wooojeeel/",
    icon: FaInstagram,
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/rogel.gerodiaz30",
    icon: FaFacebook,
  }
];
