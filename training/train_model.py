import os
import time
import librosa
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split

# --- 1. CONFIGURATION ---
# Set paths to be relative or configurable via environment variables
BASE_PATH = os.getenv('DATASET_PATH', './data/genres_original')
MODEL_SAVE_PATH = 'music_genre_model.pth'
NUM_CLASSES = 10
EPOCHS = 50
LEARNING_RATE = 0.001

# --- 2. DATA PREPROCESSING ---
def extract_features(file_path):
    """
    Loads an audio file and converts it into a Mel Spectrogram.
    """
    try:
        # Load audio file (30 seconds) at standard sampling rate (22050Hz)
        audio, sr = librosa.load(file_path, duration=30)
        
        # Generate Mel Spectrogram (n_mels=128 defines height)
        spectrogram = librosa.feature.melspectrogram(y=audio, sr=sr, n_mels=128)
        
        # Convert power to decibels (log scale)
        log_spectrogram = librosa.power_to_db(spectrogram, ref=np.max)
        return log_spectrogram
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def load_dataset(base_path):
    X, y = [], []
    if not os.path.exists(base_path):
        raise FileNotFoundError(f"Dataset path not found: {base_path}")
        
    genres = [g for g in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, g))]
    print(f"Total genres found: {len(genres)}")

    for label_idx, genre_name in enumerate(genres):
        genre_folder = os.path.join(base_path, genre_name)
        print(f"Processing genre: {genre_name}...")

        for file_name in os.listdir(genre_folder):
            if not file_name.endswith(".wav"):
                continue

            file_path = os.path.join(genre_folder, file_name)
            features = extract_features(file_path)

            if features is not None and features.shape[1] >= 128:
                # Resize/Crop to exactly 128x128 for the CNN input
                X.append(features[:, :128])
                y.append(label_idx)
    
    X = np.array(X)
    y = np.array(y)
    # Add channel dimension: (Samples, Channels, Height, Width)
    X = X.reshape(X.shape[0], 1, X.shape[1], X.shape[2])
    return X, y

# --- 3. MODEL ARCHITECTURE ---
class GenreClassifierCNN(nn.Module):
    def __init__(self, num_classes=10):
        super(GenreClassifierCNN, self).__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, stride=1, padding=1)
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1)
        
        # Input size: 128 channels * (128/2/2/2 = 16) * (16)
        self.fc1 = nn.Linear(128 * 16 * 16, 512)
        self.dropout = nn.Dropout(0.5)
        self.fc2 = nn.Linear(512, num_classes)

    def forward(self, x):
        x = self.pool(torch.relu(self.conv1(x)))
        x = self.pool(torch.relu(self.conv2(x)))
        x = self.pool(torch.relu(self.conv3(x)))
        x = x.view(-1, 128 * 16 * 16)  # Flatten
        x = torch.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

# --- 4. MAIN TRAINING EXECUTION ---
def train():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on device: {device}")

    # Load and Split Data
    X, y = load_dataset(BASE_PATH)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    X_train = torch.from_numpy(X_train).float().to(device)
    y_train = torch.from_numpy(y_train).long().to(device)
    X_test = torch.from_numpy(X_test).float().to(device)
    y_test = torch.from_numpy(y_test).long().to(device)

    # Initialize Model
    model = GenreClassifierCNN(num_classes=NUM_CLASSES).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

    # Training Loop
    train_losses, test_accuracies = [], []
    start_time = time.time()

    for epoch in range(EPOCHS):
        model.train()
        outputs = model(X_train)
        loss = criterion(outputs, y_train)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        train_losses.append(loss.item())

        model.eval()
        with torch.no_grad():
            test_outputs = model(X_test)
            _, predicted = torch.max(test_outputs.data, 1)
            correct = (predicted == y_test).sum().item()
            accuracy = 100 * correct / y_test.size(0)
            test_accuracies.append(accuracy)

        if (epoch + 1) % 5 == 0:
            print(f"Epoch [{epoch+1}/{EPOCHS}] | Loss: {loss.item():.4f} | Accuracy: {accuracy:.2f}%")

    print(f"\nTraining Complete! Time: {(time.time() - start_time)/60:.2f} minutes")

    # Save Model
    torch.save(model.state_dict(), MODEL_SAVE_PATH)
    print(f"Success! Model saved as: {MODEL_SAVE_PATH}")

    # Plot Results
    plt.figure(figsize=(12, 5))
    plt.subplot(1, 2, 1)
    plt.plot(train_losses, color='red', label='Loss')
    plt.title('Loss History')
    plt.legend()
    plt.subplot(1, 2, 2)
    plt.plot(test_accuracies, color='blue', label='Accuracy')
    plt.title('Accuracy History')
    plt.legend()
    plt.show()

if __name__ == "__main__":
    train()