import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, AnimatePresence } from "framer-motion"

// ─── DESIGN TOKENS (GABRIELLA BEAUTY DESIGN SYSTEM)[cite: 1, 3] ─────────────
const TOKENS = {
    primary: "#A6807C",
    background: "#F7ECDF",
    cardBg: "#FFFFFF",
    text: "#3A3028",
    muted: "#7A7369",
    border: "#EAE3D9",
    fontHeading: "'Montserrat', sans-serif",
    fontBody: "'Inter', sans-serif",
    radiusCta: 4,
    shadowCta: "0 4px 16px rgba(0, 0, 0, 0.12)",
}

const SMOOTH_EASE = [0.16, 1, 0.3, 1]

// ─── HOOK: RESPONZÍV VISELKEDÉS ──────────────────────────────────────────────
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

// ─── IKONOK ──────────────────────────────────────────────────────────────────
function IconClose({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function IconMessage({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

// ─── EGYSÉGESÍTETT CTA GOMB ──────────────────────────────────────────────────
function CtaButton({
    ctaLabel,
    accentColor,
    onClick,
}: {
    ctaLabel: string
    accentColor: string
    onClick: () => void
}) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{
                y: -2,
                boxShadow: "0 8px 24px rgba(166, 128, 124, 0.25)",
            }}
            whileTap={{
                scale: 0.97,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 28px",
                background: accentColor,
                color: "#fff",
                fontFamily: TOKENS.fontHeading,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: TOKENS.radiusCta,
                boxShadow: TOKENS.shadowCta,
                cursor: "pointer",
                border: "none",
                flexShrink: 0,
                whiteSpace: "nowrap",
                position: "relative",
                zIndex: 100000, // Hogy a gomb a modal nyitásakor is aktív maradjon
            }}
        >
            {ctaLabel}
            <IconMessage size={14} />
        </motion.button>
    )
}

// ─── DROPDOWN MENU ───────────────────────────────────────────────────────────
function DropdownMenu({ items, accentColor, textColor, bgColor }: any) {
    return (
        <div
            style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                background: bgColor,
                borderRadius: 12,
                boxShadow:
                    "0 8px 32px rgba(60,30,20,0.10), 0 1px 4px rgba(60,30,20,0.06)",
                border: `1px solid rgba(166,128,124,0.15)`,
                padding: "6px 0",
                minWidth: 220,
                zIndex: 1000,
                fontFamily: TOKENS.fontBody,
            }}
        >
            {items.map((item: any) => (
                <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                        item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                    }
                    style={{
                        display: "block",
                        padding: "10px 18px",
                        fontSize: 13.5,
                        fontWeight: 400,
                        color: textColor,
                        textDecoration: "none",
                        transition: "color 0.15s, background 0.15s",
                        borderRadius: 8,
                        margin: "1px 4px",
                    }}
                    onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLElement).style.color =
                            accentColor
                        ;(e.currentTarget as HTMLElement).style.background =
                            `${accentColor}10`
                    }}
                    onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLElement).style.color =
                            textColor
                        ;(e.currentTarget as HTMLElement).style.background =
                            "transparent"
                    }}
                >
                    {item.label}
                </a>
            ))}
        </div>
    )
}

// ─── FŐ KOMPONENS: DESKTOP NAV WITH POPOVER CONTACT MODAL ────────────────────
export default function DesktopNav({
    logoImage = "",
    logoText = "Gabriella's Beauty",
    homeLink = "/",

    // CTA & Contact Modal Props
    ctaLabel = "Kontakt",
    modalTitle = "Kontaktieren Sie uns",
    modalDesc = "Füllen Sie das untenstehende Formular aus. Unser Expertenteam wird sich so schnell wie möglich bei Ihnen melden.",
    formEndpoint = "",
    labelName = "Vor- und Nachname",
    labelEmail = "E-Mail Adresse",
    labelPhone = "Telefonnummer (Optional)",
    labelMessage = "Ihre Nachricht an uns",
    submitText = "Nachricht absenden",

    // Színek
    bgColor = TOKENS.background,
    accentColor = TOKENS.primary,
    textColor = TOKENS.text,
    mutedColor = TOKENS.muted,

    // Linkek
    buchenLink = "/alle-behandlungen",
    dienstleistungenLink1 = "/klassisch",
    dienstleistungenLink2 = "/medizinisch",
    dienstleistungenLink3 = "/qms",
    dienstleistungenLink4 = "/haarentfernung-ipl",
    dienstleistungenLink5 = "/spezial",
    dienstleistungenLink6 = "/alle-Behandlungen",
    produkteLink1 = "/produkte/dr-med-christine-schrammen-kosmetik",
    produkteLink2 = "/produkte/qms-medicosmetics",
}: any) {
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const [isHidden, setIsHidden] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const navRef = useRef<HTMLElement>(null)
    const isMobile = useMediaQuery("(max-width: 768px)")

    // Kattintás a navigáción kívül -> dropdown bezárása
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setOpenMenu(null)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    // Navigáció elrejtése lefelé görgetéskor (kivéve ha a modal nyitva van)
    useEffect(() => {
        const handleNavbarVisibility = (e: Event) => {
            if (isModalOpen) return
            const customEvent = e as CustomEvent<{ hide: boolean }>
            setIsHidden(customEvent.detail.hide)
        }
        window.addEventListener("toggle-navbar", handleNavbarVisibility)
        return () =>
            window.removeEventListener("toggle-navbar", handleNavbarVisibility)
    }, [isModalOpen])

    // Scroll blockolása, amíg a modal nyitva van
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isModalOpen])

    // ─── INTELLIGENS GÖRGETÉS FUNKCIÓ ───
    const handleSmoothScroll = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string | undefined
    ) => {
        if (href && href.includes("#")) {
            const targetId = href.split("#")[1]
            const targetElement = document.getElementById(targetId)

            if (targetElement) {
                e.preventDefault()
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
            }
        }
    }

    // ─── NAVIGÁCIÓS ELEMEK ───
    const NAV_ITEMS = [
        { label: "Home", href: "/#home" },
        { label: "Über mich", href: "/#uber-mich" },
        {
            label: "Meine Dienstleistungen",
            href: "/#dienstleistungen",
            children: [
                {
                    label: "Klassische Kosmetikbehandlung",
                    href: dienstleistungenLink1,
                },
                {
                    label: "Medizinische Kosmetikbehandlung",
                    href: dienstleistungenLink2,
                },
                { label: "QMS Medicosmetics", href: dienstleistungenLink3 },
                {
                    label: "Haarentfernung mit IPL",
                    href: dienstleistungenLink4,
                },
                { label: "Spezial", href: dienstleistungenLink5 },
                { label: "Gesamtbehandlung", href: dienstleistungenLink6 },
            ],
        },
        { label: "alle Behandlungen", href: buchenLink },
        {
            label: "Produkte",
            href: "/#produkte",
            children: [
                {
                    label: "Dr. med. Christine Schrammen Kosmetik",
                    href: produkteLink1,
                },
                { label: "QMS Medicosmetics", href: produkteLink2 },
            ],
        },
    ]

    return (
        <motion.nav
            ref={navRef}
            initial={false}
            animate={{ y: isHidden ? "-100%" : "0%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
                width: "100%",
                background: bgColor,
                fontFamily: TOKENS.fontBody,
                position: "relative",
                top: 0,
                zIndex: 999,
                boxShadow:
                    "0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
            }}
        >
            <style>{`
                /* POPOVER & MODAL STÍLUSOK */
                .contact-modal-overlay {
                    position: fixed; inset: 0; z-index: 99998; /* A CTA gomb alatt, de a tartalom felett */
                    background: rgba(28, 20, 15, 0.25);
                    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
                    display: flex; justify-content: center; align-items: flex-start;
                }
                
                /* Ez a konténer felel a pontos desktop pozicionálásért (gomb alá, jobb szélre) */
                .contact-modal-positioner {
                    width: 100%;
                    max-width: 1200px;
                    padding: 0 32px;
                    margin-top: 80px; /* 72px Navbar + 8px gap */
                    display: flex;
                    justify-content: flex-end; /* Jobb szélre igazítás */
                    position: relative;
                }

                .contact-modal-content {
                    width: 100%; max-width: 440px; /* Vékonyabb, elegánsabb popover asztali gépen */
                    background: #FFFFFF; border-radius: 16px;
                    display: flex; flex-direction: column; overflow: hidden;
                    box-shadow: 0 24px 64px rgba(0,0,0,0.15), 0 8px 24px ${accentColor}20; 
                    position: relative;
                }
                
                .contact-modal-header {
                    padding: 24px 32px 16px;
                    border-bottom: 1px solid ${TOKENS.border};
                    display: flex; align-items: flex-start; justify-content: space-between;
                }
                .contact-modal-close {
                    width: 32px; height: 32px; border-radius: 50%;
                    background: #F3F0EC; border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    color: ${mutedColor}; transition: background 0.2s ease;
                    flex-shrink: 0; margin-left: 16px;
                }
                .contact-modal-close:hover { background: #E2DFDB; color: ${textColor}; }
                
                .contact-form-body {
                    padding: 24px 32px 32px;
                    overflow-y: auto;
                    max-height: calc(100vh - 160px);
                }
                .contact-form-group {
                    margin-bottom: 20px;
                    text-align: left;
                }
                .contact-form-label {
                    display: block;
                    font-family: ${TOKENS.fontHeading};
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    color: ${mutedColor};
                    text-transform: uppercase;
                    margin-bottom: 8px;
                }
                .contact-form-input {
                    width: 100%;
                    padding: 14px 16px;
                    font-family: ${TOKENS.fontBody};
                    font-size: 14px;
                    color: ${textColor};
                    background: #FFFFFF;
                    border: 1px solid ${TOKENS.border};
                    border-radius: 8px;
                    outline: none;
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                    box-sizing: border-box;
                }
                .contact-form-input:focus {
                    border-color: ${accentColor};
                    box-shadow: 0 0 0 3px ${accentColor}20;
                }
                textarea.contact-form-input {
                    min-height: 100px;
                    resize: vertical;
                }

                @media (max-width: 768px) {
                    .contact-modal-overlay { align-items: flex-end; }
                    .contact-modal-positioner {
                        margin-top: 0; padding: 0; height: 100%; 
                        align-items: flex-end; justify-content: center;
                    }
                    .contact-modal-content {
                        height: 90dvh; max-height: none; max-width: 100%;
                        border-radius: 24px 24px 0 0;
                    }
                    .contact-modal-drag-handle {
                        width: 100%; display: flex; justify-content: center;
                        padding: 16px 0 8px; cursor: grab;
                    }
                    .contact-modal-header { padding: 16px 24px; }
                    .contact-form-body { padding: 16px 24px 32px; max-height: calc(90dvh - 80px); }
                }
            `}</style>

            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "0 32px",
                    height: 72,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                }}
            >
                {/* ── LOGÓ ── */}
                <motion.a
                    href={homeLink}
                    onClick={(e) => handleSmoothScroll(e, "/#home")}
                    whileHover={{ opacity: 0.7 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        flexShrink: 0,
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                    }}
                >
                    {logoImage ? (
                        <img
                            src={logoImage}
                            alt={logoText}
                            style={{
                                height: 40,
                                width: "auto",
                                display: "block",
                            }}
                        />
                    ) : (
                        <span
                            style={{
                                fontSize: 15,
                                fontWeight: 500,
                                color: textColor,
                                letterSpacing: "0.03em",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {logoText}
                        </span>
                    )}
                </motion.a>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flex: 1,
                        justifyContent: "center",
                    }}
                >
                    {NAV_ITEMS.map((item) =>
                        item.children ? (
                            <div
                                key={item.label}
                                style={{
                                    position: "relative",
                                    marginBottom: -1,
                                }}
                                onMouseEnter={() => setOpenMenu(item.label)}
                                onMouseLeave={() => setOpenMenu(null)}
                            >
                                <a
                                    href={item.href}
                                    onClick={(e) =>
                                        handleSmoothScroll(e, item.href)
                                    }
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 5,
                                        padding: "8px 12px",
                                        fontSize: 14,
                                        fontWeight: 300,
                                        color:
                                            openMenu === item.label
                                                ? accentColor
                                                : textColor,
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        textDecoration: "none",
                                        fontFamily: TOKENS.fontBody,
                                        whiteSpace: "nowrap",
                                        transition: "color 0.15s",
                                        borderRadius: 3,
                                    }}
                                >
                                    {item.label}
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        style={{
                                            transition: "transform 0.22s ease",
                                            transform:
                                                openMenu === item.label
                                                    ? "rotate(180deg)"
                                                    : "rotate(0deg)",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <path
                                            d="M2 4L6 8L10 4"
                                            stroke={accentColor}
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </a>
                                {openMenu === item.label && (
                                    <DropdownMenu
                                        items={item.children}
                                        accentColor={accentColor}
                                        textColor={textColor}
                                        bgColor={bgColor}
                                    />
                                )}
                            </div>
                        ) : (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) =>
                                    handleSmoothScroll(e, item.href)
                                }
                                style={{
                                    padding: "8px 12px",
                                    fontSize: 14,
                                    fontWeight: 400,
                                    color: textColor,
                                    textDecoration: "none",
                                    whiteSpace: "nowrap",
                                    transition: "color 0.15s",
                                    borderRadius: 8,
                                }}
                                onMouseEnter={(e) =>
                                    ((
                                        e.currentTarget as HTMLElement
                                    ).style.color = accentColor)
                                }
                                onMouseLeave={(e) =>
                                    ((
                                        e.currentTarget as HTMLElement
                                    ).style.color = textColor)
                                }
                            >
                                {item.label}
                            </a>
                        )
                    )}
                </div>

                {/* ── Integrált CTA Gomb (Megnyitja a pozicionált űrlapot) ── */}
                <CtaButton
                    ctaLabel={
                        isModalOpen && !isMobile ? "Schliessen" : ctaLabel
                    } // Kis apróság: ha nyitva van, változhat a gomb felirata
                    accentColor={accentColor}
                    onClick={() => setIsModalOpen(!isModalOpen)}
                />
            </div>

            {/* ── POPOVER KAPCSOLAT ŰRLAP MODAL ── */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="contact-modal-overlay">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            style={{ position: "absolute", inset: 0 }}
                        />

                        {/* A konténer felel a gomb alá (jobb szélre) pozicionálásért */}
                        <div className="contact-modal-positioner">
                            <motion.div
                                className="contact-modal-content"
                                initial={
                                    isMobile
                                        ? { y: "100%" }
                                        : {
                                              opacity: 0,
                                              scale: 0.95,
                                              y: -10,
                                              transformOrigin: "top right",
                                          }
                                }
                                animate={
                                    isMobile
                                        ? { y: 0 }
                                        : { opacity: 1, scale: 1, y: 0 }
                                }
                                exit={
                                    isMobile
                                        ? { y: "100%" }
                                        : { opacity: 0, scale: 0.95, y: -10 }
                                }
                                transition={{
                                    type: "spring",
                                    damping: 30,
                                    stiffness: 350,
                                }}
                                drag={isMobile ? "y" : false}
                                dragConstraints={{ top: 0, bottom: 600 }}
                                onDragEnd={(_, info) => {
                                    if (
                                        isMobile &&
                                        (info.offset.y > 120 ||
                                            info.velocity.y > 400)
                                    ) {
                                        setIsModalOpen(false)
                                    }
                                }}
                            >
                                {isMobile && (
                                    <div className="contact-modal-drag-handle">
                                        <div
                                            style={{
                                                width: "40px",
                                                height: "5px",
                                                borderRadius: "99px",
                                                backgroundColor: `${mutedColor}40`,
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="contact-modal-header">
                                    <div>
                                        <h3
                                            style={{
                                                fontFamily: TOKENS.fontHeading,
                                                fontSize: "18px",
                                                fontWeight: 500,
                                                color: textColor,
                                                margin: "0 0 6px 0",
                                            }}
                                        >
                                            {modalTitle}
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                color: mutedColor,
                                                margin: 0,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {modalDesc}
                                        </p>
                                    </div>
                                    {!isMobile && (
                                        <button
                                            className="contact-modal-close"
                                            onClick={() =>
                                                setIsModalOpen(false)
                                            }
                                            aria-label="Schliessen"
                                        >
                                            <IconClose size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="contact-form-body">
                                    <form action={formEndpoint} method="POST">
                                        <div className="contact-form-group">
                                            <label
                                                className="contact-form-label"
                                                htmlFor="name"
                                            >
                                                {labelName}
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                className="contact-form-input"
                                                placeholder="Maria Muster"
                                            />
                                        </div>

                                        <div className="contact-form-group">
                                            <label
                                                className="contact-form-label"
                                                htmlFor="email"
                                            >
                                                {labelEmail}
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                className="contact-form-input"
                                                placeholder="maria@beispiel.ch"
                                            />
                                        </div>

                                        <div className="contact-form-group">
                                            <label
                                                className="contact-form-label"
                                                htmlFor="phone"
                                            >
                                                {labelPhone}
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                className="contact-form-input"
                                                placeholder="+41 79 123 45 67"
                                            />
                                        </div>

                                        <div className="contact-form-group">
                                            <label
                                                className="contact-form-label"
                                                htmlFor="message"
                                            >
                                                {labelMessage}
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                required
                                                className="contact-form-input"
                                                placeholder="Wie können wir Ihnen helfen?"
                                            ></textarea>
                                        </div>

                                        {/* Honeypot a spam botok ellen */}
                                        <input
                                            type="checkbox"
                                            name="_honeypot"
                                            style={{ display: "none" }}
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />

                                        <motion.button
                                            type="submit"
                                            whileHover={{
                                                y: -2,
                                                boxShadow:
                                                    "0 8px 24px rgba(166, 128, 124, 0.25)",
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{
                                                duration: 0.3,
                                                ease: SMOOTH_EASE,
                                            }}
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: accentColor,
                                                color: "#FFFFFF",
                                                fontFamily: TOKENS.fontHeading,
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                letterSpacing: "0.1em",
                                                textTransform: "uppercase",
                                                padding: "16px 24px",
                                                borderRadius: "8px",
                                                border: "none",
                                                cursor: "pointer",
                                                boxShadow: TOKENS.shadowCta,
                                                marginTop: "8px",
                                            }}
                                        >
                                            {submitText}
                                        </motion.button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

// ─── FRAMER PROPERTY CONTROLS ────────────────────────────────────────────────
addPropertyControls(DesktopNav, {
    // Logo beállítások
    logoImage: { type: ControlType.Image, title: "Logo kép" },
    logoText: {
        type: ControlType.String,
        title: "Logo szöveg",
        defaultValue: "Gabriella's Beauty",
    },
    homeLink: {
        type: ControlType.Link,
        title: "Főoldal Link (Logo)",
    },

    // Kontakt CTA beállítások
    ctaLabel: {
        type: ControlType.String,
        title: "CTA felirat (Nav)",
        defaultValue: "Kontakt",
    },
    modalTitle: {
        type: ControlType.String,
        title: "Modal Cím",
        defaultValue: "Kontaktieren Sie uns",
    },
    modalDesc: {
        type: ControlType.String,
        title: "Modal Leírás",
        defaultValue:
            "Füllen Sie das untenstehende Formular aus. Unser Expertenteam wird sich so schnell wie möglich bei Ihnen melden.",
        displayTextArea: true,
    },
    formEndpoint: {
        type: ControlType.String,
        title: "Form Endpoint URL",
        defaultValue: "",
    },
    labelName: {
        type: ControlType.String,
        title: "Név Címke",
        defaultValue: "Vor- und Nachname",
    },
    labelEmail: {
        type: ControlType.String,
        title: "Email Címke",
        defaultValue: "E-Mail Adresse",
    },
    labelPhone: {
        type: ControlType.String,
        title: "Telefon Címke",
        defaultValue: "Telefonnummer (Optional)",
    },
    labelMessage: {
        type: ControlType.String,
        title: "Üzenet Címke",
        defaultValue: "Ihre Nachricht an uns",
    },
    submitText: {
        type: ControlType.String,
        title: "Küldés Gomb",
        defaultValue: "Nachricht absenden",
    },

    // Design Tokens
    bgColor: {
        type: ControlType.Color,
        title: "Háttér",
        defaultValue: TOKENS.background,
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent",
        defaultValue: TOKENS.primary,
    },
    textColor: {
        type: ControlType.Color,
        title: "Szöveg",
        defaultValue: TOKENS.text,
    },
    mutedColor: {
        type: ControlType.Color,
        title: "Muted",
        defaultValue: TOKENS.muted,
    },

    // Navigációs Hivatkozások
    buchenLink: { type: ControlType.Link, title: "Buchen Link" },
    dienstleistungenLink1: { type: ControlType.Link, title: "DL: Klassisch" },
    dienstleistungenLink2: { type: ControlType.Link, title: "DL: Medizinisch" },
    dienstleistungenLink3: { type: ControlType.Link, title: "DL: QMS" },
    dienstleistungenLink4: { type: ControlType.Link, title: "DL: IPL" },
    dienstleistungenLink5: { type: ControlType.Link, title: "DL: Spezial" },
    dienstleistungenLink6: {
        type: ControlType.Link,
        title: "DL: Gesamtbehandlung",
    },
    produkteLink1: { type: ControlType.Link, title: "Produkte: Dr. Schrammen" },
    produkteLink2: { type: ControlType.Link, title: "Produkte: QMS" },
})
