## Launch EC2 "t2.micro" Instance and In Sg, Open port "80" for react Application
# Frontend-react Web server

### Install Node.js
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
nvm use --lts
```
### Install Nginx

```
sudo yum install nginx -y
```
Start the Service
```
sudo systemctl start nginx
sudo systemctl enable nginx
```
Create Frontend Directory
```
sudo mkdir -p /var/www/frontend/
sudo chmod -R 755 /var/www/frontend/
```
## Get the Code

```
git clone https://github.com/techizone-Medium-Project-org/JAVA-3-tier-UMS-App.git
cd JAVA-3-tier-UMS-App
sudo chown -R ec2-user:ec2-user /home/ec2-user/JAVA-3-tier-UMS-App
```
Switch branch

```
git checkout 02-Local-setup-Prod
```
# Frontend Setup
Note => Nginx we we for 2 purpose 
        (1) For Frontend Load Balancing 
        (2) For Backend Reverse Proxy

Setup "nginx.conf" for reverse Proxy to backend, we already have "nginx.conf" file 

```
cd /home/ec2-user/JAVA-3-tier-UMS-App/frontend
sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
sudo mv /home/ec2-user/JAVA-3-tier-UMS-App/frontend/nginx.conf /etc/nginx/
```
Edit your the Backend IP Address in nginx.conf
```
sudo vim /etc/nginx/nginx.conf
```
restart your Nginx
```
sudo nginx -t
sudo systemctl restart nginx
```
### Frontend Setup
Install Dependencies
```
npm install
```
Build the Frontend 
```
npm run build
```
Copy build/ to /var/www/html or Nginx root
```
sudo rm -rf /var/www/frontend/*
sudo mv dist/* /var/www/frontend/
sudo nginx -t
sudo systemctl reload nginx
```
