from fastapi import FastAPI
from env import * 
from infrastructure.minio import *
from image_processing.resolution import *
from image_processing.handler import *

app = FastAPI()
image_processing_handler = ImageProcessingHandler()

@app.on_event("startup")
async def startup_event():
    image_processing_handler.start()
    
@app.on_event("shutdown")
async def shutdown_event():
    image_processing_handler.stop()
    
@app.get("/")
async def root():
    return {"message": "Hello World"}

# uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=FAST_API_APP_PORT)
