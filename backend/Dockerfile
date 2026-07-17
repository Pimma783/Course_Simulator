FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# สมมติว่า Backend รันที่พอร์ต 5000 (ปรับเปลี่ยนตามโค้ดจริงของคุณได้เลย)
EXPOSE 5000

CMD ["npm", "run", "start:dev"]