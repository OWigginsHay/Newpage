import PDFOCR
import ImageOCR
import SentenceEmbedder from transformers
import chromadb

def setup_chromadb_persist():
    ...

def scan_image():
    ...

def ocr_file():
    ...

def get_file_content(path):
    pages_text = []
    pages_image_extractions = []
    with open(filename) as f:
        doc = ocr_file(f)
        for page in doc:
            pages_text.append(page)
            if page.empty and page.has_image:
                image_data = scan_image(page.images)
                pages_image_extractions.append(page)
    return pages_text.join + pages_image_extractions.join

def get_embedding():
    ...

def chunk_file():
    full_contents = get_file_content()
    while not_finished:
        embedded_chunk = get_embedding(full_contents[i:i+window])
        chroma.add(embedded_chunk)
        i+=i-overlap

def get_file():
    ...