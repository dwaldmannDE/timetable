# Stage 1: Build the Angular app
FROM node:18 as build-stage

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Get the git commit hash
RUN git rev-parse --short HEAD > gitversion.txt

# Replace {{version}} with git commit hash
RUN sed -i 's/{{version}}/$(cat gitversion.txt)/g' /app/src/index.html

# Build the app
RUN npm run build

# Stage 2: Serve the app using nginx
FROM nginx:stable-alpine

# Copy the build artifacts from the previous stage
COPY --from=build-stage /app/dist/ /usr/share/nginx/html

# Copy the nginx configuration file
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
