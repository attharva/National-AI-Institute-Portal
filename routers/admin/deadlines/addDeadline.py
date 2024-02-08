from fastapi import APIRouter, UploadFile, Request, File, Form
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import json
import secrets
import string
import boto3
from datetime import datetime
import jwt
import datetime
from typing import List
import mysql.connector
import random
import string

# Define the characters to choose from (alphanumeric)
characters = string.ascii_letters + string.digits


def get_database_connection():
    config = {
        "host": "database-1.cz0pyvn7hnd2.us-east-2.rds.amazonaws.com",
        "user": "admin",
        "password": "AI4EE_Jinjun_#cse611",
        "database": "ai4ee_database",
        "port": 3306,  # Your MySQL port
    }

    connection = mysql.connector.connect(**config)
    return connection

# Configuration for JWT
SECRET_KEY = "asasasaefethbrydmdhumdujhj"  # Replace with your secret key
ALGORITHM = "HS256"

def is_valid_jwt(jwt_cookie):
    try:
        decoded_token = jwt.decode(jwt_cookie, key=SECRET_KEY, algorithms=['HS256'])
        # If decoding is successful, the token is valid
        return True
    except Exception as e:
        # Handle other exceptions as needed
        print(f"An error occurred: {str(e)}")
        return False

def get_admin_id(jwt_cookie):
    try:
        # Decode the JWT and get the payload
        payload = jwt.decode(jwt_cookie, SECRET_KEY, algorithms=["HS256"])

        # Extract the adminID from the payload
        adminID = payload.get("sub")
        
        return adminID
    except jwt.InvalidTokenError:
        return "Not Authorized User"


adminDeadlineData = APIRouter()

@adminDeadlineData.post("/admin/addDeadlileData")
async def add_DeadlineData(
    request: Request,
    title: str = Form(...),
    submissionMonth: str = Form(...),
    deadlineDateTime: str = Form(...),
    description: str = Form(None),
    status: str = Form(...),
):

    jwt_cookie = request.cookies.get("access_token")
    if not is_valid_jwt(jwt_cookie):
        return "invalid jwt"

    random_key = ''.join(random.choice(characters) for _ in range(8))

    adminID = get_admin_id(jwt_cookie)
    # Handle your form data and images here
    id = random_key
    title = title
    createdDate = datetime.datetime.now()
    submissionMonth = submissionMonth
    description = description
    createdBy = adminID
    modifiedDate = datetime.datetime.now()
    modifiedBy = adminID
    status=status

    # get rds connection
    connection = get_database_connection()

    # try-catch block for executing SQL queries
    try:
        # Obtain cursor
        cursor = connection.cursor(dictionary=True)
    
        # # Define the SQL query with placeholders
        insert_query = """
        INSERT INTO deadlines (id, title, description, submissionMonth, status, deadlineDateTime, createdBy, createdDate)
        VALUES (%(id)s, %(title)s, %(description)s, %(submissionMonth)s, %(status)s, %(deadlineDateTime)s,  %(createdBy)s, %(createdDate)s)
        """
        
        data_to_insert = {
                "id": id, 
                "title": title,
                "createdDate": createdDate,
                "submissionMonth": submissionMonth,
                "status": status,
                "deadlineDateTime": deadlineDateTime,
                "description": description,
                "createdBy": adminID,
                # "modifiedBy": adminID,
                }
        
        # # Insert the data into the table
        cursor.execute(insert_query, data_to_insert)
        
        # Commit the changes to the database
        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return JSONResponse(content={"success": True})

    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)})



@adminDeadlineData.post("/admin/updateDeadlineData")
async def update_DeadlineData(
    request: Request,
    id: str = Form(...),
    title: str = Form(...),
    deadlineDateTime: str = Form(...),
    submissionMonth: str = Form(...),
    description: str = Form(None),
    status: str = Form(...),
):
    jwt_cookie = request.cookies.get("access_token")
    if not is_valid_jwt(jwt_cookie):
        return "invalid jwt"

    adminID = get_admin_id(jwt_cookie)
    # Handle your form data and images here

    id = id
    title = title
    createdDate = datetime.datetime.now()
    submissionMonth = submissionMonth
    deadlineDateTime = deadlineDateTime
    description = description
    createdBy = adminID
    modifiedDate = datetime.datetime.now()
    modifiedBy = adminID
    status = status

    # get rds connection
    connection = get_database_connection()

    # try-catch block for executing SQL queries
    try:
        # Obtain cursor
        cursor = connection.cursor(dictionary=True)
        
        # Need new logic for image upload

        # Define the SQL query with placeholders
        insert_query = """
        UPDATE deadlines
        SET title = %(title)s, submissionMonth = %(submissionMonth)s, status = %(status)s, deadlineDateTime = %(deadlineDateTime)s, description = %(description)s, modifiedBy = %(modifiedBy)s, modifiedDate = %(modifiedDate)s
        WHERE id = %(id)s
        """

        # Create a dictionary with the data to be inserted, including adminID and image_data
        data_to_insert = {
            "id": id,
            "title": title,
            "submissionMonth": submissionMonth,
            "status": status,
            "deadlineDateTime":deadlineDateTime,
            "description": description,
            "modifiedBy": modifiedBy,
            "modifiedDate":modifiedDate,
        }
    
        # Insert the data into the table
        cursor.execute(insert_query, data_to_insert)

        # Commit the changes to the database
        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return JSONResponse(content={"success": True})

    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)})

