# 🔬 DermaAI — AI-Powered Skin Lesion Classification & Educational Assistant

> **AI for Healthcare | Computer Vision + Deep Learning + Generative AI**

**DermaAI** is an AI-powered skin-lesion classification and educational assistance platform that combines **Computer Vision, Deep Learning, Transfer Learning, and Generative AI** in a single web application.

The system uses an **EfficientNetB3-based transfer-learning model** trained on the **HAM10000 dermoscopic image dataset** to classify suitable dermoscopic skin-lesion images into seven categories. The predicted category and confidence score are then provided as context to **Google Gemini**, which generates understandable educational information and supports multilingual interaction.

> ⚠️ **Medical safety:** DermaAI is an educational/research prototype. It is **not a medical diagnostic system** and must not be used as a substitute for professional medical advice, diagnosis, or treatment.

---

## 🏆 Unstop — AI For Healthcare

### Problem Statement

**AI For Healthcare**

### Project Title

**DermaAI – AI-Powered Skin Lesion Classification & Educational Assistant**

### Project Description

DermaAI is an AI-powered skin-lesion classification and educational assistance platform designed to improve healthcare awareness and accessibility.

The system uses the **HAM10000** dermoscopic image dataset and an **EfficientNetB3-based transfer-learning model** to classify suitable dermoscopic skin-lesion images into seven categories:

1. Melanocytic Nevi
2. Melanoma
3. Benign Keratosis-like Lesions
4. Basal Cell Carcinoma
5. Actinic Keratoses / Intraepithelial Carcinoma
6. Vascular Lesions
7. Dermatofibroma

Uploaded images are preprocessed and analyzed by the trained deep-learning model to provide the most likely category and confidence score. The prediction is then passed to **Google Gemini** to generate understandable educational information about the predicted lesion and the importance of professional medical evaluation.

The application combines **image upload, AI classification, confidence analysis, Generative AI assistance, and multilingual interaction** in one web interface.

For reliable results, users should provide clear dermoscopic skin-lesion images similar to the training data. Blurry, unrelated, or out-of-distribution images may produce unreliable predictions.

The system is intended for **educational and early-awareness purposes** and does not replace professional medical diagnosis.

---

# ✨ Why DermaAI?

A conventional image-classification workflow ends with a class label. DermaAI extends that workflow with an educational Generative AI layer.

```text
Dermoscopic Image
       ↓
Image Preprocessing
       ↓
EfficientNetB3
       ↓
7-Class Prediction
       ↓
Confidence Analysis
       ↓
Google Gemini
       ↓
Educational Explanation
       ↓
Multilingual Interaction
```

### Core idea

**Deep Learning for Classification.**  
**Generative AI for Understanding.**  
**AI for Healthcare.**

---

# 🚀 Key Features

- 🧠 EfficientNetB3-based skin-lesion classification
- 🔬 Seven-class classification using HAM10000
- 🖼️ Dermoscopic image upload and preprocessing
- 📊 Prediction confidence visualization
- 🤖 Google Gemini educational assistant
- 🌐 English, Kannada, and Hindi interaction
- 💬 Follow-up educational questions
- ⚛️ React + Vite web interface
- ⚡ FastAPI backend
- 🔐 API-key protection through environment variables / deployment secrets
- ⚠️ Built-in medical safety messaging
- 📓 Training notebook included

---

# 🖥️ Application Preview

## 1. DermaAI Home

![DermaAI Home](assets/01-home.png)

The landing page introduces DermaAI and communicates its educational, non-diagnostic purpose.

## 2. Image Analyzer

![DermaAI Analyzer](assets/02-analyzer.png)

Users can upload a suitable dermoscopic image and start the AI analysis workflow.

```text
Image Intake
     ↓
Neural Inference
     ↓
Confidence Profile
     ↓
Educational Layer
```

## 3. AI Analysis Results

![DermaAI Results](assets/03-results.png)

The analysis interface presents the predicted category, confidence information, probability distribution, educational context, and clinical-awareness guidance.

A confidence value represents the model's prediction probability; it should not be interpreted as medical certainty.

## 4. System Profile

![DermaAI System Profile](assets/04-system-profile.png)

The system profile presents information about the model, dataset, supported languages, and application architecture.

---

# 🖼️ Raw Dermoscopic Image Reference

The following raw image is included as a visual reference for the lesion categories represented in the project.

![Raw Skin Lesion Samples](assets/raw-lesion-samples.png)

> **Note:** This image is included for project documentation and visual reference. It should not be interpreted as a diagnostic chart.

---

# 🗂️ Dataset — HAM10000

DermaAI uses the **HAM10000 (Human Against Machine with 10000 training images)** dermoscopic dataset.

The dataset contains **10,015 images** across seven categories and has a substantial class imbalance.

| Code | Category | Images |
|---|---|---:|
| `nv` | Melanocytic Nevi | 6,705 |
| `mel` | Melanoma | 1,113 |
| `bkl` | Benign Keratosis-like Lesions | 1,099 |
| `bcc` | Basal Cell Carcinoma | 514 |
| `akiec` | Actinic Keratoses / Intraepithelial Carcinoma | 327 |
| `vasc` | Vascular Lesions | 142 |
| `df` | Dermatofibroma | 115 |
| | **Total** | **10,015** |

### Why class imbalance matters

The number of samples differs substantially between classes. Therefore, class distribution, balancing strategy, validation, and per-class evaluation are important when developing and evaluating the classifier.

---

# 🧠 Deep Learning Model

## EfficientNetB3

The primary image-classification architecture is **EfficientNetB3**, using transfer learning followed by fine-tuning.

### Model pipeline

```text
Input Image
     ↓
Preprocessing
     ↓
EfficientNetB3
     ↓
Feature Extraction
     ↓
Fine-Tuning
     ↓
Classification Layer
     ↓
Softmax Probabilities
     ↓
Predicted Class
     ↓
Confidence Score
```

The trained model is stored at:

```text
model/best_skin_model_phase2.keras
```

> **Important:** DermaAI uses **EfficientNetB3**. It should not be described as “EfficientNet V3.”

---

# 🔬 Image Processing

Uploaded images are prepared before inference:

```text
Raw Image
   ↓
Image Loading
   ↓
Image Conversion
   ↓
Image Resizing
   ↓
Numerical Representation
   ↓
Model-Compatible Preprocessing
   ↓
EfficientNetB3
```

The classifier is intended for dermoscopic images that are reasonably similar to its training distribution.

### Recommended input

- Clear image
- Good illumination
- Lesion clearly visible
- Proper focus
- Minimal obstruction
- Dermoscopic appearance similar to the training data

### Potentially unreliable inputs

- Blurry images
- Very dark or overexposed images
- Heavily obstructed images
- Unrelated photographs
- Images significantly different from the training distribution

---

# ⚖️ Class Imbalance

HAM10000 is highly imbalanced:

```text
Melanocytic Nevi              6705
Melanoma                      1113
Benign Keratosis              1099
Basal Cell Carcinoma           514
Actinic Keratoses              327
Vascular Lesions               142
Dermatofibroma                 115
```

This distribution should be considered when interpreting overall performance because strong performance on majority classes can hide weaker performance on minority classes.

---

# 🏋️ Model Training Workflow

```text
HAM10000 Dataset
       ↓
Data Analysis
       ↓
Image Preprocessing
       ↓
Data Augmentation
       ↓
Class Balancing
       ↓
Train / Validation Split
       ↓
EfficientNetB3
       ↓
Transfer Learning
       ↓
Fine-Tuning
       ↓
Model Evaluation
       ↓
Best Model Selection
       ↓
Saved .keras Model
```

The training notebook included in the repository allows reviewers to inspect the training and evaluation workflow.

---

# 📊 Model Evaluation

Relevant evaluation metrics include:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion matrix
- Per-class performance

The confusion matrix is especially useful for identifying classes that are frequently confused.

> **Transparency:** This README does not invent or estimate performance numbers. Actual evaluation values should be taken directly from the training notebook.

---

# 🤖 Generative AI — Google Gemini

Google Gemini is used as the **educational assistant layer**, not as the primary image classifier.

### AI responsibility split

```text
Uploaded Image
      ↓
EfficientNetB3
      ↓
Primary Image Classification
      ↓
Prediction + Confidence
      ↓
Google Gemini
      ↓
Educational Explanation
      ↓
Multilingual / Follow-up Interaction
```

Gemini can provide:

- General educational information
- Explanation of the predicted category
- User-friendly descriptions
- Multilingual responses
- Answers to follow-up educational questions

The separation keeps image classification and educational generation as distinct components.

---

# 🌐 Multilingual Support

DermaAI supports educational interaction in:

- 🇬🇧 English
- 🇮🇳 Kannada
- 🇮🇳 Hindi

The multilingual layer is intended to make educational information more accessible to users who prefer regional languages.

---

# 🔄 System Architecture

```text
                         ┌─────────────────────┐
                         │     HAM10000        │
                         │   Dermoscopic Data  │
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │ Preprocessing +     │
                         │ Augmentation        │
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │    EfficientNetB3   │
                         │ Transfer Learning   │
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │ Prediction +        │
                         │ Confidence          │
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │    FastAPI Backend   │
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │    Google Gemini    │
                         │ Educational Layer   │
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │ React + Vite UI     │
                         └──────────┬──────────┘
                                    ↓
              ┌─────────────────────┼─────────────────────┐
              ↓                     ↓                     ↓
          English                Kannada                Hindi
                                    ↓
                         Follow-up Educational Q&A
```

---

# 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Programming | Python, TypeScript |
| Deep Learning | TensorFlow / Keras |
| Model | EfficientNetB3 |
| Learning | Transfer Learning + Fine-Tuning |
| Dataset | HAM10000 |
| Image Processing | Pillow, NumPy |
| Backend API | FastAPI |
| ASGI Server | Uvicorn |
| Frontend | React |
| Frontend Tooling | Vite |
| Generative AI | Google Gemini API |
| Environment | python-dotenv / environment secrets |
| Model Format | `.keras` |
| Version Control | Git / GitHub |

---

# 📁 Project Structure

```text
DermaAI/
│
├── AI_Skin_Disease_Consultant.ipynb
├── PROJECT_MANIFEST.txt
├── README.md
├── app.py
├── requirements.txt
│
├── model/
│   └── best_skin_model_phase2.keras
│
├── backend/
│   ├── __init__.py
│   ├── gemini_service.py
│   ├── main.py
│   ├── model_service.py
│   └── requirements.txt
│
├── frontend/
│   ├── .env.example
│   ├── README.md
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   ├── main.tsx
│   │   ├── styles.css
│   │   └── types.ts
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docs/
│   └── PROJECT_NOTES.md
│
└── scripts/
    ├── run_backend.sh
    └── run_frontend.sh
```

### Important files

**`frontend/src/App.tsx`**  
Main React interface.

**`frontend/src/api.ts`**  
Frontend API communication layer.

**`backend/main.py`**  
FastAPI backend entry point and API routes.

**`backend/model_service.py`**  
Model loading and inference service.

**`backend/gemini_service.py`**  
Gemini educational-assistance integration.

**`model/best_skin_model_phase2.keras`**  
Trained EfficientNetB3-based classification model.

**`AI_Skin_Disease_Consultant.ipynb`**  
Training and model-development notebook.

**`requirements.txt`**  
Root-level Python dependencies.

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/na-srinivasa/DermaAI.git
cd DermaAI
```

## 2. Backend setup

Create and activate a Python virtual environment:

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

Install the backend dependencies:

```bash
pip install -r backend/requirements.txt
```

If the root `requirements.txt` is the intended environment file for the complete application, use:

```bash
pip install -r requirements.txt
```

## 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
```

---

# 🔐 Environment Variables

Do **not** commit API keys.

Configure the Gemini API key using the environment configuration expected by the backend.

Example:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

The repository includes example environment files so that secret values can be configured locally without committing them.

> Never place a real API key directly in source code or commit it to GitHub.

---

# ▶️ Run DermaAI Locally

DermaAI uses a **FastAPI backend** and a **React + Vite frontend**.

## Start the backend

From the project root:

```bash
uvicorn backend.main:app --reload
```

## Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

The Vite terminal will display the local frontend URL.

### Using the provided scripts

The repository also contains:

```text
scripts/run_backend.sh
scripts/run_frontend.sh
```

These can be used according to their implementation to simplify local startup.

---

# 🔗 Application API

The backend exposes API functionality for:

```text
Health Check
     ↓
Image Upload
     ↓
Model Inference
     ↓
Prediction + Confidence
     ↓
Educational AI Assistance
```

The exact API routes and schemas are implemented in:

```text
backend/main.py
```

---

# ☁️ Deployment

The final deployment should use infrastructure compatible with the **React frontend + FastAPI backend + TensorFlow model + Gemini API** architecture.

A production deployment should provide:

- React frontend hosting
- FastAPI backend hosting
- Secure environment variables
- Access to the trained `.keras` model
- HTTPS
- Appropriate CORS configuration
- Secure Gemini API credentials

> Do not describe this project as a Streamlit deployment. The current application architecture is **React + Vite + FastAPI**.

---

# 🔒 Privacy & Security

DermaAI is designed as an educational prototype.

Security considerations include:

- API credentials stored outside source code
- Environment variables for Gemini credentials
- No API key exposed in the frontend
- Medical safety messaging
- Separation of frontend and backend responsibilities

Production healthcare deployment would require stronger privacy, authentication, encryption, consent, audit controls, secure data retention policies, and applicable regulatory compliance.

---

# ⚠️ Limitations

### Dataset Dependency

The model learns from HAM10000 and may perform differently on images outside its training distribution.

### Class Imbalance

The dataset contains substantially different numbers of samples across classes.

### Image Quality

Poor-quality, blurry, dark, overexposed, or obstructed images may reduce prediction reliability.

### Visual Similarity

Different lesion categories can have visually similar characteristics, which may result in incorrect classification.

### Confidence Limitations

A high confidence score does not guarantee that a prediction is correct or medically accurate.

### Clinical Validation

DermaAI is an educational/research prototype and is not presented as a clinically validated diagnostic system.

---

# 🏥 Real-World Impact

Potential applications of the concept include:

- Healthcare education
- Skin-health awareness
- AI-assisted research
- Multilingual health information
- Educational support for students
- AI-assisted healthcare workflows
- Telehealth-related research

Real-world clinical deployment would require extensive validation, healthcare oversight, privacy protection, and applicable regulatory compliance.

---

# 🚀 Future Scope

Possible improvements include:

- Larger and more diverse datasets
- External validation datasets
- Improved class-imbalance handling
- Probability calibration
- Out-of-distribution detection
- Explainable AI using Grad-CAM
- Additional Indian languages
- Mobile application
- Doctor-oriented dashboard
- Secure healthcare data handling
- Telemedicine integration
- Clinical validation
- More advanced AI-assisted healthcare workflows

---

# 💡 Project Innovation

### Conventional workflow

```text
Image
  ↓
Classification
  ↓
Result
```

### DermaAI workflow

```text
Image
  ↓
Deep Learning Classification
  ↓
Prediction + Confidence
  ↓
Generative AI
  ↓
Educational Explanation
  ↓
Multilingual Interaction
  ↓
Follow-up Questions
```

The project combines **specialized visual classification** with **Generative AI-based educational assistance**, making the prediction more understandable to users.

---

# 🏆 Hackathon Relevance

DermaAI demonstrates an end-to-end AI healthcare workflow:

```text
Healthcare Problem
       ↓
HAM10000 Dataset
       ↓
Data Analysis
       ↓
Image Processing
       ↓
Data Augmentation
       ↓
Class Balancing
       ↓
Deep Learning
       ↓
Transfer Learning
       ↓
Model Training
       ↓
Model Evaluation
       ↓
Model Prediction
       ↓
FastAPI Backend
       ↓
Generative AI
       ↓
Multilingual Assistance
       ↓
React Web Application
       ↓
Healthcare Awareness
```

This aligns the project with the **AI For Healthcare** track.

---

# 🔗 Project Links

### 💻 GitHub Repository

**na-srinivasa/DermaAI**

https://github.com/na-srinivasa/DermaAI

### 🚀 Live Demo

**DermaAI Live Demo**

> Add the actual deployed URL here before the final Unstop submission.

### 📓 Training Notebook

`AI_Skin_Disease_Consultant.ipynb`

---

# 👥 Project Information

| Field | Details |
|---|---|
| Project | DermaAI |
| Track | AI For Healthcare |
| Domain | Healthcare + Artificial Intelligence |
| Focus | Skin Lesion Classification + Generative AI |
| Model | EfficientNetB3 |
| Dataset | HAM10000 |
| Backend | FastAPI |
| Frontend | React + Vite |
| Generative AI | Google Gemini |

---

# ⚠️ Medical Safety Disclaimer

DermaAI is an **educational and research prototype**.

It is **not a medical diagnostic tool**, and its predictions should not be used to make medical decisions.

The system may produce incorrect predictions, particularly for images that differ from its training data.

Users should consult a qualified healthcare professional or dermatologist for diagnosis, treatment, or concerns regarding a skin lesion.

The project demonstrates the application of **Deep Learning, Computer Vision, Transfer Learning, and Generative AI in healthcare**.

---

## 🔬 DermaAI

> **Deep Learning for Classification.**  
> **Generative AI for Understanding.**  
> **AI for Healthcare. 🚀**
