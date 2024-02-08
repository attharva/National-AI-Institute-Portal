# Import required libraries
import mysql.connector
from mysql.connector import Error
import numpy as np
from bs4 import BeautifulSoup
import schedule
import requests
import time

def scrape_acm():
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

        # Fetch ACM Profile URL if it exists in DB
        for i in range(1, max_user_id):
            sql_select_query = f'SELECT acmUrl from members where id = {i};'
            read_cursor = connection.cursor()
            read_cursor.execute(sql_select_query)
            records = read_cursor.fetchall()
            write_cursor = connection.cursor()

            # Get all publications for a user 
            for row in records:
                acm_url = row[0]
                if(acm_url != None and acm_url != '' and acm_url.strip() != ''):
                    acm_url = acm_url.strip()
                    search_url = acm_url + '/publications?Role=author&pageSize=1000'
                    resp = requests.get(search_url, headers = HEADERS)
                    soup = BeautifulSoup(resp.content, from_encoding=resp.encoding)
                    
                    # Find link and title to the paper, store it 
                    links = {}
                    if soup.findAll('a', href=True):
                        for link in soup.findAll('a', href=True):
                            if link is not None and link['href'].startswith("/doi/") and not link['href'].startswith("/doi/epdf"):
                                links[link['href']] = link.text
                    
                    # Fetch further details from links 
                    for k, v in links.items():
                        publication_name = v
                        resp = requests.get('https://dl.acm.org'+k, headers = HEADERS)
                        soup = BeautifulSoup(resp.content, from_encoding=resp.encoding)
                        publication_year = ''
                        cited_by = ''
                        publication_venue = ''
                        publication_authors = ''
                        if soup is not None:
                            if soup.find('span', {'class' : 'CitationCoverDate'}):
                                for link in soup.find('span', {'class' : 'CitationCoverDate'}):
                                    publication_year = link.text[-4:]
                                    publication_status = 1
                                    author_id = i
                                    citation = soup.find('span', {'class' : 'citation'})
                                    if citation:
                                        for span in citation.find('span'):
                                            cited_by = span.text
                                    if soup.find('span', {'class' : 'epub-section__title'}):
                                        for link in soup.find('span', {'class' : 'epub-section__title'}):
                                            publication_venue = link.text 
                                    if soup.find_all('span', {'class' : 'loa__author-name'}):
                                        for link in soup.find_all('span', {'class' : 'loa__author-name'}):
                                                name = link.text
                                                publication_authors += name
                                                publication_authors += ', '
                                    publication_authors = publication_authors[:-2]
                                    
                                    # Replace string characters 
                                    publication_name = publication_name.replace("'", "''")
                                    publication_venue = publication_venue.replace("'", "''")

                                    # Check if title exists in DB, if not, insert 
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
                                        sql_insert_query = f"INSERT into publications (publicationId, name, year, venue, authorId, citedBy_Scholar, citedBy_ACM, citedBy_OpenAlex, status, createdDate, modifiedDate, createdBy, modifiedBy, citedBy_IEEE, comments, authors) values({publication_id}, '{publication_name}', {publication_year}, '{publication_venue}', {author_id}, NULL, {cited_by}, NULL, {publication_status}, NOW(), NOW(), 'system', 'system', NULL, NULL, '{publication_authors}');"
                                        print(sql_insert_query)
                                        write_cursor.execute(sql_insert_query)
                                        connection.commit()
                                        print(write_cursor.rowcount, "Record inserted successfully into table")
                                    
                                    # If title exists, update citation count
                                    else:
                                        if cited_by is not None:
                                            sql_update_query = f"UPDATE publications SET citedBy_ACM = {cited_by}, modifiedDate = NOW() where name = '{publication_name}';"
                                            print(sql_update_query)
                                            write_cursor.execute(sql_update_query)
                                            connection.commit()
                                            print("Record updated successfully")
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
    # Scheduling to run every wednesday 
    schedule.every().wednesday.at('10:00').do(scrape_acm)

    while True:
        schedule.run_pending()
        time.sleep(1)
