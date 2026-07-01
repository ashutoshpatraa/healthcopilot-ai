from __future__ import annotations

import subprocess
from pathlib import Path

DATASETS = [
    "kaushil268/disease-prediction-using-machine-learning",
    "niyarrbarman/symptom2disease",
    "itachi9604/disease-symptom-description-dataset",
    "kundanbedmutha/healthcare-symptomsdisease-classification-dataset",
    "choongqianzheng/disease-and-symptoms-dataset",
]


def download_with_kagglehub(dataset: str, output_dir: Path) -> bool:
    try:
        import kagglehub  # type: ignore
    except ImportError:
        return False

    try:
        downloaded_path = Path(kagglehub.dataset_download(dataset))
    except Exception:
        return False

    output_dir.mkdir(parents=True, exist_ok=True)
    for item in downloaded_path.rglob("*"):
        if item.is_file():
            target = output_dir / item.name
            target.write_bytes(item.read_bytes())
    return True


def download_with_kaggle_cli(dataset: str, output_dir: Path) -> bool:
    command = ["kaggle", "datasets", "download", "-d", dataset, "-p", str(output_dir), "--unzip"]
    result = subprocess.run(command, capture_output=True, text=True, check=False)
    return result.returncode == 0


def main() -> None:
    raw_dir = Path(__file__).resolve().parents[2] / "datasets" / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)

    failures: list[str] = []
    for dataset in DATASETS:
        if not download_with_kagglehub(dataset, raw_dir) and not download_with_kaggle_cli(dataset, raw_dir):
            failures.append(dataset)

    if failures:
        print("Kaggle access is not configured for:")
        for dataset in failures:
            print(f"- {dataset}")
        print("Add kaggle.json to %USERPROFILE%\\.kaggle or configure the Kaggle CLI, then rerun.")
        return

    print("Datasets downloaded successfully.")


if __name__ == "__main__":
    main()
