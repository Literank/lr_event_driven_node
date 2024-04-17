# Use the official Node.js image with specified version
FROM node:20.11-alpine3.18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY src/ /usr/src/app/src
COPY tsconfig.json ./

# Build TypeScript code
RUN npm run build

# Command to run the application
CMD ["node", "dist/web/app.js"]
