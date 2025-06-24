Google Play 批量更新工具 - 產品需求文件 (PRD)
版本： 1.6

日期： 2025年6月22日

目標： 開發一個基於 Web UI 的應用程式，讓開發者能高效地批量更新 Google Play 商店的應用程式列表資訊。

1. 總覽 (Overview)
本專案旨在創建一個運行於本地的 Node.js Web 應用程式。使用者可以透過一個直觀的網頁介面，從 Google Play 拉取其應用程式所有語言的商店列表資訊，導出成便於 AI 翻譯的特定格式文本，然後再將翻譯好的內容導回介面，最終一鍵批量更新至 Google Play。

2. 目標用戶 (Target User)
Android 應用程式的開發者或產品營運人員，他們需要管理多種語言的商店頁面，並希望簡化翻譯和更新的流程。

3. 核心用戶流程 (Core User Flow)
設定： 用戶配置 config.json 檔案。

啟動： 用戶運行 npm run dev 並打開瀏覽器。

獲取資料： 應用程式自動獲取商店列表並顯示在左欄。

導出翻譯： 用戶點擊「Generate for Translation」將現有內容保存到根目錄的 pending.txt 檔案中。

翻譯內容： 用戶直接在根目錄下編輯 pending.txt 檔案，填入翻譯內容。

匯入翻譯： 用戶點擊「Import Translations」按鈕，應用程式會自動從根目錄讀取 pending.txt 並將內容填入右欄。

審核與更新： 用戶點擊「Update to Play Store」。

完成： 應用程式備份、更新、刷新介面。

4. 功能需求 (Functional Requirements)
4.1. 專案設定與認證

設定檔 (config.json): 需包含 packageName 和 keyFilePath。該檔案會被加入 .gitignore。

設定內容範例:

{
  "packageName": "hibernate.v2.testyourandroid",
  "keyFilePath": "./path/to/your/service-account-key.json"
}

4.2. 主介面 (UI)

佈局: 左欄 (唯讀遠端資料) 和右欄 (可編輯草稿)。

語言標示: 每行需清晰標示語言代碼。

專案連結: 介面的頁首或頁尾應包含一個 GitHub 圖示連結，指向專案的原始碼儲存庫 (https://github.com/himphen/google-play-batch-listing-edit)。

懸浮操作按鈕 (Sticky Action Button):

「Update to Play Store」 按鈕應始終懸浮固定在畫面的右下角。

內容列表的底部需要增加足夠的內邊距 (padding)，以防止列表的最後一項被懸浮按鈕遮擋。

4.3. 獲取與導出資料

生成內容按鈕: 「Generate for Translation」。點擊後，會將當前所有語言的列表資訊以特定格式寫入到專案根目錄下的 pending.txt 檔案中。

pending.txt 格式: --- + 語言代碼 + JSON 物件。

導出語言代碼: 「Show Locale Codes」按鈕彈出帶有複製功能的對話框。

4.4. 匯入與驗證資料

匯入按鈕: 「Import Translations」。

[更新] 解析邏輯: 點擊此按鈕後，應用程式將直接讀取並解析位於專案根目錄下的 pending.txt 檔案，無需用戶手動選擇。解析後的內容將填充到右欄的草稿區。

錯誤處理: 如果 pending.txt 不存在或格式不正確，應提供清晰的錯誤提示。

4.5. 更新至 Google Play

更新按鈕: 「Update to Play Store」。

確認與備份: 彈出確認對話框，並在更新前自動備份當前資料。

API 更新與介面刷新: 調用 API 更新後，刷新左欄並清空右欄。

5. 技術規格 (Technical Specifications)
5.1. 專案結構 (Project Structure)

./pages/index.tsx: 主應用程式頁面。

./pages/api/listings.ts: 後端 API 路由，用於獲取所有商店列表。

./pages/api/update.ts: 後端 API 路由，用於執行更新。

./pages/api/import.ts: [新增] 後端 API 路由，用於讀取和解析 pending.txt。

./components/: 可重用的 React 組件。

./lib/google-api.ts: 封裝與 Google Play Developer API 的互動。

./backup/: 自動生成的目錄，用於存放備份。

config.json: 用戶設定檔。

pending.txt: [核心檔案] 用於與使用者交換翻譯內容的檔案，位於根目錄。

5.2. 資料模型 (Data Models - TypeScript)

// 用於在前後端之間傳遞的列表資料結構
interface ListingPayload {
  language: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
}

// config.json 的結構
interface AppConfig {
  packageName: string;
  keyFilePath: string;
}

5.3. API 呼叫流程 (API Call Flow)

獲取列表 (Fetch Listings):

前端 (index.tsx) 頁面載入時，呼叫 /api/listings。

後端 (/api/listings) 收到請求，與 Google API 互動後回傳列表陣列 (ListingPayload[])。

更新列表 (Update Listings):

前端 (index.tsx) 將右欄的資料 POST 到 /api/update。

後端 (/api/update) 收到請求，執行備份、遍歷更新並提交。

6. 非功能性需求 (Non-Functional Requirements)
技術棧 (Tech Stack): Next.js, TypeScript, Tailwind CSS, Node.js

介面語言 (UI Language): 英語 (English)

7. 你需要準備的資料 (Prerequisites)
一個 Google Cloud Project。

已啟用 Google Play Android Developer API。

已創建一個服務帳戶 (Service Account) 並下載其 JSON 金鑰。

已將服務帳戶的 email 添加到 Google Play Console 用戶權限中，並給予足夠權限。

8. 參考資料 (References)
Google Play Android Developer API - Getting Started: https://developers.google.com/android-publisher/getting_started

Google Play Android Developer API - Main Reference: https://developers.google.com/android-publisher/api-ref/rest

API Reference - Edits.listings:list: https://developers.google.com/android-publisher/api-ref/rest/v3/edits.listings/list

API Reference - Edits.listings:patch: https://developers.google.com/android-publisher/api-ref/rest/v3/edits.listings/patch