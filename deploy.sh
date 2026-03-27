#!/bin/bash
# ===== TechBlog 部署脚本 =====
# 使用 Git 实现代码与网站的同步
# 使用方法: bash deploy.sh

set -e

echo "==============================="
echo "  TechBlog 部署脚本"
echo "==============================="

# 1. 构建前端项目
echo ""
echo "[1/4] 构建前端项目..."
npm run build

if [ ! -d "dist" ]; then
  echo "❌ 构建失败：dist 目录不存在"
  exit 1
fi
echo "✅ 前端构建完成"

# 2. Git 提交
echo ""
echo "[2/4] Git 提交变更..."
git add -A
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "deploy: 更新于 $TIMESTAMP" || echo "没有新的变更需要提交"

# 3. 推送到远程仓库
echo ""
echo "[3/4] 推送到远程仓库..."
git push origin main

echo ""
echo "[4/4] 部署完成！"
echo "==============================="
echo ""
echo "如果服务器设置了 Git Hooks，网站将自动更新。"
echo "否则请在服务器上手动执行 git pull 并重启服务。"
echo ""
echo "服务器端操作示例："
echo "  cd /var/www/blog"
echo "  git pull origin main"
echo "  npm install --production"
echo "  pm2 restart blog-server    # 或: node server/server.js"
echo "  sudo systemctl reload nginx"
echo "==============================="
