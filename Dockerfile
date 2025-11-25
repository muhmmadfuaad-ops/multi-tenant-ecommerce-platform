# Step 1: Use Node base image
FROM node:22-alpine as development

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package files first (for caching dependencies)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy all source code
COPY . .

# Step 6: Build NestJS app
# RUN npm run build

# Step 7: Expose the port your app runs on
# EXPOSE 3000

# Step 8: Command to start your app
CMD ["npm", "run", "start:dev"]
