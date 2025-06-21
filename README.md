# Google Play Store Batch Updater (Google Play 批量更新工具)

A web-based tool designed to streamline the process of updating Google Play Store listings for multiple languages. This tool helps developers and product managers to efficiently manage and deploy store listing updates, saving time and reducing the risk of manual errors.

## ✨ Features

-   **Fetch All Listings:** Instantly pull all existing store listings for your app directly from the Google Play Console.
-   **Dual-Column UI:** A clear, side-by-side interface to compare remote data (left) with your local drafts (right).
-   **Structured Export:** Generate a `pending.txt` file formatted specifically for easy translation with AI tools like ChatGPT.
-   **AI Prompt Generation:** Get a pre-written, optimized prompt to ensure AI tools provide translations in the correct format.
-   **Smart Import:** Upload the translated `pending.txt` file to automatically populate the draft fields.
-   **Selective Updates:** Use checkboxes to select exactly which languages you want to update.
-   **Safe Updates:**
    -   Requires confirmation before pushing changes to the Play Store.
    -   Automatically backs up the current live listings to a local `./backup/` folder before every update.
-   **Dark Mode First:** A clean, developer-focused dark theme to reduce eye strain.
-   **i18n Support:** Interface available in English and Traditional Chinese.

## 📋 Prerequisites

Before you begin, ensure you have completed the following steps:

1.  You have a **Google Cloud Project**.
2.  The **Google Play Android Developer API** is enabled for your project.
3.  You have created a **Service Account** and downloaded its **JSON key file**.
4.  You have added the Service Account's email address to your **Google Play Console** with the necessary permissions (e.g., "Admin" or at least "View app information" and "Manage store presence").

## 🚀 Getting Started

Follow these steps to get the application running on your local machine.

### 1. Installation

Clone the repository and install the required dependencies.

```bash
git clone <repository-url>
cd <repository-folder>
npm install
```

### 2. Configuration

1.  In the root of the project, create a file named `config.json`.
2.  Copy the following structure into `config.json`:

    ```json
    {
      "packageName": "your.app.package.name",
      "keyFilePath": "./path/to/your/service-account-key.json"
    }
    ```

3.  Replace `"your.app.package.name"` with your app's package name (e.g., `hibernate.v2.testyourandroid`).
4.  Update the `keyFilePath` with the correct path to the Service Account JSON key you downloaded.

### 3. Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## ⚙️ How to Use

1.  **Fetch Data:** The app will automatically fetch all your current store listings upon loading.
2.  **Prepare for Translation:**
    -   Click **"Generate for Translation"** to download a `pending.txt` file containing all current listings.
    -   (Optional) Click **"Show Locale Codes"** to copy all language codes or **"Get AI Prompt"** to get a ready-to-use prompt for your AI translation tool.
3.  **Translate:** Use your preferred AI tool or translation service to translate the content inside `pending.txt`. Ensure the structure remains the same.
4.  **Import Translations:** Click **"Import Translations"** and select your updated `pending.txt` file. The translated content will appear in the "Local Draft" (right-side) column.
5.  **Select & Update:**
    -   Click on a language row to select it for the update. A checkbox will appear ticked.
    -   Review the changes in the draft column.
    -   Click the **"Update to Play Store"** button. Only the rows you've selected will be updated.
6.  **Confirm:** A confirmation dialog will appear. After confirming, the selected listings will be pushed to the Google Play Store.
7.  **Done:** The UI will refresh, showing the latest data from the Play Store, and your draft fields and selections will be cleared.

## 🛠️ Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Runtime:** [Node.js](https://nodejs.org/)
