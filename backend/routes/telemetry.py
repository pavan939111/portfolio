from fastapi import APIRouter
from config.settings import get_settings
from services.retrieval import get_supabase_client
from datetime import datetime
from logger.setup import setup_logger

logger = setup_logger(__name__)
settings = get_settings()
router = APIRouter()

# Static mock fallback data
MOCK_SUMMARY = {
    "totalQueries": 142,
    "totalTokens": 184500,
    "totalCostUsd": 0.05420,
    "avgLatencyMs": 950,
    "isMock": True
}

MOCK_TOOL_USAGE = [
    {"name": "Supabase Vector Store", "value": 72},
    {"name": "Voyage Embeddings API", "value": 72},
    {"name": "Gemini 1.5 Flash", "value": 54},
    {"name": "Groq Llama 3.3", "value": 18},
    {"name": "Local JSON Fallback", "value": 8}
]

MOCK_WEEKLY = [
    {"day": "Mon", "queries": 15, "avgLatency": 820, "tokens": 12500, "cost": 0.0035},
    {"day": "Tue", "queries": 22, "avgLatency": 940, "tokens": 28400, "cost": 0.0082},
    {"day": "Wed", "queries": 18, "avgLatency": 1050, "tokens": 21000, "cost": 0.0061},
    {"day": "Thu", "queries": 25, "avgLatency": 890, "tokens": 32100, "cost": 0.0094},
    {"day": "Fri", "queries": 30, "avgLatency": 980, "tokens": 44000, "cost": 0.0132},
    {"day": "Sat", "queries": 12, "avgLatency": 750, "tokens": 14500, "cost": 0.0042},
    {"day": "Sun", "queries": 20, "avgLatency": 1100, "tokens": 32000, "cost": 0.0096}
]

MOCK_LOGS = [
    {
        "id": "mock-log-1",
        "user_query": "What are Pavan's core skills?",
        "latency_ms": 780,
        "tokens_used": 1800,
        "cost_usd": 0.00054,
        "tools_called": ["Voyage Embeddings", "Supabase DB", "Gemini 1.5 Flash"],
        "created_at": "2026-06-10T12:34:56Z"
    },
    {
        "id": "mock-log-2",
        "user_query": "Tell me about VisionSync",
        "latency_ms": 1120,
        "tokens_used": 2400,
        "cost_usd": 0.00072,
        "tools_called": ["Voyage Embeddings", "Supabase DB", "Groq Llama 3.3"],
        "created_at": "2026-06-10T11:45:12Z"
    },
    {
        "id": "mock-log-3",
        "user_query": "How can I contact Pavan?",
        "latency_ms": 450,
        "tokens_used": 600,
        "cost_usd": 0.00018,
        "tools_called": ["Local Keyword Fallback", "Gemini 1.5 Flash"],
        "created_at": "2026-06-10T10:15:30Z"
    }
]

@router.get(
    "/telemetry",
    summary="Get Agent Performance Telemetry"
)
async def get_telemetry():
    logger.info("Fetching agent run telemetry metrics...")
    
    supabase = get_supabase_client()
    if supabase is not None:
        try:
            # Query up to 100 runs for aggregate calculation
            res = supabase.table("agent_runs").select("*").order("created_at", desc=True).limit(100).execute()
            rows = res.data or []
            
            if rows:
                total_queries = len(rows)
                total_tokens = sum(r.get("tokens_used", 0) for r in rows)
                total_cost = float(sum(r.get("cost_usd", 0) for r in rows))
                avg_latency = int(sum(r.get("latency_ms", 0) for r in rows) / total_queries) if total_queries else 0
                
                summary = {
                    "totalQueries": total_queries,
                    "totalTokens": total_tokens,
                    "totalCostUsd": total_cost,
                    "avgLatencyMs": avg_latency,
                    "isMock": False
                }
                
                # Top 10 recent logs
                recent_logs = []
                for r in rows[:10]:
                    recent_logs.append({
                        "id": str(r.get("id")),
                        "user_query": r.get("user_query", ""),
                        "latency_ms": r.get("latency_ms", 0),
                        "tokens_used": r.get("tokens_used", 0),
                        "cost_usd": float(r.get("cost_usd", 0)),
                        "tools_called": r.get("tools_called") or [],
                        "created_at": r.get("created_at", "")
                    })
                
                # Dynamic tools footprint calculations
                tools_map = {}
                for r in rows:
                    for tool in r.get("tools_called", []):
                        tools_map[tool] = tools_map.get(tool, 0) + 1
                
                tool_usage = [{"name": k, "value": v} for k, v in tools_map.items()]
                if not tool_usage:
                    tool_usage = [{"name": "None", "value": 0}]
                
                # Day-by-day weekly groupings
                days_order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                day_metrics = {d: {"queries": 0, "latency": 0.0, "tokens": 0, "cost": 0.0} for d in days_order}
                
                for r in rows:
                    created_str = r.get("created_at", "")
                    try:
                        # Normalize timestamp string for formatting
                        clean_ts = created_str.replace("Z", "+00:00")
                        dt = datetime.fromisoformat(clean_ts)
                        day_name = dt.strftime("%a")
                        if day_name in day_metrics:
                            day_metrics[day_name]["queries"] += 1
                            day_metrics[day_name]["latency"] += r.get("latency_ms", 0)
                            day_metrics[day_name]["tokens"] += r.get("tokens_used", 0)
                            day_metrics[day_name]["cost"] += float(r.get("cost_usd", 0.0))
                    except Exception:
                        pass
                
                weekly_analytics = []
                for d in days_order:
                    q_count = day_metrics[d]["queries"]
                    avg_lat = int(day_metrics[d]["latency"] / q_count) if q_count else 0
                    weekly_analytics.append({
                        "day": d,
                        "queries": q_count,
                        "avgLatency": avg_lat,
                        "tokens": day_metrics[d]["tokens"],
                        "cost": day_metrics[d]["cost"]
                    })
                
                # Fallback to mock week trend if dynamic data points are sparse
                if sum(w["queries"] for w in weekly_analytics) == 0:
                    weekly_analytics = MOCK_WEEKLY
                
                return {
                    "summary": summary,
                    "weeklyAnalytics": weekly_analytics,
                    "recentLogs": recent_logs,
                    "toolUsage": tool_usage
                }
        except Exception as e:
            logger.error(f"Failed to fetch telemetry from Supabase: {e}. Using fallback mock data.")
            
    # Serve rich mock telemetry data if DB is absent or errors out
    return {
        "summary": MOCK_SUMMARY,
        "weeklyAnalytics": MOCK_WEEKLY,
        "recentLogs": MOCK_LOGS,
        "toolUsage": MOCK_TOOL_USAGE
    }
