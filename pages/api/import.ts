import type { NextApiRequest, NextApiResponse } from 'next';
import { ListingPayload } from '../../lib/google-api';
import fs from 'fs/promises';
import path from 'path';

const SEPARATOR = '---';

function parseTranslationFile(text: string): ListingPayload[] {
  const listings: ListingPayload[] = [];
  const blocks = text.split(SEPARATOR).filter(b => b.trim() !== '');

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    const language = lines.shift()?.trim();
    if (!language) {
      throw new Error(`Parsing error: Missing language code in block: "${block.substring(0, 50)}..."`);
    }

    const jsonString = lines.join('\n');
    try {
      const parsed = JSON.parse(jsonString);

      if (parsed.title === undefined || parsed.shortDescription === undefined || parsed.fullDescription === undefined) {
        throw new Error(`Missing required fields (title, shortDescription, fullDescription) in language block: ${language}`);
      }

      listings.push({
        language,
        title: parsed.title,
        shortDescription: parsed.shortDescription,
        fullDescription: parsed.fullDescription,
      });
    } catch (e: any) {
      throw new Error(`JSON parsing error in language block "${language}": ${e.message}`);
    }
  }

  return listings;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListingPayload[] | { message: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const filePath = path.join(process.cwd(), 'pending.txt');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    if (fileContent.trim() === '') {
        return res.status(200).json([]);
    }

    const parsedListings = parseTranslationFile(fileContent);
    res.status(200).json(parsedListings);

  } catch (error: any) {
    console.error('API Error importing file:', error);
    if (error.code === 'ENOENT') {
      return res.status(404).json({ message: 'pending.txt not found in the project root.' });
    }
    res.status(400).json({ message: error.message || 'An unexpected error occurred during import.' });
  }
} 