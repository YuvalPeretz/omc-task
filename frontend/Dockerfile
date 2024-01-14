# Use an official Node runtime as a parent image
FROM node:21.4.0

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock if using yarn)
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Install a server to serve the built app
RUN npm install -g serve

# Serve the app on port 3000
EXPOSE 3000
CMD ["serve", "-s", "build"]