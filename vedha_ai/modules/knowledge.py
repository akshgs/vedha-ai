from fastapi import APIRouter,HTTPException,UploadFile,File
from pydantic import BaseModel
from utils.vector_store import add_documents, search, get_stats
import PyPDF2
import io 

router=APIRouter()

def split_into_chunks(text:str,chunk_size:int=500)->list[str]:
    text=" ".join(text.split())
    chunks=[]

    for i in range(0,len(text),chunk_size):
        chunk=text[i:i+chunk_size].strip()
        if len(chunk)>100:
            chunks.append(chunk)
    return chunks

def extract_text_from_pdf(file_bytes: bytes) -> str:
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    full_text = ""
    for page in pdf_reader.pages:
        page_text=page.extract_text()
        if page_text:
            full_text+=page_text+" "


    return full_text

class TextInput(BaseModel):
    text:str
    label:str='user input'
class QueryInput(BaseModel):
    question:str
    top_k:int=3


@router.post("/add_text")
def add_text(data:TextInput):
    if len(data.text.strip())<50:
        raise HTTPException(status_code=400,detail="Text too short! Minimum 50 characters required.")
    chunks=split_into_chunks(data.text)
    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="Could not extract content from text."
        )
    add_documents(chunks)

    return {
        "message":    f" Added to knowledge base!",
        "label":      data.label,
        "chunks_added": len(chunks),
        "tip":        "Now ask the chatbot questions about this content!"
    }

@router.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    
    file_bytes = await file.read()
    if len(file_bytes) >5*1024*1024:
        raise HTTPException(status_code=400, detail="File too large! Max 5MB allowed.")     
    try:
        text=extract_text_from_pdf(file_bytes)
    except Exception:
        raise HTTPException(status_code=400, detail="Error processing PDF file.")   
    if len(text.strip())<50:
        raise HTTPException(status_code=400, detail="Extracted text too short! Minimum 50 characters required.")    
    
    chunks=split_into_chunks(text)
    add_documents(chunks)

    return {
        "message":      f"PDF processed successfully!",
        "filename":     file.filename,
        "text_length":  len(text),
        "chunks_added": len(chunks),
        "tip":          "Now chat about this PDF content!"
    }

@router.post("/upload_text")
async def upload_txt(file: UploadFile = File(...)):
    
    if not file.filename.endswith(".txt"):
        raise HTTPException(
            status_code=400,
            detail="Only .txt files allowed here!"
        )

    file_bytes = await file.read()

    try:
        text = file_bytes.decode("utf-8")
    except UnicodeDecodeError:
        text = file_bytes.decode("latin-1")

    chunks = split_into_chunks(text)
    add_documents(chunks)

    return {
        "message":      " Text file added to knowledge base!",
        "filename":     file.filename,
        "chunks_added": len(chunks)
    }
@router.post("/search")
def search_knowledge(data: QueryInput):
    
    results = search(data.question, top_k=data.top_k)

    if not results:
        return {
            "question": data.question,
            "results":  [],
            "message":  "No relevant content found. Upload some documents first!"
        }

    return {
        "question": data.question,
        "results":  results,
        "count":    len(results)
    }


@router.get("/stats")
def knowledge_stats():
    """
    Knowledge base-à´¨àµà´±àµ† current status à´•à´¾à´£àµà´¨àµà´¨àµ.
    """
    return get_stats()
