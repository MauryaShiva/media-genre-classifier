# 🧠 GenreLab: Model Training & Architecture

This document provides a detailed overview of the Deep Learning pipeline used to power the **GenreLab** classification engine.

---

## ✅ Pre-Trained Model Included

**Important:** You do **not** need to run this training code to use GenreLab. A high-performance, pre-trained model file (`music_genre_model.pth`) is already included in the `server/music_genre_model.pth` directory for immediate use.

Only follow the steps below if you wish to:

1. Retrain the model with a custom dataset.
2. Experiment with different CNN architectures.
3. Verify the research methodology.

## 📊 Dataset: GTZAN Genre Collection

The model is trained on the industry-standard **GTZAN Dataset**, the most famous public dataset for Music Genre Classification (MGC).

- **Dataset Source:** [Kaggle - GTZAN Dataset](https://www.kaggle.com/datasets/andradaolteanu/gtzan-dataset-music-genre-classification)
- **Content:** 1,000 audio tracks (30 seconds each).
- **Genres (10 classes):** Blues, Classical, Country, Disco, Hiphop, Jazz, Metal, Pop, Reggae, and Rock.

---

## 🛠️ Training Workflow

The training process is optimized for **Google Colab** using GPU acceleration.

### 1. Preprocessing (Feature Extraction)

We do not feed raw audio into the CNN. Instead, we convert audio signals into visual representations:

- **Audio Loading:** Tracks are sampled at **22,050 Hz**.
- **Mel Spectrograms:** Generated using `librosa`, converting power to a log scale (decibels) to create a "heat map" of frequencies over time.
- **Normalization:** Spectrograms are resized to a consistent **128x128** pixel shape.

### 2. CNN Model Architecture

The engine uses a Custom Convolutional Neural Network (CNN) implemented in **PyTorch**:

| Layer       | Type            | Details                         |
| :---------- | :-------------- | :------------------------------ |
| **Conv1**   | Convolutional   | 32 Filters, 3x3 Kernel          |
| **Pool**    | Max Pooling     | 2x2 Stride                      |
| **Conv2**   | Convolutional   | 64 Filters, 3x3 Kernel          |
| **Conv3**   | Convolutional   | 128 Filters, 3x3 Kernel         |
| **FC1**     | Fully Connected | 512 Neurons with ReLU           |
| **Dropout** | Regularization  | 0.5 Rate (Prevents Overfitting) |
| **FC2**     | Output Layer    | 10 Classes (Softmax ready)      |

### 3. Hyperparameters

- **Optimizer:** Adam ($\alpha = 0.001$)
- **Loss Function:** Cross-Entropy Loss
- **Epochs:** 50
- **Batch Size:** Dynamic based on memory

---

## 🚀 How to Train On Google Colab (Recommended for GPU Access)

1. **Upload to Colab:** Open the `training/train_model.ipynb` in [Google Colab](https://colab.research.google.com/).
2. **Mount Google Drive:** Ensure your dataset is stored in `/MyDrive/Colab_Datasets/Data/genres_original`.
3. **Execute Training:** Run all cells to process features and begin the training loop.
4. **Export Model:** The script will output `music_genre_model.pth`. Move this file to the `server/music_genre_model.pth` directory of the main project.

---

## 🚀 How to Train On a Local Machine (Recommended for Desktop)

**Navigate to Training Directory**
Open your terminal inside the `training/` folder.

```bash
cd training
```

### Setup Virtual Environment

```bash
python -m venv venv
```

**Windows**

```bash
venv\Scripts\activate
```

**Linux / Mac**

```bash
source venv/bin/activate
```

**Install Dependencies**

```bash
pip install -r requirements_training.txt
```

**Run Script :** Execute `python train_model.py` to start the local training process.

---

## 📜 License

MIT License
Copyright (c) 2026 Shiva Maurya

👨‍💻 Author

Shiva Maurya
GenreLab — AI Media Classification Engine
