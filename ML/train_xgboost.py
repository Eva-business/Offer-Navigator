import pandas as pd
import joblib
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from xgboost import XGBRegressor

# 讀取資料
df = pd.read_csv("resume_data.csv")

# 清理欄位名稱 BOM 與空白
df.columns = df.columns.str.replace("\ufeff", "", regex=False).str.strip()

# 使用的文字欄位
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

# 只保留資料集中存在的欄位
text_columns = [col for col in text_columns if col in df.columns]

# 缺失值補空字串
df[text_columns] = df[text_columns].fillna("")

# 建立模型輸入文字
df["input_text"] = df[text_columns].astype(str).agg(" ".join, axis=1)

# 輸入與標籤
X = df["input_text"]
y = df["matched_score"]

# 切分訓練集與測試集
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# 建立 XGBoost Pipeline
xgb_model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            max_features=5000,
            stop_words="english"
        )
    ),
    (
        "xgb",
        XGBRegressor(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            objective="reg:squarederror",
            random_state=42,
            n_jobs=-1
        )
    )
])

# 訓練模型
xgb_model.fit(X_train, y_train)

# 預測
y_pred = xgb_model.predict(X_test)

# 評估
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\n===== XGBoost Model Result =====")
print(f"MAE: {mae:.4f}")
print(f"MSE: {mse:.4f}")
print(f"R2 Score: {r2:.4f}")

# 儲存模型
joblib.dump(xgb_model, "xgboost_model.pkl")

print("\nXGBoost model saved as xgboost_model.pkl")

# 取得全域 Feature Importance
# 注意：這是整體資料集的全域重要特徵，只適合報告說明模型，不建議直接當單次使用者分析結果
feature_names = xgb_model.named_steps["tfidf"].get_feature_names_out()
importances = xgb_model.named_steps["xgb"].feature_importances_

indices = np.argsort(importances)[::-1]

print("\n===== Top 20 Global Important Features =====")
print("Note: These are global model features, not personalized impact factors.")

top_n = min(20, len(feature_names))

for i in range(top_n):
    feature = feature_names[indices[i]]
    importance = importances[indices[i]]
    print(f"{i + 1}. {feature} ({importance:.4f})")