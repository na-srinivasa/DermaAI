from io import BytesIO
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

from .model_service import SkinModel
from .gemini_service import explain, answer

app = FastAPI(
    title="DermaAI API",
    version="1.0.0",
    description="Educational skin-lesion classification API."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SkinModel()


class ExplainRequest(BaseModel):
    predicted_class: str
    full_name: str
    confidence: float
    language: str = "English"


class AskRequest(ExplainRequest):
    question: str


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model.model is not None,
        "model_path": model.model_path,
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image.")

    try:
        data = await file.read()
        image = Image.open(BytesIO(data)).convert("RGB")
        code, name, confidence, probabilities = model.predict(image)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Could not analyze image: {exc}")

    return {
        "predicted_class": code,
        "full_name": name,
        "confidence": confidence,
        "confidence_percent": confidence * 100,
        "probabilities": probabilities,
        "low_confidence": confidence < 0.60,
    }


@app.post("/explain")
def explain_result(payload: ExplainRequest):
    return {
        "explanation": explain(
            payload.predicted_class,
            payload.full_name,
            payload.confidence,
            payload.language,
        )
    }


@app.post("/ask")
def ask(payload: AskRequest):
    return {
        "answer": answer(
            payload.question,
            payload.predicted_class,
            payload.full_name,
            payload.confidence,
            payload.language,
        )
    }
