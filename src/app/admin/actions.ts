"use server";

import { generatePortfolioSummary, GeneratePortfolioSummaryInput, GeneratePortfolioSummaryOutput } from "@/ai/flows/generate-portfolio-summary";

export async function generateSummaryAction(input: GeneratePortfolioSummaryInput): Promise<GeneratePortfolioSummaryOutput> {
    try {
        const summary = await generatePortfolioSummary(input);
        return summary;
    } catch (error) {
        console.error("Error generating portfolio summary:", error);
        return { summary: "Error: Could not generate summary." };
    }
}
