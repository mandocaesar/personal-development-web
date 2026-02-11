#!/usr/bin/env python3
import sys

try:
    import PyPDF2
except ImportError:
    print("PyPDF2 not installed. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf2", "--quiet"])
    import PyPDF2

# Read the PDF file
pdf_path = "/home/armand/Work/tools/skill-tracker/docs/SWEG-HR - Engineering Competencies-070226-233536.pdf"

with open(pdf_path, 'rb') as pdf_file:
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    print(text)
