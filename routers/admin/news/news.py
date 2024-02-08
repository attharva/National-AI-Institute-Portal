from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import FileResponse
import jwt
from pathlib import Path
# import session functions and token_map variable from sessions.py 
from sessions import get_admin_id, create_jwt_token, is_valid_jwt, add_token, expire_token, remove_expired_tokens, cleanup_expired_tokens
from sessions import token_map, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
import mysql.connector

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
adminnews = APIRouter()

@adminnews.get("/admin/news")
async def admin_news(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            html_file_path = Path("./routers/admin/views/news.html")
            return FileResponse(html_file_path)
        return "inalid jwt"
        # html_file_path = Path("./routers/admin/views/news.html")
        # return FileResponse(html_file_path)
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    

