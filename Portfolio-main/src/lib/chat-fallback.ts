const UNRELATED_REPLY =
  "I can help with Paul's portfolio, projects, skills, experience, and contact details.";

const portfolioKnowledgeBase = {
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
    "Git",
    "GitHub",
    "Figma",
  ],
  projects: [
    {
      name: "Portfolio Website",
      description:
        "Paul's personal portfolio website that showcases his skills, projects, and experience.",
    },
    {
      name: "RigNation",
      description: "An e-commerce website for a gaming community.",
    },
    {
      name: "Heart Banana Fries",
      description: "A website for a food business.",
    },
  ],
  experience: [
    "BSIT student focused on web development and UI/UX projects.",
    "Freelance Data Annotator at Remotask working on 2D and 3D AI training data.",
    "Experience building modern, responsive, and user-focused web apps.",
  ],
  education: "BS Information Technology - Negros Oriental State University.",
  contact:
    "You can reach Paul through the email button and social links on this portfolio.",
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const includesAny = (normalizedQuestion: string, terms: string[]) =>
  terms.some((term) => normalizedQuestion.includes(normalize(term)));

const formatList = (items: string[]) => items.join(", ");

export const getKnowledgeBaseReply = (question: string) => {
  const normalizedQuestion = normalize(question);

  if (!normalizedQuestion) {
    return "Ask me about Paul's skills, projects, experience, or background.";
  }

  if (
    includesAny(normalizedQuestion, [
      "name",
      "full name",
      "who is paul",
      "who are you",
    ])
  ) {
    return `Paul's full name is ${portfolioKnowledgeBase.name}.`;
  }

  const matchedProject = portfolioKnowledgeBase.projects.find((project) =>
    normalizedQuestion.includes(normalize(project.name))
  );
  if (matchedProject) {
    return `${matchedProject.name}: ${matchedProject.description}`;
  }

  const matchedSkill = portfolioKnowledgeBase.skills.find((skill) =>
    normalizedQuestion.includes(normalize(skill))
  );
  if (matchedSkill) {
    return `${matchedSkill} is one of Paul's key skills.`;
  }

  if (
    includesAny(normalizedQuestion, [
      "skill",
      "skills",
      "tech stack",
      "technology",
      "technologies",
    ])
  ) {
    return `Paul's skills include ${formatList(portfolioKnowledgeBase.skills)}.`;
  }

  if (
    includesAny(normalizedQuestion, [
      "project",
      "projects",
      "portfolio",
      "work",
    ])
  ) {
    const projectList = portfolioKnowledgeBase.projects
      .map((project) => `${project.name} (${project.description})`)
      .join("; ");

    return `Paul's projects: ${projectList}`;
  }

  if (
    includesAny(normalizedQuestion, [
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
    includesAny(normalizedQuestion, [
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
    includesAny(normalizedQuestion, [
      "contact",
      "email",
      "hire",
      "social",
      "reach",
      "message",
    ])
  ) {
    return portfolioKnowledgeBase.contact;
  }

  return UNRELATED_REPLY;
};
