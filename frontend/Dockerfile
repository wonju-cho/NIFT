# Node.js 18 기반 이미지
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# Docker Compose에서 넘긴 NODE_ENV를 받음
ARG NODE_ENV

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (package-lock.json을 100% 따름)
RUN npm ci

# 전체 프로젝트 복사
COPY . .

# NODE_ENV에 따라 build 분기
RUN if [ "$NODE_ENV" = "development" ]; then \
    npm run lint; \
    npm run build --verbose; \
  else \
    npm run build; \
  fi

# 컨테이너 실행 시 Next.js 실행
CMD ["npm", "run", "start"]