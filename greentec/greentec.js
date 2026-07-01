/* ============================================================
   GREENTEC — Global Site Script
   Handles: sticky navbar shadow, mobile hamburger menu, mobile
   accordion sub-menus, click/tap/keyboard-accessible desktop
   dropdowns, smooth in-page scrolling (works across pages too),
   scroll-reveal animations, and closing menus on outside click.
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");

  /* ---------- 1. Mobile hamburger toggle ---------- */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the mobile menu whenever a real (non-toggle) link is clicked
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
      });
    });
  }

  /* ---------- 2. Mobile accordion sub-menus (Product / Services) ---------- */
  const subToggles = mobileMenu
    ? mobileMenu.querySelectorAll(".mobile-sub-toggle")
    : [];
  subToggles.forEach((toggle) => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const parent = toggle.closest(".mobile-has-sub");
      const isOpen = parent.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      // Close any other open accordion group for a tidy single-open menu
      subToggles.forEach((otherToggle) => {
        const otherParent = otherToggle.closest(".mobile-has-sub");
        if (otherParent !== parent) {
          otherParent.classList.remove("open");
          otherToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  });

  /* ---------- 3. Desktop dropdown menus: click / tap / keyboard ---------- */
  const dropdownParents = Array.from(
    document.querySelectorAll(".nav-menu > li")
  ).filter((li) => li.querySelector(":scope > .dropdown-menu"));

  dropdownParents.forEach((li) => {
    const trigger = li.querySelector(":scope > a");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      // If the device can't hover (touch/tablet), the first tap should
      // reveal the options instead of immediately following the link.
      const canHover = window.matchMedia("(hover: hover)").matches;
      if (canHover) return;

      if (!li.classList.contains("dropdown-open")) {
        e.preventDefault();
        dropdownParents.forEach((other) => other.classList.remove("dropdown-open"));
        li.classList.add("dropdown-open");
      }
      // Second tap on an already-open trigger follows the link as normal.
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-menu > li")) {
      dropdownParents.forEach((li) => li.classList.remove("dropdown-open"));
    }
  });

  /* ---------- 4. Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      let url;
      try {
        url = new URL(this.getAttribute("href"), window.location.href);
      } catch (err) {
        return;
      }
      const currentPath = window.location.pathname.split("/").pop() || "index.html";
      const linkPath = url.pathname.split("/").pop() || "index.html";
      const isSamePage = linkPath === currentPath;

      if (!isSamePage || !url.hash) return;

      const target = document.querySelector(url.hash);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
        window.scrollTo({ top, behavior: "smooth" });
        hamburger?.classList.remove("open");
        mobileMenu?.classList.remove("open");
      }
    });
  });

  /* ---------- 5. Navbar shadow / shade on scroll ---------- */
  if (navbar) {
    const setScrolled = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 10);
    };
    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });
  }

  /* ---------- 6. Scroll-reveal animations ---------- */
  const revealSelectors = [
    ".who-card",
    ".about-card",
    ".project-grid .grid-item",
    ".product-card",
    ".partner-container",
    ".contact-detail",
    ".form-card",
    ".about-stats",
    ".section-header",
  ];
  const revealEls = document.querySelectorAll(revealSelectors.join(","));

  if ("IntersectionObserver" in window && revealEls.length) {
    revealEls.forEach((el) => el.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }
});
