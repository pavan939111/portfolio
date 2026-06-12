import re

def clean_text(text: str) -> str:
    """
    Cleans multiple spaces, tabs, and newlines into single spaces.
    """
    if not text:
        return ""
    cleaned = re.sub(r'\s+', ' ', text)
    return cleaned.strip()
