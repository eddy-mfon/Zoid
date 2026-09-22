import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowDownRight, Plus, X, Heart, Send, Edit2, Trash2, MessageCircle, ChevronRight, UserCheck } from "lucide-react";
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
  isUserSubmitted?: boolean; // Only user-submitted posts can be edited or deleted
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
    isUserSubmitted: false,
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
    isUserSubmitted: false,
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
    isUserSubmitted: false,
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

  // Form state for new story
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState("2026");
  const [category, setCategory] = useState("COMMUNITY STORY");
  const [content, setContent] = useState("");

  // Comment form state
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
    if (readingStory?.id === id) {
      setReadingStory((prev) =>
        prev ? { ...prev, likes: likedIds.includes(id) ? prev.likes - 1 : prev.likes + 1 } : prev
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
      image: "/manus-storage/zoid-story_425b40db.jpg",
      likes: 1,
      comments: [],
      isUserSubmitted: true, // USER-SUBMITTED POST CAN BE EDITED AND DELETED
    };
    setStories([newStory, ...stories]);
    toast.success("Your story has been submitted to the ZOID Archives!", {
      description: "You can edit or manage your story anytime from this page.",
    });
    setSubmitOpen(false);
    setTitle(""); setAuthor(""); setLocation(""); setContent("");
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    if (!editingStory.isUserSubmitted) {
      toast.error("Only user-submitted posts can be edited.");
      return;
    }
    setStories((prev) => prev.map((s) => (s.id === editingStory.id ? editingStory : s)));
    toast.success("Story updated successfully");
    setEditingStory(null);
  };

  const handleDelete = (id: string) => {
    const story = stories.find((s) => s.id === id);
    if (!story?.isUserSubmitted) {
      toast.error("Only user-submitted posts can be deleted.");
      return;
    }
    if (!confirm("Are you sure you want to delete your story from the archives?")) return;
    setStories((prev) => prev.filter((s) => s.id !== id));
    if (readingStory?.id === id) setReadingStory(null);
    toast.success("Your story has been deleted.");
  };

  const handleAddComment = (storyId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) {
      toast.error("Please enter your name and comment");
      return;
    }
    const newComment: Comment = {
      id: Date.now().toString(),
      author: commentAuthor,
      text: commentText,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, comments: [...s.comments, newComment] } : s))
    );
    if (readingStory?.id === storyId) {
      setReadingStory((prev) =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : prev
      );
    }
    setCommentAuthor("");
    setCommentText("");
    toast.success("Comment posted!");
  };

  return (
    <main className="zoid-shell collection-page" style={{ background: "#0b0b0b", color: "#f4f0ea" }}>
      {/* Navbar */}
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

      {/* Intro Header */}
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
            <strong>Stories from the pitch and the street.</strong> Every jersey carries a memory. Click any story card to read full accounts, reply, or submit your own.
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

      {/* ── REDESIGNED ARCHIVE GRID ─────────────────── */}
      <section style={{ padding: "40px clamp(24px, 6vw, 96px) 120px", background: "#0e0e0e" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 28,
        }}>
          {stories.map((item) => (
            <article
              key={item.id}
              style={{
                background: "#141414",
                border: "1px solid #222",
                borderRadius: 8,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
              }}
              className="archive-card-item"
            >
              {/* Card Image Stage */}
              <div
                onClick={() => setReadingStory(item)}
                style={{
                  height: 240,
                  position: "relative",
                  cursor: "pointer",
                  overflow: "hidden",
                  background: "#090909",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover", display: "block",
                    transition: "transform 0.4s ease",
                  }}
                />
                {/* Category & Year Badge */}
                <div style={{
                  position: "absolute", top: 12, left: 12,
                  background: "rgba(10, 10, 10, 0.82)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff", padding: "4px 10px", borderRadius: 4,
                  fontSize: 9, letterSpacing: "0.14em", fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{ color: "var(--pink)" }}>{item.year}</span> · {item.category}
                </div>

                {/* User-submitted indicator tag */}
                {item.isUserSubmitted && (
                  <div style={{
                    position: "absolute", top: 12, right: 12,
                    background: "var(--pink)", color: "#fff",
                    padding: "4px 10px", borderRadius: 4,
                    fontSize: 8, letterSpacing: "0.14em", fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <UserCheck size={11} /> YOUR POST
                  </div>
                )}
              </div>

              {/* Card Content Body */}
              <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.14em", color: "#888", textTransform: "uppercase", margin: "0 0 8px" }}>
                  {item.location} · <strong style={{ color: "#bbb" }}>BY {item.author.toUpperCase()}</strong>
                </p>

                <h3
                  onClick={() => setReadingStory(item)}
                  style={{
                    fontFamily: "Anton", fontSize: 22, color: "#fff",
                    lineHeight: 1.15, margin: "0 0 12px", cursor: "pointer",
                    textTransform: "uppercase", letterSpacing: "0.02em",
                  }}
                >
                  {item.title}
                </h3>

                <p style={{
                  color: "#999", fontSize: 13, lineHeight: 1.6,
                  margin: "0 0 20px", display: "-webkit-box",
                  WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  "{item.content}"
                </p>

                {/* Bottom Action Rail */}
                <div style={{
                  marginTop: "auto", paddingTop: 16,
                  borderTop: "1px solid #222",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <button
                      onClick={() => toggleLike(item.id)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 5,
                        color: likedIds.includes(item.id) ? "var(--pink)" : "#888",
                        fontSize: 12, fontWeight: 600, padding: 0,
                      }}
                      title={likedIds.includes(item.id) ? "Unlike" : "Like"}
                    >
                      <Heart size={16} fill={likedIds.includes(item.id) ? "currentColor" : "none"} />
                      <span>{item.likes}</span>
                    </button>

                    <button
                      onClick={() => setReadingStory(item)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 5,
                        color: "#888", fontSize: 12, padding: 0,
                      }}
                      title="Comments"
                    >
                      <MessageCircle size={15} />
                      <span>{item.comments.length}</span>
                    </button>
                  </div>

                  {/* Read full story action */}
                  <button
                    onClick={() => setReadingStory(item)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--pink)", fontSize: 10, letterSpacing: "0.14em",
                      fontWeight: 700, textTransform: "uppercase",
                      display: "inline-flex", alignItems: "center", gap: 4,
                    }}
                  >
                    Read <ChevronRight size={13} />
                  </button>
                </div>

                {/* ONLY SHOW EDIT / DELETE CONTROLS IF USER-SUBMITTED */}
                {item.isUserSubmitted && (
                  <div style={{
                    marginTop: 14, paddingTop: 12,
                    borderTop: "1px dashed #2a2a2a",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <span style={{ fontSize: 9, color: "var(--pink)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
                      Post Management
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setEditingStory({ ...item })}
                        style={{
                          background: "#1c1c1c", border: "1px solid #333",
                          color: "#ccc", padding: "4px 10px", borderRadius: 4,
                          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 10, fontWeight: 600,
                        }}
                        title="Edit your post"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          background: "rgba(231,25,75,0.1)", border: "1px solid rgba(231,25,75,0.3)",
                          color: "var(--pink)", padding: "4px 10px", borderRadius: 4,
                          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 10, fontWeight: 600,
                        }}
                        title="Delete your post"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
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
                <h3 style={{ fontSize: 24, lineHeight: 1.1 }}>{readingStory.title}</h3>
              </div>
              <button onClick={() => setReadingStory(null)} aria-label="Close"><X size={20} /></button>
            </div>

            <img
              src={readingStory.image}
              alt={readingStory.title}
              style={{ width: "100%", height: 320, objectFit: "cover", marginTop: 20, borderRadius: 4 }}
            />

            <div style={{ padding: "24px 0" }}>
              <p style={{ color: "#333", fontSize: 15, lineHeight: 1.8, margin: "0 0 16px" }}>{readingStory.content}</p>
              <p style={{ color: "#777", fontSize: 12, fontWeight: 600 }}>— Submitted by {readingStory.author} ({readingStory.location})</p>
            </div>

            {/* Like button */}
            <button
              onClick={() => toggleLike(readingStory.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px",
                border: `1px solid ${likedIds.includes(readingStory.id) ? "var(--pink)" : "#ccc"}`,
                background: likedIds.includes(readingStory.id) ? "rgba(231,25,75,0.08)" : "transparent",
                color: likedIds.includes(readingStory.id) ? "var(--pink)" : "#555",
                borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, marginBottom: 28,
              }}
            >
              <Heart size={16} fill={likedIds.includes(readingStory.id) ? "currentColor" : "none"} />
              {likedIds.includes(readingStory.id) ? "Liked" : "Like this story"} · {readingStory.likes}
            </button>

            {/* Comments */}
            <div style={{ borderTop: "1px solid #d5d0c8", paddingTop: 24 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", color: "#777", marginBottom: 18 }}>
                COMMENTS ({readingStory.comments.length})
              </p>
              {readingStory.comments.length > 0 ? (
                <div style={{ display: "grid", gap: 14, marginBottom: 28 }}>
                  {readingStory.comments.map((c) => (
                    <div key={c.id} style={{ padding: "14px 18px", background: "#f9f7f4", borderRadius: 4, borderLeft: "3px solid var(--pink)" }}>
                      <p style={{ margin: "0 0 6px", fontSize: 13, color: "#222", lineHeight: 1.5 }}>{c.text}</p>
                      <small style={{ color: "#888", fontSize: 10 }}>— {c.author} · {c.createdAt}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>No comments yet. Be the first to share your thoughts.</p>
              )}

              {/* Add comment form */}
              <form onSubmit={(e) => handleAddComment(readingStory.id, e)} style={{ display: "grid", gap: 12 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.14em", color: "#666", margin: 0, fontWeight: 700 }}>LEAVE A COMMENT</p>
                <input
                  required
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="Your name"
                  style={{ padding: "12px", border: "1px solid #ccc", background: "#fff", color: "#111", fontSize: 13, borderRadius: 4 }}
                />
                <textarea
                  required
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add your response to this story…"
                  style={{ padding: "12px", border: "1px solid #ccc", background: "#fff", color: "#111", fontSize: 13, resize: "vertical", borderRadius: 4 }}
                />
                <button className="pink-button" type="submit" style={{ justifyContent: "center", minHeight: 44 }}>
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
                <p className="eyebrow">POST MANAGEMENT</p>
                <h3>EDIT YOUR STORY</h3>
              </div>
              <button onClick={() => setEditingStory(null)}><X size={20} /></button>
            </div>

            <form onSubmit={handleEdit} style={{ display: "grid", gap: 14, marginTop: 20 }}>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6, color: "#333" }}>Story Title</label>
                <input
                  required
                  value={editingStory.title}
                  onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                  style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", borderRadius: 4 }}
                />
              </div>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6, color: "#333" }}>Your Story</label>
                <textarea
                  required
                  rows={6}
                  value={editingStory.content}
                  onChange={(e) => setEditingStory({ ...editingStory, content: e.target.value })}
                  style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", resize: "vertical", borderRadius: 4 }}
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

            <p style={{ color: "#666", fontSize: 13, lineHeight: 1.6, margin: "24px 0 20px" }}>
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
                  style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", fontSize: 13, borderRadius: 4 }}
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
                    style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", fontSize: 13, borderRadius: 4 }}
                  />
                </div>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6, color: "#333" }}>Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lagos, Nigeria"
                    style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", fontSize: 13, borderRadius: 4 }}
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
                    style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", fontSize: 13, borderRadius: 4 }}
                  />
                </div>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6, color: "#333" }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", fontSize: 13, borderRadius: 4 }}
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
                  style={{ width: "100%", padding: 12, background: "#fff", color: "#111", border: "1px solid #ccc", resize: "vertical", fontSize: 13, borderRadius: 4 }}
                />
              </div>

              <button className="pink-button" type="submit" style={{ marginTop: 10, width: "100%", justifyContent: "center", minHeight: 50 }}>
                Submit to ZOID Archives <Send size={16} />
              </button>
            </form>
          </aside>
        </div>
      )}

      {/* Footer */}
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
          <span>Built on grit • Worn with intent</span>
        </div>
      </footer>
    </main>
  );
}
