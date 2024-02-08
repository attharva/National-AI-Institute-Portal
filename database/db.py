import mysql.connector
import os

def get_database_connection():
    config = {
        "host": os.environ.get("HOSTNAME"),
        "user": os.environ.get("USER"),
        "password": os.environ.get("PASSWORD"),
        "database": os.environ.get("DATABASE"),
        "port": os.environ.get("PORT"),
    }
    connection = mysql.connector.connect(**config)
    return connection
