1. Setup the test environment
```
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @babel/preset-env @babel/preset-react babel-jest
```
```
npm install --save-dev jest-environment-jsdom
```
```
{
  "name": "student-frontend",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.7.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/preset-env": "^7.28.3",
    "@babel/preset-react": "^7.27.1",
    "@testing-library/jest-dom": "^6.8.0",
    "@testing-library/react": "^16.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "babel-jest": "^30.1.2",
    "jest": "^30.1.3",
    "vite": "^5.4.0"
  }
}
```







2. You will also need to configure Babel to transpile JSX for Jest.
		
		Create a babel.config.cjs file at the root of your project:
```
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};

```
```
npm test
```


## for report publish

```
npm install --save-dev jest-junit
```

update package.json

```
"scripts": {
  "test": "jest"
},
"jest": {
  "testEnvironment": "jsdom",
  "reporters": [
    "default",
    ["jest-junit", { "outputDirectory": "reports", "outputName": "jest-report.xml" }]
  ]
}
```


```
npm test
```


when you run npm test, Jest will create a reports folder at the root of your project, and inside it, a file named jest-report.xml.



# Jenkins pipeline


for reports 

```
npm install --save-dev jest-junit
```

update package.json
```
"scripts": {
  "test": "jest --ci --reporters=default --reporters=jest-junit"
},
"jest-junit": {
  "suiteName": "Jest Tests",
  "outputDirectory": "reports",
  "outputName": "jest-report.xml"
}
```


```
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-username/your-repo.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Run Unit and Integration Tests') {
            steps {
                // The 'npm test' command will now generate a JUnit report and fail on test failure
                sh 'npm test'
            }
        }
        stage('Publish Test Reports') {
            steps {
                // This step will only run if the 'Run Tests' stage succeeds
                // It collects the generated XML report and displays it in Jenkins
                junit 'reports/jest-report.xml'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying to a server...'
            }
        }
    }
}
```
