# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https'://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2025-06-22

This version introduces significant enhancements to user control, usability, and the overall visual experience.

### ✨ Added

-   **Selective Language Updates:** A checkbox has been added to each language row. Users can now select exactly which languages they want to include in an update, providing granular control and preventing accidental changes. The "Update" button is only enabled when at least one language is selected.
-   **"Get AI Prompt" Helper:** A new "Get AI Prompt" button has been added. This provides users with a pre-written, optimized prompt to use with AI tools like ChatGPT, ensuring the translated text is returned in the correct format required by the application.
-   **Example File (`pending.txt.example`):** An example file is now included in the project root to clearly demonstrate the required format for the `pending.txt` import file.
-   **Internationalization (i18n) Support:** The user interface now supports both English and Traditional Chinese, with a structure in place to easily add more languages in the future.

### 🎨 Changed

-   **UI Overhaul (Dark Mode):** The application theme has been completely revamped to a developer-focused **Dark Mode**. This reduces eye strain and improves focus. The new color palette uses a deep charcoal background, off-white text for readability, and a calm, subtle blue for all interactive elements.
-   **Enhanced Usability:** The entire area of a language row is now clickable to toggle its corresponding checkbox. This provides a much larger target area, making selection easier and improving overall accessibility.

### 🔄 Modified

-   **File Import Process:** The process of importing translations from `pending.txt` has been streamlined. Instead of requiring a file selection dialog, the application now directly reads the `pending.txt` file from the project's root directory upon clicking the "Import Translations" button.
-   **UI Layout:** The layout for language rows is now a strict grid with a fixed height, ensuring all rows and columns are perfectly aligned regardless of content length for a cleaner, more organized look. The main "Update" button is now a sticky element at the bottom of the screen for constant access.