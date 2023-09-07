FROM node:16-alpine AS development
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY . .
RUN npm install --force

# Expose port
EXPOSE 3000
# Start the app
CMD ["npm", "run-script", "prd"]