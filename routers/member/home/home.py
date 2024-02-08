import base64
from fastapi import APIRouter, UploadFile, Request, File, Form
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, FileResponse, RedirectResponse
import json
import secrets
import string
import boto3
from datetime import datetime
import jwt
import datetime
from typing import List, Set
import mysql.connector
import random
import string
import os


# Define the characters to choose from (alphanumeric)
characters = string.ascii_letters + string.digits

# Generate an 8-character random key
random_key = ''.join(random.choice(characters) for _ in range(8))


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

        # Extract the memberID from the payload
        memberID = payload.get("sub")

        return memberID
    except jwt.InvalidTokenError:
        return "Not Authorized User"

memberHome = APIRouter()

def cal_deadline(deadline_data):
    # Extract relevant information
    title = deadline_data["title"]
    deadline_datetime_str = deadline_data["deadlineDateTime"]

    # Format the date
    formatted_date = datetime.datetime.strptime(deadline_datetime_str, "%Y-%m-%dT%H:%M").strftime("%Y-%m-%d %H:%M:%S")

    # Create the new data structure
    custom_format_data = {
        "eventName": title,
        "calendar": "Submission Deadline",  # You can set this to the desired value
        "color": "orange",   # You can set this to the desired value
        "date": formatted_date
    }

    return custom_format_data

def cal_events(events_data):
    # Extract relevant information
    title = events_data["title"]
    event_datetime_str = events_data["eventDateTime"]
    # print(event_datetime_str)

    # Format the date
    formatted_eventdate = event_datetime_str.strftime("%Y-%m-%d %H:%M:%S")

    # Create the new data structure
    custom_format_data = {
        "eventName": title,
        "calendar": "Event",  # You can set this to the desired value
        "color": "blue",   # You can set this to the desired value
        "date": formatted_eventdate
    }

    return custom_format_data




@memberHome.get("/member/home/data")
async def member_home(request: Request,):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            # make connection:
            connection = get_database_connection()
            cursor = connection.cursor(dictionary=True)
            
            # sql queries to get necessary data
            
            # 1. upcoming deadline
            cursor.execute('SELECT id, title, deadlineDateTime FROM deadlines WHERE deadlineDateTime > CURRENT_TIMESTAMP AND status = "Active" AND archive = "0" ORDER BY deadlineDateTime LIMIT 1;')
            results = cursor.fetchall()
            
            if len(results) > 0:
                next_deadline = {
                    "title": results[0]["title"],
                    "deadlineDateTime": results[0]["deadlineDateTime"]
                }
            else:
                next_deadline = {
                    "title":"",
                    "deadlineDateTime":""
                } 
            #print("next_deadline: ", next_deadline["title"])

            # 2. upcoming event
            
            cursor.execute('SELECT id, title, eventDateTime FROM events WHERE eventDateTime > CURRENT_TIMESTAMP AND status != "Draft" AND archive = "0" ORDER BY eventDateTime LIMIT 1;')
            results = cursor.fetchall()


            if len(results) > 0:
                next_event = {
                    "title": results[0]["title"],
                    "eventDateTime": results[0]["eventDateTime"]
                }
            else:
                next_event = {
                    "title":"",
                    "eventDateTime":""
                } 
            # print("next_event: ", next_event["title"])
            

            # 3. Pending submissions
            memberID = get_member_id(jwt_cookie)
            query = """SELECT
                        COUNT(d.title) AS pendingSubmissions
                    FROM
                        deadlines d
                    LEFT JOIN
                        reports r ON d.title = r.submissiontitle AND r.createdBy = %(memberID)s
                    WHERE
                        r.submissiontitle IS NULL
                    """

            parameters = {"memberID": memberID}

            cursor.execute(query, parameters)
            results = cursor.fetchall()
            total_pendingSubmission = results[0]["pendingSubmissions"]
            # print("total_pendingSubmission: ", total_pendingSubmission)


            # 4. Uploaded submissions
            memberID = get_member_id(jwt_cookie)
            paperSubmission_query = """SELECT
                        COUNT(p.name) AS paperSubmission
                    FROM
                        publications p 
                    WHERE 
                        p.createdBy = %(memberID)s
                        AND p.source = "manual"
                        AND p.status = "1"
                    """


            paperSubmission_parameters = {"memberID": memberID}

            cursor.execute(paperSubmission_query, paperSubmission_parameters)
            results = cursor.fetchall()

            total_paperSubmission = results[0]["paperSubmission"]
            # print("total_paperSubmission: ", total_paperSubmission)

            
             # 4. Late/On Time submissions
            query = """SELECT COUNT(*) AS on_time FROM reports WHERE submissionStatus = "Submitted On Time" and createdBy = %(memberID)s"""
            cursor.execute(query, {"memberID": memberID})
            results = cursor.fetchall()
            onTime_reports = results[0]["on_time"] if results else 0

            query = """SELECT COUNT(*) AS late FROM reports WHERE submissionStatus = "Submitted Late" and createdBy = %(memberID)s"""
            cursor.execute(query, {"memberID": memberID})
            results = cursor.fetchall()
            late_reports = results[0]["late"] if results else 0

            # 5. Latest Event


            query = """
            SELECT
                e.id AS event_id,
                e.title,
                e.description,
                e.url,
                e.status,
                e.eventDateTime,
                e.createdDate,
                e.createdBy,
                e.modifiedDate,
                e.modifiedBy,
                i.id as image_id,
                i.imageURL as image_url  # Change to imageURL
            FROM events e
            LEFT JOIN images i ON e.id = i.identifier
            AND i.type = "event"
            WHERE 
                (
                    (e.createdBy = %s AND e.status != 'Draft')
                    OR (e.createdBy != %s AND e.status != 'Draft')
                )
                AND e.archive = "0"
            ORDER BY e.createdDate DESC
            LIMIT 1
            """

             # cursor.execute(query, (itemsPerPage, (page - 1) * itemsPerPage))
            cursor.execute(query, (memberID,memberID))

            results = cursor.fetchall()

            # Create a dictionary to store events and their associated images
            events_dict = {}

            for row in results:
                event_id = row["event_id"]

                if event_id not in events_dict:
                    events_dict[event_id] = {
                        "id": event_id,
                        "title": row["title"],
                        "description": row["description"],
                        "url": row["url"],
                        "status":row["status"],
                        "eventDateTime": row["eventDateTime"],
                        "createdDate": row["createdDate"],
                        "createdBy": row["createdBy"],
                        "modifiedDate": row["modifiedDate"],
                        "modifiedBy": row["modifiedBy"],
                        "images": []  # Create a list to store images for this event
                    }

                if row["image_url"] is not None and row["image_id"] is not None:
                    event_image = {
                        "image_id": row["image_id"],
                        "image_url": row["image_url"]  # Change to imageURL
                    }
                    events_dict[event_id]["images"].append(event_image)

            # Convert the dictionary values (events) to a list
            events_list = list(events_dict.values())

            for event in events_list:
                for image in event["images"]:
                    # Assuming image_url contains the relative path to the image in the folder
                    image_path = image["image_url"]
                    with open(image_path, "rb") as f:
                        image_data = f.read()
                        image["image_data"] = base64.b64encode(image_data).decode('utf-8')
                    image["image_url"] = ""

            
            # 6. Latest News


            query = """
                SELECT
                n.id AS news_id,
                n.title,
                n.description,
                n.url,
                n.status,
                n.createdDate,
                n.createdBy,
                n.modifiedDate,
                n.modifiedBy,
                i.id as image_id,
                i.imageURL as image_url
            FROM news n
            LEFT JOIN images i ON n.id = i.identifier AND i.type = "news"
            WHERE 
                (
                    (n.createdBy = %s AND n.status != 'Draft')
                    OR (n.createdBy != %s AND n.status != 'Draft')
                )
                AND n.archive = "0"
            ORDER BY n.createdDate DESC
            LIMIT 1
            """

            # cursor.execute(query, (itemsPerPage, (page - 1) * itemsPerPage))
            cursor.execute(query, (memberID,memberID))

            results = cursor.fetchall()


            # Create a dictionary to store events and their associated images
            news_dict = {}

            for row in results:
                news_id = row["news_id"]

                if news_id not in news_dict:
                    news_dict[news_id] = {
                        "id": news_id,
                        "title": row["title"],
                        "description": row["description"],
                        "url": row["url"],
                        "status": row["status"],
                        "createdDate": row["createdDate"],
                        "createdBy": row["createdBy"],
                        "modifiedDate": row["modifiedDate"],
                        "modifiedBy": row["modifiedBy"],
                        "images": []  # Create a list to store images for this event
                    }
                
                if row["image_url"] is not None and row["image_id"] is not None:
                    news_image = {
                        "image_id": row["image_id"],
                        "image_url": row["image_url"]
                    }
                    news_dict[news_id]["images"].append(news_image)

    
            # Convert the dictionary values (events) to a list
            news_list = list(news_dict.values())


            for news in news_list:
                for image in news["images"]:
                    # Assuming image_url contains the relative path to the image in the folder
                    image_path = image["image_url"]
                    with open(image_path, "rb") as f:
                        image_data = f.read()
                        image["image_data"] = base64.b64encode(image_data).decode('utf-8')
                    image["image_url"] = ""

            # 6. Recent Upload            

            query = """
                SELECT
                    r.id AS report_id,
                    r.title,
                    r.description,
                    r.submissionTitle,
                    r.submissionStatus,
                    r.createdDate,
                    r.createdBy,
                    f.id as file_id,
                    f.fileURL as file_url
                FROM reports r
                LEFT JOIN files f ON r.id = f.identifier
                WHERE
                r.createdBy = %(memberID)s
                AND r.archive = "0"
                ORDER BY r.createdDate DESC
                LIMIT 1
            """

            cursor.execute(query, {"memberID": memberID})

            results = cursor.fetchall()
            # print(results)
            if results != []:

                # Create a dictionary to store events and their associated images
                report_dict = {}

                for row in results:
                    report_id = row["report_id"]

                    if report_id not in report_dict:
                        report_dict[report_id] = {
                            "id": report_id,
                            "title": row["title"],
                            "description": row["description"],
                            "submissionTitle": row["submissionTitle"],
                            "submissionStatus": row["submissionStatus"],
                            "createdDate": row["createdDate"],
                            "createdBy": row["createdBy"],
                            "files": []  # Create a list to store file for this report
                        }

                    if row["file_url"] is not None and row["file_id"] is not None:
                        report_file = {
                            "file_id": row["file_id"],
                            "file_url": row["file_url"]  # Change to imageURL
                        }
                        report_dict[report_id]["files"].append(report_file)

                # Convert the dictionary values (events) to a list
                report_list = list(report_dict.values())
                
                for report in report_list:
                    for file in report["files"]:
                        # Assuming image_url contains the relative path to the image in the folder
                        file_path = file["file_url"]
                        with open(file_path, "rb") as f:
                            file_data = f.read()
                            file["file_data"] = base64.b64encode(file_data).decode('utf-8')
                        file["file_url"] = ""
            else: 
                report_list = [{}]

             # deadlines for cal
            cursor.execute('SELECT id, title, deadlineDateTime FROM deadlines WHERE archive = "0" LIMIT 100;')
            results = cursor.fetchall()

            

            cal_list = []
            for deadline_data in results:
                custom_format_data = cal_deadline(deadline_data)
                cal_list.append(custom_format_data)
                    
            

            # events for cal     
            cursor.execute('SELECT id, title, eventDateTime FROM events WHERE status != "Draft" and archive = "0" LIMIT 100;')
            results = cursor.fetchall()

            # print(results)

            # custom_format_data_list = []
            for events_data in results:
                custom_format_eventData = cal_events(events_data)
                cal_list.append(custom_format_eventData)

                # print(cal_list)

            response_data = {
                "next_deadline": next_deadline,
                "next_event": next_event,
                "total_pendingSubmission":total_pendingSubmission,
                "total_paperSubmission": total_paperSubmission,
                "onTime_reports": onTime_reports,
                "late_reports": late_reports,
                "eventsData": events_list,
                "newsData": news_list,
                "reportData": report_list,
                "cal_list":cal_list
                # "approved_reports": approved_reports,
                # "rejected_reports": rejected_reports,
                # "citations_by_university": citations_by_university,
                # "papers_by_university": papers_by_university,
                # "communications": tickets+queries,
                # "members_by_university": members_by_university
            }
            
            return {"data": response_data}
        else:
            return RedirectResponse("/admin/adminLogin")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="error")


def get_active_titles():
    try:
        # fetch all deadlines from deadlines table
        connection = get_database_connection()
        
        # Obtain cursor
        cursor = connection.cursor(dictionary=True)

        query = """
        SELECT title
        FROM deadlines
        WHERE status = "Active"
        """
        cursor.execute(query)
        results = cursor.fetchall()

        # Extract titles from the results
        titles = [result["title"] for result in results]

    # Throw necessary exception for SQL query execution errors
    except mysql.connector.Error as sql_error:
        raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")

    return titles


@memberHome.get("/member/deadlines")
async def member_home(request: Request,):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            
            active_titles = get_active_titles()

            response_data = {
                "active_titles": active_titles,
            }
            return {"data": response_data}
        else:
            return RedirectResponse("/member/memberLogin")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="error")

