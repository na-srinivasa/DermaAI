import os
from io import BytesIO
from pathlib import Path

import numpy as np
import streamlit as st
from PIL import Image

st.set_page_config(
    page_title="DermaAI",
    page_icon="🧬",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Reuse the same model/Gemini services as the API.
from backend.model_service import SkinModel, CLASS_NAMES
from backend.gemini_service import explain

MODEL = SkinModel()

st.markdown("""
<style>
[data-testid="stAppViewContainer"] {
    background:
      radial-gradient(circle at 10% 10%, rgba(37,211,190,.10), transparent 30%),
      radial-gradient(circle at 90% 15%, rgba(124,92,255,.12), transparent 32%),
      #071016;
    color: #eef7f5;
}
.block-container { max-width: 1380px; padding-top: 2rem; }
.glass {
    background: rgba(15, 29, 36, .72);
    border: 1px solid rgba(120, 230, 216, .16);
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 20px 60px rgba(0,0,0,.25);
}
.hero {
    padding: 34px;
    border-radius: 30px;
    background: linear-gradient(135deg, rgba(24,52,57,.82), rgba(18,25,43,.76));
    border: 1px solid rgba(104,232,211,.16);
}
.metric {
    font-size: 2rem;
    font-weight: 800;
}
.small { color: #91aaa8; font-size: .9rem; }
</style>
""", unsafe_allow_html=True)

st.markdown("""
<div class="hero">
  <div class="small">DERMAAI • AI SKIN LESION EDUCATION</div>
  <h1>See the signal. Understand the context.</h1>
  <p class="small">
  Upload a skin-lesion image to view the model's seven-class probability profile
  and an educational explanation. This is a research/education prototype, not a diagnosis.
  </p>
</div>
""", unsafe_allow_html=True)

left, right = st.columns([1.05, 1.35], gap="large")

with left:
    st.markdown('<div class="glass">', unsafe_allow_html=True)
    uploaded = st.file_uploader("Upload lesion image", type=["jpg", "jpeg", "png"])
    language = st.selectbox("Explanation language", ["English", "Kannada", "Hindi"])
    analyze = st.button("Analyze image", type="primary", use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

if uploaded and analyze:
    image = Image.open(BytesIO(uploaded.getvalue())).convert("RGB")
    try:
        code, name, confidence, probs = MODEL.predict(image)
    except Exception as exc:
        st.error(str(exc))
        st.stop()

    with right:
        st.markdown('<div class="glass">', unsafe_allow_html=True)
        c1, c2 = st.columns(2)
        with c1:
            st.image(image, caption="Uploaded image", use_container_width=True)
        with c2:
            st.markdown('<div class="small">TOP MODEL OUTPUT</div>', unsafe_allow_html=True)
            st.markdown(f'<div class="metric">{confidence:.1%}</div>', unsafe_allow_html=True)
            st.markdown(f"**{name}**")
            if confidence < 0.60:
                st.warning("Low-confidence result — do not rely on this output.")
            else:
                st.info("Model output only; clinical assessment is still required.")
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("### Probability profile")
    rows = [
        {"Class": CLASS_NAMES[k], "Probability": round(v * 100, 2)}
        for k, v in sorted(probs.items(), key=lambda x: x[1], reverse=True)
    ]
    st.dataframe(rows, use_container_width=True, hide_index=True)

    st.markdown("### Educational explanation")
    with st.spinner("Generating educational context…"):
        text = explain(code, name, confidence, language)
    st.markdown(f'<div class="glass">{text}</div>', unsafe_allow_html=True)

st.markdown("""
<div class="glass" style="margin-top:24px">
<b>Safety note</b><br>
DermaAI provides educational information and model probabilities. It cannot confirm
a skin disease, rule out cancer, or prescribe treatment. Seek a qualified dermatologist
for diagnosis, especially for lesions that change, bleed, hurt, persist, or concern you.
</div>
""", unsafe_allow_html=True)
