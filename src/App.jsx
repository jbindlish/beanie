import React, { useMemo, useState } from 'react'

const DATA = [
    { id:'princess-diana-bear', name:'Princess (Diana Bear)', img:'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1000w,f_avif,q_auto:eco,dpr_2/rockcms/2022-08/princess-diana-purple-beanie-baby-te-220803-0b9792.jpg', category:'Bear', releaseYear:1997, peakYear:1998, peakPriceUSD:45000, currentPriceUSD:25, rarity:'Hype Icon',
        fun:["This toy was released as commemerative of Princess Diana's death. The shipments were limited - only 12 toys per store, driving up demand immensely. One of the signature Beanie Babies."],
        notes:"The peak was derived from headlines and other potential exaggerated estimates - real prices might have been lower."
    },
    { id:'peanut-royal-blue', name:'Peanut (Royal Blue)', img:'https://placehold.co/160x120/003399/ffffff?text=Blue+Peanut', category:'Elephant', releaseYear:1995, peakYear:1998, peakPriceUSD:3000, currentPriceUSD:40, rarity:'Color Variant',
        fun:["The royal blue version of Peanut the Elephant was retired quickly, replaced by a lighter blue version. Only 2,000 royal blue Peanuts were believed to exist, making it a key early rarity."],
        notes:"Its high peak value was primarily due to the short production run and distinct color."
    },
    { id:'brownie-cubbie', name:'Brownie/Cubbie', img:'https://placehold.co/160x120/8B4513/ffffff?text=Brownie/Cubbie', category:'Bear', releaseYear:1993, peakYear:1997, peakPriceUSD:1500, currentPriceUSD:12, rarity:'Name Change',
        fun:["Brownie was one of the original nine Beanie Babies released in 1993. It was later renamed 'Cubbie', a common practice by Ty that created accidental early rarities."],
        notes:"Early 1st generation tags are required for peak valuations."
    },
    { id:'patti-magenta', name:'Patti (Magenta)', img:'https://placehold.co/160x120/cc0066/ffffff?text=Magenta+Patti', category:'Platypus', releaseYear:1993, peakYear:1997, peakPriceUSD:900, currentPriceUSD:10, rarity:'Color Variant',
        fun:["Patti was one of the original nine Beanie Babies. It was first released in Magenta, then Raspberry, and finally the common Fuchsia, making the Magenta version the rarest."],
        notes:"Another rarity created by an early color change."
    },
    { id:'garcia-bear', name:'Garcia', img:'https://placehold.co/160x120/008000/ffffff?text=Garcia+Bear', category:'Bear', releaseYear:1996, peakYear:1998, peakPriceUSD:1000, currentPriceUSD:18, rarity:'Tie-Dye',
        fun:["Named after the Grateful Dead's Jerry Garcia, this bear's chaotic tie-dye pattern meant no two were exactly alike, appealing to collectors seeking unique variants."],
        notes:"A popular bear whose value was driven by uniqueness and pop-culture tie-in."
    },
    { id:'nana-bongo', name:'Nana/Bongo', img:'https://placehold.co/160x120/8B4513/ffffff?text=Nana/Bongo', category:'Monkey', releaseYear:1995, peakYear:1997, peakPriceUSD:800, currentPriceUSD:9, rarity:'Name Change',
        fun:["First released as 'Nana' the Monkey, the name was changed to 'Bongo' because 'Nana' was deemed too similar to 'Nannerz'. This change created a brief, valuable production run."],
        notes:"Similar to Brownie/Cubbie, a name change manufactured scarcity."
    },
];

const categories = ['All', ...Array.from(new Set(DATA.map(d => d.category)))];
const sorts = [
    { id: 'name', label: 'Name' },
    { id: 'drop', label: '% Drop (Peak→Now)' },
    { id: 'peak', label: 'Peak Price' },
    { id: 'current', label: 'Current Price' },
    { id: 'year', label: 'Release Year' },
];
const money = n => n.toLocaleString(undefined, { style:'currency', currency:'USD', maximumFractionDigits:2 });
const pctDrop = (p, c) => p ? Math.max(0, Math.min(100, (((p - c) / p) * 100))).toFixed(1) : 0;

export default function App(){
    const [q, setQ] = useState('');
    const [cat, setCat] = useState('All');
    const [sort, setSort] = useState('drop');
    const [dir, setDir] = useState('desc');
    const [open, setOpen] = useState(false);
    const [sel, setSel] = useState(null);
    const [page, setPage] = useState('browse');

    const rows = useMemo(() => {
        let r = DATA.filter(d => {
            const text = `${d.name} ${d.category} ${d.rarity}`.toLowerCase();
            const matchQ = text.includes(q.toLowerCase());
            const matchC = cat === 'All' || d.category === cat;
            return matchQ && matchC;
        });
        r.sort((a, b) => {
            const da = pctDrop(a.peakPriceUSD, a.currentPriceUSD);
            const db = pctDrop(b.peakPriceUSD, b.currentPriceUSD);
            let va, vb;
            switch (sort) {
                case 'name': va = a.name; vb = b.name; break;
                case 'drop': va = da; vb = db; break;
                case 'peak': va = a.peakPriceUSD; vb = b.peakPriceUSD; break;
                case 'current': va = a.currentPriceUSD; vb = b.currentPriceUSD; break;
                case 'year': va = a.releaseYear; vb = b.releaseYear; break;
                default: va = da; vb = db;
            }
            if (va < vb) return dir === 'asc' ? -1 : 1;
            if (va > vb) return dir === 'asc' ? 1 : -1;
            return 0;
        });
        return r;
    }, [q, cat, sort, dir]);

    const NavBtn = ({ id, children }) => (
        <button
            className={`nav-btn ${id === 'browse' ? 'blue' : id === 'categories' ? 'yellow' : id === 'sell' ? 'red' : id === 'my-ebay' ? 'green' : 'nav-learn'}`}
            onClick={() => setPage(id)}
            aria-current={page === id ? 'page' : undefined}
            style={page === id ? { outline: '3px solid rgba(0,0,0,0.08)' } : {}}
        >
            {children}
        </button>
    );

    const showMessage = (message) => {
        // A simple console log is safer than alert() for embedded frames
        console.log("Action Message:", message);
    };

    return (
        <>
            {/* Header */}
            <div className="header">
                <div className="wrap">
                    <div className="header-top">
                        <div className="logo" aria-label="eBay throwback">
                            <span className="B">B</span><span className="b">b</span><span className="a">a</span><span className="y">y</span>
                        </div>
                        <div className="slogan">The world&apos;s online Beanie Baby marketplace - Jai Bindlish&apos;s Real History Project INFO IN LEARN SECTION</div>
                    </div>
                </div>
                <div className="nav">
                    <div className="wrap nav-row">
                        <NavBtn id="browse">Browse</NavBtn>
                        <NavBtn id="categories">Categories</NavBtn>
                        <NavBtn id="sell">Sell</NavBtn>
                        <NavBtn id="my-ebay">My eBay</NavBtn>
                        <div style={{flex:1}} />
                        <div style={{alignSelf:'center'}}>
                            <button className="nav-learn" onClick={() => setPage('learn')} style={{background:'transparent', border:'none', cursor:'pointer', color:'#222', textDecoration: page==='learn' ? 'underline' : 'none'}}>Learn</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="wrap">
                {/* Page: Browse (original UI) */}
                {page === 'browse' && (
                    <>
                        {/* Search / Filters Panel */}
                        <div className="panel">
                            <div className="form-row">
                                <label>Search:&nbsp;</label>
                                <input className="input" placeholder="Find Beanies…" value={q} onChange={e=>setQ(e.target.value)} />
                                <label>&nbsp;Category:&nbsp;</label>
                                <select className="select" value={cat} onChange={e=>setCat(e.target.value)}>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <label>&nbsp;Sort:&nbsp;</label>
                                <select className="select" value={sort} onChange={e=>setSort(e.target.value)}>
                                    {sorts.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                </select>
                                <button className="btn" onClick={()=>setDir(d => d==='asc'?'desc':'asc')}>Order: {dir.toUpperCase()}</button>
                            </div>
                        </div>

                        {/* Listings Table */}
                        <div className="table-wrap">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th width="180">Photo</th>
                                        <th>Title / Details</th>
                                        <th width="220">Price</th>
                                        <th width="120">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map(d => {
                                        const drop = pctDrop(d.peakPriceUSD, d.currentPriceUSD);
                                        return (
                                            <tr key={d.id}>
                                                <td>
                                                    {d.img
                                                        ? <img className="thumb" src={d.img} alt={d.name} />
                                                        : <div className="thumb" />}
                                                </td>
                                                <td>
                                                    <div className="item-title"><a href="#" onClick={(e)=>{e.preventDefault(); setSel(d); setOpen(true);}}>{d.name}</a>
                                                        <span className="badge">{d.rarity}</span>
                                                    </div>
                                                    <div className="item-meta">{d.category} • Released {d.releaseYear} • Peak year {d.peakYear}</div>
                                                    <div className="item-meta">
                                                        <a href="#" onClick={(e)=>{e.preventDefault(); setSel(d); setOpen(true);}}>View description</a>
                                                    </div>
                                                </td>
                                                <td className="price-block">
                                                    <div>Peak: <span className="money">{money(d.peakPriceUSD)}</span></div>
                                                    <div>Now: <span className="money">{money(d.currentPriceUSD)}</span> &nbsp; <span className="drop">-{drop}%</span></div>
                                                    <div style={{marginTop:6}}>
                                                        <div className="bar"><div style={{width:`${Math.max(5, Math.round((d.currentPriceUSD / Math.max(1, d.peakPriceUSD))*100))}%`}} /></div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{display:'grid', gap:6}}>
                                                        <button className="btn" onClick={()=>{ setSel(d); setOpen(true); }}>Bid Now</button>
                                                        <button className="btn" onClick={()=>{ setSel(d); setOpen(true); }}>Details</button>
                                                        <a href="#" onClick={(e)=>e.preventDefault()}>Watch this item</a>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="footer">
                            Jai Bindlish RHP — design spinmed off from late-90s eBay. No affiliation with Ty Inc. or eBay.
                        </div>
                    </>
                )}

                {/* Page: Categories */}
                {page === 'categories' && (
                    <div style={{maxWidth:900, margin:'2rem auto', padding:'0 1rem'}}>
                        <h1>Categories</h1>
                        <p>Click a category to view items in that category.</p>
                        <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:12}}>
                            {categories.map(c => (
                                <button key={c} className="btn" onClick={() => { setCat(c); setPage('browse'); }}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Page: Sell */}
                {page === 'sell' && (
                    <div style={{maxWidth:900, margin:'2rem auto', padding:'0 1rem'}}>
                        <h1>Sell</h1>
                        <p>Placeholder Sell page — describe how to list an item here, or wire up a form to accept a new listing.</p>
                        <div style={{marginTop:12}}>
                            <button className="btn" onClick={() => showMessage('Sell flow not implemented in this demo')}>Start listing</button>
                        </div>
                    </div>
                )}

                {/* Page: My eBay */}
                {page === 'my-ebay' && (
                    <div style={{maxWidth:900, margin:'2rem auto', padding:'0 1rem'}}>
                        <h1>My eBay</h1>
                        <h2>Themes</h2>
                        <p>Theme 2: Work, Exchange, and Technology - This theme focuses on the factors behind the development of systems of economic exchange, particularly the role of technology, economic markets, and government.</p>
                        <p>Theme 2 is the one of the most fitting for this project because Beanie Babies took an immense effect on how e-commerce evolved and adapted. The analysis shows how the fad radicalized many American families to seek “investments” in these stuffed animal toys, anticipating a large increase in value as they get more in demand and less in supply. This project exemplifies the “speculative culture” of economics – directly effecting how different products are viewed and sold in the United States. Complete with deep analysis on the rise of E-commerce and how that affected economy, this website gives an overview of the ripple effects of Beanie Babies.</p>
                        <p>Theme 7: American and Regional Culture - This theme focuses on the how and why national, regional, and group cultures developed and changed as well as how culture has shaped government policy and the economy.</p>
                        <p>Theme 7 is also one of the most fitting for this project because it explores how the economy was shaped by this craze culture of buying Beanie Babies. The analysis also includes how family and household culture was developed and changed by the fad, changing how household dynamics evolved at the turn of the 21st century. Beanie Babies, instead of being the childhood toy that kids played with, were the mobilizing factor in family dynamics – parents rushed to buy new shipments to bond with their kids. Overall, exploring how this fad affected the daily American lifestyle and culture is one of the primary focuses of this project.</p>
                        <h2>Thinking Skills</h2>
                        <p>2C – Explain the significance of a source’s point of view, purpose, historical situation, and/or audience, including how these might limit the use(s) of a source.</p>
                        <p>The sources that are used in this project are somewhat opiniated – mostly those who were affected by the speculative bubble. Therefore, I needed to analyze how exactly the point of view could be biased/wrong, based on this historical context and medium, as well as news outlet and source. Sources also include a range of different publication dates, where some are dated amid the craze, while some are secondary resources analyzing effects. Differentiating between these types of sources will be something I did in the project, curating the most important information. This is demonstrated where there are multiple historical descriptions (mostly from primary sources), and synthesis of analysis (from the secondary sources and beyond). Curating sources and explaining the author’s rhetoric (purpose, situation) has been a primary focus in this project.</p>
                        <p>5B – Explain how a historical development or process relates to another historical development or process.</p>
                        <p>The main premise of the project is how Beanie Babies came to mainstream, and how that affected the US economy. I used skill 5B to analyze causes and effects of changes in the US economy, as well as accurately and succinctly describe the rise and fall of Beanie Babies. I drew clear connections between specific developments in the sale of Beanie Babies in the 90s and connect that to other speculative bubbles, such as the dot.com bubble, and connect that to the eBay and changes in the US economy. Particularly, the supplementary of the project includes important links and causes/effects, accurately considering historical context in depth.</p>
                    </div>
                )}

                {/* Page: Learn */}
                {page === 'learn' && (
                    <article style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem", lineHeight: 1.6 }}>
                        <h1>Research Question</h1>
                        
                        <p> What effects did the Beanie Babies craze in the 1990’s have on United States Economy and E-Commerce, and how? </p>                      
                        <h2>Supplementary Material</h2>
                        
                        <p> The Beanie Baby fad was a borderline insane national speculative bubble, fueled by regular American families purchasing toys from small toy shops. The demand for Beanie Babies, directly caused by Ty’s artificial scarcity strategy, lead to a new medium being formed for the sale of these “rare” collector items. Sales fueled the rise of E-commerce, starting with eBay – coinciding with the dot com bubble. The extreme fall of sales and values of these collectibles was quite noticeable; prices were slashed and they collected dust. However, overall success of the product propelled companies like Ty and eBay. This material provides the causes/effects of each event in the timeline of Beanie Babies. </p>
                        <p>In 1993, the original 9 Beanie Babies hit the market, shown first in the Gatlinburg Gift Fair and the World Toy Fair. Characterized with lifelike feel, affordability, and quality they appealed to families (Johnson). However, Ty only sold Beanie Babies in small toy or gift stores, retailing at about 4.95USD (Morris & Charles). The specific exclusion of large retailers caused sales to start out slow, due to lack of demand and advertising. This strategy, while hindering sales in the immediate future, proved to be a monumental factor in the overall popularity of Beanie Babies. In a recount of the experience in the 90s, Meador describes that “the ‘hunt’ for Beanie Babies made it fun” – bouncing from small store to small store (instead of finding it in a big department store).</p>
                        <p>In the following years of 1995 and 1996, when popularity starts to rise, Ty started limiting the sales of Beanie Babies by artificially stocking only a small amount in stores (Meador). This is a classic strategy in sales; causing artificial scarcity matched with increasing demand fueled the craze, the “need” for families to get these plushies. It helped start the trend of post-purchase trade, initially “driving up resales” (Benes). This also set the strategy for other toys like Ninja Turtles and Cabbage Patch Kids to create artificial, word-of-mouth demand, increasing sales. The E-commerce company eBay was also founded in 1995. Beanie babies almost immediately became a spectacle to sell and purchase online, advancing and popularizing e-commerce. At one point, beanie babies comprised of 10% of eBay sales (Vandermay), showing how important (and potentially dangerous) they were to the growth and sustainability of eBay. Broadly, “Nearly 80% of all offerings on eBay were in these categories [of antiques and collectibles]. Then, as the Beanie Baby crazy grew, collectors flocked to the site.” (Logie). Overall, Beanie Babies were one of the first major collectible items to be traded on eBay and other rising internet sites – further fueling their rise to power and prevalence today.</p>
                        <p>Later, from 1997-1999, sales of Beanie Babies skyrocket and peak, due to middle income families thinking of toys as “financial instruments” (Benes) and artificial scarcity-induced demand. Most interestingly, this led to even financially dependent “housewives” purchasing Beanie Babies, for a chance to engage in the economy and have affordable personal investments. A blog written by Meg Conley outlines this in an interesting excerpt: </p>
                        <p>“When the Beanie Baby Bubble began to form in 1996, my mom sensed an opportunity. It was a market she could understand. She was good at finding things and she had access to just enough capital to hop into the fray. The Beanie Baby market was run by women like her.”</p>
                        <p>These toys could have been a small vessel in the path to become financially independent, without banks or bonds. The Beanie Baby fad turned out to be mostly female run; moms and sisters wanting to have a part in financial success, a taste of independence in a dependent world. This is an example of some of the changes in modern day America – women in households getting more involved in finance.</p>
                        <p>After 2000, Sales of Beanie Babies decline and value collapses (Benes), families who thought that they were long term investments were now left with next to useless plushies, after years of pointless speculation. This marked the end of the speculative bubble we see so often in the United States – built up by “hype”, crashed down to reality. Some examples include the dot-com bubble and the housing market bubble (see: the Great Recession). Overall, people realized that resold toys don’t necessarily sell for thousands of dollars.</p>
                        <p>Long term and overall, eBay becomes a cornerstone of the US economy regarding e-commerce, eventually contributing to the dot-com speculative bubble too. Beanie Babies are left as just a crazy fad in the 90s.</p>

                        <h3>References</h3>
                        
                        <ul style={{listStyleType: 'disc', margin: '1em 0 0 18px', padding: 0}}>
                            <li>
                                Benes, Ross. “The End is Coming! The End is Coming!” <em>History News Network</em>, 1 Apr. 2025.
                                <a href="https://www.historynewsnetwork.org/article/the-end-is-coming-the-end-is-coming" target="_blank" rel="noopener noreferrer">https://www.historynewsnetwork.org/article/the-end-is-coming-the-end-is-coming</a>. Accessed 2 Dec. 2025.
                            </li>
                            <li>
                                Conley, Meg. “My Mother Risked It All on the Beanie Baby Boom.” <em>Pocket Observatory</em>, 31 Dec. 2023.
                                <a href="https://www.pocketobservatory.org/my-mother-risked-it-all-on-the-beanie-baby-boom/" target="_blank" rel="noopener noreferrer">www.pocketobservatory.org/my-mother-risked-it-all-on-the-beanie-baby-boom/</a>. Accessed 2 Dec. 2025.
                            </li>
                            <li>
                                Johnson, James. “Ty Classics: The Original 9 Beanie Babies That Started it All.” <em>Ty Store</em>.
                                <a href="https://shop.ty.com/blog?lang=en&title=ty-classics-the-original-9-beanie-babies-that-started-it-all&srsltid=AfmBOopsq_P0CHrGGhcjvrS3wrTpcODwRZaLMFHkF2V-NeVaKw3S-6DC" target="_blank" rel="noopener noreferrer">https://shop.ty.com/blog?lang=en&title=ty-classics-the-original-9-beanie-babies-that-started-it-all&srsltid=AfmBOopsq_P0CHrGGhcjvrS3wrTpcODwRZaLMFHkF2V-NeVaKw3S-6DC</a>. Accessed 2 Dec. 2025.
                            </li>
                            <li>
                                Logie, Jamie. “Why eBay Can Thank Beanie Babies for Its Early Success.” <em>Medium</em>, 13 May 2025.
                                <a href="https://archive.ph/ubAdt#selection-389.0-462.0" target="_blank" rel="noopener noreferrer">https://archive.ph/ubAdt#selection-389.0-462.0</a>. Accessed 2 Dec. 2025.
                            </li>
                            <li>
                                Meador, Gina. “Beanie Babies: What Made Them Sell?”. <em>First Flight Agency</em>, 14 May 2022.
                                <a href="https://firstflightagency.com/2022/03/14/why-did-people-go-crazy-over-beanie-babies/" target="_blank" rel="noopener noreferrer">https://firstflightagency.com/2022/03/14/why-did-people-go-crazy-over-beanie-babies/</a>. Accessed 2 Dec. 2025.
                            </li>
                            <li>
                                Morris, Rebecca J., and Charles L. Martin. “Beanie babies: A case study in the engineering of a high‐involvement/relationship‐prone brand.” <em>Journal of Product &amp; Brand Management</em>, vol. 9, no. 2, 1 Apr. 2000, pp. 78–98, <a href="https://doi.org/10.1108/10610420010322143" target="_blank" rel="noopener noreferrer">https://doi.org/10.1108/10610420010322143</a>. Accessed 2 Dec. 2025.
                            </li>
                            <li>
                                VanderMey, Anne. “Lessons from the Great Beanie Babies Crash.” <em>Fortune</em>, 11 Mar. 2015.
                                <a href="https://fortune.com/2015/03/11/beanie-babies-failure-lessons/" target="_blank" rel="noopener noreferrer">https://fortune.com/2015/03/11/beanie-babies-failure-lessons/</a>. Accessed 2 Dec. 2025.
                            </li>
                        </ul>
                        
                        </article>
                        
                )}
            </div>

            {/* Dialog (keeps working as before) */}
            <dialog className="dialog" open={open} onClose={()=>setOpen(false)}>
                <div className="titlebar">
                    {sel ? sel.name : 'Listing'}
                </div>
                <div className="body">
                    {sel && (
                        <>
                            <div className="dialog-grid" style={{display:'grid', gridTemplateColumns:'220px 1fr', gap:12}}>
                                <div>
                                    {sel.img ? <img className="thumb" style={{width:'100%', height:'auto'}} src={sel.img} alt={sel.name}/> : <div className="thumb" />}
                                    <div className="kv" style={{marginTop:8}}>
                                        <div className="kv-row"><div className="kv-label">Category</div><div className="kv-val">{sel.category}</div></div>
                                        <div className="kv-row"><div className="kv-label">Release Year</div><div className="kv-val">{sel.releaseYear}</div></div>
                                        <div className="kv-row"><div className="kv-label">Peak Year</div><div className="kv-val">{sel.peakYear}</div></div>
                                        <div className="kv-row"><div className="kv-label">Peak Price</div><div className="kv-val">{money(sel.peakPriceUSD)}</div></div>
                                        <div className="kv-row"><div className="kv-label">Current Price</div><div className="kv-val">{money(sel.currentPriceUSD)}</div></div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{fontWeight:700, marginBottom:6}}>Description</div>
                                    <div style={{marginBottom:8}}>
                                        Classic stuffed toy collectible from the late-1990s Beanie Baby fad. Visualize the price collapse from the 90s to now - crase of the Speculative Bubble.
                                    </div>

                                    <div style={{fontWeight:700, margin:'10px 0 6px'}}>Fun Facts</div>
                                    <ul style={{margin:'0 0 0 18px', padding:0}}>
                                        {sel.fun.map((f,i)=>(<li key={i} style={{marginBottom:6}}>{f}</li>))}
                                    </ul>
                                    {sel.notes && <div style={{marginTop:8, color:'#555'}}><b>Note:</b> {sel.notes}</div>}

                                    <div style={{fontWeight:700, margin:'12px 0 6px'}}>Price Collapse</div>
                                    <div className="bar"><div style={{width:`${Math.max(5, Math.round((sel.currentPriceUSD / Math.max(1, sel.peakPriceUSD))*100))}%`}}/></div>
                                </div>
                            </div>

                            <div style={{marginTop:12, display:'flex', gap:8, justifyContent:'flex-end'}}>
                                <button className="btn" onClick={()=>setOpen(false)}>Close</button>
                            </div>
                        </>
                    )}
                </div>
            </dialog>
        </>
    )
}
