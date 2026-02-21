"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import VideoBackground from "@/components/VideoBackground";
import { IoSearchOutline, IoFilterOutline } from "react-icons/io5";

// Mock data for minimal catalog
const skins = [
    { id: 1, name: "AWP | Dragon Lore", wear: "Factory New", price: "uzs 114,000,000", image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4SZlvD7PYTdn2xZ_Ish0u3N9N-ki1LlqUM6azvwJdKVdQI5YF2HqAa9webng5S5vJzOziQxvnF3t33fmBexhgYMMLKeouM3/360fx360f", category: "Sniper", rarity: "Covert" },
    { id: 2, name: "AK-47 | Fire Serpent", wear: "Minimal Wear", price: "uzs 18,500,000", image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV092lnYmGmOHLMv_BmlVW___1hZrzjQaw8xU4ZTv2LtOTc1c2NA2FrVa-ybjph5-5vZrIwCNivSFwsSvcgVXp1u1yqA/360fx360f", category: "Rifle", rarity: "Covert" },
    { id: 3, name: "M4A4 | Howl", wear: "Factory New", price: "uzs 62,000,000", image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09Kzm7-FmP7mDLbUkmJE5Ytz3-3E89ukilDjqEBoZmGlLI-QJAFrYU-F-lm4xLvm0ce1u5WcmyFk7CUnsH_YyRTjgEpJbOE_1vK120k/360fx360f", category: "Rifle", rarity: "Contraband" },
    { id: 4, name: "Karambit | Doppler (Phase 2)", wear: "Factory New", price: "uzs 28,000,000", image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfy_rnZGFH6Z22mY6VmfPLM7_ClThVvccp2rzCoI2nijg0I0h5ZmGido-TcwRqYFHR_FHtyLu60JTu7Zmf1zI97ZfTcw7H_g/360fx360f", category: "Knife", rarity: "Covert" },
    { id: 5, name: "Butterfly Knife | Fade", wear: "Factory New", price: "uzs 45,000,000", image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1OrYYiRx59G_k4-EkefOML_UlmJW4NFOh-zF_Jn4xhqxqUM_NWD2IY_GJlVvYQrXrlntwbq51MLoo5WcmHMyvz5iuygeP1o9EQ/360fx360f", category: "Knife", rarity: "Covert" },
    { id: 6, name: "Glock-18 | Fade", wear: "Factory New", price: "uzs 15,200,000", image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAFlwP7OTThA-9mwmI-FmvD4O_vAkm9u4cBi37mSod-h31GxqkA-Yz_xcNKddVE_NQ6GqFfvxrrpg8W8vJnOzCdhumVztywP-A/360fx360f", category: "Pistol", rarity: "Classified" },
    { id: 7, name: "USP-S | Printstream", wear: "Field-Tested", price: "uzs 850,000", image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j3KqnWklTjP4TAxA3t8l_niUFgZ2vyIdTBIA5uMgzTqVDtxuu90JPtuMjIyyRnuidwtijV-ERq_A/360fx360f", category: "Pistol", rarity: "Covert" },
    { id: 8, name: "Desert Eagle | Blaze", wear: "Factory New", price: "uzs 9,100,000", image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtalP_tRTFw5t24n4mZl_jlJ7TZn25W18l4jeHVu9n3jgfk_kc6MW_wI4DHcgM4MgaCqAS9kr29jZ-6u5nAmnV9-n51d8_Pmw/360fx360f", category: "Pistol", rarity: "Classified" },
    { id: 9, name: "M4A1-S | Printstream", wear: "Minimal Wear", price: "uzs 3,400,000", image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITfn2xZ_Isp0rnEt9qqjiuwsRQ-MDvzcoOScVJrM1HXrVS8k-_pjMSpocidyCdjuCZ2tnDbyUM-/360fx360f", category: "Rifle", rarity: "Covert" },
];

const categories = ["All", "Rifle", "Sniper", "Pistol", "Knife", "Glove"];

export default function SkinsCatalogPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSkins = skins.filter(skin => {
        const matchesCategory = activeCategory === "All" || skin.category === activeCategory;
        const matchesSearch = skin.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <VideoBackground opacity={0.05}>
            <div className="page-container">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: "32px", textAlign: "center" }}
                >
                    <h1
                        style={{
                            fontSize: "clamp(28px, 5vw, 42px)",
                            fontWeight: "900",
                            fontFamily: "Orbitron, Inter, sans-serif",
                            marginBottom: "8px",
                        }}
                    >
                        CS2 <span className="gradient-text-blue">SKINS CATALOG</span>
                    </h1>
                    <p style={{ color: "#888", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
                        Browse a curated selection of premium CS2 finishes. Compare market prices and rarity instantly.
                    </p>
                </motion.div>

                {/* Filters and Search */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "32px", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", flex: 1 }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`btn-ghost ${activeCategory === cat ? 'active' : ''}`}
                                style={{
                                    padding: "8px 16px",
                                    fontSize: "13px",
                                    background: activeCategory === cat ? "rgba(0, 123, 255, 0.15)" : "rgba(255, 255, 255, 0.03)",
                                    color: activeCategory === cat ? "#007bff" : "#888",
                                    border: activeCategory === cat ? "1px solid rgba(0, 123, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.05)",
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
                        <IoSearchOutline style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
                        <input
                            type="text"
                            placeholder="Search skins..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field"
                            style={{ paddingLeft: "36px", margin: 0 }}
                        />
                    </div>
                </div>

                {/* Grid Layout */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
                    {filteredSkins.map((skin, i) => (
                        <motion.div
                            key={skin.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}
                            className="hud-frame"
                            style={{
                                padding: "0",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                background: "linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)",
                                borderTop: skin.rarity === "Covert" ? "2px solid #eb4b4b"
                                    : skin.rarity === "Contraband" ? "2px solid #e4ae39"
                                        : skin.rarity === "Classified" ? "2px solid #d32ce6"
                                            : "1px solid rgba(255,255,255,0.1)"
                            }}
                        >
                            <div style={{ height: "180px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)" }}>
                                <img src={skin.image} alt={skin.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.5))" }} />
                            </div>

                            <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "white", marginBottom: "4px" }}>
                                    {skin.name}
                                </h3>
                                <div style={{ fontSize: "13px", color: "#888", marginBottom: "12px" }}>
                                    {skin.wear}
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ fontSize: "16px", fontWeight: "800", color: "#00c853" }}>
                                        {skin.price}
                                    </div>
                                    <div style={{ fontSize: "11px", padding: "4px 8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", color: "#ccc" }}>
                                        {skin.rarity}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {filteredSkins.length === 0 && (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0", color: "#888", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "8px" }}>
                            <IoFilterOutline size={48} style={{ opacity: 0.2, marginBottom: "16px" }} />
                            <p>No skins found matching "{searchQuery}" in {activeCategory}.</p>
                        </div>
                    )}
                </div>
            </div>
        </VideoBackground>
    );
}
