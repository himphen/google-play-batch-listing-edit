Google Play 批量更新工具 - 產品需求文件 (PRD)
版本： 1.0

日期： 2025年6月21日

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

佈局: 採用清晰的雙欄設計。左欄為「Remote Data」，是從 Google Play 獲取的唯讀資料，代表當前的線上狀態。右欄為「Local Draft」，是可編輯的草稿區，用戶在此準備更新內容。

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

./pages/index.tsx: 應用程式的單一主頁面，負責狀態管理（如遠端列表、本地草稿、載入狀態等）和 UI 元件的佈局。

./pages/api/listings.ts: 後端 API 路由，專門處理獲取商店列表的請求。它會與 Google API 互動並將格式化後的資料回傳給前端。

./pages/api/update.ts: 後端 API 路由，處理更新請求。它將負責執行備份、遍歷更新所有語言，並最終提交變更。

./components/: 存放可重用的 React 組件，例如 ListingRow.tsx（單一語言的顯示行）、ConfirmationModal.tsx（更新確認對話框）、Notification.tsx（成功/失敗通知）。

./lib/google-api.ts: 專案的核心邏輯模組，封裝所有與 Google Play Developer API 的底層互動，包括認證客戶端、創建編輯、發送請求等。

./backup/: 自動生成的目錄，用於存放 JSON 格式的備份檔案。此目錄預設會被加入 .gitignore。

config.json: 用戶設定檔，用於指定目標應用程式和認證資訊。

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

後端 (/api/listings) 收到請求後：
a.  透過 google-api.ts 中的函式讀取 config.json 並初始化一個經過授權的 google.androidpublisher 客戶端。
b.  呼叫 androidpublisher.edits.insert() 取得一個臨時性的 editId，這會開啟一個編輯會話。
c.  使用此 editId 呼叫 androidpublisher.edits.listings.list() 來獲取所有語言的列表資料。
d.  （可選但推薦）為保持整潔，呼叫 edits.delete() 關閉此僅用於讀取的編輯會話。
e.  將獲取的列表陣列 (ListingPayload[]) 作為 JSON 回應傳回給前端。

更新列表 (Update Listings):

前端 (index.tsx) 在用戶點擊並確認更新後，將右欄的草稿資料陣列 (ListingPayload[]) 作為請求主體 (body) POST 到 /api/update。

後端 (/api/update) 收到請求後：
a.  備份: 讀取當前的遠端資料（可透過一次快速的 fetch 或從前端傳入），並將其寫入 ./backup/ 目錄下的新 JSON 檔案中。
b.  創建編輯: 呼叫 androidpublisher.edits.insert() 取得一個新的、專用於此次更新的 editId。
c.  遍歷更新: 對於請求主體中的每一個語言 ListingPayload，異步地呼叫 androidpublisher.edits.listings.patch()，並將 editId 和該語言的資料傳入。推薦使用 Promise.all() 來並發處理所有更新請求以提高效率。
d.  驗證與提交: 所有 patch 請求成功後，可選擇性呼叫 androidpublisher.edits.validate() 檢查是否有錯誤。若無誤，則呼叫 androidpublisher.edits.commit() 來正式發布所有變更。
e.  根據提交結果，向前端回傳一個包含成功或失敗狀態的 JSON 回應。

6. 非功能性需求 (Non-Functional Requirements)
技術棧 (Tech Stack):

框架: Next.js (提供混合渲染和簡化的 API 路由)

語言: TypeScript (增強程式碼的健壯性和可維護性)

樣式: Tailwind CSS (用於快速建構現代化和響應式的 UI)

運行環境: Node.js

介面語言 (UI Language): 初期階段，所有介面元素和提示資訊均使用英語 (English)，以符合開源專案的國際化慣例。

7. 你需要準備的資料 (Prerequisites)
一個有效的 Google Cloud Project。

在該專案的 API & Services Library 中，已啟用 Google Play Android Developer API。

已在 IAM & Admin 中創建一個服務帳戶 (Service Account)，並為其生成並下載了 JSON 格式的金鑰。

已將該服務帳戶的 email 地址（類似 your-service-account@your-project.iam.gserviceaccount.com）添加到 **Google Play Console 的「用戶和權限」**頁面中，並授予其至少「查看應用資訊」和「管理商店發佈」的權限。

8. 參考資料 (References)
Google Play Android Developer API - Getting Started: https://developers.google.com/android-publisher/getting_started

Google Play Android Developer API - Main Reference: https://developers.google.com/android-publisher/api-ref/rest

Service Endpoint: https://androidpublisher.googleapis.com

API Reference - Edits.listings:list: https://developers.google.com/android-publisher/api-ref/rest/v3/edits.listings/list

API Reference - Edits.listings:patch: https://developers.google.com/android-publisher/api-ref/rest/v3/edits.listings/patch

9. 下一步 (Next Steps)
這份擴充版的 PRD 已經非常詳盡。在我們共同確認所有細節無誤後，下一步就是將這些規格轉化為實際的、高品質的程式碼。