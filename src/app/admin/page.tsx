
"use client";

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlusCircle, Trash2, ArrowLeft, Wand2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { generateSummaryAction } from './actions';
import { PortfolioData, Project, Experience, Education, initialData } from '@/lib/data';

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function AdminPage() {
  const [formData, setFormData] = useState<PortfolioData>(initialData);
  const [loading, setLoading] = useState(true);
  const [isAiPending, startAiTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
        try {
            const res = await fetch('/api/portfolio');
            if (!res.ok) throw new Error("Failed to fetch data");
            const data = await res.json();
            setFormData(data);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Could not load portfolio data.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const dataUrl = await fileToDataUrl(e.target.files[0]);
        setFormData(prev => ({ ...prev, photoUrl: dataUrl }));
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error reading file', description: 'Could not process the selected image.' });
      }
    }
  };

  const handleSave = async () => {
    try {
        const res = await fetch('/api/portfolio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to save data");

        toast({
            title: "Success!",
            description: "Your portfolio has been updated.",
        });
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Could not save portfolio data.",
            variant: "destructive",
        });
    }
  };

  const handleGenerateSummary = () => {
    startAiTransition(async () => {
      const result = await generateSummaryAction({
        name: formData.name,
        aboutMe: formData.aboutMe,
        projects: formData.projects.map(p => p.description),
        experiences: formData.experiences.map(e => `${e.role} at ${e.company}: ${e.responsibilities.join(', ')}`),
        educations: formData.educations.map(e => `${e.degree} from ${e.institution}`),
        skills: formData.skills,
      });

      if (result.summary) {
        setFormData(prev => ({ ...prev, summary: result.summary }));
        toast({
          title: "AI Summary Generated!",
          description: "The AI-powered summary has been updated.",
        });
      } else {
        toast({
          title: "Error",
          description: "Could not generate AI summary.",
          variant: "destructive",
        });
      }
    });
  };
  
  const handleListFieldChange = async (listName: 'projects' | 'experiences' | 'educations', index: number, field: string, value: any) => {
    const list = formData[listName] as any[];
    const updatedList = [...list];
    
    if (listName === 'projects' && field === 'imageUrl') {
        const e = value as React.ChangeEvent<HTMLInputElement>;
        if (e.target.files && e.target.files[0]) {
            try {
                const dataUrl = await fileToDataUrl(e.target.files[0]);
                updatedList[index] = { ...updatedList[index], [field]: dataUrl };
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error reading file' });
                return;
            }
        }
    } else if (listName === 'projects' && field === 'tags') {
         updatedList[index] = { ...updatedList[index], [field]: value.split(',').map((s:string) => s.trim()) };
    } 
    else {
        updatedList[index] = { ...updatedList[index], [field]: value };
    }

    setFormData(prev => ({ ...prev, [listName]: updatedList }));
  };
  
  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = formData.skills.map((skill, i) => (i === index ? value : skill));
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const addListItem = (listName: 'projects' | 'experiences' | 'educations' | 'skills') => {
    let newItem;
    switch(listName) {
      case 'projects':
        newItem = { id: Date.now().toString(), title: '', description: '', imageUrl: 'https://placehold.co/600x400.png', link: '', tags: [] };
        break;
      case 'experiences':
        newItem = { id: Date.now().toString(), role: '', company: '', period: '', responsibilities: [''] };
        break;
      case 'educations':
        newItem = { id: Date.now().toString(), institution: '', degree: '', period: '' };
        break;
      case 'skills':
        setFormData(prev => ({ ...prev, skills: [...prev.skills, 'New Skill'] }));
        return;
    }
    setFormData(prev => ({ ...prev, [listName]: [...(prev[listName] as any[]), newItem] }));
  };

  const removeListItem = (listName: keyof PortfolioData, index: number) => {
    const list = formData[listName] as any[];
    setFormData(prev => ({ ...prev, [listName]: list.filter((_, i) => i !== index) }));
  };
  
  const handleResponsibilityChange = (expIndex: number, respIndex: number, value: string) => {
    const updatedExperiences = formData.experiences.map((exp, i) => {
      if (i === expIndex) {
        const updatedResponsibilities = exp.responsibilities.map((resp, ri) => ri === respIndex ? value : resp);
        return { ...exp, responsibilities: updatedResponsibilities };
      }
      return exp;
    });
    setFormData(prev => ({ ...prev, experiences: updatedExperiences }));
  };
  
  const addResponsibility = (expIndex: number) => {
    const updatedExperiences = [...formData.experiences];
    updatedExperiences[expIndex].responsibilities.push('');
    setFormData(prev => ({ ...prev, experiences: updatedExperiences }));
  };

  const removeResponsibility = (expIndex: number, respIndex: number) => {
    const updatedExperiences = [...formData.experiences];
    updatedExperiences[expIndex].responsibilities = updatedExperiences[expIndex].responsibilities.filter((_, i) => i !== respIndex);
    setFormData(prev => ({...prev, experiences: updatedExperiences}));
  };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-4 text-lg">Loading Admin...</span>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                 <Button asChild variant="outline" size="icon">
                    <Link href="/">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
        </header>
        
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and bio.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div><Label htmlFor="name">Name</Label><Input id="name" name="name" value={formData.name} onChange={handleInputChange} /></div>
                <div><Label htmlFor="title">Title / Tagline</Label><Input id="title" name="title" value={formData.title} onChange={handleInputChange} /></div>
                <div>
                  <Label htmlFor="photoUrl">Photo</Label>
                  <Input id="photoUrl" name="photoUrl" type="file" accept="image/png, image/jpeg, image/gif, image/webp" onChange={handlePhotoUpload} />
                  {formData.photoUrl && (
                    <div className="mt-4">
                      <Image src={formData.photoUrl} alt="Profile preview" width={120} height={160} className="rounded-md object-cover" />
                    </div>
                  )}
                </div>
                <div><Label htmlFor="aboutMe">About Me</Label><Textarea id="aboutMe" name="aboutMe" value={formData.aboutMe} onChange={handleInputChange} rows={8} /></div>
                <div>
                  <Label htmlFor="summary">AI Generated Summary</Label>
                  <Textarea id="summary" name="summary" value={formData.summary} onChange={handleInputChange} rows={4} />
                  <Button onClick={handleGenerateSummary} disabled={isAiPending} variant="outline" size="sm" className="mt-2">
                    {isAiPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    {isAiPending ? 'Generating...' : 'Generate with AI'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input value={skill} onChange={(e) => handleSkillChange(index, e.target.value)} />
                    <Button variant="ghost" size="icon" onClick={() => removeListItem('skills', index)}><Trash2 className="text-destructive" /></Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => addListItem('skills')}><PlusCircle className="mr-2" /> Add Skill</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {formData.projects.map((project, index) => (
                  <Card key={project.id} className="p-4 bg-muted/50">
                    <div className="space-y-4">
                      <div><Label>Title</Label><Input value={project.title} onChange={(e) => handleListFieldChange('projects', index, 'title', e.target.value)} /></div>
                      <div><Label>Description</Label><Textarea value={project.description} onChange={(e) => handleListFieldChange('projects', index, 'description', e.target.value)} /></div>
                      <div>
                        <Label>Image</Label>
                        <Input type="file" accept="image/png, image/jpeg, image/gif, image/webp" onChange={(e) => handleListFieldChange('projects', index, 'imageUrl', e)} />
                        {project.imageUrl && (
                            <div className="mt-4">
                                <Image src={project.imageUrl} alt="Project preview" width={160} height={90} className="rounded-md object-cover" />
                            </div>
                        )}
                      </div>
                      <div><Label>Project Link</Label><Input value={project.link} onChange={(e) => handleListFieldChange('projects', index, 'link', e.target.value)} /></div>
                      <div><Label>Tags (comma separated)</Label><Input value={project.tags.join(', ')} onChange={(e) => handleListFieldChange('projects', index, 'tags', e.target.value)} /></div>
                    </div>
                    <Button variant="destructive" size="sm" className="mt-4" onClick={() => removeListItem('projects', index)}>Remove Project</Button>
                  </Card>
                ))}
                <Button variant="outline" onClick={() => addListItem('projects')}><PlusCircle className="mr-2" /> Add Project</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
                <CardHeader><CardTitle>Work Experience</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    {formData.experiences.map((exp, index) => (
                        <Card key={exp.id} className="p-4 bg-muted/50">
                            <div className="space-y-4">
                                <div><Label>Role</Label><Input value={exp.role} onChange={e => handleListFieldChange('experiences', index, 'role', e.target.value)} /></div>
                                <div><Label>Company</Label><Input value={exp.company} onChange={e => handleListFieldChange('experiences', index, 'company', e.target.value)} /></div>
                                <div><Label>Period</Label><Input value={exp.period} onChange={e => handleListFieldChange('experiences', index, 'period', e.target.value)} /></div>
                                <div className="space-y-2">
                                    <Label>Responsibilities</Label>
                                    {exp.responsibilities.map((resp, respIndex) => (
                                        <div key={respIndex} className="flex gap-2 items-center">
                                            <Input value={resp} onChange={e => handleResponsibilityChange(index, respIndex, e.target.value)} />
                                            <Button variant="ghost" size="icon" onClick={() => removeResponsibility(index, respIndex)}><Trash2 className="text-destructive h-4 w-4" /></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => addResponsibility(index)}><PlusCircle className="mr-2 h-4 w-4" /> Add Responsibility</Button>
                                </div>
                            </div>
                            <Button variant="destructive" size="sm" className="mt-4" onClick={() => removeListItem('experiences', index)}>Remove Experience</Button>
                        </Card>
                    ))}
                    <Button variant="outline" onClick={() => addListItem('experiences')}><PlusCircle className="mr-2" /> Add Experience</Button>
                </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="education">
            <Card>
                <CardHeader><CardTitle>Education</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    {formData.educations.map((edu, index) => (
                        <Card key={edu.id} className="p-4 bg-muted/50">
                            <div className="space-y-4">
                                <div><Label>Institution</Label><Input value={edu.institution} onChange={e => handleListFieldChange('educations', index, 'institution', e.target.value)} /></div>
                                <div><Label>Degree/Certificate</Label><Input value={edu.degree} onChange={e => handleListFieldChange('educations', index, 'degree', e.target.value)} /></div>
                                <div><Label>Period</Label><Input value={edu.period} onChange={e => handleListFieldChange('educations', index, 'period', e.target.value)} /></div>
                            </div>
                            <Button variant="destructive" size="sm" className="mt-4" onClick={() => removeListItem('educations', index)}>Remove Education</Button>
                        </Card>
                    ))}
                    <Button variant="outline" onClick={() => addListItem('educations')}><PlusCircle className="mr-2" /> Add Education</Button>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
