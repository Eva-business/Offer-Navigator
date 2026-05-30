import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

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
df["input_text"] = df[text_columns].agg(" ".join, axis=1)

X = df["input_text"]
y = df["matched_score"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

rf_model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            max_features=5000,
            stop_words="english"
        )
    ),
    (
        "rf",
        RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            n_jobs=-1
        )
    )
])

rf_model.fit(X_train, y_train)

y_pred = rf_model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\n===== Random Forest Model Result =====")
print(f"MAE: {mae:.4f}")
print(f"MSE: {mse:.4f}")
print(f"R2 Score: {r2:.4f}")

joblib.dump(rf_model, "random_forest_model.pkl")

print("\nRandom Forest model saved as random_forest_model.pkl")