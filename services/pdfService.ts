
import * as pdfjsLib from 'pdfjs-dist';

// Explicitly set the worker source to the esm.sh version matching the importmap
// This prevents 404s when the library tries to load the worker from a relative path or cdnjs
const WORKER_URL = 'https://esm.sh/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;

export const configurePdfWorker = () => {
    if (pdfjsLib.GlobalWorkerOptions.workerSrc !== WORKER_URL) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
    }
};

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    configurePdfWorker();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += `\n--- Page ${i} ---\n${pageText}`;
    }

    return fullText;
  } catch (error) {
    console.error("PDF Parse Error:", error);
    return "Error extracting text from PDF. Please ensure it is a valid text-based PDF.";
  }
};
