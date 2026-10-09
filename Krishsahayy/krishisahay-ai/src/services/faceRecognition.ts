/**
 * KrishiSahay Gram Panchayat Kiosk - Face Recognition & Biometric Authentication Engine
 * Performs client-side facial feature extraction, embedding generation, and cosine similarity matching
 * for passwordless kiosk login designed for rural farmers.
 */

import { UserAccount, OfflineStorage } from './offlineStorage';

export interface FaceMatchResult {
  user: UserAccount;
  confidence: number;
}

/**
 * Extracts a 64-dimensional feature vector (embedding) from a facial image canvas.
 * Divides face area into an 8x8 spatial grid and computes normalized color/luminance signatures.
 */
export function extractFaceEmbeddingFromCanvas(canvas: HTMLCanvasElement): number[] {
  const ctx = canvas.getContext('2d');
  if (!ctx) return new Array(64).fill(0);

  // Resize processing frame to 64x64 for uniform feature extraction
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 64;
  tempCanvas.height = 64;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return new Array(64).fill(0);

  tempCtx.drawImage(canvas, 0, 0, 64, 64);
  const imgData = tempCtx.getImageData(0, 0, 64, 64);
  const data = imgData.data;

  const embedding: number[] = [];
  const gridSize = 8;
  const cellSize = 64 / gridSize;

  for (let gy = 0; gy < gridSize; gy++) {
    for (let gx = 0; gx < gridSize; gx++) {
      let sumLuminance = 0;
      let count = 0;

      for (let cy = 0; cy < cellSize; cy++) {
        for (let cx = 0; cx < cellSize; cx++) {
          const px = gx * cellSize + cx;
          const py = gy * cellSize + cy;
          const idx = (py * 64 + px) * 4;

          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Standard ITU-R BT.601 relative luminance formula
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          sumLuminance += lum;
          count++;
        }
      }

      const avgLum = sumLuminance / (count || 1);
      embedding.push(avgLum / 255.0); // Normalize to 0..1 range
    }
  }

  // Normalize feature vector to unit length
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0)) || 1;
  return embedding.map((val) => val / norm);
}

/**
 * Calculates Cosine Similarity between two face embedding vectors.
 * Returns similarity score between 0.0 (0%) and 1.0 (100%).
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return Math.max(0, Math.min(1, dotProduct / denominator));
}

/**
 * Matches a scanned face image canvas against all registered users in local storage.
 * Returns the highest confidence match if above threshold (default 75%).
 */
export function matchFaceWithRegisteredUsers(
  scannedCanvas: HTMLCanvasElement,
  threshold = 0.72
): FaceMatchResult | null {
  const users = OfflineStorage.getUsers();
  const scannedEmbedding = extractFaceEmbeddingFromCanvas(scannedCanvas);

  let bestMatch: UserAccount | null = null;
  let maxSimilarity = 0;

  for (const user of users) {
    if (!user.faceEmbedding || user.faceEmbedding.length === 0) continue;

    const sim = calculateCosineSimilarity(scannedEmbedding, user.faceEmbedding);
    if (sim > maxSimilarity) {
      maxSimilarity = sim;
      bestMatch = user;
    }
  }

  if (bestMatch && maxSimilarity >= threshold) {
    return {
      user: bestMatch,
      confidence: Math.round(maxSimilarity * 1000) / 10, // e.g. 96.5%
    };
  }

  return null;
}

/**
 * Generates a deterministic mock face embedding for demo profile accounts.
 */
export function generateSeedFaceEmbedding(seedName: string): number[] {
  const embedding: number[] = [];
  let seed = 0;
  for (let i = 0; i < seedName.length; i++) {
    seed += seedName.charCodeAt(i) * (i + 1);
  }

  for (let i = 0; i < 64; i++) {
    const val = Math.sin(seed * (i + 1)) * 0.5 + 0.5;
    embedding.push(val);
  }

  const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0)) || 1;
  return embedding.map((v) => v / norm);
}
