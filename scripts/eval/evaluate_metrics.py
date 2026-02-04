#!/usr/bin/env python3
"""
Evaluation script for VoxMentor (IEEE metrics)

- Compares expected vs predicted labels from a CSV file
- Computes Accuracy, Precision, Recall, F1 (binary or multiclass)
- Computes Response Time stats from either a numeric column (ms) or two timestamp columns
- Prints a neat summary table and optional confusion matrix

CSV expectations (customizable via args):
  required:
    - y_true column (default: y_true)
    - y_pred column (default: y_pred)
  optional (choose one path for response time):
    - response_time_ms column (numeric)
      OR
    - start_ts (ISO or parseable datetime) and end_ts (ISO or parseable datetime)

Example:
  python evaluate_metrics.py --csv sample_data.csv --task-type multiclass \
      --y-true-col y_true --y-pred-col y_pred \
      --response-col response_time_ms --print-report --print-confusion
"""

import argparse
from dataclasses import dataclass
from typing import List, Optional, Tuple

import numpy as np
import pandas as pd
from dateutil import parser as dtparser
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    classification_report,
    confusion_matrix,
)
from tabulate import tabulate


@dataclass
class RTStats:
    mean_ms: Optional[float]
    median_ms: Optional[float]
    p95_ms: Optional[float]


def _normalize_text(x: str) -> str:
    if x is None:
        return ""
    return " ".join(str(x).strip().lower().split())


def compute_response_time(
    df: pd.DataFrame,
    response_col: Optional[str],
    start_col: Optional[str],
    end_col: Optional[str],
) -> RTStats:
    if response_col and response_col in df.columns:
        s = pd.to_numeric(df[response_col], errors="coerce").dropna()
        if s.empty:
            return RTStats(None, None, None)
        return RTStats(
            mean_ms=float(s.mean()),
            median_ms=float(s.median()),
            p95_ms=float(s.quantile(0.95)),
        )
    if start_col and end_col and start_col in df.columns and end_col in df.columns:
        def parse_ts(val):
            try:
                return dtparser.parse(str(val))
            except Exception:
                return None
        start = df[start_col].apply(parse_ts)
        end = df[end_col].apply(parse_ts)
        deltas = []
        for s, e in zip(start, end):
            if s is not None and e is not None:
                deltas.append((e - s).total_seconds() * 1000.0)
        if len(deltas) == 0:
            return RTStats(None, None, None)
        arr = np.array(deltas)
        return RTStats(
            mean_ms=float(np.mean(arr)),
            median_ms=float(np.median(arr)),
            p95_ms=float(np.quantile(arr, 0.95)),
        )
    return RTStats(None, None, None)


def main():
    ap = argparse.ArgumentParser(description="Evaluate classification metrics and response time")
    ap.add_argument("--csv", required=True, help="Path to CSV with y_true/y_pred and optional time columns")
    ap.add_argument("--y-true-col", default="y_true", help="Column name for ground truth labels")
    ap.add_argument("--y-pred-col", default="y_pred", help="Column name for predicted labels")
    ap.add_argument("--task-type", choices=["binary", "multiclass"], default="binary")
    ap.add_argument("--average", choices=["binary", "micro", "macro", "weighted"], default=None,
                    help="Averaging strategy. If not set: uses 'binary' for binary tasks, 'macro' for multiclass")
    ap.add_argument("--positive-label", default=None, help="Positive label for binary average (e.g., 'correct' or '1')")
    ap.add_argument("--normalize-text", action="store_true", help="Normalize labels as lowercase/trimmed strings before compare")

    # Response time options
    ap.add_argument("--response-col", default=None, help="Numeric response time column in ms")
    ap.add_argument("--start-col", default=None, help="Start timestamp column")
    ap.add_argument("--end-col", default=None, help="End timestamp column")

    ap.add_argument("--print-report", action="store_true", help="Print sklearn classification_report")
    ap.add_argument("--print-confusion", action="store_true", help="Print confusion matrix")
    ap.add_argument("--output-json", default=None, help="Save metrics summary to a JSON file")

    args = ap.parse_args()

    df = pd.read_csv(args.csv)

    if args.y_true_col not in df.columns or args.y_pred_col not in df.columns:
        missing = [c for c in [args.y_true_col, args.y_pred_col] if c not in df.columns]
        raise SystemExit(f"Missing required columns in CSV: {missing}")

    y_true = df[args.y_true_col].astype(str).tolist()
    y_pred = df[args.y_pred_col].astype(str).tolist()

    if args.normalize_text:
        y_true = [_normalize_text(v) for v in y_true]
        y_pred = [_normalize_text(v) for v in y_pred]

    # Determine averaging
    if args.average is None:
        average = "binary" if args.task_type == "binary" else "macro"
    else:
        average = args.average

    # Handle positive label for binary
    pos_label = args.positive_label
    if average == "binary" and args.task_type != "binary":
        print("[warn] --average=binary with non-binary task; switching to macro")
        average = "macro"

    # Compute metrics
    acc = accuracy_score(y_true, y_pred)

    # For precision/recall/f1, scikit-learn expects labels if average='binary' and pos_label set
    # Convert labels to consistent set
    labels = sorted(list(set(y_true) | set(y_pred)))

    if average == "binary":
        if pos_label is None:
            # default to first unique label of y_true
            pos_label = labels[0]
        prec, rec, f1, _ = precision_recall_fscore_support(
            y_true, y_pred, average="binary", pos_label=pos_label, zero_division=0
        )
    else:
        prec, rec, f1, _ = precision_recall_fscore_support(
            y_true, y_pred, average=average, zero_division=0
        )

    rt = compute_response_time(df, args.response_col, args.start_col, args.end_col)

    # Prepare summary table
    rows = [
        ["Accuracy", f"{acc:.4f}"],
        [f"Precision ({average})", f"{prec:.4f}"],
        [f"Recall ({average})", f"{rec:.4f}"],
        [f"F1-Score ({average})", f"{f1:.4f}"],
        ["Avg Response Time (ms)", f"{rt.mean_ms:.2f}" if rt.mean_ms is not None else "n/a"],
        ["Median Response Time (ms)", f"{rt.median_ms:.2f}" if rt.median_ms is not None else "n/a"],
        ["P95 Response Time (ms)", f"{rt.p95_ms:.2f}" if rt.p95_ms is not None else "n/a"],
    ]

    print("\n=== VoxMentor Evaluation Summary ===")
    print(tabulate(rows, headers=["Metric", "Value"], tablefmt="github"))

    if args.print_report:
        print("\n=== Classification Report ===")
        print(classification_report(y_true, y_pred, zero_division=0))

    if args.print_confusion:
        print("\n=== Confusion Matrix ===")
        cm = confusion_matrix(y_true, y_pred, labels=labels)
        cm_df = pd.DataFrame(cm, index=[f"true:{l}" for l in labels], columns=[f"pred:{l}" for l in labels])
        print(cm_df.to_string())

    if args.output_json:
        out = {
            "accuracy": float(acc),
            "precision": float(prec),
            "recall": float(rec),
            "f1": float(f1),
            "average": average,
            "positive_label": pos_label,
            "response_time_ms": {
                "mean": rt.mean_ms,
                "median": rt.median_ms,
                "p95": rt.p95_ms,
            },
            "labels": labels,
        }
        import json
        with open(args.output_json, "w", encoding="utf-8") as f:
            json.dump(out, f, indent=2)
        print(f"\nSaved summary to {args.output_json}")


if __name__ == "__main__":
    main()
