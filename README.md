# 🎵 GenreLab: AI Media Classification Engine 🎬

GenreLab is a high-performance web application that uses Deep Learning (CNN) to classify the musical genre of audio and video files in real-time. Featuring a "Local-First" architecture with **IndexedDB** for persistent media storage and a sleek, dark-themed dashboard.

---

## 🚀 Key Features

- **Dual Media Support:** Classify both `.wav/.mp3` and `.mp4/.mov` files.
- **Deep Learning Engine:** Powered by a PyTorch Convolutional Neural Network (CNN) trained on the GTZAN dataset.
- **Persistent History:** Uses **IndexedDB** to save media files and analysis results locally—your data stays in your browser.
- **Bulk Export:** Export your entire session as a **JSON** metadata file or a **ZIP bundle** containing media, analysis data, and a summary report.
- **Premium UI/UX:** Responsive design with dynamic Donut Charts, high-contrast dark mode, and smooth motion effects.

---

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Tailwind CSS, JSZip.
**Backend:** FastAPI (Python 3.10+), PyTorch, Librosa (Audio Processing).
**Database:** IndexedDB (Browser Media Storage), LocalStorage (Metadata).

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MauryaShiva/media-genre-classifier.git
cd media-genre-classifier

```

### 2. Backend Setup (FastAPI)

It is recommended to use a virtual environment.

```bash
cd server
python -m venv venv

# Windows
source venv/Scripts/activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

```

**Run Backend:**

```bash
uvicorn main:app --reload --port 8000

```

### 3. Frontend Setup (pnpm)

```bash
cd client
pnpm install

```

**Run Frontend:**

```bash
pnpm run dev

```

_The app will be available at `http://localhost:5173`._

---
