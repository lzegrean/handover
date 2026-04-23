"use client";
import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Heart, Calendar, Users, ArrowRight, X, Check, Shield, Clock, Building2, GraduationCap, Sparkles, ChevronRight, Zap, Wifi, Flame, Droplet, Wind, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Visual presets cycled through listings so each card gets a different look
const GRADIENTS = [
  "from-[#D9F54B] via-[#C4CFAB] to-[#8B9A65]",
  "from-[#F4A43A] via-[#E89B7D] to-[#C67D5A]",
  "from-[#E85D42] via-[#D4826B] to-[#8B4A3A]",
  "from-[#0F1115] via-[#2A2D35] to-[#4A4F5C]",
  "from-[#8B9A65] via-[#A8B585] to-[#C4CFAB]",
  "from-[#E89B7D] via-[#D4826B] to-[#B86C54]",
  "from-[#C4CFAB] via-[#8B9A65] to-[#5A6B42]",
  "from-[#F4A43A] via-[#E85D42] to-[#8B4A3A]",
];
const PATTERNS = ["dots", "stripes", "grid", "waves", "dots", "stripes", "grid", "waves"];

// Transform a Supabase row into the shape the UI components expect
function transformListing(row, index) {
  return {
    id: row.id,
    title: row.title,
    area: row.area,
    postcode: row.postcode,
    price: row.price_monthly,
    bills: row.bills_included,
    deposit: row.deposit,
    handoverDate: row.handover_date ? new Date(row.handover_date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }) : '',
    availableUntil: row.available_until ? new Date(row.available_until).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }) : '',
    uni: row.uni,
    walkMins: row.walk_mins,
    gender: row.gender_preference,
    houseSize: row.house_size,
    currentHousemates: row.current_housemates,
    features: row.features || [],
    description: row.description,
    reason: row.reason,
    gradient: GRADIENTS[index % GRADIENTS.length],
    pattern: PATTERNS[index % PATTERNS.length],
    lister: {
      name: "Student",
      year: "",
      type: "Student",
      verified: true,
      rating: 4.8,
      responses: "usually replies quickly",
    },
  };
}

const LISTINGS = [
  {
    id: 1, title: "Sunny double in Victorian terrace", area: "St Dunstan's", postcode: "CT2 8BU",
    price: 650, bills: true, deposit: 650, handoverDate: "Feb 1", availableUntil: "Jun 30",
    uni: "UKC", walkMins: 12, gender: "Any", houseSize: 4, currentHousemates: "2 girls, 1 boy — all 2nd yrs",
    lister: { name: "Freya M.", year: "Year 2 Politics", type: "Student", verified: true, rating: 4.9, responses: "usually replies in 2hrs" },
    features: ["Double bed", "Garden", "Fast wifi", "Washer/dryer", "Ensuite"],
    gradient: "from-[#D9F54B] via-[#C4CFAB] to-[#8B9A65]", pattern: "dots",
    reason: "Starting a placement in London — using my RRA exit right.",
    description: "Gorgeous high-ceilinged room in a period four-bed, 12 mins walk to UKC main gate. South-facing so light all afternoon. Housemates are lovely — 2 girls, 1 guy, all 2nd years, mix of Politics/English/Biosci. Big garden, two bathrooms, proper kitchen. Fully furnished + my plants stay if you want them.",
  },
  {
    id: 2, title: "Bright single, 4 mins from Cathedral", area: "City Centre", postcode: "CT1 2PG",
    price: 575, bills: true, deposit: 575, handoverDate: "Mar 1", availableUntil: "Aug 31",
    uni: "CCCU", walkMins: 4, gender: "Any", houseSize: 5, currentHousemates: "Mixed house, all finalists",
    lister: { name: "Jamal K.", year: "Year 3 Law", type: "Student", verified: true, rating: 5.0, responses: "usually replies same day" },
    features: ["Desk + chair", "Fast wifi", "Bills included", "Bike storage"],
    gradient: "from-[#E85D42] via-[#E89B7D] to-[#F4EFE6]", pattern: "stripes",
    reason: "Graduating a term early — done with dissertation.",
    description: "Proper central room in a quiet 5-bed. Walk to CCCU in 4, UKC bus from the corner. Solid desk setup, thick walls (you can actually study). Everyone's chill and mostly in the library by March anyway.",
  },
  {
    id: 3, title: "Parkwood Court — Studio 14B", area: "Parkwood (UKC)", postcode: "CT2 7TT",
    price: 198, bills: true, deposit: 0, handoverDate: "Jan 20", availableUntil: "Jun 14",
    uni: "UKC", walkMins: 2, gender: "Any", houseSize: 1, currentHousemates: "Self-contained studio",
    lister: { name: "Kent Hospitality (UKC)", year: "Official partner", type: "Institution", verified: true, rating: 4.7, responses: "office hours" },
    features: ["Ensuite", "Weekly clean", "24/7 security", "All bills", "On campus"],
    gradient: "from-[#0F1115] via-[#2A2D35] to-[#4B5162]", pattern: "grid",
    reason: "Student withdrawn under RRA — room released to marketplace.",
    description: "On-campus studio released by the University of Kent following a Renters' Rights Act exit. Rent is per week (£198/wk = ~£858/month). Move-in packs, security, and 24/7 support. Full university contract — no deposit.",
    isPerWeek: true,
  },
  {
    id: 4, title: "Cosy single, huge shared kitchen", area: "Hales Place", postcode: "CT2 7AX",
    price: 495, bills: false, deposit: 495, handoverDate: "Apr 1", availableUntil: "Jul 31",
    uni: "UKC", walkMins: 18, gender: "Female preferred", houseSize: 6, currentHousemates: "5 girls, v. chill",
    lister: { name: "Lucia R.", year: "Year 2 Spanish & English", type: "Student", verified: true, rating: 4.8, responses: "replies within a day" },
    features: ["Double bed", "Huge kitchen", "Garden", "Cheap rent"],
    gradient: "from-[#F4A43A] via-[#F4D9A8] to-[#F4EFE6]", pattern: "waves",
    reason: "Year abroad in Barcelona — bye Canterbury ❤️",
    description: "Cheapest decent room in Hales Place honestly. Six-bed, all girls, genuinely nice vibes — movie nights, group dinners, shared Ocado. 18 min walk to campus or the Unibus stops 2 mins away.",
  },
  {
    id: 5, title: "Modern ensuite with balcony", area: "Wincheap", postcode: "CT1 3RY",
    price: 610, bills: true, deposit: 610, handoverDate: "Feb 15", availableUntil: "Aug 15",
    uni: "UKC/CCCU", walkMins: 22, gender: "Any", houseSize: 3, currentHousemates: "2 postgrads",
    lister: { name: "Theo B.", year: "Year 1 Architecture", type: "Student", verified: true, rating: 4.6, responses: "replies within hours" },
    features: ["Ensuite", "Balcony", "Dishwasher", "Newbuild"],
    gradient: "from-[#C4CFAB] via-[#D9F54B] to-[#F4EFE6]", pattern: "dots",
    reason: "Transferring to Kent's Medway campus.",
    description: "Newbuild flat, everything works, actually clean. Balcony overlooks the river. Bit further from campus but the bus is reliable and Wincheap has Lidl, Aldi and the good coffee place.",
  },
  {
    id: 6, title: "Twin room in terraced 5-bed", area: "Military Road", postcode: "CT1 1LA",
    price: 625, bills: true, deposit: 625, handoverDate: "Feb 1", availableUntil: "Jun 30",
    uni: "CCCU", walkMins: 8, gender: "Any", houseSize: 5, currentHousemates: "Mixed — 2nd & 3rd yrs",
    lister: { name: "Canterbury Student Homes", year: "Verified agency", type: "Agency", verified: true, rating: 4.4, responses: "office hours, Mon–Sat" },
    features: ["Ensuite", "Cleaner fortnightly", "High-speed wifi", "Managed"],
    gradient: "from-[#0F1115] via-[#E85D42] to-[#F4A43A]", pattern: "stripes",
    reason: "Previous tenant used RRA two-month notice — we're re-letting directly.",
    description: "Managed property, we handle all the tenancy admin. Agency viewing fees waived for Handover users. References required, standard assured periodic tenancy with pro-rated rent from handover date.",
  },
  {
    id: 7, title: "Small but perfect single", area: "St Michael's Road", postcode: "CT2 7AH",
    price: 540, bills: true, deposit: 540, handoverDate: "Mar 10", availableUntil: "Aug 31",
    uni: "UKC", walkMins: 15, gender: "Female preferred", houseSize: 4, currentHousemates: "3 girls, one quiet guy",
    lister: { name: "Amara O.", year: "Year 2 Psychology", type: "Student", verified: true, rating: 5.0, responses: "replies when she can" },
    features: ["Single bed", "Desk", "Quiet street", "Near Asda"],
    gradient: "from-[#E89B7D] via-[#F4D9A8] to-[#C4CFAB]", pattern: "waves",
    reason: "Taking the rest of the year out for health reasons.",
    description: "Smaller room but honestly so cute — fairy lights, big window, south-facing. House is quiet, good for studying. Rent includes everything. Please be respectful of the housemates, they've been lovely to me.",
  },
  {
    id: 8, title: "Double with desk nook", area: "Old Dover Road", postcode: "CT1 3JA",
    price: 595, bills: false, deposit: 595, handoverDate: "Feb 1", availableUntil: "Jul 31",
    uni: "CCCU", walkMins: 10, gender: "Any", houseSize: 4, currentHousemates: "3 lads, all final year",
    lister: { name: "Rory D.", year: "Year 3 Sport Science", type: "Student", verified: true, rating: 4.7, responses: "replies quickly" },
    features: ["Double bed", "Built-in desk", "Garden", "Cheap pub nearby"],
    gradient: "from-[#D9F54B] via-[#F4A43A] to-[#E85D42]", pattern: "grid",
    reason: "Moving in with my girlfriend — sorry lads.",
    description: "Proper lad house, five mins to CCCU. Room's the biggest in the house (I nabbed it first). Garden's good in summer. Beer fridge included in the handover if you want it 🍺",
  },
];

const UNIS = ["all", "UKC", "CCCU", "UKC/CCCU"];

function Logo({ className = "" }) {
  return (
    <span className={`flex items-baseline gap-[2px] ${className}`}>
      <span className="font-serif italic text-[1.05em] -mr-[1px]" style={{ fontFamily: "'Instrument Serif', serif" }}>handover</span>
      <span className="w-[6px] h-[6px] rounded-full bg-[#D9F54B] self-end mb-[4px]" />
    </span>
  );
}

function PatternOverlay({ type }) {
  if (type === "dots") return (
    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle, rgba(15,17,21,0.35) 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
  );
  if (type === "stripes") return (
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(15,17,21,0.4) 0 2px, transparent 2px 12px)" }} />
  );
  if (type === "grid") return (
    <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(244,239,230,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(244,239,230,0.3) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
  );
  if (type === "waves") return (
    <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "repeating-radial-gradient(circle at 0 100%, rgba(15,17,21,0.3) 0 2px, transparent 2px 16px)" }} />
  );
  return null;
}

function ListingCard({ listing, favorites, toggleFav, onOpen }) {
  const isFav = favorites.has(listing.id);
  return (
    <article
      onClick={() => onOpen(listing)}
      className="group relative cursor-pointer bg-[#F4EFE6] border border-[#0F1115]/10 hover:border-[#0F1115]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#0F1115] overflow-hidden"
    >
      {/* Visual */}
      <div className={`relative aspect-[5/4] bg-gradient-to-br ${listing.gradient} overflow-hidden`}>
        <PatternOverlay type={listing.pattern} />
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          {listing.lister.type === "Institution" && (
            <span className="bg-[#0F1115] text-[#F4EFE6] text-[10px] uppercase tracking-[0.14em] px-2 py-1 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>Institution</span>
          )}
          {listing.lister.type === "Agency" && (
            <span className="bg-[#0F1115] text-[#F4EFE6] text-[10px] uppercase tracking-[0.14em] px-2 py-1 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>Agency</span>
          )}
          {listing.bills && (
            <span className="bg-[#F4EFE6] text-[#0F1115] text-[10px] uppercase tracking-[0.14em] px-2 py-1 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>Bills inc.</span>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFav(listing.id); }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isFav ? 'bg-[#E85D42] text-[#F4EFE6]' : 'bg-[#F4EFE6]/90 text-[#0F1115] hover:bg-[#F4EFE6]'}`}
        >
          <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} strokeWidth={2} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0F1115]/60 to-transparent">
          <div className="text-[#F4EFE6] text-xs uppercase tracking-[0.14em] mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>
            <MapPin className="inline w-3 h-3 mr-1 -mt-0.5" />{listing.area}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-[17px] leading-tight font-medium text-[#0F1115]">{listing.title}</h3>
          <div className="text-right shrink-0">
            <div className="text-[20px] font-semibold leading-none text-[#0F1115]">£{listing.price}<span className="text-[11px] font-normal text-[#0F1115]/60">{listing.isPerWeek ? "/wk" : "/mo"}</span></div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[12px] text-[#0F1115]/70 mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
          <span><Calendar className="inline w-3 h-3 mr-1 -mt-0.5" />{listing.handoverDate}</span>
          <span><GraduationCap className="inline w-3 h-3 mr-1 -mt-0.5" />{listing.uni} · {listing.walkMins}min</span>
        </div>
        <div className="pt-3 border-t border-[#0F1115]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#0F1115] text-[#F4EFE6] text-[11px] font-medium flex items-center justify-center">
              {listing.lister.name.charAt(0)}
            </div>
            <div className="text-[12px]">
              <div className="text-[#0F1115] font-medium leading-tight flex items-center gap-1">
                {listing.lister.name.split(' ')[0]}
                {listing.lister.verified && <Check className="w-3 h-3 text-[#0F1115] bg-[#D9F54B] rounded-full p-[1px]" strokeWidth={3} />}
              </div>
              <div className="text-[#0F1115]/60 leading-tight">{listing.lister.year}</div>
            </div>
          </div>
          <div className="text-[12px] flex items-center gap-1 text-[#0F1115]/70">
            <Star className="w-3 h-3 fill-[#D9F54B] text-[#D9F54B]" />{listing.lister.rating}
          </div>
        </div>
      </div>
    </article>
  );
}

function ListingModal({ listing, onClose, favorites, toggleFav }) {
  if (!listing) return null;
  const isFav = favorites.has(listing.id);
  return (
    <div className="fixed inset-0 z-50 bg-[#0F1115]/70 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen flex items-start justify-center p-4 md:p-8">
        <div onClick={(e) => e.stopPropagation()} className="bg-[#F4EFE6] w-full max-w-4xl relative border-2 border-[#0F1115] shadow-[16px_16px_0_0_rgba(15,17,21,0.2)]">
          <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#F4EFE6] border-2 border-[#0F1115] flex items-center justify-center hover:bg-[#D9F54B] transition-colors">
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>

          <div className={`relative aspect-[16/7] bg-gradient-to-br ${listing.gradient} overflow-hidden`}>
            <PatternOverlay type={listing.pattern} />
            <div className="absolute bottom-6 left-6 right-20">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#0F1115]/70 mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>{listing.postcode} · {listing.area}</div>
              <h2 className="text-[32px] md:text-[44px] leading-[0.95] text-[#0F1115] max-w-xl" style={{ fontFamily: "'Instrument Serif', serif" }}>{listing.title}</h2>
            </div>
          </div>

          <div className="p-6 md:p-10 grid md:grid-cols-[1fr,280px] gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#D9F54B] text-[#0F1115] text-[11px] uppercase tracking-[0.14em] px-3 py-1.5 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>
                  <Zap className="inline w-3 h-3 mr-1 -mt-0.5" />Handover: {listing.handoverDate}
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#0F1115]/60" style={{ fontFamily: "'DM Mono', monospace" }}>until {listing.availableUntil}</span>
              </div>

              <div className="mb-6 p-4 bg-[#0F1115]/5 border-l-2 border-[#E85D42]">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#0F1115]/60 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Why they're leaving</div>
                <div className="text-[15px] italic text-[#0F1115]" style={{ fontFamily: "'Instrument Serif', serif" }}>"{listing.reason}"</div>
              </div>

              <h3 className="text-[13px] uppercase tracking-[0.2em] text-[#0F1115]/60 mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>The room</h3>
              <p className="text-[15px] leading-relaxed text-[#0F1115]/90 mb-6">{listing.description}</p>

              <h3 className="text-[13px] uppercase tracking-[0.2em] text-[#0F1115]/60 mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>What's included</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {listing.features.map(f => (
                  <span key={f} className="text-[13px] px-3 py-1.5 border border-[#0F1115]/20 rounded-full bg-[#F4EFE6]">{f}</span>
                ))}
              </div>

              <h3 className="text-[13px] uppercase tracking-[0.2em] text-[#0F1115]/60 mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>The household</h3>
              <p className="text-[14px] text-[#0F1115]/80 mb-2">House of {listing.houseSize}. {listing.currentHousemates}.</p>
              <p className="text-[14px] text-[#0F1115]/80">Preferred: <span className="text-[#0F1115] font-medium">{listing.gender}</span></p>
            </div>

            {/* Sidebar */}
            <aside className="border border-[#0F1115]/15 p-5 bg-[#F4EFE6] h-fit sticky top-4">
              <div className="pb-4 border-b border-[#0F1115]/10 mb-4">
                <div className="text-[28px] font-semibold text-[#0F1115] leading-none">£{listing.price}<span className="text-[13px] font-normal text-[#0F1115]/60"> {listing.isPerWeek ? "/ week" : "/ month"}</span></div>
                <div className="text-[12px] text-[#0F1115]/60 mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>{listing.bills ? "Bills included" : "Bills extra (~£60/mo)"}</div>
                <div className="text-[12px] text-[#0F1115]/60" style={{ fontFamily: "'DM Mono', monospace" }}>Deposit: £{listing.deposit}</div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-[#0F1115] text-[#F4EFE6] font-medium flex items-center justify-center">
                  {listing.lister.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-medium text-[#0F1115] flex items-center gap-1">
                    {listing.lister.name}
                    {listing.lister.verified && <Check className="w-3.5 h-3.5 text-[#0F1115] bg-[#D9F54B] rounded-full p-[2px]" strokeWidth={3} />}
                  </div>
                  <div className="text-[12px] text-[#0F1115]/60">{listing.lister.year}</div>
                </div>
              </div>

              <div className="text-[11px] text-[#0F1115]/60 mb-4 flex items-center gap-1" style={{ fontFamily: "'DM Mono', monospace" }}>
                <Clock className="w-3 h-3" />{listing.lister.responses}
              </div>

              <button className="w-full bg-[#0F1115] text-[#F4EFE6] py-3 text-[14px] font-medium hover:bg-[#E85D42] transition-colors mb-2">
                Message {listing.lister.name.split(' ')[0]}
              </button>
              <button className="w-full border border-[#0F1115] py-3 text-[14px] font-medium hover:bg-[#D9F54B] transition-colors mb-2">
                Request a viewing
              </button>
              <button
                onClick={() => toggleFav(listing.id)}
                className={`w-full py-3 text-[14px] font-medium flex items-center justify-center gap-2 transition-colors ${isFav ? 'bg-[#E85D42] text-[#F4EFE6]' : 'border border-[#0F1115]/30 hover:border-[#0F1115]'}`}
              >
                <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
                {isFav ? 'Saved' : 'Save'}
              </button>

              <div className="mt-4 pt-4 border-t border-[#0F1115]/10 text-[11px] text-[#0F1115]/60" style={{ fontFamily: "'DM Mono', monospace" }}>
                <Shield className="inline w-3 h-3 mr-1 -mt-0.5" />Student email verified · Deposit returned via your protection scheme
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Handover() {
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(800);
  const [uniFilter, setUniFilter] = useState('all');
  const [billsOnly, setBillsOnly] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch listings from Supabase on mount
  useEffect(() => {
    async function fetchListings() {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformed = (data || []).map((row, i) => transformListing(row, i));
        setListings(transformed);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setFetchError(err.message);
        // Fall back to hardcoded data if the DB fetch fails, so site still works
        setListings(LISTINGS);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const toggleFav = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => listings.filter(l => {
    if (search && !`${l.title} ${l.area} ${l.postcode}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (l.price > maxPrice && !l.isPerWeek) return false;
    if (uniFilter !== 'all' && !l.uni.includes(uniFilter)) return false;
    if (billsOnly && !l.bills) return false;
    return true;
  }), [listings, search, maxPrice, uniFilter, billsOnly]);

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#0F1115]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        body { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Instrument Serif', serif; }
        .mono { font-family: 'DM Mono', monospace; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee { animation: marquee 40s linear infinite; }
        @keyframes float-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .float-up { animation: float-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-[#F4EFE6]/95 backdrop-blur border-b border-[#0F1115]/10">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Logo className="text-[22px]" />
          <div className="hidden md:flex items-center gap-8 text-[14px]">
            <a href="#listings" className="hover:text-[#E85D42] transition-colors">Browse rooms</a>
            <a href="#how" className="hover:text-[#E85D42] transition-colors">How it works</a>
            <a href="#rra" className="hover:text-[#E85D42] transition-colors">The RRA</a>
            <a href="#partners" className="hover:text-[#E85D42] transition-colors">For unis & agents</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden md:block text-[14px] hover:text-[#E85D42] transition-colors">Sign in</button>
            <button className="bg-[#0F1115] text-[#F4EFE6] text-[13px] font-medium px-4 py-2 hover:bg-[#E85D42] transition-colors">List your room</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#0F1115]/10">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-10 md:pb-16">
          <div className="grid md:grid-cols-[1.1fr,1fr] gap-10 md:gap-16 items-end">
            <div className="float-up">
              <div className="inline-flex items-center gap-2 bg-[#D9F54B] text-[#0F1115] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] mb-6 mono" style={{ fontFamily: "'DM Mono', monospace" }}>
                <Sparkles className="w-3 h-3" />Built for the Renters' Rights Act
              </div>
              <h1 className="text-[56px] md:text-[96px] leading-[0.9] tracking-[-0.02em] mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Leaving your<br />
                student house?<br />
                <span className="italic text-[#E85D42]">Pass it on.</span>
              </h1>
              <p className="text-[17px] md:text-[19px] leading-relaxed text-[#0F1115]/75 max-w-xl mb-8">
                Canterbury's marketplace for student rooms being handed over mid-tenancy. Two-month notice under the Renters' Rights Act shouldn't cost you your deposit — it should find you a taker.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#listings" className="bg-[#0F1115] text-[#F4EFE6] px-6 py-3.5 text-[15px] font-medium hover:bg-[#E85D42] transition-colors flex items-center gap-2 group">
                  Browse {listings.length} rooms<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#list" className="border-2 border-[#0F1115] px-6 py-3 text-[15px] font-medium hover:bg-[#D9F54B] transition-colors">
                  List yours →
                </a>
              </div>
            </div>

            <div className="relative float-up" style={{ animationDelay: '0.15s' }}>
              <div className="relative aspect-[4/5] max-w-md ml-auto">
                {/* Composed polaroid stack */}
                <div className="absolute top-0 right-12 w-48 aspect-[4/5] bg-gradient-to-br from-[#D9F54B] to-[#C4CFAB] border-2 border-[#0F1115] rotate-[-8deg] shadow-[8px_8px_0_0_#0F1115]">
                  <PatternOverlay type="dots" />
                  <div className="absolute bottom-3 left-3 right-3 text-[11px] mono" style={{ fontFamily: "'DM Mono', monospace" }}>
                    <div className="uppercase tracking-[0.14em] text-[#0F1115]/70">St Dunstan's</div>
                    <div className="text-[#0F1115] text-[13px]">£650 · Feb 1</div>
                  </div>
                </div>
                <div className="absolute top-20 left-0 w-44 aspect-[4/5] bg-gradient-to-br from-[#E85D42] to-[#F4A43A] border-2 border-[#0F1115] rotate-[6deg] shadow-[8px_8px_0_0_#0F1115]">
                  <PatternOverlay type="stripes" />
                  <div className="absolute bottom-3 left-3 right-3 text-[11px] text-[#F4EFE6] mono" style={{ fontFamily: "'DM Mono', monospace" }}>
                    <div className="uppercase tracking-[0.14em] opacity-80">Wincheap</div>
                    <div className="text-[13px]">£610 · Feb 15</div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-52 aspect-[4/5] bg-gradient-to-br from-[#0F1115] to-[#4B5162] border-2 border-[#0F1115] rotate-[-3deg] shadow-[8px_8px_0_0_#D9F54B]">
                  <PatternOverlay type="grid" />
                  <div className="absolute top-3 left-3 bg-[#D9F54B] text-[#0F1115] text-[9px] uppercase tracking-[0.14em] px-2 py-0.5 mono" style={{ fontFamily: "'DM Mono', monospace" }}>UKC · On campus</div>
                  <div className="absolute bottom-3 left-3 right-3 text-[11px] text-[#F4EFE6] mono" style={{ fontFamily: "'DM Mono', monospace" }}>
                    <div className="uppercase tracking-[0.14em] opacity-70">Parkwood</div>
                    <div className="text-[13px]">£198/wk · Jan 20</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-14 md:mt-20 float-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-[#0F1115] p-2 md:p-3 flex flex-col md:flex-row gap-2 border-2 border-[#0F1115]">
              <div className="flex-1 flex items-center gap-2 bg-[#F4EFE6] px-4 py-3">
                <Search className="w-4 h-4 text-[#0F1115]/60" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="St Dunstan's, UKC, CT2…"
                  className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#0F1115]/50"
                />
              </div>
              <select
                value={uniFilter}
                onChange={(e) => setUniFilter(e.target.value)}
                className="bg-[#F4EFE6] px-4 py-3 text-[14px] outline-none cursor-pointer"
              >
                {UNIS.map(u => <option key={u} value={u}>{u === 'all' ? 'Any university' : u}</option>)}
              </select>
              <div className="bg-[#F4EFE6] px-4 py-3 flex items-center gap-3 min-w-[220px]">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#0F1115]/60 mono shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>Max £{maxPrice}</span>
                <input
                  type="range" min="400" max="800" step="25" value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="flex-1 accent-[#E85D42]"
                />
              </div>
              <button className="bg-[#D9F54B] text-[#0F1115] px-6 py-3 font-medium text-[14px] hover:bg-[#F4EFE6] transition-colors flex items-center justify-center gap-2">
                Search<ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS MARQUEE */}
      <section className="bg-[#0F1115] text-[#F4EFE6] py-5 overflow-hidden border-b border-[#0F1115]">
        <div className="marquee flex whitespace-nowrap items-center gap-12 text-[13px] uppercase tracking-[0.2em] mono" style={{ fontFamily: "'DM Mono', monospace" }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 pr-12">
              <span><span className="text-[#D9F54B]">◆</span> 47 active rooms in Canterbury</span>
              <span><span className="text-[#D9F54B]">◆</span> UKC + CCCU + KMTP covered</span>
              <span><span className="text-[#D9F54B]">◆</span> Avg handover time: 11 days</span>
              <span><span className="text-[#D9F54B]">◆</span> £0 agency fees for students</span>
              <span><span className="text-[#D9F54B]">◆</span> Kent only — for now</span>
              <span><span className="text-[#D9F54B]">◆</span> Built by students, for students</span>
            </div>
          ))}
        </div>
      </section>

      {/* LISTINGS */}
      <section id="listings" className="max-w-[1400px] mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#0F1115]/60 mb-2 mono" style={{ fontFamily: "'DM Mono', monospace" }}>01 / Browse</div>
            <h2 className="text-[44px] md:text-[64px] leading-[0.95] tracking-[-0.02em]" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Rooms going <span className="italic">now.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={billsOnly} onChange={(e) => setBillsOnly(e.target.checked)} className="accent-[#E85D42]" />
              <span>Bills included only</span>
            </label>
            <span className="mono text-[#0F1115]/60" style={{ fontFamily: "'DM Mono', monospace" }}>{filtered.length} results</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-[#0F1115]/20">
            <div className="text-[20px] mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>Nothing matches those filters.</div>
            <button onClick={() => { setSearch(''); setMaxPrice(800); setUniFilter('all'); setBillsOnly(false); }} className="text-[14px] underline hover:text-[#E85D42]">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(l => <ListingCard key={l.id} listing={l} favorites={favorites} toggleFav={toggleFav} onOpen={setSelected} />)}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-[#0F1115] text-[#F4EFE6] py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#D9F54B] mb-2 mono" style={{ fontFamily: "'DM Mono', monospace" }}>02 / How it works</div>
          <h2 className="text-[44px] md:text-[72px] leading-[0.95] tracking-[-0.02em] mb-14 md:mb-20" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Three steps. <span className="italic">No estate agents.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-10 md:gap-6">
            {[
              { n: "01", title: "Give notice", body: "From 1 May 2026, the Renters' Rights Act gives you a statutory right to serve two months' written notice at any time during your tenancy. No break clauses, no landlord approval required. We help you draft it in 30 seconds." },
              { n: "02", title: "List in 5 minutes", body: "Photos, rent, handover date, why you're leaving. Verified .ac.uk listings rank higher. Completely free to list." },
              { n: "03", title: "Hand over", body: "Messages and viewings handled in-app. Your replacement signs a new tenancy directly with your landlord (subject to their agreement); your deposit returns via the protection scheme. We help coordinate the timing." },
            ].map((s, i) => (
              <div key={s.n} className="relative">
                <div className="text-[12px] mono text-[#D9F54B] mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>{s.n}</div>
                <h3 className="text-[28px] leading-tight mb-3" style={{ fontFamily: "'Instrument Serif', serif" }}>{s.title}</h3>
                <p className="text-[15px] leading-relaxed text-[#F4EFE6]/70 max-w-sm">{s.body}</p>
                {i < 2 && <ChevronRight className="hidden md:block absolute top-0 -right-3 w-5 h-5 text-[#D9F54B]" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RRA EXPLAINER */}
      <section id="rra" className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D9F54B]/40 via-[#F4EFE6] to-[#E89B7D]/30" />
        <div className="relative max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-[1fr,1.2fr] gap-12 md:gap-20 items-start">
            <div className="md:sticky md:top-24">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#0F1115]/60 mb-2 mono" style={{ fontFamily: "'DM Mono', monospace" }}>03 / Why now</div>
              <h2 className="text-[44px] md:text-[64px] leading-[0.95] tracking-[-0.02em] mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
                The <span className="italic">Renters' Rights Act</span> changed everything.
              </h2>
              <p className="text-[16px] leading-relaxed text-[#0F1115]/75 max-w-lg">
                Before May 2026, a fixed-term student AST locked you in for the whole year. Sub-let or eat the rent. That's over. From 1 May 2026, existing tenancies automatically convert to assured periodic tenancies — and tenants can serve two months' notice at any time, including students in shared HMOs.
              </p>
              <p className="text-[16px] leading-relaxed text-[#0F1115]/75 max-w-lg mt-4">
                That freedom only works if you can find a replacement. That's us.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { q: "When can I serve notice?", a: "From 1 May 2026, at any time during your tenancy. Notice is two months. No break clauses, no landlord approval required. (Note: some purpose-built student accommodation from code-registered providers may be exempt — check your tenancy agreement.)" },
                { q: "Does my landlord have to re-let to whoever I find?", a: "No — your landlord's cooperation is required to grant a new tenancy to your replacement. In practice most landlords prefer a ready-to-sign replacement over a void period, which is where Handover comes in. We help coordinate the introduction and the paperwork." },
                { q: "What about joint tenancies?", a: "Joint HMOs are the tricky bit. We walk you through either (a) a deed of surrender plus a new assured periodic tenancy for the remaining and incoming tenants, or (b) a deed of assignment to transfer your share. Both routes require landlord consent. Our template documents are provided for convenience — use them with independent legal advice." },
                { q: "Will I lose my deposit?", a: "Not if the handover's clean. Your deposit returns to you via the government-approved protection scheme (DPS, MyDeposits or TDS), subject to any lawful deductions. Your replacement pays a fresh deposit directly to the landlord, which must also be protected in a scheme. Handover does not hold or handle deposit money." },
              ].map((item, i) => (
                <details key={i} className="group bg-[#F4EFE6] border border-[#0F1115]/15 p-5 hover:border-[#0F1115]/40 transition-colors">
                  <summary className="cursor-pointer flex items-center justify-between text-[17px] font-medium leading-snug">
                    {item.q}<span className="text-[#E85D42] group-open:rotate-45 transition-transform text-[20px] leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#0F1115]/75">{item.a}</p>
                </details>
              ))}
              <div className="text-[11px] mono text-[#0F1115]/50 mt-2" style={{ fontFamily: "'DM Mono', monospace" }}>
                ◆ Information only — not legal advice. Tenancy terms vary and some accommodation types (including certain PBSA from code-registered providers) may be exempt from parts of the Renters' Rights Act. We recommend independent advice before serving notice.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS / INSTITUTIONS */}
      <section id="partners" className="py-20 md:py-28 bg-[#F4EFE6] border-t border-[#0F1115]/10">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#0F1115]/60 mb-2 mono" style={{ fontFamily: "'DM Mono', monospace" }}>04 / For partners</div>
              <h2 className="text-[44px] md:text-[64px] leading-[0.95] tracking-[-0.02em] mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Universities & agents,<br />list <span className="italic">here too.</span>
              </h2>
              <p className="text-[16px] leading-relaxed text-[#0F1115]/75 max-w-lg mb-8">
                Students are exiting tenancies faster than your re-letting pipeline can move. Handover gives you a verified demand stream — every listing reaches our active student network across Kent. Free to list up to five concurrent rooms; institutional dashboard from £99/mo.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: Building2, label: "Accommodation offices" },
                  { icon: Shield, label: "Verified agents" },
                  { icon: Users, label: "Student halls overflow" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="border border-[#0F1115]/20 px-3 py-1.5 text-[13px] flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />{label}
                  </span>
                ))}
              </div>
              <button className="bg-[#0F1115] text-[#F4EFE6] px-6 py-3.5 text-[15px] font-medium hover:bg-[#E85D42] transition-colors flex items-center gap-2 group">
                Partner with us<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: "2,800+", l: "Canterbury students on the network" },
                  { v: "11 days", l: "Average handover time" },
                  { v: "£0", l: "Agency fees for students" },
                  { v: "UKC · CCCU · KMTP", l: "Institutions covered at launch" },
                ].map((s, i) => (
                  <div key={i} className={`p-5 ${i % 2 === 0 ? 'bg-[#0F1115] text-[#F4EFE6]' : 'bg-[#D9F54B] text-[#0F1115]'} aspect-square flex flex-col justify-between`}>
                    <div className="text-[32px] md:text-[44px] leading-[0.9] tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>{s.v}</div>
                    <div className="text-[12px] uppercase tracking-[0.14em] mono opacity-80" style={{ fontFamily: "'DM Mono', monospace" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPANSION / CITIES */}
      <section className="bg-[#0F1115] text-[#F4EFE6] py-20 md:py-28 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#D9F54B] mb-2 mono" style={{ fontFamily: "'DM Mono', monospace" }}>05 / Next</div>
          <h2 className="text-[44px] md:text-[80px] leading-[0.9] tracking-[-0.02em] mb-10" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Canterbury first.<br /><span className="italic text-[#D9F54B]">Then everywhere else.</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-3 md:gap-4 mb-10">
            {[
              { city: "Canterbury", status: "Live", active: true },
              { city: "Brighton", status: "Feb 2026", active: false },
              { city: "Bristol", status: "Mar 2026", active: false },
              { city: "Exeter", status: "Mar 2026", active: false },
              { city: "Nottingham", status: "Apr 2026", active: false },
              { city: "Leeds", status: "Apr 2026", active: false },
              { city: "Manchester", status: "May 2026", active: false },
              { city: "Edinburgh", status: "Q3 2026", active: false },
            ].map(c => (
              <div key={c.city} className={`p-5 border ${c.active ? 'bg-[#D9F54B] text-[#0F1115] border-[#D9F54B]' : 'border-[#F4EFE6]/20 hover:border-[#F4EFE6]/60 transition-colors'}`}>
                <div className="text-[22px] leading-tight mb-1" style={{ fontFamily: "'Instrument Serif', serif" }}>{c.city}</div>
                <div className="text-[11px] uppercase tracking-[0.14em] mono opacity-70" style={{ fontFamily: "'DM Mono', monospace" }}>{c.active && <span className="inline-block w-1.5 h-1.5 bg-[#0F1115] rounded-full mr-1 animate-pulse" />}{c.status}</div>
              </div>
            ))}
          </div>

          <div className="text-[15px] text-[#F4EFE6]/70 max-w-2xl">
            Your university not listed? <a href="#" className="underline text-[#D9F54B] hover:text-[#F4EFE6]">Request your city</a> — we prioritise based on student demand. 200 sign-ups from one university unlocks a launch.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-[#F4EFE6] relative overflow-hidden border-t border-[#0F1115]/10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#D9F54B] rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#E85D42] rounded-full blur-3xl opacity-30" />
        <div className="relative max-w-[1000px] mx-auto px-5 md:px-8 text-center">
          <h2 className="text-[56px] md:text-[120px] leading-[0.88] tracking-[-0.03em] mb-8" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Got a room to<br /><span className="italic">pass on?</span>
          </h2>
          <p className="text-[18px] text-[#0F1115]/70 max-w-xl mx-auto mb-10">
            Five-minute listing. Free for students. We'll help with the notice letter, the handover paperwork, and the deposit swap.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="bg-[#0F1115] text-[#F4EFE6] px-8 py-4 text-[16px] font-medium hover:bg-[#E85D42] transition-colors flex items-center gap-2 group">
              List your room<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-[#0F1115] px-8 py-3.5 text-[16px] font-medium hover:bg-[#D9F54B] transition-colors">
              Or browse first
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F1115] text-[#F4EFE6] py-14">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-14">
            <div className="md:col-span-2">
              <Logo className="text-[32px] text-[#F4EFE6]" />
              <p className="text-[14px] text-[#F4EFE6]/60 mt-4 max-w-sm">The UK's first marketplace built specifically for student tenancy handovers under the Renters' Rights Act.</p>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#D9F54B] mb-4 mono" style={{ fontFamily: "'DM Mono', monospace" }}>Product</div>
              <ul className="space-y-2 text-[14px] text-[#F4EFE6]/70">
                <li><a href="#" className="hover:text-[#D9F54B]">Browse rooms</a></li>
                <li><a href="#" className="hover:text-[#D9F54B]">List a room</a></li>
                <li><a href="#" className="hover:text-[#D9F54B]">How it works</a></li>
                <li><a href="#" className="hover:text-[#D9F54B]">For partners</a></li>
              </ul>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#D9F54B] mb-4 mono" style={{ fontFamily: "'DM Mono', monospace" }}>Support</div>
              <ul className="space-y-2 text-[14px] text-[#F4EFE6]/70">
                <li><a href="#" className="hover:text-[#D9F54B]">Help centre</a></li>
                <li><a href="#" className="hover:text-[#D9F54B]">The RRA explained</a></li>
                <li><a href="#" className="hover:text-[#D9F54B]">Safety & verification</a></li>
                <li><a href="#" className="hover:text-[#D9F54B]">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#F4EFE6]/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[12px] text-[#F4EFE6]/50 mono" style={{ fontFamily: "'DM Mono', monospace" }}>
            <div>© 2026 Handover Ltd. Built in Canterbury.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#D9F54B]">Privacy</a>
              <a href="#" className="hover:text-[#D9F54B]">Terms</a>
              <a href="#" className="hover:text-[#D9F54B]">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <ListingModal listing={selected} onClose={() => setSelected(null)} favorites={favorites} toggleFav={toggleFav} />
    </div>
  );
}