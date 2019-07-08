# Use node 4.4.5 LTS
FROM node:10.15.1

# Copy source code
COPY . /app

# Change working directory
WORKDIR /app

# Install dependencies
RUN npm install

# Expose API port to the outside
EXPOSE 2000

# Launch application
CMD ["npm","start"]