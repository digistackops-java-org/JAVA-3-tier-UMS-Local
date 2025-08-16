# Student 3-Tier App (React + Spring Boot + PostgreSQL)
# Create single "t2.micro" Instance with Amazon Linux 2 AMI for DEV Environment

## prerequisite => Install the Required Tools for these Project refer "setup.md"

# DB-Tier Setup
Login to DB
```
mongosh
```
Connect to the admin database to create a user
```
use admin
```

Create  application's database "user-account"
```
use user-account
```
Create a user "appuser" with read/write access to the 'user-account' database
```
db.createUser({
  user: "appuser",
  pwd: "Pa55Word",
  roles: [
    { role: "readWrite", db: "user-account" }
  ]
});
```
Create Collection "users"
```
db.createCollection("users")
```
Exit from DB
```
exit
```

## Get the Code

```
git clone https://github.com/techizone-Medium-Project-org/Python-3-tier-UMS-App.git
cd Python-3-tier-UMS-App
sudo chown -R ec2-user:ec2-user /home/ec2-user/Python-3-tier-UMS-App
```
Switch branch

```
git checkout 01-Local-setup-Dev
```
# Backend Setup
```
cd backend
```
Create connection file ".env" for DB connection

```
sudo vim .env
```
```
MONGO_USER=appuser
MONGO_PASS=Pa55Word
MONGO_HOST=your_db_private_ip
MONGO_DB=user-account
```
Install Dependencies
```
pip install -r requirements.txt
```
Start Backend Application
```
pip install gunicorn
gunicorn --bind 0.0.0.0:5000 app:app
```
# Frontend Setup
Note => Nginx we we for 2 purpose 
        (1) For Frontend Load Balancing 
        (2) For Backend Reverse Proxy

Setup "nginx.conf" for reverse Proxy to backend, we already have "nginx.conf" file 

```
sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
sudo mv /home/ec2-user/Python-3-tier-UMS-App/frontend/nginx.conf /etc/nginx/
```
Edit your the Backend IP Address in nginx.conf
```
sudo vim /etc/nginx/nginx.conf
```
restart your Nginx
```
sudo systemctl restart nginx
```

Install Dependencies
```
cd frontend
npm install
```
Build the Frontend 
```
npm run build
```
Copy build/ to /var/www/html or Nginx root
```
sudo rm -rf /var/www/frontend/*
sudo mv build/* /var/www/frontend/
sudo systemctl restart nginx
```





