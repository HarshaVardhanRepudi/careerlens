"""
Resume text extraction from PDF and DOCX files.
No paid APIs — runs entirely locally.
"""
import PyPDF2
import docx
import io


def extract_text(file_bytes: bytes, filename: str) -> str:
    """Extract plain text from PDF or DOCX file bytes."""
    fname = filename.lower()
    if fname.endswith(".pdf"):
        return _extract_pdf(file_bytes)
    elif fname.endswith(".docx"):
        return _extract_docx(file_bytes)
    else:
        raise ValueError("Unsupported file type. Please upload a PDF or DOCX file.")


def _extract_pdf(file_bytes: bytes) -> str:
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        pages = [page.extract_text() or "" for page in reader.pages]
        text = "\n".join(pages).strip()
        if not text:
            raise ValueError("Could not extract text from PDF. The file may be image-based.")
        return text
    except Exception as e:
        raise ValueError(f"PDF extraction failed: {str(e)}")


def _extract_docx(file_bytes: bytes) -> str:
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        text = "\n".join(paragraphs).strip()
        if not text:
            raise ValueError("Could not extract text from DOCX. The file may be empty.")
        return text
    except Exception as e:
        raise ValueError(f"DOCX extraction failed: {str(e)}")
