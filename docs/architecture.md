# System Architecture – Job Importer

## Overview
The Job Importer system automatically fetches job feeds from external sources (like url), processes them in the background using Redis + BullMQ, and stores the results in MongoDB.  

The admin dashboard allows triggering imports and viewing import logs in real-time.

---

## Components

### 1. Frontend (Next.js)
- Located in `/client`
- Provides a simple admin UI:
  - Enter a feed URL to start import
  - View import logs (total jobs, new jobs, updates, failures)
- Uses SWR for live data refresh.

### 2. Backend (Node.js + Express)
- Located in `/server`
- REST APIs:
  - `POST /api/import` → Start feed import
  - `GET /api/import/get_import_data` → Fetch import logs
    - `GET /api/jobs/get_jobs` → Fetch jobs 
      
- Handles job processing via BullMQ workers.

### 3. Queue (Redis + BullMQ)
- Manages background job processing (fetching/parsing/saving job data)
- Ensures scalability and reliability.

### 4. Database (MongoDB)
- Collections:
  - Store the jon and import data
  - fetch import data from db

---

## Workflow Diagram
steps and process of the project 
1- create the post api for import the data and store import data in db
2- add the import data store in redis and use the bullMq for add redis data in queue
3- worker is read the queue data from redis
4-store the  data in mongodb database
5- create the admin using next.js
6- enput the url and import the data. 

