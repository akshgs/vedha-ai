# ================================================================
# Vedha AI Backend — Dockerfile
# Multi-stage build: builder + runtime
# ================================================================

FROM python:3.12-slim AS builder

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements.txt (supports root context or vedha_ai context)
COPY vedha_ai/requirements.txt* requirements.txt* ./
RUN pip install --upgrade pip && \
    pip install --no-cache-dir \
        --extra-index-url https://download.pytorch.org/whl/cpu \
        -r requirements.txt

# ── Explicit extras install
RUN pip install --no-cache-dir \
        "email-validator>=2.0.0" \
        "langchain-text-splitters"

# ── Runtime stage ──────────────────────────────────────────────
FROM python:3.12-slim AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy repository application code
COPY . .

# Set PYTHONPATH and WORKDIR to handle both root and subfolder build contexts on Railway
ENV PYTHONPATH="/app/vedha_ai:/app"

# If vedha_ai folder exists inside /app, use it as working directory
WORKDIR /app/vedha_ai

# Non-root user for security
RUN useradd --create-home --shell /bin/bash vedha && \
    chown -R vedha:vedha /app
USER vedha

# Expose API port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/v1/health/ping')"

# Start with uvicorn (dynamic PORT binding for Railway/Render/Docker)
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1 --log-level info"]
