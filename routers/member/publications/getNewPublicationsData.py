from fastapi import APIRouter, Request
from fastapi import HTTPException
import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError

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



memberGetNewPublicationsData = APIRouter()

@memberGetNewPublicationsData.get("/member/getNewPublicationsData")
async def get_eventsData(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            return "invalid jwt"

        memberID = get_member_id(jwt_cookie)

        # fetch all activities from activities table
        connection = get_database_connection()
        # try catch bloc for executing sql queries
        try:
            # Obtain cursor
            cursor = connection.cursor()

            memberIdQuery = f"SELECT id from members where memberId = '{memberID}';"
            cursor.execute(memberIdQuery)
            userIdResults = cursor.fetchall()
            memberID = userIdResults[0][0]
            
            query = f"SELECT name, year, venue, citedBy_Scholar, citedBy_ACM, citedBy_OpenAlex, citedBy_IEEE, publicationId, authors FROM publications WHERE authorId = {memberID} and status = 1 AND date(createdDate) >= date(NOW() - interval 7 day) ORDER BY year DESC"
            cursor.execute(query)
            results = cursor.fetchall()

            publications_data = []

            for row in results:
                temp = {}
                temp["name"] = row[0]
                temp["year"] = row[1]
                temp["venue"] = row[2]
                temp["citedBy_Scholar"] = row[3]
                temp["citedBy_ACM"] = row[4]
                temp["citedBy_OpenAlex"] = row[5]
                temp["citedBy_IEEE"] = row[6]
                temp["publicationId"] = row[7]
                temp["authors"] = row[8] if row[8] else "Author list unavailable"
                publications_data.append(temp)

            # Close the cursor and connection
            cursor.close()
            connection.close()

            return {"publicationsData": publications_data}
            
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
        
          
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")

