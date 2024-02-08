from fastapi import APIRouter, Request
from fastapi import HTTPException
import jwt

import mysql.connector
import base64


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


getDeadlineData = APIRouter()

@getDeadlineData.get("/admin/getDeadlineData")
async def get_deadlineData(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            return "invalid jwt"
        # fetch all activities from activities table
        connection = get_database_connection()
        # try catch bloc for executing sql queries
        try:
            # Obtain cursor
            cursor = connection.cursor(dictionary=True)
            
            cursor.execute("""
                SELECT
                    n.id AS deadline_id,
                    n.title,
                    n.description,
                    n.submissionMonth,
                    n.status,
                    n.deadlineDateTime,
                    n.createdDate,
                    n.createdBy,
                    n.modifiedDate,
                    n.modifiedBy
                FROM deadlines n
                WHERE n.archive = "0"
                ORDER BY n.createdDate DESC
            """)

            results = cursor.fetchall()

            # Create a dictionary to store events and their associated images
            deadline_dict = {}

            for row in results:
                deadline_id = row["deadline_id"]

                if deadline_id not in deadline_dict:
                    deadline_dict[deadline_id] = {
                        "id": deadline_id,
                        "title": row["title"],
                        "description": row["description"],
                        "submissionMonth": row["submissionMonth"],
                        "status": row["status"],
                        "deadlineDateTime": row["deadlineDateTime"],
                        "createdDate": row["createdDate"],
                        "createdBy": row["createdBy"],
                        "modifiedDate": row["modifiedDate"],
                        "modifiedBy": row["modifiedBy"],
                    }


            # Convert the dictionary values (events) to a list
            deadline_list = list(deadline_dict.values())

            # Close the cursor and connection
            cursor.close()
            connection.close()

            return {"deadlineData": deadline_list}
            
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
        
          
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")

