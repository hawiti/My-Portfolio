import { getPortfolioData } from '@/lib/portfolio-service';
import PortfolioClientComponent from './portfolio-client';

export default async function PortfolioPage() {
  const portfolioData = await getPortfolioData();

  return <PortfolioClientComponent portfolioData={portfolioData} />;
}
