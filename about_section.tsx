import { addPropertyControls, ControlType } from "framer"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

// ─── Ikonok ───────────────────────────────────────────────────
const ICONS: Record<string, JSX.Element> = {
    award: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
    ),
    diamond: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2.7 10.3a2.4 2.4 0 000 3.41l7.59 7.58a2.4 2.4 0 003.41 0l7.58-7.58a2.4 2.4 0 000-3.41L13.7 2.71a2.4 2.4 0 00-3.41 0z" />
        </svg>
    ),
    sparkles: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.936A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.963 0L14.063 8.5A2 2 0 0015.5 9.937l6.135 1.581a.5.5 0 010 .964L15.5 14.063a2 2 0 00-1.437 1.437l-1.582 6.135a.5.5 0 01-.963 0z" />
        </svg>
    ),
    shield: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    star: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    heart: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
    ),
    leaf: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M11 20A7 7 0 014 13V6l7-3 7 3v7a7 7 0 01-7 7z" />
            <path d="M11 20v-9" />
        </svg>
    ),
    check: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-5" />
        </svg>
    ),
}

// ─── CTA gomb — újrafelhasználható mindkét helyhez ────────────
// SEO & WCAG optimalizált, egységesített hover animációval
function CtaButton({
    ctaHref,
    ctaLabel,
    accentColor,
}: {
    ctaHref: string
    ctaLabel: string
    accentColor: string
}) {
    return (
        <motion.a
            href={ctaHref}
            whileHover={{
                x: 4,
                filter: "brightness(0.9)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            }}
            whileTap={{
                scale: 0.97,
                filter: "brightness(0.85)",
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "13px 28px",
                background: accentColor,
                color: "#fff",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: 4,
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                filter: "brightness(1)", // Alapállapot a sima átmenethez
                cursor: "pointer",
            }}
        >
            {ctaLabel}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                    d="M2 6h8M6.5 2.5L10 6l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </motion.a>
    )
}

export default function AboutSection({
    bgColor = "#F7ECDF",
    accentColor = "#A6807C",
    textColor = "#3a3028",
    mutedColor = "#7a7369",
    eyebrow = "Über mich",
    title = "Gabriella\nWilliams",
    bio = "Mit Leidenschaft und jahrelanger Erfahrung in der Kosmetik biete ich Ihnen individuelle Behandlungen, die auf Ihre Haut und Ihre Bedürfnisse abgestimmt sind. Mein Ziel ist es, dass Sie sich in meinem Salon rundum wohlfühlen – und strahlend schön nach Hause gehen.",
    bio2 = "Seit 2018 bin ich ausgebildete Kosmetikerin und spezialisiere mich auf klassische sowie medizinische Kosmetik, QMS Medicosmetics und dauerhafte IPL Haarentfernung.",
    ctaLabel = "Mehr über mich",
    ctaHref = "/uber-mich",
    image1 = "https://i.imgur.com/NfeqbqS.png",
    badge1 = "5+ Jahre Erfahrung",
    badge2 = "QMS zertifiziert",
    bullet1Text = "Akkreditierte Kosmetikerqualifikation",
    bullet1Icon = "award",
    bullet2Text = "Premium-Produktlinie",
    bullet2Icon = "diamond",
    bullet3Text = "Personalisierte Hautpflege",
    bullet3Icon = "sparkles",
    bullet4Text = "Sterile, hochwertige Salonumgebung",
    bullet4Icon = "shield",
}: {
    bgColor?: string
    accentColor?: string
    textColor?: string
    mutedColor?: string
    eyebrow?: string
    title?: string
    bio?: string
    bio2?: string
    ctaLabel?: string
    ctaHref?: string
    image1?: string
    badge1?: string
    badge2?: string
    bullet1Text?: string
    bullet1Icon?: string
    bullet2Text?: string
    bullet2Icon?: string
    bullet3Text?: string
    bullet3Icon?: string
    bullet4Text?: string
    bullet4Icon?: string
}) {
    const titleLines = title.split("\n")

    const bullets = [
        { text: bullet1Text, icon: bullet1Icon },
        { text: bullet2Text, icon: bullet2Icon },
        { text: bullet3Text, icon: bullet3Icon },
        { text: bullet4Text, icon: bullet4Icon },
    ].filter((b) => b.text)

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Montserrat:wght@300;400;500&display=swap');

                .about-grid {
                    grid-template-columns: 1fr 1fr;
                    gap: clamp(40px, 6vw, 88px);
                    padding: clamp(48px, 7vw, 88px) clamp(20px, 5vw, 64px);
                }

                /* Mobil: 1 oszlop, balra igazítás, azonos padding a szövegnek és a képnek */
                @media (max-width: 768px) {
                    .about-grid { 
                        grid-template-columns: 1fr !important; 
                        padding: 48px 24px 64px 24px !important; /* Egységes oldalsó padding */
                        gap: 40px !important;
                    }
                    .cta-desktop { display: none !important; }
                    .cta-mobile { 
                        display: flex !important; 
                        justify-content: flex-start !important; /* Mobilon balra zárt gomb */
                        margin-top: 16px;
                    }
                }

                /* Desktop: mobil CTA rejtve */
                @media (min-width: 769px) {
                    .cta-desktop { display: inline-flex !important; }
                    .cta-mobile { display: none !important; }
                }
            `}</style>

            <section
                style={{
                    width: "100%",
                    background: bgColor,
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: "border-box",
                    overflow: "hidden",
                }}
            >
                <div
                    className="about-grid"
                    style={{
                        maxWidth: 1100,
                        margin: "0 auto",
                        display: "grid",
                        alignItems: "center",
                    }}
                >
                    {/* ── Bal oldal — szöveg ── */}
                    <motion.div
                        className="about-text-col"
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Eyebrow */}
                        <div
                            style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: 10,
                                fontWeight: 500,
                                letterSpacing: "0.22em",
                                textTransform: "uppercase",
                                color: accentColor,
                                marginBottom: 16,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <span
                                style={{
                                    display: "inline-block",
                                    width: 20,
                                    height: 1,
                                    background: accentColor,
                                    opacity: 0.5,
                                }}
                            />
                            {eyebrow}
                        </div>

                        {/* Cím */}
                        <h2
                            style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: "clamp(28px, 4.5vw, 48px)",
                                fontWeight: 300,
                                color: textColor,
                                lineHeight: 1.1,
                                letterSpacing: "-0.02em",
                                margin: "0 0 24px",
                            }}
                        >
                            {titleLines.map((line, i) => (
                                <span key={i}>
                                    {i === 1 ? (
                                        <span style={{ color: accentColor }}>
                                            {line}
                                        </span>
                                    ) : (
                                        line
                                    )}
                                    {i < titleLines.length - 1 && <br />}
                                </span>
                            ))}
                        </h2>

                        {/* Elválasztó */}
                        <div
                            style={{
                                width: 36,
                                height: 1.5,
                                background: accentColor,
                                borderRadius: 99,
                                marginBottom: 24,
                            }}
                        />

                        {/* Bio */}
                        <p
                            style={{
                                fontSize: "clamp(13px, 1.8vw, 14px)",
                                color: mutedColor,
                                lineHeight: 1.8,
                                margin: "0 0 14px",
                            }}
                        >
                            {bio}
                        </p>
                        {bio2 && (
                            <p
                                style={{
                                    fontSize: "clamp(13px, 1.8vw, 14px)",
                                    color: mutedColor,
                                    lineHeight: 1.8,
                                    margin: "0 0 32px",
                                }}
                            >
                                {bio2}
                            </p>
                        )}

                        {/* Bullet pontok */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                                marginBottom: 28,
                            }}
                        >
                            {bullets.map((b, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.4,
                                        delay: 0.1 + i * 0.08,
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                    }}
                                >
                                    <div
                                        style={{
                                            flexShrink: 0,
                                            width: 38,
                                            height: 38,
                                            borderRadius: "50%",
                                            background: `${accentColor}12`,
                                            border: `1px solid ${accentColor}25`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: accentColor,
                                        }}
                                    >
                                        {ICONS[b.icon] ?? ICONS["check"]}
                                    </div>
                                    <span
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize:
                                                "clamp(13px, 1.8vw, 14px)",
                                            color: textColor,
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {b.text}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Badge-ek */}
                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                                flexWrap: "wrap",
                                marginBottom: 32,
                            }}
                        >
                            {[badge1, badge2].filter(Boolean).map((b) => (
                                <span
                                    key={b}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        padding: "6px 14px",
                                        borderRadius: 99,
                                        border: `1px solid ${accentColor}40`,
                                        background: `${accentColor}08`,
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontSize: 10,
                                        fontWeight: 500,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        color: accentColor,
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 5,
                                            height: 5,
                                            borderRadius: "50%",
                                            background: accentColor,
                                            flexShrink: 0,
                                        }}
                                    />
                                    {b}
                                </span>
                            ))}
                        </div>

                        {/* ── CTA — csak desktop nézetben ── */}
                        <div className="cta-desktop">
                            <CtaButton
                                ctaHref={ctaHref}
                                ctaLabel={ctaLabel}
                                accentColor={accentColor}
                            />
                        </div>
                    </motion.div>

                    {/* ── Jobb oldal — kép ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{
                            duration: 0.6,
                            delay: 0.15,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Kép */}
                        <motion.div
                            className="about-img-wrapper"
                            whileHover={{ scale: 1.015 }}
                            style={{
                                borderRadius: 16,
                                overflow: "hidden",
                                boxShadow: "0 16px 48px rgba(0,0,0,0.14)",
                                aspectRatio: "2/3",
                                height: "clamp(420px, 55vw, 580px)",
                                width: "100%",
                            }}
                        >
                            <img
                                src={image1}
                                alt="Gabriella"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    objectPosition: "center top",
                                    display: "block",
                                }}
                            />
                        </motion.div>

                        {/* ── CTA — csak mobil nézetben, kép alatt ── */}
                        <div className="cta-mobile">
                            <CtaButton
                                ctaHref={ctaHref}
                                ctaLabel={ctaLabel}
                                accentColor={accentColor}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    )
}

addPropertyControls(AboutSection, {
    bgColor: {
        type: ControlType.Color,
        title: "Háttér",
        defaultValue: "#F7ECDF",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent",
        defaultValue: "#A6807C",
    },
    textColor: {
        type: ControlType.Color,
        title: "Szöveg",
        defaultValue: "#3a3028",
    },
    mutedColor: {
        type: ControlType.Color,
        title: "Muted",
        defaultValue: "#7a7369",
    },
    eyebrow: {
        type: ControlType.String,
        title: "Eyebrow",
        defaultValue: "Über mich",
    },
    title: {
        type: ControlType.String,
        title: "Cím",
        defaultValue: "Gabriella\nWilliams",
        displayTextArea: true,
    },
    bio: {
        type: ControlType.String,
        title: "Bio 1",
        defaultValue:
            "Mit Leidenschaft und jahrelanger Erfahrung in der Kosmetik biete ich Ihnen individuelle Behandlungen, die auf Ihre Haut und Ihre Bedürfnisse abgestimmt sind.",
        displayTextArea: true,
    },
    bio2: {
        type: ControlType.String,
        title: "Bio 2",
        defaultValue:
            "Seit 2018 bin ich ausgebildete Kosmetikerin und spezialisiere mich auf klassische sowie medizinische Kosmetik, QMS Medicosmetics und dauerhafte IPL Haarentfernung.",
        displayTextArea: true,
    },
    ctaLabel: {
        type: ControlType.String,
        title: "Gomb felirat",
        defaultValue: "Mehr über mich",
    },
    ctaHref: {
        type: ControlType.String,
        title: "Gomb link",
        defaultValue: "/uber-mich",
    },
    image1: { type: ControlType.Image, title: "Kép (portrait)" },
    badge1: {
        type: ControlType.String,
        title: "Badge 1",
        defaultValue: "5+ Jahre Erfahrung",
    },
    badge2: {
        type: ControlType.String,
        title: "Badge 2",
        defaultValue: "QMS zertifiziert",
    },
    bullet1Text: {
        type: ControlType.String,
        title: "Bullet 1 szöveg",
        defaultValue: "Akkreditierte Kosmetikerqualifikation",
    },
    bullet1Icon: {
        type: ControlType.Enum,
        title: "Bullet 1 ikon",
        options: [
            "award",
            "diamond",
            "sparkles",
            "shield",
            "star",
            "heart",
            "leaf",
            "check",
        ],
        defaultValue: "award",
    },
    bullet2Text: {
        type: ControlType.String,
        title: "Bullet 2 szöveg",
        defaultValue: "Premium-Produktlinie",
    },
    bullet2Icon: {
        type: ControlType.Enum,
        title: "Bullet 2 ikon",
        options: [
            "award",
            "diamond",
            "sparkles",
            "shield",
            "star",
            "heart",
            "leaf",
            "check",
        ],
        defaultValue: "diamond",
    },
    bullet3Text: {
        type: ControlType.String,
        title: "Bullet 3 szöveg",
        defaultValue: "Personalisierte Hautpflege",
    },
    bullet3Icon: {
        type: ControlType.Enum,
        title: "Bullet 3 ikon",
        options: [
            "award",
            "diamond",
            "sparkles",
            "shield",
            "star",
            "heart",
            "leaf",
            "check",
        ],
        defaultValue: "sparkles",
    },
    bullet4Text: {
        type: ControlType.String,
        title: "Bullet 4 szöveg",
        defaultValue: "Sterile, hochwertige Salonumgebung",
    },
    bullet4Icon: {
        type: ControlType.Enum,
        title: "Bullet 4 ikon",
        options: [
            "award",
            "diamond",
            "sparkles",
            "shield",
            "star",
            "heart",
            "leaf",
            "check",
        ],
        defaultValue: "shield",
    },
})
