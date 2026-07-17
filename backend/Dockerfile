# NOTE: the image is large because sentence-transformers pulls in torch.
# For a smaller image, install the CPU-only torch wheel before requirements.
FROM python:3.12-slim

WORKDIR /srv

# System libs some wheels (pymupdf, onnxruntime) expect at runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 libglib2.0-0 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
