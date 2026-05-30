// App.jsx
// App.jsx

import { useState } from "react";
import "./App.css";

function App() {
  const [step, setStep] = useState(1);

  const [resume, setResume] = useState({
    age: "",
    education: "",
    major: "",
    skills: "",
    experienceYears: "",
    certificates: "",
    languages: "",
    experienceDescription: "",
    selfIntroduction: "",
  });

  const [job, setJob] = useState({
    title: "",
    category: "",
    description: "",
    experienceRequirement: "",
    educationRequirement: "",
    majorRequirement: "",
    skillRequirement: "",
    certificateRequirement: "",
    languageRequirement: "",
    travelRequirement: "",
  });

  const [result, setResult] = useState(null);

  const handleResumeChange = (e) => {
    setResume({ ...resume, [e.target.name]: e.target.value });
  };

  const handleJobChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze-resume",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resume, job }),
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);

      setResult(data);
      setStep(3);
    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend. Please check if the server is running.");
    }
  };

  return (
    <div className="container">
      <h1>Offer-Navigator</h1>
      <p>Smart Resume & Job Matching System</p>

      <div className="steps">
        <div className={step === 1 ? "step active" : "step"}>1 Resume</div>
        <div className={step === 2 ? "step active" : "step"}>2 Job</div>
        <div className={step === 3 ? "step active" : "step"}>3 Result</div>
      </div>

      {step === 1 && (
        <div className="form-card single">
          <h2>Resume Form</h2>

          <label>Age</label>
          <input name="age" value={resume.age} onChange={handleResumeChange} />

          <label>Education</label>
          <input name="education" value={resume.education} onChange={handleResumeChange} />

          <label>Major</label>
          <input name="major" value={resume.major} onChange={handleResumeChange} />

          <label>Skills</label>
          <textarea name="skills" value={resume.skills} onChange={handleResumeChange} />

          <label>Years of Experience</label>
          <input
            name="experienceYears"
            value={resume.experienceYears}
            onChange={handleResumeChange}
          />

          <label>Certificates</label>
          <textarea
            name="certificates"
            value={resume.certificates}
            onChange={handleResumeChange}
          />

          <label>Languages</label>
          <textarea
            name="languages"
            value={resume.languages}
            onChange={handleResumeChange}
          />

          <label>Work / Project Experience</label>
          <textarea
            name="experienceDescription"
            value={resume.experienceDescription}
            onChange={handleResumeChange}
          />

          <label>Self Introduction</label>
          <textarea
            name="selfIntroduction"
            value={resume.selfIntroduction}
            onChange={handleResumeChange}
          />

          <button onClick={() => setStep(2)}>Next: Job Information</button>
        </div>
      )}

      {step === 2 && (
        <div className="form-card single">
          <h2>Job Form</h2>

          <label>Job Title</label>
          <input name="title" value={job.title} onChange={handleJobChange} />

          <label>Job Category</label>
          <input name="category" value={job.category} onChange={handleJobChange} />

          <label>Job Description</label>
          <textarea name="description" value={job.description} onChange={handleJobChange} />

          <label>Experience Requirement</label>
          <input
            name="experienceRequirement"
            value={job.experienceRequirement}
            onChange={handleJobChange}
          />

          <label>Education Requirement</label>
          <input
            name="educationRequirement"
            value={job.educationRequirement}
            onChange={handleJobChange}
          />

          <label>Major Requirement</label>
          <input
            name="majorRequirement"
            value={job.majorRequirement}
            onChange={handleJobChange}
          />

          <label>Skill Requirement</label>
          <textarea
            name="skillRequirement"
            value={job.skillRequirement}
            onChange={handleJobChange}
          />

          <label>Certificate Requirement</label>
          <textarea
            name="certificateRequirement"
            value={job.certificateRequirement}
            onChange={handleJobChange}
          />

          <label>Language Requirement</label>
          <textarea
            name="languageRequirement"
            value={job.languageRequirement}
            onChange={handleJobChange}
          />

          <label>Business Travel Requirement</label>
          <input
            name="travelRequirement"
            value={job.travelRequirement}
            onChange={handleJobChange}
            placeholder="e.g. Yes / No / Occasionally"
          />

          <div className="button-row">
            <button className="secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button onClick={handleAnalyze}>Analyze</button>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div className="result-section">
          <h2>Analysis Result</h2>

          <h3>Match Score</h3>
          <p>{result.matchScore}</p>

          <h3>Score Explanation</h3>
          <p>{result.llmAnalysis?.scoreExplanation}</p>

          <h3>Revision Suggestions</h3>
          <ul>
            {result.llmAnalysis?.revisionSuggestions?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>Potential Advantages</h3>
          <ul>
            {result.llmAnalysis?.potentialAdvantages?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>Impact Factors</h3>
          <ul>
            {result.impactFactors?.map((item, index) => (
              <li key={index}>
                {item.feature} ({item.impact})
              </li>
            ))}
          </ul>

          <div className="button-row">
            <button className="secondary" onClick={() => setStep(2)}>
              Back to Job
            </button>
            <button onClick={() => setStep(1)}>Redo Resume</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;