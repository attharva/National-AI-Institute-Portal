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
SECRET_KEY = "asasasaefethbrydmdhumdujhk"  # Replace with your secret key
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

def get_member_id(jwt_cookie):
    try:
        # Decode the JWT and get the payload
        payload = jwt.decode(jwt_cookie, SECRET_KEY, algorithms=["HS256"])

        # Extract the adminID from the payload
        memberID = payload.get("sub")
        
        return memberID
    except jwt.InvalidTokenError:
        return "Not Authorized User"



memberHidePublicationsData = APIRouter()

class PublicationIdsClass(BaseModel):
    publicationIds: List[int]
    comments: str

@memberHidePublicationsData.post("/member/hidePublicationsData")
async def get_eventsData(publicationIdsObj: PublicationIdsClass, request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            return "invalid jwt"
        
        memberID = get_member_id(jwt_cookie)

        publicationIds = publicationIdsObj.publicationIds
        comments = publicationIdsObj.comments

        # fetch all activities from activities table
        connection = get_database_connection()
        # try catch bloc for executing sql queries
        try:
            # Obtain cursor
            cursor = connection.cursor()       
            ids_string = ','.join(str(id) for id in publicationIds)
            query = f"Update publications set status = 0, comments = '{comments}', modifiedBy = '{memberID}' WHERE publicationId in ({ids_string});"
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

