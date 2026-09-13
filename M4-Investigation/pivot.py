from api_client import find_ioc, pivot_ioc


def pivot_on_ioc(ioc_type, value):

    ioc = find_ioc(ioc_type, value)

    if ioc is None:
        return {
            "success": False,
            "message": "IOC not found",
            "related_emails": []
        }

    result = pivot_ioc(ioc["_id"])

    return {
        "success": True,
        "ioc": ioc,
        "pivot": result
    }