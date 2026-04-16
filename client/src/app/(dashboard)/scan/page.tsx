"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ScanPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedDates, setExtractedDates] = useState<string[]>([]);
  const [extractedText, setExtractedText] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImage(url);
    setExtractedDates([]);
    setExtractedText("");
    setIsProcessing(true);
    setProgress(0);

    try {
      const Tesseract = await import("tesseract.js");
      const worker = await Tesseract.createWorker("eng", undefined, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(file);
      setExtractedText(data.text);

      // Extract dates from text
      const dates = extractDatesFromText(data.text);
      setExtractedDates(dates);

      await worker.terminate();
    } catch (error) {
      console.error("OCR failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const extractDatesFromText = (text: string): string[] => {
    const patterns = [
      /\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})\b/g,
      /\b(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})\b/g,
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(\d{1,2}),?\s+(\d{4})\b/gi,
      /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(\d{4})\b/gi,
    ];

    const found = new Set<string>();
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        try {
          const dateStr = match[0];
          const parsed = new Date(dateStr);
          if (!isNaN(parsed.getTime()) && parsed.getFullYear() > 2000) {
            found.add(parsed.toISOString().split("T")[0]);
          }
        } catch {
          // skip unparseable dates
        }
      }
    }

    return Array.from(found).sort();
  };

  const useDate = (date: string) => {
    router.push(`/items/new?expiryDate=${date}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Scan Document</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload a receipt or document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {!image ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">Click to upload an image</p>
            </button>
          ) : (
            <div className="space-y-4">
              <img src={image} alt="Scanned document" className="w-full rounded-lg border" />

              {isProcessing && (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  <div className="flex-1">
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-2 bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{progress}%</span>
                </div>
              )}

              {!isProcessing && extractedDates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Found {extractedDates.length} date(s):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {extractedDates.map((date) => (
                      <Button
                        key={date}
                        variant="outline"
                        size="sm"
                        onClick={() => useDate(date)}
                      >
                        {date} &rarr; Use as expiry
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {!isProcessing && extractedDates.length === 0 && extractedText && (
                <p className="text-sm text-gray-500">No dates found in the document.</p>
              )}

              {extractedText && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                    View extracted text
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-50 rounded text-xs whitespace-pre-wrap max-h-48 overflow-auto">
                    {extractedText}
                  </pre>
                </details>
              )}

              <Button variant="outline" onClick={() => { setImage(null); setExtractedDates([]); setExtractedText(""); }}>
                Scan Another
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
