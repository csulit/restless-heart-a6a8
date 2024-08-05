# Use a lightweight base image with Bun installed
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy the package.json and bun.lockb files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the server binary
RUN cd src && bun build server.ts --outfile ../server --compile

# Remove all files except the server binary
RUN find . -not -name 'server' -delete

# Expose port 8000
EXPOSE 8000

# Run the server binary
CMD ["./server"]