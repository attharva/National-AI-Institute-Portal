from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
import jwt
import mysql.connector
from pathlib import Path
import datetime
from fastapi.responses import JSONResponse
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


adminhome = APIRouter()

@adminhome.get("/admin/home")
async def admin_login(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            html_file_path = Path("./routers/admin/views/homepage.html")
            return FileResponse(html_file_path)
        else:
            return RedirectResponse("/admin/adminLogin")
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    

@adminhome.get("/admin/homeData")
async def admin_home_data(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if is_valid_jwt(jwt_cookie):
            # make connection:
            connection = get_database_connection()
            cursor = connection.cursor(dictionary=True)
            # sql queries to get necessary data
            # 1. upcoming event
            # upcoming_event_query = 
            cursor.execute('SELECT id, title, eventDateTime FROM events WHERE eventDateTime > CURRENT_TIMESTAMP ORDER BY eventDateTime LIMIT 1;')
            results = cursor.fetchall()
            next_event = {
                "title": results[0]["title"],
                "eventDateTime": results[0]["eventDateTime"]
            }
            print("next_event: ", next_event["title"])
            # 2. Monthly citations
            # monthly_citations_query = 'SELECT COUNT(*) as number FROM publications WHERE year = YEAR(CURRENT_DATE);'
            cursor.execute('SELECT COUNT(*) as number FROM publications WHERE year = YEAR(CURRENT_DATE);')
            results = cursor.fetchall()
            total_publications = results[0]["number"]
            print("total_publications: ", total_publications)
            # 3. pending requests for members
            # pending_members_query = 
            cursor.execute('SELECT COUNT(*) as pending FROM members WHERE status = "pending";')
            results = cursor.fetchall()
            pending_request = results[0]["pending"]
            print("pending_request: ", pending_request)
            # 4. pending reports for approval
            # pending_activities_query = 
            cursor.execute('SELECT COUNT(*) pending FROM activities WHERE approval = "pending";')
            results = cursor.fetchall()
            pending_reports = results[0]["pending"]
            cursor.execute('SELECT COUNT(*) rejected FROM activities WHERE approval = "rejected";')
            results = cursor.fetchall()
            rejected_reports = results[0]["rejected"]
            cursor.execute('SELECT COUNT(*) approved FROM activities WHERE approval = "approved";')
            results = cursor.fetchall()
            approved_reports = results[0]["approved"]
            # citations by university for last year: 
            # total_citations_by_university_query = 
            cursor.execute('SELECT m.university as university, SUM(p.citedBy_scholar) AS total_citations FROM publications p JOIN members m ON p.authorID = m.id WHERE year = YEAR(CURRENT_DATE) GROUP BY m.university ORDER BY m.university;')
            results = cursor.fetchall()
            citations_by_university = []
            for row in results:
                citations_by_university.append(row)
            # papers published for current year by university
            cursor.execute('SELECT m.university as university, count(p.publicationId) AS papers FROM publications p JOIN members m ON p.authorID = m.id WHERE year = YEAR(CURRENT_DATE) GROUP BY m.university ORDER BY m.university;')
            results = cursor.fetchall()
            papers_by_university = []
            for row in results:
                papers_by_university.append(row)
            # communications
            cursor.execute('SELECT COUNT(*) as open FROM tickets WHERE status = "open";')
            results = cursor.fetchall()
            tickets = results[0]["open"]
            cursor.execute('SELECT COUNT(*) as open FROM queries WHERE status = "open";')
            results = cursor.fetchall()
            queries = results[0]["open"]
            # members by university
            cursor.execute('SELECT university, count(id) AS members FROM members where status = "approved" GROUP BY university;')
            results = cursor.fetchall()
            members_by_university = []
            for row in results:
                members_by_university.append(row)
            # print(members_by_university)
            # pack the data into json
            response_data = {
                "next_event": next_event,
                "total_publications": total_publications,
                "pending_request": pending_request,
                "pending_reports": pending_reports,
                "approved_reports": approved_reports,
                "rejected_reports": rejected_reports,
                "citations_by_university": citations_by_university,
                "papers_by_university": papers_by_university,
                "communications": tickets+queries,
                "members_by_university": members_by_university
            }
            
            return {"data": response_data}
        else:
            return RedirectResponse("/admin/adminLogin")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="error")