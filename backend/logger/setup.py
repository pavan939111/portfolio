import logging
import sys
from config.settings import get_settings

settings = get_settings()

def setup_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)

    # If logger already has handlers, don't add duplicate ones
    if logger.handlers:
        return logger

    level = (
        logging.DEBUG
        if settings.ENVIRONMENT == "development"
        else logging.INFO
    )
    logger.setLevel(level)

    # Create standard stdout stream handler
    # Force utf-8 encoding on Windows to prevent UnicodeEncodeError
    try:
        handler = logging.StreamHandler(sys.stdout)
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        handler = logging.StreamHandler(sys.stdout)
        
    handler.setLevel(level)

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    # Prevent logs from propagating to root logger to avoid double logging
    logger.propagate = False

    return logger
