## Launch EC2 "t2.micro" Instance and In Sg, Open port "8080" for Python Application 
# Backend-JAVA Application server

####  Install GIT
```
sudo yum install git -y
``` 

## Install JAVA
####  Installation of openJDK 17
```
sudo dnf update -y
sudo yum install java-17-amazon-corretto-devel -y
``` 

## Install Maven
```
sudo wget https://dlcdn.apache.org/maven/maven-3/3.9.11/binaries/apache-maven-3.9.11-bin.tar.gz
sudo tar xzf apache-maven-3.9.11-bin.tar.gz -C /opt
sudo ln -s apache-maven-3.9.11 /opt/maven
```
#### Create Profile for Maven  
```
sudo vi /etc/profile.d/maven.sh
```

```
export M2_HOME=/opt/maven
export PATH=${M2_HOME}/bin:${PATH}
```
#### Reload profile
```
sudo chmod +x /etc/profile.d/maven.sh
source /etc/profile.d/maven.sh
mvn -version
```


## Get the Code

```
git clone https://github.com/digistackops-java-org/JAVA-3-tier-UMS-Local.git
cd JAVA-3-tier-UMS-Local
sudo chown -R ec2-user:ec2-user /home/ec2-user/JAVA-3-tier-UMS-Local
```
Switch branch

```
git checkout 02-Local-setup-Prod
```
# Backend Setup
```
cd backend
```
## Setup your Application Database by executing "initdb.sql" script from Application-server

Step:1 ==> install "POstgresql-Client" for communicate with POstgresql Database
```
sudo dnf update -y
sudo dnf install -y postgresql16
```
Step:2 ==> Execute your "init.sql" script for your Application DB setup

```
PGPASSWORD="Admin@123" psql -h <DB-Private-IP> -U dbadmin -d postgres -f initdb.sql
```

Create connection for DB connection using "exports" command from HEER it pass to "application.properties" file

```
export SERVER_PORT=8080
export DB_HOST=<DB-Private-IP>
export DB_PORT=5432
export DB_NAME="user-account"
export DB_USER=appuser
export DB_PASSWORD=P@55Word
export CORS_ALLOWED_ORIGINS=http://<Frontend-Private-IP>
```
Create the Package
```
mvn clean package
```
Start Backend Application, for HA we use Linux service for Backend
```
sudo vim /etc/systemd/system/backend.service
```
```
[Unit]
Description=Student Spring Boot App
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/JAVA-3-tier-UMS-App/backend
ExecStart=/usr/bin/java -jar /home/ec2-user/JAVA-3-tier-UMS-App/backend/target/studentapp-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```
Enable the backens servive
```
sudo systemctl daemon-reload
sudo systemctl enable backend
sudo systemctl start backend
sudo systemctl status backend
```
