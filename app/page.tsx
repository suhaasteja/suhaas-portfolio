import Link from "next/link";
import { Github, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import { BlogPosts } from "app/components/posts";
import SpriteScroller from "app/components/sprite-scroller";

const fallbackProjects = [
  {
    name: "portfolio-v2",
    description: "Personal portfolio website built with Astro.",
    href: "https://github.com/suhaasteja/portfolio-v2",
    stack: "Astro",
  },
  {
    name: "ai-agent-framework",
    description: "Lightweight framework for building AI agents.",
    href: "https://github.com/suhaasteja/ai-agent-framework",
    stack: "Python",
  },
  {
    name: "react-components",
    description: "Reusable React components library.",
    href: "https://github.com/suhaasteja/react-components",
    stack: "TypeScript",
  },
];

async function getProjects() {
  try {
    const response = await fetch(
      "https://api.github.com/users/suhaasteja/repos?sort=updated&per_page=12",
      {
        next: { revalidate: 86400 },
      },
    );

    if (!response.ok) {
      return fallbackProjects;
    }

    const repos = await response.json();

    return repos
      .filter((repo) => repo.description)
      .slice(0, 6)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        href: repo.html_url,
        stack: repo.language || "N/A",
      }));
  } catch (error) {
    return fallbackProjects;
  }
}

const experiences = [
  {
    role: "Intern - Enterprise AI",
    company: "Humana (Fortune 500)",
    period: "May 2025 - Aug 2025",
    summary:
      "Architected framework-agnostic RAG evaluation workflows, synthetic data generation, and red-team pipelines. Raised observability by 70% for internal AI systems.",
  },
  {
    role: "AI Research Assistant",
    company: "San Jose State University",
    period: "Mar 2024 - Dec 2025",
    summary:
      "Launched a production agentic RAG system for the SJSU King Library serving 30k+ students and faculty. Drove evaluation design and reliability improvements.",
  },
  {
    role: "Software Engineer",
    company: "Zest IoT (Series A aviation IoT startup, Boeing HorizonX-backed)",
    period: "Mar 2022 - May 2023",
    summary:
      "Developed real-time aviation IoT dashboards and asset tracking systems supporting 600+ daily flights and 9,000+ personnel.",
  },
];

const certifications = [
  {
    name: "Ray Foundations Certification",
    issuer: "Anyscale",
    date: "Nov 2025",
    focus: "Distributed Computing - Ray",
  },
  {
    name: "Enterprise Design Thinking Practitioner",
    issuer: "IBM",
    date: "Sep 2025",
  },
  {
    name: "5-Day Gen AI Intensive Course with Google",
    issuer: "Kaggle",
    date: "2025",
    focus: "Generative AI Tools",
  },
];

const links = {
  email: "mailto:suhaas.teja@gmail.com",
  linkedin: "https://www.linkedin.com/in/suhaas-teja/",
  github: "https://github.com/suhaasteja",
  twitter: "https://twitter.com/0x5uh445",
  instagram: "https://instagram.com/suhaasteja",
};

const socialLinks = [
  { label: "suhaas.teja[at]gmail.com", href: links.email, Icon: Mail },
  { label: "LinkedIn", href: links.linkedin, Icon: Linkedin },
  { label: "GitHub", href: links.github, Icon: Github },
  { label: "X", href: links.twitter, Icon: Twitter },
  { label: "Instagram", href: links.instagram, Icon: Instagram },
];

const contactLinks = [
  { label: "suhaas.teja[at]gmail.com", href: links.email, Icon: Mail },
  { label: "LinkedIn", href: links.linkedin, Icon: Linkedin },
  { label: "GitHub", href: links.github, Icon: Github },
  { label: "X", href: links.twitter, Icon: Twitter },
  { label: "Instagram", href: links.instagram, Icon: Instagram },
];

export default async function Page() {
  const projects = await getProjects();

  return (
    <section className="space-y-16 stagger">
      <header className="stagger-item space-y-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tighter flex items-center gap-3">
            <span>Suhaas Vijjagiri</span>
            <SpriteScroller className="self-center" />
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            AI & Software Engineer
          </p>
        </div>
        <p className="text-neutral-800 dark:text-neutral-200">
          AI engineer focused on production-ready GenAI systems, evaluation, and
          real-time data platforms. I deliver AI systems that are reliable,
          observable, and used by real users.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          {socialLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              className="inline-flex items-center gap-2 hover:underline"
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </header>

      <section id="experience" className="stagger-item space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tighter">
            Experience ⚡
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Enterprise AI, research, and production systems.
          </p>
        </div>
        <div className="space-y-6">
          {experiences.map((experience) => (
            <div key={experience.role} className="space-y-2">
              <div className="flex flex-col gap-1">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {experience.role}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {experience.company} · {experience.period}
                </p>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300">
                {experience.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="education" className="stagger-item space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tighter">
            Education 🎓
          </h2>
        </div>
        <div className="space-y-2 text-neutral-700 dark:text-neutral-300">
          <p className="font-medium text-neutral-900 dark:text-neutral-100">
            San Jose State University — M.S. Computer Engineering
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Aug 2023 – Dec 2025 · San Jose, CA
          </p>
        </div>
      </section>

      <section id="projects" className="stagger-item space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tighter">
            Projects 🧩
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Selected work across AI systems, web platforms, and developer tools.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.name}
              className="rounded-lg border border-neutral-200 p-4 shadow-sm dark:border-neutral-800"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                  {project.name}
                </h3>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {project.description}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {project.stack}
                </p>
                <a
                  className="text-sm font-medium text-neutral-900 hover:underline dark:text-neutral-100"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View repository
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="highlights" className="stagger-item space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tighter">
            Highlights ✨
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Certifications and personal focus areas.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
              Certifications
            </h3>
            <ul className="divide-y divide-neutral-200 space-y-3 dark:divide-neutral-800">
              {certifications.map((cert) => (
                <li key={cert.name} className="space-y-1 pt-3 first:pt-0">
                  <p className="text-neutral-900 dark:text-neutral-100">
                    {cert.name}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {cert.issuer} · {cert.date}
                  </p>
                  {cert.focus ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {cert.focus}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
              Interests
            </h3>
            <div className="space-y-2 text-neutral-700 dark:text-neutral-300">
              <p>Guitarist 🎸</p>
              <p>
                <a
                  className="hover:underline"
                  href={links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @suhaasteja
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="writing" className="stagger-item space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tighter">Writing ✍️</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Notes on evaluation, RAG systems, and product-scale AI.
          </p>
        </div>
        <BlogPosts />
        <Link
          className="text-sm font-medium text-neutral-900 hover:underline dark:text-neutral-100"
          href="/blog"
        >
          View all posts
        </Link>
      </section>

      <section id="contact" className="stagger-item space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tighter">Contact 💬</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Reach out for collaborations, research, or product work.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          {contactLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              className="inline-flex items-center gap-2 hover:underline"
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </section>
    </section>
  );
}
