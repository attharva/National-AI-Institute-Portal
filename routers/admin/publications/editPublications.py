from fastapi import APIRouter, Request
from fastapi import HTTPException
import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError
from pydantic import BaseModel
from typing import List
from pathlib import Path

import mysql.connector
import base64
import os


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
    except ExpiredSignatureError:
        # Token has expired
        return False
    except DecodeError:
        # Token is invalid (e.g., signature verification failed)
        return False
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



adminEditPublicationsData = APIRouter()

class PublicationClass(BaseModel):
    publicationId: int
    publicationName: str
    publicationAuthors: str
    publicationVenue: str
    publicationYear: str


@adminEditPublicationsData.post("/admin/editPublicationsData")
async def editPublicationsData(publicationObj: PublicationClass, request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            return "invalid jwt"
        
        adminID = get_admin_id(jwt_cookie)

        publicationId = publicationObj.publicationId
        publicationName = publicationObj.publicationName
        publicationAuthors = publicationObj.publicationAuthors
        publicationVenue = publicationObj.publicationVenue
        publicationYear = publicationObj.publicationYear

        # fetch all activities from activities table
        connection = get_database_connection()
        # try catch bloc for executing sql queries
        try:
            # Obtain cursor
            cursor = connection.cursor()       
            query = f"Update publications set name = '{publicationName}', authors = '{publicationAuthors}', venue = '{publicationVenue}', year = '{publicationYear}', modifiedBy = '{adminID}' WHERE publicationId = {publicationId};"
            cursor.execute(query)
            results = cursor.fetchall()
            connection.commit()
            cursor.close()
            connection.close()

            return
            
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
        
          
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")

