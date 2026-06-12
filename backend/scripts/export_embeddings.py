import sys
import os
import json
import asyncio

# Add parent directory to path
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

from dotenv import load_dotenv
load_dotenv()

from services.retrieval import get_supabase_client

async def export_embeddings():
    client = get_supabase_client()
    if client is None:
        print("Error: Supabase client is not configured!")
        return

    print("Fetching chunks with embeddings from Supabase...")
    try:
        result = client.table("portfolio_chunks").select("id, section, title, content, metadata, embedding").execute()
        
        if not result.data:
            print("No chunks found in Supabase!")
            return

        print(f"Fetched {len(result.data)} chunks.")
        
        # Save to JSON
        output_dir = "data"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, "knowledgeBaseEmbeddings.json")
        
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(result.data, f, ensure_ascii=False, indent=2)
            
        print(f"Saved local embeddings file to {output_path}")
    except Exception as e:
        print(f"Error exporting embeddings: {e}")

if __name__ == "__main__":
    asyncio.run(export_embeddings())
