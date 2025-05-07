pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    }
    
    stages {
        stage('init') {
            steps {
                sh "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 749724771232.dkr.ecr.us-east-1.amazonaws.com"
            }
        }
        stage('Build') {
            steps {
                git branch: 'main', url: 'https://github.com/hruthik46/ecommerce.git'
                sh "docker build -t ecommerse-frontend ."
                sh "docker tag ecommerse-frontend:latest 749724771232.dkr.ecr.us-east-1.amazonaws.com/ecommerse-frontend:latest"
            }
        }
        stage('Deploy') {
            steps {
                sh "docker push 749724771232.dkr.ecr.us-east-1.amazonaws.com/ecommerse-frontend:latest"
            }
        }
    }
}
