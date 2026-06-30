// @ts-nocheck
import { useState, useEffect, useRef, useMemo } from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, AnimatePresence } from "framer-motion"

// ─── Típusok (Komponens belső struktúrája) ────────────────────────────────────
interface Treatment {
    name: string
    duration: string
    price: string
    calSlug: string
    teaser?: string
    aboPrice1?: string
    aboPrice2?: string
    savings?: string
}

interface Category {
    id: string
    label: string
    icon: string
    treatments: Treatment[]
}

// ─── Típusok (Framer CMS-ből érkező nyers adatok) ─────────────────────────────
interface CMSCategory {
    id: string
    label: string
    icon: string
}

interface CMSTreatment {
    categoryId: string
    name: string
    duration: string
    price: string
    calSlug: string
}

// ─── Beállítások ──────────────────────────────────────────────────────────────
const CAL_BASE = "https://cal.eu/gabriellasbeauty/"
const CAL_CLIP_TOP = 0

// ─── GOOGLE SHEET ADATOK INTEGRÁLÁSA — TISZTA, STRUKTURÁLT ADATTÖMB ───────────
const DEFAULT_CATEGORIES: Category[] = [
    {
        id: "klassisch",
        label: "Klassische Kosmetik",
        icon: "✦",
        treatments: [
            {
                name: "Klassische Gesichtsbehandlung",
                duration: "90 Min",
                price: "165 CHF",
                calSlug: "klassische-gesichtsbehandlung",
                teaser: "Ein Einzeltermin zur Gesichtsbehandlung für Ihr Wohlbefinden.",
            },
            {
                name: "Bellabaci Gesichtsmassage",
                duration: "30 Min",
                price: "60 CHF",
                calSlug: "bellabaci-gesichtsmassage",
                teaser: "Nur während einer Gesichtsbehandlung buchbar.",
            },
        ],
    },
    {
        id: "medizinisch",
        label: "Medizinische Kosmetik",
        icon: "◈",
        treatments: [
            {
                name: "Microdermabrasion",
                duration: "Variabel",
                price: "165 CHF",
                calSlug: "microdermabrasion",
                teaser: "Tiefenreinigung und Hauterneuerung für einen ebenmäßigen Teint.",
                aboPrice1: "419 CHF (3er)",
                aboPrice2: "655 CHF (5er)",
                savings: "Sparen Sie 170 CHF",
            },
            {
                name: "Needling",
                duration: "Variabel",
                price: "180 CHF",
                calSlug: "needling",
                teaser: "Medizinische Gesichtsbehandlung zur Straffung und Regeneration.",
                aboPrice1: "490 CHF (3er Abo)",
                aboPrice2: "780 CHF (5er Abo)",
                savings: "Sparen Sie 120 CHF",
            },
            {
                name: "Green Peel Fresh Up",
                duration: "Variabel",
                price: "180 CHF",
                calSlug: "green-peel-fresh-up",
                teaser: "Der sanfte Frischekick ohne Schälung.",
            },
            {
                name: "Green Peel Energy",
                duration: "Variabel",
                price: "250 CHF",
                calSlug: "green-peel-energy",
                teaser: "Spürbare Hauterneuerung durch natürliche Kräuterkraft.",
            },
            {
                name: "Green Peel Klassik",
                duration: "Variabel",
                price: "580 CHF",
                calSlug: "green-peel-klassik",
                teaser: "Die intensive Schälkur für ein komplett neues Hautbild.",
            },
        ],
    },
    {
        id: "qms",
        label: "QMS Medicosmetics",
        icon: "◇",
        treatments: [
            {
                name: "QMS Medicosmetics CLASSIC",
                duration: "90 Min",
                price: "225 CHF",
                calSlug: "qms-classic",
                teaser: "Exklusive Pflege mit Collagen – Neu und einmalig in Luzern!",
            },
            {
                name: "QMS Medicosmetics OXYGEN",
                duration: "120 Min",
                price: "285 CHF",
                calSlug: "qms-oxygen",
                teaser: "Intensive Sauerstoffbehandlung für maximale Vitalität.",
            },
            {
                name: "QMS SK Alpha Revital Behandlung",
                duration: "120 Min",
                price: "255 CHF",
                calSlug: "qms-sk-alpha-revital",
                teaser: "Spezialisierte Pflege für eine jugendliche Ausstrahlung.",
            },
        ],
    },
    {
        id: "spezial",
        label: "Spezialbehandlungen",
        icon: "✧",
        treatments: [
            {
                name: "IPL Anti-Aging Behandlung",
                duration: "Variabel",
                price: "200 CHF",
                calSlug: "ipl-anti-aging",
                teaser: "Ein Einzeltermin zur IPL Anti-Aging Behandlung pro Sitzung.",
            },
            {
                name: "Radiofrequenzbehandlung",
                duration: "Variabel",
                price: "225 CHF",
                calSlug: "radiofrequenzbehandlung",
                teaser: "Effektives Lifting und Straffung ohne Skalpell.",
                aboPrice1: "450 CHF (3er Abo)",
                aboPrice2: "750 CHF (6er Abo)",
            },
            {
                name: "IPL Achseln",
                duration: "Variabel",
                price: "160 CHF",
                calSlug: "ipl-achseln",
                teaser: "Dauerhaft glatte Achseln durch moderne IPL-Technik.",
                aboPrice1: "450 CHF (3er Abo)",
                aboPrice2: "860 CHF (6er Abo)",
            },
        ],
    },
    {
        id: "haarentfernung",
        label: "Haarentfernung IPL",
        icon: "⟡",
        treatments: [
            {
                name: "IPL Bikini",
                duration: "Variabel",
                price: "260 CHF",
                calSlug: "ipl-bikini",
                teaser: "Perfekt gepflegte Bikinizone mit Langzeiteffekt.",
                aboPrice1: "730 CHF (3er Abo)",
                aboPrice2: "1390 CHF (6er Abo)",
            },
            {
                name: "IPL Bikini & Intim",
                duration: "Variabel",
                price: "460 CHF",
                calSlug: "ipl-bikini-intim",
                teaser: "Maximale Glätte für empfindliche Bereiche.",
                aboPrice1: "1290 CHF (3er Abo)",
                aboPrice2: "2460 CHF (6er Abo)",
            },
            {
                name: "IPL Oberlippe",
                duration: "Variabel",
                price: "80 CHF",
                calSlug: "ipl-oberlippe",
                teaser: "Sanfte Haarentfernung für ein klares Gesichtsbild.",
                aboPrice1: "230 CHF (3er Abo)",
                aboPrice2: "440 CHF (6er Abo)",
            },
            {
                name: "IPL Kinn",
                duration: "Variabel",
                price: "160 CHF",
                calSlug: "ipl-kinn",
                teaser: "Präzise Haarentfernung für ein gepflegtes Kinn.",
                aboPrice1: "450 CHF (3er Abo)",
                aboPrice2: "860 CHF (6er Abo)",
            },
            {
                name: "IPL Nacken",
                duration: "Variabel",
                price: "130 CHF",
                calSlug: "ipl-nacken",
                teaser: "Klare Konturen durch dauerhafte Haarentfernung.",
                aboPrice1: "370 CHF (3er Abo)",
                aboPrice2: "710 CHF (6er Abo)",
            },
            {
                name: "IPL Unterschenkel",
                duration: "Variabel",
                price: "460 CHF",
                calSlug: "ipl-unterschenkel",
                teaser: "Seidig glatte Unterschenkel für jeden Tag.",
                aboPrice1: "1290 CHF (3er Abo)",
                aboPrice2: "2460 CHF (6er Abo)",
            },
            {
                name: "IPL Oberschenkel",
                duration: "Variabel",
                price: "590 CHF",
                calSlug: "ipl-oberschenkel",
                teaser: "Effektive Entfernung unerwünschter Haare am Oberschenkel.",
                aboPrice1: "1660 CHF (3er Abo)",
                aboPrice2: "3160 CHF (6er Abo)",
            },
            {
                name: "IPL Ganze Beine",
                duration: "Variabel",
                price: "910 CHF",
                calSlug: "ipl-ganze-beine",
                teaser: "Das komplette Wohlfühlpaket für Ihre Beine.",
                aboPrice1: "2550 CHF (3er Abo)",
                aboPrice2: "4850 CHF (6er Abo)",
            },
            {
                name: "IPL Schulter",
                duration: "Variabel",
                price: "390 CHF",
                calSlug: "ipl-schulter",
                teaser: "Ästhetische Ergebnisse für den Schulterbereich.",
                aboPrice1: "1100 CHF (3er Abo)",
                aboPrice2: "2090 CHF (6er Abo)",
            },
            {
                name: "IPL Ganzer Rücken",
                duration: "Variabel",
                price: "850 CHF",
                calSlug: "ipl-ganzer-ruecken",
                teaser: "Dauerhafte Befreiung von Haaren am gesamten Rücken.",
                aboPrice1: "2380 CHF (3er Abo)",
                aboPrice2: "4530 CHF (6er Abo)",
            },
            {
                name: "IPL Bauch",
                duration: "Variabel",
                price: "460 CHF",
                calSlug: "ipl-bauch",
                teaser: "Sanfte Behandlung für einen glatten Bauchbereich.",
                aboPrice1: "1290 CHF (3er Abo)",
                aboPrice2: "2460 CHF (6er Abo)",
            },
            {
                name: "IPL Brust",
                duration: "Variabel",
                price: "390 CHF",
                calSlug: "ipl-brust",
                teaser: "Gründliche Haarentfernung für den Brustbereich.",
                aboPrice1: "1100 CHF (3er Abo)",
                aboPrice2: "2090 CHF (6er Abo)",
            },
            {
                name: "IPL Ganze Arme",
                duration: "Variabel",
                price: "590 CHF",
                calSlug: "ipl-ganze-arme",
                teaser: "Rundum glatte Haut an beiden Armen.",
                aboPrice1: "1660 CHF (3er Abo)",
                aboPrice2: "3160 CHF (6er Abo)",
            },
            {
                name: "IPL Unterarme",
                duration: "Variabel",
                price: "330 CHF",
                calSlug: "ipl-unterarme",
                teaser: "Perfekte Ergebnisse für die Unterarme.",
                aboPrice1: "930 CHF (3er Abo)",
                aboPrice2: "1770 CHF (6er Abo)",
            },
            {
                name: "IPL Oberarme",
                duration: "Variabel",
                price: "330 CHF",
                calSlug: "ipl-oberarme",
                teaser: "Dauerhafte Glätte auch für die Oberarme.",
                aboPrice1: "930 CHF (3er Abo)",
                aboPrice2: "1770 CHF (6er Abo)",
            },
            {
                name: "IPL Hände",
                duration: "Variabel",
                price: "120 CHF",
                calSlug: "ipl-hande",
                teaser: "Gepflegte Hände ohne störende Behaarung.",
                aboPrice1: "340 CHF (3er Abo)",
                aboPrice2: "650 CHF (6er Abo)",
            },
        ],
    },
]

// ─── Swiss Minimalist Motion Curve ───────────────────────────────────────────
const stepVariants = {
    enter: (dir: number) => ({
        x: dir > 0 ? 40 : -40,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    exit: (dir: number) => ({
        x: dir > 0 ? -30 : 30,
        opacity: 0,
        transition: {
            duration: 0.25,
            ease: [0.7, 0, 0.84, 0],
        },
    }),
}

export default function BuchungsSeite({
    cmsCategories = [],
    cmsTreatments = [],
    bgColor = "#F7ECDF",
    accentColor = "#A6807C",
    textColor = "#3A3028",
    mutedColor = "#7A7369",
    darkBg = "#130C09",
    successTitle = "Vielen Dank!",
    successSubtitle = "Ihre Anfrage wurde erfolgreich übermittelt.",
    successBody = "Sie erhalten in Kürze eine Bestätigungs-E-Mail. Bei Fragen erreichen Sie uns jederzeit.",
    successButtonLabel = "Weitere Behandlung buchen",
    logoText = "Gabriella's Beauty",
}: {
    cmsCategories?: CMSCategory[]
    cmsTreatments?: CMSTreatment[]
    bgColor?: string
    accentColor?: string
    textColor?: string
    mutedColor?: string
    darkBg?: string
    successTitle?: string
    successSubtitle?: string
    successBody?: string
    successButtonLabel?: string
    logoText?: string
}) {
    const activeCategories = useMemo(() => {
        const hasValidCMS =
            cmsCategories && cmsCategories.length > 0 && cmsCategories[0]?.id

        if (hasValidCMS) {
            return cmsCategories.map((cat) => {
                const relatedTreatments = (cmsTreatments || [])
                    .filter((t) => t.categoryId === cat.id)
                    .map((t) => ({
                        name: t.name || "",
                        duration: t.duration || "",
                        price: t.price || "",
                        calSlug: t.calSlug || "",
                    }))

                return {
                    id: cat.id || "",
                    label: cat.label || "",
                    icon: cat.icon || "",
                    treatments: relatedTreatments,
                }
            })
        }
        return DEFAULT_CATEGORIES
    }, [cmsCategories, cmsTreatments])

    const [step, setStep] = useState<"category" | "treatment" | "calendar" | "success">("category")
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null)
    const [direction, setDirection] = useState(1)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const goForward = (nextStep: typeof step) => {
        setDirection(1)
        setStep(nextStep)
    }
    const goBack = (nextStep: typeof step) => {
        setDirection(-1)
        setStep(nextStep)
    }

    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            const data = e.data
            if (!data) return
            const type = data?.type || data?.event || ""
            if (
                type === "booking-successful" ||
                type === "bookingSuccessful" ||
                type === "cal:booking-successful" ||
                type === "__cal__booking_successful"
            ) {
                goForward("success")
            }
        }
        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [])

    const reset = () => {
        setDirection(-1)
        setStep("category")
        setSelectedCategory(null)
        setSelectedTreatment(null)
    }

    const calUrl = selectedTreatment
        ? `${CAL_BASE}${selectedTreatment.calSlug}?embed=true&hideEventTypeDetails=true&layout=month_view`
        : ""

    const progressMap = {
        category: "15%",
        treatment: "50%",
        calendar: "85%",
        success: "100%",
    }

    return (
        <>
            <style>{`
                .bs-wrap {
                    width: 100%;
                    min-height: 100vh;
                    background: ${bgColor};
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                }
                .bs-header {
                    background: ${bgColor};
                    border-bottom: 1px solid ${accentColor}15;
                    padding: 0 40px;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-shrink: 0;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                .bs-logo {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 16px;
                    font-weight: 500;
                    color: ${textColor};
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }
                .bs-header-step {
                    font-size: 11px;
                    color: ${mutedColor};
                    letter-spacing: 0.08em;
                    font-family: 'Montserrat', sans-serif;
                    text-transform: uppercase;
                    font-weight: 500;
                }
                .bs-progress {
                    height: 3px;
                    background: ${accentColor}10;
                    flex-shrink: 0;
                }
                .bs-progress-fill {
                    height: 100%;
                    background: ${accentColor};
                    transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .bs-ap-wrap {
                    flex: 1;
                    overflow: hidden;
                    position: relative;
                }
                .bs-content {
                    max-width: 940px;
                    margin: 0 auto;
                    width: 100%;
                    padding: 50px 24px;
                    box-sizing: border-box;
                }
                .bs-step-header { margin-bottom: 36px; }
                .bs-step-eyebrow {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.25em;
                    text-transform: uppercase;
                    color: ${accentColor};
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .bs-step-eyebrow::before {
                    content: '';
                    width: 24px;
                    height: 1px;
                    background: ${accentColor};
                    opacity: 0.4;
                }
                .bs-step-title {
                    font-family: 'Montserrat', sans-serif;
                    font-size: clamp(22px, 3.5vw, 32px);
                    font-weight: 300;
                    color: ${textColor};
                    letter-spacing: -0.01em;
                    line-height: 1.25;
                    margin-bottom: 12px;
                }
                .bs-step-desc { font-size: 14px; color: ${mutedColor}; line-height: 1.65; }
                .bs-back {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    color: ${mutedColor};
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    margin-bottom: 24px;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 500;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    transition: color 0.2s, transform 0.2s;
                }
                .bs-back:hover { color: ${accentColor}; transform: translateX(-2px); }
                .bs-back svg { width: 14px; height: 14px; stroke: currentColor; fill: none; }
                .bs-cat-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 16px;
                }
                .bs-cat-card {
                    background: #FFFFFF;
                    border: 1px solid ${accentColor}15;
                    border-radius: 4px;
                    padding: 36px 28px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.01);
                    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
                }
                .bs-cat-card:hover {
                    border-color: ${accentColor}40;
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(166, 128, 124, 0.08);
                }
                .bs-cat-icon { font-size: 24px; color: ${accentColor}; line-height: 1; }
                .bs-cat-name { font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 400; color: ${textColor}; line-height: 1.4; }
                .bs-cat-count { font-size: 11px; color: ${mutedColor}; margin-top: auto; opacity: 0.8; }
                
                .bs-treat-list { display: flex; flex-direction: column; gap: 12px; }
                .bs-treat-item {
                    background: #FFFFFF;
                    border: 1px solid ${accentColor}12;
                    border-radius: 4px;
                    padding: 24px 28px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    transition: border-color 0.25s, background 0.25s, transform 0.25s;
                }
                .bs-treat-item:hover { 
                    border-color: ${accentColor}35; 
                    background: ${accentColor}03;
                    transform: translateX(4px);
                }
                .bs-treat-num { font-family: 'Montserrat', sans-serif; font-size: 11px; color: ${accentColor}; font-weight: 600; min-width: 28px; }
                .bs-treat-main { flex: 1; display: flex; flex-direction: column; gap: 4px; }
                .bs-treat-name { font-size: 15px; font-weight: 400; color: ${textColor}; letter-spacing: -0.01em; }
                .bs-treat-teaser { font-size: 12px; color: ${mutedColor}; line-height: 1.5; max-width: 520px; }
                .bs-treat-abo-badge { font-size: 11px; color: ${accentColor}; background: ${accentColor}08; padding: 2px 8px; border-radius: 2px; display: inline-block; width: max-content; margin-top: 2px; font-family: 'Montserrat', sans-serif; font-weight: 500; }
                
                .bs-treat-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; min-width: 110px; }
                .bs-treat-price { font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 500; color: ${textColor}; }
                .bs-treat-dur { font-size: 12px; color: ${mutedColor}; }
                .bs-treat-savings { font-size: 10px; font-family: 'Montserrat', sans-serif; font-weight: 600; text-transform: uppercase; color: #FFFFFF; background: ${accentColor}; padding: 2px 6px; border-radius: 2px; letter-spacing: 0.05em; }
                
                .bs-treat-arrow { width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; opacity: 0.5; transition: opacity 0.2s, transform 0.2s; }
                .bs-treat-item:hover .bs-treat-arrow { opacity: 1; transform: translateX(2px); }
                .bs-treat-arrow svg { width: 14px; height: 14px; stroke: ${accentColor}; fill: none; stroke-width: 1.5; }
                
                .bs-selected-bar {
                    background: ${darkBg};
                    border-radius: 4px;
                    padding: 18px 24px;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .bs-selected-label { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 0.15em; text-transform: uppercase; font-family: 'Montserrat', sans-serif; font-weight: 600; }
                .bs-selected-name { font-size: 14px; font-weight: 400; color: #FFFFFF; font-family: 'Montserrat', sans-serif; flex: 1; }
                .bs-selected-price { font-size: 14px; font-weight: 500; color: ${accentColor}; font-family: 'Montserrat', sans-serif; }
                .bs-selected-dur { font-size: 11px; color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 99px; }
                
                .bs-cal-wrap {
                    width: 100%;
                    height: 660px;
                    overflow: hidden;
                    border-radius: 4px;
                    background: #FFFFFF;
                    border: 1px solid ${accentColor}15;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.02);
                }
                .bs-cal-iframe {
                    width: 100%;
                    height: calc(100% + ${CAL_CLIP_TOP}px);
                    margin-top: -${CAL_CLIP_TOP}px;
                    border: none;
                }
                
                .bs-success {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 50px 16px;
                }
                .bs-success-icon {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: ${accentColor}08;
                    border: 1px solid ${accentColor}25;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 32px;
                }
                .bs-success-icon svg { width: 36px; height: 36px; stroke: ${accentColor}; fill: none; stroke-width: 1.2; }
                .bs-success-eyebrow { font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: ${accentColor}; margin-bottom: 16px; }
                .bs-success-title { font-family: 'Montserrat', sans-serif; font-size: clamp(26px, 4.5vw, 38px); font-weight: 300; color: ${textColor}; letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 16px; }
                .bs-success-subtitle { font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 400; color: ${accentColor}; margin-bottom: 24px; }
                .bs-success-body { font-size: 14px; color: ${mutedColor}; line-height: 1.7; max-width: 460px; margin-bottom: 40px; }
                .bs-success-divider { width: 48px; height: 1px; background: ${accentColor}30; margin: 0 auto 40px; }
                .bs-success-detail {
                    background: #FFFFFF;
                    border: 1px solid ${accentColor}15;
                    border-radius: 4px;
                    padding: 20px 24px;
                    margin-bottom: 40px;
                    width: 100%;
                    max-width: 400px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .bs-success-detail-row { display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
                .bs-success-detail-label { color: ${mutedColor}; font-size: 13px; }
                .bs-success-detail-val { font-weight: 400; color: ${textColor}; font-family: 'Montserrat', sans-serif; }
                
                .bs-success-btn {
                    display: inline-block;
                    padding: 16px 36px;
                    background: ${accentColor};
                    color: #FFFFFF;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    box-shadow: 0 4px 16px rgba(166, 128, 124, 0.25);
                    transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
                }
                .bs-success-btn:hover { 
                    background: #936F6B; 
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(166, 128, 124, 0.35);
                }
                @media (max-width: 768px) {
                    .bs-header { padding: 0 24px; height: 60px; }
                    .bs-content { padding: 32px 16px; }
                    .bs-cat-grid { grid-template-columns: 1fr; gap: 12px; }
                    .bs-cal-wrap { height: 560px; }
                    .bs-treat-item { padding: 18px 20px; gap: 16px; flex-direction: column; align-items: flex-start; }
                    .bs-treat-meta { align-items: flex-start; min-width: auto; width: 100%; border-top: 1px solid ${accentColor}08; padding-top: 10px; margin-top: 4px; }
                    .bs-selected-bar { flex-direction: column; align-items: flex-start; gap: 10px; padding: 16px; }
                    .bs-selected-name { width: 100%; }
                }
            `}</style>

            <div className="bs-wrap">
                <div className="bs-header">
                    <span className="bs-logo">{logoText}</span>
                    {step !== "success" && (
                        <motion.span
                            key={step}
                            className="bs-header-step"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {step === "category" && "Schritt 1 / 3"}
                            {step === "treatment" && "Schritt 2 / 3"}
                            {step === "calendar" && "Schritt 3 / 3"}
                        </motion.span>
                    )}
                </div>

                <div className="bs-progress">
                    <div
                        className="bs-progress-fill"
                        style={{ width: progressMap[step] }}
                    />
                </div>

                <div className="bs-ap-wrap">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            className="bs-content"
                            custom={direction}
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                        >
                            {/* ── STEP 1: Kategória választó ── */}
                            {step === "category" && (
                                <>
                                    <div className="bs-step-header">
                                        <div className="bs-step-eyebrow">Jetzt buchen</div>
                                        <h1 className="bs-step-title">
                                            Welche Behandlung
                                            <br />
                                            wünschen Sie?
                                        </h1>
                                        <p className="bs-step-desc">
                                            Wählen Sie eine Kategorie aus, um die passenden exklusiven Behandlungen zu sehen.
                                        </p>
                                    </div>
                                    <div className="bs-cat-grid">
                                        {activeCategories.map((cat) => (
                                            <motion.div
                                                key={cat.id}
                                                className="bs-cat-card"
                                                whileHover={{ y: -4 }}
                                                onClick={() => {
                                                    setSelectedCategory(cat)
                                                    goForward("treatment")
                                                }}
                                            >
                                                <span className="bs-cat-icon">{cat.icon}</span>
                                                <span className="bs-cat-name">{cat.label}</span>
                                                <span className="bs-cat-count">
                                                    {cat.treatments.length} Behandlungen
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* ── STEP 2: Kezelés választó listanézet ── */}
                            {step === "treatment" && selectedCategory && (
                                <>
                                    <button
                                        className="bs-back"
                                        onClick={() => {
                                            goBack("category")
                                            setSelectedCategory(null)
                                        }}
                                    >
                                        <svg viewBox="0 0 14 14">
                                            <path d="M9 2L4 7l5 5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Zurück
                                    </button>
                                    <div className="bs-step-header">
                                        <div className="bs-step-eyebrow">{selectedCategory.label}</div>
                                        <h2 className="bs-step-title">Behandlung wählen</h2>
                                        <p className="bs-step-desc">
                                            Wählen Sie die gewünschte Behandlung für Ihren Termin.
                                        </p>
                                    </div>
                                    <div className="bs-treat-list">
                                        {selectedCategory.treatments.map((t, i) => (
                                            <motion.div
                                                key={i}
                                                className="bs-treat-item"
                                                onClick={() => {
                                                    setSelectedTreatment(t)
                                                    goForward("calendar")
                                                }}
                                            >
                                                <span className="bs-treat-num">
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                                <div className="bs-treat-main">
                                                    <span className="bs-treat-name">{t.name}</span>
                                                    {t.teaser && <span className="bs-treat-teaser">{t.teaser}</span>}
                                                    {(t.aboPrice1 || t.aboPrice2) && (
                                                        <span className="bs-treat-abo-badge">
                                                            Abo Options: {t.aboPrice1} {t.aboPrice2 ? `| ${t.aboPrice2}` : ""}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="bs-treat-meta">
                                                    <span className="bs-treat-price">{t.price}</span>
                                                    {t.duration && t.duration !== "Variabel" && (
                                                        <span className="bs-treat-dur">{t.duration}</span>
                                                    )}
                                                    {t.savings && <span className="bs-treat-savings">{t.savings}</span>}
                                                </div>
                                                <div className="bs-treat-arrow">
                                                    <svg viewBox="0 0 14 14">
                                                        <path d="M5 2l5 5-5 5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* ── STEP 3: Cal.com Beágyazott Naptár modul ── */}
                            {step === "calendar" && selectedTreatment && (
                                <>
                                    <button
                                        className="bs-back"
                                        onClick={() => {
                                            goBack("treatment")
                                            setSelectedTreatment(null)
                                        }}
                                    >
                                        <svg viewBox="0 0 14 14">
                                            <path d="M9 2L4 7l5 5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Zurück
                                    </button>
                                    <div className="bs-step-header">
                                        <div className="bs-step-eyebrow">Termin wählen</div>
                                        <h2 className="bs-step-title">Wann passt es Ihnen?</h2>
                                    </div>
                                    <div className="bs-selected-bar">
                                        <span className="bs-selected-label">Wahl</span>
                                        <span className="bs-selected-name">{selectedTreatment.name}</span>
                                        {selectedTreatment.duration && selectedTreatment.duration !== "Variabel" && (
                                            <span className="bs-selected-dur">{selectedTreatment.duration}</span>
                                        )}
                                        <span className="bs-selected-price">{selectedTreatment.price}</span>
                                    </div>
                                    <div className="bs-cal-wrap">
                                        <iframe
                                            ref={iframeRef}
                                            src={calUrl}
                                            className="bs-cal-iframe"
                                            title={`Termin buchen: ${selectedTreatment.name}`}
                                            allow="camera; microphone; autoplay; display-capture"
                                        />
                                    </div>
                                </>
                            )}

                            {/* ── SUCCESS KÉPERNYŐ (Sikeres Cal.com foglalás után kapott callback) ── */}
                            {step === "success" && (
                                <div className="bs-success">
                                    <div className="bs-success-icon">
                                        <svg viewBox="0 0 32 32">
                                            <path d="M6 16l7 7 13-13" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="bs-success-eyebrow">Buchung bestätigt</div>
                                    <h2 className="bs-success-title">{successTitle}</h2>
                                    <p className="bs-success-subtitle">{successSubtitle}</p>
                                    <div className="bs-success-divider" />
                                    <p className="bs-success-body">{successBody}</p>
                                    {selectedTreatment && (
                                        <div className="bs-success-detail">
                                            <div className="bs-success-detail-row">
                                                <span className="bs-success-detail-label">Behandlung</span>
                                                <span className="bs-success-detail-val">{selectedTreatment.name}</span>
                                            </div>
                                            <div className="bs-success-detail-row">
                                                <span className="bs-success-detail-label">Preis (Basis)</span>
                                                <span className="bs-success-detail-val" style={{ color: accentColor }}>
                                                    {selectedTreatment.price}
                                                </span>
                                            </div>
                                            {selectedCategory && (
                                                <div className="bs-success-detail-row">
                                                    <span className="bs-success-detail-label">Kategorie</span>
                                                    <span className="bs-success-detail-val">{selectedCategory.label}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <button className="bs-success-btn" onClick={reset}>
                                        {successButtonLabel}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </>
    )
}

// ─── Framer UI integrációs vezérlők (Canvas Property Controls) ────────────────
addPropertyControls(BuchungsSeite, {
    logoText: {
        type: ControlType.String,
        title: "Logo text",
        defaultValue: "Gabriella's Beauty",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#F7ECDF",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent",
        defaultValue: "#A6807C",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text",
        defaultValue: "#3A3028",
    },
    mutedColor: {
        type: ControlType.Color,
        title: "Muted Text",
        defaultValue: "#7A7369",
    },
    darkBg: {
        type: ControlType.Color,
        title: "Dark Ribbon",
        defaultValue: "#130C09",
    },
    successTitle: {
        type: ControlType.String,
        title: "Success Title",
        defaultValue: "Vielen Dank!",
    },
    successSubtitle: {
        type: ControlType.String,
        title: "Success Subtitle",
        defaultValue: "Ihre Anfrage wurde erfolgreich übermittelt.",
    },
    successBody: {
        type: ControlType.String,
        title: "Success Body",
        defaultValue:
            "Sie erhalten in Kürze eine Bestätigungs-E-Mail. Bei Fragen erreichen Sie uns jederzeit.",
    },
    successButtonLabel: {
        type: ControlType.String,
        title: "Button Label",
        defaultValue: "Weitere Behandlung buchen",
    },
})
