# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the build command
RUN npm run build

# Expose the application port
EXPOSE 3000

ENV DB_HOST=mysql

ENV DB_TYPE=mysql

ENV DB_PORT=3306

ENV DB_USERNAME=admin

ENV DB_PASSWORD=0000

ENV DB_NAME=service_com

ENV SECRET=yfoyfyitdotkuyfouyoyf

# Command to run the application
CMD ["npm", "run", "start:prod"]
