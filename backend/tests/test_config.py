import sys
import os

sys.path.append(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

from config.settings import get_settings

def test_all_env_vars():
    settings = get_settings()

    assert settings.SUPABASE_URL.startswith("https://"), \
        "SUPABASE_URL missing or wrong format"

    assert settings.SUPABASE_SERVICE_KEY != "", \
        "SUPABASE_SERVICE_KEY missing"

    assert settings.VOYAGE_API_KEY.startswith("pa-"), \
        "VOYAGE_API_KEY missing or wrong format"

    assert settings.GEMINI_API_KEY.startswith("AQ"), \
        "GEMINI_API_KEY missing or wrong format"

    assert settings.VOYAGE_EMBEDDING_DIM == 1024, \
        "Wrong embedding dim — should be 1024 for voyage-2"

    print("✅ All environment variables present")

if __name__ == "__main__":
    test_all_env_vars()
