'use server';

import {NextResponse} from 'next/server';
import {PortfolioData} from '@/lib/data';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // We always look for the single portfolio record with ID 1.
    const portfolioRecord = await db.portfolio.findUnique({
        where: { id: 1 }
    });

    if (!portfolioRecord) {
        // If no data is found, it means the database hasn't been seeded yet.
        return NextResponse.json({message: 'Portfolio not found. Please seed the database.'}, {status: 404});
    }

    const portfolioData = portfolioRecord.data as PortfolioData;

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
    if (!newData.name || !newData.projects) {
      return NextResponse.json(
        {message: 'Invalid data format'},
        {status: 400}
      );
    }
    
    // Upsert ensures that we update the record with ID 1 if it exists,
    // or create it if it doesn't.
    await db.portfolio.upsert({
        where: { id: 1 },
        update: { data: newData },
        create: { id: 1, data: newData },
    });
        
    return NextResponse.json({message: 'Portfolio updated successfully'});
  } catch (error) {
    console.error('Error writing to database:', error);
    return NextResponse.json(
      {message: 'Error updating portfolio', error: (error as Error).message },
      {status: 500}
    );
  }
}
