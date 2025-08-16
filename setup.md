# DB Tier

## Install postgressql  DB
```
sudo dnf update -y
sudo dnf install -y postgresql16-server
which postgresql-setup
```
Initialize the database
```
sudo /usr/bin/postgresql-setup --initdb
```
<img width="579" height="52" alt="image" src="https://github.com/user-attachments/assets/a703cae2-1f67-4e7f-8700-6219399d0021" />


```
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Setup postgressql DB

#### Allow Remote Host connect to DB
1. Edit the "postgresql.conf" file in path "/var/lib/pgsql/data/postgresql.conf"
```
sudo vim /var/lib/pgsql/data/postgresql.conf
```
ADD these Under connection settings
```
listen_addresses = '*'
```
<img width="301" height="155" alt="image" src="https://github.com/user-attachments/assets/a6f7607e-7611-4138-8162-d4f8894f0ae3" />

2. Edit the "pg_hba.conf" file in path "/var/lib/pgsql/data/pg_hba.conf"

```
sudo vim /var/lib/pgsql/data/pg_hba.conf
```
Edit IPV4 Local Connection Method from ident to md5 these lines 
```
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
```
Also add these lines for the Password for the User "appuser" so we need to mention these line, take these password for the user "appuser" for DB "user-account" form any IP
```
# Allow remote user connections from a single IP
host    all             all             0.0.0.0/0          md5
```

Also add these lines We encrypt the Password for the User "appuser" so we need to mention these line, take these encrypetd password for the user "appuser" for DB "user-account" form any IP
```
host    all             all             0.0.0.0/0          scram-sha-256 
```
<img width="572" height="68" alt="image" src="https://github.com/user-attachments/assets/73d36241-5e6c-4790-be9c-9e4ec3337805" />

Restart postgressql DB
```
sudo systemctl restart postgresql
```


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

# Frontend-React Web server
### Install Node.js
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
nvm use --lts
```

### Install Nginx

Install nginx
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

