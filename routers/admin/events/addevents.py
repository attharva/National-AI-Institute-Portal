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
from typing import List, Set
import mysql.connector
import random
import string
# import session functions and token_map variable from sessions.py 
from sessions import get_admin_id, create_jwt_token, is_valid_jwt, add_token, expire_token, remove_expired_tokens, cleanup_expired_tokens
from sessions import token_map, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
import os


# Define the characters to choose from (alphanumeric)
characters = string.ascii_letters + string.digits

# Generate an 8-character random key
random_key = ''.join(random.choice(characters) for _ in range(8))


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

# # Configuration for JWT
# SECRET_KEY = "asasasaefethbrydmdhumdujhj"  # Replace with your secret key
# ALGORITHM = "HS256"

# def is_valid_jwt(jwt_cookie):
#     try:
#         decoded_token = jwt.decode(jwt_cookie, key=SECRET_KEY, algorithms=['HS256'])
#         # If decoding is successful, the token is valid
#         return True
#     except ExpiredSignatureError:
#         # Token has expired
#         return False
#     except DecodeError:
#         # Token is invalid (e.g., signature verification failed)
#         return False
#     except Exception as e:
#         # Handle other exceptions as needed
#         print(f"An error occurred: {str(e)}")
#         return False

# def get_admin_id(jwt_cookie):
#     try:
#         # Decode the JWT and get the payload
#         payload = jwt.decode(jwt_cookie, SECRET_KEY, algorithms=["HS256"])

#         # Extract the adminID from the payload
#         adminID = payload.get("sub")

#         return adminID
#     except jwt.InvalidTokenError:
#         return "Not Authorized User"


adminEventsData = APIRouter()


@adminEventsData.post("/admin/addEventsData")
async def add_EventsData(
    request: Request,
    title: str = Form(...),
    url: str = Form(None),
    description: str = Form(...),
    status: str = Form(...),
    eventDateTime: str = Form(...),
    images: List[UploadFile] = Form(None),  # Accept a list of uploaded images (default to None)
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
    url = url
    description = description
    status=status
    createdBy = adminID
    modifiedDate = datetime.datetime.now()
    modifiedBy = adminID
    eventdateTime = eventDateTime

    # get rds connection
    connection = get_database_connection()

    # try-catch block for executing SQL queries
    try:
        # Obtain cursor
        cursor = connection.cursor(dictionary=True)
    
        # # Define the SQL query with placeholders
        insert_query = """
        INSERT INTO events (id, title, createdDate, url, description, status, eventDateTime, createdBy)
        VALUES (%(id)s, %(title)s, %(createdDate)s, %(url)s, %(description)s, %(status)s, %(eventDateTime)s, %(createdBy)s)
        """
        print(status)

        data_to_insert = {
                "id": id, 
                "title": title,
                "createdDate": createdDate,
                "url": url,
                "description": description,
                "status":status,
                "eventDateTime": eventDateTime,
                "createdBy": adminID,
                "modifiedBy": adminID,
                }
        
        # # Insert the data into the table
        cursor.execute(insert_query, data_to_insert)

        # Define the SQL query with placeholders
        image_insert_query = """
        INSERT INTO images (identifier, type, imageURL, createdDate, createdBy)
        VALUES (%(identifier)s, %(type)s, %(imageURL)s, %(createdDate)s, %(createdBy)s)
        ON DUPLICATE KEY UPDATE
        imageURL = VALUES(imageURL),
        modifiedBy = VALUES(modifiedBy),
        modifiedDate = VALUES(modifiedDate)
        """

        if images is not None: 
            for image in images:
                
                image_path = f"./uploads/{id}_{image.filename}"
                with open(image_path, "wb") as f:
                    f.write(image.file.read())
                
                
                # # Read the binary data of the image
                # image_data =  image.file.read()
                
                # Create a dictionary with the data to be inserted, including adminID and image_data
                img_data_to_insert = {
                    "identifier": id,
                    "type": "event",
                    "imageURL": image_path,
                    "createdDate": createdDate,
                    "createdBy": adminID,
                    "modifiedBy": adminID,
                    "modifiedDate": modifiedDate,
                }

                # Insert the data into the table
                cursor.execute(image_insert_query, img_data_to_insert)
        
        # Commit the changes to the database
        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return JSONResponse(content={"success": True})

    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)})


@adminEventsData.post("/admin/updateEventsData")
async def update_EventsData(
    request: Request,
    id: str = Form(...),
    title: str = Form(...),
    url: str = Form(None),
    description: str = Form(...),
    status: str = Form(...),
    eventDateTime: str = Form(...),
    # images: List[UploadFile] = Form(None),  # Accept a list of uploaded images (default to None)
):
    jwt_cookie = request.cookies.get("access_token")
    if not is_valid_jwt(jwt_cookie):
        return "invalid jwt"

    adminID = get_admin_id(jwt_cookie)
    # Handle your form data and images here
    print(eventDateTime)

    id = id
    title = title
    createdDate = datetime.datetime.now()
    url = url
    description = description
    status=status
    createdBy = adminID
    modifiedDate = datetime.datetime.now()
    modifiedBy = adminID

    # get rds connection
    connection = get_database_connection()

    # try-catch block for executing SQL queries
    try:
        # Obtain cursor
        cursor = connection.cursor(dictionary=True)
        
        # Need new logic for image upload

        # Define the SQL query with placeholders
        insert_query = """
        UPDATE events
        SET title = %(title)s, url = %(url)s, description = %(description)s, status = %(status)s, eventDateTime = %(eventDateTime)s, modifiedBy = %(modifiedBy)s, modifiedDate = %(modifiedDate)s
        WHERE id = %(id)s
        """
        # Create a dictionary with the data to be inserted, including adminID and image_data
        data_to_insert = {
            "id": id,
            "title": title,
            "url": url,
            "description": description,
            "status": status, 
            "eventDateTime": eventDateTime,
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


@adminEventsData.post("/admin/updateEventsImgData")
async def update_EventsImgData(
    request: Request,
    id: str = Form(...),
    images: List[UploadFile] = Form(None),  # Accept a list of uploaded images (default to None)
    image_ids: List[str] = Form([])  # Use Set to handle image_ids (default to an empty list)
):
    jwt_cookie = request.cookies.get("access_token")
    if not is_valid_jwt(jwt_cookie):
        return "invalid jwt"

    adminID = get_admin_id(jwt_cookie)
    # Handle your form data and images here

    id = id
    createdDate = datetime.datetime.now()
    createdBy = adminID
    modifiedDate = datetime.datetime.now()
    modifiedBy = adminID
    if images is None:
        images = []  # Initialize images as an empty list if not provided

    if image_ids is not None:
        image_ids = [int(id) for id in image_ids[0].strip("[]").split(',') if id.strip() and id.strip() != 'null']

    # get rds connection
    connection = get_database_connection()

    # try-catch block for executing SQL queries
    try:
        # Obtain cursor
        cursor = connection.cursor(dictionary=True)
        
        # Need new logic for image upload
        if image_ids is not None and image_ids:

        # Define the SQL query with placeholders
            delete_query = """
            DELETE FROM images WHERE identifier = %s AND id IN ({})""".format(",".join(["%s"] * len(image_ids)))

            # Create a list of data to be inserted, including adminID and image_data
            data_to_delete = [id] + image_ids

            # Insert the data into the table
            cursor.execute(delete_query, data_to_delete)
        

        # Define the SQL query with placeholders
        image_insert_query = """
        INSERT INTO images (identifier, type, imageURL, createdDate, createdBy)
        VALUES (%(identifier)s, %(type)s, %(imageURL)s, %(createdDate)s, %(createdBy)s)
        ON DUPLICATE KEY UPDATE
        imageURL = VALUES(imageURL),
        modifiedBy = VALUES(modifiedBy),
        modifiedDate = VALUES(modifiedDate)
        """

        if images is not None: 
            for image in images:
                
                image_path = f"./uploads/{id}_{image.filename}"
                with open(image_path, "wb") as f:
                    f.write(image.file.read())
                
                # # Read the binary data of the image
                # image_data =  image.file.read()
                
                # Create a dictionary with the data to be inserted, including adminID and image_data
                img_data_to_insert = {
                    "identifier": id,
                    "type": "event",
                    # "imageData": image_data,
                    "imageURL": image_path,
                    "createdDate": createdDate,
                    "createdBy": adminID,
                    "modifiedBy": adminID,
                    "modifiedDate": modifiedDate,
                }

                # Insert the data into the table
                cursor.execute(image_insert_query, img_data_to_insert)

        # Commit the changes to the database
        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return JSONResponse(content={"success": True})

    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)})