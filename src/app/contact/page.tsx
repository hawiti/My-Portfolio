import { getPortfolioData } from '@/lib/portfolio-service';
import ContactClientPage from './contact-client';

export default async function ContactPage() {
  const portfolioData = await getPortfolioData();
  return <ContactClientPage portfolioData={portfolioData} />;
}
