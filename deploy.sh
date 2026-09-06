#!/bin/bash
set -e

echo "========================================================"
echo "  🚀 STAFFPOINT - DEPLOY TO GITHUB PAGES"
echo "  Link: https://fongshubvn-cyber.github.io/ncttx-staffpoint/"
echo "========================================================"
echo ""

echo "[1/3] 📦 Biển dịch dự án (Build)..."
npm run build

echo ""
echo "[2/3] 📤 Cập nhật source code lên GitHub (branch main)..."
git add .
COMMIT_MSG="${1:-Update website $(date '+%Y-%m-%d %H:%M:%S')}"
git commit -m "$COMMIT_MSG" || echo "Không có thay đổi mới trong source code."
git push origin main

echo ""
echo "[3/3] 🌐 Upload trang web lên GitHub Pages (gh-pages)..."
npm run deploy

echo ""
echo "========================================================"
echo "✅ ĐÃ DEPLOY THÀNH CÔNG!"
echo "🔗 Link web: https://fongshubvn-cyber.github.io/ncttx-staffpoint/"
echo "========================================================"
