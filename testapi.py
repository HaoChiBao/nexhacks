import json
import requests


GAMMA_API = "https://gamma-api.polymarket.com"


def fetch_json(path, params=None):
    url = f"{GAMMA_API}{path}"
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()


def show_sports():
    sports = fetch_json("/sports")
    print("Sports leagues sample:")
    print("Total leagues:", len(sports))
    for sport in sports[:5]:
        print()
        print("Name:", sport.get("name"))
        print("Slug:", sport.get("slug"))
        print("Keys:", sorted(sport.keys()))


def show_basketball_events():
    params = {
        "series_id": "10345",
        "tag_id": "100639",
        "active": "true",
        "closed": "false",
        "order": "startTime",
        "ascending": "true",
        "limit": "5",
    }
    events = fetch_json("/events", params=params)
    print()
    print("NBA basketball events sample:")
    print("Total events returned:", len(events))
    for event in events:
        print()
        print("Event title:", event.get("title"))
        print("Start date:", event.get("startDate"))
        print("Raw event keys:", sorted(event.keys()))
        markets = event.get("markets") or []
        print("Number of markets:", len(markets))
        for market in markets:
            print()
            print("  Market question:", market.get("question"))
            print("  Raw market keys:", sorted(market.keys()))
            outcomes_raw = market.get("outcomes")
            prices_raw = market.get("outcomePrices")
            try:
                outcomes = json.loads(outcomes_raw) if isinstance(outcomes_raw, str) else outcomes_raw
            except Exception:
                outcomes = outcomes_raw
            try:
                prices = json.loads(prices_raw) if isinstance(prices_raw, str) else prices_raw
            except Exception:
                prices = prices_raw
            print("  Outcomes:", outcomes)
            print("  Outcome prices:", prices)


def main():
    try:
        show_sports()
        show_basketball_events()
    except Exception as exc:
        print("Error while calling Polymarket API:", repr(exc))


if __name__ == "__main__":
    main()
