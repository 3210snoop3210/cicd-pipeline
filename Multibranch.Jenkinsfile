pipeline {
    agent any

    environment {
        BRANCH_NAME = "${env.GIT_BRANCH}"
        IMAGE_NAME = "${BRANCH_NAME == 'main' ? 'nodemain:v1.0' : 'nodedev:v1.0'}"
        PORT = "${BRANCH_NAME == 'main' ? '3000' : '3001'}"
        LOGO_PATH = "${BRANCH_NAME == 'main' ? 'main/src/logo.svg' : 'main/src/logo.svg'}"
        DOCKER_HUB_REPO = '3210noop3210'
        WORKING_DIR = 'cicd-pipeline'
    }

    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                withCredentials([usernamePassword(credentialsId: 'hithubpat', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                    sh 'git clone https://$GITHUB_USER:$GITHUB_TOKEN@github.com/3210snoop3210/cicd-pipeline.git -b $BRANCH_NAME'
                }
            }
        }

        stage('Build') {
            steps {
                dir(env.WORKING_DIR) {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                dir(env.WORKING_DIR) {
                    sh 'npm test'
                }
            }
        }

        stage('Replace Logo') {
            steps {
                dir(env.WORKING_DIR) {
                    sh "cp ${LOGO_PATH} public/logo.svg"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir(env.WORKING_DIR) {
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    dir(env.WORKING_DIR) {  // Use the global directory variable here
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        sh "docker tag ${IMAGE_NAME} ${DOCKER_HUB_REPO}/${IMAGE_NAME}"
                        sh "docker push ${DOCKER_HUB_REPO}/${IMAGE_NAME}"
                    }
                }
            }
        }

        stage('Trigger Deployment') {
            steps {
                script {
                    if (BRANCH_NAME == 'main') {
                        build job: 'Deploy_to_main'
                    } else {
                        build job: 'Deploy_to_dev'
                    }
                }
            }
        }
    }
}
