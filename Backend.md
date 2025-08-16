## Launch EC2 "t2.micro" Instance and In Sg, Open port "5000" for Python Application 
# Backend-Python Application server

## Install python
```
sudo yum update -y
sudo yum install git -y
sudo yum install python3 -y
sudo yum install python3-pip -y
```

## Get the Code

```
git clone https://github.com/techizone-Medium-Project-org/Python-3-tier-UMS-App.git
sudo chown -R ec2-user:ec2-user /home/ec2-user/Python-3-tier-UMS-App
cd Python-3-tier-UMS-App
```
Switch branch

```
git checkout 02-Local-setup-Prod
```
# Backend Setup
```
cd backend
```
Create connection file ".env" for DB connection
Dont push ".env" to your SCM for security 
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
```
To run these Backend Application up and Running we use Linux service
```
which gunicorn
sudo cp -r  ~/.local/bin/gunicorn /usr/local/bin/
```

```
sudo vim /etc/systemd/system/backend.service
```
```
[Unit]
Description=Gunicorn Flask App
After=network.target

[Service]
User=ec2-user
Group=ec2-user
WorkingDirectory=/home/ec2-user/My-python-EMS/backend
ExecStart=/usr/local/bin/gunicorn --bind 0.0.0.0:5000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```
Enable backend service
```
sudo systemctl daemon-reload
sudo systemctl enable backend
sudo systemctl start backend
sudo systemctl status backend
```
