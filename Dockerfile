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

# Install the angular cli
RUN npm install -g @angular/cli

# Build the app
RUN ng build

# Stage 2: Serve the app using nginx
FROM nginx:stable-alpine

# Copy the build artifacts from the previous stage
COPY --from=build-stage /app/dist/angular-trains/ /usr/share/nginx/html

# Export port 80
EXPOSE 80

# Execute the nginx server
CMD ["nginx", "-g", "'daemon off;'"]