import type { NextApiRequest, NextApiResponse } from 'next';
import { updateListings, ListingPayload } from '../../lib/google-api';
import { promises as fs } from 'fs';
import path from 'path';

async function backupCurrentData(listings: ListingPayload[]) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}.json`;
  const backupDir = path.resolve(process.cwd(), 'backup');

  try {
    await fs.mkdir(backupDir, { recursive: true });
    await fs.writeFile(path.join(backupDir, filename), JSON.stringify(listings, null, 2));
  } catch (error) {
    console.error('Failed to create backup:', error);
    // In a real app, you might want to stop the update if backup fails.
    // For now, we'll just log the error and continue.
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | { id: string | null | undefined }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { remoteData, localDraft } = req.body;
    
    if (!remoteData || !localDraft || !Array.isArray(remoteData) || !Array.isArray(localDraft)) {
        return res.status(400).json({ message: 'Invalid data provided for update.' });
    }

    // 1. Backup the current live data before making changes
    await backupCurrentData(remoteData);

    // 2. Update the listings
    const result = await updateListings(localDraft);
    
    res.status(200).json({ message: 'Update successful!', id: result.id });

  } catch (error: any) {
    console.error('API Error updating listings:', error);
    res.status(500).json({ message: error.message || 'An unexpected error occurred during the update.' });
  }
} 