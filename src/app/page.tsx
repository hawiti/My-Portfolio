"use client";

import { usePortfolio } from "@/hooks/use-portfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Code, GraduationCap, Home, User, Mail, Phone, Settings } from "lucide-react";

function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full" />
          <span className="font-bold text-xl">VerdantView</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
            <a href="#experience" className="hover:text-primary transition-colors">Experience</a>
            <a href="#education" className="hover:text-primary transition-colors">Education</a>
          </nav>
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Manage
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}


export default function PortfolioPage() {
  const { portfolioData } = usePortfolio();

  if (!portfolioData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading Portfolio...</div>
      </div>
    );
  }

  const { name, photoUrl, title, summary, aboutMe, skills, projects, experiences, educations } = portfolioData;

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-12">
        <section id="hero" className="flex flex-col md:flex-row items-center gap-12 my-12 md:my-24">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-primary">
            <Image
              src={photoUrl}
              alt={name}
              layout="fill"
              objectFit="cover"
              data-ai-hint="professional photo"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-primary">{name}</h1>
            <p className="text-xl md:text-2xl mt-2 text-muted-foreground">{title}</p>
            <p className="mt-4 max-w-2xl text-lg">{summary}</p>
          </div>
        </section>

        <section id="about" className="my-24 scroll-mt-24">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <User className="text-accent w-8 h-8" /> About Me
          </h2>
          <Card className="p-6 md:p-8">
            <CardContent>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{aboutMe}</p>
            </CardContent>
          </Card>
        </section>

        <section id="skills" className="my-24">
           <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <Code className="text-accent w-8 h-8" /> Skills
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-lg py-2 px-4 rounded-full bg-primary/10 text-primary border border-primary/20">
                {skill}
              </Badge>
            ))}
          </div>
        </section>

        <section id="projects" className="my-24 scroll-mt-24">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <Home className="text-accent w-8 h-8" /> Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                  data-ai-hint="project technology"
                />
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{project.description}</CardDescription>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                  {project.link && (
                    <Button asChild variant="link" className="p-0 h-auto mt-4 text-primary">
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        View Project <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        <section id="experience" className="my-24 scroll-mt-24">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <Briefcase className="text-accent w-8 h-8" /> Work Experience
          </h2>
          <div className="relative pl-8 border-l-2 border-primary">
            {experiences.map((exp) => (
              <div key={exp.id} className="mb-12 relative">
                <div className="absolute -left-[42px] top-1 w-6 h-6 bg-primary rounded-full border-4 border-background" />
                <p className="text-sm text-muted-foreground">{exp.period}</p>
                <h3 className="text-xl font-bold mt-1">{exp.role}</h3>
                <h4 className="text-lg text-primary">{exp.company}</h4>
                <ul className="mt-2 list-disc list-inside text-muted-foreground">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        
        <section id="education" className="my-24 scroll-mt-24">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <GraduationCap className="text-accent w-8 h-8" /> Education
          </h2>
          <div className="space-y-8">
            {educations.map((edu) => (
              <Card key={edu.id}>
                <CardHeader>
                  <CardTitle>{edu.institution}</CardTitle>
                  <CardDescription>{edu.degree}</CardDescription>
                  <p className="text-sm text-muted-foreground pt-2">{edu.period}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

      </main>
      <footer className="bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
