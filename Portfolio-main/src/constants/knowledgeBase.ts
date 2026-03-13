import { experienceData } from "./experience";
import { personalLinks } from "./personal";
import { projects } from "./projects";
import { socialLinks } from "./socials";
import { backEndStacks, frontEndStacks, otherStacks } from "./stacks";

type KnowledgeBaseShape = {
  personalInfo: {
    fullName: string;
    role: string;
    location: string;
    summary: string;
  };
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    link: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    date: string;
  }>;
  education: Array<{
    school: string;
    program: string;
    status: string;
  }>;
  contact: {
    email: string;
    socials: Array<{
      name: string;
      url: string;
    }>;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const includesAny = (text: string, keywords: string[]) =>
  keywords.some((keyword) => text.includes(keyword));

const allSkills = Array.from(
  new Set([
    ...frontEndStacks.map((item) => item.name),
    ...backEndStacks.map((item) => item.name),
    ...otherStacks.map((item) => item.name),
  ])
);

const contactSocials = socialLinks.map((social) => ({
  name: social.name,
  url: social.url,
}));

const experienceSummary = experienceData.map((entry) => ({
  title: entry.jobTitle,
  company: entry.companyName,
  date: entry.date,
}));

const projectsSummary = projects.map((project) => ({
  title: project.title,
  description: project.description,
  link: project.link,
}));

export const knowledgeBase: KnowledgeBaseShape = {
  personalInfo: {
    fullName: "Paul Czar F. Cataylo",
    role: "BSIT Student | Aspiring Full Stack Developer | UI/UX Designer",
    location: "Siaton, Negros Oriental, Philippines",
    summary:
      "Paul is a BSIT student focused on responsive, user-centered web development.",
  },
  skills: allSkills,
  projects: projectsSummary,
  experience: experienceSummary,
  education: [
    {
      school: "Negros Oriental State University",
      program: "Bachelor of Science in Information Technology (BSIT)",
      status: "BSIT Student",
    },
  ],
  contact: {
    email: personalLinks.email.replace("mailto:", ""),
    socials: contactSocials,
  },
  faqs: [
    {
      question: "Who are you?",
      answer: "I am Paul's portfolio assistant.",
    },
    {
      question: "What can you answer?",
      answer:
        "I answer based on portfolio information: personal info, skills, projects, experience, education, and contact details.",
    },
  ],
};

const getSkillsReply = () => `Paul's skills: ${knowledgeBase.skills.join(", ")}.`;

const getProjectsReply = () =>
  `Projects: ${knowledgeBase.projects
    .map((project) => `${project.title} (${project.description})`)
    .join("; ")}.`;

const getExperienceReply = () =>
  `Experience: ${knowledgeBase.experience
    .map((item) => `${item.title} at ${item.company} (${item.date})`)
    .join("; ")}.`;

const getEducationReply = () =>
  `Education: ${knowledgeBase.education
    .map((item) => `${item.program} at ${item.school}`)
    .join("; ")}.`;

const getContactReply = () =>
  `Email: ${knowledgeBase.contact.email}. Socials: ${knowledgeBase.contact.socials
    .map((item) => `${item.name} (${item.url})`)
    .join("; ")}.`;

const getProjectMatchReply = (question: string) => {
  const normalizedQuestion = normalize(question);
  const matchedProject = knowledgeBase.projects.find((project) =>
    normalizedQuestion.includes(normalize(project.title))
  );
  if (!matchedProject) return null;
  return `${matchedProject.title}: ${matchedProject.description}. Link: ${matchedProject.link}`;
};

const getSkillMatchReply = (question: string) => {
  const normalizedQuestion = normalize(question);
  const matchedSkill = knowledgeBase.skills.find((skill) =>
    normalizedQuestion.includes(normalize(skill))
  );
  if (!matchedSkill) return null;
  return `Yes. ${matchedSkill} is listed in Paul's tech stack.`;
};

export const searchKnowledgeBase = (question: string) => {
  const q = normalize(question);
  if (!q) return null;

  const projectMatchReply = getProjectMatchReply(q);
  if (projectMatchReply) return projectMatchReply;

  const skillMatchReply = getSkillMatchReply(q);
  if (skillMatchReply) return skillMatchReply;

  if (includesAny(q, ["who are you", "your name", "assistant"])) {
    return "I am Paul's portfolio assistant.";
  }

  if (includesAny(q, ["full name", "what is his name", "what s his name", "paul s name"])) {
    return `Full name: ${knowledgeBase.personalInfo.fullName}.`;
  }

  if (includesAny(q, ["role", "position", "job title"])) {
    return `Role: ${knowledgeBase.personalInfo.role}.`;
  }

  if (includesAny(q, ["location", "where"])) {
    return `Location: ${knowledgeBase.personalInfo.location}.`;
  }

  if (includesAny(q, ["about", "background", "summary", "portfolio"])) {
    return knowledgeBase.personalInfo.summary;
  }

  if (includesAny(q, ["skill", "tech stack", "technology", "tools"])) {
    return getSkillsReply();
  }

  if (includesAny(q, ["project", "projects"])) {
    return getProjectsReply();
  }

  if (includesAny(q, ["experience"])) {
    return getExperienceReply();
  }

  if (includesAny(q, ["education", "school", "college", "university", "bsit"])) {
    return getEducationReply();
  }

  if (includesAny(q, ["contact", "email", "linkedin", "github", "instagram", "facebook"])) {
    return getContactReply();
  }

  if (includesAny(q, ["faq", "help"])) {
    return knowledgeBase.faqs
      .map((item) => `Q: ${item.question} A: ${item.answer}`)
      .join(" ");
  }

  return null;
};

export const getKnowledgeBaseReply = (question: string) =>
  searchKnowledgeBase(question) ??
  "I can only answer based on the available knowledge base information.";
