def create_graph(email):

    nodes = []
    edges = []

    email_id = email["email_id"]
    email_node = "email_" + email_id

    nodes.append({
        "id": email_node,
        "type": "email",
        "label": email.get("subject", "Email")
    })

    # Domains
    for i, domain in enumerate(email.get("domains", [])):

        domain_id = "domain_" + str(i) + "_" + email_id

        nodes.append({
            "id": domain_id,
            "type": "domain",
            "label": domain
        })

        edges.append({
            "source": email_node,
            "target": domain_id,
            "relationship": "contains"
        })

    # URLs
    for i, url in enumerate(email.get("urls", [])):

        url_id = "url_" + str(i) + "_" + email_id

        nodes.append({
            "id": url_id,
            "type": "url",
            "label": url
        })

        edges.append({
            "source": email_node,
            "target": url_id,
            "relationship": "contains"
        })

    # IPs
    for i, ip in enumerate(email.get("ips", [])):

        ip_id = "ip_" + str(i) + "_" + email_id

        nodes.append({
            "id": ip_id,
            "type": "ip",
            "label": ip
        })

        edges.append({
            "source": email_node,
            "target": ip_id,
            "relationship": "contains"
        })

    return {
        "nodes": nodes,
        "edges": edges
    }