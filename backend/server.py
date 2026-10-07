import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from database import client  # noqa: E402
from routes.chat import router as chat_router  # noqa: E402
from routes.leads import router as leads_router  # noqa: E402

app = FastAPI(title="CA Yogesh Trivedi — API")
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "CA Yogesh Trivedi API", "status": "ok"}


api_router.include_router(chat_router)
api_router.include_router(leads_router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
