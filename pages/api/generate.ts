import type { NextApiRequest, NextApiResponse } from 'next';
import { ListingPayload } from '../../lib/google-api';
import fs from 'fs/promises';
import path from 'path';

const SEPARATOR = '---';

function formatForTranslation(listings: ListingPayload[]): string {
  let content = '';
  for (const listing of listings) {
    const { language, title, shortDescription, fullDescription } = listing;
    const jsonPart = JSON.stringify({ title, shortDescription, fullDescription }, null, 2);
    
    content += `${SEPARATOR}\n`;
    content += `${language}\n`;
    content += `${jsonPart}\n`;
  }
  return content;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | { message: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const listings: ListingPayload[] = req.body;
    if (!listings || !Array.isArray(listings)) {
      return res.status(400).json({ message: 'Invalid listings data provided.' });
    }

    const fileContent = formatForTranslation(listings);
    const filePath = path.join(process.cwd(), 'pending.txt');
    
    await fs.writeFile(filePath, fileContent, 'utf-8');
    
    res.status(200).json({ message: 'pending.txt has been generated successfully in the project root.' });

  } catch (error: any) {
    console.error('API Error generating file:', error);
    res.status(500).json({ message: error.message || 'An unexpected error occurred.' });
  }
} 