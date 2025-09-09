import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../api";
import SearchResults from "./SearchResults";
import { Tabs, Tab, Spinner, Button , Col, Row, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// 🔑 Helper to normalize backend product response
function normalizeProducts(raw) {
  const arr =
    Array.isArray(raw) ? raw :
    Array.isArray(raw.products) ? raw.products :
    Array.isArray(raw.items) ? raw.items :
    Array.isArray(raw.data) ? raw.data : [];

  return arr.map(p => ({
    id: p.product_id ?? p.id,
    title: p.name ?? p.title ?? "—",
    image: p.image_url ?? p.image ?? (p.images?.[0]?.url ?? null),
    price: Number(p.price ?? p.min_price ?? 0),
    compare_at: Number(p.compare_at_price ?? p.max_price ?? 0),
    sold_out: p.available === false || p.stock === 0,
    slug: p.slug ?? null,
  }));
}

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [active, setActive] = useState("products");
  const navigate = useNavigate();

  useEffect(() => {
    if (!q) return;
    setLoading(true);

    // fetch products
    api.get("/search", { params: { q } })
      .then(res => {
        const normalized = normalizeProducts(res.data);
        setProducts(normalized);
        setSuggestions(res.data.suggestions || []);
      })
      .finally(() => setLoading(false));

    // fetch blogs
    api.get("/blogs", { params: { q } })
      .then(res => {
        setBlogs(res.data || []);
      });
  }, [q]);

  return (
    <div className="p-4">
      <h4>
        {loading ? (
          <Spinner size="sm" animation="border" />
        ) : (
          `${products.length + blogs.length} results for “${q}”`
        )}
      </h4>

      <Tabs activeKey={active} onSelect={setActive} className="mb-3">
        {/* Products tab */}
        <Tab eventKey="products" title="Products">
          <SearchResults
            q={q}
            loading={loading}
            products={products}
            suggestions={suggestions}
            onHide={() => {}}
          />
        </Tab>

        {/* Blogs tab with table like MyBlog */}
        <Tab eventKey="blogs" title="Blog posts">
        {loading ? (
            <div className="text-center py-5">
            <Spinner animation="border" />
            <p>Loading blogs...</p>
            </div>
        ) : blogs.length === 0 ? (
            <div className="text-center py-5 text-muted">
            <div style={{ fontSize: "48px" }}>📝</div>
            No blog posts found
            </div>
        ) : (
            <Row className="g-4">
            {blogs.map((post) => (
                <Col md={4} sm={6} xs={12} key={post.blog_id}>
                <Card className="blog-card">
                    <div className="blog-img-wrapper">
                    <Card.Img
                        variant="top"
                        src={post.images?.[0]?.url || "/placeholder.jpg"}
                        alt={post.title}
                        className="blog-img"
                    />
                    </div>
                    <Card.Body>
                    <Card.Title className="blog-title">{post.title}</Card.Title>
                    <Card.Text className="blog-excerpt">
                        {post.excerpt
                        ? post.excerpt.replace(/<[^>]+>/g, "")
                        : (post.content || "").replace(/<[^>]+>/g, "").substring(0, 100) + "..."}
                    </Card.Text>
                    <Button
                        variant="link"
                        className="read-more"
                        onClick={() => navigate(`/blogs/${post.blog_id}`)} // or setSelectedPost like in MyBlog
                    >
                        Read more →
                    </Button>
                    </Card.Body>
                </Card>
                </Col>
            ))}
            </Row>
        )}
        </Tab>
      </Tabs>
    </div>
  );
}