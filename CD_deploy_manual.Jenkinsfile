pipeline {
    agent any

    parameters {
        choice(name: 'ENV', choices: ['main', 'dev'], description: 'Choose environment to deploy')
    }

    environment {
        IMAGE_NAME = "${params.ENV == 'main' ? 'nodemain:latest' : 'nodedev:latest'}"
        PORT = "${params.ENV == 'main' ? '3000' : '3001'}"
        DOCKER_HUB_REPO = '3210noop3210'
        BRANCH_NAME = "${params.ENV == 'main' ? 'main' : 'dev'}"
    }


    stages {
        stage('Checkout') {
            steps {
                cleanWs()  // Clean workspace before checkout
                withCredentials([usernamePassword(credentialsId: 'hithubpat', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                    // Explicitly check out the correct branch
                    sh 'git clone --single-branch --branch ${BRANCH_NAME} https://$GITHUB_USER:$GITHUB_TOKEN@github.com/3210snoop3210/cicd-pipeline.git'
                }
            }
        }

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
                    def containerName = IMAGE_NAME.split(':')[0]  // Extract base name (without tag)
                    sh """
                    if docker ps -a --filter "name=${containerName}" --format '{{.Names}}' | grep -w ${containerName}; then
                        docker stop ${containerName}
                        docker rm ${containerName}
                    else
                        echo "No container named ${containerName} found."
                    fi
                    """
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    def containerName = IMAGE_NAME.split(':')[0]  // Extract base name (without tag)
                    sh "docker run -d --name ${containerName} -p ${PORT}:${PORT} ${DOCKER_HUB_REPO}/${IMAGE_NAME}"
                }
            }
        }
    }
}
