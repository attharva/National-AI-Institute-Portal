from fastapi import APIRouter, Request
from fastapi import HTTPException
import jwt
from fastapi.responses import FileResponse, RedirectResponse
from pathlib import Path
import mysql.connector
import datetime
from fastapi.responses import JSONResponse
# import session functions and token_map variable from sessions.py 
from sessions import get_admin_id, create_jwt_token, is_valid_jwt, add_token, expire_token, remove_expired_tokens, cleanup_expired_tokens
from sessions import token_map, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES


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
    
viewMembers = APIRouter()
@viewMembers.get("/admin/getMembersPage")
async def viewMembersPage(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            html_file_path = Path("./routers/admin/views/viewMembers.html")
            return FileResponse(html_file_path)
        else:
            return RedirectResponse("/admin/adminLogin")

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    
@viewMembers.get("/admin/getAddMembersPage")
async def viewMembersPage(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            html_file_path = Path("./routers/admin/views/addMembers.html")
            return FileResponse(html_file_path)
        else:
            return RedirectResponse("/admin/adminLogin")

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")


@viewMembers.get("/admin/getMembers")
async def get_newsData(request: Request):
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
            # Fetch the data into the table
            cursor.execute("SELECT * FROM members WHERE status='approved';")
            results = cursor.fetchall()
            # Close the cursor and connection
            cursor.close()
            connection.close()
            # iterate through the activities
            members_list = []
            for row in results:
                members = {
                    "id": row["id"],
                    "name": row["name"],
                    "university": row["university"],
                    "designation": row["designation"],
                    
                }
                members_list.append(members)
            return {"members": members_list}
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")


@viewMembers.get("/admin/getInactiveMembersPage")
async def viewMembersPage(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            html_file_path = Path("./routers/admin/views/viewInactiveMembers.html")
            return FileResponse(html_file_path)
        else:
            return RedirectResponse("/admin/adminLogin")

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")

@viewMembers.get("/admin/getInactiveMembers")
async def get_newsData(request: Request):
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
            # Fetch the data into the table
            cursor.execute("SELECT * FROM members WHERE status='pending';")
            results = cursor.fetchall()
            # Close the cursor and connection
            cursor.close()
            connection.close()
            # iterate through the activities
            members_list = []
            for row in results:
                members = {
                    "id": row["id"],
                    "name": row["name"],
                    "university": row["university"],
                    "designation": row["designation"],
                    
                }
                members_list.append(members)
            return {"members": members_list}
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    

@viewMembers.post("/admin/addMember")
async def add_NewsData(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            return "invalid jwt"
        
        adminID = get_admin_id(jwt_cookie)

        # obtain request parameters
        data =  await request.json()
        name = data.get("name")
        createdDate = datetime.datetime.now()
        university = data.get("university")
        designation = data.get("designation")
        createdBy = adminID
        modifiedDate = datetime.datetime.now()
        modifiedBy = adminID

        # get connection
        connection = get_database_connection()
        # try catch bloc for executing sql queries
        try:
            # Obtain cursor
            cursor = connection.cursor(dictionary=True)

            # Define the SQL query with placeholders
            insert_query = """
            INSERT INTO members (name, university, designation, status)
            VALUES (%(name)s, %(university)s, %(designation)s, %(status)s)
            
            """
            
            # Create a dictionary with the data to be inserted, including adminID
            data_to_insert = {
                "name": name,
                "university": university,
                "designation": designation,
                "status": 'approved',
            }

            # Insert the data into the table
            cursor.execute(insert_query, data_to_insert)
            
            # Commit the changes to the database
            connection.commit()

            # Close the cursor and connection
            cursor.close()
            connection.close()
        
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
          
    # catch any error in the function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    
    json_response = JSONResponse(content={"success": True, "message": "Member successful added to Database"})
    return json_response
    # return {"message": "News successful added to Database"}

@viewMembers.post("/admin/removeMember")
async def remove_member(request: Request):
    try:
        
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            raise HTTPException(status_code=401, detail="Invalid JWT")
        
        adminID = get_admin_id(jwt_cookie)
        
        # Parse the request body as JSON
        delete_request = await request.json()
        print(delete_request)
        memberID = delete_request.get("memberID", None)  # Extract news_id from request body

        if memberID is None:
            raise HTTPException(status_code=400, detail="Missing 'memberID' in request body")


        # Get a database connection

        print("req to del act")
        connection = get_database_connection()

        print("Received DELETE request for memberID:", memberID)

        # Try-catch block for executing SQL queries
        try:
            # Obtain a cursor
            cursor = connection.cursor(dictionary=True)

            # Define the SQL query to delete a news entry by ID
            delete_query = "UPDATE members SET status = 'deleted' WHERE id = %(memberID)s"

            # Create a dictionary with the data to be used in the query
            data_to_delete = {
                "memberID": memberID,
            }

            # Execute the delete query
            cursor.execute(delete_query, data_to_delete)

            # Check if any rows were affected
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Member entry not found or you are not authorized to delete it")

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


@viewMembers.post("/admin/approveMember")
async def approve_member(request: Request):
    try:
        
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            raise HTTPException(status_code=401, detail="Invalid JWT")
        
        adminID = get_admin_id(jwt_cookie)
        
        # Parse the request body as JSON
        delete_request = await request.json()
        print(delete_request)
        memberID = delete_request.get("memberID", None)  # Extract news_id from request body

        if memberID is None:
            raise HTTPException(status_code=400, detail="Missing 'memberID' in request body")


        # Get a database connection

        print("req to del act")
        connection = get_database_connection()


        # Try-catch block for executing SQL queries
        try:
            # Obtain a cursor
            cursor = connection.cursor(dictionary=True)

            # Define the SQL query to delete a news entry by ID
            delete_query = "UPDATE members SET status = 'approved' WHERE id = %(memberID)s"

            # Create a dictionary with the data to be used in the query
            data_to_delete = {
                "memberID": memberID,
            }

            # Execute the delete query
            cursor.execute(delete_query, data_to_delete)

            # Check if any rows were affected
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Member entry not found or you are not authorized to delete it")

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