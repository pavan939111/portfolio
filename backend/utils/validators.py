from exceptions.errors import ValidationError

def validate_message_length(message: str, max_len: int = 1000) -> None:
    """
    Validates that message is non-empty and fits in limits, raising ValidationError on failure.
    """
    if not message or not message.strip():
        raise ValidationError("Message content cannot be blank.")
    if len(message) > max_len:
        raise ValidationError(
            f"Message exceeds maximum allowed length of {max_len} characters."
        )
