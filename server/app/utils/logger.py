import json
from datetime import datetime
from typing import List, Dict

class AgentLogger:
    def __init__(self, node_name: str, logs_list: List[Dict]):
        self.node = node_name
        self.logs = logs_list # Reference to the state's log list
    
    def _add(self, type: str, message: str, emoji: str = ""):
        timestamp = datetime.utcnow().isoformat()
        
        # Console Print with Color
        colors = {
            "start": "\033[96m", # Cyan
            "end": "\033[92m",   # Green
            "thinking": "\033[93m", # Yellow
            "tool": "\033[95m", # Magenta
            "error": "\033[91m", # Red
            "info": "\033[0m"    # Reset
        }
        c = colors.get(type, "\033[0m")
        reset = "\033[0m"
        
        print(f"{c}[{timestamp}] [{self.node}] {message}{reset}")
        
        # Add to State
        log_entry = {
            "node": self.node,
            "type": type,
            "message": message,
            "timestamp": timestamp,
            "emoji": "" # No emoji
        }
        self.logs.append(log_entry)
        
        # Stream to Queue if active
        from app.utils.stream import log_queue_var
        q = log_queue_var.get()
        if q:
            q.put_nowait(log_entry)

    def start(self, message: str):
        self._add("start", message)

    def end(self, message: str):
        self._add("end", message)

    def think(self, message: str):
        self._add("thinking", message)
        
    def tool_call(self, tool_name: str, params: str):
        self._add("tool", f"Calling {tool_name}: {params}")

    def tool_result(self, tool_name: str, result_summary: str):
        self._add("tool", f"{tool_name} returned: {result_summary}")

    def info(self, message: str):
        self._add("info", message)

    def error(self, message: str):
        self._add("error", message)
