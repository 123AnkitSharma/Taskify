pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_HUB_REPO = 'itsankit123/taskify'
    }
    
    stages {
        stage('Build & Push') {
            steps {
                script {

                    sh "docker build --no-cache -t ${DOCKER_HUB_REPO}:server ./server"
                    sh "docker build --no-cache -t ${DOCKER_HUB_REPO}:client ./client"
                    

                    sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
                    sh "docker push ${DOCKER_HUB_REPO}:server"
                    sh "docker push ${DOCKER_HUB_REPO}:client"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI'),
                        string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET')
                    ]) {
                        sh '''
                            export MONGODB_URI="$MONGODB_URI"
                            export JWT_SECRET="$JWT_SECRET"
                            cd ansible && ansible-playbook playbook.yml -i inventory.ini
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always { sh 'docker logout' }
        success { echo 'App running at http://localhost:3000' }
    }
}