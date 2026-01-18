from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import os

async def review_topic(topic: str) -> dict:
    """
    Analyzes a topic for ambiguity.
    Returns: {"status": "CLEAR" | "AMBIGUOUS", "message": "..."}
    """
    if "placeholder" in os.getenv("OPENAI_API_KEY", "placeholder"):
        return {"status": "CLEAR", "message": "API Key missing, skipping check."}

    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    
    prompt = (
        "You are a helpful research assistant. The user wants to research a topic for investment/prediction markets.\n"
        f"Topic: '{topic}'\n\n"
        "Task: Determine if this topic is SPECIFIC enough for a general financial news search, or if it is confusingly AMBIGUOUS.\n"
        "- If it refers to a clear ENTITY (e.g. 'Toronto Raptors', 'Apple Inc', 'Bitcoin', 'Donald Trump'), output 'CLEAR'. Do NOT try to narrow it down to 'Financials vs Stats' unless the user is incredibly vague.\n"
        "- If it's ambiguous (e.g. 'Apple' (Fruit vs Company?), 'The Game' (Rapper vs Movie vs Sport?), 'Run'), output 'AMBIGUOUS: <Short clarifying question to user>'.\n"
        "- If it's too broad (e.g. 'Technology'), output 'AMBIGUOUS: This is very broad. Did you have a specific company or sector in mind?'\n"
        "Output ONLY the string 'CLEAR' or 'AMBIGUOUS: ...'"
    )
    
    msg = await llm.ainvoke([SystemMessage(content="You are a strict query validator."), HumanMessage(content=prompt)])
    content = msg.content.strip()
    
    if content == "CLEAR" or content.startswith("CLEAR"):
        return {"status": "CLEAR", "message": "Topic is clear."}
    elif content.startswith("AMBIGUOUS:"):
        question = content.split("AMBIGUOUS:", 1)[1].strip()
        return {"status": "AMBIGUOUS", "message": question}
    else:
        # Fallback for weird LLM output
        return {"status": "CLEAR", "message": "Assuming clear."}

async def refine_topic(original_topic: str, user_input: str) -> str:
    """
    Merges the original topic + user clarification into a new precise topic string.
    """
    if "placeholder" in os.getenv("OPENAI_API_KEY", "placeholder"):
        return user_input

    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    
    prompt = (
        f"Original Topic: '{original_topic}'\n"
        f"User Clarification: '{user_input}'\n\n"
        "Task: Combine these into a single, precise, short search topic string for a financial search engine.\n"
        "Example 1: Topic='Apple', Clarification='The tech company' -> Output='Apple Inc.'\n"
        "Example 2: Topic='The Game', Clarification='The rapper' -> Output='The Game (Rapper)'\n"
        "Example 3: Topic='Raptors', Clarification='Toronto basketball' -> Output='Toronto Raptors'\n"
        "Output ONLY the new topic string. Do not add quotes."
    )
    
    msg = await llm.ainvoke([SystemMessage(content="You are a query refiner."), HumanMessage(content=prompt)])
    return msg.content.strip().replace('"', "")
