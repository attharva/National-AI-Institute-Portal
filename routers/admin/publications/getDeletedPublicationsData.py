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



adminGetDeletedPublicationsData = APIRouter()

@adminGetDeletedPublicationsData.get("/admin/getDeletedPublicationsData")
async def get_eventsData(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            return "invalid jwt"

        # fetch all activities from activities table
        connection = get_database_connection()
        # try catch bloc for executing sql queries
        try:
            # Obtain cursor
            cursor = connection.cursor()
            
            query = f"SELECT p.name, CONCAT(m.firstName, ' ', m.lastName) as AuthorName, p.year, p.venue, p.citedBy_Scholar, p.citedBy_ACM, p.citedBy_OpenAlex, p.citedBy_IEEE, p.publicationId, p.authors, p.comments FROM publications p, members m WHERE p.authorId = m.id AND p.status = 0 ORDER BY year DESC;"
            cursor.execute(query)
            results = cursor.fetchall()

            publications_data = []

            for row in results:
                temp = {}
                temp["name"] = row[0]
                temp["author_name"] = row[1]
                temp["year"] = row[2] if row[2] else "year absent"
                temp["venue"] = row[3]
                temp["citedBy_Scholar"] = row[4]
                temp["citedBy_ACM"] = row[5]
                temp["citedBy_OpenAlex"] = row[6]
                temp["citedBy_IEEE"] = row[7]
                temp["publicationId"] = row[8]
                temp["all_authors"] = row[9] if row[9] else "Author list unavailable"
                temp["comments"] = row[10]
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

