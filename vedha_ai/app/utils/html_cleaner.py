from bs4 import BeautifulSoup


def clean_html(html: str) -> str:
    """
    Convert HTML job description to plain text.
    """

    if not html:
        return ""

    soup = BeautifulSoup(html, "html.parser")

    return soup.get_text(
        separator=" ",
        strip=True,
    )