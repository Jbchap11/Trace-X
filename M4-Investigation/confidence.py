def get_confidence(ioc_type, frequency):

    if ioc_type == "ip":
        return "HIGH"

    if ioc_type == "url":
        return "HIGH"

    if ioc_type == "domain":

        if frequency <= 2:
            return "HIGH"

        elif frequency <= 5:
            return "MEDIUM"

        else:
            return "LOW"

    return "LOW"