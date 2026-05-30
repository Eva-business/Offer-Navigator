# predict.py
import sys
import json
import joblib
import os

os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

import sys
import json
import joblib
import xgboost as xgb
import numpy as np

#print("MODEL LOADING...")


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "xgboost_model.pkl")

#print("MODEL PATH =", model_path)

model = joblib.load(model_path)

#print("MODEL LOADED")
#print(type(model))

"""
if hasattr(model, "named_steps"):
    print("STEPS =", model.named_steps.keys())
"""

tfidf = model.named_steps["tfidf"]
xgb_model = model.named_steps["xgb"]
print("XGB TYPE =", type(xgb_model))

def normalize_skills(text):
    if not text:
        return []

    return [
        skill.strip().lower()
        for skill in text.replace("\n", ",").split(",")
        if skill.strip()
    ]


def is_related_to_job_skill(feature, job_skills):
    for job_skill in job_skills:
        words = job_skill.split()

        if feature == job_skill:
            return True

        if feature in words:
            return True

        if feature in job_skill:
            return True

        if job_skill in feature:
            return True

    return False

def calibrate_score(score):
    if score < 0.65:
        return score * 0.8
    elif score < 0.75:
        return score
    else:
        return 0.775 + (score - 0.75) * 1.6
    
def predict_match_score(resume_text, job_text, job_skills_text):
    input_text = resume_text + " " + job_text

    # 只使用「技能要求欄位」來過濾 SHAP 影響因子
    job_skills = normalize_skills(job_skills_text)

    if len(job_skills) == 0:
        job_skills = ["general"]  # fallback

    # TF-IDF 轉向量
    X_vector = tfidf.transform([input_text])
    print("shape =", X_vector.shape)

    # 預測 Match Score
    prediction = xgb_model.predict(X_vector)[0]

    # 先限制原始模型分數
    prediction = max(0, min(1, prediction))

    # 分段校正，增加高低分鑑別度
    prediction = calibrate_score(prediction)

    # 再限制一次，避免超過 1
    prediction = max(0, min(1, prediction))

    # 取得 TF-IDF 特徵名稱
    feature_names = tfidf.get_feature_names_out()

    # 使用 XGBoost 內建 SHAP contribution
    
    dmatrix = xgb.DMatrix(X_vector)
    shap_values = xgb_model.get_booster().predict(
        dmatrix,
        pred_contribs=True
    )[0]
   

    # 最後一個是 bias，不是特徵
    feature_shap_values = shap_values[:-1]

    # 由正向影響最大排序
    top_indices = np.argsort(feature_shap_values)[::-1]
     

    impact_factors = []
    used_skills = set()

    for index in top_indices:
        feature = feature_names[index]
        value = feature_shap_values[index]

        if value <= 0:
            continue

        if len(feature) <= 2:
            continue

        # 只保留與 job.skillRequirement 有關的 SHAP feature
        if not is_related_to_job_skill(feature, job_skills):
            continue

        matched_job_skill = None

        for job_skill in job_skills:
            words = job_skill.split()

            if (
                feature == job_skill
                or feature in words
                or feature in job_skill
                or job_skill in feature
            ):
                matched_job_skill = job_skill
                break

        if matched_job_skill is None:
            continue

        if matched_job_skill in used_skills:
            continue

        used_skills.add(matched_job_skill)

        impact_factors.append({
            "feature": matched_job_skill,
            "impact": round(float(value), 6)
        })

        if len(impact_factors) >= 5:
            break

    return {
        "matchScore": round(float(prediction), 4),
        "impactFactors": impact_factors
    }


if __name__ == "__main__":

    print("ARGV =", sys.argv, file=sys.stderr)

    try:
        input_data = json.loads(sys.argv[1])

        resume_text = input_data.get("resume_text", "")
        job_text = input_data.get("job_text", "")
        job_skills_text = input_data.get("job_skills", "")

        result = predict_match_score(
            resume_text,
            job_text,
            job_skills_text
        )

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({
            "error": str(e)
        }))
