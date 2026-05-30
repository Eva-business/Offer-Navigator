import pandas as pd

df = pd.read_csv("resume_data.csv")

# 清理欄位名稱 BOM 與空白
df.columns = df.columns.str.replace("\ufeff", "", regex=False).str.strip()

print("資料筆數與欄位數：")
print(df.shape)

print("\n所有欄位：")
for col in df.columns:
    print(col)

print("\n前 5 筆資料：")
print(df.head())

print("\n缺失值統計：")
print(df.isnull().sum())

print("\nmatched_score 統計：")
print(df["matched_score"].describe())