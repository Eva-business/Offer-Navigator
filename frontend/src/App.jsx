// App.jsx in frontend in src

import { useState } from "react";
import "./App.css";

function App() {

  const validateField = (name, value) => {
    const regex = /^[A-Za-z0-9\s.,+#\-()/&':]+$/;

    if (!value.trim()) {
      return "This field is required.";
    }


    if (name === "travelRequirement") {
      const allowed = ["Yes", "No", "Occasionally"];
      if (!allowed.includes(value)) {
        return "Please select Yes, No, or Occasionally.";
      }
      return "";
    }

    if (!regex.test(value)) {
      return "Only English letters and numbers are allowed.";
    }

    return "";
  };

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
  const [errors, setErrors] = useState({});

  const handleResumeChange = (e) => {
    const { name, value } = e.target;

    setResume({
      ...resume,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: validateField(name, value),
    });
  };

  const handleJobChange = (e) => {
    const { name, value } = e.target;

    setJob({
      ...job,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: validateField(name, value),
    });
  };

  const validateResume = () => {
    const newErrors = {};

    Object.entries(resume).forEach(([key, value]) => {
      const error = validateField(key, value);

      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    console.log("Resume Errors:", newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const validateJob = () => {
    const newErrors = {};

    Object.entries(job).forEach(([key, value]) => {
      const error = validateField(key, value);

      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    console.log("Job Errors:", newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAnalyze = async () => {
    if (!validateJob()) {
      return;
    }

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
      <br></br>
      <p>Smart Resume & Job Matching System</p>

      <div className="steps">
        <div className={step === 1 ? "step active" : "step"}>1 Resume</div>
        <div className={step === 2 ? "step active" : "step"}>2 Job</div>
        <div className={step === 3 ? "step active" : "step"}>3 Result</div>
      </div>

      {
        step === 1 && (
          <div className="form-card single">
            <h2>Resume Form</h2>

            <label>Age</label>
            <input
              name="age"
              value={resume.age}
              onChange={handleResumeChange}
              className={errors.age ? "input-error" : ""}
            />

            {errors.age && (
              <div className="error">
                {errors.age}
              </div>
            )}

            <label>Education</label>
            <input name="education" value={resume.education} onChange={handleResumeChange} className={errors.education ? "input-error" : ""} />

            {errors.education && (
              <div className="error">
                {errors.education}
              </div>
            )}

            <label>Major</label>
            <input name="major" value={resume.major} onChange={handleResumeChange} className={errors.major ? "input-error" : ""} />

            {errors.major && (
              <div className="error">
                {errors.major}
              </div>
            )}

            <label>Skills</label>
            <textarea name="skills" value={resume.skills} onChange={handleResumeChange} className={errors.skills ? "input-error" : ""} />

            {errors.skills && (
              <div className="error">
                {errors.skills}
              </div>
            )}

            <label>Years of Experience</label>
            <input
              name="experienceYears"
              value={resume.experienceYears}
              onChange={handleResumeChange}
              className={errors.experienceYears ? "input-error" : ""}
            />

            {errors.experienceYears && (
              <div className="error">
                {errors.experienceYears}
              </div>
            )}


            <label>Certificates</label>
            <textarea
              name="certificates"
              value={resume.certificates}
              onChange={handleResumeChange}
              className={errors.certificates ? "input-error" : ""}
            />

            {errors.certificates && (
              <div className="error">
                {errors.certificates}
              </div>
            )}

            <label>Languages</label>
            <textarea
              name="languages"
              value={resume.languages}
              onChange={handleResumeChange}
              className={errors.languages ? "input-error" : ""}
            />

            {errors.languages && (
              <div className="error">
                {errors.languages}
              </div>
            )}


            <label>Work / Project Experience</label>
            <textarea
              name="experienceDescription"
              value={resume.experienceDescription}
              onChange={handleResumeChange}
              className={errors.experienceDescription ? "input-error" : ""}
            />

            {errors.experienceDescription && (
              <div className="error">
                {errors.experienceDescription}
              </div>
            )}

            <label>Self Introduction</label>
            <textarea
              name="selfIntroduction"
              value={resume.selfIntroduction}
              onChange={handleResumeChange}
              className={errors.selfIntroduction ? "input-error" : ""}
            />

            {errors.selfIntroduction && (
              <div className="error">
                {errors.selfIntroduction}
              </div>
            )}

            <button
              onClick={() => {
                console.log("Next clicked");

                if (validateResume()) {
                  setStep(2);
                } else {
                  console.log("Validation failed");
                }
              }}
            >
              Next: Job Information
            </button>
          </div>
        )
      }

      {
        step === 2 && (
          <div className="form-card single">
            <h2>Job Form</h2>

            <label>Job Title</label>
            <input name="title" value={job.title} onChange={handleJobChange} className={errors.title ? "input-error" : ""} />

            {errors.title && (
              <div className="error">
                {errors.title}
              </div>
            )}


            <label>Job Category</label>
            <input name="category" value={job.category} onChange={handleJobChange} className={errors.category ? "input-error" : ""} />

            {errors.category && (
              <div className="error">
                {errors.category}
              </div>
            )}

            <label>Job Description</label>
            <textarea name="description" value={job.description} onChange={handleJobChange} className={errors.description ? "input-error" : ""} />

            {errors.description && (
              <div className="error">
                {errors.description}
              </div>
            )}

            <label>Experience Requirement</label>
            <input
              name="experienceRequirement"
              value={job.experienceRequirement}
              onChange={handleJobChange}
              className={errors.experienceRequirement ? "input-error" : ""}
            />

            {errors.experienceRequirement && (
              <div className="error">
                {errors.experienceRequirement}
              </div>
            )}

            <label>Education Requirement</label>
            <input
              name="educationRequirement"
              value={job.educationRequirement}
              onChange={handleJobChange}
              className={errors.educationRequirement ? "input-error" : ""}
            />

            {errors.educationRequirement && (
              <div className="error">
                {errors.educationRequirement}
              </div>
            )}

            <label>Major Requirement</label>
            <input
              name="majorRequirement"
              value={job.majorRequirement}
              onChange={handleJobChange}
              className={errors.majorRequirement ? "input-error" : ""}
            />

            {errors.majorRequirement && (
              <div className="error">
                {errors.majorRequirement}
              </div>
            )}

            <label>Skill Requirement</label>
            <textarea
              name="skillRequirement"
              value={job.skillRequirement}
              onChange={handleJobChange}
              className={errors.skillRequirement ? "input-error" : ""}
            />

            {errors.skillRequirement && (
              <div className="error">
                {errors.skillRequirement}
              </div>
            )}

            <label>Certificate Requirement</label>
            <textarea
              name="certificateRequirement"
              value={job.certificateRequirement}
              onChange={handleJobChange}
              className={errors.certificateRequirement ? "input-error" : ""}
            />

            {errors.certificateRequirement && (
              <div className="error">
                {errors.certificateRequirement}
              </div>
            )}

            <label>Language Requirement</label>
            <textarea
              name="languageRequirement"
              value={job.languageRequirement}
              onChange={handleJobChange}
              className={errors.languageRequirement ? "input-error" : ""}
            />

            {errors.languageRequirement && (
              <div className="error">
                {errors.languageRequirement}
              </div>
            )}
            <label>Business Travel Requirement</label>

            <select
              name="travelRequirement"
              value={job.travelRequirement}
              onChange={handleJobChange}
              className={errors.travelRequirement ? "input-error" : ""}
            >
              <option value="">Please select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Occasionally">Occasionally</option>
            </select>

            {errors.travelRequirement && (
              <div className="error">
                {errors.travelRequirement}
              </div>
            )}

            <div className="button-row">
              <button className="secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button onClick={handleAnalyze}>Analyze</button>
            </div>
          </div>
        )
      }

      {
        step === 3 && result && (
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
        )
      }
    </div >
  );
}

export default App;
