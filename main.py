# import necessary libraries
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta, timezone
import jwt
import threading
import time
import logging



# import session functions and token_map variable from sessions.py 
from sessions import create_jwt_token, is_valid_jwt, add_token, expire_token, remove_expired_tokens, cleanup_expired_tokens
from sessions import token_map, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# create FastAPI server
app = FastAPI()

# Mount the 'static' directory to serve static files (CSS, images, etc.).
app.mount("/static", StaticFiles(directory="static"), name="static")

# Define and import routers for organization
# admin routes
from routers.admin.login import adminlogin
from routers.admin.events.addevents import adminEventsData
from routers.admin.news.addnews import adminNewsData
from routers.admin.home import adminhome
from routers.admin.activities.viewActivities import activities
from routers.admin.news.news import adminnews
from routers.admin.adminLogin import adminLogin
from routers.admin.news.getNewsData import getNewsData
from routers.admin.news.addNewsPage import adminnewsadd
from routers.admin.news.viewNewsPage import adminnewsview
from routers.admin.tickets.addPDF import ticketsRouter
from routers.admin.members.getMembers import viewMembers

# from routers.admin.resources.resources import adminresources
# from routers.admin.homeData import adminhomeData
# from routers.admin.activities.activities import adminactivities
from routers.admin.events.addevents import adminEventsData
from routers.admin.events.addEventsPage import admineventsadd
from routers.admin.events.getEventsData import getEventsData
from routers.admin.events.viewEventsPage import admineventsview
from routers.admin.news.deletenews import adminNewsDelete
from routers.admin.events.deleteevents import adminEventsDelete
from routers.admin.deadlines.addDeadline import adminDeadlineData
from routers.admin.deadlines.addDeadlinePage import admindeadlineadd
from routers.admin.deadlines.deleteDeadline import adminDeadlineDelete
from routers.admin.deadlines.viewDeadlinePage import admindeadlineview
from routers.admin.deadlines.getDeadlineData import getDeadlineData
from routers.admin.publications.viewPublications import adminPublicationsView
from routers.admin.publications.getPublicationsData import adminGetPublicationsData
from routers.admin.publications.hidePublications import adminHidePublicationsData
from routers.admin.publications.getNewPublicationsData import adminGetNewPublicationsData
from routers.admin.publications.viewNewPublications import adminNewPublicationsView
from routers.admin.publications.getDeletedPublicationsData import adminGetDeletedPublicationsData
from routers.admin.publications.viewDeletedPublications import adminDeletedPublicationsView
from routers.admin.publications.editPublications import adminEditPublicationsData
from routers.admin.publications.runPublicationsScripts import adminRunPublicationsScripts

# member routes
from routers.member.login import memberLogin
from routers.member.reports.report import reportRouter
# from routers.member.events.addevents import adminEventsData
from routers.member.news.addnews import memberNewsData
from routers.member.news.getNewsData import memberGetNewsData
from routers.member.news.addNewsPage import memberNewsAdd
from routers.member.news.viewNewsPage import memberNewsView
from routers.member.news.deletenews import memberNewsDelete
from routers.member.home.home import memberHome
from routers.member.profile.profile import memberProfile
from routers.member.reports.researchPapers import researchPaperRouter

from routers.member.events.addevents import memberEventsData
from routers.member.events.getEventsData import memberGetEventsData
from routers.member.events.addEventsPage import memberEventsAdd
from routers.member.events.viewEventsPage import memberEventsView
from routers.member.events.deleteevents import memberEventsDelete
from routers.member.publications.viewPublications import memberPublicationsView
from routers.member.publications.getPublicationsData import memberGetPublicationsData
from routers.member.publications.hidePublications import memberHidePublicationsData
from routers.member.tickets.tickets import memberTickets
from routers.member.publications.viewMemberPublications import memberMemberPublicationsView
from routers.member.publications.getMemberPublicationsData import memberGetMemberPublicationsData
from routers.member.publications.getNewPublicationsData import memberGetNewPublicationsData
from routers.member.publications.viewNewPublications import memberNewPublicationsView
from routers.member.publications.editPublications import memberEditPublicationsData


# public routes
# from routers.public.events.viewEventsPage import publiceventsview
from routers.public.events.getEventsData import getEventsDataPublic
from routers.public.home import getPublicData
from routers.public.news.getNewsData import getNewsDataPublic

# CORS - remove it later in prod
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "null"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)


# Start the cleanup process in the background
cleanup_thread = threading.Thread(target=cleanup_expired_tokens, args=(token_map,))
cleanup_thread.daemon = True
cleanup_thread.start()


@app.get("/")
def root():
    return "root page"

app.include_router(adminlogin)
app.include_router(adminhome)
app.include_router(activities)
# app.include_router(adminresources)
# app.include_router(adminhomeData)
# app.include_router(adminactivities)
app.include_router(adminEventsData)
app.include_router(adminNewsData)
app.include_router(adminnews)
app.include_router(adminLogin)
app.include_router(getNewsData)
app.include_router(adminnewsadd)
app.include_router(adminnewsview)
app.include_router(adminEventsData)
app.include_router(admineventsadd)
app.include_router(getEventsData)
app.include_router(admineventsview)
app.include_router(adminPublicationsView)
app.include_router(adminGetPublicationsData)
app.include_router(adminHidePublicationsData)
app.include_router(adminGetNewPublicationsData)
app.include_router(adminNewPublicationsView)
app.include_router(adminGetDeletedPublicationsData)
app.include_router(adminDeletedPublicationsView)
app.include_router(adminEditPublicationsData)
app.include_router(adminRunPublicationsScripts)

app.include_router(viewMembers)
app.include_router(adminNewsDelete)
app.include_router(adminEventsDelete)
app.include_router(memberLogin)
app.include_router(reportRouter)
app.include_router(ticketsRouter)
# app.include_router(publiceventsview)
app.include_router(getEventsDataPublic)
app.include_router(adminDeadlineData)
app.include_router(admindeadlineadd)
app.include_router(adminDeadlineDelete)
app.include_router(admindeadlineview)
app.include_router(getDeadlineData)
app.include_router(getPublicData)
app.include_router(memberNewsData)
app.include_router(memberGetNewsData)
app.include_router(memberNewsAdd)
app.include_router(memberNewsView)
app.include_router(memberNewsDelete)
app.include_router(memberHome)
app.include_router(memberProfile)


from uvicorn.config import LOGGING_CONFIG

app.include_router(memberEventsData)
app.include_router(memberGetEventsData)
app.include_router(memberEventsAdd)
app.include_router(memberEventsView)
app.include_router(memberEventsDelete)
app.include_router(memberTickets)


app.include_router(memberPublicationsView)
app.include_router(memberGetPublicationsData)
app.include_router(memberHidePublicationsData)
app.include_router(memberMemberPublicationsView)
app.include_router(memberGetMemberPublicationsData)
app.include_router(memberGetNewPublicationsData)
app.include_router(memberNewPublicationsView)
app.include_router(memberEditPublicationsData)
app.include_router(researchPaperRouter)
app.include_router(getNewsDataPublic)


# LOGGING_CONFIG["loggers"]["uvicorn.access"]["level"] = "WARNING"
# LOGGING_CONFIG["loggers"]["uvicorn.error"]["level"] = "ERROR"

if __name__ == "__main__":
    import uvicorn

    # Run the FastAPI application using UVicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)