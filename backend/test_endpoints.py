import urllib.request
import urllib.error
import json

base_url = "http://127.0.0.1:8000/api"

def test_endpoint(name, path, method="GET", data=None, expected_status=None, return_headers=False):
    print(f"\n--- Testing {name} ({method} {path}) ---")
    url = f"{base_url}{path}"
    headers = {"Content-Type": "application/json"}
    
    req_data = None
    if data is not None:
        req_data = json.dumps(data).encode("utf-8")
        
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read().decode("utf-8")
            print(f"Status Code: {status}")
            if return_headers:
                print("Response Headers:")
                for k, v in response.getheaders():
                    if k.lower().startswith("access-control-"):
                        print(f"  {k}: {v}")
            else:
                print("Response:")
                try:
                    parsed = json.loads(body)
                    print(json.dumps(parsed, indent=2)[:1000])
                    if len(body) > 1000:
                        print("... [TRUNCATED]")
                except Exception:
                    print(body)
            if expected_status and status != expected_status:
                print(f"❌ Expected status {expected_status}, got {status}")
                return False
            return True
    except urllib.error.HTTPError as e:
        print(f"Status Code: {e.code}")
        body = e.read().decode("utf-8")
        print(f"Error Response: {body}")
        if expected_status and e.code != expected_status:
            print(f"❌ Expected status {expected_status}, got {e.code}")
            return False
        return True
    except Exception as e:
        print(f"FAILED: {e}")
        return False

# 1. Health Endpoint
test_endpoint("Health Check", "/health", expected_status=200)

# 2. Projects Endpoint
test_endpoint("Projects", "/projects", expected_status=200)

# 3. Telemetry Endpoint
test_endpoint("Telemetry", "/telemetry", expected_status=200)

# 4. Chat Endpoint (Query and Session mapping)
chat_data = {
    "query": "What projects has Pavan built?",
    "sessionId": "test-session-123",
    "history": []
}
test_endpoint("Chat RAG", "/chat", method="POST", data=chat_data, expected_status=200)

# 5. Empty Message Validation (Expected: 422 Unprocessable Entity)
empty_chat_data = {
    "message": "",
    "history": []
}
test_endpoint("Empty Message Validation", "/chat", method="POST", data=empty_chat_data, expected_status=422)

# 6. CORS Headers Check (CORS OPTIONS preflight request)
print("\n--- Testing CORS Headers (OPTIONS /chat) ---")
cors_url = f"{base_url}/chat"
cors_req = urllib.request.Request(
    cors_url,
    method="OPTIONS",
    headers={
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type"
    }
)
try:
    with urllib.request.urlopen(cors_req) as response:
        print(f"Status Code: {response.status}")
        print("CORS Headers Present:")
        found_cors = False
        for k, v in response.getheaders():
            if k.lower().startswith("access-control-"):
                print(f"  {k}: {v}")
                found_cors = True
        if not found_cors:
            print("❌ No CORS headers found!")
except Exception as e:
    print(f"CORS OPTIONS request failed: {e}")

# 7. Rate Limiting Check (Expected: 429 Too Many Requests after 20 attempts)
print("\n--- Testing Rate Limiting (25 fast POST /chat calls) ---")
rate_limit_data = {
    "message": "",  # Fast fail with 422/429, bypasses Voyage AI embedding call
    "history": []
}
quota_exceeded = False
for i in range(1, 26):
    url = f"{base_url}/chat"
    req_data = json.dumps(rate_limit_data).encode("utf-8")
    req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            pass
    except urllib.error.HTTPError as e:
        if e.code == 429:
            print(f"  Call {i}: Got 429 Rate Limit Exceeded (Expected after 20) ✅")
            quota_exceeded = True
            break
        elif e.code == 422:
            # Normal validation failure, request was received and logged under limits
            pass
        else:
            print(f"  Call {i}: Got unexpected status {e.code}")

if not quota_exceeded:
    print("❌ Rate limiting 429 not triggered in 25 calls!")
else:
    print("✅ Rate Limiting test passed!")
