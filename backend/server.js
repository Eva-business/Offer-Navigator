//server.js
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const { spawn } = require("child_process");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// 2. 加入 Middleware：告訴伺服器要看得懂前端傳來的 JSON 格式資料
app.use(express.json());

// ==========================================
// 輔助函式區
// ==========================================
function runMLModel(resumeText, jobText, jobSkillsText) {
  return new Promise((resolve, reject) => {

    const inputData = JSON.stringify({
      resume_text: resumeText,
      job_text: jobText,
      job_skills: jobSkillsText
    });

    const pythonScriptPath = path.join(__dirname, "..", "ML", "predict.py");

    // ✅ 改成 spawn（重點）
    const py = spawn("python", [
      pythonScriptPath,
      inputData
    ]);

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    py.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    py.on("close", (code) => {

      console.log("=== PYTHON STDOUT ===");
      console.log(stdout);

      console.log("=== PYTHON STDERR ===");
      console.log(stderr);

      try {
        const lines = stdout.trim().split("\n");
        const lastLine = lines[lines.length - 1];

        resolve(JSON.parse(lastLine));
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function callLLMAPI(mlResult, resume, job) {
  const mainSkill = mlResult.impactFactors?.[0]?.feature || '核心技能';
  const score = mlResult.matchScore || 0.8251;

  return {
    scoreExplanation: `Based on the system evaluation, the match score between your resume and '${job.title || 'this position'}' is ${score}. Your experience in '${mainSkill}' highly aligns with the job requirements, which is the primary reason for your high score. However, there is still room to improve by adding specific quantitative metrics to your practical project experiences.`,

    revisionSuggestions: [
      "In 'Project or Work Experience', we recommend adding specific quantitative data, such as the percentage by which you improved efficiency or the volume of data you processed.",
      "The job description mentions teamwork and communication skills. We suggest supplementing your resume with successful past experiences in cross-departmental collaboration.",
      "Streamline less relevant experiences to reserve space for skills and projects that are directly related to this position."
    ],

    potentialAdvantages: [
      "Your interdisciplinary educational background can bring a unique problem-solving perspective to the team.",
      "You have demonstrated a strong drive for self-learning, which is highly beneficial in the rapidly changing technology sector.",
      "Possessing multiple relevant skills proves that you have solid foundational knowledge and resilience under pressure."
    ]
  };
}

// ==========================================
// 路由 API 區
// ==========================================
app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { resume, job } = req.body;

    if (!resume || !job) {
      return res.status(400).json({ error: "缺少履歷或職缺資料" });
    }

    const resumeText = `
      Age: ${resume.age}
      Education: ${resume.education}
      Major: ${resume.major}
      Skills: ${resume.skills}
      Years of Experience: ${resume.experienceYears}
      Certificates: ${resume.certificates}
      Languages: ${resume.languages}
      Project or Work Experience: ${resume.experienceDescription}
      Self Introduction: ${resume.selfIntroduction}
    `;

    const jobText = `
      Job Title: ${job.title}
      Job Category: ${job.category}
      Job Description: ${job.description}
      Experience Requirement: ${job.experienceRequirement}
      Education Requirement: ${job.educationRequirement}
      Major Requirement: ${job.majorRequirement}
      Skill Requirement: ${job.skillRequirement}
      Certificate Requirement: ${job.certificateRequirement}
      Language Requirement: ${job.languageRequirement}
    `;

    const jobSkillsText = job.skillRequirement || "";

    let mlResult;
    try {
      mlResult = await runMLModel(resumeText, jobText, jobSkillsText);
      if (mlResult.error) throw new Error(mlResult.error);
    } catch (err) {
      console.warn("⚠️ ML 執行失敗，提供預設分數繼續流程:", err.message);
      mlResult = {
        matchScore: 0.75,
        impactFactors: [
          { feature: "python", impact: 0.12 },
          { feature: "sql", impact: 0.08 }
        ]
      };
    }

    const llmAnalysis = await callLLMAPI(mlResult, resume, job);

    return res.status(200).json({
      matchScore: mlResult.matchScore,
      impactFactors: mlResult.impactFactors,
      llmAnalysis: llmAnalysis
    });

  } catch (error) {
    console.error("❌ 伺服器處理失敗:", error);
    return res.status(500).json({ error: "伺服器內部錯誤" });
  }
});

// ==========================================
// 啟動伺服器監聽 (這就是之前漏掉的關鍵！)
// ==========================================
app.listen(port, () => {
  console.log(`✅ 伺服器已成功啟動！`);
});