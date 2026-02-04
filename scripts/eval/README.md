# VoxMentor Evaluation Scripts

This folder contains a Python script to compute metrics for your IEEE paper:
- Accuracy
- Precision / Recall / F1-Score (binary or multiclass)
- Response Time stats (mean/median/p95) from timestamps or a numeric column

## 1) Setup (Windows PowerShell)

```powershell
# From repo root
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r .\scripts\eval\requirements.txt
```

## 2) CSV format

Provide at least these columns:
- y_true: ground truth label
- y_pred: predicted label

Optional (for response times):
- response_time_ms: numeric milliseconds
  OR
- start_ts and end_ts: parseable timestamps (ISO is best)

Example: `scripts/eval/sample_data.csv`

```csv
question_id,y_true,y_pred,response_time_ms,start_ts,end_ts
q1,correct,correct,820,2025-09-30T10:00:00Z,2025-09-30T10:00:00.820Z
q2,incorrect,correct,1450,2025-09-30T10:01:00Z,2025-09-30T10:01:01.450Z
q3,correct,incorrect,980,2025-09-30T10:02:00Z,2025-09-30T10:02:00.980Z
q4,correct,correct,,2025-09-30T10:03:00Z,2025-09-30T10:03:01Z
```

## 3) Run examples

Binary classification (pos label = "correct") with response_time_ms:
```powershell
python .\scripts\eval\evaluate_metrics.py `
  --csv .\scripts\eval\sample_data.csv `
  --task-type binary `
  --positive-label correct `
  --average binary `
  --response-col response_time_ms `
  --normalize-text `
  --print-report --print-confusion
```

Using timestamps to compute response time:
```powershell
python .\scripts\eval\evaluate_metrics.py `
  --csv .\scripts\eval\sample_data.csv `
  --task-type binary `
  --positive-label correct `
  --average binary `
  --start-col start_ts `
  --end-col end_ts `
  --normalize-text
```

Multiclass macro metrics:
```powershell
python .\scripts\eval\evaluate_metrics.py `
  --csv .\scripts\eval\sample_data.csv `
  --task-type multiclass `
  --average macro `
  --response-col response_time_ms `
  --normalize-text `
  --print-report --print-confusion
```

Save JSON summary:
```powershell
python .\scripts\eval\evaluate_metrics.py `
  --csv .\scripts\eval\sample_data.csv `
  --task-type binary `
  --positive-label correct `
  --average binary `
  --response-col response_time_ms `
  --output-json .\scripts\eval\summary.json
```

## Notes
- Use `--normalize-text` to lower/trim labels (e.g., when comparing Whisper/Gemini text labels like "Correct" vs "correct").
- For binary average, set `--positive-label` explicitly.
- If you have free-text answers instead of classes, map them to labels first (e.g., exact/semantic match) and then use this script.
