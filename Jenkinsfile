pipeline {
	agent any

	parameters {
		choice(name: 'ENV', choices: ['dev', 'production'], description: 'Select environment')
	}

	stages {

		stage('Decide Environment') {
			steps {
				script {
					def branch = env.BRANCH_NAME ? env.BRANCH_NAME : env.GIT_BRANCH
					echo "🚀 Branch: ${branch}"

					if (!params.ENV || params.ENV.trim() == '') {
						env.ENV = (branch == 'develop') ? 'dev' : 'production'
						echo "🔄 ENV auto-detected as: ${env.ENV}"
					} else {
						env.ENV = params.ENV
						echo "✅ ENV manually selected: ${env.ENV}"
					}
				}
			}
		}

		stage('Check DB_CRED File') {
			steps {
				withCredentials([file(credentialsId: 'DB_CRED', variable: 'DB_CRED_FILE')]) {
					sh '''
						echo "📁 DB_CRED_FILE 경로: $DB_CRED_FILE"
						ls -l $DB_CRED_FILE
						echo "📄 DB_CRED_FILE 내용:"
						cat $DB_CRED_FILE
					'''
				}
			}
		}

		stage('Parse and Write .env') {
			steps {
				withCredentials([file(credentialsId: 'DB_CRED', variable: 'DB_CRED_FILE')]) {
					script {
						echo "🔍 Reading DB_CRED_FILE"

						def json = readJSON file: "${DB_CRED_FILE}"

						// .env 파일 작성
						def envContent = json.collect { key, value -> "${key}=${value}" }.join('\n')
						writeFile file: '.env', text: envContent

						// 사용할 변수 저장
						env.MYSQL_USER = json["MYSQL_USER"]
						env.MYSQL_PASSWORD = json["MYSQL_PASSWORD"]
						env.MYSQL_DATABASE = json["MYSQL_DATABASE"]
					}
				}
			}
		}



		stage('Reset containers') {
			steps {
				script {
					if (params.ENV == 'dev') {
						sh 'docker-compose --env-file .env down -v'
					}
				}
			}
		}

		stage('Run Docker Compose') {
			steps {
				script {
					def composeFile = (params.ENV == 'production') ? 'docker-compose-production.yml' : 'docker-compose-dev.yml'
					sh "docker-compose -f ${composeFile} --env-file .env up -d --build"
				}
			}
		}

		stage('Insert Dummy Data') {
			steps {
				script {
					def user = env.MYSQL_USER
					def password = env.MYSQL_PASSWORD
					def database = env.MYSQL_DATABASE

					def command = "mysql -u${user} -p${password} ${database} < /docker-entrypoint-initdb./init.sql"
					sh "docker exec mysql bash -c '${command}'"
				}
			}
		}
	}

	post {
		always {
			sh 'rm -f .env'
		}

		success {
			script {
				if (params.ENV == 'production') {
					echo '✅ Build succeeded, tagging as stable...'
					sh '''
						docker tag backend backend:stable
						docker tag frontend frontend:stable
						docker push backend:stable
						docker push frontend:stable
					'''
				}
			}
		}

		failure {
			script {
				if (params.ENV == 'production') {
					echo '❗ Build failed. Rolling back to stable image...'
					sh '''
						docker stop backend || true
						docker stop frontend || true
						docker rm backend || true
						docker rm frontend || true
						docker pull backend:stable
						docker pull frontend:stable
						docker run -d --name backend --network backend-tier -p 8081:8081 backend:stable
						docker run -d --name frontend --network frontend-tier -p 3000:3000 frontend:stable
					'''
				}
			}
		}
	}
}
