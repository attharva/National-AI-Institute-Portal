from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import FileResponse
import jwt
from pathlib import Path

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


activities = APIRouter()


@activities.get("/admin/pendingActivities")
async def admin_news(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            html_file_path = Path("./routers/admin/views/pendingActivities.html")
            return FileResponse(html_file_path)
        return "inalid jwt"
        # html_file_path = Path("./routers/admin/views/news.html")
        # return FileResponse(html_file_path)
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    
@activities.get("/admin/approvedActivities")
async def admin_news(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            html_file_path = Path("./routers/admin/views/approvedActivities.html")
            return FileResponse(html_file_path)
        return "inalid jwt"
        # html_file_path = Path("./routers/admin/views/news.html")
        # return FileResponse(html_file_path)
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    
@activities.get("/admin/rejectedActivities")
async def admin_news(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            html_file_path = Path("./routers/admin/views/rejectedActivities.html")
            return FileResponse(html_file_path)
        return "inalid jwt"
        # html_file_path = Path("./routers/admin/views/news.html")
        # return FileResponse(html_file_path)
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    

@activities.get("/admin/getPendingActivities")
async def get_activitiesData(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            return "inalid jwt"
        # fetch all activities from activities table
        connection = get_database_connection()
        # try catch bloc for executing sql queries
        try:
            # Obtain cursor
            cursor = connection.cursor(dictionary=True)
            # Fetch the data into the table
            cursor.execute("SELECT * FROM reports WHERE approval = 'pending' ORDER BY createdDate DESC LIMIT 10;")
            # cursor.execute("SELECT * FROM reports WHERE approval = 'pending' ORDER BY createdDate DESC LIMIT 10;")
            results = cursor.fetchall()
            # Close the cursor and connection
            cursor.close()
            connection.close()
            # iterate through the activities
            activities_list = []
            for row in results:
                activitiesData = {
                    "id": row["id"],
                    "title": row["title"],
                    "description": row["description"],
                    "createdDate": row["createdDate"]
                }
                activities_list.append(activitiesData)
            return {"activities": activities_list}
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    
@activities.get("/admin/getApprovedActivities")
async def get_activitiesData(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            return "inalid jwt"
        # fetch all activities from activities table
        connection = get_database_connection()
        # try catch bloc for executing sql queries
        try:
            # Obtain cursor
            cursor = connection.cursor(dictionary=True)
            # Fetch the data into the table
            cursor.execute("SELECT * FROM reports WHERE approval = 'approved' ORDER BY createdDate DESC LIMIT 10;")
            results = cursor.fetchall()
            # Close the cursor and connection
            cursor.close()
            connection.close()
            # iterate through the activities
            news_list = []
            for row in results:
                newsData = {
                    "id": row["id"],
                    "title": row["title"],
                    "description": row["description"],
                    "createdDate": row["createdDate"]
                }
                news_list.append(newsData)
            return {"newsData": news_list}
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    
@activities.get("/admin/getRejectedActivities")
async def get_activitiesData(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            return "inalid jwt"
        # fetch all activities from activities table
        connection = get_database_connection()
        # try catch bloc for executing sql queries
        try:
            # Obtain cursor
            cursor = connection.cursor(dictionary=True)
            # Fetch the data into the table
            cursor.execute("SELECT * FROM reports WHERE approval = 'rejected' ORDER BY createdDate DESC LIMIT 10;")
            results = cursor.fetchall()
            # Close the cursor and connection
            cursor.close()
            connection.close()
            # iterate through the activities
            news_list = []
            for row in results:
                newsData = {
                    "id": row["id"],
                    "title": row["title"],
                    "description": row["description"],
                    "createdDate": row["createdDate"]
                }
                news_list.append(newsData)
            return {"newsData": news_list}
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")

# @activities.get("/admin/getApprovedActivities")
# async def delete_activitiesData(request: Request):
#     try:
#         jwt_cookie = request.cookies.get("access_token")
#         if not is_valid_jwt(jwt_cookie):
#             return "inalid jwt"
#         # fetch all activities from activities table
#         connection = get_database_connection()
#         # try catch bloc for executing sql queries
#         try:
#             # Obtain cursor
#             cursor = connection.cursor(dictionary=True)
#             # Fetch the data into the table
#             cursor.execute("SELECT * FROM activities approved = 1 ORDER BY createdDate DESC LIMIT 10;")
#             results = cursor.fetchall()
#             # Close the cursor and connection
#             cursor.close()
#             connection.close()
#             # iterate through the activities
#             news_list = []
#             for row in results:
#                 newsData = {
#                     "id": row["id"],
#                     "title": row["title"],
#                     "description": row["description"],
#                     "type": row["type"],
#                     "createdDate": row["createdDate"]
#                 }
#                 news_list.append(newsData)
#             return {"newsData": news_list}
#         # throw necessary exception for sql query execution errors
#         except mysql.connector.Error as sql_error:
#             raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
#     # catch any error in the admin_login function
#     except Exception as e:
#         print(e)
#         raise HTTPException(status_code=400, detail="Invalid JSON format")
    
@activities.delete("/admin/rejectActivity")
async def delete_news_entry(request: Request):
    try:
        
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            raise HTTPException(status_code=401, detail="Invalid JWT")
        
        adminID = get_admin_id(jwt_cookie)
        
        # Parse the request body as JSON
        delete_request = await request.json()
        print(delete_request)
        activity_id = delete_request.get("activity_id", None)  # Extract news_id from request body

        if activity_id is None:
            raise HTTPException(status_code=400, detail="Missing 'news_id' in request body")


        # Get a database connection

        print("req to del act")
        connection = get_database_connection()

        print("Received DELETE request for news_id:", activity_id)

        # Try-catch block for executing SQL queries
        try:
            # Obtain a cursor
            cursor = connection.cursor(dictionary=True)

            # Define the SQL query to delete a news entry by ID
            delete_query = "UPDATE reports SET approval = 'rejected' WHERE id = %(activity_id)s"

            # Create a dictionary with the data to be used in the query
            data_to_delete = {
                "activity_id": activity_id,
            }

            # Execute the delete query
            cursor.execute(delete_query, data_to_delete)

            # Check if any rows were affected
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="News entry not found or you are not authorized to delete it")

            # Commit the changes to the database
            connection.commit()

            # Close the cursor and connection
            cursor.close()
            connection.close()

        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error deleting news entry")

    return {"success": True, "message": "News entry deleted successfully"}

@activities.post("/admin/approveActivity")
async def delete_news_entry(request: Request):
    try:
        
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            raise HTTPException(status_code=401, detail="Invalid JWT")
        
        adminID = get_admin_id(jwt_cookie)
        
        # Parse the request body as JSON
        delete_request = await request.json()
        print(delete_request)
        activity_id = delete_request.get("activity_id", None)  # Extract news_id from request body

        if activity_id is None:
            raise HTTPException(status_code=400, detail="Missing 'news_id' in request body")


        # Get a database connection

        print("req to del act")
        connection = get_database_connection()

        print("Received DELETE request for news_id:", activity_id)

        # Try-catch block for executing SQL queries
        try:
            # Obtain a cursor
            cursor = connection.cursor(dictionary=True)

            # Define the SQL query to delete a news entry by ID
            delete_query = "UPDATE reports SET approval = 'approved' WHERE id = %(activity_id)s"

            # Create a dictionary with the data to be used in the query
            data_to_delete = {
                "activity_id": activity_id,
            }

            # Execute the delete query
            cursor.execute(delete_query, data_to_delete)

            # Check if any rows were affected
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="News entry not found or you are not authorized to delete it")

            # Commit the changes to the database
            connection.commit()

            # Close the cursor and connection
            cursor.close()
            connection.close()

        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error deleting news entry")

    return {"success": True, "message": "News entry deleted successfully"}


@activities.post("/admin/markPendingActivity")
async def delete_news_entry(request: Request):
    try:
        
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            raise HTTPException(status_code=401, detail="Invalid JWT")
        
        adminID = get_admin_id(jwt_cookie)      
        
        # Parse the request body as JSON
        delete_request = await request.json()
        print(delete_request)
        activity_id = delete_request.get("activity_id", None)  # Extract news_id from request body

        if activity_id is None:
            raise HTTPException(status_code=400, detail="Missing 'news_id' in request body")


        # Get a database connection

        print("req to del act")
        connection = get_database_connection()

        print("Received DELETE request for news_id:", activity_id)

        # Try-catch block for executing SQL queries
        try:
            # Obtain a cursor
            cursor = connection.cursor(dictionary=True)

            # Define the SQL query to delete a news entry by ID
            delete_query = "UPDATE reports SET approval = 'pending' WHERE id = %(activity_id)s"

            # Create a dictionary with the data to be used in the query
            data_to_delete = {
                "activity_id": activity_id,
            }

            # Execute the delete query
            cursor.execute(delete_query, data_to_delete)

            # Check if any rows were affected
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="News entry not found or you are not authorized to delete it")

            # Commit the changes to the database
            connection.commit()

            # Close the cursor and connection
            cursor.close()
            connection.close()

        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error deleting news entry")

    return {"success": True, "message": "News entry deleted successfully"}