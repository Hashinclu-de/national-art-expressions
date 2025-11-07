"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  leftElement,
  rightElement,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} leftElement={leftElement} rightElement={rightElement} />
      <FloatingDockMobile items={items} className={mobileClassName} leftElement={leftElement} rightElement={rightElement} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  leftElement,
  rightElement,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}) => {
  return (
    <div className={cn("relative flex lg:hidden items-center gap-1.5 bg-primary-mid/80 backdrop-blur-xl rounded-2xl px-2 py-2 shadow-2xl border border-primary-light/40", className)}>
      {leftElement && <div className="shrink-0">{leftElement}</div>}

      {/* Icon-only navigation for mobile */}
      <div className="flex items-center gap-1 bg-primary-dark/40 rounded-xl px-1.5 py-1 flex-1 justify-center">
        {items.map((item) => (
          <Link key={item.title} href={item.href}>
            <button
              className="p-2 rounded-lg bg-transparent text-white border border-white/30 hover:bg-primary-light hover:text-primary-dark transition-all"
              title={item.title}
            >
              <div className="h-4 w-4">
                {item.icon}
              </div>
            </button>
          </Link>
        ))}
      </div>

      {rightElement && <div className="shrink-0">{rightElement}</div>}
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  leftElement,
  rightElement,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto hidden lg:flex items-center gap-2 rounded-2xl bg-primary-mid/80 backdrop-blur-xl px-3 py-3 shadow-2xl border border-primary-light/40",
        className
      )}
    >
      {leftElement && <div className="mr-1">{leftElement}</div>}

      {/* Grouped category buttons with darker background */}
      <div className="flex items-center gap-2 bg-primary-dark/40 rounded-xl px-2 py-1.5">
        {items.map((item) => (
          <PillButton key={item.title} {...item} />
        ))}
      </div>

      {rightElement && <div className="ml-1">{rightElement}</div>}
    </div>
  );
};

function PillButton({
  title,
  icon,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href}>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "px-6 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 border",
          hovered
            ? "bg-primary-light text-primary-dark border-primary-light"
            : "bg-transparent text-white border-white/30"
        )}
      >
        {title}
      </button>
    </Link>
  );
}
