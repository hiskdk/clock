@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================================
echo 正在將個人時鐘首頁推送到 GitHub: https://github.com/hiskdk/clock.git
echo ========================================================
git push -u origin main
echo.
echo ========================================================
echo 執行完畢，若顯示 100% 則表示成功！
echo 請按任意鍵關閉此視窗...
pause >nul
