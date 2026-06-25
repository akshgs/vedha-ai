import os
import json
import httpx
import asyncio
import numpy as np
import pandas as pd
from datetime import datetime
from fastapi import APIRouter
import mlflow
import mlflow.sklearn
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    mean_absolute_percentage_error,
    r2_score,
)
from sklearn.preprocessing import  OrdinalEncoder
import joblib
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

MODEL_PATH = "models/skill_predictor.pkl"
ENCODER_PATH = "models/skill_encoder.pkl"
DATA_PATH = "data/skill_trends.json"

os.makedirs("models", exist_ok=True)
os.makedirs("data", exist_ok=True)

TRACKED_SKILLS = {
    "Python":       "pip",
    "PyTorch":      "torch",
    "TensorFlow":   "tensorflow",
    "Transformers": "transformers",
    "LangChain":    "langchain",
    "FastAPI":      "fastapi",
    "Pandas":       "pandas",
    "Scikit-learn": "scikit-learn",
    "OpenCV":       "opencv-python",
    "Numpy":        "numpy",
    "Spacy":        "spacy",
    "MLflow":       "mlflow",
    "Docker":       "docker",
    "Kubernetes":   "kubernetes",
}

GITHUB_QUERIES = {
    "Python":       "python machine learning",
    "PyTorch":      "pytorch deep learning",
    "TensorFlow":   "tensorflow neural network",
    "Transformers": "huggingface transformers nlp",
    "LangChain":    "langchain llm rag",
    "FastAPI":      "fastapi rest api",
    "OpenCV":       "opencv computer vision",
    "MLflow":       "mlflow mlops experiment",
}

# ═══════════════════════════════════════════════
# LIVE DATA COLLECTION
# ═══════════════════════════════════════════════

async def fetch_pypi_downloads(package: str) -> int:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            url = f"https://pypistats.org/api/packages/{package}/recent"
            response = await client.get(url)
            if response.status_code == 200:
                data = response.json()
                return data.get("data", {}).get("last_month", 0)
    except Exception as e:
        print(f"PyPI error for {package}: {e}")
    return 0


async def fetch_github_stars(query: str) -> int:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            url = "https://api.github.com/search/repositories"
            params = {"q": query, "sort": "stars", "order": "desc", "per_page": 5}
            headers = {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "VedhaAI-SkillPredictor"
            }
            response = await client.get(url, params=params, headers=headers)
            if response.status_code == 200:
                data = response.json()
                items = data.get("items", [])
                return sum(repo["stargazers_count"] for repo in items)
    except Exception as e:
        print(f"GitHub error for {query}: {e}")
    return 0


async def collect_live_data() -> list:
    print(f"Collecting live data... {datetime.now()}")
    data_points = []

    for skill_name, pypi_package in TRACKED_SKILLS.items():
        print(f"  Fetching {skill_name}...")
        github_query = GITHUB_QUERIES.get(skill_name, skill_name.lower())

        downloads, stars = await asyncio.gather(
            fetch_pypi_downloads(pypi_package),
            fetch_github_stars(github_query)
        )

        download_score = min(downloads / 1_000_000 * 50, 50)
        star_score = min(stars / 100_000 * 50, 50)
        demand_score = round(download_score + star_score, 2)

        data_points.append({
            "skill": skill_name,
            "pypi_downloads": downloads,
            "github_stars": stars,
            "demand_score": demand_score,
            "timestamp": datetime.now().isoformat(),
            "month": datetime.now().month,
            "week": datetime.now().isocalendar()[1],
        })
        print(f"  {skill_name}: downloads={downloads:,}, stars={stars:,}, score={demand_score}")

    return data_points


def save_data(new_points: list):
    existing = []
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, "r") as f:
            existing = json.load(f)
    existing.extend(new_points)
    existing = existing[-500:]
    with open(DATA_PATH, "w") as f:
        json.dump(existing, f, indent=2)
    print(f"Saved {len(new_points)} points. Total: {len(existing)}")


def load_data() -> pd.DataFrame:
    if not os.path.exists(DATA_PATH):
        return pd.DataFrame()
    with open(DATA_PATH, "r") as f:
        data = json.load(f)
    return pd.DataFrame(data)


# ═══════════════════════════════════════════════
# FEATURE ENGINEERING — 2 modes
# ═══════════════════════════════════════════════

def engineer_features_predictive(df: pd.DataFrame) -> tuple:
    """Predictive mode: use current data to predict NEXT period demand.
    Requires 2+ data points per skill."""
    df = df.copy()

    skill_categories = sorted(df["skill"].unique().tolist())
    enc = OrdinalEncoder(
        categories=[skill_categories],
        handle_unknown="use_encoded_value",
        unknown_value=-1
    )
    df["skill_encoded"] = enc.fit_transform(df[["skill"]])

    feature_columns = ["skill_encoded", "pypi_downloads", "github_stars", "month", "week"]

    df["next_demand"] = df.groupby("skill")["demand_score"].shift(-1)
    df = df.dropna(subset=["next_demand"])

    if len(df) == 0:
        return None, None, None

    return df[feature_columns].values, df["next_demand"].values, enc


def engineer_features_baseline(df: pd.DataFrame) -> tuple:
    """Baseline mode: predict current demand score.
    Works with just 1 data point per skill (first run)."""
    df = df.copy()

    skill_categories = sorted(df["skill"].unique().tolist())
    enc = OrdinalEncoder(
        categories=[skill_categories],
        handle_unknown="use_encoded_value",
        unknown_value=-1
    )
    df["skill_encoded"] = enc.fit_transform(df[["skill"]])

    feature_columns = ["skill_encoded", "pypi_downloads", "github_stars", "month", "week"]

    return df[feature_columns].values, df["demand_score"].values, enc


# ═══════════════════════════════════════════════
# MODEL TRAINING
# ═══════════════════════════════════════════════

def train_model(X, y, mode: str = "baseline") -> dict:
    mlflow.set_experiment("vedha_ai_skill_predictor")

    with mlflow.start_run():
        params = {
            "n_estimators": 300,
            "learning_rate": 0.05,
            "max_depth": 6,
            "subsample": 0.8,
            "colsample_bytree": 0.8,
            "random_state": 42,
            "n_jobs": -1,
        }
        mlflow.log_params({**params, "mode": mode})

        model = XGBRegressor(
            **params,
            objective="reg:squarederror",
            tree_method="hist",
        )

        if len(X) >= 5:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            model.fit(
                X_train,
                y_train,
                eval_set=[(X_test, y_test)],
                verbose=False,
            )
            y_pred = model.predict(X_test)
            mae  = round(float(mean_absolute_error(y_test, y_pred)), 3)
            rmse = round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 3)
            mape = round(float(mean_absolute_percentage_error(y_test, y_pred)), 3)
            r2   = round(float(r2_score(y_test, y_pred)), 3)
            n_train = len(X_train)
        else:
            # Not enough samples for a split — train on everything
            model.fit(X, y)
            mae     = 0.0
            rmse    = 0.0
            mape    = 0.0
            r2      = 1.0
            n_train = len(X)

        mlflow.log_metric("mae", mae)
        mlflow.log_metric("rmse", rmse)
        mlflow.log_metric("mape", mape)
        mlflow.log_metric("r2_score", r2)

        importances  = model.feature_importances_
        feature_names = ["skill", "pypi_downloads", "github_stars", "month", "week"]
        importance_dict = dict(zip(feature_names, importances.tolist()))

        mlflow.sklearn.log_model(model, "skill_predictor_model")
        print(f"Trained! Mode={mode}, MAE={mae}, R2={r2}, Samples={n_train}")

    return {
        "mae": mae,
        "rmse": rmse,
        "mape": mape,
        "r2_score": r2,
        "feature_importance": importance_dict,
        "training_samples": n_train,
        "model": model,
    }


def save_model(model, encoder):
    joblib.dump(model, MODEL_PATH)
    joblib.dump(encoder, ENCODER_PATH)
    print("Model saved!")


def load_model():
    if not os.path.exists(MODEL_PATH):
        return None, None
    return joblib.load(MODEL_PATH), joblib.load(ENCODER_PATH)


# ═══════════════════════════════════════════════
# PREDICTION
# ═══════════════════════════════════════════════

def predict_skill_demand(skill: str, pypi_downloads: int, github_stars: int) -> dict:
    model, encoder = load_model()

    if model is None:
        return {"error": "Model not trained! Call POST /api/predict/train first"}

    known_skills = encoder.categories_[0].tolist()
    if skill not in known_skills:
        return {"error": f"Unknown skill: {skill}"}

    skill_encoded = encoder.transform(pd.DataFrame({"skill": [skill]}))[0][0]
    month = datetime.now().month
    week  = datetime.now().isocalendar()[1]

    features = np.array([[skill_encoded, pypi_downloads, github_stars, month, week]])
    predicted_score = round(float(model.predict(features)[0]), 2)

    if predicted_score >= 75:
        trend          = "🔥 Very Hot — High demand expected"
        recommendation = "Learn this skill immediately!"
    elif predicted_score >= 50:
        trend          = "📈 Growing — Good demand"
        recommendation = "Good investment of your time"
    elif predicted_score >= 25:
        trend          = "→ Stable — Moderate demand"
        recommendation = "Useful but not urgent"
    else:
        trend          = "📉 Declining — Lower demand"
        recommendation = "Focus on other skills first"

    return {
        "skill": skill,
        "predicted_demand_score": predicted_score,
        "trend": trend,
        "recommendation": recommendation,
        "based_on": {"pypi_downloads": pypi_downloads, "github_stars": github_stars},
    }


# ═══════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════

@router.post("/train")
async def train_skill_predictor():
    print("Starting ML pipeline...")

    data_points = await collect_live_data()
    if not data_points:
        return {"error": "Could not collect live data!"}

    save_data(data_points)
    df = load_data()

    X, y, encoder = engineer_features_predictive(df)
    mode = "predictive"

    if X is None or len(X) == 0:
        print("Switching to baseline mode (need more data for predictive)...")
        X, y, encoder = engineer_features_baseline(df)
        mode = "baseline"

    result = train_model(X, y, mode=mode)
    trained_model = result.pop("model")
    save_model(trained_model, encoder)

    return {
        "status": "✅ Model trained successfully!",
        "mode": mode,
        "explanation": (
            "Baseline model — call /train again tomorrow for predictive mode!"
            if mode == "baseline"
            else "Predictive model — forecasting next period demand!"
        ),
        "data_points_total": len(df),
        "metrics": result,
        "mlflow_tracked": True,
        "next": "GET /api/predict/top-skills to see predictions!",
    }


@router.get("/predict-all")
async def predict_all_skills():
    model, encoder = load_model()
    if model is None:
        return {"error": "Call POST /api/predict/train first"}

    print("Fetching live data for all skills...")
    predictions = []

    for skill_name, pypi_package in TRACKED_SKILLS.items():
        github_query = GITHUB_QUERIES.get(skill_name, skill_name.lower())

        downloads, stars = await asyncio.gather(
            fetch_pypi_downloads(pypi_package),
            fetch_github_stars(github_query)
        )

        result = predict_skill_demand(skill_name, downloads, stars)
        if "error" not in result:
            predictions.append(result)

    predictions.sort(key=lambda x: x["predicted_demand_score"], reverse=True)

    return {
        "predictions": predictions,
        "total_skills": len(predictions),
        "generated_at": datetime.now().isoformat(),
        "message": "Live ML predictions for Kerala IT market 2026",
    }


@router.get("/top-skills")
async def get_top_skills():
    model, encoder = load_model()
    if model is None:
        return {"error": "Train model first! POST /api/predict/train"}

    df = load_data()
    if df.empty:
        return {"error": "No data available!"}

    latest = df.sort_values("timestamp").groupby("skill").last().reset_index()

    predictions = []
    for _, row in latest.iterrows():
        result = predict_skill_demand(
            row["skill"],
            int(row["pypi_downloads"]),
            int(row["github_stars"]),
        )
        if "error" not in result:
            predictions.append(result)

    predictions.sort(key=lambda x: x["predicted_demand_score"], reverse=True)
    top_5 = predictions[:5]

    return {
        "top_5_skills_kerala_2026": [
            {
                "rank": i + 1,
                "skill": p["skill"],
                "demand_score": p["predicted_demand_score"],
                "trend": p["trend"],
                "action": p["recommendation"],
            }
            for i, p in enumerate(top_5)
        ],
        "generated_at": datetime.now().isoformat(),
    }


@router.get("/model-status")
def get_model_status():
    model_exists = os.path.exists(MODEL_PATH)
    data_points  = 0

    if os.path.exists(DATA_PATH):
        with open(DATA_PATH) as f:
            data_points = len(json.load(f))

    return {
        "model_trained": model_exists,
        "data_points_collected": data_points,
        "tracked_skills": list(TRACKED_SKILLS.keys()),
        "tip": "Call /train daily — more data = better predictions!",
        "next_steps": (
            "Model ready! Use /predict-all or /top-skills"
            if model_exists
            else "Call POST /train to start!"
        ),
    }