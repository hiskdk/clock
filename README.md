# DIC-1 Personal Page • hiskdk

> 現代深色毛玻璃風格（Cyberpunk Glassmorphism）個人主頁與即時高精度時鐘儀表板。

🌐 **線上公開預覽（GitHub Pages）**：[https://hiskdk.github.io/clock/](https://hiskdk.github.io/clock/)

---

## 📌 作業要求落實 (DIC-1 Requirements)

### 👤 1. Profile（個人資訊）
- **姓名／暱稱**：`hiskdk`
- **專長與科系**：資訊工程系 • AIoT & Embedded Intelligence
- **自我介紹**：熱愛物聯網與智慧系統開發，致力於探索軟硬整合與現代 Web 互動體驗。
- **互動編輯功能**：點擊「編輯個人資料」按鈕即可直接在彈出視窗中自訂姓名、科系與自介，並即時寫入瀏覽器 `localStorage` 永久保存。

### 🛠 2. Skills（專業技能）
- 🐍 **Python & 資料科學**：NumPy、自動化腳本、FastAPI、機器學習
- ⚡ **C / C++ & 嵌入式系統**：Arduino、ESP32、FreeRTOS、微控制器驅動
- 🌐 **Web 前端開發**：HTML5 語意化、毛玻璃 CSS3 視覺特效、JavaScript ES6+
- 🤖 **AIoT 邊緣計算**：MQTT 通訊協定、感測節點數據採樣、Edge AI

### 🚀 3. Projects（專案作品）
1. **Smart AIoT Real-Time Chronometer & Personal Hub**（已完成）
   - 即時高精度動態時鐘與環境儀表板，支援 12H/24H 切換、時區與進度感知，並具備即時個人資料編輯功能。
   - 技術棧：`HTML5`, `CSS3 Glassmorphism`, `JavaScript ES6+`, `Web Audio API`
   - 原始碼：[https://github.com/hiskdk/clock](https://github.com/hiskdk/clock)
2. **ESP32 環境感測物聯網邊緣節點 (IoT Telemetry Node)**（本學期預計專案）
   - 利用 ESP32 微控制器採集環境溫濕度與光照數據，透過 MQTT 協定實時回傳至雲端監控端點。
   - 技術棧：`C++`, `ESP32`, `FreeRTOS`, `MQTT`, `Sensors`

### 🕐 4. Live Clock（即時動態時鐘）
- **高精度數位時鐘**：以毫秒級精度實時刷新 `HH : MM : SS`，帶有呼吸動態冒號。
- **極簡指針時鐘**：60 FPS 連續掃秒指針設計。
- **雙進度條**：直觀顯示「今日時間進度 %」與「年度累計進度 %」。
- **時區偵測**：自動辨識所在時區與 UTC 偏移量（如 `UTC+08:00`）。

### 🎨 5. Personal Design（個人化設計與視覺風格）
- **深色毛玻璃（Dark Glassmorphism）**：高質感玻璃半透明背景、環境背景光暈。
- **現代字體搭配**：搭配 Google Fonts 之 `Outfit`、`Plus Jakarta Sans` 與 `JetBrains Mono`。
- **主題調色盤切換**：星雲紫（Violet）、極光青（Cyan）、落日金（Amber）、矩陣綠（Emerald）。

### ⭐ Bonus Challenge（加分項目全部達成）
- [x] 🌅 根據時段自動變換問候語（早晨、下午、傍晚、夜晚）
- [x] 🔄 12H / 24H 時間切換機制
- [x] 🌍 本地時區與 UTC 偏移自動偵測
- [x] 📋 一鍵複製時間戳記
- [x] ✏️ 完整 Profile 編輯與自訂視窗
- [x] 💾 使用 `localStorage` 記憶個人設定、時間格式與主題
- [x] 🔊 Web Audio API 程序化合成溫和滴答音效
- [x] 📱 完整響應式手機與電腦版面適配

---

## 🚀 本地預覽 (Quick Start)

直接以任何現代瀏覽器開啟 `index.html`，或啟動輕量本地伺服器：

```bash
# 使用 Python
python -m http.server 8080
```

前往 [http://localhost:8080/](http://localhost:8080/) 即可預覽。

---

## 📂 專案檔案架構

```text
├── index.html       # 網頁結構與各區塊 (Profile, Clock, Skills, Projects)
├── style.css        # 毛玻璃樣式、主題色盤與響應式排版
├── app.js           # 即時時鐘運算、進度追蹤與 localStorage 邏輯
├── README.md        # 作業規範說明與專案介紹
└── .gitignore       # Git 忽略檔案設定
```
