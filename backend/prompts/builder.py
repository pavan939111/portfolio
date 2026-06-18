from prompts.system import PORTFOLIO_SYSTEM_PROMPT
from prompts.templates import QUERY_CONDENSE_PROMPT
from models.entities import Message, RetrievedChunk

def build_context_string(chunks: list[RetrievedChunk]) -> str:
    """
    Converts retrieved chunks into a clean context string for prompt.
    """
    if not chunks:
        return "No specific context found. Provide a general helpful response."
        
    parts = []
    for chunk in chunks:
        parts.append(
            f"[{chunk.section.upper()}] {chunk.title}\n{chunk.content}"
        )
    return "\n\n---\n\n".join(parts)

def build_system_prompt(
    chunks: list[RetrievedChunk],
    is_unlisted_topic: bool = False,
    unlisted_topic_alternative: str = "",
    response_length: str = "detailed"
) -> str:
    """
    Assembles final system prompt ready to send to LLMs, injecting query-specific constraints.
    """
    context = build_context_string(chunks)
    base_prompt = PORTFOLIO_SYSTEM_PROMPT.format(context=context)
    
    extra_rules = []
    if response_length == "short":
        extra_rules.append(
            "STRICT LENGTH CONSTRAINT: The user is asking a short/simple question. "
            "You MUST answer in exactly 1 or 2 lines (under 40 words total). "
            "Avoid listing details or long explanations."
        )
    else:
        extra_rules.append(
            "LENGTH CONSTRAINT: Keep your response concise (under 100 words) "
            "unless the user specifically requested detailed explanations."
        )
        
    if is_unlisted_topic and unlisted_topic_alternative:
        extra_rules.append(
            f"STRICT PIVOT CONSTRAINT: The user is asking about a project, skill, or experience that Pavan has not explicitly listed. "
            f"Instead of focusing on what he has not done, frame the response positively by highlighting that he has built "
            f"similar projects or worked on related topics in his knowledge base. Showcase those similar accomplishments: "
            f"{unlisted_topic_alternative}. Explain these relevant details clearly based on the context."
        )
        
    if extra_rules:
        base_prompt += "\n\nADDITIONAL RUNTIME CONSTRAINTS (STRICTLY OBEY):\n"
        for rule in extra_rules:
            base_prompt += f"- {rule}\n"
            
    return base_prompt


def build_condense_prompt(message: str, history: list[Message]) -> str:
    """
    Assembles the prompt used to rewrite follow-up questions.
    """
    chat_log = ""
    for msg in history[-5:]:  # Look at the last 5 exchanges
        role_label = "User" if msg.role == "user" else "Assistant"
        chat_log += f"{role_label}: {msg.content}\n"
        
    return QUERY_CONDENSE_PROMPT.format(
        chat_log=chat_log,
        message=message
    )
