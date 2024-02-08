from fastapi import APIRouter, Request, HTTPException, Body
from fastapi.responses import FileResponse, RedirectResponse, JSONResponse

from pathlib import Path
import mysql.connector
from datetime import datetime
def get_database_connection():
    # config = {
    #     "host": "optima.ceiqumtvx3ak.us-east-1.rds.amazonaws.com",
    #     "user": "admin",
    #     "password": "admin1234",
    #     "database": "ai4ee",
    #     "port": 3306,  # Your MySQL port
    # }

    # ai4ee_aws_rds
    config = {
        "host": "database-1.cz0pyvn7hnd2.us-east-2.rds.amazonaws.com",
        "user": "admin",
        "password": "AI4EE_Jinjun_#cse611",
        "database": "ai4ee_database",
        "port": 3306,  # Your MySQL port
    }
    connection = mysql.connector.connect(**config)
    return connection
getPublicData = APIRouter()

@getPublicData.get("/home")
async def public_home(request: Request):
    try:
        html_file_path = Path("./routers/public/views/index.html")
        return FileResponse(html_file_path)

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    

@getPublicData.get("/events")
async def public_events(request: Request):
    try:
        html_file_path = Path("./routers/public/views/events.html")
        return FileResponse(html_file_path)

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")


@getPublicData.get("/about")
async def public_about(request: Request):
    try:
        html_file_path = Path("./routers/public/views/about.html")
        return FileResponse(html_file_path)

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")

@getPublicData.get("/aiscreener")
async def public_aiscreener(request: Request):
    try:
        html_file_path = Path("./routers/public/views/aiScreener.html")
        return FileResponse(html_file_path)

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")


@getPublicData.get("/aiorchestrator")
async def public_aiorchestrator(request: Request):
    try:
        html_file_path = Path("./routers/public/views/aiOrchestrator.html")
        return FileResponse(html_file_path)

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")


@getPublicData.get("/recognition")
async def public_recognition(request: Request):
    try:
        html_file_path = Path("./routers/public/views/recognition.html")
        return FileResponse(html_file_path)

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")


@getPublicData.get("/podcast")
async def public_podcast(request: Request):
    try:
        html_file_path = Path("./routers/public/views/podcast.html")
        return FileResponse(html_file_path)

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")


@getPublicData.get("/contact")
async def public_contact(request: Request):
    try:
        html_file_path = Path("./routers/public/views/contact.html")
        return FileResponse(html_file_path)

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")

@getPublicData.get("/news")
async def public_contact(request: Request):
    try:
        html_file_path = Path("./routers/public/views/news.html")
        return FileResponse(html_file_path)

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")


@getPublicData.get("/login")
async def public_contact(request: Request):
    try:
        html_file_path = Path("./routers/member/views/login.html")
        return FileResponse(html_file_path)

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")


@getPublicData.post("/contact")
async def public_contact(request: Request):
    data = await request.form()
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    message = data.get("message")
    connection = get_database_connection()

    # try catch bloc for executing sql queries
    try:
        # Obtain cursor
        cursor = connection.cursor(dictionary=True)

        insert_query = """
            INSERT INTO queries (name, email, phone, description, queryDate, status)
            VALUES (%(name)s, %(email)s, %(phone)s, %(description)s, NOW(), 'open')
        """

        data_to_insert = {
            "name": name,
            "email": email,
            "phone": phone,
            "description": message,
            # Add other fields if needed
        }

        # Insert the data into the table
        cursor.execute(insert_query, data_to_insert)
        connection.commit()
        # Close the cursor and connection
        cursor.close()
        connection.close()
        return JSONResponse(content={"success": True, "message": "Query submitted successfully"}, status_code=200)
    
    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)})

    # throw necessary exception for sql query execution errors
    except mysql.connector.Error as sql_error:
        raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
