# **Kryptos AI : Medical Matchmaker Backend**

Welcome to the **Kryptos AI** , the intelligence engine behind the Medical Matchmaker ecosystem.  
This repository houses the Python FastAPI backend, which acts as a highly secure, isolated microservice responsible for processing medical scan data, generating AI-driven vector embeddings, and performing semantic search across hospital databases.

## **The Idea: Medical Semantic Search**

**The Problem:** Traditional hospital databases rely on exact keyword matches. If a doctor searches for "fractured tibia," a database might miss a case file labeled "severe lower leg bone break."  
**The Solution:** The Kryptos AI Enclave replaces keyword search with **Semantic Vector Search**. We process incoming medical data using Google's state-of-the-art embedding models. This converts complex medical context into mathematical vectors. When a doctor searches for a case, our backend instantly finds mathematically similar historical cases, regardless of the exact phrasing used by the original radiologist.

## **System Architecture**

Kryptos is built on a modern, 3-tier microservice architecture:

1. **Next.js (Frontend):** The doctor/hospital user interface.  
2. **Spring Boot (Gateway):** Handles user authentication, business logic, and routing.  
3. **FastAPI (The AI Enclave):** This repository. It is deliberately isolated from the main application to handle heavy AI computations and vector database interactions securely over HTTPS.

## **Backend Tech Stack**

* **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Lightning-fast, asynchronous Python web framework).  
* **AI Model:** Google Gemini (gemini-embedding-001).  
* **Vector Database:** [Pinecone](https://www.pinecone.io/) (Serverless vector storage).  
* **Deployment:** Google Cloud Run (Serverless, scale-to-zero container hosting).

## **Core Features & Workflow**

### **1\. Data Ingestion & Vectorization (/ai/ingest)**

When a hospital uploads a new scan or case file, the Spring Boot gateway forwards the raw text to this enclave.

* **Contextualization:** The backend formats the raw data into a semantic prompt.  
* **Embedding:** We pass the data to gemini-embedding-001. We utilize Google's dimensional reduction configuration EmbedContentConfig(output\_dimensionality=768) to optimize the vectors for high-speed retrieval.  
* **Storage:** The 768-dimension vector is upserted into our Pinecone index alongside vital metadata (Hospital Name, Scan Type, Department) for filtering.

### **2\. Semantic Case Search (/ai/search)**

When a doctor queries the system, the enclave vectorizes the search query using the exact same Gemini model.

* It queries the Pinecone database using **Cosine Similarity** to find the Top 3 mathematically closest medical cases.  
* It formats the match scores and metadata, returning actionable insights instantly to the Next.js frontend.

## **API Contract**

### **POST /ai/ingest**

Stores new medical data in the vector database.  
**Request Body:**
`
{  
  "content": "Patient presents with severe trauma to the lower left extremity...",  
  "hospitalName": "St. Jude Medical Center",  
  "dataType": "MRI Scan Notes"  
}
`
### **POST /ai/search**

Retrieves similar historical cases based on natural language queries.  
**Request Body:**
`
{  
  "query": "complications involving lower leg bone breaks"  
}
`
**Response:**

`
\[  
  {  
    "id": "CASE-A1B2C3D4",  
    "matchScore": "92.4%",  
    "hospital": "St. Jude Medical Center",  
    "scanType": "MRI Scan Notes",  
    "department": "Radiology",  
    "lastAccessed": "2026-03-29T10:00:00Z"  
  }  
\]
`

## **Local Setup & Development**

To run the Kryptos Enclave locally during development:

1. **Clone the repository:**  
`
   git clone \<your-repo-url\>  
   cd kryptos-enclave
`
2. **Install dependencies:** 
` 
   pip install \-r requirements.txt
`
3. **Set Environment Variables:**  
   Create a .env file or export the following variables in your terminal:  
   `
   export GEMINI\_API\_KEY="your\_google\_ai\_key"  
   export PINECONE\_API\_KEY="your\_pinecone\_key"
   `

4. **Run the Server:**  
`
   uvicorn main:app \--host 0.0.0.0 \--port 8000 \--reload
`

## **Deployment**

This backend is containerized via Dockerfile and deployed on **Google Cloud Run**.

* It utilizes a serverless architecture, meaning it scales to zero when idle to conserve resources and boots instantly upon receiving a request from the Spring Boot gateway.  
* Deployment is handled automatically via Cloud Build integration with the main branch.
