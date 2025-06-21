Google Play 批量更新工具 - 產品需求文件 (PRD)
版本： 1.2

日期： 2025年6月22日

目標： 開發一個基於 Web UI 的應用程式，旨在徹底簡化並自動化 Google Play 商店應用程式列表資訊的更新流程，讓開發者能高效、安全地進行批量操作。

1. 總覽 (Overview)
對於擁有全球用戶的應用程式而言，管理數十種語言的商店頁面是一項繁瑣且容易出錯的任務。開發者或營運人員常常需要手動複製、貼上標題和描述，不僅耗時，也極易因人為疏忽導致內容錯置或格式錯誤，影響品牌形象和用戶獲取。

本專案旨在解決此痛點，創建一個運行於本地的 Node.js Web 應用程式。使用者將能透過一個直觀的網頁介面，一鍵從 Google Play 拉取其應用程式所有語言的商店列表資訊。接著，應用程式會將這些資訊導出成一種專為 AI 翻譯工具優化的結構化文本格式 (pending.txt)。待用戶完成翻譯後，可再將檔案導回介面進行預覽和最終確認，最終一鍵批量、安全地將所有變更發佈至 Google Play。這將徹底改變目前低效的手動工作模式。

2. 目標用戶 (Target User)
我們的目標用戶是 Android 應用程式的開發者或產品營運人員。他們面臨的具體挑戰包括：

多語言管理的複雜性： 需要為不同地區的用戶提供本地化的商店頁面，語言種類繁多。

更新流程的重複性： 每次應用程式有重大更新或市場活動時，都需要重複修改多種語言的標題和描述。

協作的困難： 可能需要與翻譯人員或不同地區的團隊協作，內容的傳遞和版本控制容易混亂。

對出錯的擔憂： 手動操作 Play Console 存在風險，錯誤的更新可能導致需要重新審核或影響線上版本。

本工具旨在成為他們不可或缺的效率夥伴。

3. 核心用戶流程 (Core User Flow)
設定： 用戶首次使用時，需在專案根目錄下配置 config.json 檔案。此步驟是為了建立應用程式與用戶 Google Play 帳戶之間的安全連接。

啟動： 在終端機中運行 npm run dev，應用程式啟動後，用戶在瀏覽器打開本地網址即可進入主介面。

獲取資料： 應用程式會自動調用 Google API，獲取指定應用程式當前所有語言的列表資訊，並將其作為「權威資料來源」顯示在介面的左欄。

導出翻譯：

若用戶需要提供語言列表給翻譯工具，可點擊「Show Locale Codes」快速複製所有語言代碼。

點擊「Generate for Translation」後，應用程式會將左欄的資料轉換成結構清晰的 pending.txt 檔案，用戶可直接將此檔案內容提交給 AI 進行翻譯。

翻譯內容： 用戶使用自己偏好的外部 AI 工具（如 ChatGPT、Claude 等）或人工翻譯服務來處理 pending.txt 中的內容。

匯入翻譯： 完成翻譯後，點擊「Import Translations」，選擇修改過的 txt 檔案。應用程式會解析檔案，並將新的翻譯內容填充到介面右欄的「草稿區」。

審核與更新： 用戶在介面右欄仔細核對所有語言的翻譯。確認無誤後，點擊「Update to Play Store」發起更新請求。

完成： 系統在執行更新前會先備份，然後將變更推送至 Google Play。成功後，介面會自動刷新，左欄顯示最新資料，右欄則被清空，完成一次完整的更新循環。

4. 功能需求 (Functional Requirements)
4.1. 專案設定與認證

設定檔 (config.json): 需包含 packageName 和 keyFilePath。此檔案會被加入 .gitignore，以確保服務帳戶的敏感金鑰不會意外洩漏至公開的版本控制庫中。

設定內容範例:

{
  "packageName": "hibernate.v2.testyourandroid",
  "keyFilePath": "./keys/google-service-account.json"
}

4.2. 主介面 (UI)

佈局: 採用一個結構清晰、對齊的網格佈局 (Grid Layout)。

雙欄結構: 整個內容區域分為兩大欄：左欄為「Remote Data」（線上資料），右欄為「Local Draft」（本地草稿）。

語言行 (Row): 每一種語言都以一個獨立的「行」來呈現。所有語言行都應具有統一且固定的高度，確保垂直方向上的整齊對齊，避免因內容長短不一造成佈局錯亂。

欄位對齊: 在每一行內，左欄的 Title, Short Description, Full Description 欄位應與右欄對應的輸入框在垂直方向上嚴格對齊，形成一個乾淨的表格狀結構。Full Description 的文本區域 (textarea) 應有固定的高度，內容超出時提供滾動條，而不是讓行高自適應內容，以維持整體佈局的穩定性和一致性。

語言標示: 每一行都必須清晰標示其 BCP-47 語言代碼 (如 zh-TW, en-US, ja-JP)，讓用戶能準確對應。

4.3. 獲取與導出資料

生成內容按鈕: 介面上提供一個顯眼的「Generate for Translation」按鈕。

pending.txt 格式: 生成的檔案內容嚴格遵循 --- 分隔符、後接語言代碼、再接一個包含 title, shortDescription, fullDescription 的 JSON 物件的格式。

導出語言代碼: 為了方便用戶設置 AI Prompt，提供一個「Show Locale Codes」按鈕。點擊後會彈出一個對話框，其中包含所有語言代碼的純文字列表，並附帶一個「Copy」按鈕。

4.4. 匯入與驗證資料

匯入按鈕: 提供「Import Translations」按鈕，點擊後觸發檔案選擇器。

解析與錯誤處理: 後端邏輯會嚴格校驗上傳檔案的格式。如果格式不符（如 --- 分隔符遺失、JSON 語法錯誤、缺少必要的鍵），前端介面必須給出具體且友好的錯誤提示，例如「檔案解析失敗：第 25 行的 JSON 格式不正確」或「在 ja-JP 區塊中找不到 title 欄位」。

4.5. 更新至 Google Play

更新按鈕: 提供一個主要的行動號召按鈕「Update to Play Store」。

確認與備份: 點擊更新後，會彈出一個非阻斷式的確認對話框（Modal），再次詢問用戶是否確認操作。在用戶確認後、API 呼叫發出前，系統會自動將左欄的當前線上資料完整備份到本地的 ./backup/ 目錄下，檔名包含精確的時間戳，作為安全回退的保障。

API 更新與介面刷新: 調用 API 成功後，前端會收到成功訊息，並自動重新觸發一次資料獲取流程，以刷新左欄內容，確保其與 Google Play 的最新狀態同步，同時清空右欄的草稿。

5. 技術規格 (Technical Specifications)
5.1. 專案結構 (Project Structure)

./pages/index.tsx: 應用程式的單一主頁面，負責狀態管理和 UI 元件的佈局。

./pages/api/listings.ts: 後端 API 路由，專門處理獲取商店列表的請求。

./pages/api/update.ts: 後端 API 路由，處理更新請求。

./components/: 存放可重用的 React 組件。

./lib/google-api.ts: 封裝所有與 Google Play Developer API 的底層互動。

./public/locales/: 存放國際化 (i18n) 語言檔案的目錄。

./en/common.json: 英語語言檔案。

./zh-TW/common.json: 繁體中文語言檔案。

./backup/: 自動生成的目錄，用於存放 JSON 格式的備份檔案。

config.json: 用戶設定檔。

5.2. 資料模型 (Data Models - TypeScript)

// 用於在前後端之間傳遞的列表資料結構
interface ListingPayload {
  language: string;        // BCP-47 語言代碼, e.g., "en-US"
  title: string;           // 應用程式標題
  shortDescription: string;// 簡短描述
  fullDescription: string; // 完整描述
}

// config.json 的結構定義
interface AppConfig {
  packageName: string;     // 目標應用的包名, e.g., "com.example.app"
  keyFilePath: string;     // 指向服務帳戶金鑰 JSON 檔案的路徑
}

5.3. API 呼叫流程 (API Call Flow)

獲取列表 (Fetch Listings):

前端 (index.tsx) 頁面載入時，觸發一個 fetch 請求到 /api/listings。

後端 (/api/listings) 收到請求後，初始化客戶端，呼叫 edits.insert() 取得 editId，接著呼叫 edits.listings.list() 獲取資料，最後回傳給前端。

更新列表 (Update Listings):

前端 (index.tsx) 在用戶點擊並確認更新後，將草稿資料 POST 到 /api/update。

後端 (/api/update) 收到請求後，執行備份，然後呼叫 edits.insert()，接著並發處理所有 edits.listings.patch() 請求，最後呼叫 edits.commit() 來發布變更。

6. 非功能性需求 (Non-Functional Requirements)
技術棧 (Tech Stack):

框架: Next.js

語言: TypeScript

樣式: Tailwind CSS

運行環境: Node.js

視覺設計與主題 (Visual Design & Theme):

主題 (Theme): 應用程式將採用淺色模式 (Light Mode)，確保在各種環境下都有最佳的可讀性。

主色調 (Primary Color): 將選用一種讓人感覺平靜的藍色（如 Tailwind CSS 中的 sky 或 blue-500）作為主要互動顏色。此顏色將用於按鈕、連結、焦點狀態及重要的圖示上，引導用戶操作。

輔助色 (Secondary Colors): 將使用中性的灰色系（如 Tailwind CSS 的 slate）作為背景、邊框和文字顏色，創造一個乾淨、專業且不干擾的視覺環境。

介面語言 (UI Language):

應用程式將支援國際化 (i18n)，允許用戶切換介面語言。

初期階段將提供 英語 (English) 和 繁體中文 (Traditional Chinese) 兩種語言選項。

語言資源將以 JSON 格式存放於 /public/locales 目錄下，方便未來擴充更多語言。

7. 你需要準備的資料 (Prerequisites)
一個有效的 Google Cloud Project。

在該專案中，已啟用 Google Play Android Developer API。

已創建一個服務帳戶 (Service Account) 並下載其 JSON 金鑰。

已將服務帳戶的 email 添加到 Google Play Console 用戶權限中，並給予足夠權限。

8. 參考資料 (References)
Google Play Android Developer API - Getting Started: https://developers.google.com/android-publisher/getting_started

Google Play Android Developer API - Main Reference: https://developers.google.com/android-publisher/api-ref/rest

API Reference - Edits.listings:list: https://developers.google.com/android-publisher/api-ref/rest/v3/edits.listings/list

API Reference - Edits.listings:patch: https://developers.google.com/android-publisher/api-ref/rest/v3/edits.listings/patch