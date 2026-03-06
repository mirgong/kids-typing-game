#!/usr/bin/env python3
"""
简单HTTP服务器，用于测试小键盘探险家网站
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # 添加CORS头
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    os.chdir(DIRECTORY)
    
    print("=" * 60)
    print("🎮 小键盘探险家 - 儿童打字游戏网站")
    print("=" * 60)
    print(f"📁 服务目录: {DIRECTORY}")
    print(f"🌐 服务器地址: http://localhost:{PORT}")
    print("=" * 60)
    
    try:
        # 尝试打开浏览器
        webbrowser.open(f'http://localhost:{PORT}')
        print("✅ 正在打开浏览器...")
    except:
        print("⚠️  无法自动打开浏览器，请手动访问上面的URL")
    
    print("🔄 服务器运行中... 按 Ctrl+C 停止")
    print("-" * 60)
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 服务器已停止")
            sys.exit(0)

if __name__ == "__main__":
    main()