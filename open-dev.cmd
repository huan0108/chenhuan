@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo [错误] 未检测到可用的 Node.js。
  echo 请先安装 Node.js 22 LTS: https://nodejs.org/
  pause
  exit /b 1
)

if not exist "%~dp0node_modules" (
  echo 正在进行首次安装，请耐心等待...
  call npm install
  if errorlevel 1 (
    echo.
    echo [错误] 安装失败，请把本窗口内容截图发给卖家或 AI。
    pause
    exit /b 1
  )
)

echo.
echo 正在启动网站，浏览器会自动打开。
echo 保持本窗口开启；关闭窗口后网站会停止。
echo.
call npm run dev -- --open
