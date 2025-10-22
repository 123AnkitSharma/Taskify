pipeline {
    agent any
    
    triggers {
        githubPush()  // to enable GitHub webhook triggers
    }
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_HUB_REPO = 'itsankit123/taskify'
    }
    
    stages {
        stage('Build Docker Images') {
            parallel {
                stage('Build Server Image') {
                    steps {
                        script {
                            echo 'Building server Docker image...'
                            dir('server') {
                                sh "docker build -t ${DOCKER_HUB_REPO}:server ."
                            }
                        }
                    }
                }
                
                stage('Build Client Image') {
                    steps {
                        script {
                            echo 'Building client Docker image...'
                            dir('client') {
                                sh "docker build -t ${DOCKER_HUB_REPO}:client ."
                            }
                        }
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    echo 'Logging into Docker Hub...'
                    sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
                    
                    echo 'Pushing images to Docker Hub...'
                    sh """
                        docker push ${DOCKER_HUB_REPO}:server
                        docker push ${DOCKER_HUB_REPO}:client
                    """
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying application...'
                    
                    // Stop existing containers and start new ones
                    withCredentials([
                        string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI'),
                        string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET')
                    ]) {
                        sh '''
                            echo " Deploying with docker-compose..."
                            docker compose down || true
                            
                            docker compose pull
                            export MONGODB_URI="$MONGODB_URI"
                            export JWT_SECRET="$JWT_SECRET"
                            docker compose up -d
                        '''
                    }
                    
                    echo " Deployment completed!"
                    echo "Frontend: http://localhost:3000"
                    echo "Backend: http://localhost:5000"
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
        }
        success {
            echo 'Pipeline completed successfully!'
            echo 'Your MERN app is running at http://localhost:3000'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}