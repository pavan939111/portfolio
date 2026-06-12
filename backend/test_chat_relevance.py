import urllib.request
import urllib.error
import json
import time

url = "http://127.0.0.1:8000/api/chat"
headers = {"Content-Type": "application/json"}

def send_chat_query(query: str):
    print(f"\nQUERY: \"{query}\"")
    data = {
        "message": query,
        "history": []
    }
    req_data = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=req_data, headers=headers, method="POST")
    
    try:
        start_time = time.time()
        with urllib.request.urlopen(req, timeout=15) as response:
            status = response.status
            body = response.read().decode("utf-8")
            elapsed = time.time() - start_time
            print(f"Status: {status} | Latency: {elapsed:.2f}s")
            
            parsed = json.loads(body)
            print("RESPONSE:")
            print(parsed.get("response", ""))
            
            thoughts = parsed.get("thoughts", [])
            if thoughts:
                print("THOUGHTS PATH:")
                for step in thoughts:
                    print(f" - [{step.get('step')}] {step.get('message')}")
            return parsed
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code}")
        print(e.read().decode("utf-8"))
    except Exception as e:
        print(f"Failed: {e}")
    return None

if __name__ == "__main__":
    print("=== TESTING RAG CHATBOT BEHAVIOR ===")
    
    # 1. Off-topic query
    send_chat_query("Can you give me a recipe for baking chocolate chip cookies?")
    
    time.sleep(1)
    
    # 2. Short direct query
    send_chat_query("What is your CGPA?")
    
    time.sleep(1)
    
    # 3. Unlisted project query
    send_chat_query("Have you built any blockchain or crypto apps?")
    
    time.sleep(1)
    
    # 4. Related query lacking exact context
    send_chat_query("How would you design a high-throughput data processing architecture?")
