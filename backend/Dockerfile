# 빌드 스테이지

# JAVA 21 기반
FROM openjdk:21-jdk-slim AS build

# 작업 디렉토리 설정
WORKDIR /app

# 필수 패키지 설치 (xargs 포함)
RUN apt-get update && apt-get install -y findutils

# Gradle 실행에 필요한 파일만 먼저 복사
COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle build.gradle
COPY settings.gradle settings.gradle

# 실행 권한 부여
RUN chmod +x gradlew

# 의존성 미리 다운로드 (캐시 활용)
RUN ./gradlew dependencies --no-daemon

# 전체 프로젝트 복사
COPY . .

# 빌드 실행
RUN ./gradlew build --no-daemon

# 실행용 컨테이너

FROM openjdk:21-jdk

WORKDIR /app

# Spring Boot 애플리케이션 Jar 파일 복사
COPY --from=build /app/build/libs/*.jar backend.jar

# 컨테이너 실행 시 Spring boot 실행
CMD ["java", "-jar", "backend.jar"]