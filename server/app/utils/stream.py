from contextvars import ContextVar
from asyncio import Queue
from typing import Optional

# Global context variable to hold the event queue for the current request
log_queue_var: ContextVar[Optional[Queue]] = ContextVar("log_queue", default=None)
