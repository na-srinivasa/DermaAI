from pathlib import Path
from typing import Dict, Tuple
import numpy as np
from PIL import Image

MODEL_CANDIDATES = [
    Path(__file__).resolve().parents[1] / "best_skin_model_phase2.keras",
    Path(__file__).resolve().parents[1] / "best_skin_model.keras",
    Path(__file__).resolve().parents[1] / "model" / "best_skin_model_phase2.keras",
    Path(__file__).resolve().parents[1] / "model" / "best_skin_model.keras",
]

CLASS_NAMES = {
    "akiec": "Actinic Keratoses / Intraepithelial Carcinoma",
    "bcc": "Basal Cell Carcinoma",
    "bkl": "Benign Keratosis-like Lesions",
    "df": "Dermatofibroma",
    "mel": "Melanoma",
    "nv": "Melanocytic Nevi",
    "vasc": "Vascular Lesions",
}

# Keras LabelEncoder ordering used by the supplied notebook:
# ['akiec', 'bcc', 'bkl', 'df', 'mel', 'nv', 'vasc']
LABEL_ORDER = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]


class SkinModel:
    def __init__(self):
        self.model = None
        self.model_path = None
        self.input_size = 300

    def load(self):
        if self.model is not None:
            return
        model_path = next((p for p in MODEL_CANDIDATES if p.exists()), None)
        if model_path is None:
            raise FileNotFoundError(
                "No Keras model found. Add best_skin_model_phase2.keras "
                "or best_skin_model.keras to the project root/model folder."
            )

        import tensorflow as tf
        self.model = tf.keras.models.load_model(model_path, compile=False)
        self.model_path = str(model_path)

        shape = self.model.input_shape
        if isinstance(shape, list):
            shape = shape[0]
        if len(shape) >= 3 and shape[1] and shape[2]:
            self.input_size = int(shape[1])

    def predict(self, image: Image.Image) -> Tuple[str, str, float, Dict[str, float]]:
        self.load()
        image = image.convert("RGB").resize((self.input_size, self.input_size))
        arr = np.asarray(image, dtype=np.float32)

        # EfficientNet Keras models commonly include their own preprocessing.
        # The original project/notebook uses raw image arrays with EfficientNet.
        arr = np.expand_dims(arr, axis=0)

        probs = self.model.predict(arr, verbose=0)[0]
        probs = np.asarray(probs, dtype=np.float32)

        if len(probs) != 7:
            raise ValueError(f"Expected 7 output classes, received {len(probs)}.")

        probs = probs / max(float(probs.sum()), 1e-8)
        order = np.argsort(probs)[::-1]
        best = int(order[0])
        code = LABEL_ORDER[best]
        confidence = float(probs[best])

        probability_map = {
            LABEL_ORDER[i]: float(probs[i])
            for i in range(7)
        }
        return code, CLASS_NAMES[code], confidence, probability_map
