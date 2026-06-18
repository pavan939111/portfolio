from fastapi import APIRouter, HTTPException, Request
from middleware.rate_limit import limiter
from models.requests import ContactRequest, ContactResponse
from services.contact import send_contact_notification
from exceptions.errors import ContactError
from logger.setup import setup_logger

logger = setup_logger(__name__)
router = APIRouter()

@router.post(
    "/contact",
    response_model=ContactResponse,
    summary="Submit Contact Form",
    description="Delivers contact notifications and auto-replies via Resend API"
)
@limiter.limit("5/hour")
async def submit_contact(request: Request, body: ContactRequest) -> ContactResponse:
    logger.info(f"Received contact submission from {body.name} ({body.email})")
    try:
        await send_contact_notification(body)
        return ContactResponse(
            success=True,
            message="Your message has been sent successfully. Pavan will reply within 24 to 48 hours."
        )
    except ContactError as err:
        logger.error(f"ContactError during email transmission: {err.message}. Detail: {err.detail}")
        raise HTTPException(
            status_code=500,
            detail="Failed to send message. Please try again or contact directly at pavankumarkunukuntla@gmail.com."
        )
    except Exception as e:
        logger.error(f"Unexpected exception during contact route: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to send message. Please try again or contact directly at pavankumarkunukuntla@gmail.com."
        )
