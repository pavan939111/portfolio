"""
Resend Email Notification Integration Service
============================================

SETUP INSTRUCTIONS:
------------------
Step 1: Go to resend.com and create a free account.
Step 2: Go to the API Keys section and create a new API key.
Step 3: Copy the key and paste it into your .env file as: RESEND_API_KEY=re_xxx
Step 4: The free tier allows 3,000 emails per month, which is more than enough for a portfolio.
Step 5: By default, use 'onboarding@resend.dev' as the from address, which works immediately
        without domain verification (delivering only to your registered account email).
        If you want to use a custom domain later, verify it in the Resend dashboard.
Step 6: Run the backend and submit the contact form. Check pavankumarkunukuntla@gmail.com
        for the notification email.
"""

import httpx
from config.settings import get_settings
from logger.setup import setup_logger
from models.requests import ContactRequest
from exceptions.errors import ContactError

logger = setup_logger(__name__)
settings = get_settings()

RESEND_API_URL = "https://api.resend.com/emails"

def build_notification_html(request: ContactRequest) -> str:
    """
    Build the notification HTML email that Pavan receives.
    Designed with a premium dark theme and orange accent matching the portfolio.
    """
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Contact from Portfolio</title>
</head>
<body style="background-color: #0a0a0a; color: #f5f5f5; font-family: 'Courier New', Courier, monospace; margin: 0; padding: 40px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #ff7a00; border-radius: 12px; padding: 30px; box-shadow: 0 4px 20px rgba(255, 122, 0, 0.15);">
    <h2 style="color: #ff7a00; font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: bold; border-bottom: 1px solid rgba(255, 122, 0, 0.2); padding-bottom: 10px; margin-bottom: 20px;">
      💼 New Contact from Portfolio
    </h2>
    <div style="margin-bottom: 16px;">
      <span style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Name</span>
      <div style="background-color: #1a1a1a; border: 1px solid #222; border-radius: 6px; padding: 12px; color: #fff; font-size: 14px;">
        {request.name}
      </div>
    </div>
    <div style="margin-bottom: 16px;">
      <span style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Email</span>
      <div style="background-color: #1a1a1a; border: 1px solid #222; border-radius: 6px; padding: 12px; color: #fff; font-size: 14px;">
        {request.email}
      </div>
    </div>
    <div style="margin-bottom: 16px;">
      <span style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Subject</span>
      <div style="background-color: #1a1a1a; border: 1px solid #222; border-radius: 6px; padding: 12px; color: #fff; font-size: 14px;">
        {request.subject}
      </div>
    </div>
    <div style="margin-bottom: 24px;">
      <span style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Message</span>
      <div style="background-color: #1a1a1a; border: 1px solid #222; border-radius: 6px; padding: 16px; color: #fff; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
        {request.message}
      </div>
    </div>
    <div style="text-align: center; margin-bottom: 20px;">
      <a href="mailto:{request.email}" style="background-color: #ff7a00; color: #000; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
        Reply to Visitor
      </a>
    </div>
    <div style="border-top: 1px solid #222; padding-top: 15px; font-size: 11px; color: #666; text-align: center;">
      This message was sent from your portfolio website.
    </div>
  </div>
</body>
</html>"""

def build_autoreply_html(name: str) -> str:
    """
    Build the auto-reply confirmation email that the visitor receives.
    Designed with a matching dark theme, premium orange accent, and social buttons.
    """
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank You for Contacting Pavan</title>
</head>
<body style="background-color: #0a0a0a; color: #f5f5f5; font-family: 'Courier New', Courier, monospace; margin: 0; padding: 40px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #ff7a00; border-radius: 12px; padding: 30px; box-shadow: 0 4px 20px rgba(255, 122, 0, 0.15);">
    <h2 style="color: #ff7a00; font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: bold; border-bottom: 1px solid rgba(255, 122, 0, 0.2); padding-bottom: 10px; margin-bottom: 20px;">
      📩 Thank you for reaching out!
    </h2>
    <p style="font-size: 14px; line-height: 1.6; color: #ccc; margin-bottom: 24px;">
      Hi {name},<br><br>
      Thank you for contacting Pavan Kumar Kunukuntla. Your message has been received, and Pavan will get back to you within 24 to 48 hours.<br><br>
      While you wait, feel free to explore his projects and work on his portfolio.
    </p>
    <div style="margin-bottom: 24px; text-align: center;">
      <a href="https://linkedin.com/in/pavankumarkunukuntla" style="color: #ff7a00; font-size: 13px; text-decoration: underline; margin: 0 10px; display: inline-block;">LinkedIn</a>
      <a href="https://github.com/pavankumarkunukuntla" style="color: #ff7a00; font-size: 13px; text-decoration: underline; margin: 0 10px; display: inline-block;">GitHub</a>
    </div>
    <div style="border-top: 1px solid #222; padding-top: 15px; font-size: 11px; color: #666; text-align: center;">
      This is an automated reply. Please do not reply to this email.
    </div>
  </div>
</body>
</html>"""

async def send_contact_notification(request: ContactRequest) -> bool:
    """
    Transmit notification and auto-reply emails simultaneously via Resend REST API.
    Raises ContactError on failure.
    """
    if not settings.RESEND_API_KEY or settings.RESEND_API_KEY == "your_resend_api_key_here":
        logger.warning("RESEND_API_KEY is not configured or using placeholder. Simulating email transmission.")
        return True

    headers = {
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json"
    }

    notification_body = {
        "from": f"{settings.RESEND_FROM_NAME} <{settings.RESEND_FROM_EMAIL}>",
        "to": [settings.RESEND_TO_EMAIL],
        "subject": f"New Portfolio Contact: {request.subject}",
        "html": build_notification_html(request),
        "reply_to": request.email
    }

    autoreply_body = {
        "from": f"Pavan Kumar <{settings.RESEND_FROM_EMAIL}>",
        "to": [request.email],
        "subject": "Thank you for contacting Pavan Kumar",
        "html": build_autoreply_html(request.name)
    }

    async with httpx.AsyncClient(timeout=20.0) as client:
        try:
            # 1. Send Notification Email to Pavan
            resp_pavan = await client.post(RESEND_API_URL, headers=headers, json=notification_body)
            resp_pavan.raise_for_status()
            logger.info(f"Notification email to Pavan sent successfully. Status code: {resp_pavan.status_code}")

            # 2. Send Auto-Reply Email to Visitor (best-effort — free tier onboarding@resend.dev
            #    can only deliver to the Resend account email, so this may 403 for arbitrary visitors)
            try:
                resp_visitor = await client.post(RESEND_API_URL, headers=headers, json=autoreply_body)
                resp_visitor.raise_for_status()
                logger.info(f"Auto-reply email to visitor {request.email} sent successfully. Status code: {resp_visitor.status_code}")
            except httpx.HTTPStatusError as autoreply_err:
                logger.warning(
                    f"Auto-reply to {request.email} failed (best-effort, not propagating): "
                    f"{autoreply_err.response.status_code} {autoreply_err.response.text}"
                )

            return True

        except httpx.HTTPStatusError as status_err:
            logger.error(
                f"Resend HTTPStatusError during mail delivery: {status_err}. "
                f"Response body: {status_err.response.text}"
            )
            raise ContactError(
                message=f"Resend API returned error status {status_err.response.status_code}",
                status_code=status_err.response.status_code,
                detail=status_err.response.text,
                original_exception=status_err
            ) from status_err
        except httpx.RequestError as req_err:
            logger.error(f"Resend RequestError network exception during mail delivery: {req_err}")
            raise ContactError(
                message="Network error contacting Resend API",
                status_code=503,
                detail=str(req_err),
                original_exception=req_err
            ) from req_err
        except Exception as e:
            logger.error(f"Unexpected error during email notifications: {e}")
            raise ContactError(
                message="Unexpected error during contact email delivery",
                status_code=500,
                detail=str(e),
                original_exception=e
            ) from e
