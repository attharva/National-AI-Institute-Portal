# Import required libraries 
import mysql.connector
from mysql.connector import Error
import numpy as np
from bs4 import BeautifulSoup
import schedule
import requests
import json
import time

def scrape_openalex():
    
    try:

        # Connect to DB 
        connection = mysql.connector.connect(host='database-1.cz0pyvn7hnd2.us-east-2.rds.amazonaws.com', database = 'ai4ee_database',user = 'admin', password ='AI4EE_Jinjun_#cse611') #INSERT CREDS
        HEADERS = {'User-Agent': 'Mozilla/5.0'}
        
        read_count_cursor = connection.cursor()
        sql_count_query = f'SELECT max(id) from members;'
        read_count_cursor.execute(sql_count_query)
        count_record = read_count_cursor.fetchall()
        max_user_id = 0             
        if count_record[0][0] is not None:
            max_user_id = count_record[0][0] + 1
        else:
            max_user_id = 1

        # Fetch profile URL if it exists in DB 
        for i in range(1, max_user_id):
            sql_select_query = f'SELECT openAlexUrl from members where id = {i};'
            read_cursor = connection.cursor()
            read_cursor.execute(sql_select_query)
            records = read_cursor.fetchall()
            write_cursor = connection.cursor()
            
            # Fetch publication details from profile link 
            for row in records:
                open_alex_url = row[0]
                if(open_alex_url != None and open_alex_url != '' and open_alex_url.strip() != ''):
                    open_alex_url = open_alex_url.strip()
                    search_url = 'https://api.openalex.org/works?filter=authorships.author.id:' + open_alex_url 
                    resp = requests.get(search_url, headers = HEADERS)
                    soup = BeautifulSoup(resp.content, from_encoding=resp.encoding)
                    data = resp.content
                    json_data = data.decode('utf8')
                    load_data = json.loads(json_data)
                    for load in load_data["results"]: 
                        publication_name = load["title"]
                        publication_authors = ''
                        publication_name = publication_name.replace("'", "''")
                        publication_year = load["publication_year"]
                        cited_by = load["cited_by_count"]
                        publication_authors = ''
                        publication_status = 1
                        author_id = i
                        for author in load["authorships"]:
                            publication_authors += author["author"]["display_name"]
                            publication_authors += ', '
                        publication_authors = publication_authors[:-2]
                        publication_authors = publication_authors.replace("'", "''")

                        # Check if record exists in DB, if not, insert 
                        sql_search_query = f"SELECT * from publications where name = '{publication_name}';"
                        read_cursor.execute(sql_search_query)
                        records = read_cursor.fetchall()
                        if(read_cursor.rowcount == 0):
                            sql_find_query = f"SELECT max(publicationId) from publications;"
                            read_cursor.execute(sql_find_query)
                            record = read_cursor.fetchall()
                            if record[0][0] is not None:
                                publication_id = record[0][0] + 1
                            else:
                                publication_id = 1
                            sql_insert_query = f"INSERT into publications (publicationId, name, year, venue, authorId, citedBy_Scholar, citedBy_ACM, citedBy_OpenAlex, status, createdDate, modifiedDate, createdBy, modifiedBy, citedBy_IEEE, comments, authors) values({publication_id}, '{publication_name}', {publication_year}, NULL, {author_id}, NULL, NULL, {cited_by}, {publication_status}, NOW(), NOW(), 'system', 'system', NULL, NULL, '{publication_authors}');"
                            print(sql_insert_query)
                            write_cursor.execute(sql_insert_query)
                            connection.commit()
                            print(write_cursor.rowcount, "Record inserted successfully into table")
                        
                        # If record exists in DB, update citation count 
                        else:
                            sql_update_query = f"UPDATE publications SET citedBy_OpenAlex = {cited_by}, modifiedDate = NOW() where name = '{publication_name}';"
                            print(sql_update_query)
                            write_cursor.execute(sql_update_query)
                            connection.commit()
                            print("Record updated successfully")

    # Error handling                                 
    except mysql.connector.Error as e:
        print("Failed to insert record into table", e)
    finally:
        if connection.is_connected():
            read_cursor.close()
            write_cursor.close()
            connection.close()
            print("MySQL Connection is closed")

if __name__ == "__main__":    
    # Scheduling every thursday to execute 
    schedule.every().thursday.at('10:00').do(scrape_openalex)

    while True:
        schedule.run_pending()
        time.sleep(1)