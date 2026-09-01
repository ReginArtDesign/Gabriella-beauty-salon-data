// ============ CategoryChapterHeader.tsx (TELJES — DEDUP LOGIKA VISSZAÁLLÍTVA) ============
import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, AnimatePresence } from "framer-motion"

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

function useGlobalFilter() {
    const [state, setState] = useState({
        search: "",
        category: "alle",
        goal: "alle",
        priceRange: "alle",
    })
    useEffect(() => {
        const win = window as any
        if (win.__iplFilterState) {
            setState({
                search: win.__iplFilterState.search || "",
                category: win.__iplFilterState.category || "alle",
                goal: win.__iplFilterState.goal || "alle",
                priceRange: win.__iplFilterState.priceRange || "alle",
            })
        }
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail || {}
            setState({
                search: detail.search || "",
                category: detail.category || "alle",
                goal: detail.goal || "alle",
                priceRange: detail.priceRange || "alle",
            })
        }
        window.addEventListener("ipl-filter", handler)
        return () => window.removeEventListener("ipl-filter", handler)
    }, [])
    return state
}

// ─── STRUKTURÁLIS "ELSŐ VAGYOK-E A KATEGÓRIÁMBAN" DETEKTÁLÁS ───────────────
// FONTOS: ez NEM offsetParent/láthatóság alapú (az korábban önmagát
// blokkoló körhöz vezetett — lásd korábbi tanulság), hanem NYERS
// DOM-sorrend alapú, ami mindig stabil, függetlenül a szűréstől.
// Minden fejléc-példány mindig jelen van a DOM-ban (akár rejtve is),
// ezért a sorrend fix marad — csak azt kell eldönteni, MELYIK a saját
// kategóriájának első strukturális előfordulása.
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
        observer.observe(document.body, { childList: true, subtree: true })
        return () => {
            clearTimeout(t)
            observer.disconnect()
        }
    }, [category])

    return { ref, isFirst }
}

// ─── VAN-E LÁTHATÓ KEZELÉS EBBEN A KATEGÓRIÁBAN (aktuális szűrés mellett) ──
// A TreatmentRowPremium SAJÁT "[data-ipl-cat]" attribútumát figyeli —
// ugyanazt, amit a kártya-komponens már amúgy is kirak magára. Nincs
// szükség külön Wrapper-attribútumra, egy forrásból dolgozunk.
function useCategoryHasVisibleTreatments(category: string, filterState: any) {
    const [hasVisible, setHasVisible] = useState(true)

    useEffect(() => {
        const isFiltering =
            filterState.search.trim() !== "" ||
            filterState.category !== "alle" ||
            filterState.goal !== "alle" ||
            filterState.priceRange !== "alle"

        if (!isFiltering) {
            setHasVisible(true)
            return
        }

        const checkVisibility = () => {
            const safeCategory = category ? category.replace(/"/g, '\\"') : ""
            const items = document.querySelectorAll<HTMLElement>(
                `[data-ipl-cat="${safeCategory}"]`
            )
            if (items.length === 0) {
                setHasVisible(false)
                return
            }
            let found = false
            items.forEach((item) => {
                if (window.getComputedStyle(item).display !== "none") {
                    found = true
                }
            })
            setHasVisible(found)
        }

        const t1 = setTimeout(checkVisibility, 50)
        const t2 = setTimeout(checkVisibility, 220)
        const observer = new MutationObserver(() => {
            setTimeout(checkVisibility, 50)
        })
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["style"],
        })

        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
            observer.disconnect()
        }
    }, [filterState, category])

    return hasVisible
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

    fontHeading?: string
    fontBody?: string

    sectionMarginTopMobile?: number
    sectionMarginBottomMobile?: number
    sectionMarginTopDesktop?: number
    sectionMarginBottomDesktop?: number
    gridGapMobile?: number
    gridGapDesktop?: number

    eyebrowFontSize?: number
    eyebrowFontWeight?: number
    eyebrowLetterSpacing?: number
    eyebrowGap?: number
    brassLineWidth?: number
    brassLineHeight?: number

    titleFontWeight?: number
    titleLetterSpacing?: number
    titleLineHeight?: number
    titleMarginBottom?: number
    titleFontSizeMinMobile?: number
    titleFontSizeMaxMobile?: number
    titleFontSizeMinDesktop?: number
    titleFontSizeMaxDesktop?: number
    accentFirstWordOnly?: boolean
    accentWordColor?: string

    descriptionFontWeight?: number
    descriptionLineHeight?: number
    descriptionMaxWidthCh?: number
    descriptionFontSizeMobile?: number
    descriptionFontSizeDesktop?: number

    imageBorderRadius?: number
    imageBorderColor?: string
    imageAspectRatioMobile?: string
    imageAspectRatioDesktop?: string
    imageWidthDesktop?: number
    gradientOverlayOpacity?: number
    kenBurnsDurationSeconds?: number
    kenBurnsMaxScale?: number

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
    inkColor = "#3A3028",
    mauveColor = "#A6807C",
    mutedColor = "#7A7369",
    brassColor = "#C8A165",

    fontHeading = "'Montserrat', sans-serif",
    fontBody = "'Inter', sans-serif",

    sectionMarginTopMobile = 56,
    sectionMarginBottomMobile = 56,
    sectionMarginTopDesktop = 72,
    sectionMarginBottomDesktop = 40,
    gridGapMobile = 24,
    gridGapDesktop = 44,

    eyebrowFontSize = 11,
    eyebrowFontWeight = 500,
    eyebrowLetterSpacing = 2.4,
    eyebrowGap = 10,
    brassLineWidth = 18,
    brassLineHeight = 2,

    titleFontWeight = 400,
    titleLetterSpacing = -0.32,
    titleLineHeight = 1.15,
    titleMarginBottom = 14,
    titleFontSizeMinMobile = 28,
    titleFontSizeMaxMobile = 38,
    titleFontSizeMinDesktop = 34,
    titleFontSizeMaxDesktop = 48,
    accentFirstWordOnly = true,
    accentWordColor = "#A6807C",

    descriptionFontWeight = 300,
    descriptionLineHeight = 1.6,
    descriptionMaxWidthCh = 65,
    descriptionFontSizeMobile = 15,
    descriptionFontSizeDesktop = 16,

    imageBorderRadius = 12,
    imageBorderColor = "rgba(166,128,124,0.16)",
    imageAspectRatioMobile = "16 / 9",
    imageAspectRatioDesktop = "4 / 3.2",
    imageWidthDesktop = 42,
    gradientOverlayOpacity = 0.18,
    kenBurnsDurationSeconds = 14,
    kenBurnsMaxScale = 1.07,

    style,
}: CategoryChapterHeaderProps) {
    const isMobile = useMediaQuery("(max-width: 860px)")
    const reducedMotion = usePrefersReducedMotion()

    const filterState = useGlobalFilter()
    const photoSrc = resolveSrc(photo)

    const { ref: chapterRef, isFirst } = useIsFirstChapterInCategory(category)
    const hasVisibleTreatments = useCategoryHasVisibleTreatments(
        category,
        filterState
    )

    const isSearchActive =
        filterState.search.trim() !== "" ||
        filterState.category !== "alle" ||
        filterState.goal !== "alle" ||
        filterState.priceRange !== "alle"

    const isCategoryMismatch =
        filterState.category !== "alle" &&
        filterState.category.toLowerCase() !== (category || "").toLowerCase()

    // A fejléc CSAK akkor jelenik meg, ha 1) ő a strukturális első a
    // saját kategóriájában, 2) nincs kategória-szűrő ütközés, és
    // 3) van legalább egy látható kezelés a kategóriájában az aktuális
    // szűréssel.
    const shouldRender = isFirst && !isCategoryMismatch && hasVisibleTreatments

    if (!shouldRender) {
        return (
            <div
                ref={chapterRef}
                data-chapter-cat={category || undefined}
                style={{ display: "none" }}
            />
        )
    }

    const showLeft = !isMobile && imagePosition === "left"

    const renderTitle = () => {
        if (!accentFirstWordOnly || !category) return category
        const words = category.trim().split(" ")
        const [first, ...rest] = words
        return (
            <>
                <span style={{ color: accentWordColor }}>{first}</span>
                {rest.length > 0 ? " " + rest.join(" ") : ""}
            </>
        )
    }

    return (
        <motion.div
            layout
            ref={chapterRef}
            data-chapter-cat={category || undefined}
            style={{
                width: "100%",
                fontFamily: fontBody,
                margin: isMobile
                    ? `${sectionMarginTopMobile}px 0 ${sectionMarginBottomMobile}px 0`
                    : `${sectionMarginTopDesktop}px 0 ${sectionMarginBottomDesktop}px 0`,
                ...style,
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Montserrat:wght@300;400;500;600&display=swap');
                .cch-grid {
                    display: flex;
                    flex-direction: ${
                        isMobile ? "column" : showLeft ? "row-reverse" : "row"
                    };
                    align-items: stretch;
                    gap: ${isMobile ? gridGapMobile : gridGapDesktop}px;
                }
                @keyframes cch-kenburns {
                    from { transform: scale(1); }
                    to { transform: scale(${kenBurnsMaxScale}); }
                }
            `}</style>

            <AnimatePresence mode="wait">
                {!isSearchActive ? (
                    <motion.div
                        key="large-header"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="cch-grid"
                    >
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
                                    gap: eyebrowGap,
                                    marginBottom: 14,
                                }}
                            >
                                <span
                                    style={{
                                        width: brassLineWidth,
                                        height: brassLineHeight,
                                        backgroundColor: brassColor,
                                        borderRadius: 99,
                                    }}
                                />
                                <span
                                    style={{
                                        fontFamily: fontHeading,
                                        fontSize: eyebrowFontSize,
                                        fontWeight: eyebrowFontWeight,
                                        letterSpacing: `${eyebrowLetterSpacing}px`,
                                        textTransform: "uppercase",
                                        color: mauveColor,
                                    }}
                                >
                                    {treatmentCount} {countLabel}
                                </span>
                            </div>

                            <h2
                                style={{
                                    margin: `0 0 ${titleMarginBottom}px 0`,
                                    fontFamily: fontHeading,
                                    fontWeight: titleFontWeight,
                                    fontSize: isMobile
                                        ? `clamp(${titleFontSizeMinMobile}px, 8vw, ${titleFontSizeMaxMobile}px)`
                                        : `clamp(${titleFontSizeMinDesktop}px, 3.4vw, ${titleFontSizeMaxDesktop}px)`,
                                    lineHeight: titleLineHeight,
                                    letterSpacing: `${titleLetterSpacing}px`,
                                    color: inkColor,
                                }}
                            >
                                {renderTitle()}
                            </h2>

                            <p
                                style={{
                                    margin: 0,
                                    maxWidth: `${descriptionMaxWidthCh}ch`,
                                    fontFamily: fontBody,
                                    fontWeight: descriptionFontWeight,
                                    fontSize: isMobile
                                        ? descriptionFontSizeMobile
                                        : descriptionFontSizeDesktop,
                                    lineHeight: descriptionLineHeight,
                                    color: mutedColor,
                                }}
                            >
                                {description}
                            </p>
                        </div>

                        {!isMobile && photoSrc && (
                            <div
                                style={{
                                    flex: `0 0 ${imageWidthDesktop}%`,
                                    width: "100%",
                                    aspectRatio: imageAspectRatioDesktop,
                                    borderRadius: imageBorderRadius,
                                    overflow: "hidden",
                                    position: "relative",
                                    border: `1px solid ${imageBorderColor}`,
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
                                            : `cch-kenburns ${kenBurnsDurationSeconds}s ease-in-out infinite alternate`,
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: `linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(58,48,40,${gradientOverlayOpacity}) 100%)`,
                                        pointerEvents: "none",
                                    }}
                                />
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="small-header"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            padding: "1rem 0",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
                                fontWeight: 400,
                                letterSpacing: "0.04em",
                                color: mauveColor,
                                textTransform: "uppercase",
                            }}
                        >
                            {category}
                        </span>
                        <div
                            style={{
                                flex: 1,
                                height: "1px",
                                background: `linear-gradient(to right, ${mauveColor}40, transparent)`,
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

addPropertyControls(CategoryChapterHeader, {
    category: {
        type: ControlType.String,
        title: "[Kategória] CMS mező",
        defaultValue: "",
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
        description:
            "Csak desktopon jelenik meg — mobilon a fejléc kép nélkül, csak szöveggel renderelődik.",
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
        defaultValue: "#3A3028",
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
    fontHeading: {
        type: ControlType.String,
        title: "[Betűtípus] Cím/eyebrow",
        defaultValue: "'Montserrat', sans-serif",
    },
    fontBody: {
        type: ControlType.String,
        title: "[Betűtípus] Törzsszöveg",
        defaultValue: "'Inter', sans-serif",
    },
    sectionMarginTopMobile: {
        type: ControlType.Number,
        title: "[Térköz] Szekció fent (mobil, px)",
        defaultValue: 56,
        min: 0,
        max: 200,
    },
    sectionMarginBottomMobile: {
        type: ControlType.Number,
        title: "[Térköz] Szekció lent (mobil, px)",
        defaultValue: 56,
        min: 0,
        max: 200,
    },
    sectionMarginTopDesktop: {
        type: ControlType.Number,
        title: "[Térköz] Szekció fent (desktop, px)",
        defaultValue: 72,
        min: 0,
        max: 240,
    },
    sectionMarginBottomDesktop: {
        type: ControlType.Number,
        title: "[Térköz] Szekció lent (desktop, px)",
        defaultValue: 40,
        min: 0,
        max: 240,
    },
    gridGapMobile: {
        type: ControlType.Number,
        title: "[Térköz] Kép-szöveg rés (mobil, px)",
        defaultValue: 24,
        min: 0,
        max: 100,
    },
    gridGapDesktop: {
        type: ControlType.Number,
        title: "[Térköz] Kép-szöveg rés (desktop, px)",
        defaultValue: 44,
        min: 0,
        max: 120,
    },
    eyebrowFontSize: {
        type: ControlType.Number,
        title: "[Eyebrow] Betűméret",
        defaultValue: 11,
        min: 8,
        max: 20,
    },
    eyebrowFontWeight: {
        type: ControlType.Number,
        title: "[Eyebrow] Vastagság",
        defaultValue: 500,
        min: 300,
        max: 800,
        step: 100,
    },
    eyebrowLetterSpacing: {
        type: ControlType.Number,
        title: "[Eyebrow] Betűköz (px)",
        defaultValue: 2.4,
        min: 0,
        max: 8,
        step: 0.1,
    },
    eyebrowGap: {
        type: ControlType.Number,
        title: "[Eyebrow] Vonal-szöveg rés",
        defaultValue: 10,
        min: 0,
        max: 30,
    },
    brassLineWidth: {
        type: ControlType.Number,
        title: "[Eyebrow] Sárgaréz vonal szélesség",
        defaultValue: 18,
        min: 0,
        max: 60,
    },
    brassLineHeight: {
        type: ControlType.Number,
        title: "[Eyebrow] Sárgaréz vonal vastagság",
        defaultValue: 2,
        min: 1,
        max: 8,
    },
    titleFontWeight: {
        type: ControlType.Number,
        title: "[Cím] Vastagság",
        defaultValue: 400,
        min: 200,
        max: 800,
        step: 100,
    },
    titleLetterSpacing: {
        type: ControlType.Number,
        title: "[Cím] Betűköz (px)",
        defaultValue: -0.32,
        min: -3,
        max: 3,
        step: 0.02,
    },
    titleLineHeight: {
        type: ControlType.Number,
        title: "[Cím] Sortávolság",
        defaultValue: 1.15,
        min: 0.9,
        max: 1.6,
        step: 0.01,
    },
    titleMarginBottom: {
        type: ControlType.Number,
        title: "[Cím] Alsó térköz",
        defaultValue: 14,
        min: 0,
        max: 60,
    },
    titleFontSizeMinMobile: {
        type: ControlType.Number,
        title: "[Cím] Min. méret (mobil)",
        defaultValue: 28,
        min: 16,
        max: 60,
    },
    titleFontSizeMaxMobile: {
        type: ControlType.Number,
        title: "[Cím] Max. méret (mobil)",
        defaultValue: 38,
        min: 20,
        max: 80,
    },
    titleFontSizeMinDesktop: {
        type: ControlType.Number,
        title: "[Cím] Min. méret (desktop)",
        defaultValue: 34,
        min: 20,
        max: 80,
    },
    titleFontSizeMaxDesktop: {
        type: ControlType.Number,
        title: "[Cím] Max. méret (desktop)",
        defaultValue: 48,
        min: 24,
        max: 100,
    },
    accentFirstWordOnly: {
        type: ControlType.Boolean,
        title: "[Cím] Első szó külön szín",
        defaultValue: true,
    },
    accentWordColor: {
        type: ControlType.Color,
        title: "[Cím] Első szó színe",
        defaultValue: "#A6807C",
    },
    descriptionFontWeight: {
        type: ControlType.Number,
        title: "[Leírás] Vastagság",
        defaultValue: 300,
        min: 200,
        max: 700,
        step: 100,
    },
    descriptionLineHeight: {
        type: ControlType.Number,
        title: "[Leírás] Sortávolság",
        defaultValue: 1.6,
        min: 1.2,
        max: 2.2,
        step: 0.05,
    },
    descriptionMaxWidthCh: {
        type: ControlType.Number,
        title: "[Leírás] Max. szélesség (ch)",
        defaultValue: 65,
        min: 20,
        max: 120,
    },
    descriptionFontSizeMobile: {
        type: ControlType.Number,
        title: "[Leírás] Betűméret (mobil)",
        defaultValue: 15,
        min: 11,
        max: 24,
    },
    descriptionFontSizeDesktop: {
        type: ControlType.Number,
        title: "[Leírás] Betűméret (desktop)",
        defaultValue: 16,
        min: 12,
        max: 26,
    },
    imageBorderRadius: {
        type: ControlType.Number,
        title: "[Fotó] Lekerekítés",
        defaultValue: 12,
        min: 0,
        max: 60,
    },
    imageBorderColor: {
        type: ControlType.Color,
        title: "[Fotó] Keret szín",
        defaultValue: "rgba(166,128,124,0.16)",
    },
    imageAspectRatioMobile: {
        type: ControlType.String,
        title: "[Fotó] Képarány (mobil) — jelenleg nem használt, a kép mobilon rejtve",
        defaultValue: "16 / 9",
    },
    imageAspectRatioDesktop: {
        type: ControlType.String,
        title: "[Fotó] Képarány (desktop)",
        defaultValue: "4 / 3.2",
    },
    imageWidthDesktop: {
        type: ControlType.Number,
        title: "[Fotó] Szélesség % (desktop)",
        defaultValue: 42,
        min: 20,
        max: 70,
    },
    gradientOverlayOpacity: {
        type: ControlType.Number,
        title: "[Fotó] Sötétítő gradiens",
        defaultValue: 0.18,
        min: 0,
        max: 0.6,
        step: 0.02,
    },
    kenBurnsDurationSeconds: {
        type: ControlType.Number,
        title: "[Animáció] Ken Burns hossza (mp)",
        defaultValue: 14,
        min: 4,
        max: 40,
    },
    kenBurnsMaxScale: {
        type: ControlType.Number,
        title: "[Animáció] Max nagyítás",
        defaultValue: 1.07,
        min: 1,
        max: 1.3,
        step: 0.01,
    },
})
