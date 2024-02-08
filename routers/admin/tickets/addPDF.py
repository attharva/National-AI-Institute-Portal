from fastapi import APIRouter, Request, Form, UploadFile, File
from fastapi import HTTPException
import jwt
from fastapi.responses import FileResponse, RedirectResponse
from pathlib import Path
import mysql.connector
import datetime
from fastapi.responses import JSONResponse
import os
from io import BytesIO
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
    
ticketsRouter = APIRouter()

@ticketsRouter.post("/admin/addPDF")
async def createActivity(
    request: Request,
    memberID: str = Form(...),
    pdf_file: UploadFile = File(...),
):
    try:
        print("Received memberID:", memberID)
        print("Received pdf_file filename:", pdf_file.filename)

        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            return "invalid jwt"

        # Save the uploaded PDF file
        pdf_data = await pdf_file.read()
        print("req rec")
        # You can save the file to a specific directory or use a cloud storage service

        # Insert data into the 'files' table
        connection = get_database_connection()
        try:
            cursor = connection.cursor(dictionary=True)
            insert_query = "INSERT INTO files (memberID, file) VALUES (%s, %s)"
         
            cursor.execute(insert_query, (memberID, pdf_data))
            connection.commit()
            cursor.close()
            connection.close()
            return {"message": "Activity created successfully"}
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid form data")
    


@ticketsRouter.get("/admin/getPDF/{identifier}")
async def getPDF(identifier: str):
    try:
        # Validate the JWT token (if required)
        # jwt_cookie = request.cookies.get("access_token")
        # if not is_valid_jwt(jwt_cookie):
        #     raise HTTPException(status_code=401, detail="Invalid JWT")

        # Query the database to retrieve the PDF data based on memberID
        connection = get_database_connection()
        try:
            cursor = connection.cursor(dictionary=True)
            select_query = "SELECT fileURL FROM files WHERE identifier = %s"
            cursor.execute(select_query, (identifier,))
            pdf_data = cursor.fetchone()

            if pdf_data is not None:
                # pdf_directory = "pdf_files"
                # pdf_directory_path = Path(pdf_directory)
                # pdf_directory_path.mkdir(parents=True, exist_ok=True)
                # temp_pdf_path = pdf_directory_path / f"{identifier}.pdf"
                # with open(temp_pdf_path, "wb") as temp_pdf_file:
                #     temp_pdf_file.write(pdf_data["file"])
                # # Return the PDF file as a response
                # file_path = pdf_data["file_url"]
                # with open(file_path, "rb") as f:
                #     file_data = f.read()
                #     file["file_data"] = base64.b64encode(file_data).decode('utf-8')
                return FileResponse(pdf_data["fileURL"], media_type="application/pdf")
                # '132', 'Hy10cckp', './uploads/Hy10cckp_File_1.pdf', 'member', '2023-12-05 03:59:01', NULL, NULL, NULL, 'pending'
                # './uploads/4vgRcOPe_File_1.pdf'
            raise HTTPException(status_code=404, detail="PDF not found for identifier")

        except Exception as db_error:
            raise HTTPException(status_code=500, detail=f"Database error: {db_error}")
        finally:
            cursor.close()
            connection.close()

    except HTTPException as http_error:
        raise http_error

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
@ticketsRouter.get("/admin/getQueriesPage")
async def viewMembersPage(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            html_file_path = Path("./routers/admin/views/queries.html")
            return FileResponse(html_file_path)
        else:
            return RedirectResponse("/admin/adminLogin")

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")

@ticketsRouter.get("/admin/getTicketsPage")
async def viewMembersPage(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            html_file_path = Path("./routers/admin/views/tickets.html")
            return FileResponse(html_file_path)
        else:
            return RedirectResponse("/admin/adminLogin")

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")


@ticketsRouter.get("/admin/getTickets")
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
            cursor.execute("SELECT * FROM tickets WHERE status='open';")
            results = cursor.fetchall()
            # Close the cursor and connection
            cursor.close()
            connection.close()
            # iterate through the activities
            tickets_list = []
            for row in results:
                tickets = {
                    "id": row["id"],
                    "name": row["name"],
                    "title": row["title"],
                    "description": row["description"],
                    # "date": row["ticketDate"],
                }
                tickets_list.append(tickets)
            return {"tickets": tickets_list}
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    

@ticketsRouter.get("/admin/getQueries")
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
            cursor.execute("SELECT * FROM queries WHERE status='open';")
            results = cursor.fetchall()
            # Close the cursor and connection
            cursor.close()
            connection.close()
            # iterate through the activities
            queries_list = []
            for row in results:
                queries = {
                    "id": row["id"],
                    "name": row["name"],
                    "email": row["email"],
                    "description": row["description"],
                    "date": row["queryDate"],
                }
                queries_list.append(queries)
            print(queries_list)
            return {"queries": queries_list}
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")

@ticketsRouter.post("/admin/resolveQuery")
async def approve_member(request: Request):
    try:
        
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            raise HTTPException(status_code=401, detail="Invalid JWT")
        
        adminID = get_admin_id(jwt_cookie)
        
        # Parse the request body as JSON
        delete_request = await request.json()
        print(delete_request)
        queryID = delete_request.get("queryID", None)  # Extract news_id from request body

        if queryID is None:
            raise HTTPException(status_code=400, detail="Missing 'queryID' in request body")


        # Get a database connection

        print("req to del act")
        connection = get_database_connection()


        # Try-catch block for executing SQL queries
        try:
            # Obtain a cursor
            cursor = connection.cursor(dictionary=True)

            # Define the SQL query to delete a news entry by ID
            delete_query = "UPDATE queries SET status = 'close' WHERE id = %(queryID)s"

            # Create a dictionary with the data to be used in the query
            data_to_delete = {
                "queryID": queryID,
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



@ticketsRouter.post("/admin/resolveTicket")
async def approve_member(request: Request):
    try:
        
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            raise HTTPException(status_code=401, detail="Invalid JWT")
        
        adminID = get_admin_id(jwt_cookie)
        
        # Parse the request body as JSON
        delete_request = await request.json()
        print(delete_request)
        ticketID = delete_request.get("ticketID", None)  # Extract news_id from request body
        ticketResponse = delete_request.get("ticketResponse", None) 

        if ticketID is None:
            raise HTTPException(status_code=400, detail="Missing 'queryID' in request body")


        # Get a database connection

        print("req to del act")
        connection = get_database_connection()


        # Try-catch block for executing SQL queries
        try:
            # Obtain a cursor
            cursor = connection.cursor(dictionary=True)

            # Define the SQL query to delete a news entry by ID
            update_query = "UPDATE tickets SET status = 'close', response = %(response)s WHERE id = %(ticketID)s"


            # Create a dictionary with the data to be used in the query
            data_to_update = {
                "ticketID": ticketID,
                "response": ticketResponse
            }

            # Execute the delete query
            cursor.execute(update_query, data_to_update)

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