import { FaLinkedin, FaGithub, FaInstagram, FaFacebook } from "react-icons/fa";

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/paul-czar-cataylo-738aa6314/",
    icon: FaLinkedin,
  },
  {
    name: "GitHub",
    url: "https://github.com/Tothemax-03",
    icon: FaGithub,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/https.max03/",
    icon: FaInstagram,
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/https.max07",
    icon: FaFacebook,
  }
];
