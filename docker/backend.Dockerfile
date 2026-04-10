FROM python:3.11-slim

WORKDIR /app

# 基础依赖（保守写法，避免缺 git/ca 证书）
RUN apt-get update && apt-get install -y --no-install-recommends \
    git ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# 先装依赖（利用缓存）
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# 拷贝后端代码
COPY backend /app/backend

# 官方部署文档要求执行字体脚本（首次运行需要）[1](https://github.com/datascale-ai/inksight/blob/main/docs/deploy.md)[2](https://github.com/datascale-ai/inksight/blob/main/docs/en/deploy.md)
RUN python /app/backend/scripts/setup_fonts.py || true

WORKDIR /app/backend
EXPOSE 8080

# 官方启动命令（端口 8080）[2](https://github.com/datascale-ai/inksight/blob/main/docs/en/deploy.md)[1](https://github.com/datascale-ai/inksight/blob/main/docs/deploy.md)
CMD ["python", "-m", "uvicorn", "api.index:app", "--host", "0.0.0.0", "--port", "8080"]
