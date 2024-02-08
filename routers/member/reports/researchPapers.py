import base64
import random
from typing import List
from fastapi import APIRouter, UploadFile, Request, File, Form
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, RedirectResponse, FileResponse
import json
import secrets
import string
import boto3
from datetime import datetime
import jwt
import datetime
import mysql.connector
from pathlib import Path

# Define the characters to choose from (alphanumeric)
characters = string.ascii_letters + string.digits

def get_member_id(jwt_cookie):
    try:
        # Decode the JWT and get the payload
        payload = jwt.decode(jwt_cookie, SECRET_KEY, algorithms=["HS256"])

        # Extract the adminID from the payload
        memberID = payload.get("sub")
        
        return memberID
    except jwt.InvalidTokenError:
        return "Not Authorized User"


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


researchPaperRouter = APIRouter()

@researchPaperRouter.get("/member/research/add")
async def admin_news(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            html_file_path = Path("./routers/member/views/research_add.html")
            return FileResponse(html_file_path)
        else:
            return RedirectResponse("/member/memberLogin")

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")

@researchPaperRouter.post("/member/addResearchReportData")
async def add_ReportsData(
    request: Request,
    title: str = Form(...),
    year: str = Form(...),
    venue: str = Form(None),
    authors: str = Form(None),
    files: List[UploadFile] = Form(None),  # Accept a list of uploaded images (default to None)
):
    jwt_cookie = request.cookies.get("access_token")
    if not is_valid_jwt(jwt_cookie):
        return "invalid jwt"

    random_key = ''.join(random.choice(characters) for _ in range(8))

    memberID = get_member_id(jwt_cookie)

    
    createdDate = datetime.datetime.now()
    createdBy = memberID
    modifiedDate = datetime.datetime.now()
    modifiedBy = memberID

    # get rds connection
    connection = get_database_connection()

    # try-catch block for executing SQL queries
    try:
        # Obtain cursor
        cursor = connection.cursor(dictionary=True)

        cursor.execute('SELECT publicationId FROM publications ORDER BY publicationId DESC LIMIT 1;')
        prev_id = cursor.fetchone()

        id = int(prev_id['publicationId']) + 1


        # # Define the SQL query with placeholders
        insert_query = """
        INSERT INTO publications (publicationId, name, createdDate, createdBy, status,  year, venue, authors, source)
        VALUES (%(publicationId)s, %(name)s, %(createdDate)s, %(createdBy)s, %(status)s, %(year)s, %(venue)s, %(authors)s, %(source)s)
        """
        
        data_to_insert = {
            "publicationId": id, 
            "name": title,
            "createdDate": createdDate,
            "createdBy": createdBy,
            "status": "1",
            "year": year,
            "venue": venue,
            "authors": authors,
            "source": "Manual"
            }
    

        # # Insert the data into the table
        cursor.execute(insert_query, data_to_insert)

        # Define the SQL query with placeholders
        file_insert_query = """
        INSERT INTO files (identifier, fileURL, createdDate, createdBy)
        VALUES (%(identifier)s, %(fileURL)s, %(createdDate)s, %(createdBy)s)
        ON DUPLICATE KEY UPDATE
        fileURL = VALUES(fileURL),
        createdBy = VALUES(createdBy),
        createdDate = VALUES(createdDate)
        """

        if files is not None:
            for file in files:
                # Read the binary data of the file
                file_data = file.file.read()

                # Specify the path where the file will be stored
                file_path = f"./uploads/{id}_{file.filename}"

                # Write the file data to the specified path
                with open(file_path, "wb") as f:
                    f.write(file_data)

                # Create a dictionary with the data to be inserted, including adminID and file_data
                file_data_to_insert = {
                    "identifier": id,
                    "fileURL": file_path,
                    "createdDate": createdDate,
                    "createdBy": memberID,
                }

                # Insert the data into the table
                cursor.execute(file_insert_query, file_data_to_insert)

        # Commit the changes to the database
        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return JSONResponse(content={"success": True})

    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)})

@researchPaperRouter.get("/member/research/view")
async def admin_news(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            html_file_path = Path("./routers/member/views/research_view.html")
            return FileResponse(html_file_path)
        else:
            return RedirectResponse("/member/memberLogin")

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")



@researchPaperRouter.get("/member/getResearchReportData")
async def get_newsData(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            return "invalid jwt"
        # fetch all activities from activities table
        
        memberID = get_member_id(jwt_cookie)
        connection = get_database_connection()
        # try catch bloc for executing sql queries
        try:
            # Obtain cursor
            cursor = connection.cursor(dictionary=True)
            
            query = """
                SELECT
                    p.publicationId,
                    p.name as title,
                    p.createdDate,
                    p.createdBy,
                    p.year,
                    p.venue,
                    p.authors,
                    f.id as file_id,
                    f.fileURL as file_url
                FROM publications p
                LEFT JOIN files f ON p.publicationId = f.identifier
                WHERE
                p.createdBy = %(memberID)s
                AND p.status = '1'
                ORDER BY p.createdDate DESC
            """

            # Execute the SELECT query
            cursor.execute(query, {"memberID": memberID})

            # Fetch the results
            results = cursor.fetchall()

            # Create a dictionary to store publications
            publication_dict = {}

            for row in results:
                publication_id = row["publicationId"]

                if publication_id not in publication_dict:
                    publication_dict[publication_id] = {
                        "id": publication_id,
                        "title": row["title"],
                        "createdDate": row["createdDate"],
                        "createdBy": row["createdBy"],
                        "year": row["year"],
                        "venue": row["venue"],
                        "authors": row["authors"],
                        "files":[]
                    }

                if row["file_url"] is not None and row["file_id"] is not None:
                    report_file = {
                        "file_id": row["file_id"],
                        "file_url": row["file_url"]  # Change to imageURL
                    }
                    publication_dict[publication_id]["files"].append(report_file)

            # Convert the dictionary values (events) to a list
            publication_list = list(publication_dict.values())

            for paper in publication_list:
                for file in paper["files"]:
                    # Assuming image_url contains the relative path to the image in the folder
                    file_path = file["file_url"]
                    with open(file_path, "rb") as f:
                        file_data = f.read()
                        file["file_data"] = base64.b64encode(file_data).decode('utf-8')
                    file["file_url"] = ""

            # Close the cursor and connection
            cursor.close()
            connection.close()

            return {"reportData": publication_list}
            
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
        
          
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")

@researchPaperRouter.delete("/member/research/delete")
async def delete_report_entry(request: Request):
    modifiedDate = datetime.datetime.now()
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            raise HTTPException(status_code=401, detail="Invalid JWT")
        
        memberID = get_member_id(jwt_cookie)
        # print(memberID)
        
        # Parse the request body as JSON
        delete_request = await request.json()
        id = delete_request.get("report_id", None)  # Extract news_id from request body
        # print(report_id)
        if id is None:
            raise HTTPException(status_code=400, detail="Missing 'report_id' in request body")


        # Get a database connection

        connection = get_database_connection()

        # Try-catch block for executing SQL queries
        try:
            # Obtain a cursor
            cursor = connection.cursor(dictionary=True)

            # Define the SQL query to delete a news entry by ID
            delete_query = """
            UPDATE publications
            SET status = %(status)s,
                modifiedDate = %(modifiedDate)s, modifiedBy = %(modifiedBy)s
            WHERE publicationId = %(publicationId)s AND createdBy = %(memberID)s
            """

            file_delete_query = """
            UPDATE files
            SET isArchive = %(archive)s, modifiedBy = %(modifiedBy)s, modifiedDate = %(modifiedDate)s
            WHERE identifier = %(report_id)s AND createdby = %(memberID)s
            """

            # Create a dictionary with the data to be used in the query
            pubication_data_to_archive = {
                "publicationId": id,
                "status": "0",
                "modifiedDate": modifiedDate,
                "modifiedBy": memberID,
                "memberID": memberID
            }

            data_to_archive = {
                "archive": "archive",
                "report_id": id,
                "memberID": memberID,
                "modifiedBy": memberID,
                "modifiedDate": modifiedDate,
            }

            # Execute the delete query
            cursor.execute(delete_query, pubication_data_to_archive)

            # Execute the delete query
            #cursor.execute(file_delete_query, data_to_archive)

            # Commit the changes to the database
            connection.commit()

            # Close the cursor and connection
            cursor.close()
            connection.close()

        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error deleting report entry")

    return {"success": True, "message": "Report entry deleted successfully"}


@researchPaperRouter.post("/member/updateResearchReportData")
async def update_NewsData(
    request: Request,
    id: str = Form(...),
    title: str = Form(...),
    year: str = Form(None),
    venue: str = Form(...),
    authors: str = Form(None),
):
    jwt_cookie = request.cookies.get("access_token")
    if not is_valid_jwt(jwt_cookie):
        return "invalid jwt"

    memberID = get_member_id(jwt_cookie)
    # Handle your form data and images here

    id = id
    title = title
    createdDate = datetime.datetime.now()
    createdBy = memberID
    modifiedDate = datetime.datetime.now()
    modifiedBy = memberID

    # get rds connection
    connection = get_database_connection()

    # try-catch block for executing SQL queries
    try:
        # Obtain cursor
        cursor = connection.cursor(dictionary=True)
        
        # Define the SQL query with placeholders
        # insert_query = """
        # UPDATE reports
        # SET title = %(title)s, type = %(type)s, description = %(description)s, submissionTitle = %(submissionTitle)s, modifiedBy = %(modifiedBy)s, modifiedDate = %(modifiedDate)s
        # WHERE id = %(id)s AND createdby = %(memberID)s
        # """
        # # Create a dictionary with the data to be inserted, including adminID and image_data
        # data_to_insert = {
        #     "id": id,
        #     "title": title,
        #     "type": type,
        #     "description": description,
        #     "submissionTitle": submissionTitle,
        #     "modifiedBy": modifiedBy,
        #     "modifiedDate": modifiedDate,
        #     "memberID": memberID,
        # }


        update_query = """
            UPDATE publications
            SET name = %(name)s, year = %(year)s, venue = %(venue)s, authors = %(authors)s,
                modifiedDate = %(modifiedDate)s, modifiedBy = %(modifiedBy)s
            WHERE publicationId = %(publicationId)s AND createdBy = %(memberID)s
        """

        # Create a dictionary with the data to be updated, including modifiedData and modifiedBy
        data_to_update = {
            "publicationId": id,
            "name": title,
            "year": year,
            "venue": venue,
            "authors": authors,
            "modifiedDate": modifiedDate,
            "modifiedBy": modifiedBy,
            "memberID": memberID
        }
    
        # Insert the data into the table
        cursor.execute(update_query, data_to_update)

        # Commit the changes to the database
        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return JSONResponse(content={"success": True})

    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)})



@researchPaperRouter.post("/member/updateResearchReportFileData")
async def update_ReportFileData(
    request: Request,
    id: str = Form(...),
    files: List[UploadFile] = Form(None),  # Accept a list of uploaded images (default to None)
    file_ids: List[str] = Form([])  # Use Set to handle image_ids (default to an empty list)
):
    jwt_cookie = request.cookies.get("access_token")
    if not is_valid_jwt(jwt_cookie):
        return "invalid jwt"

    memberID = get_member_id(jwt_cookie)
    # Handle your form data and images here

    id = id
    createdDate = datetime.datetime.now()
    createdBy = memberID
    modifiedDate = datetime.datetime.now()
    modifiedBy = memberID
    if files is None:
        files = []  # Initialize images as an empty list if not provided

    if file_ids is not None:
        file_ids = [int(id) for id in file_ids[0].strip("[]").split(',') if id.strip() and id.strip() != 'null']

    # get rds connection
    connection = get_database_connection()

    # try-catch block for executing SQL queries
    try:
        # Obtain cursor
        cursor = connection.cursor(dictionary=True)
        
        # Need new logic for image upload
        if file_ids is not None and file_ids:

        # Define the SQL query with placeholders
            delete_query = """
            DELETE FROM files WHERE identifier = %s AND id IN ({})""".format(",".join(["%s"] * len(file_ids))) 

            # Create a list of data to be inserted, including adminID and image_data
            data_to_delete = [id] + file_ids

            # Insert the data into the table
            cursor.execute(delete_query, data_to_delete)
        

        # Define the SQL query with placeholders
        image_insert_query = """
        INSERT INTO files (identifier, fileURL, createdDate, createdBy)
        VALUES (%(identifier)s, %(fileURL)s, %(createdDate)s, %(createdBy)s)
        ON DUPLICATE KEY UPDATE
        fileURL = VALUES(fileURL),
        modifiedBy = VALUES(modifiedBy),
        modifiedDate = VALUES(modifiedDate)
        """

        if files is not None: 
            for file in files:
                
                file_path = f"./uploads/{id}_{file.filename}"
                with open(file_path, "wb") as f:
                    f.write(file.file.read())
                
                # # Read the binary data of the image
                # image_data =  image.file.read()
                
                # Create a dictionary with the data to be inserted, including adminID and image_data
                img_data_to_insert = {
                    "identifier": id,
                    "fileURL": file_path,
                    "createdDate": createdDate,
                    "createdBy": memberID,
                    "modifiedBy": memberID,
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
