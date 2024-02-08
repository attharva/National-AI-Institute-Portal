from fastapi import APIRouter, Request, Response, HTTPException, Body
from fastapi.responses import JSONResponse, HTMLResponse, RedirectResponse, FileResponse

from fastapi.security import OAuth2PasswordBearer
import jwt
# import PyJWT
from datetime import datetime, timedelta, timezone
import mysql.connector
from pathlib import Path
# import session functions and token_map variable from sessions.py 
from sessions import create_jwt_token, is_valid_jwt, add_token, expire_token, remove_expired_tokens, cleanup_expired_tokens, create_jwt
from sessions import token_map, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

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

# # Configuration for JWT
# SECRET_KEY = "asasasaefethbrydmdhumdujhj"  # Replace with your secret key
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30

# # Function to create JWT token
# def create_jwt_token(data: dict, expires_delta: timedelta = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(minutes=15)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

adminlogin = APIRouter()

@adminlogin.post("/admin/login")
async def admin_login(
    request: Request,
    data: dict = Body(...),
    ):

    jwt_cookie = request.cookies.get("access_token")
    if is_valid_jwt(jwt_cookie):
        json_response = JSONResponse(content={"success": True, "message": "Login Successful"})
        return json_response
        
    try:
        # obtain request parameters
        data =  await request.json()
        adminID = data.get("adminID")
        password = data.get("password")

        # get rds connection
        connection = get_database_connection()

        # try catch bloc for executing sql queries
        try:
            # Obtain cursor
            cursor = connection.cursor(dictionary=True)

            # execute sql query
            cursor.execute("SELECT * FROM admins WHERE adminID = %s", (adminID,))

            # Fetch the results
            results = cursor.fetchall()

            # Close the cursor and connection
            cursor.close()
            connection.close()
        
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
        
        # If adminID is not found in database then return error
        if not results:
            raise HTTPException(status_code=401, detail="AdminID not found")
        
        # verify the validity of the password
        if results[0]["password"] == password:
            token = create_jwt(adminID)
            json_response = JSONResponse(content={"success": True, "message": "Login Successful"})
            json_response.set_cookie(
                key="access_token",
                value=token,
                httponly=True,  # This makes the cookie HTTP-only
            )
            
            return json_response
        
        # if password doesnot match, return error
        else:
            return JSONResponse(content={"success": False, "message": "Invalid credentials"}, status_code=401)
            
    
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    

# @adminlogin.get("/admin/logout")
# async def admin_logout(request: Request, response: Response):
   
#     # ////////////////////////////
#     exp_time = datetime.utcnow() 
#     payload_data = {
#         "sub": "adminID",
#         "exp": exp_time,
#     }
#     token = jwt.encode(
#         payload=payload_data,
#         key=SECRET_KEY,
#         algorithm='HS256'
#     )
#     json_response = JSONResponse(content={"success": True, "message": "Logout Successful"})
#     json_response.set_cookie(
#     key="access_token",
#         value=token,
#         httponly=True,  # This makes the cookie HTTP-only
#     )

#     return json_response

#Look into better logout
@adminlogin.get("/admin/logout")
async def admin_logout(request: Request):
    # Your logout logic here

    # Create a JSONResponse with your data
    jwt_cookie = request.cookies.get("access_token")
    expire_token(jwt_cookie)
    data = {"success": True, "message": "Logout Successful"}
    json_response = JSONResponse(content=data)

    # Redirect to another URL using RedirectResponse
    redirect_url = "/admin/adminLogin"  # Change this to the URL you want to redirect to
    response = RedirectResponse(url=redirect_url)

    # # Add the cookie to the response
    # exp_time = datetime.utcnow() 
    # payload_data = {
    #     "sub": "adminID",
    #     "exp": exp_time,
    # }
    # token = jwt.encode(
    #     payload=payload_data,
    #     key=SECRET_KEY,
    #     algorithm='HS256'
    # )
    # response.set_cookie(
    #     key="access_token",
    #     value=token,
    #     httponly=True  # This makes the cookie HTTP-only
    # )

    return response




# @adminlogin.get("/admin/logout")
# async def admin_logout(request: Request):
#     json_response = JSONResponse(content={"success": True, "message": "Logout Successful"})
#     json_response.delete_cookie("access_token")
#     return RedirectResponse("https://www.google.com")