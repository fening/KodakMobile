FROM Python:3.12.7

WORKDIR /app

COPY requirements.txt .

RUN pip oinstall --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
