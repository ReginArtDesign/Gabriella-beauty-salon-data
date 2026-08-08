// ============ CategoryChapterHeader.tsx (TELJES — SZÍNEK A PROP PANELEN) ============
import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"

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

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false)
    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)")
        setReduced(media.matches)
        const listener = () => setReduced(media.matches)
        media.addEventListener("change", listener)
        return () => media.removeEventListener("change", listener)
    }, [])
    return reduced
}

function resolveSrc(img: unknown): string {
    if (!img) return ""
    if (typeof img === "string") return img
    if (typeof img === "object" && img !== null && "src" in img) {
        const s = (img as { src?: unknown }).src
        return typeof s === "string" ? s : ""
    }
    return ""
}

// JAVÍTVA: nem szűrünk offsetParent/láthatóság szerint, mert az
// önmagát blokkoló kört okozott (a saját rejtett állapotunk miatt
// sosem "látszottunk" volna, tehát sosem lehettünk volna "elsők").
// Minden sensor-div MINDIG a DOM-ban van, csak a tartalma feltételes
// — ezért egyszerűen a nyers DOM-sorrend alapján döntünk.
function useIsFirstChapterInCategory(category: string) {
    const ref = useRef<HTMLDivElement>(null)
    const [isFirst, setIsFirst] = useState(false)

    useEffect(() => {
        if (!category || category.trim() === "") {
            setIsFirst(false)
            return
        }
        const compute = () => {
            if (!ref.current) return
            const all = Array.from(
                document.querySelectorAll<HTMLElement>("[data-chapter-cat]")
            )
            const idx = all.indexOf(ref.current)
            if (idx === -1) {
                setIsFirst(false)
                return
            }
            if (idx === 0) {
                setIsFirst(true)
                return
            }
            const prevCat = all[idx - 1].getAttribute("data-chapter-cat")
            setIsFirst(prevCat !== category)
        }
        const t = setTimeout(compute, 60)
        const observer = new MutationObserver(() => {
            clearTimeout(t)
            setTimeout(compute, 60)
        })
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })
        return () => {
            clearTimeout(t)
            observer.disconnect()
        }
    }, [category])

    return { ref, isFirst }
}

interface CategoryChapterHeaderProps {
    category?: string
    description?: string
    treatmentCount?: number
    countLabel?: string
    photo?: any
    imagePosition?: "left" | "right"
    creamColor?: string
    inkColor?: string
    mauveColor?: string
    mutedColor?: string
    brassColor?: string
    style?: React.CSSProperties
}

export default function CategoryChapterHeader({
    category = "Medizinische Kosmetik",
    description = "Wirksame Verfahren mit sichtbaren, langanhaltenden Resultaten — für anspruchsvolle Haut.",
    treatmentCount = 10,
    countLabel = "Behandlungen",
    photo,
    imagePosition = "left",
    creamColor = "#F7ECDF",
    inkColor = "#2E211D",
    mauveColor = "#A6807C",
    mutedColor = "#7A7369",
    brassColor = "#C8A165",
    style,
}: CategoryChapterHeaderProps) {
    const isMobile = useMediaQuery("(max-width: 860px)")
    const reducedMotion = usePrefersReducedMotion()
    const { ref: chapterRef, isFirst } = useIsFirstChapterInCategory(category)
    const photoSrc = resolveSrc(photo)

    // MINDIG ugyanaz a DOM-elem van jelen (a sensor), csak a
    // BELSEJE változik — így a DOM-sorrend stabil és nem
    // önhivatkozó.
    if (!isFirst) {
        return (
            <div
                ref={chapterRef}
                data-chapter-cat={category || undefined}
                style={{ display: "none" }}
            />
        )
    }

    const showLeft = !isMobile && imagePosition === "left"
    const fontHeading = "'Montserrat', sans-serif"
    const fontBody = "'Inter', sans-serif"

    return (
        <div
            ref={chapterRef}
            data-chapter-cat={category || undefined}
            style={{
                width: "100%",
                fontFamily: fontBody,
                margin: isMobile ? "56px 0 56px 0" : "72px 0 40px 0",
                ...style,
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Montserrat:wght@200;500;600&display=swap');
                .cch-grid {
                    display: flex;
                    /* ÚJ LOGIKA: Mobilon column (szöveg felül, kép alul), asztalinál az imagePosition prop alapján */
                    flex-direction: ${
                        isMobile ? "column" : showLeft ? "row-reverse" : "row"
                    };
                    align-items: stretch;
                    gap: ${isMobile ? "24px" : "44px"};
                }
                @keyframes cch-kenburns {
                    from { transform: scale(1); }
                    to { transform: scale(1.07); }
                }
            `}</style>

            <div className="cch-grid">
                {/* 1. SZÖVEG DOBOZ (Előre került a DOM-ban) */}
                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 14,
                        }}
                    >
                        <span
                            style={{
                                width: 18,
                                height: 1,
                                backgroundColor: brassColor,
                            }}
                        />
                        <span
                            style={{
                                fontFamily: fontHeading,
                                fontSize: 10.5,
                                fontWeight: 600,
                                letterSpacing: "0.26em",
                                textTransform: "uppercase",
                                color: mauveColor,
                            }}
                        >
                            {treatmentCount} {countLabel}
                        </span>
                    </div>

                    <h2
                        style={{
                            margin: "0 0 14px 0",
                            fontFamily: fontHeading,
                            fontWeight: 200,
                            fontSize: isMobile
                                ? "clamp(28px, 8vw, 38px)"
                                : "clamp(34px, 3.4vw, 48px)",
                            lineHeight: 1.08,
                            letterSpacing: "-0.01em",
                            color: inkColor,
                        }}
                    >
                        {category}
                    </h2>

                    <p
                        style={{
                            margin: 0,
                            maxWidth: 440,
                            fontFamily: fontBody,
                            fontWeight: 300,
                            fontSize: isMobile ? 14.5 : 15.5,
                            lineHeight: 1.7,
                            color: mutedColor,
                        }}
                    >
                        {description}
                    </p>
                </div>

                {/* 2. KÉP DOBOZ (Hátra került a DOM-ban) */}
                {photoSrc && (
                    <div
                        style={{
                            flex: isMobile ? "none" : "0 0 42%",
                            width: "100%",
                            aspectRatio: isMobile ? "16 / 9" : "4 / 3.2",
                            borderRadius: 12,
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <img
                            src={photoSrc}
                            alt=""
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                                animation: reducedMotion
                                    ? "none"
                                    : "cch-kenburns 14s ease-in-out infinite alternate",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(43,29,24,0.18) 100%)",
                                pointerEvents: "none",
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

addPropertyControls(CategoryChapterHeader, {
    category: {
        type: ControlType.String,
        title: "[Kategória] CMS mező",
        defaultValue: "",
        description: "Kösd a Kategória CMS mezőt ide.",
    },
    description: {
        type: ControlType.String,
        title: "Rövid leírás",
        displayTextArea: true,
        defaultValue:
            "Wirksame Verfahren mit sichtbaren, langanhaltenden Resultaten.",
    },
    treatmentCount: {
        type: ControlType.Number,
        title: "Kezelés darabszám",
        defaultValue: 10,
        min: 0,
    },
    countLabel: {
        type: ControlType.String,
        title: "'Behandlungen' felirat",
        defaultValue: "Behandlungen",
    },
    photo: {
        type: ControlType.ResponsiveImage,
        title: "Fejezet fotó",
    },
    imagePosition: {
        type: ControlType.Enum,
        title: "Fotó pozíció",
        options: ["left", "right"],
        optionTitles: ["Bal oldalon", "Jobb oldalon"],
        defaultValue: "left",
    },
    creamColor: {
        type: ControlType.Color,
        title: "[Szín] Krém",
        defaultValue: "#F7ECDF",
    },
    inkColor: {
        type: ControlType.Color,
        title: "[Szín] Cím (ink)",
        defaultValue: "#2E211D",
    },
    mauveColor: {
        type: ControlType.Color,
        title: "[Szín] Accent (mályva)",
        defaultValue: "#A6807C",
    },
    mutedColor: {
        type: ControlType.Color,
        title: "[Szín] Leírás (halvány)",
        defaultValue: "#7A7369",
    },
    brassColor: {
        type: ControlType.Color,
        title: "[Szín] Sárgaréz vonal",
        defaultValue: "#C8A165",
    },
})
