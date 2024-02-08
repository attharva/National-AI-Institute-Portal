from fastapi import APIRouter, UploadFile, Request, File
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import json
import secrets
import string
import boto3
from datetime import datetime
import jwt
import datetime
import mysql.connector


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


adminDeadlineDelete = APIRouter()

@adminDeadlineDelete.delete("/admin/deadline/delete")
async def delete_news_entry(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            raise HTTPException(status_code=401, detail="Invalid JWT")
        
        adminID = get_admin_id(jwt_cookie)
        
        # Parse the request body as JSON
        delete_request = await request.json()
        deadline_id = delete_request.get("deadline_id", None)  # Extract deadline_id from request body
        modifiedDate = datetime.datetime.now()
        modifiedBy = adminID

        if deadline_id is None:
            raise HTTPException(status_code=400, detail="Missing 'deadline_id' in request body")

        # Get a database connection

        connection = get_database_connection()

        # Try-catch block for executing SQL queries
        try:
            # Obtain a cursor
            cursor = connection.cursor(dictionary=True)

            # Define the SQL query to delete a news entry by ID
            delete_query = """UPDATE deadlines
            SET archive = "1", modifiedBy = %(modifiedBy)s, modifiedDate = %(modifiedDate)s
            WHERE id = %(deadline_id)s"""

            # Create a dictionary with the data to be used in the query
            data_to_delete = {
                "deadline_id": deadline_id,
                "modifiedBy": modifiedBy,
                "modifiedDate":modifiedDate,
            }

            # Execute the delete query
            cursor.execute(delete_query, data_to_delete)

            # Commit the changes to the database
            connection.commit()

            # Close the cursor and connection
            cursor.close()
            connection.close()

        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error deleting deadline entry")

    return {"success": True, "message": "Deadline entry deleted successfully"}

