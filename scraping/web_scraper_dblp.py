# Import required libraries 
import mysql.connector
from mysql.connector import Error
import numpy as np
from bs4 import BeautifulSoup
import schedule
import requests
import time

def scrape_dblp():
    try:

        # Connect to DB
        connection = mysql.connector.connect(host='database-1.cz0pyvn7hnd2.us-east-2.rds.amazonaws.com', database = 'ai4ee_database',user = 'admin', password ='AI4EE_Jinjun_#cse611') #INSERT CREDS
        HEADERS = {'User-Agent': 'Mozilla/5.0'}
        count = 0

        read_count_cursor = connection.cursor()
        sql_count_query = f'SELECT max(id) from members;'
        read_count_cursor.execute(sql_count_query)
        count_record = read_count_cursor.fetchall()
        max_user_id = 0             
        if count_record[0][0] is not None:
            max_user_id = count_record[0][0] + 1
        else:
            max_user_id = 1

        # Fetch profile URL for the user 
        for i in range(1, max_user_id):
            sql_select_query = f'SELECT dblpUrl from members where id = {i};'
            read_cursor = connection.cursor()
            read_cursor.execute(sql_select_query)
            records = read_cursor.fetchall()
            write_cursor = connection.cursor()

            for row in records:
                dblp_url = row[0]
                if(dblp_url != None and dblp_url != '' and dblp_url.strip() != ''):
                    dblp_url = dblp_url.strip()
                    search_url = dblp_url
                    resp = requests.get(search_url, headers = HEADERS)
                    soup = BeautifulSoup(resp.content, from_encoding=resp.encoding)
                    
                    # Get publication links for the user's profile 
                    links = []
                    if soup.findAll('a', href=True):
                        for link in soup.findAll('a', href=True):
                            if link['href'].startswith("https://doi") and link['href'] not in links:
                                links.append(link['href']) 
                    
                    # Get details of the publication from the link 
                    for link in links:
                        resp = requests.get(link)
                        soup = BeautifulSoup(resp.content, from_encoding=resp.encoding)
                        if soup.find('title'):
                            for link in soup.find('title'):
                                publication_name = link.text

                            # Skip fetching details if link does not open 
                            if publication_name == 'Redirecting' or publication_name == 'Request Rejected' or publication_name == 'Just a moment...' or publication_name == '403 Forbidden':
                                continue

                            # Formatting publicstion title
                            if(publication_name.find('[') != -1):
                                start = publication_name.find('[')
                                end = publication_name.find(']')
                                substr = publication_name[start:end+2]
                                publication_name = publication_name.replace(substr, '')
                            if(publication_name.find('|') != -1):
                                start = publication_name.find('|')
                                substr = publication_name[start-1:]
                                publication_name = publication_name.replace(substr, '')
                            publication_name = publication_name.replace("'", "''")
                            
                            publication_year = ''
                            publication_status = 1
                            publication_authors = ''
                            author_id = i
                            if (soup.find('pre', {'class' : 'bg-light border p-2'})):
                                for link in soup.find('pre', {'class' : 'bg-light border p-2'}):
                                    publication_year = link.text[link.text.find('year = "') + 8:link.text.find('year = "') + 12]
                            if (soup.findAll('a', href = True)):
                                for link in soup.findAll('a', href=True):
                                    if link['href'].startswith("/people/"):
                                        publication_authors += link.text
                                        publication_authors += ', '
                            if publication_authors != '':
                                publication_authors = publication_authors[:-2]
                            
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
                                if publication_authors == '':
                                    publication_authors = None
                                if publication_year == '':
                                    publication_year = None
                                sql_insert_query = f"INSERT into publications (publicationId, name, year, venue, authorId, citedBy_Scholar, citedBy_ACM, citedBy_OpenAlex, status, createdDate, modifiedDate, createdBy, modifiedBy, citedBy_IEEE, comments, authors) values(%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW(), %s, %s, %s, %s, %s);"
                                print(sql_insert_query)
                                write_cursor.execute(sql_insert_query, (publication_id, publication_name, publication_year, None, author_id, None, None, None, publication_status, 'system', 'system', None, None, publication_authors))
                                connection.commit()
                                print(write_cursor.rowcount, "Record inserted successfully into table")
                            else:
                                count += 1
                                print(f"Record {count} exists, skip")
                        time.sleep(np.random.randint(10, 20))

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
    # Scheduling every monday to execute 
    schedule.every().monday.at('10:00').do(scrape_dblp)

    while True:
        schedule.run_pending()
        time.sleep(1)