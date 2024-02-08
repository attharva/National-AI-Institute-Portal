from fastapi import APIRouter, Request, BackgroundTasks
from fastapi import HTTPException
from scraping.web_scraper_acm import scrape_acm
from scraping.web_scraper_dblp import scrape_dblp
from scraping.web_scraper_ieee import scrape_ieee
from scraping.web_scraper_openalex import scrape_openalex
from scraping.web_scraper_scholar import scrape_scholar
import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError
from pydantic import BaseModel
from typing import List
from pathlib import Path

import mysql.connector
import base64
import os


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
SECRET_KEY = "asasasaefethbrydmdhumdujhj"  # Replace with your secret key
ALGORITHM = "HS256"

def is_valid_jwt(jwt_cookie):
    try:
        decoded_token = jwt.decode(jwt_cookie, key=SECRET_KEY, algorithms=['HS256'])
        # If decoding is successful, the token is valid
        return True
    except ExpiredSignatureError:
        # Token has expired
        return False
    except DecodeError:
        # Token is invalid (e.g., signature verification failed)
        return False
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



adminRunPublicationsScripts = APIRouter()
class PublicationScriptClass(BaseModel):
    script: str

@adminRunPublicationsScripts.post("/admin/runPublicationsScripts")
async def runPublicationsScripts(publicationScriptClassObj: PublicationScriptClass, background_tasks: BackgroundTasks, request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            return "invalid jwt"
        script = publicationScriptClassObj.script

        if script == "all":
            background_tasks.add_task(scrape_acm)
            background_tasks.add_task(scrape_ieee)
            background_tasks.add_task(scrape_dblp)
            background_tasks.add_task(scrape_openalex)
            background_tasks.add_task(scrape_scholar)
        elif script == "acm":
            background_tasks.add_task(scrape_acm)
        elif script == "dblp":
            background_tasks.add_task(scrape_dblp)
        elif script == "ieee":
            background_tasks.add_task(scrape_ieee)
        elif script == "openalex":
            background_tasks.add_task(scrape_openalex) 
        elif script == "scholar":
            background_tasks.add_task(scrape_scholar)
        return
          
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")

