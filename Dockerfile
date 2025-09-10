# Use official Node.js LTS image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the application
COPY ./src ./src

# Expose port
EXPOSE 5001

# Start the service
CMD ["node", "src/app.js"]
