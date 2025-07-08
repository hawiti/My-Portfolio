'use server';

import {NextResponse} from 'next/server';
import {PortfolioData} from '@/lib/data';
import { db } from '@/lib/db';
import { getPortfolioData } from '@/lib/portfolio-service';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const portfolioData = await getPortfolioData();

    if (!portfolioData) {
        return NextResponse.json({message: 'Portfolio not found. Please seed the database.'}, {status: 404});
    }

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error('Error fetching portfolio from database:', error);
    return NextResponse.json(
        {message: 'Error fetching portfolio from database', error: (error as Error).message },
        {status: 500}
    );
  }
}

export async function POST(request: Request) {
  try {
    const newData: PortfolioData = await request.json();

    const { name, photoUrl, title, aboutMe, summary, skills, projects, experiences, educations, contact } = newData;

    await db.$transaction(async (prisma) => {
        // 1. Upsert the main portfolio record
        const portfolio = await prisma.portfolio.upsert({
            where: { id: 1 },
            update: { 
                name, photoUrl, title, aboutMe, summary,
                email: contact?.email,
                phone: contact?.phone,
                linkedinUrl: contact?.linkedinUrl,
                githubUrl: contact?.githubUrl,
            },
            create: { 
                id: 1, name, photoUrl, title, aboutMe, summary,
                email: contact?.email,
                phone: contact?.phone,
                linkedinUrl: contact?.linkedinUrl,
                githubUrl: contact?.githubUrl,
            },
        });
        const portfolioId = portfolio.id;

        // 2. Clear existing related data
        await prisma.skill.deleteMany({ where: { portfolioId } });
        await prisma.project.deleteMany({ where: { portfolioId } });
        await prisma.experience.deleteMany({ where: { portfolioId } });
        await prisma.education.deleteMany({ where: { portfolioId } });

        // 3. Create new related data
        if (skills?.length) {
            await prisma.skill.createMany({
                data: skills.map(name => ({ name, portfolioId })),
            });
        }
        if (projects?.length) {
            await prisma.project.createMany({
                data: projects.map(p => ({
                    title: p.title,
                    description: p.description,
                    imageUrl: p.imageUrl,
                    link: p.link,
                    tags: p.tags,
                    portfolioId,
                })),
            });
        }
        if (experiences?.length) {
            await prisma.experience.createMany({
                data: experiences.map(e => ({
                    role: e.role,
                    company: e.company,
                    period: e.period,
                    responsibilities: e.responsibilities,
                    portfolioId,
                })),
            });
        }
        if (educations?.length) {
            await prisma.education.createMany({
                data: educations.map(e => ({
                    institution: e.institution,
                    degree: e.degree,
                    period: e.period,
                    portfolioId,
                })),
            });
        }
    });

    // Invalidate the cache for the entire site to ensure changes are reflected everywhere.
    revalidatePath('/', 'layout');
        
    return NextResponse.json({message: 'Portfolio updated successfully'});
  } catch (error) {
    console.error('Error writing to database:', error);
    return NextResponse.json(
      {message: 'Error updating portfolio', error: (error as Error).message },
      {status: 500}
    );
  }
}
