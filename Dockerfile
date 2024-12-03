FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src ./src
COPY public ./public

EXPOSE 3000

ENV MONGO_DB = "mongodb+srv://ngochuytech23:Quizgame102@cluster0.uw53g.mongodb.net/Quiz?retryWrites=true&w=majority&appName=Cluster0"
ENV SECRET_KEY="Quiz"

CMD ["npm", "start"]
