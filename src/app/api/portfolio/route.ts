'use server';

import {NextResponse} from 'next/server';
import {initialData, PortfolioData} from '@/lib/data';
import { db } from '@/lib/db';
import { portfolios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    let portfolioRecord = await db.query.portfolios.findFirst({
        where: eq(portfolios.id, 1)
    });

    if (!portfolioRecord) {
        // If no data, seed the database with initial data
        console.log("No portfolio found, seeding database with initial data.");
        const seededData = await db.insert(portfolios).values({ data: initialData, id: 1 }).returning();
        if (!seededData || seededData.length === 0) {
            throw new Error("Failed to seed database.");
        }
        portfolioRecord = seededData[0];
    }

    return NextResponse.json(portfolioRecord.data);
  } catch (error) {
    console.error('Error fetching portfolio from database:', error);
    return NextResponse.json(
        {message: 'Error fetching portfolio from database'},
        {status: 500}
    );
  }
}

export async function POST(request: Request) {
  try {
    const newData: PortfolioData = await request.json();
    if (!newData.name || !newData.projects) {
      return NextResponse.json(
        {message: 'Invalid data format'},
        {status: 400}
      );
    }
    
    // Check if a portfolio exists, if not create it
    const existingPortfolio = await db.query.portfolios.findFirst({ where: eq(portfolios.id, 1) });
    if (existingPortfolio) {
        await db.update(portfolios)
            .set({ data: newData })
            .where(eq(portfolios.id, 1));
    } else {
        await db.insert(portfolios).values({ id: 1, data: newData });
    }
        
    return NextResponse.json({message: 'Portfolio updated successfully'});
  } catch (error) {
    console.error('Error writing to database:', error);
    return NextResponse.json(
      {message: 'Error updating portfolio'},
      {status: 500}
    );
  }
}
