import requests


BASE_URL = "http://localhost:5000"


def find_ioc(ioc_type, value):

    url = f"{BASE_URL}/api/iocs"

    params = {
        "type": ioc_type,
        "value": value
    }

    response = requests.get(url, params=params)

    response.raise_for_status()

    data = response.json()

    if data.get("success") and data.get("data"):
        return data["data"][0]

    return None


def pivot_ioc(ioc_id):

    url = f"{BASE_URL}/api/iocs/{ioc_id}/pivot"

    response = requests.get(url)

    response.raise_for_status()

    return response.json()