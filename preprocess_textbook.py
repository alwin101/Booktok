#!/usr/bin/env python3
"""
Preprocess a PDF textbook into JSON chunks of text.

Usage:
    python preprocess_textbook.py input.pdf -o excerpts.json --words 300
"""
import argparse
import json
import re
from pathlib import Path
from typing import List, Dict, Any

try:
    import PyPDF2
except ImportError:
    print("Error: PyPDF2 is required. Install it with: pip install PyPDF2")
    exit(1)

def clean_text(text: str) -> str:
    """Clean and normalize text."""
    # Replace multiple whitespace with single space
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters except basic punctuation
    text = re.sub(r'[^\w\s.,;:!?\-\n]', '', text)
    return text.strip()

def split_into_chunks(text: str, words_per_chunk: int = 300) -> List[str]:
    """Split text into chunks of approximately words_per_chunk words."""
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), words_per_chunk):
        chunk = ' '.join(words[i:i + words_per_chunk])
        chunks.append(chunk)
    
    return chunks

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from a PDF file."""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
        exit(1)
    
    return clean_text(text)

def main():
    parser = argparse.ArgumentParser(description='Convert PDF textbook to JSON chunks')
    parser.add_argument('input', help='Input PDF file')
    parser.add_argument('-o', '--output', default='excerpts.json', 
                      help='Output JSON file (default: excerpts.json)')
    parser.add_argument('--words', type=int, default=300,
                      help='Target words per chunk (default: 300)')
    
    args = parser.parse_args()
    
    print(f"Extracting text from {args.input}...")
    text = extract_text_from_pdf(args.input)
    
    print(f"Splitting into ~{args.words} word chunks...")
    chunks = split_into_chunks(text, args.words)
    
    # Create list of excerpts with IDs
    excerpts = [{"id": i, "text": chunk} for i, chunk in enumerate(chunks, 1)]
    
    print(f"Saving {len(excerpts)} excerpts to {args.output}...")
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(excerpts, f, ensure_ascii=False, indent=2)
    
    print("Done!")

if __name__ == "__main__":
    main()
