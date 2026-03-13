export const UNRELATED_REPLY =
  "I can only answer questions related to Paul's portfolio, skills, projects, or experience.";

export const portfolioKnowledgeBase = {
  name: "Paul Czar F. Cataylo",
  skills: [
    "Web Development",
    "UI/UX Design",
    "JavaScript",
    "TypeScript",
    "React",
    "Vue.js",
    "Tailwind CSS",
    "Node.js",
    "PHP",
    "MySQL",
    "Programming Foundations",
  ],
  projects: [
    {
      name: "Portfolio Website",
      description:
        "Personal portfolio website showcasing Paul's skills, projects, and experience.",
    },
    {
      name: "RigNation",
      description: "An e-commerce website for a gaming community.",
    },
    {
      name: "Heart Banana Fries",
      description: "A website for a food business.",
    },
    {
      name: "Academic Projects",
      description: "BSIT student web development and UI/UX academic projects.",
    },
  ],
  experience: [
    "Freelance Data Annotator at Remotask.",
    "BSIT Student Developer working on academic and personal web projects.",
    "Started learning programming in 2023 through self-learning, online courses, and mini projects.",
  ],
  education:
    "BS Information Technology – Negros Oriental State University.",
  contact: "Use the contact form or email on the portfolio website.",
};

const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const includesAny = (normalizedQuestion, terms) =>
  terms.some((term) => normalizedQuestion.includes(normalize(term)));

const formatList = (items) => items.join(", ");

export const getKnowledgeBaseReply = (question) => {
  const q = normalize(question);
  if (!q) return UNRELATED_REPLY;

  if (includesAny(q, ["name", "full name", "who is paul", "who are you"])) {
    return `Paul's full name is ${portfolioKnowledgeBase.name}.`;
  }

  const matchedProject = portfolioKnowledgeBase.projects.find((project) =>
    q.includes(normalize(project.name))
  );
  if (matchedProject) {
    return `${matchedProject.name}: ${matchedProject.description}`;
  }

  const matchedSkill = portfolioKnowledgeBase.skills.find((skill) =>
    q.includes(normalize(skill))
  );
  if (matchedSkill) {
    return `${matchedSkill} is one of Paul's skills.`;
  }

  if (
    includesAny(q, [
      "skill",
      "skills",
      "tech stack",
      "technology",
      "technologies",
      "programming",
    ])
  ) {
    return `Paul's skills include ${formatList(portfolioKnowledgeBase.skills)}.`;
  }

  if (includesAny(q, ["project", "projects", "portfolio", "work"])) {
    const projectList = portfolioKnowledgeBase.projects
      .map((project) => `${project.name} (${project.description})`)
      .join("; ");
    return `Paul's projects: ${projectList}`;
  }

  if (
    includesAny(q, [
      "experience",
      "background",
      "remotask",
      "data annotator",
      "job",
    ])
  ) {
    return `Paul's experience: ${portfolioKnowledgeBase.experience.join(" ")}`;
  }

  if (
    includesAny(q, [
      "education",
      "school",
      "college",
      "university",
      "bsit",
      "study",
    ])
  ) {
    return `Paul's education: ${portfolioKnowledgeBase.education}`;
  }

  if (
    includesAny(q, [
      "contact",
      "email",
      "reach",
      "message",
      "hire",
      "social",
    ])
  ) {
    return portfolioKnowledgeBase.contact;
  }

  return UNRELATED_REPLY;
};
