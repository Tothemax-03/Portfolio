const NO_ANSWER_REPLY =
  "I can only answer based on the available knowledge base information.";

const knowledgeBase = {
  personalInfo: {
    fullName: "Paul Czar F. Cataylo",
    role: "BSIT Student | Aspiring Full Stack Developer | UI/UX Designer",
    location: "Siaton, Negros Oriental, Philippines",
    summary:
      "Paul is a BSIT student focused on modern, responsive, and user-centered web applications.",
  },
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Vue.js",
    "Tailwind CSS",
    "Node.js",
    "PHP",
    "MySQL",
    "Figma",
    "Git",
    "GitHub",
    "GitHub Actions",
    "Netlify",
    "Wix",
  ],
  projects: [
    {
      title: "RigNation",
      description: "An e-commerce website for a gaming community.",
      link: "https://cataylorignationph.netlify.app/",
    },
    {
      title: "Heart Banana Fries",
      description: "An e-commerce website for a food business.",
      link: "https://paulczarcataylo13.wixsite.com/bananaheartfries",
    },
  ],
  experience: [
    {
      companyName: "Academic Projects",
      jobTitle: "BSIT Student Developer",
      date: "2026",
    },
    {
      companyName: "Negros Oriental State University",
      jobTitle: "BSIT Student | Web Development & UI/UX Projects",
      date: "2026",
    },
    {
      companyName: "Remotask",
      jobTitle: "Freelance Data Annotator",
      date: "2024",
    },
    {
      companyName: "ACSAT-BSCPE, Self Learning & Online Courses",
      jobTitle:
        "Started Learning Programming | Computer Engineering & Programming Foundations",
      date: "2023",
    },
  ],
  education: [
    {
      school: "Negros Oriental State University",
      degree: "Bachelor of Science in Information Technology (BSIT)",
      status: "BSIT Student",
    },
  ],
};

const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value) => {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "to",
    "of",
    "for",
    "on",
    "in",
    "with",
    "is",
    "are",
    "was",
    "were",
    "what",
    "who",
    "where",
    "when",
    "how",
    "about",
    "tell",
    "me",
    "your",
    "you",
    "his",
    "her",
    "their",
    "that",
    "this",
  ]);

  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 1 && !stopWords.has(token));
};

const documents = [
  {
    id: "personal.name",
    section: "personalInfo",
    text: `Full name: ${knowledgeBase.personalInfo.fullName}.`,
    keywords: [
      "name",
      "full name",
      "who is paul",
      "paul cataylo",
      "personal info",
    ],
  },
  {
    id: "personal.role",
    section: "personalInfo",
    text: `Role: ${knowledgeBase.personalInfo.role}.`,
    keywords: ["role", "position", "job", "aspiring", "developer", "designer"],
  },
  {
    id: "personal.location",
    section: "personalInfo",
    text: `Location: ${knowledgeBase.personalInfo.location}.`,
    keywords: ["location", "based", "where", "address", "siaton", "philippines"],
  },
  {
    id: "personal.summary",
    section: "personalInfo",
    text: knowledgeBase.personalInfo.summary,
    keywords: ["about", "summary", "background", "profile", "introduction"],
  },
  ...knowledgeBase.skills.map((skill) => ({
    id: `skill.${normalize(skill).replace(/\s+/g, "-")}`,
    section: "skills",
    text: `Skill: ${skill}.`,
    keywords: ["skill", "tech stack", "technology", "tool", skill],
  })),
  ...knowledgeBase.projects.map((project) => ({
    id: `project.${normalize(project.title).replace(/\s+/g, "-")}`,
    section: "projects",
    text: `${project.title}: ${project.description} Link: ${project.link}`,
    keywords: ["project", "portfolio", "work", project.title, project.description],
  })),
  ...knowledgeBase.experience.map((item, index) => ({
    id: `experience.${index + 1}`,
    section: "experience",
    text: `${item.jobTitle} at ${item.companyName} (${item.date}).`,
    keywords: ["experience", "work", "job", "career", item.jobTitle, item.companyName],
  })),
  ...knowledgeBase.education.map((item, index) => ({
    id: `education.${index + 1}`,
    section: "education",
    text: `${item.status} - ${item.degree} at ${item.school}.`,
    keywords: ["education", "school", "university", "college", "bsit", item.school],
  })),
];

const scoreDocument = (query, queryTokens, document) => {
  const normalizedQuery = normalize(query);
  let score = 0;

  for (const keyword of document.keywords) {
    const normalizedKeyword = normalize(keyword);
    if (!normalizedKeyword) continue;

    if (normalizedQuery.includes(normalizedKeyword)) {
      score += normalizedKeyword.split(" ").length > 1 ? 6 : 3;
    }

    const keywordTokens = normalizedKeyword.split(" ");
    for (const token of queryTokens) {
      if (keywordTokens.includes(token)) score += 1;
    }
  }

  return score;
};

const findKnowledgeMatches = (query, limit = 5) => {
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return [];

  const scored = documents
    .map((document) => ({
      document,
      score: scoreDocument(query, queryTokens, document),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.document);

  return scored;
};

const buildKnowledgeContext = (matches) =>
  matches.map((match) => `[${match.section}] ${match.text}`).join("\n");

const buildFallbackReplyFromMatches = (matches) => {
  if (!matches.length) return NO_ANSWER_REPLY;

  if (matches.length === 1) return matches[0].text;

  const lines = matches.slice(0, 3).map((match) => `- ${match.text}`);
  return `Based on the knowledge base:\n${lines.join("\n")}`;
};

module.exports = {
  knowledgeBase,
  NO_ANSWER_REPLY,
  findKnowledgeMatches,
  buildKnowledgeContext,
  buildFallbackReplyFromMatches,
};
