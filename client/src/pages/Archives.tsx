import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowDownRight, Plus, X, Heart, ShoppingBag, Send, Edit2, Trash2, MessageCircle, ChevronRight, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useShop } from "@/contexts/ShopContext";

const MARK = "/zoid-logo.svg";

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

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
  comments: Comment[];
}

const initialStories: ArchiveStory[] = [
  {
    id: "1",
    title: "The 1998 Samba Memory",
    author: "Tunde O.",
    location: "Lagos, Nigeria",
    year: "1998",
    category: "MATCH DAY",
    content: "Watching Ronaldo on a CRT television in Surulere wearing this shirt changed how I saw football. It wasn't just a game; it was rhythm, flair, and unfiltered joy. The yellow of Brazil on that screen — pure energy. I was 9 years old and from that moment I knew I would collect jerseys forever.",
    image: "/jerseys/National/Brazil 1998 home vintage jersey.jpg",
    likes: 42,
    comments: [
      { id: "c1", author: "Emeka A.", text: "This hits different. I remember that exact World Cup.", createdAt: "2026-08-14" },
    ],
  },
  {
    id: "2",
    title: "San Siro Under the Lights",
    author: "Chidi K.",
    location: "Milan / Abuja",
    year: "2010",
    category: "COLLECTOR STORY",
    content: "Sourcing original vintage Milan kit in pristine condition was my holy grail. Carrying this piece back home to Nigeria built my passion for jersey curation. The scent of the cotton, the faded crest — it all tells a story that modern kits just can't replicate.",
    image: "/manus-storage/ac-milan-2526_b917ea29.jpg",
    likes: 29,
    comments: [],
  },
  {
    id: "3",
    title: "Street Culture & Sportswear",
    author: "Amina B.",
    location: "Lekki, Lagos",
    year: "2024",
    category: "COMMUNITY",
    content: "Football jerseys aren't just for the pitch anymore. In Lagos, it's our everyday luxury—a badge of identity, grit, and cultural connection. I wear my Spain kit to the market, to church, to coffee with friends. The jersey is a language everyone speaks.",
    image: "/manus-storage/zoid-story_425b40db.jpg",
    likes: 58,
    comments: [
      { id: "c2", author: "Fatima L.", text: "Yes! Jerseys are culture now. Love this perspective.", createdAt: "2026-09-01" },
      { id: "c3", author: "Kola T.", text: "This is exactly why I love ZOID archives.", createdAt: "2026-09-10" },
    ],
  },
];

export default function Archives() {
  const [stories, setStories] = useState<ArchiveStory[]>(initialStories);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [readingStory, setReadingStory] = useState<ArchiveStory | null>(null);
  const [editingStory, setEditingStory] = useState<ArchiveStory | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { count: cartCount } = useShop();

  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState("2026");
  const [category, setCategory] = useState("COMMUNITY STORY");
  const [content, setContent] = useState("");

  // Comment form
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");

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
    // Update readingStory if open
    if (readingStory?.id === id) {
      setReadingStory((prev) =>
        prev
          ? { ...prev, likes: likedIds.includes(id) ? prev.likes - 1 : prev.likes + 1 }
          : prev
      );
    }
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
      comments: [],
    };
    setStories([newStory, ...stories]);
    toast.success("Your story has been submitted to the ZOID Archives!", {
      description: "Thank you for contributing to our community memory.",
    });
    setSubmitOpen(false);
    setTitle(""); setAuthor(""); setLocation(""); setContent("");
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    setStories((prev) => prev.map((s) => s.id === editingStory.id ? editingStory : s));
    toast.success("Story updated successfully");
    setEditingStory(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Remove this story from the archives?")) return;
    setStories((prev) => prev.filter((s) => s.id !== id));
    if (readingStory?.id === id) setReadingStory(null);
    toast.success("Story removed from archives");
  };

  const handleAddComment = (storyId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) {
      toast.error("Please fill in your name and comment");
      return;
    }
    const newComment: Comment = {
      id: Date.now().toString(),
      author: commentAuthor,
      text: commentText,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId ? { ...s, comments: [...s.comments, newComment] } : s
      )
    );
    if (readingStory?.id === storyId) {
      setReadingStory((prev) =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : prev
      );
    }
    setCommentAuthor("");
    setCommentText("");
    toast.success("Comment added!");
  };

  return (
    <main className="zoid-shell collection-page">
      <header className="topbar">
        <Link className="brand" href="/">
          <img src={MARK} alt="ZOID" />
          <span>ZOID</span>
          <i />
        </Link>
        <div className="nav-frame">
          <nav className={mobileMenu ? "nav-links nav-open" : "nav-links"}>
            <Link href="/">Home</Link>
            <Link href="/collection">Shop</Link>
            <Link href="/about">About</Link>
            <Link className="active" href="/archives">Archives</Link>
          </nav>
        </div>
        <div className="top-actions action-rail">
          <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={20} /> : <ArrowDownRight size={20} />}
          </button>
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
            <strong>Stories from the pitch and the street.</strong> Every jersey carries a memory. Click a story to read, comment, and like.
          </p>
          <button
            className="pink-button"
            onClick={() => setSubmitOpen(true)}
            style={{ width: "fit-content" }}
          >
            Tell Your Story <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Stories Grid — interactive cards */}
      <section className="collection-grid" style={{ paddingTop: 40 }}>
        {stories.map((item) => (
          <article
            className="collection-card"
            key={item.id}
            style={{ background: "#151515", borderRadius: 4, cursor: "pointer", position: "relative" }}
          >
            <div
              className="collection-image"
              style={{ height: 320, marginBottom: 0 }}
              onClick={() => setReadingStory(item)}
            >
              <img src={item.image} alt={item.title} />
              <span>{item.year} / {item.category}</span>
              <i style={{ bottom: 18, right: 18, position: "absolute", fontStyle: "normal", fontSize: 7, letterSpacing: "0.16em", color: "#ddd" }}>
                CLICK TO READ
              </i>
            </div>
            <div className="collection-card-meta" style={{ padding: "16px 0 0" }}>
              <div>
                <p className="eyebrow">{item.location} · BY {item.author.toUpperCase()}</p>
                <h2
                  onClick={() => setReadingStory(item)}
                  style={{ cursor: "pointer" }}
                >
                  {item.title}
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <button
                  className="save-card"
                  onClick={() => toggleLike(item.id)}
                  style={{ display: "flex", alignItems: "center", gap: 4, color: likedIds.includes(item.id) ? "var(--pink)" : "#aaa" }}
                  aria-label={likedIds.includes(item.id) ? "Unlike" : "Like"}
                >
                  <Heart size={18} fill={likedIds.includes(item.id) ? "currentColor" : "none"} />
                  <span style={{ fontSize: 12 }}>{item.likes}</span>
                </button>
                <button
                  onClick={() => setReadingStory(item)}
                  style={{ display: "flex", alignItems: "center", gap: 3, color: "#777", background: "none", border: "none", cursor: "pointer", fontSize: 12 }}
                >
                  <MessageCircle size={14} /> {item.comments.length}
                </button>
              </div>
            </div>
            <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6, marginTop: 12, paddingBottom: 4 }}>
              "{item.content.slice(0, 100)}…"
            </p>
            <div className="collection-card-bottom" style={{ marginTop: 12 }}>
              <button
                onClick={() => setReadingStory(item)}
                className="line-link"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pink)" }}
              >
                Read full story <ChevronRight size={14} />
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setEditingStory({ ...item })}
                  style={{ background: "none", border: "1px solid #333", color: "#888", padding: "5px 9px", borderRadius: 3, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}
                  title="Edit story"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{ background: "none", border: "1px solid #333", color: "#888", padding: "5px 9px", borderRadius: 3, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}
                  title="Delete story"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* ── READ STORY MODAL ───────────────────────── */}
      {readingStory && (
        <div className="drawer-backdrop" onClick={() => setReadingStory(null)}>
          <aside
            className="cart-drawer"
            style={{ width: "min(680px, 100%)", overflow: "auto", maxHeight: "100vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-head">
              <div>
                <p className="eyebrow">{readingStory.location} · {readingStory.year} · {readingStory.category}</p>
                <h3 style={{ fontSize: 22, lineHeight: 1.1 }}>{readingStory.title}</h3>
              </div>
              <button onClick={() => setReadingStory(null)} aria-label="Close"><X size={20} /></button>
            </div>

            <img
              src={readingStory.image}
              alt={readingStory.title}
              style={{ width: "100%", height: 280, objectFit: "cover", marginTop: 20 }}
            />

            <div style={{ padding: "20px 0" }}>
              <p style={{ color: "#555", fontSize: 13, lineHeight: 1.8 }}>{readingStory.content}</p>
              <p style={{ color: "#999", fontSize: 11, marginTop: 16 }}>— {readingStory.author}</p>
            </div>

            {/* Like button */}
            <button
              onClick={() => toggleLike(readingStory.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 16px",
                border: `1px solid ${likedIds.includes(readingStory.id) ? "var(--pink)" : "#ccc"}`,
                background: likedIds.includes(readingStory.id) ? "rgba(231,25,75,0.07)" : "transparent",
                color: likedIds.includes(readingStory.id) ? "var(--pink)" : "#555",
                borderRadius: 4, cursor: "pointer", fontSize: 12, marginBottom: 24,
              }}
            >
              <Heart size={16} fill={likedIds.includes(readingStory.id) ? "currentColor" : "none"} />
              {likedIds.includes(readingStory.id) ? "Liked" : "Like this story"} · {readingStory.likes}
            </button>

            {/* Comments */}
            <div style={{ borderTop: "1px solid #d5d0c8", paddingTop: 20 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", color: "#777", marginBottom: 16 }}>
                COMMENTS · {readingStory.comments.length}
              </p>
              {readingStory.comments.length > 0 ? (
                <div style={{ display: "grid", gap: 14, marginBottom: 24 }}>
                  {readingStory.comments.map((c) => (
                    <div key={c.id} style={{ padding: "12px 16px", background: "#f9f7f4", borderRadius: 4, borderLeft: "3px solid var(--pink)" }}>
                      <p style={{ margin: 0, fontSize: 13, color: "#333", lineHeight: 1.5 }}>{c.text}</p>
                      <small style={{ color: "#999", fontSize: 10 }}>— {c.author} · {c.createdAt}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#aaa", fontSize: 12, marginBottom: 20 }}>No comments yet. Be the first to respond.</p>
              )}

              {/* Add comment form */}
              <form onSubmit={(e) => handleAddComment(readingStory.id, e)} style={{ display: "grid", gap: 10 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.14em", color: "#777", margin: 0 }}>ADD A COMMENT</p>
                <input
                  required
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="Your name"
                  style={{ padding: "10px 12px", border: "1px solid #ccc", background: "#fff", color: "#111", fontSize: 13 }}
                />
                <textarea
                  required
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this story…"
                  style={{ padding: "10px 12px", border: "1px solid #ccc", background: "#fff", color: "#111", fontSize: 13, resize: "vertical" }}
                />
                <button className="pink-button" type="submit" style={{ justifyContent: "center" }}>
                  Post Comment <Send size={14} />
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}

      {/* ── EDIT STORY MODAL ───────────────────────── */}
      {editingStory && (
        <div className="drawer-backdrop" onClick={() => setEditingStory(null)}>
          <aside
            className="cart-drawer"
            style={{ width: "min(520px, 100%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-head">
              <div>
                <p className="eyebrow">EDIT STORY</p>
                <h3>EDIT</h3>
              </div>
              <button onClick={() => setEditingStory(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleEdit} style={{ display: "grid", gap: 14, marginTop: 20 }}>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Story Title</label>
                <input
                  required
                  value={editingStory.title}
                  onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                  style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc" }}
                />
              </div>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Your Story</label>
                <textarea
                  required
                  rows={5}
                  value={editingStory.content}
                  onChange={(e) => setEditingStory({ ...editingStory, content: e.target.value })}
                  style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", resize: "vertical" }}
                />
              </div>
              <button className="pink-button" type="submit" style={{ marginTop: 8, width: "100%", justifyContent: "center" }}>
                Save Changes <Send size={16} />
              </button>
            </form>
          </aside>
        </div>
      )}

      {/* ── SUBMIT STORY FORM ─────────────────────── */}
      {submitOpen && (
        <div className="drawer-backdrop" onClick={() => setSubmitOpen(false)}>
          <aside
            className="cart-drawer"
            style={{ width: "min(560px, 100%)", overflow: "auto", maxHeight: "100vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Branded header */}
            <div style={{
              background: "var(--pink)", margin: "-35px -30px 0", padding: "28px 30px 22px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, letterSpacing: "0.2em", margin: "0 0 4px" }}>ZOID ARCHIVES</p>
                <h3 style={{ color: "#fff", fontFamily: "Anton", fontWeight: 400, fontSize: 28, margin: 0 }}>TELL YOUR STORY</h3>
              </div>
              <button onClick={() => setSubmitOpen(false)} style={{ color: "#fff" }}>
                <X size={22} />
              </button>
            </div>

            <p style={{ color: "#777", fontSize: 12, lineHeight: 1.6, margin: "24px 0 20px" }}>
              Every jersey carries a memory. Share yours with the ZOID community — from Lagos pitches to European stadiums.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6, color: "#333" }}>Story Title *</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My First World Cup Jersey"
                  style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6, color: "#333" }}>Your Name *</label>
                  <input
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Tunde O."
                    style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", fontSize: 13 }}
                  />
                </div>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6, color: "#333" }}>Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lagos, Nigeria"
                    style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6, color: "#333" }}>Year</label>
                  <input
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2026"
                    style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", fontSize: 13 }}
                  />
                </div>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6, color: "#333" }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", fontSize: 13 }}
                  >
                    <option>COMMUNITY STORY</option>
                    <option>MATCH DAY</option>
                    <option>COLLECTOR STORY</option>
                    <option>STREET CULTURE</option>
                    <option>HERITAGE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6, color: "#333" }}>Your Story *</label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share what this kit or moment meant to you — the pitch, the person, the feeling…"
                  style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", resize: "vertical", fontSize: 13 }}
                />
              </div>

              <button className="pink-button" type="submit" style={{ marginTop: 10, width: "100%", justifyContent: "center", minHeight: 50 }}>
                Submit to ZOID Archives <Send size={16} />
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
        <div className="footer-core">
          <Link className="footer-wordmark" href="/">
            <img src={MARK} alt="" />
            <span>ZOID</span>
          </Link>
          <p>Stories from the pitch and the street.</p>
          <Link className="footer-cta" href="/collection">
            Shop the Edit <ArrowDownRight size={16} />
          </Link>
        </div>
        <div className="footer-bottom">
          <span>© ZOID STUDIOS / 2026</span>
          <span>Built on grit <b>•</b> Worn with intent</span>
        </div>
      </footer>
    </main>
  );
}
