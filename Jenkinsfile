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

					def selectedEnv = params.ENV?.trim()?.toLowerCase()

					// null 이거나 공백이거나 잘못된 값일 경우 자동 분기
					if (!selectedEnv || !(selectedEnv in ['dev', 'production'])) {
						selectedEnv = (branch == 'develop') ? 'dev' : 'production'
						echo "🔄 ENV auto-detected as: ${selectedEnv}"
					} else {
						echo "✅ ENV manually selected: ${selectedEnv}"
					}

					env.ENV = selectedEnv
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

		stage('Set the .env value per brancah')
		{
			steps {
				script {
					def db = readProperties file: '.env'

					def isDev = (env.ENV == 'dev')

					def mySQLDbName = isDev ? db.MYSQL_DEV_DATABASE : db.MYSQL_DATABASE
					def mongoDbName = isDev ? 'nift_dev' : 'nift'

					//덮어쓰기
					db["MYSQL_DATABASE"] = mySQLDbName
					db["MONGO_INITDB_DATABASE"] = mongoDbName

					//Spring datasource URL DB명 치환
					db["SPRING_DATASOURCE_URL"] = db["SPRING_DATASOURCE_URL"]
					.replaceAll(/\/[^\/?]+\?/, "/${mySQLDbName}?")

					//Spring mongo URI도 치환
					db["SPRING_DATA_MONGODB_URI"] = db["SPRING_DATA_MONGODB_URI"]
					.replaceAll(/\/[^\/?]+$/, "/${mongoDbName}")

					//바꾼 값들을 반영한 .env 파일 생성
					def dbContent = db.collect { k, v -> "${k}=${v}"}.join('\n')
					writeFile file: '.env', text: dbContent

					sh '''
					echo "📄 ✅ 최종 .env 내용 확인:"
					cat .env
					'''
				}
			}
		}

		stage('Flyway Migration') {
			steps {
				script {
					if (env.ENV == 'dev') {
						def props = readProperties file: '.env'
						def migrationPath = "/home/ubuntu/jenkins-data/jobs/NIFT_MultiBranch/branches/develop/workspace/backend/src/main/resources/db/migration"

						sh """
						echo "🧾 파일 목록:"
						ls -al ${env.WORKSPACE}/backend/src/main/resources/db/migration

						echo "🧾 flyway 마운트 테스트:"
						docker run --rm \
						  -v ${env.WORKSPACE}/backend/src/main/resources/db/migration:/flyway/sql \
						  ubuntu \
						  bash -c "ls -al /flyway/sql"
						"""

						withEnv([
							"MYSQL_USER=${props.MYSQL_USER}",
							"MYSQL_PASSWORD=${props.MYSQL_PASSWORD}",
							"MYSQL_DATABASE=${props.MYSQL_DATABASE}"
						]) {
							sh """
							echo "😒 Running Flyway Migration..."
							docker run --rm \
							  --network shared_backend \
							  -v ${migrationPath}:/flyway/sql \
							  flyway/flyway \
							  -locations=filesystem:/flyway/sql \
							  -url="jdbc:mysql://mysql:3306/\$MYSQL_DATABASE?allowPublicKeyRetrieval=true&useSSL=false" \
							  -user=\$MYSQL_USER \
							  -password=\$MYSQL_PASSWORD \
							  migrate
							"""
						}
					} else {
						echo "👌 (master branch) Skipping Flyway Migration."
					}
				}
			}
		}

		stage('Run Docker Compose') {
			steps {
				script {
					try {
						def composeFile = (env.ENV == 'production') ? 'docker-compose-production.yml' : 'docker-compose-dev.yml'
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
				if (env.ENV == 'production') {
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
				if (env.ENV == 'production') {
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
