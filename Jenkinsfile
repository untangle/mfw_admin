pipeline {
  agent any

  stages {
    stage('Build') {
      agent { label 'mfw' }
      steps { 
        sh "docker-compose -f docker-compose.build.yml -p admin_jenkins run build-local"
      }
    }
  }
}
