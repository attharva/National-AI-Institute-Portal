from fastapi import APIRouter
from fastapi.security import OAuth2PasswordBearer
import jwt
from datetime import datetime, timedelta
import os

# Function to create JWT token
def create_jwt_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv.SECRET_KEY, algorithm=os.getenv.ALGORITHM)
    return encoded_jwt

def is_valid_jwt(jwt_cookie):
    try:
        decoded_token = jwt.decode(jwt_cookie, key=os.getenv.SECRET_KEY, algorithms=['HS256'])
        # If decoding is successful, the token is valid
        return True
    except Exception as e:
        # Handle other exceptions as needed
        print(f"An error occurred: {str(e)}")
        return False

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = APIRouter()