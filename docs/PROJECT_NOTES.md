Source notebook: AI_Skin_Disease_Consultant.ipynb
Seven classes: akiec, bcc, bkl, df, mel, nv, vasc.
Notebook training cells use EfficientNetB0 at 224x224; the deployed project loader auto-detects the actual Keras model input shape so it can also support the project's EfficientNetB3 phase-2 model.
