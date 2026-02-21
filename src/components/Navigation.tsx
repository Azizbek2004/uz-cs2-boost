"use client";

import React from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoHomeOutline,
  IoHome,
  IoSpeedometerOutline,
  IoSpeedometer,
  IoPulseOutline,
  IoPulse,
  IoGameControllerOutline,
  IoGameController,
  IoPeopleOutline,
  IoPeople,
  IoSchoolOutline,
  IoSchool,
  IoPersonOutline,
  IoPerson,
  IoVolumeHighOutline,
  IoVolumeMuteOutline,
  IoLogOutOutline,
  IoLanguageOutline,
  IoMedalOutline,
  IoWalletOutline,
  IoShieldCheckmarkOutline,
  IoLaptopOutline,
  IoColorPaletteOutline,
  IoColorPalette,
} from "react-icons/io5";
import { useAudio } from "./AudioProvider";
import { useAuth } from "./AuthProvider";

const navItems = [
  {
    href: "/dashboard",
    labelKey: "dashboard",
    icon: IoHomeOutline,
    activeIcon: IoHome,
  },
  {
    href: "/advanced-diagnostics",
    labelKey: "advancedDiagnostics",
    icon: IoSpeedometerOutline,
    activeIcon: IoSpeedometer,
  },
  {
    href: "/jitter-diagnostic",
    labelKey: "jitter",
    icon: IoPulseOutline,
    activeIcon: IoPulse,
  },
  {
    href: "/training",
    labelKey: "training",
    icon: IoGameControllerOutline,
    activeIcon: IoGameController,
  },
  {
    href: "/skins",
    labelKey: "skins",
    icon: IoColorPaletteOutline,
    activeIcon: IoColorPalette,
  },
  {
    href: "/community",
    labelKey: "community",
    icon: IoPeopleOutline,
    activeIcon: IoPeople,
  },
  {
    href: "/academy",
    labelKey: "academy",
    icon: IoSchoolOutline,
    activeIcon: IoSchool,
  },
  {
    href: "/profile",
    labelKey: "profile",
    icon: IoPersonOutline,
    activeIcon: IoPerson,
  },
];

const partnerNavItems = [
  {
    href: "/partner/dashboard",
    labelKey: "partnerPortal",
    icon: IoShieldCheckmarkOutline,
  },
  {
    href: "/partner/onboarding",
    labelKey: "certification",
    icon: IoLaptopOutline,
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const { isEnabled, toggle, playClick } = useAudio();
  const { user, logout } = useAuth();

  const handleNavClick = () => {
    playClick();
  };

  const changeLanguage = (newLocale: string) => {
    playClick();
    router.replace(pathname, { locale: newLocale });
  };

  if (!user) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="nav-sidebar hidden lg:flex">
        {/* Logo */}
        <div style={{ padding: "0 24px", marginBottom: "32px" }}>
          <Link
            href="/dashboard"
            onClick={handleNavClick}
            style={{ textDecoration: "none" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #ff6b00, #cc5500)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "800",
                  fontSize: "16px",
                  color: "white",
                }}
              >
                UZ
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "16px",
                    color: "white",
                  }}
                >
                  UZ CS2 Boost
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#888",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Competitive Edge
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Gamification Stats */}
        <div style={{ padding: "0 24px", marginBottom: "24px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "8px",
              padding: "12px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <IoMedalOutline size={16} color="#ff6b00" />
              <div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "#888",
                    textTransform: "uppercase",
                  }}
                >
                  Rank
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  {user.rank || "Novice"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <IoWalletOutline size={16} color="#00c853" />
              <div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "#888",
                    textTransform: "uppercase",
                  }}
                >
                  UZS
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#00c853",
                  }}
                >
                  {user.uzsBalance || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = isActive ? item.activeIcon : item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{t(item.labelKey)}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    style={{
                      position: "absolute",
                      right: "12px",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#ff6b00",
                    }}
                  />
                )}
              </Link>
            );
          })}

          <div
            style={{
              marginTop: "24px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                padding: "0 24px",
                fontSize: "11px",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "12px",
              }}
            >
              B2B Center
            </div>
            {partnerNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  style={{ color: isActive ? "#00c853" : "#aaa" }}
                >
                  <Icon size={20} />
                  <span>{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Controls */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #333",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {/* Language Switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 0",
              color: "#aaa",
              fontSize: "14px",
            }}
          >
            <IoLanguageOutline size={20} />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => changeLanguage("en")}
                style={{
                  background: "none",
                  border: "none",
                  color: locale === "en" ? "#ff6b00" : "#888",
                  cursor: "pointer",
                  fontWeight: locale === "en" ? "700" : "400",
                }}
              >
                EN
              </button>
              <span style={{ color: "#333" }}>|</span>
              <button
                onClick={() => changeLanguage("ru")}
                style={{
                  background: "none",
                  border: "none",
                  color: locale === "ru" ? "#ff6b00" : "#888",
                  cursor: "pointer",
                  fontWeight: locale === "ru" ? "700" : "400",
                }}
              >
                RU
              </button>
              <span style={{ color: "#333" }}>|</span>
              <button
                onClick={() => changeLanguage("uz")}
                style={{
                  background: "none",
                  border: "none",
                  color: locale === "uz" ? "#ff6b00" : "#888",
                  cursor: "pointer",
                  fontWeight: locale === "uz" ? "700" : "400",
                }}
              >
                UZ
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              toggle();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 0",
              background: "none",
              border: "none",
              color: "#aaa",
              cursor: "pointer",
              fontSize: "14px",
              width: "100%",
            }}
          >
            {isEnabled ? (
              <IoVolumeHighOutline size={20} />
            ) : (
              <IoVolumeMuteOutline size={20} />
            )}
            <span>{isEnabled ? "Sound On" : "Sound Off"}</span>
          </button>
          <button
            onClick={() => {
              playClick();
              logout();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 0",
              background: "none",
              border: "none",
              color: "#aaa",
              cursor: "pointer",
              fontSize: "14px",
              width: "100%",
            }}
          >
            <IoLogOutOutline size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="nav-bottom lg:hidden">
        <AnimatePresence>
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            const Icon = isActive ? item.activeIcon : item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`nav-bottom-item ${isActive ? "active" : ""}`}
              >
                <motion.div whileTap={{ scale: 0.85 }}>
                  <Icon size={22} />
                </motion.div>
                <span style={{ fontSize: "10px" }}>{t(item.labelKey)}</span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    style={{
                      position: "absolute",
                      top: "0",
                      width: "24px",
                      height: "2px",
                      borderRadius: "1px",
                      background: "#ff6b00",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </AnimatePresence>
      </nav>
    </>
  );
}
