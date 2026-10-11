import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, Clock3, Feather, Heart, Menu, Moon, Pencil, Plus, Search, Sun, Trash2, X } from "lucide-react";

const starterPosts = [
  { id: "1", title: "The quiet art of starting over", category: "Mindful living", author: "Maya Chen", date: "Oct 08, 2026", readTime: 6, excerpt: "On making peace with fresh starts, unfinished plans, and the small courage it takes to begin again.", body: "There is a particular kind of bravery in beginning again. It rarely looks like a grand declaration. More often, it is a quiet decision made over morning coffee, a blank page, or a walk without your headphones.\n\nWe tend to think of starting over as proof that something went wrong. But life is less like a straight road and more like a collection of drafts. Some ideas need another pass. Some seasons ask us to become someone slightly different.\n\nGive yourself permission to be a beginner. You do not need a perfect plan to take one honest step. Progress can be gentle and still be real.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85", featured: true },
  { id: "2", title: "Designing a life with a little more space", category: "Culture", author: "Oliver James", date: "Oct 06, 2026", readTime: 8, excerpt: "What happens when we stop trying to fill every hour and leave room for the unexpected?", body: "Our calendars can become crowded without our lives becoming fuller. Every spare moment gets assigned a task, every pause becomes an opportunity to catch up. Yet the moments we remember most often arrive unannounced.\n\nSpace is not wasted time. It is where curiosity has room to wander and conversations take a turn we did not anticipate. Start small: leave one evening unscheduled, take the longer route home, or let a question sit unanswered for a while.", image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1000&q=85" },
  { id: "3", title: "A beginner's guide to creative confidence", category: "Creativity", author: "Nina Patel", date: "Oct 04, 2026", readTime: 5, excerpt: "You do not have to feel ready to make something meaningful. You just have to make the first thing.", body: "Creative confidence is not a personality trait reserved for a lucky few. It is a habit that grows through repetition. The first version will probably be rough, and that is exactly what a first version is for.\n\nMake something small enough to finish today. Share it with someone who wants you to improve. Then return tomorrow and try again. The point is not to eliminate doubt before you begin; it is to learn that doubt can come along for the ride.", image: "https://images.unsplash.com/photo-1455390582262-044cdeadbeef?auto=format&fit=crop&w=1000&q=85" },
  { id: "4", title: "The case for learning slowly", category: "Ideas", author: "Theo Williams", date: "Oct 02, 2026", readTime: 7, excerpt: "In a world obsessed with hacks, there is something radical about giving a skill the time it deserves.", body: "We have become fluent in shortcuts. Summaries replace chapters, speed replaces understanding, and the next milestone is always waiting just beyond the current one. But some knowledge only arrives after you have spent time being confused.\n\nSlow learning gives ideas a chance to connect. It lets a question deepen and a skill become instinct. Choose one thing worth understanding properly and stay with it longer than feels efficient.", image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1000&q=85" },
  { id: "5", title: "Small rituals, better mornings", category: "Mindful living", author: "Amara Okafor", date: "Sep 29, 2026", readTime: 4, excerpt: "A gentler morning does not need a complicated routine. It needs a few choices that belong to you.", body: "A good morning routine is not a performance. It is a small bridge between sleep and the rest of your day. Open a window, drink a glass of water, and give yourself a few minutes before the world begins asking for your attention.\n\nThe best rituals are the ones you can keep on an ordinary Tuesday. They should make life feel more yours, not turn your morning into another checklist to fail.", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=85" },
  { id: "6", title: "What the city teaches us about connection", category: "Culture", author: "Rohan Mehta", date: "Sep 26, 2026", readTime: 9, excerpt: "A city is more than the places we pass through. It is the strangers who slowly become part of our map.", body: "Cities ask us to share space with people whose stories we may never know. We learn the rhythms of a neighbourhood through familiar faces, a shopkeeper who remembers an order, or a stranger who holds the lift.\n\nConnection does not always begin with a conversation. Sometimes it begins with being present in the same place, often enough that a place starts to feel like home.", image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=85" }
];

const categories = ["All stories", "Mindful living", "Culture", "Creativity", "Ideas", "Technology", "Personal growth"];
const readStore = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [posts, setPosts] = useState(() => readStore("inkspace-posts", starterPosts));
  const [saved, setSaved] = useState(() => readStore("inkspace-bookmarks", []));
  const [liked, setLiked] = useState(() => readStore("inkspace-likes", []));
  const [comments, setComments] = useState(() => readStore("inkspace-comments", {}));
  const [dark, setDark] = useState(() => readStore("inkspace-dark", false));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All stories");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => localStorage.setItem("inkspace-posts", JSON.stringify(posts)), [posts]);
  useEffect(() => localStorage.setItem("inkspace-bookmarks", JSON.stringify(saved)), [saved]);
  useEffect(() => localStorage.setItem("inkspace-likes", JSON.stringify(liked)), [liked]);
  useEffect(() => localStorage.setItem("inkspace-comments", JSON.stringify(comments)), [comments]);
  useEffect(() => localStorage.setItem("inkspace-dark", JSON.stringify(dark)), [dark]);

  const toggleInList = (list, setList, id) => setList(list.includes(id) ? list.filter(item => item !== id) : [...list, id]);
  const filtered = useMemo(() => posts.filter(post => {
    const matchesCategory = category === "All stories" || post.category === category;
    const text = `${post.title} ${post.excerpt} ${post.author} ${post.category}`.toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase().trim());
  }), [posts, category, query]);
  const featured = posts.find(post => post.featured) || posts[0];

  return (
    <div className={dark ? "app dark" : "app"}>
      <header className="topbar">
        <div className="nav-wrap">
          <Link to="/" className="brand" onClick={() => setMobileMenu(false)}><span className="brand-mark"><Feather size={19} /></span>inkspace<span className="brand-dot">.</span></Link>
          <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X size={21} /> : <Menu size={21} />}</button>
          <nav className={mobileMenu ? "nav-links open" : "nav-links"}>
            <Link to="/" onClick={() => setMobileMenu(false)}>Explore</Link>
            <Link to="/bookmarks" onClick={() => setMobileMenu(false)}>Bookmarks <span className="nav-count">{saved.length}</span></Link>
            <Link to="/my-posts" onClick={() => setMobileMenu(false)}>My stories</Link>
          </nav>
          <div className="nav-actions">
            <button className="icon-button theme-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <Link to="/create" className="write-button"><Plus size={16} /> Write a story</Link>
          </div>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home posts={filtered} featured={featured} allPosts={posts} query={query} setQuery={setQuery} category={category} setCategory={setCategory} saved={saved} liked={liked} toggleSaved={id => toggleInList(saved, setSaved, id)} toggleLiked={id => toggleInList(liked, setLiked, id)} />} />
          <Route path="/post/:id" element={<PostPage posts={posts} saved={saved} liked={liked} comments={comments} setComments={setComments} toggleSaved={id => toggleInList(saved, setSaved, id)} toggleLiked={id => toggleInList(liked, setLiked, id)} />} />
          <Route path="/create" element={<PostEditor onSave={post => setPosts([post, ...posts])} />} />
          <Route path="/edit/:id" element={<PostEditor posts={posts} onSave={post => setPosts(posts.map(item => item.id === post.id ? post : item))} />} />
          <Route path="/my-posts" element={<MyPosts posts={posts} onDelete={id => setPosts(posts.filter(post => post.id !== id))} />} />
          <Route path="/bookmarks" element={<SavedPosts posts={posts.filter(post => saved.includes(post.id))} saved={saved} liked={liked} toggleSaved={id => toggleInList(saved, setSaved, id)} toggleLiked={id => toggleInList(liked, setLiked, id)} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer"><Link to="/" className="footer-brand">inkspace<span>.</span></Link><p>A little more thought in a fast-moving world.</p><span>Made for curious minds · 2026</span></footer>
    </div>
  );
}

function Home({ posts, featured, allPosts, query, setQuery, category, setCategory, saved, liked, toggleSaved, toggleLiked }) {
  return <div className="page-shell">
    <section className="hero">
      <div className="eyebrow"><span className="eyebrow-line" /> THE INKSPACE JOURNAL</div>
      <h1>Ideas worth <em>staying</em><br className="desktop-break" /> a little longer for.</h1>
      <p className="hero-copy">Thoughtful stories on creativity, culture, and finding your way through it all.</p>
      <a href="#latest" className="text-link">Find your next read <ArrowDown size={15} /></a>
      <div className="hero-art" aria-hidden="true"><div className="art-circle art-circle-one" /><div className="art-circle art-circle-two" /><div className="art-sun" /><div className="art-hill art-hill-back" /><div className="art-hill art-hill-front" /><span className="art-label">A slower kind<br />of scroll.</span></div>
    </section>
    {featured && <section className="featured-section">
      <div className="section-kicker"><span>EDITOR'S PICK</span><span className="kicker-rule" /></div>
      <Link to={`/post/${featured.id}`} className="featured-card">
        <div className="featured-image" style={{ backgroundImage: `url("${featured.image}")` }}><span className="image-tag">Featured story</span></div>
        <div className="featured-content"><span className="category-label">{featured.category}</span><h2>{featured.title}</h2><p>{featured.excerpt}</p><div className="story-meta"><span className="author-avatar">{featured.author.split(" ").map(n => n[0]).join("")}</span><span>By {featured.author}</span><span className="meta-dot">·</span><span>{featured.readTime} min read</span></div><span className="featured-arrow"><ArrowRight size={20} /></span></div>
      </Link>
    </section>}
    <section id="latest" className="latest-section">
      <div className="section-heading"><div><div className="section-kicker"><span>FRESH INK</span><span className="kicker-rule" /></div><h2>Explore the journal</h2></div><span className="story-count">{allPosts.length} stories to discover</span></div>
      <div className="filter-bar"><div className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search stories, topics, authors..." aria-label="Search stories" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}</div><div className="category-select"><select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category">{categories.map(item => <option key={item} value={item}>{item}</option>)}</select><ChevronDown size={15} /></div></div>
      {posts.length ? <div className="story-grid">{posts.map((post, index) => <StoryCard key={post.id} post={post} saved={saved.includes(post.id)} liked={liked.includes(post.id)} onSave={() => toggleSaved(post.id)} onLike={() => toggleLiked(post.id)} index={index} />)}</div> : <EmptyState title="No stories found" text="Try another search or choose a different category." action={() => { setQuery(""); setCategory("All stories"); }} label="Clear filters" />}
    </section>
    <section className="newsletter"><div className="newsletter-mark"><Feather size={21} /></div><div><span className="category-label">A NOTE FROM US</span><h2>Good reads. No noise.</h2><p>Make a little room in your week for something thoughtful.</p></div><a href="#latest" className="newsletter-link">Browse the journal <ArrowRight size={16} /></a></section>
  </div>;
}

function StoryCard({ post, saved, liked, onSave, onLike, index = 0 }) {
  return <article className="story-card" style={{ animationDelay: `${index * 55}ms` }}>
    <Link to={`/post/${post.id}`} className="card-image" style={{ backgroundImage: `url("${post.image}")` }} aria-label={`Read ${post.title}`}><span className="card-category">{post.category}</span></Link>
    <div className="card-body"><div className="card-meta"><span>{post.date}</span><span>·</span><span><Clock3 size={12} /> {post.readTime} min</span></div><Link to={`/post/${post.id}`}><h3>{post.title}</h3></Link><p>{post.excerpt}</p><div className="card-bottom"><div className="card-author"><span className="mini-avatar">{post.author.split(" ").map(n => n[0]).join("")}</span>{post.author}</div><div className="card-tools"><button className={liked ? "tiny-action active" : "tiny-action"} onClick={onLike} aria-label={liked ? "Unlike story" : "Like story"}><Heart size={15} fill={liked ? "currentColor" : "none"} /></button><button className={saved ? "tiny-action active" : "tiny-action"} onClick={onSave} aria-label={saved ? "Remove bookmark" : "Bookmark story"}><Bookmark size={15} fill={saved ? "currentColor" : "none"} /></button></div></div></div>
  </article>;
}

function PostPage({ posts, saved, liked, comments, setComments, toggleSaved, toggleLiked }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(item => item.id === id);
  const [comment, setComment] = useState("");
  if (!post) return <div className="page-shell"><EmptyState title="This story has wandered off" text="It may have been removed, or the link may be out of date." action={() => navigate("/")} label="Back to explore" /></div>;
  const postComments = comments[id] || [];
  const addComment = e => { e.preventDefault(); if (!comment.trim()) return; setComments({ ...comments, [id]: [...postComments, { id: Date.now().toString(), text: comment.trim(), date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }] }); setComment(""); };
  return <div className="article-shell"><button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back to the journal</button><article className="article"><div className="article-top"><span className="category-label">{post.category}</span><span className="article-date">{post.date} <span>·</span> {post.readTime} min read</span></div><h1>{post.title}</h1><p className="article-deck">{post.excerpt}</p><div className="article-author"><span className="author-avatar">{post.author.split(" ").map(n => n[0]).join("")}</span><div><strong>{post.author}</strong><span>Contributor at InkSpace</span></div><div className="article-actions"><button className={liked.includes(id) ? "icon-button active" : "icon-button"} onClick={() => toggleLiked(id)} aria-label="Like story"><Heart size={18} fill={liked.includes(id) ? "currentColor" : "none"} /></button><button className={saved.includes(id) ? "icon-button active" : "icon-button"} onClick={() => toggleSaved(id)} aria-label="Bookmark story"><Bookmark size={18} fill={saved.includes(id) ? "currentColor" : "none"} /></button></div></div><div className="article-cover" style={{ backgroundImage: `url("${post.image}")` }} /><div className="article-body">{post.body.split("\n\n").map((paragraph, i) => <p key={i}>{paragraph}</p>)}<div className="article-endmark">✳</div></div></article><section className="comments-section"><div className="section-kicker"><span>THE CONVERSATION</span><span className="kicker-rule" /></div><h2>Leave a thought</h2><p className="comments-intro">Good conversations make good stories even better.</p><form className="comment-form" onSubmit={addComment}><textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="What did this story make you think about?" rows="3" maxLength="500" /><div className="comment-form-bottom"><span>{comment.length}/500</span><button className="primary-button" type="submit" disabled={!comment.trim()}>Post comment <ArrowRight size={15} /></button></div></form><div className="comment-list">{postComments.length ? postComments.map(item => <div className="comment-item" key={item.id}><span className="mini-avatar">Y</span><div><div className="comment-meta"><strong>You</strong><span>{item.date}</span></div><p>{item.text}</p></div></div>) : <p className="no-comments">No thoughts shared yet. Start the conversation.</p>}</div></section></div>;
}

function PostEditor({ posts = [], onSave }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = posts.find(post => post.id === id);
  const [title, setTitle] = useState(existing?.title || "");
  const [excerpt, setExcerpt] = useState(existing?.excerpt || "");
  const [body, setBody] = useState(existing?.body || "");
  const [category, setCategory] = useState(existing?.category || "Creativity");
  const [author, setAuthor] = useState(existing?.author || "Aryan Verma");
  const [image, setImage] = useState(existing?.image || "https://images.unsplash.com/photo-1455390582262-044cdeadbeef?auto=format&fit=crop&w=1200&q=85");
  const [error, setError] = useState("");
  const submit = e => {
    e.preventDefault();
    if (title.trim().length < 5 || excerpt.trim().length < 15 || body.trim().length < 30 || !author.trim()) { setError("Add a title (5+ characters), summary (15+), author, and story (30+)."); return; }
    onSave({ id: existing?.id || Date.now().toString(), title: title.trim(), excerpt: excerpt.trim(), body: body.trim(), category, author: author.trim(), image: image.trim() || "https://images.unsplash.com/photo-1455390582262-044cdeadbeef?auto=format&fit=crop&w=1200&q=85", date: existing?.date || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }), readTime: Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200)), featured: existing?.featured || false });
    navigate("/my-posts");
  };
  return <div className="editor-shell"><Link to="/my-posts" className="back-link"><ArrowLeft size={16} /> My stories</Link><div className="editor-heading"><div className="section-kicker"><span>YOUR NOTEBOOK</span><span className="kicker-rule" /></div><h1>{existing ? "Edit your story." : "Every story starts somewhere."}</h1><p>Take your time. The world can wait for a good sentence.</p></div><form className="editor-form" onSubmit={submit} noValidate><label>Story title<input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your story a name" maxLength="100" required /><span className="field-hint">{title.length}/100</span></label><label>Short description<textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="A sentence that makes someone want to read more..." rows="2" maxLength="220" required /><span className="field-hint">{excerpt.length}/220</span></label><div className="form-row"><label>Category<select value={category} onChange={e => setCategory(e.target.value)}>{categories.filter(c => c !== "All stories").map(c => <option key={c}>{c}</option>)}</select></label><label>Author name<input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Your name" required /></label></div><label>Cover image URL<input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." type="url" /><span className="field-hint">Use an image URL, or leave blank for a default cover.</span></label><label>Your story<textarea className="story-textarea" value={body} onChange={e => setBody(e.target.value)} placeholder="Start with the thing you can't stop thinking about..." rows="12" required /><span className="field-hint">{body.trim() ? body.trim().split(/\s+/).length : 0} words · around {Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 200))} min read</span></label>{error && <p className="form-error">{error}</p>}<div className="editor-footer"><span>Your draft is saved when you publish.</span><button className="primary-button" type="submit">{existing ? "Save changes" : "Publish story"} <ArrowRight size={16} /></button></div></form></div>;
}

function MyPosts({ posts, onDelete }) {
  const mine = posts.filter(post => post.author.toLowerCase() === "aryan verma");
  const [confirm, setConfirm] = useState("");
  return <div className="page-shell inner-page"><div className="section-kicker"><span>YOUR NOTEBOOK</span><span className="kicker-rule" /></div><div className="section-heading"><div><h1>My stories</h1><p className="page-intro">Everything you've put into words, all in one place.</p></div><Link to="/create" className="write-button"><Plus size={16} /> New story</Link></div>{mine.length ? <div className="manage-list">{mine.map(post => <div className="manage-item" key={post.id}><div className="manage-thumb" style={{ backgroundImage: `url("${post.image}")` }} /><div className="manage-info"><span className="category-label">{post.category}</span><h3>{post.title}</h3><p>{post.date} · {post.readTime} min read</p></div><div className="manage-actions"><Link to={`/edit/${post.id}`} className="icon-button" aria-label="Edit story"><Pencil size={17} /></Link><button className="icon-button danger-button" onClick={() => setConfirm(post.id)} aria-label="Delete story"><Trash2 size={17} /></button></div>{confirm === post.id && <div className="confirm-overlay"><p>Delete this story permanently?</p><button onClick={() => { onDelete(post.id); setConfirm(""); }} className="danger-text">Delete</button><button onClick={() => setConfirm("")}>Cancel</button></div>}</div>)}</div> : <EmptyState title="Your notebook is waiting" text="Publish a story and it will show up here, ready for your next edit." action={() => window.location.assign("/create")} label="Write your first story" />}</div>;
}

function SavedPosts({ posts, saved, liked, toggleSaved, toggleLiked }) {
  return <div className="page-shell inner-page"><div className="section-kicker"><span>KEPT CLOSE</span><span className="kicker-rule" /></div><div className="section-heading"><div><h1>Your bookmarks</h1><p className="page-intro">Stories to come back to when you have a little more time.</p></div><span className="story-count">{posts.length} saved</span></div>{posts.length ? <div className="story-grid">{posts.map((post, index) => <StoryCard key={post.id} post={post} saved={saved.includes(post.id)} liked={liked.includes(post.id)} onSave={() => toggleSaved(post.id)} onLike={() => toggleLiked(post.id)} index={index} />)}</div> : <EmptyState title="Keep a story close" text="Tap the bookmark on any story to save it here for later." action={() => window.location.assign("/")} label="Explore stories" />}</div>;
}

function EmptyState({ title, text, action, label }) {
  return <div className="empty-state"><span className="empty-icon"><Feather size={22} /></span><h3>{title}</h3><p>{text}</p>{action && <button className="secondary-button" onClick={action}>{label} <ArrowRight size={15} /></button>}</div>;
}

function NotFound() {
  return <div className="page-shell"><EmptyState title="Nothing on this page" text="Looks like this page is taking a different route." action={() => window.location.assign("/")} label="Return home" /></div>;
}

export default App;