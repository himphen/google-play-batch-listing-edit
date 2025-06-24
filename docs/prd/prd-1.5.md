Google Play 批量更新工具 - 產品需求文件 (PRD)
版本： 1.5

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
設定： 用戶首次使用時，需在專案根目錄下配置 config.json 檔案。

啟動： 在終端機中運行 npm run dev，用戶在瀏覽器打開本地網址即可進入主介面。

獲取資料： 應用程式會自動調用 Google API，獲取指定應用程式當前所有語言的列表資訊，並顯示在介面的左欄。

導出翻譯：

點擊「Show Locale Codes」快速複製所有語言代碼。

點擊「Get AI Prompt」獲取可以直接用於 ChatGPT 等工具的提示。

點擊「Generate for Translation」後，應用程式會將左欄的資料轉換成 pending.txt 檔案。

翻譯內容： 用戶使用外部工具處理 pending.txt 中的內容。

匯入翻譯： 完成翻譯後，點擊「Import Translations」，將內容填充到介面右欄的「草稿區」。

審核與更新：

用戶在右欄仔細核對所有語言的翻譯內容。

勾選希望更新的語言。

確認無誤後，點擊「Update to Play Store」發起更新請求。

完成： 系統在執行更新前會先備份，然後將已勾選的語言變更推送至 Google Play。成功後，介面會自動刷新，並清空所有草稿和勾選狀態。

4. 功能需求 (Functional Requirements)
4.1. 專案設定與認證

設定檔 (config.json): 需包含 packageName 和 keyFilePath。此檔案會被加入 .gitignore。

設定內容範例:

{
  "packageName": "hibernate.v2.testyourandroid",
  "keyFilePath": "./keys/google-service-account.json"
}

4.2. 主介面 (UI)

佈局: 採用一個結構清晰、對齊的網格佈局 (Grid Layout)。

雙欄結構: 整個內容區域分為兩大欄：左欄為「Remote Data」（線上資料），右欄為「Local Draft」（本地草稿）。

語言行 (Row): 每一種語言都以一個獨立的「行」來呈現。所有語言行都應具有統一且固定的高度，確保垂直方向上的整齊對齊。

欄位對齊: 在每一行內，左欄的 Title, Short Description, Full Description 欄位應與右欄對應的輸入框在垂直方向上嚴格對齊。

更新選擇框 (Update Checkbox):

在每一語言行的最前面（或最顯眼的位置），應有一個核取方塊 (Checkbox)。

此核取方塊用於標記該語言是否包含在下一次的更新操作中。

預設狀態: 所有核取方塊在頁面載入、匯入檔案後均預設為未勾選 (unchecked) 狀態。

[新功能] 提升可用性 (Enhanced Usability): 為了方便操作，點擊該語言行的任何區域都應能觸發其對應核取方塊的勾選/取消勾選狀態，提供一個更大的點擊目標。

語言標示: 每一行都必須清晰標示其 BCP-47 語言代碼 (如 zh-TW, en-US, ja-JP)。

4.3. 獲取與導出資料

生成內容按鈕: 介面上提供一個顯眼的「Generate for Translation」按鈕。

pending.txt 格式: 生成的檔案內容嚴格遵循 --- 分隔符、後接語言代碼、再接一個 JSON 物件的格式。

導出語言代碼: 提供一個「Show Locale Codes」按鈕，點擊後彈出對話框，其中包含所有語言代碼的純文字列表。

獲取 AI 翻譯提示: 提供一個「Get AI Prompt」按鈕，點擊後彈出對話框，顯示預設好的提示文字，指導 AI 生成符合格式的翻譯。

4.4. 匯入與驗證資料

匯入按鈕: 提供「Import Translations」按鈕，點擊後觸發檔案選擇器。

解析與錯誤處理: 後端邏輯會嚴格校驗上傳檔案的格式。如果格式不符，前端介面必須給出具體且友好的錯誤提示。

4.5. 更新至 Google Play

更新按鈕: 提供一個主要的行動號召按鈕「Update to Play Store」。此按鈕應在至少有一個語言被勾選時才可點擊。

更新邏輯:

點擊更新後，應用程式只會處理被勾選的語言行。

未被勾選的語言，即使其草稿區有內容，也不會被包含在 API 更新請求中。

確認與備份: 點擊更新後，會彈出一個非阻斷式的確認對話框。在用戶確認後、API 呼叫發出前，系統會自動將左欄的當前線上資料完整備份到本地的 ./backup/ 目錄下。

API 更新與介面刷新: 調用 API 成功後，前端會收到成功訊息，並自動重新觸發一次資料獲取流程，刷新左欄內容，同時清空右欄的所有草稿內容，並將所有核取方塊重設為未勾選狀態。

5. 技術規格 (Technical Specifications)
5.1. 專案結構 (Project Structure)

./pages/index.tsx: 主應用程式頁面。

./pages/api/listings.ts: 獲取商店列表的後端 API。

./pages/api/update.ts: 處理更新請求的後端 API。

./components/: 可重用的 React 組件。

./lib/google-api.ts: 封裝 Google API 互動。

./public/locales/: 存放國際化 (i18n) 語言檔案。

./backup/: 自動備份目錄。

config.json: 用戶設定檔。

pending.txt.example: 一個範例檔案，向用戶展示匯入檔案時所需的正確格式。

5.2. 資料模型 (Data Models - TypeScript)

// 用於在前後端之間傳遞的列表資料結構
interface ListingPayload {
  language: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
}

// config.json 的結構定義
interface AppConfig {
  packageName: string;
  keyFilePath: string;
}

5.3. API 呼叫流程 (API Call Flow)

獲取列表 (Fetch Listings):

前端 (index.tsx) 頁面載入時，觸發一個 fetch 請求到 /api/listings。

後端 (/api/listings) 收到請求後，初始化客戶端，呼叫 edits.insert() 取得 editId，接著呼叫 edits.listings.list() 獲取資料，最後回傳給前端。

更新列表 (Update Listings):

前端 (index.tsx) 在用戶點擊並確認更新後，先過濾出所有被勾選的語言及其草稿內容，然後將這個過濾後的資料陣列 POST 到 /api/update。

後端 (/api/update) 收到請求後，執行備份，然後呼叫 edits.insert()，接著並發處理所有傳入語言的 edits.listings.patch() 請求，最後呼叫 edits.commit() 來發布變更。

6. 非功能性需求 (Non-Functional Requirements)
技術棧 (Tech Stack):

框架: Next.js

語言: TypeScript

樣式: Tailwind CSS

運行環境: Node.js

視覺設計與主題 (Visual Design & Theme):

主題 (Theme): 應用程式將優先採用深色模式 (Dark Mode)，以減少長時間使用的視覺疲勞。背景將使用近黑色或深炭灰色 (e.g., #212121, #0F172A)。

主色調與互動元素 (Primary & Interactive Colors):

互動元素: 對於按鈕、連結、焦點狀態和可點擊圖示等互動元素，將採用一種沉靜而清晰的藍色或藍綠色 (Subtle Blue/Teal)，以有效引導用戶注意力。

文字顏色: 主要內文和非關鍵資訊將使用柔和的灰白色 (Off-White) (e.g., #E0E0E0)，確保在深色背景下的最佳可讀性。

輔助色與狀態指示 (Secondary & Status Colors):

介面結構: 邊框、分隔線和非互動圖示將使用不同深淺的灰色系，以建立清晰的視覺層次。

狀態顏色: 應用明確的顏色以指示狀態：綠色代表成功，橘色/黃色代表警告，紅色代表錯誤。

設計原則 (Design Principle): 整體設計將遵循極簡主義 (Minimalism) 和功能導向的原則。避免使用不必要的漸層或陰影，專注於提供一個乾淨、無干擾、讓開發者能高效聚焦於任務的工作介面。

介面語言 (UI Language):

應用程式將支援國際化 (i18n)。

初期階段將提供 英語 (English) 和 繁體中文 (Traditional Chinese)。

7. 你需要準備的資料 (Prerequisites)
一個有效的 Google Cloud Project。

已啟用 Google Play Android Developer API。

已創建一個服務帳戶 (Service Account) 並下載其 JSON 金鑰。

已將服務帳戶的 email 添加到 Google Play Console 用戶權限中，並給予足夠權限。

8. 參考資料 (References)
Google Play Android Developer API - Getting Started: https://developers.google.com/android-publisher/getting_started

Google Play Android Developer API - Main Reference: https://developers.google.com/android-publisher/api-ref/rest

API Reference - Edits.listings:list: https://developers.google.com/android-publisher/api-ref/rest/v3/edits.listings/list

API Reference - Edits.listings:patch: https://developers.google.com/android-publisher/api-ref/rest/v3/edits.listings/patch