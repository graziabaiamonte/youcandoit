from app.news import parse_feed

RSS = b"""<?xml version="1.0"?><rss version="2.0"><channel><title>T</title>
<item><title>First &lt;b&gt;post&lt;/b&gt;</title><link>https://ex.com/1</link>
<description>&lt;p&gt;Hello   world&lt;/p&gt;</description>
<pubDate>Mon, 19 Oct 2026 08:00:00 GMT</pubDate></item>
<item><title>Dup</title><link>https://ex.com/1</link></item>
<item><title>No date</title><link>https://ex.com/2</link></item>
</channel></rss>"""


def test_parse_feed_cleans_and_dedupes():
    items = parse_feed(RSS, "Example")
    assert [i["url"] for i in items] == ["https://ex.com/1", "https://ex.com/2"]
    assert items[0]["title"] == "First post"
    assert items[0]["excerpt"] == "Hello world"
    assert items[0]["published_at"].year == 2026
    assert items[1]["published_at"] is None
    assert all(i["source"] == "Example" for i in items)
