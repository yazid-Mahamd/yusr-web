let settings = { dialect: 'eg', rate: 1, pitch: 1, repeat: 1 }
let report = []
let currentTab = 'letters'

const letters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"]
const numbers = Array.from({ length: 20 }, (_, i) => i + 1)
const categories = {
    "حيوانات": [{ n: "أسد", e: "🦁" }, { n: "فيل", e: "🐘" }, { n: "قطة", e: "🐱" }, { n: "كلب", e: "🐶" }, { n: "حصان", e: "🐴" }, { n: "جمل", e: "🐪" }, { n: "قرد", e: "🐒" }, { n: "بقرة", e: "🐄" }, { n: "أرنب", e: "🐰" }, { n: "زرافة", e: "🦒" }],
    "طيور": [{ n: "عصفور", e: "🐦" }, { n: "بطة", e: "🦆" }, { n: "نسر", e: "🦅" }, { n: "ببغاء", e: "🦜" }, { n: "حمامة", e: "🕊️" }, { n: "ديك", e: "🐓" }, { n: "بومة", e: "🦉" }, { n: "طاووس", e: "🦚" }, { n: "بطريق", e: "🐧" }, { n: "غراب", e: "🐦‍⬛" }],
    "نباتات": [{ n: "وردة", e: "🌹" }, { n: "شجرة", e: "🌳" }, { n: "صبار", e: "🌵" }, { n: "ذرة", e: "🌽" }, { n: "فراولة", e: "🍓" }, { n: "تفاحة", e: "🍎" }, { n: "موز", e: "🍌" }, { n: "عنب", e: "🍇" }, { n: "برتقال", e: "🍊" }, { n: "نخلة", e: "🌴" }],
    "فضاء": [{ n: "قمر", e: "🌙" }, { n: "نجمة", e: "⭐" }, { n: "شمس", e: "☀️" }, { n: "كوكب", e: "🪐" }, { n: "صاروخ", e: "🚀" }, { n: "مذنب", e: "☄️" }, { n: "مجرة", e: "🌌" }, { n: "تلسكوب", e: "🔭" }, { n: "رائد فضاء", e: "👨‍🚀" }, { n: "قمر صناعي", e: "🛰️" }],
    "جسمي": [{ n: "يد", e: "✋" }, { n: "عين", e: "👁️" }, { n: "أذن", e: "👂" }, { n: "أنف", e: "👃" }, { n: "فم", e: "👄" }, { n: "رأس", e: "🧠" }, { n: "قلب", e: "❤️" }, { n: "قدم", e: "🦶" }, { n: "أسنان", e: "🦷" }, { n: "شعر", e: "💇" }],
    "الحواس": [{ n: "سمع", e: "👂" }, { n: "بصر", e: "👀" }, { n: "شم", e: "👃" }, { n: "تذوق", e: "👅" }, { n: "لمس", e: "🤲" }, { n: "ضحك", e: "😂" }, { n: "بكاء", e: "😢" }, { n: "تفكير", e: "🤔" }, { n: "نوم", e: "😴" }, { n: "جوع", e: "🤤" }]
}

function speak(text) {
    if (!text) return
    speechSynthesis.cancel()
    const utterLoop = (count) => {
        if (count >= settings.repeat) return
        const u = new SpeechSynthesisUtterance(text)
        u.rate = parseFloat(settings.rate)
        u.pitch = parseFloat(settings.pitch)
        u.lang = settings.dialect === 'eg' ? 'ar-EG' : 'ar-SA'
        u.onend = () => setTimeout(() => utterLoop(count + 1), 300)
        speechSynthesis.speak(u)
    }
    utterLoop(0)
}

function addReport(type, value) {
    report.unshift({ type, value, time: new Date().toLocaleTimeString('ar-EG') })
    localStorage.setItem('yusr_report', JSON.stringify(report))
}

function changeRepeat(d) {
    settings.repeat = Math.min(10, Math.max(1, settings.repeat + d))
    document.getElementById('repeatDisplay').textContent = settings.repeat
    document.getElementById('repeatVal').textContent = settings.repeat
}

function renderLetters() {
    let h = '<div class="grid">'
    letters.forEach(l => {
        h += `<div class="card" onclick="playLetter('${l}')"><div class="emoji" style="font-size:36px">${l}</div><div class="label">حرف ${l}</div></div>`
    })
    h += '</div>'
    document.getElementById('content').innerHTML = h
}
function playLetter(l) {
    const txt = settings.dialect === 'eg' ? `دي حرف ${l}` : `هذا حرف ${l}`
    speak(txt)
    addReport('حرف', l)
}
function renderNumbers() {
    let h = '<div class="grid">'
    numbers.forEach(n => {
        h += `<div class="card" onclick="playNumber(${n})"><div class="emoji">${n}</div><div class="label">${n}</div></div>`
    })
    h += '</div>'
    document.getElementById('content').innerHTML = h
}
function playNumber(n) {
    const txt = settings.dialect === 'eg' ? `ده رقم ${n}` : `هذا رقم ${n}`
    speak(txt); addReport('رقم', n)
}
function renderCamera() {
    document.getElementById('content').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:10px">
      <label class="btn-secondary" style="text-align:center">📸 صور الكتاب<input type="file" id="imgInput" accept="image/*" capture="environment" hidden></label>
      <img id="preview" style="max-width:100%;border-radius:12px;display:none">
      <button id="ocrBtn" class="btn-primary" style="display:none">استخرج النص واقرأ</button>
      <textarea id="ocrText" class="big-textarea" placeholder="النص المستخرج سيظهر هنا..."></textarea>
      <button onclick="speak(document.getElementById('ocrText').value)" class="btn-primary">🔊 تشغيل باللهجة المحددة</button>
      <div id="ocrStatus" style="font-size:12px;color:#8D6E63;text-align:center"></div>
    </div>`
    document.getElementById('imgInput').addEventListener('change', e => {
        const file = e.target.files[0]; if (!file) return
        const img = document.getElementById('preview'); img.src = URL.createObjectURL(file); img.style.display = 'block'
        document.getElementById('ocrBtn').style.display = 'block'
        document.getElementById('ocrBtn').onclick = async () => {
            const status = document.getElementById('ocrStatus'); status.textContent = 'جاري استخراج النص... ⏳'
            try {
                const { data: { text } } = await Tesseract.recognize(file, 'ara+eng')
                document.getElementById('ocrText').value = text
                status.textContent = 'تم الاستخراج ✅'
                addReport('صورة', 'استخراج نص')
            } catch (err) {
                status.textContent = 'فشل الاستخراج، اكتب النص يدويا'
            }
        }
    })
}
function renderWrite() {
    document.getElementById('content').innerHTML = `
    <textarea id="writeArea" class="big-textarea" placeholder="اكتب هنا أي حاجة..."></textarea>
    <button onclick="speak(document.getElementById('writeArea').value); addReport('كتابة', document.getElementById('writeArea').value.slice(0,20))" class="btn-primary">▶️ تشغيل</button>
    <button onclick="document.getElementById('writeArea').value=''" class="btn-secondary" style="width:100%;margin-top:8px">مسح</button>
    <div style="margin-top:12px;font-size:13px;color:#8D6E63;text-align:center">سيتم التكرار ${settings.repeat} مرات باللهجة ${settings.dialect === 'eg' ? 'المصرية' : 'الكويتية'}</div>`
}
function renderActivities() {
    let h = '<div class="activities-grid">'
    Object.keys(categories).forEach(cat => {
        h += `<div class="category-card" onclick="openCategory('${cat}')"><div style="font-size:32px">${categories[cat][0].e}</div><div style="font-weight:800;margin-top:6px">${cat}</div><div style="font-size:11px">${categories[cat].length} كروت</div></div>`
    })
    h += '</div>'
    document.getElementById('content').innerHTML = h
}
function openCategory(cat) {
    const items = categories[cat]
    let h = `<button onclick="renderActivities()" class="btn-secondary" style="margin-bottom:10px">⬅️ رجوع</button><h3 style="margin-bottom:10px">${cat}</h3><div class="grid">`
    items.forEach(it => {
        h += `<div class="card" onclick="playActivity('${cat}','${it.n}')"><div class="emoji">${it.e}</div><div class="label">${it.n}</div></div>`
    })
    h += '</div>'
    document.getElementById('content').innerHTML = h
}
function playActivity(cat, name) {
    const txt = settings.dialect === 'eg' ? `دي ${name}` : `هذا ${name}`
    speak(txt); addReport(cat, name)
}
function renderReport() {
    if (report.length === 0) { document.getElementById('content').innerHTML = '<div style="text-align:center;padding:40px 0;color:#8D6E63">لسه مفيش حاجة اتعلمتها النهاردة<br>ابدأ دوس على الحروف</div>'; return }
    let h = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3>تعلمنا اليوم (${report.length})</h3><button onclick="clearReport()" class="btn-secondary">مسح</button></div>`
    report.forEach(r => {
        h += `<div class="report-item"><span>${r.type}: ${r.value}</span><span style="font-size:11px;color:#8D6E63">${r.time}</span></div>`
    })
    document.getElementById('content').innerHTML = h
}
function clearReport() { report = []; localStorage.removeItem('yusr_report'); renderReport() }

document.querySelectorAll('.bottom-nav button').forEach(b => {
    b.addEventListener('click', () => {
        document.querySelectorAll('.bottom-nav button').forEach(x => x.classList.remove('active'))
        b.classList.add('active')
        currentTab = b.dataset.tab
        if (currentTab === 'letters') renderLetters()
        if (currentTab === 'numbers') renderNumbers()
        if (currentTab === 'camera') renderCamera()
        if (currentTab === 'write') renderWrite()
        if (currentTab === 'activities') renderActivities()
        if (currentTab === 'report') renderReport()
    })
})
document.getElementById('settingsBtn').addEventListener('click', () => document.getElementById('settingsDrawer').classList.add('open'))
document.getElementById('closeSettings').addEventListener('click', () => document.getElementById('settingsDrawer').classList.remove('open'))
document.getElementById('speed').addEventListener('input', e => { settings.rate = e.target.value; document.getElementById('speedVal').textContent = e.target.value })
document.getElementById('pitch').addEventListener('input', e => { settings.pitch = e.target.value; document.getElementById('pitchVal').textContent = e.target.value })
document.querySelectorAll('input[name="dialect"]').forEach(r => r.addEventListener('change', e => settings.dialect = e.target.value))

// load report
try { report = JSON.parse(localStorage.getItem('yusr_report') || '[]') } catch { report = [] }
renderLetters()
