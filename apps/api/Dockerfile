FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
# dependencies first, so a code change doesn't reinstall them
COPY pyproject.toml .
RUN python -c "import tomllib; p = tomllib.load(open('pyproject.toml', 'rb'))['project']; \
    print('\n'.join(p['dependencies'] + p['optional-dependencies']['dev']))" > /tmp/req.txt \
    && pip install --no-cache-dir -r /tmp/req.txt
COPY . .
RUN pip install --no-cache-dir --no-deps -e .
EXPOSE 8000
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
