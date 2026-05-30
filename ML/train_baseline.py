import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LinearRegression

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

# 讀取資料
df = pd.read_csv("resume_data.csv")

# 清理欄位名稱
df.columns = df.columns.str.replace("\ufeff", "", regex=False).str.strip()

# 要使用的文字欄位
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

# 移除不存在欄位
text_columns = [col for col in text_columns if col in df.columns]

# 缺失值補空字串
df[text_columns] = df[text_columns].fillna("")

# 建立模型輸入文字
df["input_text"] = df[text_columns].agg(" ".join, axis=1)

# X = 輸入文字
X = df["input_text"]

# y = Match Score
y = df["matched_score"]

# 切分訓練測試資料
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# 建立 baseline pipeline
baseline_model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            max_features=5000,
            stop_words="english"
        )
    ),

    (
        "lr",
        LinearRegression()
    )
])

# 訓練模型
baseline_model.fit(X_train, y_train)

# 預測
y_pred = baseline_model.predict(X_test)

# 評估
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\n===== Baseline Model Result =====")
print(f"MAE: {mae:.4f}")
print(f"MSE: {mse:.4f}")
print(f"R2 Score: {r2:.4f}")

# 儲存模型
joblib.dump(baseline_model, "baseline_model.pkl")

print("\nBaseline model saved as baseline_model.pkl")