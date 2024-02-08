# import necessary libraries
from fastapi import APIRouter, Request, Response, HTTPException
from fastapi.responses import JSONResponse, HTMLResponse, RedirectResponse, FileResponse
import jwt
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone
import mysql.connector
from pathlib import Path
import time


# Session management and JWT creation, verification
# Configuration for JWT
SECRET_KEY = "asasasaefethbrydmdhumdujhj" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1

# Function to create JWT token
def create_jwt_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    add_token(encoded_jwt, expire)
    return encoded_jwt

def is_valid_jwt(jwt_cookie):
    try:
        if jwt_cookie not in token_map:
            return False
        decoded_token = jwt.decode(jwt_cookie, key=SECRET_KEY, algorithms=['HS256'])
        # If decoding is successful, the token is valid
        return True

    except Exception as e:
        # Handle other exceptions as needed
        print(f"An error occurred: {str(e)}")
        return False


def get_admin_id(jwt_cookie):
    try:
        # Decode the JWT and get the payload
        payload = jwt.decode(jwt_cookie, SECRET_KEY, algorithms=["HS256"])

        # Extract the adminID from the payload
        adminID = payload.get("sub")
        
        return adminID
    except jwt.InvalidTokenError:
        return "Not Authorized User"


def create_jwt(adminID):
    exp_time = datetime.utcnow() + timedelta(minutes=30)
    payload_data = {
        "sub": adminID,
        "exp": exp_time,
    }
    token = jwt.encode(
        payload=payload_data,
        key=SECRET_KEY,
        algorithm='HS256'
    )
    add_token(token, exp_time)
    # send jwt
    # response = Response({"success": True, "message": "Login Successful"})
    return token
    
token_map = {}

# add token and timestamp to token_map
def add_token(jwt, exp_time):
    token_map[jwt] = exp_time
    print(f"Active sessions: {len(token_map)}")

def expire_token(jwt):
    if jwt in token_map:
        token = token_map.pop(jwt)
        tokens = len(token_map)
        print(f"Removing a token for logging out. current active sessions: {tokens}")
        return token
    return None


def remove_expired_tokens(token_map):
    current_time = datetime.utcnow()
    count = 0
    # expired_tokens = [token for token, expiration_time in token_map.items() if current_time >= expiration_time]
    for token, expiration_time in list(token_map.items()):
        if current_time >= expiration_time:
            print(token_map.pop(token))
            count = count+1

    return count


def cleanup_expired_tokens(token_map, cleanup_interval_seconds=65):  
    while True:
        expired_tokens = remove_expired_tokens(token_map)
        tokens = len(token_map)
        print(f"Active tokens: {tokens}")
        print(f"Removed expired tokens: {expired_tokens}")
        time.sleep(cleanup_interval_seconds)
