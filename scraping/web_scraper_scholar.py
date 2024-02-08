# Import required libraries 
import mysql.connector
from mysql.connector import Error
from scholarly import ProxyGenerator, scholarly
import schedule
import random
import numpy as np
import time

def scrape_scholar():
    try:

        # Connect to DB 
        connection = mysql.connector.connect(host='database-1.cz0pyvn7hnd2.us-east-2.rds.amazonaws.com', database = 'ai4ee_database',user = 'admin', password ='AI4EE_Jinjun_#cse611') #INSERT CREDS
        
        read_count_cursor = connection.cursor()
        sql_count_query = f'SELECT max(id) from members;'
        read_count_cursor.execute(sql_count_query)
        count_record = read_count_cursor.fetchall()
        max_user_id = 0             
        if count_record[0][0] is not None:
            max_user_id = count_record[0][0] + 1
        else:
            max_user_id = 1

        # Fetch first name, last name of each user 
        for i in range(1, max_user_id):
            sql_select_query = f'SELECT firstName, lastName from members where id = {i};'
            read_cursor = connection.cursor()
            read_cursor.execute(sql_select_query)
            records = read_cursor.fetchall()
            write_cursor = connection.cursor()

            # Search on scholarly with the given name to fetch further details 
            for row in records:
                first_name = row[0].strip()
                last_name = row[1].strip()
                author_name = first_name + ' ' + last_name
                search_query = scholarly.search_author(author_name)
                first_author_result = next(search_query)
                author = scholarly.fill(first_author_result)
                publication_titles = author['publications']
                for pub in publication_titles:
                    try:
                        title = pub['bib']['title']
                        publication_name = title
                        publication_name = publication_name.replace("'", "''")
                        publication_year = pub['bib']['pub_year']
                        publication_venue = pub['bib']['citation']
                        publication_venue = publication_venue.replace("'", "''")
                        author_id = i
                        cited_by = pub['num_citations']
                        publication_status = 1
                        
                        # Check if record exists in DB, if it exists, update citation count 
                        sql_search_query = f"SELECT * from publications where name = '{publication_name}';"
                        read_cursor.execute(sql_search_query)
                        records = read_cursor.fetchall()
                        if(read_cursor.rowcount > 0):
                            sql_update_query = f"UPDATE publications SET citedBy_Scholar = {cited_by}, modifiedDate = NOW() where name = '{publication_name}';"
                            print(sql_update_query)
                            write_cursor.execute(sql_update_query)
                            connection.commit()
                            print("Record updated successfully")
                        
                        # If record does not exist, insert new record 
                        else:
                            sql_find_query = f"SELECT max(publicationId) from publications;"
                            read_cursor.execute(sql_find_query)
                            record = read_cursor.fetchall()
                            if record[0][0] is not None:
                                publication_id = record[0][0] + 1
                            else:
                                publication_id = 1
                            sql_insert_query = f"INSERT into publications (publicationId, name, year, venue, authorId, citedBy_Scholar, citedBy_ACM, citedBy_OpenAlex, status, createdDate, modifiedDate, createdBy, modifiedBy, citedBy_IEEE, comments, authors) values({publication_id}, '{publication_name}', {publication_year}, '{publication_venue}', {author_id}, {cited_by}, NULL, NULL, {publication_status}, NOW(), NOW(), 'system', 'system', NULL, NULL, NULL);"
                            print(sql_insert_query)
                            write_cursor.execute(sql_insert_query)
                            connection.commit()
                            print(write_cursor.rowcount, "Record inserted successfully into table")
                    
                    # Error handling 
                    except KeyError as e:
                        continue
                    except mysql.connector.Error as e:
                        print("Failed to insert record into table", e)
                        continue

    finally:
        if connection.is_connected():
            read_cursor.close()
            write_cursor.close()
            connection.close()
            print("MySQL Connection is closed")

if __name__ == "__main__":    
    # Scheduling every friday to execute 
    schedule.every().friday.at('10:00').do(scrape_scholar)

    while True:
        schedule.run_pending()
        time.sleep(1)
