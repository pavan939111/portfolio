import asyncio
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.retrieval import retrieve_chunks, load_local_embeddings

async def test_local_retrieval():
    print("=== TESTING LOCAL HYBRID RETRIEVAL ===")
    
    # Load and check local embeddings JSON
    embeddings = load_local_embeddings()
    if not embeddings:
        print("Error: No local embeddings loaded!")
        return
    print(f"Loaded {len(embeddings)} chunks from local file.")
    
    # Create a dummy query embedding of 1024 dimensions (e.g. all 0s or random values)
    # Let's match the first chunk's embedding exactly to check if it scores 1.0!
    first_chunk = embeddings[0]
    first_embedding = first_chunk["embedding"]
    first_title = first_chunk["title"]
    
    print(f"\n1. Matching first chunk's embedding exactly: \"{first_title}\"")
    results = await retrieve_chunks(
        query_embedding=first_embedding,
        query_text=first_title,
        match_count=3,
        match_threshold=0.1
    )
    
    print(f"Results (top {len(results)}):")
    for r in results:
        print(f" - [{r.section}] Title: \"{r.title}\" | Score: {r.similarity}")
        
    # Test a general query text with all 0s embedding
    dummy_emb = [0.0] * 1024
    print("\n2. Testing keyword matching only (with all-zero embedding) for \"FailureRAG\":")
    results = await retrieve_chunks(
        query_embedding=dummy_emb,
        query_text="Tell me about FailureRAG",
        match_count=3,
        match_threshold=0.1
    )
    
    print(f"Results (top {len(results)}):")
    for r in results:
        print(f" - [{r.section}] Title: \"{r.title}\" | Score: {r.similarity}")

if __name__ == "__main__":
    asyncio.run(test_local_retrieval())
