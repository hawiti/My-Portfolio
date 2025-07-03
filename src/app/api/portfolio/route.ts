'use server';

import {NextResponse} from 'next/server';
import {initialData, PortfolioData} from '@/lib/data';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let portfolioRecord = await db.portfolio.findUnique({
        where: { id: 1 }
    });

    if (!portfolioRecord) {
        // If no data, seed the database with initial data
        console.log("No portfolio found, seeding database with initial data.");
        portfolioRecord = await db.portfolio.create({
            data: {
                id: 1,
                data: initialData
            }
        });
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
    
    await db.portfolio.upsert({
        where: { id: 1 },
        update: { data: newData },
        create: { id: 1, data: newData },
    });
        
    return NextResponse.json({message: 'Portfolio updated successfully'});
  } catch (error) {
    console.error('Error writing to database:', error);
    return NextResponse.json(
      {message: 'Error updating portfolio'},
      {status: 500}
    );
  }
}
