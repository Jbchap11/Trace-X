from correlation import find_related_cases
from confidence import get_confidence
from graph_builder import create_graph


def investigate(email, emails):

    result = {
        "email_id": email["email_id"],
        "subject": email.get("subject", ""),
        "starting_iocs": [],
        "related_emails": [],
        "graph": {}
    }

    # Collect domains
    for domain in email.get("domains", []):

        result["starting_iocs"].append({
            "type": "domain",
            "value": domain
        })

    # Collect URLs
    for url in email.get("urls", []):

        result["starting_iocs"].append({
            "type": "url",
            "value": url
        })

    # Collect IPs
    for ip in email.get("ips", []):

        result["starting_iocs"].append({
            "type": "ip",
            "value": ip
        })

    # Find related emails
    related = find_related_cases(email, emails)

    for case in related:

        for ioc in case["matched_iocs"]:

            for value in ioc["values"]:

                frequency = 0

                for other_email in emails:

                    if value in other_email.get("domains", []):
                        frequency += 1

                    if value in other_email.get("urls", []):
                        frequency += 1

                    if value in other_email.get("ips", []):
                        frequency += 1

                ioc["confidence"] = get_confidence(
                    ioc["type"],
                    frequency
                )

        result["related_emails"].append(case)

    # Create graph
    result["graph"] = create_graph(email)

    return result