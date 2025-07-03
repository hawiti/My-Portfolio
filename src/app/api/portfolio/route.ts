'use server';

import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import {initialData, PortfolioData} from '@/lib/data';

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.json');

async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading data.json, returning initial data:', error);
    // If the file doesn't exist, create it with initial data
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      try {
        await fs.writeFile(dataFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
        return initialData;
      } catch (writeError) {
        console.error('Error writing initial data.json:', writeError);
      }
    }
    return initialData;
  }
}

export async function GET() {
  const data = await getPortfolioData();
  return NextResponse.json(data);
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
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(newData, null, 2),
      'utf-8'
    );
    return NextResponse.json({message: 'Portfolio updated successfully'});
  } catch (error) {
    console.error('Error writing to data.json:', error);
    return NextResponse.json(
      {message: 'Error updating portfolio'},
      {status: 500}
    );
  }
}
