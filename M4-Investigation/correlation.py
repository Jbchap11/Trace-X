def find_related_cases(current_email, emails):

    related = []

    current_id = current_email["email_id"]

    current_domains = set(current_email.get("domains", []))
    current_urls = set(current_email.get("urls", []))
    current_ips = set(current_email.get("ips", []))

    for email in emails:

        # Don't compare email with itself
        if email["email_id"] == current_id:
            continue

        email_domains = set(email.get("domains", []))
        email_urls = set(email.get("urls", []))
        email_ips = set(email.get("ips", []))

        common_domains = current_domains & email_domains
        common_urls = current_urls & email_urls
        common_ips = current_ips & email_ips

        matched_iocs = []

        if common_domains:
            matched_iocs.append({
                "type": "domain",
                "values": list(common_domains)
            })

        if common_urls:
            matched_iocs.append({
                "type": "url",
                "values": list(common_urls)
            })

        if common_ips:
            matched_iocs.append({
                "type": "ip",
                "values": list(common_ips)
            })

        if matched_iocs:

            related.append({
                "email_id": email["email_id"],
                "subject": email.get("subject", ""),
                "matched_iocs": matched_iocs
            })

    return related