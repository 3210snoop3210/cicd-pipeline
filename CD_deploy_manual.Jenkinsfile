pipeline {
    agent any

    parameters {
        choice(name: 'ENV', choices: ['main', 'dev'], description: 'Choose environment to deploy')
    }

    environment {
        IMAGE_NAME = params.ENV == 'main' ? 'nodemain:v1.0' : 'nodedev:v1.0'
        PORT = params.ENV == 'main' ? '3000' : '3001'
        DOCKER_HUB_REPO = '3210noop3210'
    }

    stages {
        stage('Pull Image from Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker pull ${DOCKER_HUB_REPO}/${IMAGE_NAME}"
                }
            }
        }

        stage('Stop and Remove Old Container') {
            steps {
                script {
                    sh """
                    docker ps -q --filter "name=${IMAGE_NAME}" | xargs -r docker stop
                    docker ps -a -q --filter "name=${IMAGE_NAME}" | xargs -r docker rm
                    """
                }
            }
        }

        stage('Run New Container') {
            steps {
                sh "docker run -d --restart always --name ${IMAGE_NAME} -p ${PORT}:${PORT} ${DOCKER_HUB_REPO}/${IMAGE_NAME}"
            }
        }
    }
}
