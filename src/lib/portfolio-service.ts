import { db } from '@/lib/db';
import type { PortfolioData } from '@/lib/data';
import type { Portfolio, Project, Experience, Education, Skill } from '@prisma/client';

// The single source of truth for shaping data from the database to the frontend format.
function shapePortfolioData(
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
        // The frontend components use the `id` for keys, so we convert them back to strings
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


// The single source of truth for fetching portfolio data.
export async function getPortfolioData(): Promise<PortfolioData | null> {
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
            console.error("Portfolio with ID 1 not found. It may need to be seeded.");
            return null;
        }

        return shapePortfolioData(portfolioWithRelations);
    } catch (error) {
        console.error("Error fetching portfolio from database:", error);
        return null;
    }
}
