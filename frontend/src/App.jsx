/*App.css in frontend in src*/

body {
  margin: 0;
  font-family: Arial, "Microsoft JhengHei", sans-serif;
  background-color: #f4f6f8;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  text-align: center;
  color: #1f2937;
  margin-bottom: 8px;
}

p {
  text-align: center;
  color: #4b5563;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin: 32px 0;
  gap: 12px;
}

.step {
  flex: 1;
  text-align: center;
  padding: 12px;
  border-radius: 999px;
  background-color: #e5e7eb;
  color: #6b7280;
  font-weight: bold;
}

.step.active {
  background-color: #2563eb;
  color: white;
}

.form-card,
.result-section {
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  width: 100%;
  box-sizing: border-box;
}

.form-card h2,
.result-section h2 {
  margin-top: 0;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
  width: 100%;
  box-sizing: border-box;
}

label {
  display: block;
  font-weight: bold;
  margin-top: 16px;
  margin-bottom: 8px;
  color: #374151;
}

input,
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  font-size: 15px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
}

input:focus,
textarea:focus {
  border-color: #2563eb;
}

textarea {
  min-height: 90px;
  resize: vertical;
}

button {
  display: block;
  margin: 28px auto 0;
  padding: 14px 36px;
  font-size: 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 999px;
  cursor: pointer;
}

button:hover {
  background-color: #1d4ed8;
}

.button-row {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.secondary {
  background-color: #6b7280;
}

.secondary:hover {
  background-color: #4b5563;
}

.result-section h3 {
  margin-top: 22px;
  color: #2563eb;
}

.result-section p {
  text-align: left;
  font-size: 24px;
  font-weight: bold;
  color: #111827;
}

.match-score {
  text-align: center;
  font-size: 56px;
  font-weight: 700;
  color: #295151;
  margin: 20px 0 30px;
}

li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .steps {
    flex-direction: column;
  }

  .button-row {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}

.error {
  color: #dc2626;
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
  margin-bottom: 10px;
}

.input-error {
  border: 2px solid red;
}
