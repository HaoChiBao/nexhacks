import secrets
import string

def generate_id(length: int = 12) -> string:
    """
    Generates a URL-safe alphanumeric ID.
    Excludes ambiguous characters (optional, but standard base62/64 is used here).
    Using simple alphanumeric set for readability and URL safety.
    """
    alphabet = string.ascii_lowercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))
