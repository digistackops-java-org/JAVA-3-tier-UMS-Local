# Student 3-Tier App (React + Spring Boot + PostgreSQL)

### Overview
- **Frontend (React)**: Public EC2 with a public IP. Built static files served via Nginx.
- **Backend (Spring Boot)**: Private EC2 reachable only over private IP from the Frontend EC2.
- **Database (PostgreSQL)**: Private EC2 reachable only over private IP from the Backend EC2.
- All service endpoints use **private IPs**; only the Frontend EC2 exposes HTTP/HTTPS publicly.

---
## 1) PostgreSQL EC2 (Private)
Security Group:
- Inbound: TCP 5432 only from Backend EC2's **private IP** or security group.
- Outbound: allow to Backend EC2.

Install & setup:
```bash
sudo apt update && sudo apt -y install postgresql
sudo -u postgres psql -f /path/to/database/create_db.sql
# Optional: tune pg_hba.conf to allow backend private IP:
# host  all  student_user  <BACKEND_PRIVATE_IP>/32  md5
sudo systemctl restart postgresql
```

---
## 2) Backend EC2 (Private)
Security Group:
- Inbound: TCP 8080 only from Frontend EC2's **private IP** (or SG).
- Outbound: allow to DB private IP on 5432.

Install Java & Maven, build & run:
```bash
sudo apt update && sudo apt -y install openjdk-17-jdk maven
cd backend
# Set environment variables to parameterize DB and CORS
export SERVER_PORT=8080
export DB_HOST=<DB_PRIVATE_IP>
export DB_PORT=5432
export DB_NAME=user-account
export DB_USER=student_user
export DB_PASSWORD=<your_password>
export CORS_ALLOWED_ORIGINS=http://<FRONTEND_PRIVATE_IP>
mvn -q -DskipTests package
java -jar target/studentapp-0.0.1-SNAPSHOT.jar
```

**Systemd service example** (`/etc/systemd/system/studentapp.service`):
```ini
[Unit]
Description=Student Spring Boot App
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/opt/studentapp/backend
Environment=SERVER_PORT=8080
Environment=DB_HOST=<DB_PRIVATE_IP>
Environment=DB_PORT=5432
Environment=DB_NAME=user-account
Environment=DB_USER=student_user
Environment=DB_PASSWORD=<your_password>
Environment=CORS_ALLOWED_ORIGINS=http://<FRONTEND_PRIVATE_IP>
ExecStart=/usr/bin/java -jar /opt/studentapp/backend/target/studentapp-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

---
## 3) Frontend EC2 (Public)
Security Group:
- Inbound: TCP 80/443 from 0.0.0.0/0 (or as required).
- Outbound: allow to Backend private IP on 8080.

Build React and serve via Nginx:
```bash
sudo apt update && sudo apt -y install nginx nodejs npm
cd frontend
npm install
# Parameterize backend API base URL to the backend's *private* IP
echo "VITE_API_BASE_URL=http://<BACKEND_PRIVATE_IP>:8080" > .env
npm run build
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/
sudo tee /etc/nginx/sites-available/studentapp <<'EOF'
server {
  listen 80 default_server;
  server_name _;
  root /var/www/html;
  index index.html;
  location / {
    try_files $uri /index.html;
  }
}
EOF
sudo ln -sf /etc/nginx/sites-available/studentapp /etc/nginx/sites-enabled/default
sudo systemctl reload nginx
```

---
## API Summary
- `GET    /api/students` – list all
- `POST   /api/students` – create `{name,email,course,amount,feesStatus}`
- `PUT    /api/students/{id}` – update
- `DELETE /api/students/{id}` – delete

`feesStatus` allowed values: `Paid`, `Unpaid`, `Half-paid`

---
## Notes
- DB is created with name `"user-account"`. Schema migrations (table + enum) are handled by Flyway at backend startup.
- Frontend axios base URL is fully parameterized in `frontend/src/config.js` and can be overridden via `VITE_API_BASE_URL`.
- Backend is fully parameterized via environment variables (see `application.properties`).

---
## Troubleshooting
- CORS errors: Ensure `CORS_ALLOWED_ORIGINS` on backend includes `http://<FRONTEND_PRIVATE_IP>` or your public domain.
- 403/404 from API: Verify security groups and that frontend uses backend **private IP**.


---
## Reverse Proxy Setup (Frontend → Backend Private IP)

Instead of exposing backend's private IP to the browser, you can proxy requests via Nginx on the frontend EC2.

**Nginx config example** (`/etc/nginx/sites-available/studentapp`):
```nginx
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # Reverse proxy for backend
    location /api/ {
        proxy_pass http://<BACKEND_PRIVATE_IP>:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Changes when using reverse proxy:**
- Frontend `.env` file does **not** need `VITE_API_BASE_URL` – defaults to `/api`.
- Backend CORS: only allow `http://<FRONTEND_PUBLIC_IP>` or disable if using same-origin requests.
- Security Groups: Backend EC2 port 8080 open **only** to frontend EC2's private IP.
