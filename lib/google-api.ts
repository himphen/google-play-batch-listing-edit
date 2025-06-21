import { google } from 'googleapis';
import { promises as fs } from 'fs';
import path from 'path';

export interface ListingPayload {
  language: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
}

export interface AppConfig {
  packageName: string;
  keyFilePath: string;
}

const androidpublisher = google.androidpublisher('v3');

async function getConfig(): Promise<AppConfig> {
  const configPath = path.resolve(process.cwd(), 'config.json');
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading or parsing config.json:', error);
    throw new Error('Could not load config.json. Please ensure it exists and is correctly formatted.');
  }
}

async function getAuth() {
  const { keyFilePath } = await getConfig();
  const keyFileFullPath = path.resolve(process.cwd(), keyFilePath);

  const auth = new google.auth.GoogleAuth({
    keyFile: keyFileFullPath,
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });

  return auth;
}

export async function getListings() {
  const config = await getConfig();
  const auth = await getAuth();

  // Create a new edit
  const edit = await androidpublisher.edits.insert({
    auth,
    packageName: config.packageName,
  });

  const editId = edit.data.id;
  if (!editId) {
    throw new Error('Failed to create a new edit.');
  }

  // Get all listings for the new edit
  const res = await androidpublisher.edits.listings.list({
    auth,
    editId,
    packageName: config.packageName,
  });

  // We must delete the edit, otherwise it will be left pending
  await androidpublisher.edits.delete({
    auth,
    editId,
    packageName: config.packageName,
  });

  return res.data.listings || [];
}

export async function updateListings(listings: ListingPayload[]) {
  const config = await getConfig();
  const auth = await getAuth();

  // Create a new edit
  const edit = await androidpublisher.edits.insert({
    auth,
    packageName: config.packageName,
  });

  const editId = edit.data.id;
  if (!editId) {
    throw new Error('Failed to create a new edit.');
  }

  // Patch each listing in parallel
  await Promise.all(
    listings.map(listing => {
      return androidpublisher.edits.listings.patch({
        auth,
        editId,
        packageName: config.packageName,
        language: listing.language,
        requestBody: {
          title: listing.title,
          shortDescription: listing.shortDescription,
          fullDescription: listing.fullDescription,
        },
      });
    })
  );

  // Commit the changes
  const commitResult = await androidpublisher.edits.commit({
    auth,
    editId,
    packageName: config.packageName,
  });

  return commitResult.data;
} 