import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowDownRight, Plus, X, Heart, Search, ShoppingBag, Send } from "lucide-react";
import { toast } from "sonner";
import { useShop } from "@/contexts/ShopContext";

interface ArchiveStory {
  id: string;
  title: string;
  author: string;
  location: string;
  year: string;
  category: string;
  content: string;
  image: string;
  likes: number;
}

const initialStories: ArchiveStory[] = [
  {
    id: "1",
    title: "The 1998 Samba Memory",
    author: "Tunde O.",
    location: "Lagos, Nigeria",
    year: "1998",
    category: "MATCH DAY",
    content: "Watching Ronaldo on a CRT television in Surulere wearing this shirt changed how I saw football. It wasn't just a game; it was rhythm, flair, and unfiltered joy.",
    image: "/jerseys/National/Brazil 1998 home vintage jersey.jpg",
    likes: 42,
  },
  {
    id: "2",
    title: "San Siro Under the Lights",
    author: "Chidi K.",
    location: "Milan / Abuja",
    year: "2010",
    category: "COLLECTOR STORY",
    content: "Sourcing original vintage Milan kit in pristine condition was my holy grail. Carrying this piece back home to Nigeria built my passion for jersey curation.",
    image: "/manus-storage/ac-milan-2526_b917ea29.jpg",
    likes: 29,
  },
  {
    id: "3",
    title: "Street Culture & Sportswear",
    author: "Amina B.",
    location: "Lekki, Lagos",
    year: "2024",
    category: "COMMUNITY",
    content: "Football jerseys aren't just for the pitch anymore. In Lagos, it's our everyday luxury—a badge of identity, grit, and cultural connection.",
    image: "/manus-storage/zoid-story_425b40db.jpg",
    likes: 58,
  }
];

export default function Archives() {
  const [stories, setStories] = useState<ArchiveStory[]>(initialStories);
  const [modalOpen, setModalOpen] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const { count: cartCount } = useShop();

  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState("2026");
  const [category, setCategory] = useState("COMMUNITY STORY");
  const [content, setContent] = useState("");

  const toggleLike = (id: string) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setStories((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, likes: likedIds.includes(id) ? s.likes - 1 : s.likes + 1 }
          : s
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !content) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newStory: ArchiveStory = {
      id: Date.now().toString(),
      title,
      author,
      location: location || "Lagos, Nigeria",
      year: year || "2026",
      category,
      content,
      image: "/manus-storage/zoid-jersey-detail_0ef688bb.jpg",
      likes: 1,
    };

    setStories([newStory, ...stories]);
    toast.success("Your story has been submitted to the ZOID Archives!", {
      description: "Thank you for contributing to our community memory.",
    });
    setModalOpen(false);
    // Reset form
    setTitle("");
    setAuthor("");
    setLocation("");
    setContent("");
  };

  return (
    <main className="zoid-shell collection-page">
      <header className="topbar">
        <Link className="brand" href="/">
          <img src="/zoid-logo.svg" alt="ZOID" />
          <span>ZOID</span>
          <i />
        </Link>
        <div className="nav-frame">
          <span className="nav-context">FIELD / ARCHIVES</span>
          <nav className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/collection">Shop</Link>
            <Link href="/about">About</Link>
            <Link className="active" href="/archives">Archives</Link>
          </nav>
        </div>
        <div className="top-actions action-rail">
          <Link href="/collection" className="bag-button">
            <ShoppingBag size={15} /> {cartCount} Bag
          </Link>
        </div>
      </header>

      <div className="collection-intro">
        <div>
          <Link className="back-link" href="/">
            <ArrowLeft size={15} /> Back to Home
          </Link>
          <p className="eyebrow">COMMUNITY & FOOTBALL MEMORY</p>
          <h1>ZOID<br /><span>ARCHIVES.</span></h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p className="collection-note">
            <strong>Stories from the pitch and the street.</strong> Every jersey carries a memory. Explore community entries or submit your own story to the archive.
          </p>
          <button
            className="pink-button"
            onClick={() => setModalOpen(true)}
            style={{ width: "fit-content" }}
          >
            Tell Your Story <Plus size={16} />
          </button>
        </div>
      </div>

      <section className="collection-grid" style={{ paddingTop: 40 }}>
        {stories.map((item) => (
          <article className="collection-card" key={item.id} style={{ background: "#151515", padding: 24, borderRadius: 4 }}>
            <div className="collection-image" style={{ height: 320, marginBottom: 16 }}>
              <img src={item.image} alt={item.title} />
              <span>{item.year} / {item.category}</span>
            </div>
            <div className="collection-card-meta">
              <div>
                <p className="eyebrow">{item.location} · BY {item.author.toUpperCase()}</p>
                <h2>{item.title}</h2>
              </div>
              <button
                className="save-card"
                onClick={() => toggleLike(item.id)}
                style={{ display: "flex", alignItems: "center", gap: 4, color: likedIds.includes(item.id) ? "var(--pink)" : "#aaa" }}
              >
                <Heart size={18} fill={likedIds.includes(item.id) ? "currentColor" : "none"} />
                <span style={{ fontSize: 12 }}>{item.likes}</span>
              </button>
            </div>
            <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6, marginTop: 14 }}>
              "{item.content}"
            </p>
          </article>
        ))}
      </section>

      {/* Tell Your Story Modal */}
      {modalOpen && (
        <div className="drawer-backdrop" onClick={() => setModalOpen(false)}>
          <aside
            className="cart-drawer"
            style={{ width: "min(520px, 100%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-head">
              <div>
                <p className="eyebrow">SUBMIT TO ZOID ARCHIVES</p>
                <h3>TELL YOUR STORY</h3>
              </div>
              <button onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, marginTop: 20 }}>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Story Title *</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My First World Cup Jersey"
                  style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Your Name *</label>
                  <input
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Tunde O."
                    style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc" }}
                  />
                </div>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lagos, Nigeria"
                    style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc" }}
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Your Story *</label>
                <textarea
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share what this kit or moment meant to you..."
                  style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", resize: "vertical" }}
                />
              </div>

              <button className="pink-button" type="submit" style={{ marginTop: 10, width: "100%" }}>
                Submit Story <Send size={16} />
              </button>
            </form>
          </aside>
        </div>
      )}

      <footer className="footer">
        <div className="footer-topline">
          <span>ZOID / LAGOS</span>
          <span>COMMUNITY ARCHIVES</span>
        </div>
        <div className="footer-bottom">
          <span>© ZOID STUDIOS / 2026</span>
          <span>Built on grit • Worn with intent</span>
        </div>
      </footer>
    </main>
  );
}
