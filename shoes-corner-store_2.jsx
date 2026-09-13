import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  ShoppingBag,
  X,
  Plus,
  Minus,
  Heart,
  SlidersHorizontal,
  Check,
  Star,
  ArrowRight,
} from "lucide-react";

/* ---------------------------------------------------------
   Design tokens
--------------------------------------------------------- */
const COLOR = {
  ink: "#15181F",
  paper: "#F3F1EC",
  ember: "#FF5A36",
  moss: "#3F6B4F",
  amber: "#E8A33D",
  blue: "#2E4A9E",
  slate: "#6B6F76",
  line: "#E2DED3",
};

const CATEGORY_COLOR = {
  Running: COLOR.ember,
  Lifestyle: COLOR.amber,
  Training: COLOR.moss,
  Basketball: COLOR.blue,
  Slides: COLOR.slate,
};

const CATEGORIES = ["Running", "Lifestyle", "Training", "Basketball", "Slides"];
const SIZES = [5, 6, 7, 8, 9, 10, 11];

/* ---------------------------------------------------------
   Sample product data (original names — no real brand SKUs)
--------------------------------------------------------- */
const PRODUCTS = [
  { id: 1, name: "Stride Runner", category: "Running", price: 6499, sizes: [6,7,8,9,10], rating: 4.6, isNew: true, tag: "Everyday mileage" },
  { id: 2, name: "Glide Pro Runner", category: "Running", price: 8999, sizes: [5,6,7,8,9,10,11], rating: 4.8, isNew: true, tag: "Race-day cushioning" },
  { id: 3, name: "Momentum Max", category: "Running", price: 10999, sizes: [7,8,9,10,11], rating: 4.7, isNew: false, tag: "Max stack, max miles" },
  { id: 4, name: "Cloudstep Knit", category: "Running", price: 5999, sizes: [5,6,7,8,9], rating: 4.4, isNew: false, tag: "Light and breathable" },
  { id: 5, name: "Corner Classic Low", category: "Lifestyle", price: 4999, sizes: [5,6,7,8,9,10], rating: 4.5, isNew: false, tag: "The one you'll wear daily" },
  { id: 6, name: "Heritage Low", category: "Lifestyle", price: 5499, sizes: [6,7,8,9,10,11], rating: 4.3, isNew: false, tag: "Retro court styling" },
  { id: 7, name: "Skyline High Top", category: "Lifestyle", price: 7499, sizes: [6,7,8,9,10], rating: 4.6, isNew: true, tag: "Bold ankle-height cut" },
  { id: 8, name: "Street Low", category: "Lifestyle", price: 4499, sizes: [5,6,7,8,9,10,11], rating: 4.2, isNew: false, tag: "Minimal everyday shell" },
  { id: 9, name: "Apex Trainer", category: "Training", price: 7999, sizes: [6,7,8,9,10], rating: 4.7, isNew: true, tag: "Built for lifting days" },
  { id: 10, name: "Pulse Trainer", category: "Training", price: 6999, sizes: [5,6,7,8,9,10], rating: 4.5, isNew: false, tag: "Stable through every set" },
  { id: 11, name: "Flex Court", category: "Training", price: 5799, sizes: [6,7,8,9,10,11], rating: 4.3, isNew: false, tag: "Multi-direction grip" },
  { id: 12, name: "Ignite Basketball", category: "Basketball", price: 11499, sizes: [7,8,9,10,11], rating: 4.8, isNew: true, tag: "Court-ready impact support" },
  { id: 13, name: "Rally Court Pro", category: "Basketball", price: 9499, sizes: [6,7,8,9,10,11], rating: 4.6, isNew: false, tag: "Quick cuts, low profile" },
  { id: 14, name: "Trail Blazer Mid", category: "Basketball", price: 8499, sizes: [7,8,9,10], rating: 4.4, isNew: false, tag: "Mid-cut lockdown" },
  { id: 15, name: "Drift Slide", category: "Slides", price: 2999, sizes: [6,7,8,9,10,11], rating: 4.1, isNew: false, tag: "Post-run recovery" },
  { id: 16, name: "Summit Slide", category: "Slides", price: 3499, sizes: [5,6,7,8,9,10], rating: 4.3, isNew: true, tag: "Cushioned slip-on" },
];

/* ---------------------------------------------------------
   Decorative shoe glyph (stand-in for product photography)
--------------------------------------------------------- */
function ShoeGlyph({ color = COLOR.ink, size = 64 }) {
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 70 Q12 54 28 51 L58 44 Q74 28 98 26 L132 24 Q152 22 167 33 L184 45 Q193 49 193 61 L193 76 Q193 84 183 84 L22 84 Q12 84 12 74 Z"
        fill={color}
        opacity="0.92"
      />
      <path d="M58 44 L74 60 L98 54" stroke={COLOR.paper} strokeWidth="3" strokeLinecap="round" opacity="0.55" fill="none" />
      <line x1="92" y1="84" x2="92" y2="70" stroke={COLOR.paper} strokeWidth="2" opacity="0.35" />
      <line x1="112" y1="84" x2="112" y2="66" stroke={COLOR.paper} strokeWidth="2" opacity="0.35" />
      <line x1="132" y1="84" x2="132" y2="62" stroke={COLOR.paper} strokeWidth="2" opacity="0.35" />
      <line x1="152" y1="84" x2="152" y2="58" stroke={COLOR.paper} strokeWidth="2" opacity="0.35" />
    </svg>
  );
}

/* ---------------------------------------------------------
   Small building blocks
--------------------------------------------------------- */
function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-medium border transition-colors"
      style={{
        borderColor: active ? COLOR.ink : COLOR.line,
        backgroundColor: active ? COLOR.ink : "transparent",
        color: active ? COLOR.paper : COLOR.ink,
      }}
    >
      {children}
    </button>
  );
}

function Rating({ value }) {
  return (
    <div className="flex items-center gap-1 text-xs" style={{ color: COLOR.slate }}>
      <Star size={13} fill={COLOR.amber} color={COLOR.amber} />
      <span>{value}</span>
    </div>
  );
}

/* ---------------------------------------------------------
   Header
--------------------------------------------------------- */
function Header({ search, setSearch, cartCount, onCartClick }) {
  return (
    <header className="sticky top-0 z-30 border-b" style={{ backgroundColor: COLOR.paper, borderColor: COLOR.line }}>
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: COLOR.ink }}
          >
            <ShoeGlyph color={COLOR.ember} size={26} />
          </div>
          <span className="text-lg font-black tracking-tight" style={{ color: COLOR.ink }}>
            Shoes Corner
          </span>
        </div>

        <div className="flex-1 hidden sm:flex items-center gap-2 max-w-md ml-4 px-3 py-2 rounded-full border"
          style={{ borderColor: COLOR.line, backgroundColor: "#fff" }}>
          <Search size={16} color={COLOR.slate} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shoes..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: COLOR.ink }}
          />
        </div>

        <button
          onClick={onCartClick}
          className="relative ml-auto flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm"
          style={{ backgroundColor: COLOR.ink, color: COLOR.paper }}
        >
          <ShoppingBag size={16} />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: COLOR.ember, color: "#fff" }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="sm:hidden px-5 pb-3 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-full border" style={{ borderColor: COLOR.line, backgroundColor: "#fff" }}>
          <Search size={16} color={COLOR.slate} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shoes..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: COLOR.ink }}
          />
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------
   Hero
--------------------------------------------------------- */
function Hero({ onShopClick }) {
  return (
    <section className="border-b" style={{ backgroundColor: COLOR.ink, borderColor: COLOR.line }}>
      <div className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm font-medium mb-4" style={{ color: COLOR.ember }}>
            New drops every Friday
          </p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5" style={{ color: COLOR.paper, letterSpacing: "-0.02em" }}>
            Find your pair.<br />Own your corner.
          </h1>
          <p className="text-base mb-8 max-w-sm" style={{ color: "#B8BAC2" }}>
            Running, lifestyle, training and court shoes picked for how you actually move — not just how they photograph.
          </p>
          <button
            onClick={onShopClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
            style={{ backgroundColor: COLOR.ember, color: "#fff" }}
          >
            Shop the collection
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="relative hidden md:flex items-center justify-center h-64">
          <div className="absolute w-72 h-72 rounded-full opacity-20" style={{ backgroundColor: COLOR.ember, filter: "blur(60px)" }} />
          <div className="relative flex flex-col gap-6">
            <ShoeGlyph color={COLOR.paper} size={220} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Filter sidebar (shared by desktop + mobile drawer)
--------------------------------------------------------- */
function Filters({ selectedCats, toggleCat, priceRange, setPriceRange, selectedSizes, toggleSize, sortBy, setSortBy, onClear }) {
  return (
    <div className="space-y-7">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold" style={{ color: COLOR.ink }}>Category</h3>
          <button onClick={onClear} className="text-xs underline" style={{ color: COLOR.slate }}>Clear all</button>
        </div>
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: COLOR.ink }}>
              <span
                className="w-4 h-4 rounded flex items-center justify-center border shrink-0"
                style={{ borderColor: selectedCats.includes(c) ? COLOR.ink : COLOR.line, backgroundColor: selectedCats.includes(c) ? COLOR.ink : "transparent" }}
                onClick={() => toggleCat(c)}
              >
                {selectedCats.includes(c) && <Check size={11} color={COLOR.paper} />}
              </span>
              <span onClick={() => toggleCat(c)}>{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-3" style={{ color: COLOR.ink }}>Price</h3>
        <div className="flex items-center gap-2 text-sm">
          <span style={{ color: COLOR.slate }}>₹</span>
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-20 px-2 py-1 rounded border text-sm"
            style={{ borderColor: COLOR.line }}
          />
          <span style={{ color: COLOR.slate }}>to</span>
          <span style={{ color: COLOR.slate }}>₹</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-20 px-2 py-1 rounded border text-sm"
            style={{ borderColor: COLOR.line }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-3" style={{ color: COLOR.ink }}>Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className="w-9 h-9 rounded-lg text-sm border"
              style={{
                borderColor: selectedSizes.includes(s) ? COLOR.ink : COLOR.line,
                backgroundColor: selectedSizes.includes(s) ? COLOR.ink : "transparent",
                color: selectedSizes.includes(s) ? COLOR.paper : COLOR.ink,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-3" style={{ color: COLOR.ink }}>Sort by</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border text-sm"
          style={{ borderColor: COLOR.line, color: COLOR.ink, backgroundColor: "#fff" }}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Product card
--------------------------------------------------------- */
function ProductCard({ product, onOpen, onQuickAdd }) {
  const accent = CATEGORY_COLOR[product.category];
  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col cursor-pointer group"
      style={{ borderColor: COLOR.line, backgroundColor: "#fff" }}
      onClick={() => onOpen(product)}
    >
      <div
        className="h-40 flex items-center justify-center relative"
        style={{ backgroundColor: `${accent}1A` }}
      >
        {product.isNew && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: COLOR.ink, color: COLOR.paper }}>
            New
          </span>
        )}
        <ShoeGlyph color={accent} size={110} />
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <span className="text-xs font-medium" style={{ color: accent }}>{product.category}</span>
        <h3 className="text-sm font-bold" style={{ color: COLOR.ink }}>{product.name}</h3>
        <p className="text-xs mb-1" style={{ color: COLOR.slate }}>{product.tag}</p>
        <Rating value={product.rating} />
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-bold" style={{ color: COLOR.ink }}>₹{product.price.toLocaleString("en-IN")}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onQuickAdd(product); }}
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: COLOR.ink, color: COLOR.paper }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Product modal
--------------------------------------------------------- */
function ProductModal({ product, onClose, onAdd }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const accent = CATEGORY_COLOR[product.category];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-5" style={{ backgroundColor: "rgba(21,24,31,0.55)" }} onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: COLOR.line }}>
          <span className="text-sm font-bold" style={{ color: COLOR.ink }}>Product details</span>
          <button onClick={onClose}><X size={20} color={COLOR.ink} /></button>
        </div>

        <div className="h-56 flex items-center justify-center" style={{ backgroundColor: `${accent}1A` }}>
          <ShoeGlyph color={accent} size={180} />
        </div>

        <div className="p-6">
          <span className="text-xs font-medium" style={{ color: accent }}>{product.category}</span>
          <h2 className="text-xl font-black mt-1 mb-1" style={{ color: COLOR.ink }}>{product.name}</h2>
          <p className="text-sm mb-3" style={{ color: COLOR.slate }}>{product.tag}</p>
          <div className="flex items-center justify-between mb-5">
            <Rating value={product.rating} />
            <span className="text-lg font-bold" style={{ color: COLOR.ink }}>₹{product.price.toLocaleString("en-IN")}</span>
          </div>

          <p className="text-xs font-bold mb-2" style={{ color: COLOR.ink }}>Select size</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className="w-10 h-10 rounded-lg border text-sm font-medium"
                style={{
                  borderColor: size === s ? COLOR.ink : COLOR.line,
                  backgroundColor: size === s ? COLOR.ink : "transparent",
                  color: size === s ? COLOR.paper : COLOR.ink,
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <p className="text-xs font-bold" style={{ color: COLOR.ink }}>Quantity</p>
            <div className="flex items-center gap-3 border rounded-full px-3 py-1.5" style={{ borderColor: COLOR.line }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={14} /></button>
              <span className="text-sm w-4 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)}><Plus size={14} /></button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onAdd(product, size, qty)}
              className="flex-1 py-3 rounded-full font-semibold text-sm"
              style={{ backgroundColor: COLOR.ember, color: "#fff" }}
            >
              Add to cart — ₹{(product.price * qty).toLocaleString("en-IN")}
            </button>
            <button className="w-12 h-12 rounded-full border flex items-center justify-center shrink-0" style={{ borderColor: COLOR.line }}>
              <Heart size={18} color={COLOR.ink} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Cart drawer
--------------------------------------------------------- */
function CartDrawer({
  items, onClose, updateQty, removeItem, checkoutState,
  onOpenContactForm, onBackToCart, contactInfo, setContactInfo, onSubmitContact,
}) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const showForm = checkoutState === "form" || checkoutState === "done";
  const canSubmit = contactInfo.name.trim() && contactInfo.phone.trim();

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: "rgba(21,24,31,0.5)" }} onClick={onClose}>
      <div className="w-full sm:w-96 h-full bg-white flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: COLOR.line }}>
          <h2 className="font-bold text-sm" style={{ color: COLOR.ink }}>
            {showForm ? "Contact details" : `Your cart (${items.length})`}
          </h2>
          <button onClick={onClose}><X size={20} color={COLOR.ink} /></button>
        </div>

        {!showForm && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 && (
                <p className="text-sm text-center mt-10" style={{ color: COLOR.slate }}>Your cart is empty.</p>
              )}
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 border-b pb-4" style={{ borderColor: COLOR.line }}>
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${CATEGORY_COLOR[item.category]}1A` }}>
                    <ShoeGlyph color={CATEGORY_COLOR[item.category]} size={44} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: COLOR.ink }}>{item.name}</p>
                    <p className="text-xs mb-2" style={{ color: COLOR.slate }}>Size {item.size}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border rounded-full px-2 py-1" style={{ borderColor: COLOR.line }}>
                        <button onClick={() => updateQty(idx, -1)}><Minus size={12} /></button>
                        <span className="text-xs w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(idx, 1)}><Plus size={12} /></button>
                      </div>
                      <span className="text-sm font-bold" style={{ color: COLOR.ink }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(idx)} className="self-start">
                    <X size={16} color={COLOR.slate} />
                  </button>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t" style={{ borderColor: COLOR.line }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm" style={{ color: COLOR.slate }}>Subtotal</span>
                  <span className="text-lg font-bold" style={{ color: COLOR.ink }}>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <button
                  onClick={onOpenContactForm}
                  className="w-full py-3 rounded-full font-semibold text-sm"
                  style={{ backgroundColor: COLOR.ember, color: "#fff" }}
                >
                  Place order request
                </button>
                <p className="text-xs text-center mt-2" style={{ color: COLOR.slate }}>We'll reach out to confirm your order — no payment happens here.</p>
              </div>
            )}
          </>
        )}

        {showForm && checkoutState === "form" && (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col">
            <p className="text-sm mb-5" style={{ color: COLOR.slate }}>
              Leave your details and we'll contact you to confirm your order of {items.length} item{items.length > 1 ? "s" : ""} (₹{total.toLocaleString("en-IN")}).
            </p>

            <label className="text-xs font-bold mb-1" style={{ color: COLOR.ink }}>Full name</label>
            <input
              value={contactInfo.name}
              onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
              placeholder="Your name"
              className="px-3 py-2 rounded-lg border text-sm mb-4"
              style={{ borderColor: COLOR.line }}
            />

            <label className="text-xs font-bold mb-1" style={{ color: COLOR.ink }}>Phone number</label>
            <input
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              placeholder="Your phone number"
              className="px-3 py-2 rounded-lg border text-sm mb-4"
              style={{ borderColor: COLOR.line }}
            />

            <label className="text-xs font-bold mb-1" style={{ color: COLOR.ink }}>Email (optional)</label>
            <input
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              placeholder="you@example.com"
              className="px-3 py-2 rounded-lg border text-sm mb-6"
              style={{ borderColor: COLOR.line }}
            />

            <div className="mt-auto flex gap-3">
              <button
                onClick={onBackToCart}
                className="flex-1 py-3 rounded-full font-semibold text-sm border"
                style={{ borderColor: COLOR.line, color: COLOR.ink }}
              >
                Back
              </button>
              <button
                onClick={onSubmitContact}
                disabled={!canSubmit}
                className="flex-1 py-3 rounded-full font-semibold text-sm"
                style={{ backgroundColor: canSubmit ? COLOR.ember : COLOR.line, color: canSubmit ? "#fff" : COLOR.slate }}
              >
                Submit request
              </button>
            </div>
          </div>
        )}

        {checkoutState === "done" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${COLOR.moss}1A` }}>
              <Check size={26} color={COLOR.moss} />
            </div>
            <p className="text-sm font-bold mb-1" style={{ color: COLOR.ink }}>Request sent</p>
            <p className="text-xs" style={{ color: COLOR.slate }}>
              We'll contact {contactInfo.name.split(" ")[0] || "you"} at {contactInfo.phone} to confirm your order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   App
--------------------------------------------------------- */
export default function ShoesCornerApp() {
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [sortBy, setSortBy] = useState("featured");
  const [modalProduct, setModalProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [checkoutState, setCheckoutState] = useState("idle");
  const [contactInfo, setContactInfo] = useState({ name: "", phone: "", email: "" });
  const [toast, setToast] = useState("");
  const gridRef = useRef(null);

  const toggleCat = (c) => setSelectedCats((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  const toggleSize = (s) => setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const clearFilters = () => { setSelectedCats([]); setSelectedSizes([]); setPriceRange([0, 15000]); };

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCats.length === 0 || selectedCats.includes(p.category);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesSize = selectedSizes.length === 0 || p.sizes.some((s) => selectedSizes.includes(s));
      return matchesSearch && matchesCat && matchesPrice && matchesSize;
    });
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [search, selectedCats, selectedSizes, priceRange, sortBy]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const addToCart = (product, size, qty) => {
    setCart((prev) => {
      const existing = prev.findIndex((i) => i.id === product.id && i.size === size);
      if (existing >= 0) {
        const next = [...prev];
        next[existing].qty += qty;
        return next;
      }
      return [...prev, { ...product, size, qty }];
    });
    setModalProduct(null);
    showToast(`${product.name} added to cart`);
  };

  const quickAdd = (product) => addToCart(product, product.sizes[0], 1);

  const updateQty = (idx, delta) => {
    setCart((prev) => {
      const next = [...prev];
      next[idx].qty = Math.max(1, next[idx].qty + delta);
      return next;
    });
  };

  const removeItem = (idx) => setCart((prev) => prev.filter((_, i) => i !== idx));

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const openContactForm = () => setCheckoutState("form");

  const submitContact = () => {
    if (!contactInfo.name.trim() || !contactInfo.phone.trim()) return;
    setCheckoutState("done");
    setTimeout(() => {
      setCart([]);
      setCheckoutState("idle");
      setContactInfo({ name: "", phone: "", email: "" });
      setCartOpen(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLOR.paper, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Header search={search} setSearch={setSearch} cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <Hero onShopClick={() => gridRef.current?.scrollIntoView({ behavior: "smooth" })} />

      <main ref={gridRef} className="max-w-6xl mx-auto px-5 py-10">
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm" style={{ color: COLOR.slate }}>{filtered.length} shoes</p>
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full border"
              style={{ borderColor: COLOR.line, color: COLOR.ink }}
            >
              <SlidersHorizontal size={14} /> Filters
              {(selectedCats.length + selectedSizes.length) > 0 && (
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: COLOR.ember, color: "#fff" }}
                >
                  {selectedCats.length + selectedSizes.length}
                </span>
              )}
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm font-medium mb-2" style={{ color: COLOR.ink }}>No shoes match those filters.</p>
              <button onClick={clearFilters} className="text-sm underline" style={{ color: COLOR.slate }}>Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={setModalProduct} onQuickAdd={quickAdd} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t mt-10" style={{ borderColor: COLOR.line }}>
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm font-bold" style={{ color: COLOR.ink }}>Shoes Corner</span>
          <p className="text-xs text-center" style={{ color: COLOR.slate }}>
            Demo storefront with sample products — not affiliated with Nike or any other brand.
          </p>
        </div>
      </footer>

      {/* Filters side nav — opens on click, any screen size */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: "rgba(21,24,31,0.5)" }} onClick={() => setFiltersOpen(false)}>
          <div className="w-80 max-w-[85vw] h-full bg-white p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-sm" style={{ color: COLOR.ink }}>Filters</h2>
              <button onClick={() => setFiltersOpen(false)}><X size={20} color={COLOR.ink} /></button>
            </div>
            <Filters
              selectedCats={selectedCats}
              toggleCat={toggleCat}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedSizes={selectedSizes}
              toggleSize={toggleSize}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onClear={clearFilters}
            />
            <button
              onClick={() => setFiltersOpen(false)}
              className="w-full mt-6 py-3 rounded-full font-semibold text-sm"
              style={{ backgroundColor: COLOR.ink, color: COLOR.paper }}
            >
              Show {filtered.length} shoes
            </button>
          </div>
        </div>
      )}

      {modalProduct && (
        <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} onAdd={addToCart} />
      )}

      {cartOpen && (
        <CartDrawer
          items={cart}
          onClose={() => { setCartOpen(false); setCheckoutState("idle"); }}
          updateQty={updateQty}
          removeItem={removeItem}
          checkoutState={checkoutState}
          onOpenContactForm={openContactForm}
          onBackToCart={() => setCheckoutState("idle")}
          contactInfo={contactInfo}
          setContactInfo={setContactInfo}
          onSubmitContact={submitContact}
        />
      )}

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm font-medium z-50"
          style={{ backgroundColor: COLOR.ink, color: COLOR.paper }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
