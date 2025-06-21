import type { NextApiRequest, NextApiResponse } from 'next';
import { getListings, ListingPayload } from '../../lib/google-api';

type Data = ListingPayload[];
type Error = { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const listings = await getListings();
    
    // The raw response from googleapis is not exactly what ListingPayload expects.
    // We need to map it to our defined structure.
    // The google api returns `language`, `title`, `shortDescription`, `fullDescription`.
    // It seems the `androidpublisher_v3.Schema$Listing` has these properties.
    // So let's ensure the types match. The properties might be null.
    const transformedListings: ListingPayload[] = listings
        .map(l => ({
            language: l.language || '',
            title: l.title || '',
            shortDescription: l.shortDescription || '',
            fullDescription: l.fullDescription || '',
        }))
        .filter(l => l.language); // Only include listings with a language code.

    res.status(200).json(transformedListings);
  } catch (error: any) {
    console.error('API Error fetching listings:', error);
    res.status(500).json({ message: error.message || 'An unexpected error occurred.' });
  }
} 