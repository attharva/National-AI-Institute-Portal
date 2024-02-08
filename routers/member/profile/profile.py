import base64
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
import jwt
from pathlib import Path
from fastapi import APIRouter, UploadFile, Request, File, Form
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import List
import mysql.connector

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

def get_member_id(jwt_cookie):
    try:
        # Decode the JWT and get the payload
        payload = jwt.decode(jwt_cookie, SECRET_KEY, algorithms=["HS256"])

        # Extract the adminID from the payload
        memberID = payload.get("sub")
        
        return memberID
    except jwt.InvalidTokenError:
        return "Not Authorized User"


def is_valid_jwt(jwt_cookie):
    try:
        decoded_token = jwt.decode(jwt_cookie, key=SECRET_KEY, algorithms=['HS256'])
        # If decoding is successful, the token is valid
        return True
    
    except Exception as e:
        # Handle other exceptions as needed
        print(f"An error occurred: {str(e)}")
        return False
memberProfile = APIRouter()

@memberProfile.get("/member/profile")
async def member_profilePage(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            html_file_path = Path("./routers/member/views/member_profile.html")
            return FileResponse(html_file_path)
        else:
            return RedirectResponse("/member/memberLogin")
            #return "inalid jwt"
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    
@memberProfile.get("/member/getProfileData")
async def get_profileData(request: Request):
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
            cursor = connection.cursor(dictionary=True)
            
            # print(page, itemsPerPage)
            # print(f"itemsPerPage: {itemsPerPage}, OFFSET: {(page - 1) * itemsPerPage}")

            
            query = """
                SELECT
                m.id AS profile_id,
                m.firstName,
                m.lastName,
                m.email,
                m.phoneNumber,
                m.googleScholarUrl,
                m.acmUrl,
                m.openAlexUrl,
                m.dblpUrl,
                m.university,
                m.designation,
                m.memberID,
                i.id as image_id,
                i.imageURL as image_url
            FROM members m
            LEFT JOIN images i ON m.id = i.identifier AND i.type = "profile"
            WHERE 
                (
                    m.memberID = %(memberID)s
                )
            """

            # cursor.execute(query, (itemsPerPage, (page - 1) * itemsPerPage))
            cursor.execute(query, {"memberID": memberID })

            results = cursor.fetchall()

            # print(results)

            # Create a dictionary to store events and their associated images
            profile_dict = {}

            for row in results:
                profile_id = row["profile_id"]

                if profile_id not in profile_dict:
                    profile_dict[profile_id] = {
                        "id": profile_id,
                        "firstName": row["firstName"],
                        "lastName": row["lastName"],
                        "email": row["email"],
                        "phoneNumber": row["phoneNumber"],
                        "googleScholarUrl": row["googleScholarUrl"],
                        "acmUrl": row["acmUrl"],
                        "openAlexUrl": row["openAlexUrl"],
                        "dblpUrl": row["dblpUrl"],
                        "university": row["university"],
                        "designation": row["designation"],
                        "memberID": row["memberID"],
                        "images": []  # Create a list to store images for this event
                    }
                
                if row["image_url"] is not None and row["image_id"] is not None:
                    profile_image = {
                        "image_id": row["image_id"],
                        "image_url": row["image_url"]
                    }
                    profile_dict[profile_id]["images"].append(profile_image)

    
            # Convert the dictionary values (events) to a list
            profile_list = list(profile_dict.values())


            for profile in profile_list:
                for image in profile["images"]:
                    # Assuming image_url contains the relative path to the image in the folder
                    image_path = image["image_url"]
                    with open(image_path, "rb") as f:
                        image_data = f.read()
                        image["image_data"] = base64.b64encode(image_data).decode('utf-8')
                    image["image_url"] = ""

            # Close the cursor and connection
            cursor.close()
            connection.close()

            return {"profileData": profile_list}
            
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
        

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")


@memberProfile.post("/member/updateProfileData")
async def update_NewsData(
    request: Request,
    id: str = Form(...),
    firstName: str = Form(...),
    lastName: str = Form(...),
    username: str = Form(...),
    email: str = Form(None),
    phoneNumber: str = Form(None),
    googleScholarUrl: str = Form(None),
    acmUrl: str = Form(None),
    openAlexUrl: str = Form(None),
    dblpUrl: str = Form(None),
    university: str = Form(None),
    designation: str = Form(None),
):
    jwt_cookie = request.cookies.get("access_token")
    if not is_valid_jwt(jwt_cookie):
        return "invalid jwt"

    

    firstName= firstName
    lastName= lastName
    username = username
    email = email
    phoneNumber = phoneNumber
    googleScholarUrl = googleScholarUrl
    acmUrl = acmUrl
    openAlexUrl = openAlexUrl
    dblpUrl = dblpUrl
    university  = university
    designation = designation
    memberID = get_member_id(jwt_cookie)
    createdDate = datetime.now()
    createdBy = memberID
    modifiedDate = datetime.now()
    modifiedBy = memberID

    # get rds connection
    connection = get_database_connection()

    # try-catch block for executing SQL queries
    try:
        # Obtain cursor
        cursor = connection.cursor(dictionary=True)
        
        # Define the SQL query with placeholders
        update_query = """
            UPDATE members
            SET 
                firstName = %(firstName)s,
                lastName = %(lastName)s,
                memberID = %(username)s,
                email = %(email)s,
                phoneNumber = %(phoneNumber)s,
                googleScholarUrl = %(googleScholarUrl)s,
                acmUrl = %(acmUrl)s,
                openAlexUrl = %(openAlexUrl)s,
                dblpUrl = %(dblpUrl)s,
                university = %(university)s,
                designation = %(designation)s,
                modifiedBy = %(modifiedBy)s,
                modifiedDate = %(modifiedDate)s
            WHERE id = %(id)s
        """
        # Create a dictionary with the data to be inserted, including adminID and image_data
        data_to_update = {
                "id": id,
                "firstName": firstName,
                "lastName": lastName,
                "username": username,
                "email": email,
                "phoneNumber": phoneNumber,
                "googleScholarUrl": googleScholarUrl,
                "acmUrl": acmUrl,
                "openAlexUrl": openAlexUrl,
                "dblpUrl": dblpUrl,
                "university": university,
                "designation": designation,
                "modifiedBy": modifiedBy,
                "modifiedDate": modifiedDate,
                "memberID": memberID,
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



@memberProfile.post("/member/updateProfileImgData")
async def update_EventsImgData(
    request: Request,
    id: str = Form(...),
    images: List[UploadFile] = Form(None),  # Accept a list of uploaded images (default to None)
    image_ids: List[str] = Form([])  # Use Set to handle image_ids (default to an empty list)
):
    jwt_cookie = request.cookies.get("access_token")
    if not is_valid_jwt(jwt_cookie):
        return "invalid jwt"

    memberID = get_member_id(jwt_cookie)
    # Handle your form data and images here

    id = id
    createdDate = datetime.now()
    createdBy = memberID
    modifiedDate = datetime.now()
    modifiedBy = memberID
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
                    "type": "profile",
                    # "imageData": image_data,
                    "imageURL": image_path,
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


@memberProfile.post("/member/updateProfilePassword")
async def update_NewsData(    
    request: Request,
    id: str = Form(...),
    password: str = Form(...)
):

    # get rds connection
    connection = get_database_connection()

    # try-catch block for executing SQL queries
    try:
        # Obtain cursor
        cursor = connection.cursor(dictionary=True)
        
        # Define the SQL query with placeholders
        update_password_query = """
            UPDATE members
            SET 
            password = %(password)s
            WHERE id = %(id)s
        """

         # Create a dictionary with the data to be inserted, including adminID and image_data
        data_to_update = {
            "id": id,
            "password": password
        }
            # Insert the data into the table
        cursor.execute(update_password_query, data_to_update)

        # Commit the changes to the database
        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return JSONResponse(content={"success": True})

    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)})
