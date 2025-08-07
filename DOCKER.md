# Docker 部署说明

## 发布新版本

1. 创建并推送版本标签：

```bash
git tag v1.0.0
git push origin v1.0.0
```

2. GitHub Actions 会自动触发构建和发布流程。

## 本地测试

### 使用 Docker Compose

```bash
docker-compose up --build
```

### 手动构建和运行

```bash
# 构建镜像
docker build -t qg-kpi-export .

# 运行容器
docker run -p 8080:8080 qg-kpi-export
```

## 从 GitHub Packages 拉取镜像

```bash
# 登录 GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 拉取镜像
docker pull ghcr.io/hackycy/qg-kpi-export:latest

# 运行
docker run -p 8080:8080 ghcr.io/hackycy/qg-kpi-export:latest
```

## 访问应用

应用将在 http://localhost:8080 可用。

## 健康检查

访问 http://localhost:8080/health 查看应用健康状态。

## 特性

- ✅ Vue Router History 模式支持
- ✅ 静态资源缓存优化
- ✅ Gzip 压缩
- ✅ 安全头配置
- ✅ 非 root 用户运行
- ✅ 健康检查端点
- ✅ 多阶段构建优化
