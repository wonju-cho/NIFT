def sendMessage(String msg, String hookUrl) {
	def payload = [ text: msg ]
	def json = groovy.json.JsonOutput.toJson(payload)

	sh """
	curl -X POST -H 'Content-Type: application/json' \
	-d '${json}' \
	${hookUrl}
	"""
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

					if(env.IMAGE_BUILD_SUCCESS == "true")
					{
						try {
							def user = env.MYSQL_USER
							def password = env.MYSQL_PASSWORD
							def database = env.MYSQL_DATABASE

							def command = "mysql -u${user} -p${password} ${database} < /docker-entrypoint-initdb./init.sql"
							sh "docker exec mysql bash -c '${command}'"
						} catch (Exception e) {
							error("❌ 더미 데이터 삽입 실패: ${e.message}")
						}
					}
					else {
						echo "이미지 빌드 실패로 Dummay Data 스킵"
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
	                    def results = recordIssues(tools: [
	                        java(),
	                        esLint(pattern: 'reports/eslint-report.json'),
	                        spotBugs(pattern: '**/spotbugsXml.xml'),
	                        checkStyle(pattern: '**/checkstyle-result.xml')
	                    ])

	                    def detailLines = []
	                    int totalIssues = 0

	                    results.each { result ->
	                        def toolName = result.name ?: result.id ?: "Unknown"
	                        def count = result.totalSize
	                        totalIssues += count
	                        detailLines << "- ${toolName}: ${count}개"
	                    }

	                    def issueEmoji = (totalIssues > 0) ? ":warning:" : ":white_check_mark:"
	                    def issueStatusMsg = (totalIssues > 0) ? "총 ${totalIssues}개 경고 발생" : "경고 없음"
	                    def analysisUrl = "${env.BUILD_URL}warnings-ng/"
	                    def branchLabel = (env.BRANCH_NAME == 'master') ? "🚀 *[MASTER 분석 결과]*" : "🧪 *[DEVELOP QA 분석 결과]*"

						def message = """
						${issueEmoji} *Static Analysis Report*
						${branchLabel}
						- Job: ${env.JOB_NAME}
						- Build: #${env.BUILD_NUMBER}
						- Result: ${issueStatusMsg}
						- 툴별 결과:
						${detailLines.collect { "  ${it}" }.join('\n')}
						- [경고 리포트 보기](${analysisUrl})
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
