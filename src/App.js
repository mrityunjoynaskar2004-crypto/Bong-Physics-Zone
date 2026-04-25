import { useState, useRef, useEffect } from "react";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar","Chandigarh","Delhi","Jammu & Kashmir","Ladakh",
  "Lakshadweep","Puducherry"
];

const classData = {
  7:  { color:"#FF6B6B", emoji:"🌱", subjects:["Mathematics","Science","English","Social Studies","Hindi"] },
  8:  { color:"#FF8E53", emoji:"📖", subjects:["Mathematics","Science","English","Social Studies","Hindi"] },
  9:  { color:"#FFC107", emoji:"🔬", subjects:["Mathematics","Science","English","Social Science","Hindi"] },
  10: { color:"#4CAF50", emoji:"🏆", subjects:["Mathematics","Science","English","Social Science","Hindi"] },
  11: { color:"#2196F3", emoji:"⚗️", subjects:["Physics","Chemistry","Mathematics","Biology","English"] },
  12: { color:"#9C27B0", emoji:"🚀", subjects:["Physics","Chemistry","Mathematics","Biology","English"] },
};

const topicsMap = {
  Mathematics:["Number Systems","Polynomials","Quadratic Equations","Triangles","Statistics"],
  Science:    ["Matter","Atoms & Molecules","Cell Biology","Gravitation","Work & Energy"],
  English:    ["Grammar","Reading Comprehension","Writing Skills","Literature","Vocabulary"],
  "Social Studies":["Ancient History","Geography","Civics","Maps","Culture"],
  "Social Science":["Nationalism","Federalism","Resources","Development","Democracy"],
  Hindi:      ["गद्य","पद्य","व्याकरण","निबंध","पत्र लेखन"],
  Physics:    ["Units & Measurement","Kinematics","Laws of Motion","Thermodynamics","Optics"],
  Chemistry:  ["Atomic Structure","Chemical Bonding","States of Matter","Equilibrium","Electrochemistry"],
  Biology:    ["Cell Biology","Biomolecules","Plant Physiology","Human Physiology","Genetics"],
};

const quizBank = {
  Mathematics:[
    {q:"Value of π (pi)?",options:["3.14","2.71","1.41","1.73"],ans:0},
    {q:"12² = ?",options:["124","144","134","154"],ans:1},
    {q:"Angles in a triangle sum to?",options:["90°","270°","360°","180°"],ans:3},
  ],
  Science:[
    {q:"Chemical symbol for water?",options:["WO","H2O","HO2","W2O"],ans:1},
    {q:"Powerhouse of the cell?",options:["Nucleus","Ribosome","Mitochondria","Lysosome"],ans:2},
    {q:"Closest planet to the Sun?",options:["Venus","Earth","Mercury","Mars"],ans:2},
  ],
  Physics:[
    {q:"SI unit of force?",options:["Watt","Joule","Newton","Pascal"],ans:2},
    {q:"F=ma is?",options:["Newton's 1st","Newton's 3rd","Newton's 2nd","Hooke's Law"],ans:2},
    {q:"Speed of light ≈?",options:["3×10⁶ m/s","3×10⁸ m/s","3×10¹⁰ m/s","3×10⁴ m/s"],ans:1},
  ],
  Chemistry:[
    {q:"Atomic number of Carbon?",options:["6","12","8","14"],ans:0},
    {q:"pH of pure water?",options:["5","9","7","11"],ans:2},
    {q:"Gas used in photosynthesis?",options:["O₂","N₂","CO₂","H₂"],ans:2},
  ],
  English:[
    {q:"Word describing a noun?",options:["Adverb","Verb","Adjective","Pronoun"],ans:2},
    {q:"Synonym of 'Happy'?",options:["Sad","Joyful","Angry","Tired"],ans:1},
    {q:"'Beautifully' in 'She sings beautifully' is a?",options:["Adjective","Noun","Adverb","Verb"],ans:2},
  ],
};

const usersDB = {};

// ── 6-box OTP input component (keyboard stays open) ──────────────────────────
function OtpBoxes({ value, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    // Auto-focus first empty box on mount
    const idx = Math.min(value.length, 5);
    refs[idx]?.current?.focus();
  }, []);

  const handleKey = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[idx]) {
        onChange(value.slice(0, idx) + value.slice(idx + 1));
      } else if (idx > 0) {
        onChange(value.slice(0, idx - 1) + value.slice(idx));
        refs[idx - 1]?.current?.focus();
      }
    }
  };

  const handleChange = (e, idx) => {
    const ch = e.target.value.replace(/\D/g, "").slice(-1);
    if (!ch) return;
    const arr = value.split("");
    arr[idx] = ch;
    const next = arr.join("").slice(0, 6);
    onChange(next);
    if (idx < 5) refs[idx + 1]?.current?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    refs[focusIdx]?.current?.focus();
  };

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "0 0 18px" }}>
      {[0,1,2,3,4,5].map(i => (
        <input
          key={i}
          ref={refs[i]}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKey(e, i)}
          onFocus={e => e.target.select()}
          onPaste={handlePaste}
          style={{
            width: 46, height: 56,
            textAlign: "center", fontSize: 24, fontWeight: 800,
            background: value[i] ? "rgba(79,142,247,0.2)" : "rgba(255,255,255,0.07)",
            border: value[i] ? "2px solid #4F8EF7" : "2px solid rgba(255,255,255,0.2)",
            borderRadius: 12, color: "#fff",
            outline: "none", fontFamily: "inherit",
            caretColor: "transparent",
            transition: "all 0.15s",
          }}
        />
      ))}
    </div>
  );
}

// ── Phone input that keeps keyboard open ────────────────────────────────────
function PhoneInput({ value, onChange }) {
  const ref = useRef();
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <input
      ref={ref}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      style={{
        flex: 1,
        background: "rgba(255,255,255,0.07)",
        border: "1.5px solid rgba(255,255,255,0.18)",
        borderRadius: 12, padding: "14px 16px",
        color: "#fff", fontSize: 18, outline: "none",
        boxSizing: "border-box", fontFamily: "inherit",
        letterSpacing: 2,
      }}
      placeholder="Enter mobile number"
      value={value}
      maxLength={10}
      onChange={e => onChange(e.target.value.replace(/\D/g, ""))}
    />
  );
}

export default function EduApp() {
  const [authStep, setAuthStep]     = useState("signin");
  const [phone, setPhone]           = useState("");
  const [otp, setOtp]               = useState("");
  const [sentOtp, setSentOtp]       = useState("");
  const [name, setName]             = useState("");
  const [userState, setUserState]   = useState("");
  const [user, setUser]             = useState(null);
  const [authErr, setAuthErr]       = useState("");

  const [screen, setScreen]                   = useState("home");
  const [selectedClass, setSelectedClass]     = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic]     = useState(null);
  const [qIndex, setQIndex]     = useState(0);
  const [score, setScore]       = useState(0);
  const [answered, setAnswered] = useState(null);
  const [quizDone, setQuizDone] = useState(false);

  const accent    = selectedClass ? classData[selectedClass].color : "#4F8EF7";
  const questions = quizBank[selectedSubject] || quizBank["Mathematics"];

  const sendOtp = () => {
    if (phone.length !== 10) { setAuthErr("Enter a valid 10-digit number"); return; }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(code);
    setOtp("");
    setAuthErr("");
    if (usersDB[phone]) { setName(usersDB[phone].name); setUserState(usersDB[phone].state); }
    setAuthStep("otp");
  };

  const verifyOtp = () => {
    if (otp.length < 6) { setAuthErr("Please enter all 6 digits"); return; }
    if (otp !== sentOtp) { setAuthErr("Incorrect OTP. Check the code above."); return; }
    setAuthErr("");
    if (usersDB[phone]) { setUser(usersDB[phone]); setAuthStep("app"); }
    else setAuthStep("profile");
  };

  const saveProfile = () => {
    if (!name.trim()) { setAuthErr("Please enter your name"); return; }
    if (!userState)   { setAuthErr("Please select your state"); return; }
    const u = { phone, name: name.trim(), state: userState, joined: new Date().toLocaleDateString("en-IN") };
    usersDB[phone] = u;
    setUser(u); setAuthErr(""); setAuthStep("app");
  };

  const handleAnswer = (i) => {
    if (answered !== null) return;
    setAnswered(i);
    if (i === questions[qIndex].ans) setScore(s => s + 1);
  };
  const nextQ = () => {
    if (qIndex + 1 < questions.length) { setQIndex(q => q + 1); setAnswered(null); }
    else setQuizDone(true);
  };
  const resetQuiz = () => { setQIndex(0); setScore(0); setAnswered(null); setQuizDone(false); };

  const inp = {
    width: "100%", background: "rgba(255,255,255,0.07)",
    border: "1.5px solid rgba(255,255,255,0.18)", borderRadius: 12,
    padding: "14px 16px", color: "#fff", fontSize: 16,
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  };

  const ErrBox = ({ msg }) => msg ? (
    <div style={{ background:"rgba(244,67,54,0.15)", border:"1px solid rgba(244,67,54,0.4)", borderRadius:10, padding:"10px 14px", marginBottom:10, fontSize:13, color:"#FF6B6B" }}>{msg}</div>
  ) : null;

  const Wrap = ({ children }) => (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'Segoe UI',sans-serif", color:"#fff" }}>
      <div style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:24, padding:30, width:"100%", maxWidth:400, backdropFilter:"blur(14px)" }}>
        {children}
      </div>
    </div>
  );

  const Btn = ({ children, onClick, bg }) => (
    <button onClick={onClick} style={{
      width:"100%", background: bg || "linear-gradient(135deg,#4F8EF7,#7B61FF)",
      border:"none", borderRadius:12, padding:"15px", color:"#fff",
      fontWeight:800, fontSize:16, cursor:"pointer", fontFamily:"inherit", marginTop:10,
    }}>{children}</button>
  );

  // ══════════ SIGN IN ═══════════════════════════════════════════════════════
  if (authStep === "signin") return (
    <Wrap>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:52, marginBottom:8 }}>📱</div>
        <h1 style={{ fontSize:24, fontWeight:800, margin:"0 0 6px" }}>Welcome to EduPath</h1>
        <p style={{ opacity:0.5, fontSize:14, margin:0 }}>Sign in with your phone number</p>
      </div>

      <div style={{ fontSize:11, fontWeight:700, opacity:0.55, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Phone Number</div>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <div style={{ ...inp, width:60, textAlign:"center", flexShrink:0, padding:"14px 8px", opacity:0.7, fontSize:18, fontWeight:700 }}>+91</div>
        <PhoneInput value={phone} onChange={v => { setPhone(v); setAuthErr(""); }} />
      </div>

      {/* Live digit counter */}
      <div style={{ textAlign:"right", fontSize:12, opacity:0.4, marginBottom:8, marginTop:-8 }}>{phone.length}/10</div>

      <ErrBox msg={authErr} />
      <Btn onClick={sendOtp}>Send OTP →</Btn>
      <p style={{ textAlign:"center", opacity:0.3, fontSize:11, marginTop:14 }}>OTP will appear on the next screen (demo mode)</p>
    </Wrap>
  );

  // ══════════ OTP ═══════════════════════════════════════════════════════════
  if (authStep === "otp") return (
    <Wrap>
      <div style={{ textAlign:"center", marginBottom:20 }}>
        <div style={{ fontSize:52, marginBottom:8 }}>🔐</div>
        <h1 style={{ fontSize:24, fontWeight:800, margin:"0 0 6px" }}>Enter OTP</h1>
        <p style={{ opacity:0.5, fontSize:14, margin:0 }}>Sent to +91 {phone}</p>
      </div>

      {/* OTP display box */}
      <div style={{
        background:"linear-gradient(135deg,rgba(79,142,247,0.25),rgba(123,97,255,0.25))",
        border:"2px solid rgba(79,142,247,0.6)",
        borderRadius:16, padding:"16px 20px", marginBottom:24, textAlign:"center",
      }}>
        <div style={{ fontSize:12, opacity:0.6, marginBottom:6, letterSpacing:1, textTransform:"uppercase" }}>Your OTP Code</div>
        <div style={{ fontSize:40, fontWeight:900, letterSpacing:12, color:"#4F8EF7" }}>{sentOtp}</div>
        <div style={{ fontSize:11, opacity:0.4, marginTop:6 }}>Enter this code in the boxes below</div>
      </div>

      <div style={{ fontSize:11, fontWeight:700, opacity:0.55, marginBottom:12, textTransform:"uppercase", letterSpacing:1, textAlign:"center" }}>
        Tap a box and type your code
      </div>

      {/* 6-box OTP input — keyboard stays open */}
      <OtpBoxes value={otp} onChange={v => { setOtp(v); setAuthErr(""); }} />

      {/* Progress dots */}
      <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:16 }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{ width:8, height:8, borderRadius:"50%", background: otp.length > i ? "#4F8EF7" : "rgba(255,255,255,0.2)", transition:"all 0.2s" }} />
        ))}
      </div>

      <ErrBox msg={authErr} />
      <Btn onClick={verifyOtp} bg={otp.length === 6 ? "linear-gradient(135deg,#4CAF50,#2e7d32)" : "rgba(255,255,255,0.15)"}>
        {otp.length === 6 ? "Verify OTP ✓" : `Enter ${6 - otp.length} more digit${6 - otp.length !== 1 ? "s" : ""}`}
      </Btn>
      <Btn onClick={() => { setAuthStep("signin"); setOtp(""); setSentOtp(""); setAuthErr(""); }} bg="rgba(255,255,255,0.08)">
        ← Change Number
      </Btn>
    </Wrap>
  );

  // ══════════ PROFILE ═══════════════════════════════════════════════════════
  if (authStep === "profile") return (
    <Wrap>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:52, marginBottom:8 }}>👤</div>
        <h1 style={{ fontSize:24, fontWeight:800, margin:"0 0 6px" }}>Complete Profile</h1>
        <p style={{ opacity:0.5, fontSize:14, margin:0 }}>Just a few details to get started</p>
      </div>

      <div style={{ fontSize:11, fontWeight:700, opacity:0.55, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Full Name</div>
      <input style={{ ...inp, marginBottom:16 }} placeholder="Enter your full name"
        autoFocus
        value={name} onChange={e => { setName(e.target.value); setAuthErr(""); }} />

      <div style={{ fontSize:11, fontWeight:700, opacity:0.55, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>State / UT</div>
      <select style={{ ...inp, marginBottom:16, appearance:"none" }}
        value={userState} onChange={e => { setUserState(e.target.value); setAuthErr(""); }}>
        <option value="">— Select your state —</option>
        {INDIAN_STATES.map(s => <option key={s} value={s} style={{ background:"#302b63" }}>{s}</option>)}
      </select>

      <ErrBox msg={authErr} />
      <Btn onClick={saveProfile} bg="linear-gradient(135deg,#FF6B6B,#FF8E53)">Start Learning 🚀</Btn>
    </Wrap>
  );

  // ══════════ MAIN APP ══════════════════════════════════════════════════════
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)", fontFamily:"'Segoe UI',sans-serif", color:"#fff" }}>

      {/* Header */}
      <div style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(10px)", borderBottom:"1px solid rgba(255,255,255,0.1)", padding:"13px 18px", display:"flex", alignItems:"center", gap:10, position:"sticky", top:0, zIndex:100 }}>
        {screen !== "home" && (
          <button onClick={() => {
            resetQuiz();
            if (screen === "quiz" || screen === "topics") setScreen("subjects");
            else if (screen === "subjects") { setScreen("home"); setSelectedClass(null); }
            else setScreen("home");
          }} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"#fff", borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
        )}
        <div style={{ fontSize:20 }}>📚</div>
        <div style={{ flex:1, fontWeight:700, fontSize:16 }}>EduPath</div>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.08)", borderRadius:20, padding:"5px 12px" }}>
          <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#4F8EF7,#7B61FF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:700 }}>{user?.name}</div>
            <div style={{ fontSize:10, opacity:0.5 }}>📍 {user?.state}</div>
          </div>
        </div>
      </div>

      <div style={{ padding:"18px", maxWidth:480, margin:"0 auto" }}>

        {/* HOME */}
        {screen === "home" && (
          <div>
            <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:16, marginBottom:22, display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:46, height:46, borderRadius:"50%", background:"linear-gradient(135deg,#4F8EF7,#7B61FF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, flexShrink:0 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight:800, fontSize:16 }}>Welcome, {user?.name}! 👋</div>
                <div style={{ fontSize:12, opacity:0.5, marginTop:2 }}>📱 +91 {user?.phone} · 📍 {user?.state}</div>
                <div style={{ fontSize:11, opacity:0.35, marginTop:2 }}>Joined {user?.joined}</div>
              </div>
            </div>

            <h2 style={{ fontSize:19, fontWeight:800, marginBottom:4 }}>Choose Your Class</h2>
            <p style={{ opacity:0.5, fontSize:13, marginBottom:18 }}>Tap a class to begin learning</p>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
              {[7,8,9,10,11,12].map(cls => (
                <button key={cls} onClick={() => { setSelectedClass(cls); setScreen("subjects"); }} style={{
                  background:`linear-gradient(135deg,${classData[cls].color}33,${classData[cls].color}11)`,
                  border:`2px solid ${classData[cls].color}66`, borderRadius:16,
                  padding:"18px 8px", cursor:"pointer", color:"#fff",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:5,
                }}>
                  <div style={{ fontSize:26 }}>{classData[cls].emoji}</div>
                  <div style={{ fontWeight:800, fontSize:20, color:classData[cls].color }}>{cls}</div>
                  <div style={{ fontSize:10, opacity:0.6 }}>Class {cls}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SUBJECTS */}
        {screen === "subjects" && selectedClass && (
          <div>
            <h2 style={{ fontSize:19, fontWeight:800, marginBottom:4 }}>Class {selectedClass} Subjects</h2>
            <p style={{ opacity:0.5, fontSize:13, marginBottom:18 }}>Select a subject to explore</p>
            {classData[selectedClass].subjects.map(sub => {
              const icons = { Mathematics:"📐", Science:"🔬", English:"📖", "Social Studies":"🌍", "Social Science":"🌍", Hindi:"🇮🇳", Physics:"⚡", Chemistry:"⚗️", Biology:"🧬" };
              return (
                <button key={sub} onClick={() => { setSelectedSubject(sub); setScreen("topics"); }} style={{
                  width:"100%", background:"rgba(255,255,255,0.05)", border:`1px solid ${accent}44`,
                  borderRadius:14, padding:"14px 18px", ma
