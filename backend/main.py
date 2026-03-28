from fastapi import FastAPI, UploadFile, File, HTTPException
from pinecone import Pinecone
from google import genai
import os

# Grab API keys from Hugging Face Secrets
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")

# Initialize AI Clients
ai_client = genai.Client(api_key=GEMINI_API_KEY)
pc = Pinecone(api_key=PINECONE_API_KEY)

# Connect to your specific Pinecone index
# (Change "medical-vectors" to whatever you named your index)
index = pc.Index("medical-matchmaker") 

app = FastAPI()

@app.post("/process")
async def process_data(
    model_file: UploadFile = File(...), 
    media_file: UploadFile = File(...)
):
    print(f"📥 Received files: {model_file.filename}, {media_file.filename}")

    try:
        # 1. Read the media file into memory (bytes)
        media_bytes = await media_file.read()
        
        # 2. Vectorize using Gemini
        print(" Vectorizing media with Gemini...")
        response = ai_client.models.embed_content(
            model='text-embedding-004', 
            # We pass the filename dynamically so the embedding changes per file!
            contents=f"Extract patient features from this uploaded medical media: {media_file.filename}"
        )
        media_vector = response.embeddings[0].values
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini embedding failed: {str(e)}")

    try:
        # 3. Query Pinecone for the closest historical matches
        print("Querying Pinecone Database...")
        search_results = index.query(
            vector=media_vector,
            top_k=5,
            include_metadata=True
        )
        
        # 4. Extract the metadata (the actual patient data/context)
        matches = [match["metadata"] for match in search_results.get("matches", [])]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pinecone query failed: {str(e)}")

    # 5. Return the payload back to the frontend
    return {
        "status": "success",
        "message": "Data embedded and historical context retrieved.",
        "received_model": model_file.filename,
        "pinecone_matches": matches
    }