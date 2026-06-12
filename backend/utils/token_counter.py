def estimate_tokens(text: str) -> int:
    """
    Estimates token count for a text string using standard 4-char heuristic.
    """
    if not text:
        return 0
    return max(1, len(text) // 4)
