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
# import session functions and token_map variable from sessions.py 
from sessions import get_admin_id, create_jwt_token, is_valid_jwt, add_token, expire_token, remove_expired_tokens, cleanup_expired_tokens
from sessions import token_map, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES


def get_database_connection():
    # config = {
    #     "host": "optima.ceiqumtvx3ak.us-east-1.rds.amazonaws.com",
    #     "user": "admin",
    #     "password": "admin1234",
    #     "database": "ai4ee",
    #     "port": 3306,  # Your MySQL port
    # }
    config = {
        "host": "database-1.cz0pyvn7hnd2.us-east-2.rds.amazonaws.com",
        "user": "admin",
        "password": "AI4EE_Jinjun_#cse611",
        "database": "ai4ee_database",
        "port": 3306,  # Your MySQL port
    }

    connection = mysql.connector.connect(**config)
    return connection

adminEventsDelete = APIRouter()

@adminEventsDelete.delete("/admin/events/delete")
async def delete_news_entry(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            raise HTTPException(status_code=401, detail="Invalid JWT")
        
        adminID = get_admin_id(jwt_cookie)
        
        # Parse the request body as JSON
        delete_request = await request.json()
        events_id = delete_request.get("events_id", None)  # Extract news_id from request body
        modifiedDate = datetime.datetime.now()
        modifiedBy = adminID

        if events_id is None:
            raise HTTPException(status_code=400, detail="Missing 'events_id' in request body")


        # Get a database connection

        connection = get_database_connection()

        # Try-catch block for executing SQL queries
        try:
            # Obtain a cursor
            cursor = connection.cursor(dictionary=True)

            # Define the SQL query to delete a news entry by ID
            delete_query = """UPDATE events
            SET archive = 1, modifiedBy = %(modifiedBy)s, modifiedDate = %(modifiedDate)s
            WHERE id = %(events_id)s"""

            # Create a dictionary with the data to be used in the query
            data_to_delete = {
                "events_id": events_id,
                "modifiedBy": modifiedBy,
                "modifiedDate":modifiedDate,
            }

            delete_image_query = """UPDATE images
            SET archive = 1, modifiedBy = %(modifiedBy)s, modifiedDate = %(modifiedDate)s
            WHERE identifier = %(events_id)s"""

            # Execute the delete query
            cursor.execute(delete_query, data_to_delete)

            # Execute the delete query
            cursor.execute(delete_image_query, data_to_delete)

            # Commit the changes to the database
            connection.commit()

            # Close the cursor and connection
            cursor.close()
            connection.close()

        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error deleting events entry")

    return {"success": True, "message": "Event entry deleted successfully"}


