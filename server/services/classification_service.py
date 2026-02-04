import torch
import torch.nn as nn
import librosa
import numpy as np
import os
import tempfile
from moviepy import VideoFileClip   # ✅ correct import

# --- 1. Model Architecture ---
class GenreClassifierCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.fc1 = nn.Linear(128 * 16 * 16, 512)
        self.dropout = nn.Dropout(0.5)
        self.fc2 = nn.Linear(512, num_classes)

    def forward(self, x):
        x = self.pool(torch.relu(self.conv1(x)))
        x = self.pool(torch.relu(self.conv2(x)))
        x = self.pool(torch.relu(self.conv3(x)))
        x = x.view(x.size(0), -1)
        x = torch.relu(self.fc1(x))
        x = self.dropout(x)
        return self.fc2(x)

# --- 2. Model Loading ---
GENRES = [
    "rock", "reggae", "pop", "metal", "jazz",
    "hiphop", "disco", "country", "classical", "blues"
]

MODEL_PATH = "music_genre_model.pth"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = GenreClassifierCNN(num_classes=len(GENRES))
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

# --- 3. Core Prediction (TOP-3 LOGIC ADDED) ---
def _predict_genre(audio_path: str):
    audio, sr = librosa.load(audio_path, duration=30)

    mel = librosa.feature.melspectrogram(
        y=audio,
        sr=sr,
        n_mels=128
    )

    log_mel = librosa.power_to_db(mel, ref=np.max)

    # Pad / trim to 128x128
    if log_mel.shape[1] < 128:
        log_mel = np.pad(
            log_mel,
            ((0, 0), (0, 128 - log_mel.shape[1]))
        )
    else:
        log_mel = log_mel[:, :128]

    tensor = (
        torch.from_numpy(log_mel)
        .float()
        .unsqueeze(0)
        .unsqueeze(0)
        .to(device)
    )

    with torch.no_grad():
        output = model(tensor)
        probs = torch.softmax(output, dim=1)[0]  # shape: (10,)

    # 🔥 Top-3 predictions
    top_probs, top_indices = torch.topk(probs, k=3)

    top_3_genres = []
    for prob, idx in zip(top_probs, top_indices):
        top_3_genres.append({
            "genre": GENRES[idx.item()],
            "confidence": float(prob.item())
        })

    # Top-1 (for backward compatibility)
    best_genre = top_3_genres[0]

    return {
        "genre": best_genre["genre"],
        "confidence": best_genre["confidence"],
        "top_3_genres": top_3_genres,
        "has_audio": True
    }

# --- 4. Public API Functions ---

async def classify_audio_genre(contents: bytes):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(contents)
        path = tmp.name

    try:
        return _predict_genre(path)
    except Exception:
        return {
            "genre": None,
            "confidence": 0,
            "top_3_genres": [],
            "has_audio": False
        }
    finally:
        if os.path.exists(path):
            os.remove(path)


async def classify_video_genre(contents: bytes):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(contents)
        video_path = tmp.name

    audio_path = video_path + ".wav"
    video = None

    try:
        video = VideoFileClip(video_path)

        # ✅ Silent video detection
        if video.audio is None:
            return {
                "genre": None,
                "confidence": 0,
                "top_3_genres": [],
                "has_audio": False
            }

        video.audio.write_audiofile(audio_path, logger=None)
        video.close()

        return _predict_genre(audio_path)

    except Exception:
        return {
            "genre": None,
            "confidence": 0,
            "top_3_genres": [],
            "has_audio": False
        }

    finally:
        if video:
            try:
                video.close()
            except:
                pass
        for p in [video_path, audio_path]:
            if os.path.exists(p):
                os.remove(p)
