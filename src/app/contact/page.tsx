import { db } from '@/lib/db';
import type { PortfolioData } from '@/lib/data';
import ContactClientPage from './contact-client';
import type { Portfolio, Project, Experience, Education, Skill } from '@prisma/client';

// Helper function to shape data for the frontend
function shapeData(
    portfolio: Portfolio & {
        skills: Skill[];
        projects: Project[];
        experiences: Experience[];
        educations: Education[];
    }
): PortfolioData {
    return {
        name: portfolio.name,
        photoUrl: portfolio.photoUrl,
        title: portfolio.title,
        aboutMe: portfolio.aboutMe,
        summary: portfolio.summary,
        skills: portfolio.skills.map((s) => s.name),
        projects: portfolio.projects.map((p) => ({ ...p, id: p.id.toString() })),
        experiences: portfolio.experiences.map((e) => ({ ...e, id: e.id.toString() })),
        educations: portfolio.educations.map((e) => ({ ...e, id: e.id.toString() })),
        contact: {
            email: portfolio.email ?? '',
            phone: portfolio.phone ?? '',
            linkedinUrl: portfolio.linkedinUrl ?? '',
            githubUrl: portfolio.githubUrl ?? '',
        }
    };
}

async function getPortfolioDataForPage(): Promise<PortfolioData | null> {
    try {
        const portfolioWithRelations = await db.portfolio.findUnique({
            where: { id: 1 },
            include: {
                skills: { orderBy: { id: 'asc' } },
                projects: { orderBy: { id: 'asc' } },
                experiences: { orderBy: { id: 'asc' } },
                educations: { orderBy: { id: 'asc' } },
            }
        });

        if (!portfolioWithRelations) {
            console.error("Portfolio with ID 1 not found. Please seed the database.");
            return null;
        }

        return shapeData(portfolioWithRelations);
    } catch (error) {
        console.error("Error fetching portfolio directly from database:", error);
        return null;
    }
}

export default async function ContactPage() {
  const portfolioData = await getPortfolioDataForPage();
  return <ContactClientPage portfolioData={portfolioData} />;
}
