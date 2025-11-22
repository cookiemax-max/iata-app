# Use Node's official image
FROM node:current

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy rest of the backend code
COPY . .

# Expose the backend port (change if your server uses another port)
EXPOSE 5000

# Start your backend server
CMD ["node", "server.js"]
