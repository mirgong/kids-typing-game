#!/bin/bash

# 小键盘探险家 - 部署脚本
# 将网站部署到静态托管服务

echo "🚀 开始部署小键盘探险家打字游戏网站..."

# 检查必要文件
required_files=("index.html" "style.css" "script.js")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 错误: 缺少必要文件 $file"
        exit 1
    fi
done

echo "✅ 所有必要文件检查通过"

# 创建部署包
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# 复制文件
cp index.html style.css script.js README.md "$DEPLOY_DIR/"

echo "📦 创建部署包: $DEPLOY_DIR"

# 显示部署选项
echo ""
echo "🎯 部署选项:"
echo "1. 本地测试"
echo "2. 部署到GitHub Pages"
echo "3. 部署到Netlify"
echo "4. 部署到Vercel"
echo "5. 手动部署"
echo ""

read -p "请选择部署方式 (1-5): " choice

case $choice in
    1)
        echo "🌐 启动本地服务器..."
        # 检查Python3
        if command -v python3 &> /dev/null; then
            echo "使用Python启动HTTP服务器..."
            cd "$DEPLOY_DIR" && python3 -m http.server 8000 &
            SERVER_PID=$!
            echo "✅ 服务器已启动 (PID: $SERVER_PID)"
            echo "🌍 请在浏览器中访问: http://localhost:8000"
            echo "按Ctrl+C停止服务器"
            wait $SERVER_PID
        elif command -v php &> /dev/null; then
            echo "使用PHP启动HTTP服务器..."
            cd "$DEPLOY_DIR" && php -S localhost:8000 &
            SERVER_PID=$!
            echo "✅ 服务器已启动 (PID: $SERVER_PID)"
            echo "🌍 请在浏览器中访问: http://localhost:8000"
            echo "按Ctrl+C停止服务器"
            wait $SERVER_PID
        else
            echo "❌ 未找到Python3或PHP，请手动启动HTTP服务器"
            echo "📁 文件在: $DEPLOY_DIR"
        fi
        ;;
    2)
        echo "🐙 GitHub Pages 部署说明:"
        echo "1. 在GitHub创建新仓库"
        echo "2. 将 $DEPLOY_DIR 中的文件推送到仓库"
        echo "3. 在仓库设置中启用GitHub Pages"
        echo "4. 选择分支和文件夹 (通常选择main分支和根目录)"
        echo ""
        echo "📚 详细指南: https://pages.github.com"
        ;;
    3)
        echo "⚡ Netlify 部署说明:"
        echo "1. 访问 https://app.netlify.com"
        echo "2. 点击 'Add new site' -> 'Deploy manually'"
        echo "3. 上传 $DEPLOY_DIR 文件夹"
        echo "4. 等待部署完成，获取访问链接"
        echo ""
        echo "📚 详细指南: https://docs.netlify.com"
        ;;
    4)
        echo "▲ Vercel 部署说明:"
        echo "1. 访问 https://vercel.com"
        echo "2. 点击 'Add New...' -> 'Project'"
        echo "3. 导入 $DEPLOY_DIR 文件夹"
        echo "4. 点击 'Deploy'"
        echo ""
        echo "📚 详细指南: https://vercel.com/docs"
        ;;
    5)
        echo "👨‍💻 手动部署说明:"
        echo "1. 将 $DEPLOY_DIR 中的文件上传到你的服务器"
        echo "2. 确保文件位于Web服务器可访问的目录"
        echo "3. 通过浏览器访问对应URL"
        echo ""
        echo "📁 部署文件位置: $DEPLOY_DIR"
        ;;
    *)
        echo "❌ 无效选择"
        ;;
esac

echo ""
echo "🎉 部署完成！"
echo "📁 部署文件保存在: $DEPLOY_DIR"
echo "🔗 访问网站后，请将URL分享给小朋友使用！"