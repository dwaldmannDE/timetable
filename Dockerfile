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
FROM httpd:alpine

# Copy the build artifacts from the previous stage
COPY --from=build-stage /app/dist/angular-trains/ /usr/local/apache2/htdocs/

# Copy the .htaccess file
COPY .htaccess /usr/local/apache2/htdocs/

# Add LoadModule rewrite_module modules/mod_rewrite.so to httpd.conf
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's#AllowOverride [Nn]one#AllowOverride All#' /usr/local/apache2/conf/httpd.conf