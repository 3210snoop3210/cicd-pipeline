pipeline {
    agent any

    environment {
        BRANCH_NAME = "${env.GIT_BRANCH}"
        IMAGE_NAME = "${BRANCH_NAME == 'main' ? 'nodemain:v1.0' : 'nodedev:v1.0'}"
        PORT = "${BRANCH_NAME == 'main' ? '3000' : '3001'}"
        LOGO_PATH = "${BRANCH_NAME == 'main' ? 'src/logo.svg' : 'src/logo.svg'}"
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
                    sh 'npm install react@latest react-dom@latest react-scripts@latest && npm run build'
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
                    sh "mkdir -p ${BRANCH_NAME} && cp ${LOGO_PATH} ${BRANCH_NAME}/logo.svg"
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

        stage('Trivy Image Scan') {
            steps {
                script {
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                        aquasec/trivy image --debug --scanners vuln --severity HIGH,CRITICAL ${IMAGE_NAME}
                    """
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
                    build job: 'CD_deploy_manual', parameters: [string(name: 'ENV', value: BRANCH_NAME)]
                }
            }
        }
    }
}
