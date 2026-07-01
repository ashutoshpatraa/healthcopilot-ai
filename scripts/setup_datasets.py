import os
import kagglehub
import pandas as pd

DATASETS_DIR = os.path.join(os.path.dirname(__file__), "../datasets")

def download_datasets():
    print("Downloading datasets from Kaggle...")
    os.makedirs(DATASETS_DIR, exist_ok=True)
    
    # Disease Prediction Using Machine Learning
    path1 = kagglehub.dataset_download("kaushil268/disease-prediction-using-machine-learning")
    print(f"Dataset 1 downloaded to: {path1}")
    
    # Symptom2Disease
    path2 = kagglehub.dataset_download("niyarrbarman/symptom2disease")
    print(f"Dataset 2 downloaded to: {path2}")
    
    # Disease Symptom Description Dataset
    path3 = kagglehub.dataset_download("itachi9604/disease-symptom-description-dataset")
    print(f"Dataset 3 downloaded to: {path3}")
    
    # Healthcare Symptoms Disease Classification Dataset
    path4 = kagglehub.dataset_download("kundanbedmutha/healthcare-symptomsdisease-classification-dataset")
    print(f"Dataset 4 downloaded to: {path4}")
    
    # Disease and Symptoms Dataset
    path5 = kagglehub.dataset_download("choongqianzheng/disease-and-symptoms-dataset")
    print(f"Dataset 5 downloaded to: {path5}")

    print("All datasets downloaded successfully. You can now explore them in the cache directories.")

if __name__ == "__main__":
    download_datasets()
