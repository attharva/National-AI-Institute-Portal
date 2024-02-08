from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError
from pathlib import Path

# import mysql.connector

# def get_database_connection():
#     config = {
#         "host": "localhost",
#         "user": "root",
#         "password": "Localhost@611",
#         "database": "AI4EE_Local",
#         "port": 3306,  # Your MySQL port
#     }
#     connection = mysql.connector.connect(**config)
#     return connection

# publiceventsview = APIRouter()

# @publiceventsview.get("/public/events/view")
# async def public_events(request: Request):
#     try:
#         html_file_path = Path("./routers/public/views/viewEvents.html")
#         return FileResponse(html_file_path)

#     # catch any error in the admin_login function
#     except Exception as e:
#         print(e)
#         raise HTTPException(status_code=400, detail="Invalid JSON format")
    

