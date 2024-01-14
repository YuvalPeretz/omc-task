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

# Your app binds to port 3001 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3001

CMD [ "node", "index.js" ]
