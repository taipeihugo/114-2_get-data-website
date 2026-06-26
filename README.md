# 課程滿意度調查網站

這是一個純前端的課程滿意度調查網站，可收集課程評分與文字回饋，並把回覆暫存在使用者瀏覽器的 `localStorage`。網站不需要後端伺服器，也可以匯出 CSV 方便整理。

## 最簡單的使用方式

### Windows 使用者

如果你只是想打開網站試用，請直接雙擊：

```text
start-windows.bat
```

或直接雙擊：

```text
index.html
```

不需要安裝 Node.js，也不需要執行 `npm run dev`。

### Mac / Linux 使用者

可以直接用瀏覽器開啟：

```text
index.html
```

或在專案資料夾中啟動簡單伺服器：

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

然後打開：

```text
http://127.0.0.1:4173/
```

## 使用 npm 啟動

如果你的電腦已安裝 Node.js/npm，可以執行：

```bash
npm run dev
```

這個指令會啟動 Python 靜態伺服器，網址同樣是：

```text
http://127.0.0.1:4173/
```

如果 Windows 顯示：

```text
'npm' 不是內部或外部命令、可執行的程式或批次檔。
```

代表你沒有安裝 Node.js/npm。請改用 `start-windows.bat` 或直接雙擊 `index.html`。

## GitHub Pages 發布方式

若要讓其他人用網址填寫問卷，可以用 GitHub Pages：

1. 到 GitHub repo 的 **Settings**。
2. 點左側 **Pages**。
3. Source 選 **Deploy from a branch**。
4. Branch 選 **main**。
5. Folder 選 **/ (root)**。
6. 按 **Save**。

部署完成後，網站網址通常會是：

```text
https://你的帳號.github.io/你的repo名稱/
```

例如：

```text
https://taipeihugo.github.io/114-2_get-data-website/
```

## 重要提醒：不要混淆 127.0.0.1

`127.0.0.1` 代表「你目前使用的那台電腦」。

如果網站是在遠端容器或線上 IDE 執行，你不能直接在自己電腦的瀏覽器輸入：

```text
http://127.0.0.1:4173/
```

你需要使用平台提供的 **Preview / Ports / Forwarded URL**。

## 問卷資料保存位置

問卷回覆會保存在瀏覽器本機的 `localStorage`，不會自動上傳到 GitHub 或伺服器。

這代表：

- 同一台電腦、同一個瀏覽器可以看到已收集回覆。
- 換電腦或換瀏覽器不會看到原本的回覆。
- 清除瀏覽器資料可能會刪除回覆。
- 若要長期保存，請使用網站上的 **下載 CSV** 功能。

## 檔案說明

```text
index.html          網站畫面與問卷表單
styles.css          網站樣式
script.js           問卷儲存、表格顯示、CSV 匯出功能
start-windows.bat   Windows 直接開啟網站用
package.json        npm run dev / npm run preview 指令
```
