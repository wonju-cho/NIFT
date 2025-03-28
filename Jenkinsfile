pipeline {
	agent any

	parameters {
		choice(name: 'ENV', choices: ['dev', 'production'], description: 'Select environment')
	}

	stages{

		stage('Decide Environment') {
			steps {
				script {
					//브랜치 이름
					def branch = env.BRANCH_NAME ? env.BRANCH_NAME : env.GIT_BRANCH

					echo "🚀 Branch: ${branch}"

                    // 자동 설정: ENV 파라미터가 비어 있으면 브랜치 기준으로 할당
                    if (!params.ENV || params.ENV.trim() == '') {
                        if (branch == 'develop') {
                            env.ENV = 'dev'
                        } else {
                            env.ENV = 'production'
                        }
                        echo "🔄 ENV auto-detected as: ${env.ENV}"
                    } else {
                        env.ENV = params.ENV
                        echo "✅ ENV manually selected: ${env.ENV}"
                    }
				}
			}
		}

		stage('Parse and Write .env') {
		    steps {
		        withCredentials([file(credentialsId: 'DB_CRED', variable: 'DB_CRED_FILE')]) {
		            script {
		                def json = readJSON file: "${DB_CRED_FILE}"

		                json.each { 
		                	key, value -> env[key] = value
		                }

		                def envContent = json.collect { key, value -> "${key}=${value}" }.join('\n')
		                writeFile file: '.env', text: envContent
		            }
		        }
		    }
		}


		stage('Reset containers') {
			steps {
				script {
					if(params.ENV == 'dev')
					{
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
					//sh안에서는 저 env.어쩌고가 공유가 안됨.
					//그래서 Groovy에서 먼저 값 받고 sh에 넘겨줘야함.
					def user = env.MYSQL_USER
					def password = env.MYSQL_PASSWORD
					def database = env.MYSQL_DATABASE
					
					//sh문의 '''이 부분은 Groovy변수를 사용할 수 없기 때문에 """을써야 치환됨.
					sh """
						echo "Insert dummy data"
						docker exec mysql bash -c \\
			  			"mysql -u${user} -p${password} ${database} < /docker-entrypoint-initdb./init.sql"
					"""
				}
			}
		}
	}

	post {
		always {
			sh 'rm -f .env'
		}

		//빌드 실패시 자동 롤백을 위한 step
		success {
			script {
				if(params.ENV == 'production')
				{
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
				if(params.ENV == 'production')
				{
					//stop -> rm -> pull  -> run
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