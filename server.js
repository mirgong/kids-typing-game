const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '0.0.0.0';

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // 处理根路径
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    // 安全检查
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Access Denied');
        return;
    }
    
    // 获取文件扩展名
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // 读取文件
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // 文件不存在，返回404
                res.writeHead(404);
                res.end('File not found');
            } else {
                // 服务器错误
                res.writeHead(500);
                res.end('Server error: ' + err.code);
            }
        } else {
            // 成功返回文件
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, HOST, () => {
    const addresses = [];
    
    // 获取本地IP地址
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    
    Object.keys(networkInterfaces).forEach(interfaceName => {
        networkInterfaces[interfaceName].forEach(interface => {
            if (interface.family === 'IPv4' && !interface.internal) {
                addresses.push(`http://${interface.address}:${PORT}`);
            }
        });
    });
    
    console.log('='.repeat(60));
    console.log('🎮 小键盘探险家 - 儿童打字游戏网站');
    console.log('='.repeat(60));
    console.log(`📁 服务目录: ${__dirname}`);
    console.log(`🌐 服务器已启动在端口: ${PORT}`);
    console.log('');
    console.log('📱 访问地址:');
    console.log(`  本地: http://localhost:${PORT}`);
    console.log(`  内网: http://127.0.0.1:${PORT}`);
    
    if (addresses.length > 0) {
        addresses.forEach(addr => console.log(`  网络: ${addr}`));
    }
    
    // 尝试获取公网IP
    const { exec } = require('child_process');
    exec('curl -s ifconfig.me', (error, stdout) => {
        if (!error && stdout.trim()) {
            console.log(`  公网: http://${stdout.trim()}:${PORT}`);
        }
    });
    
    console.log('');
    console.log('🔧 服务器信息:');
    console.log(`  Node.js版本: ${process.version}`);
    console.log(`  进程ID: ${process.pid}`);
    console.log(`  启动时间: ${new Date().toLocaleString()}`);
    console.log('='.repeat(60));
    console.log('🔄 服务器运行中... 按 Ctrl+C 停止');
    console.log('-'.repeat(60));
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n👋 服务器正在关闭...');
    server.close(() => {
        console.log('✅ 服务器已关闭');
        process.exit(0);
    });
});

// 错误处理
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ 端口 ${PORT} 已被占用，请尝试其他端口`);
        console.log('💡 尝试: node server.js 8080');
    } else {
        console.error('❌ 服务器错误:', err);
    }
    process.exit(1);
});