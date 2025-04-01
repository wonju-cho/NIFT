def sendMessage(String msg, String hookUrl) {
	def payload = groovy.json.JsonOutput.toJson([text: msg])
	writeFile file: 'payload.json', text: payload

	sh(
		script: """
		export HOOK_URL=${hookUrl}
		curl -X POST -H 'Content-Type: application/json' -d @payload.json \$HOOK_URL
		""",
		label: 'Send message'
	)
}

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

		stage('Check ENV Credential Files') {
			steps {
				script {

					def checkCredential = { filePath, name ->
		                if (!fileExists(filePath)) {
		                    error "❌ Credential ${name} (${filePath}) is missing."
		                } else {
		                    echo "✅ Credential ${name} found at ${filePath}"
		                }
	            	}

					withCredentials([
						file(credentialsId: 'DB_CRED', variable: 'DB_CRED_FILE'),
						file(credentialsId: 'SONAR_CRED', variable: 'SONAR_FILE')
						]) {
                        checkCredential(DB_CRED_FILE, "DB_CRED")
                        checkCredential(SONAR_FILE, "SONAR_CRED")
					}
				}
			}
		}

		stage('Generate .env files') {
		    steps {
		        withCredentials([
		            file(credentialsId: 'DB_CRED', variable: 'DB_FILE')
		        ]) {
		            script {
		                def db = readJSON file: DB_FILE
		                def dbContent = db.collect { k, v -> "${k}=${v}" }.join('\n')
		                writeFile file: '.env', text: dbContent
		            }
		        }

		        withCredentials([
		            file(credentialsId: 'SONAR_CRED', variable: 'SONAR_FILE')
		        ]) {
		            script {
		                def sonar = readJSON file: SONAR_FILE
		                def sonarContent = sonar.collect { k, v -> "${k}=${v}" }.join('\n')
		                writeFile file: '.env.sonar', text: sonarContent
		            }
		        }
		    }
		}


		stage('Reset containers') {
			steps {
				script {
					if (params.ENV == 'dev') {
						sh 'docker-compose -f docker-compose-dev.yml --env-file .env down -v'
					}
				}
			}
		}

		stage('Run Docker Compose') {
			steps {
				script {
					try {
						def composeFile = (params.ENV == 'production') ? 'docker-compose-production.yml' : 'docker-compose-dev.yml'
						sh "docker-compose -f ${composeFile} --env-file .env up -d --build"	
						env.IMAGE_BUILD_SUCCESS = "true"
					}
					catch(Exception e) {
						env.IMAGE_BUILD_SUCCESS = "false"
						currentBuild.result = 'FAILURE'
						echo"❌ Docker 이미지 생성 실패"
					}
					
				}
			}
		}

		stage('Insert Dummy Data') {
			steps {
				script {
					if (env.IMAGE_BUILD_SUCCESS?.toBoolean()) {
						try {
							def props = readProperties file: '.env'

							withEnv([
								"MYSQL_USER=${props.MYSQL_USER}",
								"MYSQL_PASSWORD=${props.MYSQL_PASSWORD}",
								"MYSQL_DATABASE=${props.MYSQL_DATABASE}"
							]) {
								sh """
								# MySQL이 완전히 기동될 때까지 대기
								until docker exec mysql mysqladmin ping -h127.0.0.1 --silent; do
									echo "⏳ Waiting for MySQL...";
									sleep 2;
								done

								# 더미 데이터 삽입
								docker exec -i mysql mysql -h127.0.0.1 -u\$MYSQL_USER -p\$MYSQL_PASSWORD \$MYSQL_DATABASE < ./backend/src/main/resources/dev_init.sql
								"""
							}
						} catch (Exception e) {
							env.IMAGE_BUILD_SUCCESS = "false"
							error("❌ 더미 데이터 삽입 실패: ${e.message}")
						}
					} else {
						echo "이미지 빌드 실패로 Dummy Data 스킵"
					}
				}
			}
		}

	}

	post {
	    always {
	        script {
	            try {
	                if (env.IMAGE_BUILD_SUCCESS == "true") {

						def message = """
						*Static Analysis Report*
						- Job: ${env.JOB_NAME}
						- Build: #${env.BUILD_NUMBER}
						- 툴별 결과:
						""".stripIndent()

	                    withCredentials([string(credentialsId: 'MATTERMOST_WEBHOOK', variable: 'MATTERMOST_WEBHOOK')]){
		                    sendMessage(message, MATTERMOST_WEBHOOK)
	                    }
	                    
	                } else {
	                    def message = """
	                    ❌ *Docker 이미지 생성 실패*
	                    - Job: ${env.JOB_NAME}
	                    - Build: #${env.BUILD_NUMBER}
	                    - [Jenkins 로그 보기](${env.BUILD_URL})
	                    """.stripIndent()
	                    
	                    withCredentials([string(credentialsId: 'MATTERMOST_WEBHOOK', variable: 'MATTERMOST_WEBHOOK')]){
		                    sendMessage(message, MATTERMOST_WEBHOOK)
	                    }
	                }
	                
	                 // .env 파일 삭제
                	sh 'rm -f .env.*'
	            } catch (e) {
	                echo "recordIssues() 중 오류 발생: ${e}"
	            }
	        }
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
