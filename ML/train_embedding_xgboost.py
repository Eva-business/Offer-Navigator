import pandas as pd
import joblib
import numpy as np

from sentence_transformers import SentenceTransformer
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor

df = pd.read_csv("resume_data.csv")
df.columns = df.columns.str.replace("\ufeff", "", regex=False).str.strip()

text_columns = [
    "skills",
    "degree_names",
    "major_field_of_studies",
    "languages",
    "certification_skills",
    "responsibilities",
    "career_objective",
    "job_position_name",
    "educationaL_requirements",
    "experiencere_requirement",
    "age_requirement",
    "responsibilities.1",
    "skills_required",
]

text_columns = [col for col in text_columns if col in df.columns]

df[text_columns] = df[text_columns].fillna("")
df["input_text"] = df[text_columns].astype(str).agg(" ".join, axis=1)

X_text = df["input_text"].tolist()
y = df["matched_score"]

print("Loading embedding model...")
embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

print("Encoding text data...")
X_embeddings = embedding_model.encode(
    X_text,
    batch_size=32,
    show_progress_bar=True
)

X_embeddings = np.array(X_embeddings)

X_train, X_test, y_train, y_test = train_test_split(
    X_embeddings,
    y,
    test_size=0.2,
    random_state=42
)

model = XGBRegressor(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="reg:squarederror",
    random_state=42,
    n_jobs=-1
)

print("Training XGBoost with embeddings...")
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\n===== Embedding + XGBoost Result =====")
print(f"MAE: {mae:.4f}")
print(f"MSE: {mse:.4f}")
print(f"R2 Score: {r2:.4f}")

joblib.dump({
    "embedding_model_name": "sentence-transformers/all-MiniLM-L6-v2",
    "xgb_model": model
}, "embedding_xgboost_model.pkl")

print("\nEmbedding XGBoost model saved as embedding_xgboost_model.pkl")