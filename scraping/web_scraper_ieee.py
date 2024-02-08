# Import necessary libraries 
import mysql.connector
from mysql.connector import Error
import numpy as np
from bs4 import BeautifulSoup
import schedule
import requests
import time

def scrape_ieee():
    try:
        api_key = 'bw88yafj87sjfh3ng34gjmy4'

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

        for i in range(1, max_user_id):

            # SQL Query to fetch user's IEEE Name 
            sql_select_query = f'SELECT ieeeName from members where id = {i};'

            # Establish connection and execute query
            read_cursor = connection.cursor()
            read_cursor.execute(sql_select_query)
            records = read_cursor.fetchall()
            write_cursor = connection.cursor()
            for row in records:
                ieee_name = row[0]

                # Search for publications for each user
                if(ieee_name != None and ieee_name != '' and ieee_name.strip() != ''):
                    ieee_name = ieee_name.strip()
                    search_url = 'https://ieeexploreapi.ieee.org/api/v1/search/articles?apikey=' + api_key + '&format=xml&max_records=200&author=' + ieee_name
                    resp = requests.get(search_url, headers = HEADERS)
                    soup = BeautifulSoup(resp.content, from_encoding=resp.encoding)
                    links = []
                    publication_name = ''
                    publication_year = None
                    cited_by = None
                    
                    # Fetch publication title
                    for link in soup.findAll('title'):
                        links.append(link.text)  
                    for link in links:
                        publication_name = link
                        publication_name = publication_name.replace("'", "''")
                        publication_authors = ''
                        
                        # Search if publication title already exists, proceed if it does not
                        sql_search_query = f"SELECT * from publications where name = '{publication_name}';"
                        read_cursor.execute(sql_search_query)
                        records = read_cursor.fetchall()
                        
                        # Fetch further details of publication if it does not exist
                        if(read_cursor.rowcount == 0):
                            request_url = 'https://ieeexploreapi.ieee.org/api/v1/search/articles?apikey=' + api_key + '&format=xml&&article_title=' + publication_name
                            resp = requests.get(request_url)
                            soup = BeautifulSoup(resp.content, from_encoding=resp.encoding)
                            for items in soup.findAll('publication_year'):
                                publication_year = items.text
                            for items in soup.findAll('citing_paper_count'):
                                cited_by = items.text
                            for items in soup.findAll('full_name'):
                                publication_authors += items.text
                                publication_authors += ', '
                            publication_authors = publication_authors[:-2]
                            publication_status = 1
                            author_id = i
                            publication_authors = publication_authors.replace("'", "''")
                            
                            # Add record to DB
                            sql_find_query = f"SELECT max(publicationId) from publications;"
                            read_cursor.execute(sql_find_query)
                            record = read_cursor.fetchall()
                            if record[0][0] is not None:
                                publication_id = record[0][0] + 1
                            else:
                                publication_id = 1
                            sql_insert_query = f"INSERT into publications (publicationId, name, year, venue, authorId, citedBy_Scholar, citedBy_ACM, citedBy_OpenAlex, status, createdDate, modifiedDate, createdBy, modifiedBy, citedBy_IEEE, comments, authors) values(%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW(), %s, %s, %s, %s, %s);"
                            write_cursor.execute(sql_insert_query, (publication_id, publication_name, publication_year, None, author_id, None, None, None, publication_status, 'system', 'system', cited_by, None, publication_authors))
                            connection.commit()
                            print(write_cursor.rowcount, "Record inserted successfully into table")  


    # Error Handling                    
    except mysql.connector.Error as e:
        print("Failed to insert record into table", e)
    finally:
        if connection.is_connected():
            read_cursor.close()
            write_cursor.close()
            connection.close()
            print("MySQL Connection is closed")

if __name__ == "__main__":    
    # Script scheduling 
    schedule.every().thursday.at('18:43').do(scrape_ieee)

    while True:
        schedule.run_pending()
        time.sleep(1)
