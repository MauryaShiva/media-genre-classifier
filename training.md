Got you, Shiva. Below is your content properly converted into a clean **GitHub `README.md` format**. You can directly copy-paste this into `README.md`.

---

```md
# 🧠 GenreLab — Model Training Guide

This document explains how the **GenreLab Deep Learning model** was trained and how you can reproduce or retrain it yourself.

---

## ⚠️ Important Notice

A **pre-trained model is already included** in this repository:
```

server/music_genre_model.pth

```

You **DO NOT need to train the model** to run the application.

Only train if you want to:

- Retrain with custom dataset
- Improve accuracy
- Experiment with architecture
- Reproduce research

---

## 📊 Dataset — GTZAN Music Genre Dataset

GenreLab is trained using the **GTZAN Dataset**, a standard benchmark for **Music Genre Classification**.

**Download Dataset:**

https://www.kaggle.com/datasets/andradaolteanu/gtzan-dataset-music-genre-classification

### Dataset Details

- 1000 audio files
- Each file = 30 seconds
- 10 Genres:

```

Blues
Classical
Country
Disco
Hiphop
Jazz
Metal
Pop
Reggae
Rock

```

---

## 📂 Dataset Folder Setup (IMPORTANT)

After downloading, extract dataset into:

```

training/genres_original/

```

Final structure must look like:

```

training/
├── genres_original/
│ ├── blues/
│ ├── classical/
│ ├── country/
│ ├── disco/
│ ├── hiphop/
│ ├── jazz/
│ ├── metal/
│ ├── pop/
│ ├── reggae/
│ └── rock/

```

---

## 🧩 Training Environment

Training can run on:

- Google Colab (**Recommended**)
- Local Machine (CPU/GPU)

**Python Version:**

```

Python 3.10+

````

---

## 📦 Install Training Dependencies

From project root:

```bash
cd training
pip install -r requirements_training.txt
````

---

## 🚀 Start Training

Run:

```bash
python train_model.py
```

Training will:

- Load dataset
- Convert audio → Mel Spectrogram
- Train CNN model
- Evaluate accuracy
- Save trained model

---

## 💾 Model Output

After training completes:

```
music_genre_model.pth
```

Move this file into:

```
server/music_genre_model.pth
```

This file is used by the **FastAPI backend**.

---

## 🏗️ Model Architecture

GenreLab uses a **Custom CNN (PyTorch)**:

| Layer   | Type           | Details          |
| ------- | -------------- | ---------------- |
| Conv1   | Conv2D         | 32 filters, 3x3  |
| Pool    | MaxPool        | 2x2              |
| Conv2   | Conv2D         | 64 filters, 3x3  |
| Conv3   | Conv2D         | 128 filters, 3x3 |
| FC1     | Dense          | 512 neurons      |
| Dropout | Regularization | 0.5              |
| FC2     | Output         | 10 classes       |

---

## ⚙️ Training Configuration

- Optimizer: **Adam**
- Learning Rate: **0.001**
- Loss Function: **CrossEntropy**
- Epochs: **50**
- Input: **128×128 Mel Spectrogram**

---

## 📈 Training Output

During training you will see:

- Loss decreasing
- Accuracy increasing
- Final accuracy printed in terminal
- Graph of Loss vs Accuracy

---

## 💡 Tips for Better Accuracy

- Train for more epochs (70–100)
- Use GPU (**Colab T4 recommended**)
- Normalize audio
- Add data augmentation
- Increase dataset size

---

## ❌ Dataset Not Included

The dataset (~1.1GB) is **NOT included** due to GitHub size limits.

You must download manually from Kaggle and place in:

```
training/genres_original/
```

---

## 📜 License

MIT License
Copyright (c) 2026 Shiva Maurya

---

## 👨‍💻 Author

**Shiva Maurya**
GenreLab — AI Media Classification Engine

```

```
