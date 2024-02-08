FROM python

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

CMD ["python3", "main.py"]
# ////////////////////////////////////
# FROM python:3.8.10-slim

# WORKDIR /app

# COPY . /app

# # Install MySQL client
# RUN apt-get update && apt-get install -y default-mysql-client

# # Install Python dependencies
# RUN pip install -r requirements.txt

# # Wait for MySQL to be ready before running the FastAPI app
# CMD ["sh", "-c", "while ! nc -z mysql 3306; do sleep 1; done; python main.py"]


# # Use an official Python runtime as a parent image
# FROM python:3.8-slim

# # Set the working directory to /app
# WORKDIR /app

# # Copy the current directory contents into the container at /app
# COPY . /app

# # Install any needed packages specified in requirements.txt
# RUN pip install --no-cache-dir -r requirements.txt

# # Make port 8000 available to the world outside this container
# EXPOSE 8000

# # Define environment variable
# ENV NAME cse611

# # Run app.py when the container launches
# CMD ["python", "main.py"]