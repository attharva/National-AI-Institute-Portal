from fastapi import Depends
from essentials.constants import HTTP_200_OK, HTTP_201_CREATED
from essentials.endpoints import (
    MEMBER_LOGIN_ENDPOINT,
    MEMBER_HOME_ENDPOINT,
    MEMBER_HOME_DATA_ENDPOINT,
    ADD_ACTIVITY_ENDPOINT,
    VIEW_MY_RESOURCES_ENDPOINT,
    VIEW_ALL_RESOURCES_ENDPOINT,
    VIEW_RESOURCE_ENDPOINT
)
from main import app
from common.essential_methods import oauth2_scheme

@app.post(MEMBER_LOGIN_ENDPOINT, status_code=HTTP_200_OK)
async def member_login(request):
    data =  await request.json()
    adminID = data.get("adminID")
    password = data.get("password")
    return {"response": "success", "access_token": "your_generated_token"}

@app.get(MEMBER_HOME_ENDPOINT, status_code=HTTP_200_OK)
async def member_home(request):
    data =  await request.json()
    return {"response": "success"}

@app.get(MEMBER_HOME_DATA_ENDPOINT, status_code=HTTP_200_OK)
async def member_home_data(request):
    data =  await request.json()
    return {"response": "success", "data": ''}

@app.post(ADD_ACTIVITY_ENDPOINT, status_code=HTTP_201_CREATED)
async def add_member_activity(request, token: str = Depends(oauth2_scheme)):
    data =  await request.json()
    return {"response": "success"}

@app.get(VIEW_MY_RESOURCES_ENDPOINT+"{resource_type}", status_code=HTTP_200_OK)
async def view_my_resources(request, resource_type: str, token: str = Depends(oauth2_scheme)):
    data =  await request.json()
    return {"response": "success", "data": ''}

@app.get(VIEW_ALL_RESOURCES_ENDPOINT+"{resource_type}", status_code=HTTP_200_OK)
async def view_all_resources(request, resource_type: str, token: str = Depends(oauth2_scheme)):
    data =  await request.json()
    return {"response": "success", "data": view_all_resources(resource_type, token)}

@app.get(VIEW_RESOURCE_ENDPOINT+"{resource_id}", status_code=HTTP_200_OK)
async def view_resource(request, resource_id: int, token: str = Depends(oauth2_scheme)):
    data =  await request.json()
    return {"response": "success", "data": view_resource(resource_id, token)}
