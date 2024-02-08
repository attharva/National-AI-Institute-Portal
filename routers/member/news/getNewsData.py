from fastapi import APIRouter, Request
from fastapi import HTTPException
import jwt
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

        # Extract the adminID from the payload
        memberID = payload.get("sub")
        
        return memberID
    except jwt.InvalidTokenError:
        return "Not Authorized User"



memberGetNewsData = APIRouter()

@memberGetNewsData.get("/member/getNewsData")
async def get_newsData(request: Request):
    try:
        jwt_cookie = request.cookies.get("access_token")
        if not is_valid_jwt(jwt_cookie):
            return "invalid jwt"
        
        memberID = get_member_id(jwt_cookie)

        # fetch all activities from activities table
        connection = get_database_connection()
        # try catch bloc for executing sql queries
        try:
            # Obtain cursor
            cursor = connection.cursor(dictionary=True)
            
            # print(page, itemsPerPage)
            # print(f"itemsPerPage: {itemsPerPage}, OFFSET: {(page - 1) * itemsPerPage}")

            
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
                    n.createdBy = %s
                    OR (n.createdBy != %s AND n.status != 'Draft')
                )
                AND n.archive = "0"
            ORDER BY n.createdDate DESC;
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

            # Close the cursor and connection
            cursor.close()
            connection.close()

            return {"newsData": news_list}
            
        # throw necessary exception for sql query execution errors
        except mysql.connector.Error as sql_error:
            raise HTTPException(status_code=500, detail=f"Database error: {sql_error}")
        

    # catch any error in the admin_login function
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid JSON format")

