from fastapi import APIRouter, Request
from fastapi import HTTPException
import mysql.connector
import base64


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


getEventsDataPublic = APIRouter()

@getEventsDataPublic.get("/public/getEventsData")
async def get_eventsData(request: Request):
    try:

        connection = get_database_connection()
        try:
            # Obtain cursor
            cursor = connection.cursor(dictionary=True)
            
            cursor.execute("""
            SELECT
                e.id AS event_id,
                e.title,
                e.description,
                e.url,
                e.eventDateTime,
                i.id as image_id,
                i.imageURL as image_url  # Change to imageURL
            FROM events e
            LEFT JOIN images i ON e.id = i.identifier
            AND i.type = "event"
            WHERE e.status = "publish to webpage"
            AND e.archive = "0"
            ORDER BY e.createdDate DESC
            LIMIT 10;
            """)

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
                        "eventDateTime": row["eventDateTime"],
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

            # Close the cursor and connection
            cursor.close()
            connection.close()

            return {"eventsData": events_list}
            
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
        
          
    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")