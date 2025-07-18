"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Code, GraduationCap, LayoutGrid, User, Mail, Phone, Linkedin, Github, Send } from "lucide-react";
import { PortfolioData } from "@/lib/data";
import { motion } from "framer-motion";

function Header({ portfolioData }: { portfolioData: PortfolioData | null }) {
  return (
    <div className="dark">
        <header className="bg-background/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-full group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl text-foreground">{portfolioData?.name.split(' ')[0] ?? 'Portfolio'}</span>
            </Link>
            <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6 text-sm font-medium">
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
                <a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">Projects</a>
                <a href="#experience" className="text-muted-foreground hover:text-primary transition-colors">Experience</a>
                <a href="#education" className="text-muted-foreground hover:text-primary transition-colors">Education</a>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </nav>
            </div>
        </div>
        </header>
    </div>
  );
}


export default function PortfolioClientComponent({ portfolioData }: { portfolioData: PortfolioData | null }) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  const MotionSection = ({ children, id, className }: { children: React.ReactNode, id: string, className?: string }) => (
    <motion.section
      id={id}
      className={`my-24 scroll-mt-24 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      {children}
    </motion.section>
  );

  if (!portfolioData) {
    return (
      <div className="flex h-screen items-center justify-center text-center p-4">
        <div>
          <h2 className="text-2xl font-bold text-destructive mb-4">Could not load portfolio.</h2>
          <p className="text-muted-foreground">Please ensure the server is running and the database is seeded correctly.</p>
        </div>
      </div>
    );
  }

  const { name, photoUrl, title, summary, aboutMe, skills, projects, experiences, educations, contact } = portfolioData;

  return (
    <div className="bg-background text-foreground">
      <Header portfolioData={portfolioData} />
      <main className="container mx-auto px-4 md:px-6">
        <motion.section 
          id="hero"
          className="my-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-[3/4] md:aspect-auto">
              <Image
                src={photoUrl}
                alt={name}
                fill
                className="object-cover rounded-lg"
                priority
                data-ai-hint="professional photo"
                sizes="(max-width: 768px) 100vw, 512px"
              />
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">{name}</h1>
              <p className="text-xl md:text-2xl mt-4 text-primary font-light">{title}</p>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed break-words">{summary}</p>
            </div>
          </div>
        </motion.section>

        <MotionSection id="about">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <User className="text-primary w-8 h-8" /> About Me
          </h2>
          <Card className="p-6 md:p-8 max-w-4xl mx-auto bg-card rounded-2xl">
            <CardContent>
              <p className="text-lg leading-relaxed whitespace-pre-wrap text-center md:text-left break-words">{aboutMe}</p>
            </CardContent>
          </Card>
        </MotionSection>

        <MotionSection id="skills">
           <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <Code className="text-primary w-8 h-8" /> Skills
          </h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-lg py-2 px-4 rounded-full bg-primary/10 text-primary border border-primary/20 transition-transform hover:scale-105">
                {skill}
              </Badge>
            ))}
          </div>
        </MotionSection>

        <MotionSection id="projects">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <LayoutGrid className="text-primary w-8 h-8" /> Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50}}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="dark overflow-hidden transition-all duration-300 shadow-lg hover:shadow-primary/20 hover:-translate-y-1 h-full flex flex-col bg-card rounded-lg">
                    <div className="relative w-full h-48">
                        <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        style={{objectFit:"cover"}}
                        className="w-full h-48 object-cover"
                        data-ai-hint="project technology"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <CardTitle className="text-card-foreground">{project.title}</CardTitle>
                        <CardDescription className="mt-2 flex-grow text-muted-foreground break-words">{project.description}</CardDescription>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {project.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                        {project.link && (
                            <Button asChild variant="link" className="p-0 h-auto mt-4 text-primary self-start">
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                                View Project <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            </Button>
                        )}
                    </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </MotionSection>
        
        <MotionSection id="experience">
          <h2 className="text-3xl font-bold text-center mb-16 flex items-center justify-center gap-3">
            <Briefcase className="text-primary w-8 h-8" /> Work Experience
          </h2>
          <div className="relative pl-8 border-l-2 border-primary/30 max-w-3xl mx-auto">
            {experiences.map((exp) => (
              <div key={exp.id} className="mb-12 relative">
                <div className="absolute -left-[42px] top-1 w-6 h-6 bg-primary rounded-full border-4 border-background ring-4 ring-primary/20" />
                <p className="text-sm text-muted-foreground">{exp.period}</p>
                <h3 className="text-xl font-bold mt-1">{exp.role}</h3>
                <h4 className="text-lg text-primary">{exp.company}</h4>
                <ul className="mt-2 list-disc list-inside text-muted-foreground space-y-1">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="break-words">{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </MotionSection>
        
        <MotionSection id="education">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <GraduationCap className="text-primary w-8 h-8" /> Education
          </h2>
          <div className="space-y-8 max-w-3xl mx-auto">
            {educations.map((edu) => (
              <Card key={edu.id} className="bg-card transition-all">
                <CardHeader>
                  <CardTitle>{edu.institution}</CardTitle>
                  <CardDescription className="text-muted-foreground">{edu.degree}</CardDescription>
                  <p className="text-sm text-muted-foreground pt-2">{edu.period}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </MotionSection>

        <MotionSection id="contact">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <Mail className="text-primary w-8 h-8" /> Contact Me
          </h2>
          <Card className="dark p-6 md:p-8 max-w-3xl mx-auto bg-card rounded-2xl">
            <CardContent className="flex flex-col items-start text-left space-y-6 !pb-0">
              <p className="text-lg text-muted-foreground">
                I'm always open to discussing new projects, creative ideas, or opportunities.
              </p>
              {contact && (
                  <div className="space-y-4 pt-4 text-card-foreground">
                      {contact.email && (
                          <a href={`mailto:${contact.email}`} className="flex items-center gap-4 text-lg hover:text-primary transition-colors group">
                              <Mail className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                              <span>{contact.email}</span>
                          </a>
                      )}
                      {contact.phone && (
                          <div className="flex items-center gap-4 text-lg">
                              <Phone className="w-6 h-6 text-primary" />
                              <span>{contact.phone}</span>
                          </div>
                      )}
                      {contact.linkedinUrl && (
                          <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-lg hover:text-primary transition-colors group">
                              <Linkedin className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                              <span>LinkedIn Profile</span>
                          </a>
                      )}
                      {contact.githubUrl && (
                           <a href={contact.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-lg hover:text-primary transition-colors group">
                              <Github className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                              <span>GitHub Profile</span>
                          </a>
                      )}
                  </div>
              )}
               <Button asChild size="lg">
                <Link href="/contact">
                  Send a Message <Send className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </MotionSection>

      </main>
      <div className="dark">
        <footer className="bg-background/70 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-6 py-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
            </div>
        </footer>
      </div>
    </div>
  );
}
