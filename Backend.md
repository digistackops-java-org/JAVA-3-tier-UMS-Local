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
### We keep application in one standard location. This is a usual practice that runs in the organization. Lets setup an app directory.
```
sudo mkdir /app
```

```
cd /app
git clone https://github.com/digistackops-java-org/JAVA-3-tier-UMS-Local.git
cd JAVA-3-tier-UMS-Local
sudo chown -R ec2-user:ec2-user /app/JAVA-3-tier-UMS-Local
```
Switch branch

```
git checkout 03-Local-setup-Unit_Test-Local-V1
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
WorkingDirectory=/app/JAVA-3-tier-UMS-Local/backend

# Environment variables
Environment=SERVER_PORT=8080
Environment=DB_HOST=<DB-Private-IP>
Environment=DB_PORT=5432
Environment=DB_NAME=user-account
Environment=DB_USER=appuser
Environment=DB_PASSWORD=P@55Word
Environment=CORS_ALLOWED_ORIGINS=http://<Frontend-IP>

ExecStart=/usr/bin/java -jar /app/JAVA-3-tier-UMS-Local/backend/target/studentapp-0.0.1-SNAPSHOT.jar
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
Why we pass Environmental Variables in "Backend.service" file why noy througj export Command or .env file
Because our Application is JAVA, it will alredy packaged through maven, so exports and .env will take the Linux Environment variable But HERE we need to pass the Variable to the  MAven PAckage so we use Environment variables in Service file so it will pass to the java -jar while running the Package
To check the Service Logs
```
journalctl -u backend.service
```
