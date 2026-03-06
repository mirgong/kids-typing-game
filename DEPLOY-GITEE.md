# Gitee Pages 部署指南

## 📋 部署步骤

### 步骤1：创建Gitee仓库
1. 登录 [Gitee](https://gitee.com)
2. 点击右上角"+" → "新建仓库"
3. 填写仓库信息：
   - 仓库名称：`kids-typing-game`
   - 仓库介绍：儿童打字游戏网站
   - 路径：`kids-typing-game`（自动生成）
   - 仓库公开：✅ 勾选
   - 初始化仓库：❌ 不勾选（我们会手动上传）
   - 点击"创建"

### 步骤2：上传文件到Gitee
有几种方法可以上传文件：

#### 方法A：网页直接上传（最简单）
1. 进入刚创建的仓库
2. 点击"上传文件"按钮
3. 选择本地的 `kids-typing-game` 文件夹中的所有文件
4. 填写提交信息："初始提交：儿童打字游戏网站"
5. 点击"提交"

#### 方法B：使用Git命令
```bash
# 1. 克隆仓库到本地
git clone https://gitee.com/你的用户名/kids-typing-game.git

# 2. 复制文件到仓库
cp -r /path/to/kids-typing-game/* kids-typing-game/

# 3. 提交并推送
cd kids-typing-game
git add .
git commit -m "初始提交：儿童打字游戏网站"
git push origin main
```

#### 方法C：使用Gitee客户端
1. 下载并安装Gitee客户端
2. 克隆仓库
3. 拖拽文件到仓库文件夹
4. 提交并推送

### 步骤3：开启Gitee Pages
1. 进入仓库页面
2. 点击"服务" → "Gitee Pages"
3. 在Pages设置页面：
   - 部署分支：选择 `main` 或 `master`
   - 部署目录：选择 `/`（根目录）
   - 勾选"强制使用HTTPS"
4. 点击"启动"或"更新"

### 步骤4：等待部署完成
1. Gitee Pages会自动开始部署
2. 部署通常需要1-3分钟
3. 部署完成后会显示访问地址

## 🌐 访问地址
部署成功后，可以通过以下地址访问：
```
https://你的用户名.gitee.io/kids-typing-game/
```

例如：
```
https://zhangsan.gitee.io/kids-typing-game/
```

## ⚠️ 注意事项

### 1. 首次部署
- 首次开启Pages需要实名认证
- 每个Gitee账号有1GB Pages空间
- 每月有流量限制，但对于小型网站足够

### 2. 更新网站
更新网站内容后，需要：
1. 重新上传/推送文件到Gitee
2. 进入Pages服务页面
3. 点击"更新"按钮

### 3. 自定义域名（可选）
如果需要使用自己的域名：
1. 在Pages设置中添加自定义域名
2. 在域名服务商处添加CNAME记录
3. 等待DNS生效

## 🔧 常见问题

### Q1：Pages部署失败怎么办？
- 检查文件结构是否正确
- 确保 `index.html` 在根目录
- 检查是否有不支持的文件类型

### Q2：访问显示404错误？
- 等待几分钟让Pages完全部署
- 检查Pages服务是否已启动
- 清除浏览器缓存后重试

### Q3：如何更新网站？
- 上传新版本文件到仓库
- 进入Pages服务点击"更新"
- 等待几分钟生效

### Q4：可以绑定自己的域名吗？
可以！在Pages设置中添加自定义域名即可。

## 📞 技术支持
- Gitee官方文档：https://gitee.com/help/articles/4136
- 问题反馈：在仓库中提交Issue
- 社区支持：Gitee官方社区

## 🎉 完成！
部署完成后，你就可以通过Gitee Pages地址访问网站了。这个地址是永久的，可以分享给任何人使用。

**祝你部署顺利！** 🚀