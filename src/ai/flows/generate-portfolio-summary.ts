'use server';

/**
 * @fileOverview An AI agent that generates a concise portfolio summary.
 *
 * - generatePortfolioSummary - A function that generates a portfolio summary.
 * - GeneratePortfolioSummaryInput - The input type for the generatePortfolioSummary function.
 * - GeneratePortfolioSummaryOutput - The return type for the generatePortfolioSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePortfolioSummaryInputSchema = z.object({
  name: z.string().describe('The name of the portfolio owner.'),
  aboutMe: z.string().describe('A detailed about me section of the portfolio.'),
  projects: z.array(z.string()).describe('A list of project descriptions.'),
  experiences: z.array(z.string()).describe('A list of experience descriptions.'),
  educations: z.array(z.string()).describe('A list of education descriptions.'),
  skills: z.array(z.string()).describe('A list of skills.'),
});
export type GeneratePortfolioSummaryInput = z.infer<
  typeof GeneratePortfolioSummaryInputSchema
>;

const GeneratePortfolioSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the portfolio.'),
});
export type GeneratePortfolioSummaryOutput = z.infer<
  typeof GeneratePortfolioSummaryOutputSchema
>;

export async function generatePortfolioSummary(
  input: GeneratePortfolioSummaryInput
): Promise<GeneratePortfolioSummaryOutput> {
  return generatePortfolioSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePortfolioSummaryPrompt',
  input: {schema: GeneratePortfolioSummaryInputSchema},
  output: {schema: GeneratePortfolioSummaryOutputSchema},
  prompt: `You are a professional portfolio summary writer. You will receive information about a person's portfolio, and you will write a concise summary of their skills and experiences.

  Name: {{{name}}}
  About Me: {{{aboutMe}}}
  Projects: {{#each projects}}{{{this}}}\n{{/each}}
  Experiences: {{#each experiences}}{{{this}}}\n{{/each}}
  Educations: {{#each educations}}{{{this}}}\n{{/each}}
  Skills: {{#each skills}}{{{this}}}\n{{/each}}

  Write a concise summary of the portfolio. Focus on the key skills and experiences.
  `,
});

const generatePortfolioSummaryFlow = ai.defineFlow(
  {
    name: 'generatePortfolioSummaryFlow',
    inputSchema: GeneratePortfolioSummaryInputSchema,
    outputSchema: GeneratePortfolioSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
