import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, AnimatePresence } from "framer-motion"

// --- DESIGN TOKENS (GABRIELLA BEAUTY DESIGN SYSTEM) ---
const TOKENS = {
    primary: "#A6807C",
    background: "#F7ECDF",
    cardBg: "#FFFFFF",
    text: "#3A3028",
    muted: "#7A7369",
    border: "#EAE3D9",
    fontHeading: "'Montserrat', sans-serif",
    fontBody: "'Inter', sans-serif",
    radiusCard: 16,
    radiusImage: 12,
    radiusBadge: 99,
    radiusCta: 4,
    shadowCard: "0 12px 36px rgba(58, 48, 40, 0.06)",
    shadowCta: "0 4px 16px rgba(0, 0, 0, 0.12)",
    shadowUpsellCta: "0 2px 8px rgba(166, 128, 124, 0.1)",
}

// Svájci selyem-animáció (nincs rugózás, nincs ugrás)
const SWISS_EASE = [0.16, 1, 0.3, 1]

// --- INLINE SVGS ---
function IconSparkle({
    color = TOKENS.primary,
    size = 13,
}: {
    color?: string
    size?: number
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            style={{ flexShrink: 0 }}
        >
            <path
                d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z"
                fill={color}
            />
        </svg>
    )
}

function IconCheckCircle({
    color = TOKENS.primary,
    size = 18,
}: {
    color?: string
    size?: number
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            style={{ flexShrink: 0, marginTop: "2px" }}
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                fill={`${color}15`}
                stroke={color}
                strokeWidth="1.5"
            />
            <path
                d="M8.5 12.5L10.8 14.8L15.8 9.8"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function IconCalendar({
    color = "#FFFFFF",
    size = 16,
}: {
    color?: string
    size?: number
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            style={{ flexShrink: 0 }}
        >
            <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                ry="2"
                stroke={color}
                strokeWidth="1.8"
            />
            <line
                x1="16"
                y1="2"
                x2="16"
                y2="6"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <line
                x1="8"
                y1="2"
                x2="8"
                y2="6"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <line
                x1="3"
                y1="10"
                x2="21"
                y2="10"
                stroke={color}
                strokeWidth="1.8"
            />
        </svg>
    )
}

function IconClose({
    color = TOKENS.text,
    size = 20,
}: {
    color?: string
    size?: number
}) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
                d="M18 6L6 18M6 6L18 18"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function IconChevronDown({
    color = TOKENS.primary,
    size = 18,
}: {
    color?: string
    size?: number
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            style={{ flexShrink: 0 }}
        >
            <path
                d="M6 9L12 15L18 9"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false)
    useEffect(() => {
        const media = window.matchMedia(query)
        if (media.matches !== matches) setMatches(media.matches)
        const listener = () => setMatches(media.matches)
        media.addEventListener("change", listener)
        return () => media.removeEventListener("change", listener)
    }, [matches, query])
    return matches
}

// --- FULL CMS INTERFACE (WITH RICH TEXT / FORMATTED TEXT SUPPORT) ---
export interface TreatmentCardWithExperienceProps {
    title: string
    category: string
    leadText: React.ReactNode | string // Formatted Text (Rich Text)
    detailedDescription?: React.ReactNode | string // Formatted Text (Rich Text)
    imageUrl: string
    badgeText: string
    duration: string
    price: string
    aboText: string
    bullet1: string
    bullet2: string
    bullet3: string
    bullet4: string
    bookingUrl: string
    ctaText: string
    enableAutoZigzag: boolean

    accordionTitle1: string
    accordionText1: string
    accordionTitle2: string
    accordionText2: string
    accordionTitle3: string
    accordionText3: string
    accordionTitle4: string
    accordionText4: string
    accordionTitle5: string
    accordionText5: string

    proTipTitle: string
    proTipText: string
    secondaryCtaText: string
    addonBookingUrl: string

    style?: React.CSSProperties
}

export function TreatmentCardWithExperienceCMS({
    title = "Diamant-Mikrodermabrasion",
    category = "MEDIZINISCHE KOSMETIK • LUZERN",
    leadText = "Die hocheffektive Lösung für anspruchsvolle Hautprobleme in unserem Kosmetikstudio in Luzern. Durch die sanfte mechanische Abtragung verhornter Hautzellen mit sterilen Diamantaufsätzen wird die körpereigene Kollagen- und Elastinbildung tiefenwirksam angeregt.",
    detailedDescription = "Erleben Sie massgeschneiderte Hautpflege auf höchstem Schweizer Niveau. Unsere hochmoderne Behandlungsmethode eignet sich ideal bei feinen Linien, vergrösserten Poren, Pigmentflecken und lichtgeschädigter Haut in Luzern.",
    imageUrl = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
    badgeText = "100% NICHT-INVASIV",
    duration = "75 Min.",
    price = "165 CHF",
    aboText = "3er Abo: 419 CHF | 5er Abo: 655 CHF",
    bullet1 = "Sofort sichtbar verfeinertes Hautbild",
    bullet2 = "Tiefenwirksame Kollagenstimulation",
    bullet3 = "Schmerzfrei & keine Ausfallzeit im Alltag",
    bullet4 = "Höchste Schweizer Qualitätsansprüche",
    bookingUrl = "https://cal.com/gabriella-beauty/termin",
    ctaText = "Termin online buchen",
    enableAutoZigzag = true,

    accordionTitle1 = "Gründliche Reinigung & sanftes Peeling",
    accordionText1 = "Die Behandlung beginnt mit einer tiefenwirksamen Gesichtsreinigung und einem schonenden Peeling, um verhornte Hautzellen zu entfernen und die Haut optimal vorzubereiten.",
    accordionTitle2 = "Professionelle Ausreinigung",
    accordionText2 = "Sanfte und präzise Entfernung von Unreinheiten, um das Hautbild zu klären und verstopfte Poren nachhaltig zu befreien.",
    accordionTitle3 = "Bellabaci Schröpfmassage",
    accordionText3 = "Mit speziellen Facial-Cups wird eine wohltuende Schröpfmassage durchgeführt. Dies fördert die Mikrozirkulation, stimuliert die Kollagenfasern und entspannt die Gesichtsmuskulatur intensiv.",
    accordionTitle4 = "Individuelle Wirkstoff-Einarbeitung",
    accordionText4 = "Den Abschluss bildet das Einmassieren hochkonzentrierter, auf Ihren Hauttyp abgestimmter Wirkstoffe, deren Aufnahme durch die vorangegangene Entspannung maximiert wird.",
    accordionTitle5 = "Abschlusspflege & Sonnenschutz",
    accordionText5 = "Hochwertige Schutzcreme stärkt die Hautbarriere und schützt sie optimal vor schädlichen Umwelteinflüssen in Luzern.",

    proTipTitle = "Profi-Tipp für maximale Resultate",
    proTipText = "Kombinieren Sie Ihre klassische Basispflege mit der Bellabaci Gesichtsmassage als ergänzende Auszeit, um die Aufnahme von topischen Anti-Aging-Pflegeprodukten um ein Vielfaches zu steigern.",
    secondaryCtaText = "Bellabaci Treatment dazubuchen",
    addonBookingUrl = "https://gabriellasbeautysalon.trafft.com/booking?t=s&uuid=2b36e685-dc67-4ad8-9924-60b7b8f967a8",

    style,
}: TreatmentCardWithExperienceProps) {
    const isMobile = useMediaQuery("(max-width: 860px)")

    // --- STATE MANAGEMENT ---
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [isExperienceOpen, setIsExperienceOpen] = useState(false)
    const [openStep, setOpenStep] = useState<number | null>(1)

    const [currentModalUrl, setCurrentModalUrl] = useState<string>("")
    const [currentModalTitle, setCurrentModalTitle] = useState<string>(title)

    const bullets = useMemo(() => {
        return [bullet1, bullet2, bullet3, bullet4].filter((b) =>
            Boolean(b && b.trim() !== "")
        )
    }, [bullet1, bullet2, bullet3, bullet4])

    const steps = useMemo(() => {
        const rawSteps = [
            { num: "01", title: accordionTitle1, detail: accordionText1 },
            { num: "02", title: accordionTitle2, detail: accordionText2 },
            { num: "03", title: accordionTitle3, detail: accordionText3 },
            { num: "04", title: accordionTitle4, detail: accordionText4 },
            { num: "05", title: accordionTitle5, detail: accordionText5 },
        ]
        return rawSteps.filter((s) => Boolean(s.title && s.title.trim() !== ""))
    }, [
        accordionTitle1,
        accordionText1,
        accordionTitle2,
        accordionText2,
        accordionTitle3,
        accordionText3,
        accordionTitle4,
        accordionText4,
        accordionTitle5,
        accordionText5,
    ])

    const finalBookingUrl = useMemo(() => {
        if (!bookingUrl || bookingUrl.trim() === "") return ""
        try {
            const separator = bookingUrl.includes("?") ? "&" : "?"
            return `${bookingUrl}${separator}service=${encodeURIComponent(title.trim())}`
        } catch {
            return bookingUrl
        }
    }, [bookingUrl, title])

    const finalAddonUrl = useMemo(() => {
        if (!addonBookingUrl || addonBookingUrl.trim() === "")
            return finalBookingUrl
        try {
            const separator = addonBookingUrl.includes("?") ? "&" : "?"
            return `${addonBookingUrl}${separator}addon=${encodeURIComponent(secondaryCtaText.trim())}`
        } catch {
            return addonBookingUrl
        }
    }, [addonBookingUrl, secondaryCtaText, finalBookingUrl])

    const handleOpenMainBooking = () => {
        setCurrentModalUrl(finalBookingUrl)
        setCurrentModalTitle(title)
        setIsBookingOpen(true)
    }

    const handleOpenAddonBooking = () => {
        setCurrentModalUrl(finalAddonUrl || finalBookingUrl)
        setCurrentModalTitle(`${title} + ${secondaryCtaText}`)
        setIsBookingOpen(true)
    }

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "1140px",
                margin: "0 auto",
                fontFamily: TOKENS.fontBody,
                color: TOKENS.text,
                WebkitFontSmoothing: "antialiased",
                ...style,
            }}
        >
            {/* 1. AUTO ZIGZAG & SCOPED RICH TEXT STYLING (GABRIELLA BEAUTY DESIGN SYSTEM) */}
            <style>{`
        .cms-card-inner {
          display: flex;
          flex-direction: ${isMobile ? "column" : "row"};
          align-items: center;
          gap: ${isMobile ? "32px" : "56px"};
        }
        ${
            enableAutoZigzag && !isMobile
                ? `
        *:nth-child(2n of :has(.cms-card-inner)) .cms-card-inner,
        li:nth-child(2n) .cms-card-inner,
        .framer-stack > *:nth-child(2n) .cms-card-inner {
          flex-direction: row-reverse !important;
        }
        `
                : ""
        }
        /* SCOPED RICH TEXT / FORMATTED TEXT STYLES */
        .swiss-formatted-text p {
          margin: 0 0 14px 0;
          font-size: ${isMobile ? "15px" : "16px"};
          line-height: 1.7;
          color: ${TOKENS.muted};
          font-weight: 300;
        }
        .swiss-formatted-text p:last-child {
          margin-bottom: 0;
        }
        .swiss-formatted-text strong, .swiss-formatted-text b {
          color: ${TOKENS.text};
          font-weight: 600;
        }
        .swiss-formatted-text ul, .swiss-formatted-text ol {
          margin: 8px 0 16px 20px;
          padding: 0;
          color: ${TOKENS.muted};
        }
        .swiss-formatted-text li {
          margin-bottom: 6px;
          line-height: 1.6;
        }
        .swiss-formatted-text a {
          color: ${TOKENS.primary};
          text-decoration: underline;
          transition: opacity 0.2s;
        }
        .swiss-formatted-text a:hover {
          opacity: 0.8;
        }
      `}</style>

            {/* Külső kártya - tiszta CSS layout, nincs rugós margin-glitch */}
            <div
                style={{
                    backgroundColor: TOKENS.cardBg,
                    borderRadius: `${TOKENS.radiusCard}px`,
                    border: `1px solid ${TOKENS.border}`,
                    padding: isMobile ? "28px 20px" : "48px",
                    boxShadow: TOKENS.shadowCard,
                    overflow: "hidden",
                }}
            >
                {/* 1. TOP PART: THE 2-COLUMN SHOWCASE CARD */}
                <div className="cms-card-inner">
                    <div
                        style={{
                            flex: "1 1 50%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                        }}
                    >
                        {category && (
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontFamily: TOKENS.fontHeading,
                                    fontWeight: 500,
                                    fontSize: "11px",
                                    letterSpacing: "2px",
                                    color: TOKENS.primary,
                                    textTransform: "uppercase",
                                    marginBottom: "16px",
                                }}
                            >
                                <IconSparkle color={TOKENS.primary} size={13} />
                                <span>{category}</span>
                            </div>
                        )}

                        <h2
                            style={{
                                fontFamily: TOKENS.fontHeading,
                                fontWeight: 300,
                                fontSize: isMobile ? "26px" : "32px",
                                lineHeight: 1.25,
                                color: TOKENS.text,
                                margin: "0 0 16px 0",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            {title}
                        </h2>

                        {isMobile && (
                            <div
                                style={{
                                    width: "100%",
                                    position: "relative",
                                    marginBottom: "24px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        aspectRatio: "16 / 10",
                                        borderRadius: `${TOKENS.radiusImage}px`,
                                        overflow: "hidden",
                                        border: `1px solid ${TOKENS.border}`,
                                    }}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                </div>
                                {badgeText && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "12px",
                                            left: "12px",
                                            backgroundColor: "#FFFFFF",
                                            color: TOKENS.text,
                                            fontFamily: TOKENS.fontHeading,
                                            fontWeight: 500,
                                            fontSize: "11px",
                                            letterSpacing: "1.2px",
                                            textTransform: "uppercase",
                                            padding: "6px 14px",
                                            borderRadius: `${TOKENS.radiusBadge}px`,
                                            boxShadow:
                                                "0 8px 20px rgba(0,0,0,0.12)",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: "6px",
                                                height: "6px",
                                                borderRadius: "50%",
                                                backgroundColor: TOKENS.primary,
                                            }}
                                        />
                                        <span>{badgeText}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* HOSSZABB SEO-BARÁT LEÍRÁS (FORMATTED TEXT / RICH TEXT MEZŐ) */}
                        <div
                            className="swiss-formatted-text"
                            style={{ width: "100%", marginBottom: "24px" }}
                        >
                            {leadText}
                        </div>

                        {bullets.length > 0 && (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: isMobile
                                        ? "1fr"
                                        : "1fr 1fr",
                                    gap: "14px",
                                    width: "100%",
                                    borderTop: `1px solid ${TOKENS.border}`,
                                    paddingTop: "20px",
                                    marginBottom: "24px",
                                }}
                            >
                                {bullets.map((bullet, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "10px",
                                        }}
                                    >
                                        <IconCheckCircle
                                            color={TOKENS.primary}
                                            size={18}
                                        />
                                        <span
                                            style={{
                                                fontSize: "13.5px",
                                                fontWeight: 400,
                                                color: TOKENS.text,
                                                lineHeight: 1.45,
                                            }}
                                        >
                                            {bullet}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {aboText &&
                            aboText.trim() !== "" &&
                            aboText !== "–" && (
                                <div
                                    style={{
                                        width: "100%",
                                        padding: "10px 16px",
                                        backgroundColor: "#FAF6F0",
                                        borderRadius: "6px",
                                        borderLeft: `3px solid ${TOKENS.primary}`,
                                        fontSize: "13px",
                                        color: TOKENS.text,
                                        fontWeight: 500,
                                        marginBottom: "24px",
                                    }}
                                >
                                    💡 <strong>Abo-Vorteil:</strong> {aboText}
                                </div>
                            )}

                        {/* CTA & PRICE ROW */}
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: "20px",
                                width: "100%",
                                justifyContent: "space-between",
                            }}
                        >
                            <motion.button
                                whileHover={{
                                    y: -2,
                                    boxShadow:
                                        "0 8px 24px rgba(166, 128, 124, 0.25)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleOpenMainBooking}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    backgroundColor: TOKENS.primary,
                                    color: "#FFFFFF",
                                    fontFamily: TOKENS.fontBody,
                                    fontWeight: 500,
                                    fontSize: "15px",
                                    padding: "14px 28px",
                                    borderRadius: `${TOKENS.radiusCta}px`,
                                    border: "none",
                                    cursor: "pointer",
                                    boxShadow: TOKENS.shadowCta,
                                }}
                            >
                                <IconCalendar color="#FFFFFF" size={18} />
                                <span>{ctaText}</span>
                            </motion.button>

                            <div style={{ textAlign: "right" }}>
                                {price && (
                                    <span
                                        style={{
                                            display: "block",
                                            fontFamily: TOKENS.fontHeading,
                                            fontSize: "18px",
                                            fontWeight: 500,
                                            color: TOKENS.text,
                                        }}
                                    >
                                        {price}
                                    </span>
                                )}
                                {duration && (
                                    <span
                                        style={{
                                            fontSize: "13px",
                                            color: TOKENS.muted,
                                        }}
                                    >
                                        ⏱ {duration}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DESKTOP IMAGE COLUMN */}
                    {!isMobile && (
                        <div
                            style={{
                                flex: "1 1 50%",
                                width: "100%",
                                position: "relative",
                            }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.015 }}
                                transition={{ duration: 0.6, ease: SWISS_EASE }}
                                onClick={handleOpenMainBooking}
                                style={{
                                    width: "100%",
                                    aspectRatio: "4 / 3",
                                    borderRadius: `${TOKENS.radiusImage}px`,
                                    overflow: "hidden",
                                    position: "relative",
                                    border: `1px solid ${TOKENS.border}`,
                                    boxShadow:
                                        "0 16px 32px rgba(58, 48, 40, 0.06)",
                                    cursor: "pointer",
                                }}
                            >
                                <img
                                    src={imageUrl}
                                    alt={title}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        background:
                                            "linear-gradient(180deg, rgba(0,0,0,0) 65%, rgba(58,48,40,0.18) 100%)",
                                        pointerEvents: "none",
                                    }}
                                />
                            </motion.div>

                            {badgeText && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    style={{
                                        position: "absolute",
                                        bottom: "20px",
                                        left: "20px",
                                        backgroundColor: "#FFFFFF",
                                        color: TOKENS.text,
                                        fontFamily: TOKENS.fontHeading,
                                        fontWeight: 500,
                                        fontSize: "12px",
                                        letterSpacing: "1.5px",
                                        textTransform: "uppercase",
                                        padding: "10px 18px",
                                        borderRadius: `${TOKENS.radiusBadge}px`,
                                        boxShadow:
                                            "0 10px 28px rgba(58, 48, 40, 0.15)",
                                        border: `1px solid ${TOKENS.border}`,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        pointerEvents: "none",
                                    }}
                                >
                                    <span
                                        style={{
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            backgroundColor: TOKENS.primary,
                                        }}
                                    />
                                    <span>{badgeText}</span>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>

                {/* 2. JOBB ALSÓ SAROKBA POZICIONÁLT TOGGLE GOMB */}
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "24px",
                        paddingTop: "16px",
                    }}
                >
                    <motion.button
                        onClick={() => setIsExperienceOpen(!isExperienceOpen)}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: "none",
                            border: "none",
                            padding: "8px 12px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            color: TOKENS.primary,
                            fontFamily: TOKENS.fontHeading,
                            fontSize: "13px",
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                            cursor: "pointer",
                            borderRadius: "6px",
                            backgroundColor: isExperienceOpen
                                ? "#FAF6F0"
                                : "transparent",
                            transition: "background-color 0.2s ease",
                        }}
                    >
                        <span>
                            {isExperienceOpen
                                ? "Behandlungsablauf & Details ausblenden"
                                : "Behandlungsablauf & Profi-Tipp ansehen"}
                        </span>
                        <motion.div
                            animate={{ rotate: isExperienceOpen ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: SWISS_EASE }}
                        >
                            <IconChevronDown color={TOKENS.primary} size={16} />
                        </motion.div>
                    </motion.button>
                </div>

                {/* 3. BOTTOM EXPANDABLE PART - UGRÁSMENTES, SIMA LENYÍLÁS */}
                <AnimatePresence initial={false}>
                    {isExperienceOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: SWISS_EASE }}
                            style={{ overflow: "hidden" }}
                        >
                            <div
                                style={{
                                    borderTop: `1px solid ${TOKENS.border}`,
                                    marginTop: "16px",
                                    paddingTop: isMobile ? "28px" : "40px",
                                }}
                            >
                                {/* RÉSZLETES LEÍRÁS / OVERVIEW (FORMATTED TEXT / RICH TEXT MEZŐ) */}
                                {detailedDescription && (
                                    <div
                                        style={{
                                            marginBottom: "36px",
                                            paddingBottom: "28px",
                                            borderBottom: `1px solid ${TOKENS.border}`,
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontFamily: TOKENS.fontHeading,
                                                fontSize: "20px",
                                                fontWeight: 400,
                                                color: TOKENS.text,
                                                margin: "0 0 12px 0",
                                            }}
                                        >
                                            Wissenswertes zur Behandlung
                                        </h3>
                                        <div
                                            className="swiss-formatted-text"
                                            style={{ width: "100%" }}
                                        >
                                            {detailedDescription}
                                        </div>
                                    </div>
                                )}

                                {/* ACCORDION STEPS */}
                                {steps.length > 0 && (
                                    <div style={{ marginBottom: "40px" }}>
                                        <h3
                                            style={{
                                                fontFamily: TOKENS.fontHeading,
                                                fontSize: "22px",
                                                fontWeight: 300,
                                                color: TOKENS.text,
                                                margin: "0 0 6px 0",
                                            }}
                                        >
                                            Ablauf dieser Behandlung
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: "14px",
                                                color: TOKENS.muted,
                                                margin: "0 0 24px 0",
                                            }}
                                        >
                                            Schritt für Schritt zu Ihrem
                                            verjüngten Hautbild
                                        </p>

                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "10px",
                                            }}
                                        >
                                            {steps.map((step, idx) => {
                                                const isOpen = openStep === idx
                                                return (
                                                    <div
                                                        key={step.num}
                                                        style={{
                                                            border: `1px solid ${isOpen ? TOKENS.primary : TOKENS.border}`,
                                                            borderRadius: "8px",
                                                            backgroundColor:
                                                                isOpen
                                                                    ? "#FAF6F0"
                                                                    : "#FFFFFF",
                                                            overflow: "hidden",
                                                            transition:
                                                                "all 0.3s ease",
                                                        }}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                setOpenStep(
                                                                    isOpen
                                                                        ? null
                                                                        : idx
                                                                )
                                                            }
                                                            style={{
                                                                width: "100%",
                                                                padding:
                                                                    "16px 20px",
                                                                background:
                                                                    "none",
                                                                border: "none",
                                                                display: "flex",
                                                                justifyContent:
                                                                    "space-between",
                                                                alignItems:
                                                                    "center",
                                                                cursor: "pointer",
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    gap: "14px",
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        fontFamily:
                                                                            TOKENS.fontHeading,
                                                                        fontSize:
                                                                            "12px",
                                                                        fontWeight: 500,
                                                                        color: TOKENS.primary,
                                                                        backgroundColor:
                                                                            "#EFE5DA",
                                                                        padding:
                                                                            "4px 8px",
                                                                        borderRadius:
                                                                            "4px",
                                                                    }}
                                                                >
                                                                    {step.num}
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        fontFamily:
                                                                            TOKENS.fontHeading,
                                                                        fontSize:
                                                                            "16px",
                                                                        fontWeight:
                                                                            isOpen
                                                                                ? 500
                                                                                : 400,
                                                                        color: isOpen
                                                                            ? TOKENS.primary
                                                                            : TOKENS.text,
                                                                    }}
                                                                >
                                                                    {step.title}
                                                                </span>
                                                            </div>
                                                            <motion.span
                                                                animate={{
                                                                    rotate: isOpen
                                                                        ? 180
                                                                        : 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.3,
                                                                    ease: SWISS_EASE,
                                                                }}
                                                                style={{
                                                                    fontSize:
                                                                        "12px",
                                                                    color: TOKENS.muted,
                                                                }}
                                                            >
                                                                ▼
                                                            </motion.span>
                                                        </button>

                                                        <AnimatePresence
                                                            initial={false}
                                                        >
                                                            {isOpen &&
                                                                step.detail && (
                                                                    <motion.div
                                                                        initial={{
                                                                            height: 0,
                                                                            opacity: 0,
                                                                        }}
                                                                        animate={{
                                                                            height: "auto",
                                                                            opacity: 1,
                                                                        }}
                                                                        exit={{
                                                                            height: 0,
                                                                            opacity: 0,
                                                                        }}
                                                                        transition={{
                                                                            duration: 0.3,
                                                                            ease: SWISS_EASE,
                                                                        }}
                                                                        style={{
                                                                            overflow:
                                                                                "hidden",
                                                                        }}
                                                                    >
                                                                        <p
                                                                            style={{
                                                                                padding:
                                                                                    "0 20px 20px 54px",
                                                                                margin: 0,
                                                                                fontSize:
                                                                                    "14.5px",
                                                                                lineHeight: 1.65,
                                                                                color: TOKENS.muted,
                                                                            }}
                                                                        >
                                                                            {
                                                                                step.detail
                                                                            }
                                                                        </p>
                                                                    </motion.div>
                                                                )}
                                                        </AnimatePresence>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* PRO-TIP CALLOUT BANNER INSIDE ACCORDION */}
                                {proTipTitle && proTipTitle.trim() !== "" && (
                                    <div
                                        style={{
                                            backgroundColor: "#FAF6F0",
                                            border: `1px solid ${TOKENS.border}`,
                                            borderLeft: `4px solid ${TOKENS.primary}`,
                                            padding: isMobile ? "24px" : "32px",
                                            borderRadius: "10px",
                                            display: "flex",
                                            flexWrap: "wrap",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "20px",
                                        }}
                                    >
                                        <div style={{ flex: "1 1 400px" }}>
                                            <span
                                                style={{
                                                    fontFamily:
                                                        TOKENS.fontHeading,
                                                    fontSize: "11px",
                                                    fontWeight: 600,
                                                    color: TOKENS.primary,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "1.5px",
                                                    display: "block",
                                                    marginBottom: "6px",
                                                }}
                                            >
                                                ✨ Empfehlung der Kosmetikerin
                                            </span>
                                            <h4
                                                style={{
                                                    fontFamily:
                                                        TOKENS.fontHeading,
                                                    fontSize: "19px",
                                                    fontWeight: 400,
                                                    color: TOKENS.text,
                                                    margin: "0 0 8px 0",
                                                }}
                                            >
                                                {proTipTitle}
                                            </h4>
                                            <p
                                                style={{
                                                    fontSize: "14.5px",
                                                    lineHeight: 1.65,
                                                    color: TOKENS.text,
                                                    margin: 0,
                                                }}
                                            >
                                                {proTipText}
                                            </p>
                                        </div>

                                        {/* FEHÉR HÁTTERŰ, VÉKONY KERETES CTA GOMB -> AZONNAL A MODALT NYITJA! */}
                                        {secondaryCtaText && (
                                            <motion.button
                                                whileHover={{
                                                    y: -2,
                                                    boxShadow:
                                                        "0 6px 18px rgba(166, 128, 124, 0.18)",
                                                    backgroundColor: "#FEFDFC",
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleOpenAddonBooking}
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    padding: "13px 26px",
                                                    backgroundColor: "#FFFFFF",
                                                    color: TOKENS.primary,
                                                    border: `1px solid ${TOKENS.primary}`,
                                                    borderRadius: `${TOKENS.radiusCta}px`,
                                                    fontFamily: TOKENS.fontBody,
                                                    fontSize: "14px",
                                                    fontWeight: 500,
                                                    cursor: "pointer",
                                                    whiteSpace: "nowrap",
                                                    boxShadow:
                                                        TOKENS.shadowUpsellCta,
                                                    transition:
                                                        "border-color 0.2s ease",
                                                }}
                                            >
                                                <IconCalendar
                                                    color={TOKENS.primary}
                                                    size={16}
                                                />
                                                <span>{secondaryCtaText}</span>
                                            </motion.button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 4. SWIPE-UP / POPUP TRAFFT BOOKING MODAL (KÖZÖS MINDKÉT GOMBHOZ!) */}
            <AnimatePresence>
                {isBookingOpen && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 99999,
                            display: "flex",
                            alignItems: isMobile ? "flex-end" : "center",
                            justifyContent: "center",
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBookingOpen(false)}
                            style={{
                                position: "fixed",
                                inset: 0,
                                backgroundColor: "rgba(58, 48, 40, 0.65)",
                                backdropFilter: "blur(6px)",
                                WebkitBackdropFilter: "blur(6px)",
                            }}
                        />
                        <motion.div
                            initial={
                                isMobile
                                    ? { y: "100%" }
                                    : { opacity: 0, scale: 0.95, y: 20 }
                            }
                            animate={
                                isMobile
                                    ? { y: 0 }
                                    : { opacity: 1, scale: 1, y: 0 }
                            }
                            exit={
                                isMobile
                                    ? { y: "100%" }
                                    : { opacity: 0, scale: 0.95, y: 20 }
                            }
                            transition={{
                                type: "spring",
                                damping: 30,
                                stiffness: 300,
                            }}
                            drag={isMobile ? "y" : false}
                            dragConstraints={{ top: 0, bottom: 600 }}
                            onDragEnd={(_, info) => {
                                if (
                                    info.offset.y > 120 ||
                                    info.velocity.y > 400
                                )
                                    setIsBookingOpen(false)
                            }}
                            style={{
                                position: "relative",
                                width: isMobile ? "100%" : "90%",
                                maxWidth: "860px",
                                height: isMobile ? "88vh" : "78vh",
                                maxHeight: "740px",
                                backgroundColor: TOKENS.cardBg,
                                borderRadius: isMobile
                                    ? "24px 24px 0 0"
                                    : "20px",
                                boxShadow: "0 24px 64px rgba(0, 0, 0, 0.28)",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                zIndex: 10,
                            }}
                        >
                            {isMobile && (
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        padding: "12px 0 4px 0",
                                        cursor: "grab",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "5px",
                                            borderRadius: "99px",
                                            backgroundColor: `${TOKENS.muted}40`,
                                        }}
                                    />
                                </div>
                            )}
                            <div
                                style={{
                                    padding: "20px 28px",
                                    borderBottom: `1px solid ${TOKENS.border}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div>
                                    <span
                                        style={{
                                            fontFamily: TOKENS.fontHeading,
                                            fontSize: "11px",
                                            fontWeight: 500,
                                            letterSpacing: "1.5px",
                                            color: TOKENS.primary,
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        ONLINE TERMINRESERVIERUNG
                                    </span>
                                    <h3
                                        style={{
                                            fontFamily: TOKENS.fontHeading,
                                            fontSize: "20px",
                                            fontWeight: 400,
                                            color: TOKENS.text,
                                            margin: "4px 0 0 0",
                                        }}
                                    >
                                        {currentModalTitle}
                                    </h3>
                                </div>
                                <motion.button
                                    onClick={() => setIsBookingOpen(false)}
                                    whileHover={{
                                        scale: 1.08,
                                        backgroundColor: `${TOKENS.primary}15`,
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        border: `1px solid ${TOKENS.border}`,
                                        backgroundColor: "transparent",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                    }}
                                >
                                    <IconClose color={TOKENS.text} size={20} />
                                </motion.button>
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: TOKENS.background,
                                    position: "relative",
                                }}
                            >
                                {currentModalUrl ? (
                                    <iframe
                                        src={currentModalUrl}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            border: "none",
                                        }}
                                        title="Termin buchen"
                                        allow="payment; camera; microphone"
                                    />
                                ) : (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: "100%",
                                            color: TOKENS.muted,
                                        }}
                                    >
                                        Nincs megadva Trafft foglalási link.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

// --- FRAMER PROPERTY CONTROLS (USING RICHTEXT FOR FORMATTED TEXT FIELDS) ---
addPropertyControls(TreatmentCardWithExperienceCMS, {
    title: {
        type: ControlType.String,
        title: "Név",
        defaultValue: "Diamant-Mikrodermabrasion",
    },
    category: {
        type: ControlType.String,
        title: "Kategória",
        defaultValue: "MEDIZINISCHE KOSMETIK • LUZERN",
    },
    leadText: {
        type: ControlType.RichText,
        title: "SEO Leírás (Rich Text)",
        defaultValue:
            "Die hocheffektive Lösung für anspruchsvolle Hautprobleme in unserem Kosmetikstudio in Luzern. Durch die sanfte mechanische Abtragung verhornter Hautzellen mit sterilen Diamantaufsätzen wird die körpereigene Kollagen- und Elastinbildung tiefenwirksam angeregt.",
    },
    detailedDescription: {
        type: ControlType.RichText,
        title: "Részletes Leírás (Rich Text)",
        defaultValue:
            "Erleben Sie massgeschneiderte Hautpflege auf höchstem Schweizer Niveau. Unsere hochmoderne Behandlungsmethode eignet sich ideal bei feinen Linien, vergrösserten Poren, Pigmentflecken und lichtgeschädigter Haut in Luzern.",
    },
    imageUrl: { type: ControlType.Image, title: "Kép" },
    badgeText: {
        type: ControlType.String,
        title: "Címke (Badge)",
        defaultValue: "100% NICHT-INVASIV",
    },
    duration: {
        type: ControlType.String,
        title: "Időtartam",
        defaultValue: "75 Min.",
    },
    price: {
        type: ControlType.String,
        title: "Alap ár",
        defaultValue: "165 CHF",
    },
    aboText: {
        type: ControlType.String,
        title: "Bérlet ár (Abo)",
        defaultValue: "3er Abo: 419 CHF | 5er Abo: 655 CHF",
    },
    bullet1: {
        type: ControlType.String,
        title: "Bulletpoint 1",
        defaultValue: "Sofort sichtbar verfeinertes Hautbild",
    },
    bullet2: {
        type: ControlType.String,
        title: "Bulletpoint 2",
        defaultValue: "Tiefenwirksame Kollagenstimulation",
    },
    bullet3: {
        type: ControlType.String,
        title: "Bulletpoint 3",
        defaultValue: "Schmerzfrei & keine Ausfallzeit im Alltag",
    },
    bullet4: {
        type: ControlType.String,
        title: "Bulletpoint 4",
        defaultValue: "Höchste Schweizer Qualitätsansprüche",
    },
    bookingUrl: {
        type: ControlType.String,
        title: "Trafft Link",
        defaultValue: "https://cal.com/gabriella-beauty/termin",
    },
    ctaText: {
        type: ControlType.String,
        title: "CTA Text",
        defaultValue: "Termin online buchen",
    },
    enableAutoZigzag: {
        type: ControlType.Boolean,
        title: "Auto Zigzag",
        defaultValue: true,
    },

    accordionTitle1: {
        type: ControlType.String,
        title: "Lépés 1 Cím",
        defaultValue: "Gründliche Reinigung & sanftes Peeling",
    },
    accordionText1: {
        type: ControlType.String,
        title: "Lépés 1 Szöveg",
        defaultValue:
            "Die Behandlung beginnt mit einer tiefenwirksamen Gesichtsreinigung...",
    },
    accordionTitle2: {
        type: ControlType.String,
        title: "Lépés 2 Cím",
        defaultValue: "Professionelle Ausreinigung",
    },
    accordionText2: {
        type: ControlType.String,
        title: "Lépés 2 Szöveg",
        defaultValue: "Sanfte und präzise Entfernung von Unreinheiten...",
    },
    accordionTitle3: {
        type: ControlType.String,
        title: "Lépés 3 Cím",
        defaultValue: "Bellabaci Schröpfmassage",
    },
    accordionText3: {
        type: ControlType.String,
        title: "Lépés 3 Szöveg",
        defaultValue:
            "Mit speziellen Facial-Cups wird eine wohltuende Schröpfmassage...",
    },
    accordionTitle4: {
        type: ControlType.String,
        title: "Lépés 4 Cím",
        defaultValue: "Individuelle Wirkstoff-Einarbeitung",
    },
    accordionText4: {
        type: ControlType.String,
        title: "Lépés 4 Szöveg",
        defaultValue:
            "Den Abschluss bildet das Einmassieren hochkonzentrierter...",
    },
    accordionTitle5: {
        type: ControlType.String,
        title: "Lépés 5 Cím",
        defaultValue: "Abschlusspflege & Sonnenschutz",
    },
    accordionText5: {
        type: ControlType.String,
        title: "Lépés 5 Szöveg",
        defaultValue: "Hochwertige Schutzcreme stärkt die Hautbarriere...",
    },

    proTipTitle: {
        type: ControlType.String,
        title: "Pro Tip Cím",
        defaultValue: "Profi-Tipp für maximale Resultate",
    },
    proTipText: {
        type: ControlType.String,
        title: "Pro Tip Szöveg",
        defaultValue:
            "Kombinieren Sie Ihre klassische Basispflege mit der Bellabaci...",
    },
    secondaryCtaText: {
        type: ControlType.String,
        title: "Upsell CTA Text",
        defaultValue: "Bellabaci Treatment dazubuchen",
    },
    addonBookingUrl: {
        type: ControlType.String,
        title: "Upsell Trafft Link",
        defaultValue:
            "https://gabriellasbeautysalon.trafft.com/booking?t=s&uuid=2b36e685-dc67-4ad8-9924-60b7b8f967a8",
    },
})
