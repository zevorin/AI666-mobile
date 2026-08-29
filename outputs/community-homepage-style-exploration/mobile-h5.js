(() => {
  const body = document.body;
  const params = new URLSearchParams(window.location.search);
  document.querySelectorAll("[data-mobile-walkthrough-review-only]").forEach((trigger) => {
    trigger.hidden = params.get("review") !== "1";
  });
  body.dataset.mobileClean = params.get("clean") === "1" ? "true" : "false";
  if (body.dataset.mobileClean === "true") document.documentElement.classList.add("mobile-clean-document");

  if (body.dataset.mobilePage === "generation-progress") {
    window.location.replace(`./mobile-create.html${params.toString() ? `?${params.toString()}` : ""}`);
    return;
  }

  const playHomeEntrance = () => {
    if (body.dataset.mobilePage !== "home") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || typeof Element.prototype.animate !== "function") {
      body.dataset.mobileHomeEntrance = "reduced";
      return;
    }

    const animations = [];
    const animateEntrance = (element, keyframes, delay, duration = 560) => {
      if (!element) return;
      const animation = element.animate(keyframes, {
        delay,
        duration,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      });
      animations.push(animation);
    };

    body.dataset.mobileHomeEntrance = "running";

    animateEntrance(
      document.querySelector(".mobile-home-brand"),
      [
        { opacity: 0, transform: "translate3d(0, -8px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      20,
      460,
    );

    animateEntrance(
      document.querySelector(".mobile-banner-carousel"),
      [
        { opacity: 0, transform: "translate3d(0, 12px, 0) scale(0.988)" },
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
      ],
      70,
      620,
    );

    document.querySelectorAll(".mobile-home-shortcuts > a").forEach((entry, index) => {
      animateEntrance(
        entry,
        [
          { opacity: 0, transform: "translate3d(0, 12px, 0) scale(0.97)" },
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
        ],
        170 + (index * 42),
        520,
      );
    });

    animateEntrance(
      document.querySelector(".mobile-home-featured-heading"),
      [
        { opacity: 0, transform: "translate3d(0, 10px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      350,
      520,
    );

    animateEntrance(
      document.querySelector(".mobile-bottom-nav"),
      [
        { opacity: 0, transform: "translate3d(-50%, 8px, 0)" },
        { opacity: 1, transform: "translate3d(-50%, 0, 0)" },
      ],
      120,
      480,
    );

    Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      body.dataset.mobileHomeEntrance = "complete";
    });
  };

  if (body.dataset.mobilePage === "home") {
    window.requestAnimationFrame(() => window.requestAnimationFrame(playHomeEntrance));
  }

  const playCreateEntrance = () => {
    if (body.dataset.mobilePage !== "create") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || typeof Element.prototype.animate !== "function") {
      body.dataset.mobileCreateEntrance = "reduced";
      return;
    }

    const animations = [];
    const animateEntrance = (element, keyframes, delay, duration = 460) => {
      if (!element || element.hidden || element.getClientRects().length === 0) return;
      try {
        const animation = element.animate(keyframes, {
          delay,
          duration,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "backwards",
        });
        animations.push(animation);
      } catch {
        // Progressive enhancement: unsupported animation details must never hide content.
      }
    };

    body.dataset.mobileCreateEntrance = "running";

    document.querySelectorAll(".mobile-create-topbar > *").forEach((element, index) => {
      animateEntrance(
        element,
        [
          { opacity: 0, transform: "translate3d(0, -6px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        20 + index * 50,
        380,
      );
    });

    animateEntrance(
      document.querySelector(".mobile-create-empty-art"),
      [
        { opacity: 0, transform: "translate3d(0, 10px, 0) scale(0.988)" },
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
      ],
      110,
      540,
    );
    animateEntrance(
      document.querySelector(".mobile-create-empty-copy"),
      [
        { opacity: 0, transform: "translate3d(0, 9px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      190,
      460,
    );
    animateEntrance(
      document.querySelector(".mobile-create-source:not([hidden])"),
      [
        { opacity: 0, transform: "translate3d(0, 8px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      150,
      440,
    );
    document.querySelectorAll(".mobile-create-turn").forEach((element, index) => {
      animateEntrance(
        element,
        [
          { opacity: 0, transform: "translate3d(0, 8px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        150 + index * 55,
        440,
      );
    });
    animateEntrance(
      document.querySelector(".mobile-create-composer"),
      [
        { opacity: 0 },
        { opacity: 1 },
      ],
      270,
      500,
    );

    Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      body.dataset.mobileCreateEntrance = "complete";
    });
  };

  const profileCoverVideo = document.querySelector("[data-mobile-profile-cover-video]");
  if (profileCoverVideo) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let coverIsVisible = true;

    const syncProfileCoverPlayback = () => {
      const shouldPlay = !reduceMotion.matches && !document.hidden && coverIsVisible;
      if (!shouldPlay) {
        profileCoverVideo.pause();
        return;
      }

      void profileCoverVideo.play().catch(() => {
        // Keep the Web profile poster visible when autoplay is unavailable.
      });
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => {
        coverIsVisible = entry.isIntersecting;
        syncProfileCoverPlayback();
      }, { threshold: 0.05 });
      observer.observe(profileCoverVideo);
    }

    reduceMotion.addEventListener?.("change", syncProfileCoverPlayback);
    document.addEventListener("visibilitychange", syncProfileCoverPlayback);
    window.addEventListener("pagehide", () => profileCoverVideo.pause());
    window.addEventListener("pageshow", syncProfileCoverPlayback);
    syncProfileCoverPlayback();
  }

  const showToast = (message) => {
    const toast = document.querySelector("[data-mobile-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  };

  const createLaunchers = [...document.querySelectorAll(".mobile-nav-create")];
  let createActionSheet = null;
  const setCreateActionSheet = (open, returnFocus = false, focusFirstOption = false) => {
    if (!createActionSheet) return;
    window.clearTimeout(setCreateActionSheet.focusTimer);
    createActionSheet.classList.toggle("is-open", open);
    createActionSheet.setAttribute("aria-hidden", open ? "false" : "true");
    body.classList.toggle("is-create-menu-open", open);
    createLaunchers.forEach((launcher) => {
      launcher.classList.toggle("is-menu-open", open);
      launcher.setAttribute("aria-expanded", open ? "true" : "false");
      launcher.closest(".mobile-bottom-nav")?.classList.toggle("is-create-menu-open", open);
    });
    if (open && focusFirstOption) {
      setCreateActionSheet.focusTimer = window.setTimeout(() => {
        if (createActionSheet.classList.contains("is-open")) createActionSheet.querySelector(".mobile-create-action-option")?.focus();
      }, 180);
    } else if (returnFocus) {
      createLaunchers[0]?.focus();
    }
  };
  if (createLaunchers.length) {
    createActionSheet = document.createElement("section");
    createActionSheet.id = "mobile-create-action-sheet";
    createActionSheet.className = "mobile-bottom-sheet mobile-create-action-sheet";
    createActionSheet.dataset.mobileCreateActionSheet = "";
    createActionSheet.setAttribute("aria-hidden", "true");
    createActionSheet.innerHTML = `
      <button class="mobile-sheet-backdrop" type="button" data-mobile-create-action-close aria-label="关闭创作方式"></button>
      <div class="mobile-create-action-panel" role="dialog" aria-modal="true" aria-label="选择创作方式">
        <div class="mobile-create-action-list">
          <a class="mobile-create-action-option is-aigc" href="./mobile-create.html">
            <span class="mobile-create-action-art"><img class="mobile-create-action-generated-icon" src="./assets/mobile/action-aigc-flat-v1.png" width="512" height="512" alt=""></span>
            <span class="mobile-create-action-copy"><strong>AIGC 生成</strong><small>把灵感变成作品</small></span>
          </a>
          <a class="mobile-create-action-option is-flash" href="./mobile-compose-flash.html">
            <span class="mobile-create-action-art"><img class="mobile-create-action-generated-icon" src="./assets/mobile/action-flash-flat-v1.png" width="512" height="512" alt=""></span>
            <span class="mobile-create-action-copy"><strong>发布闪念</strong><small>记录此刻的创作想法</small></span>
          </a>
        </div>
      </div>`;
    (document.querySelector(".mobile-shell") || body).append(createActionSheet);
    createLaunchers.forEach((launcher) => {
      launcher.setAttribute("aria-haspopup", "dialog");
      launcher.setAttribute("aria-controls", "mobile-create-action-sheet");
      launcher.setAttribute("aria-expanded", "false");
      launcher.addEventListener("click", (event) => {
        event.preventDefault();
        const opening = !createActionSheet.classList.contains("is-open");
        setCreateActionSheet(opening, false, opening && event.detail === 0);
      });
    });
    createActionSheet.querySelectorAll("[data-mobile-create-action-close]").forEach((button) => button.addEventListener("click", () => setCreateActionSheet(false, true)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && createActionSheet.classList.contains("is-open")) setCreateActionSheet(false, true);
    });
  }

  const bottomNav = document.querySelector(".mobile-bottom-nav");
  if (bottomNav) {
    const navItems = [...bottomNav.querySelectorAll(":scope > .mobile-nav-item")];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let indicatorStaticFrame = 0;

    const getIndicatorPosition = (item) => {
      if (item.offsetParent === bottomNav) return item.offsetLeft + (item.offsetWidth / 2);

      // Fall back for older WebViews that expose a different offset parent.
      const navRect = bottomNav.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      return itemRect.left - navRect.left + (itemRect.width / 2);
    };

    const setIndicatorPosition = (item, animate = true) => {
      if (!item || !item.isConnected) return;
      if (!animate) {
        window.cancelAnimationFrame(indicatorStaticFrame);
        bottomNav.classList.add("is-indicator-static");
        bottomNav.classList.remove("is-indicator-ready");
      }
      bottomNav.style.setProperty("--mobile-nav-indicator-x", `${getIndicatorPosition(item)}px`);
      if (!animate) {
        void bottomNav.offsetWidth;
        bottomNav.classList.add("is-indicator-ready");
        indicatorStaticFrame = window.requestAnimationFrame(() => bottomNav.classList.remove("is-indicator-static"));
      }
    };

    const initialItem = navItems.find((item) => item.classList.contains("is-active"));
    const syncIndicatorToActive = () => {
      setIndicatorPosition(navItems.find((item) => item.classList.contains("is-active")), false);
    };

    const restoreInitialNavState = () => {
      navItems.forEach((navItem) => {
        const selected = navItem === initialItem;
        navItem.classList.toggle("is-active", selected);
        if (selected) navItem.setAttribute("aria-current", "page");
        else navItem.removeAttribute("aria-current");
      });
      delete bottomNav.dataset.mobileNavTransitioning;
      bottomNav.classList.toggle("is-create-current", Boolean(initialItem?.classList.contains("mobile-nav-create")));
      setIndicatorPosition(initialItem, false);
    };

    bottomNav.classList.toggle("is-create-current", Boolean(initialItem?.classList.contains("mobile-nav-create")));
    setIndicatorPosition(initialItem, false);

    navItems.forEach((item) => {
      if (item.classList.contains("mobile-nav-create")) return;
      item.addEventListener("click", (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (item.classList.contains("is-active")) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        if (bottomNav.dataset.mobileNavTransitioning === "true") return;
        bottomNav.dataset.mobileNavTransitioning = "true";

        navItems.forEach((navItem) => {
          const selected = navItem === item;
          navItem.classList.toggle("is-active", selected);
          if (selected) navItem.setAttribute("aria-current", "page");
          else navItem.removeAttribute("aria-current");
        });
        bottomNav.classList.remove("is-create-current");
        window.requestAnimationFrame(() => setIndicatorPosition(item, true));

        const destination = item.href;
        window.setTimeout(() => window.location.assign(destination), reduceMotion.matches ? 0 : 390);
      });
    });

    window.addEventListener("resize", syncIndicatorToActive, { passive: true });
    window.visualViewport?.addEventListener("resize", syncIndicatorToActive, { passive: true });
    if (typeof ResizeObserver === "function") new ResizeObserver(syncIndicatorToActive).observe(bottomNav);
    document.fonts?.ready.then(syncIndicatorToActive);
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) restoreInitialNavState();
      else syncIndicatorToActive();
    });
  }

  const updatePressedLabel = (button, pressed) => {
    const idle = button.dataset.idleLabel;
    const active = button.dataset.activeLabel;
    const label = button.querySelector("[data-action-label]");
    if (label && idle && active) label.textContent = pressed ? active : idle;
  };

  const mobileLikeCelebrationTimers = new WeakMap();
  const clearMobileLikeCelebration = (button) => {
    const activeTimer = mobileLikeCelebrationTimers.get(button);
    if (activeTimer) window.clearTimeout(activeTimer);
    mobileLikeCelebrationTimers.delete(button);
    button.classList.remove("is-like-celebrating");
    button.querySelector(".mobile-like-burst")?.remove();
  };

  const celebrateMobileLike = (button) => {
    clearMobileLikeCelebration(button);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const icon = button.querySelector(".mobile-like-icon");
    if (!icon) return;

    const burst = document.createElement("span");
    burst.className = "mobile-like-burst";
    burst.setAttribute("aria-hidden", "true");
    for (let index = 0; index < 8; index += 1) {
      const particle = document.createElement("span");
      particle.className = "mobile-like-particle";
      burst.appendChild(particle);
    }

    icon.appendChild(burst);
    void icon.offsetWidth;
    button.classList.add("is-like-celebrating");
    const cleanupTimer = window.setTimeout(() => clearMobileLikeCelebration(button), 680);
    mobileLikeCelebrationTimers.set(button, cleanupTimer);
  };

  document.querySelectorAll("[data-mobile-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const pressed = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", pressed ? "false" : "true");
      updatePressedLabel(button, !pressed);
      if (button.matches("[data-mobile-like-action]")) {
        if (pressed) clearMobileLikeCelebration(button);
        else celebrateMobileLike(button);
      }
      showToast(pressed ? (button.dataset.offMessage || "已取消") : (button.dataset.onMessage || "已完成"));
    });
  });

  document.querySelectorAll("[data-mobile-share]").forEach((button) => {
    button.addEventListener("click", async () => {
      const payload = { title: document.title, url: window.location.href };
      try {
        if (navigator.share) {
          await navigator.share(payload);
          return;
        }
        await navigator.clipboard.writeText(payload.url);
        showToast("链接已复制");
      } catch (error) {
        if (error?.name !== "AbortError") showToast("分享失败，请重试");
      }
    });
  });

  document.querySelectorAll("[data-mobile-copy-invite-code]").forEach((button) => {
    button.addEventListener("click", async () => {
      const code = document.querySelector("[data-mobile-invite-code]")?.textContent.trim();
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code);
        showToast("邀请码已复制");
      } catch (error) {
        showToast("复制失败，请长按邀请码复制");
      }
    });
  });

  document.querySelectorAll("[data-mobile-copy-profile-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      const profileId = button.dataset.profileId?.trim();
      if (!profileId) return;
      try {
        await navigator.clipboard.writeText(profileId);
        showToast("用户 ID 已复制");
      } catch {
        showToast("复制失败，请长按用户 ID 复制");
      }
    });
  });

  const inviteRulesSheet = document.querySelector("[data-mobile-invite-rules-sheet]");
  const setInviteRulesSheet = (open) => {
    if (!inviteRulesSheet) return;
    inviteRulesSheet.classList.toggle("is-open", open);
    inviteRulesSheet.setAttribute("aria-hidden", open ? "false" : "true");
  };
  document.querySelectorAll("[data-mobile-invite-rules-open]").forEach((button) => button.addEventListener("click", () => setInviteRulesSheet(true)));
  inviteRulesSheet?.querySelectorAll("[data-mobile-invite-rules-close]").forEach((button) => button.addEventListener("click", () => setInviteRulesSheet(false)));

  const bannerTrack = document.querySelector("[data-mobile-banner-track]");
  const bannerSlides = [...document.querySelectorAll("[data-mobile-banner-slide]")];
  const bannerDots = [...document.querySelectorAll("[data-mobile-banner-dot]")];
  const setActiveBanner = (index) => {
    bannerDots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
  };
  bannerDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.mobileBannerDot || 0);
      bannerTrack?.scrollTo({ left: (bannerTrack.clientWidth || 0) * index, behavior: "auto" });
      setActiveBanner(index);
    });
  });
  let bannerFrame = 0;
  bannerTrack?.addEventListener("scroll", () => {
    if (bannerFrame) return;
    bannerFrame = window.requestAnimationFrame(() => {
      bannerFrame = 0;
      const width = bannerTrack.clientWidth || 1;
      const index = Math.max(0, Math.min(bannerSlides.length - 1, Math.round(bannerTrack.scrollLeft / width)));
      setActiveBanner(index);
    });
  }, { passive: true });

  const appbar = document.querySelector("[data-mobile-appbar]");
  if (appbar && "IntersectionObserver" in window) {
    const appbarSentinel = document.createElement("span");
    appbarSentinel.className = "mobile-appbar-sentinel";
    appbarSentinel.setAttribute("aria-hidden", "true");
    appbar.before(appbarSentinel);
    const appbarObserver = new IntersectionObserver(([entry]) => {
      appbar.classList.toggle("is-scrolled", !entry.isIntersecting);
    }, { threshold: 0 });
    appbarObserver.observe(appbarSentinel);
    window.addEventListener("pagehide", () => appbarObserver.disconnect(), { once: true });
  }

  document.querySelectorAll("[data-mobile-focus-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.mobileFocusTarget);
      if (!target) return;
      target.scrollIntoView({ block: "center", behavior: "auto" });
      window.setTimeout(() => target.focus(), 180);
    });
  });

  const setupMobileMasonry = (masonry, cardSelector) => {
    let masonryFrame = 0;
    const syncMasonry = () => {
      masonryFrame = 0;
      if (!masonry) return;
      const cards = [...masonry.querySelectorAll(cardSelector)];
      masonry.classList.remove("is-masonry-ready");
      cards.forEach((card) => card.style.removeProperty("grid-row-end"));
      const visibleCards = cards.filter((card) => !card.hidden);
      const rowGap = Number.parseFloat(getComputedStyle(masonry).rowGap) || 0;
      const rowHeight = 1;
      const heights = visibleCards.map((card) => card.getBoundingClientRect().height);
      masonry.classList.add("is-masonry-ready");
      visibleCards.forEach((card, index) => {
        const span = Math.max(1, Math.ceil((heights[index] + rowGap) / (rowHeight + rowGap)));
        card.style.gridRowEnd = `span ${span}`;
      });
    };
    const requestMasonrySync = () => {
      if (!masonry || masonryFrame) return;
      masonryFrame = window.requestAnimationFrame(syncMasonry);
    };
    window.addEventListener("resize", requestMasonrySync);
    masonry?.querySelectorAll("img").forEach((image) => {
      if (!image.complete) image.addEventListener("load", requestMasonrySync, { once: true });
    });
    document.fonts?.ready.then(requestMasonrySync);
    return requestMasonrySync;
  };

  const homeMasonry = document.querySelector("[data-mobile-home-masonry]");
  const requestHomeMasonrySync = setupMobileMasonry(homeMasonry, ".mobile-work-card");
  const communityMasonry = document.querySelector("[data-mobile-community-masonry]");
  const requestCommunityMasonrySync = setupMobileMasonry(communityMasonry, ".mobile-community-card");

  const applyFeedFilter = () => {
    const active = document.querySelector("[data-mobile-filter].is-active")?.dataset.mobileFilter || "all";
    const query = document.querySelector("[data-mobile-search-input]")?.value.trim().toLowerCase() || "";
    let visibleCount = 0;
    document.querySelectorAll("[data-mobile-content-type]").forEach((card) => {
      const types = (card.dataset.mobileContentType || "").split(/\s+/).filter(Boolean);
      const typeMatch = active === "all" || types.includes(active);
      const textMatch = !query || card.textContent.toLowerCase().includes(query);
      const visible = typeMatch && textMatch;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    const empty = document.querySelector("[data-mobile-filter-empty]");
    if (empty) empty.hidden = visibleCount > 0;
    requestHomeMasonrySync();
    requestCommunityMasonrySync();
  };

  let homeFeedFilterTimer = 0;
  const homeFeedReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const homeFilterTabs = document.querySelector("[data-mobile-home-filters]");
  const homeFilterButtons = [...(homeFilterTabs?.querySelectorAll("[data-mobile-home-filter]") || [])];
  let homeFilterIndicator = null;
  let homeFilterIndicatorReady = false;
  let homeFilterIndicatorTimer = 0;

  const moveHomeFilterIndicator = (tab, immediate = false) => {
    if (!homeFilterTabs || !homeFilterIndicator || !tab) return;
    window.requestAnimationFrame(() => {
      if (!tab.offsetWidth || !tab.offsetHeight) return;
      const jump = immediate || !homeFilterIndicatorReady;
      homeFilterIndicator.classList.toggle("is-jump", jump);
      homeFilterTabs.style.setProperty("--mobile-home-glide-x", `${tab.offsetLeft}px`);
      homeFilterTabs.style.setProperty("--mobile-home-glide-y", `${tab.offsetTop}px`);
      homeFilterTabs.style.setProperty("--mobile-home-glide-width", `${tab.offsetWidth}px`);
      homeFilterTabs.style.setProperty("--mobile-home-glide-height", `${tab.offsetHeight}px`);
      homeFilterTabs.style.setProperty("--mobile-home-glide-radius", getComputedStyle(tab).borderRadius);
      homeFilterIndicator.classList.add("is-visible");
      homeFilterIndicatorReady = true;
      window.clearTimeout(homeFilterIndicatorTimer);
      homeFilterIndicator.classList.remove("is-moving");
      if (!jump) {
        void homeFilterIndicator.offsetWidth;
        homeFilterIndicator.classList.add("is-moving");
        homeFilterIndicatorTimer = window.setTimeout(() => homeFilterIndicator.classList.remove("is-moving"), 540);
      }
      if (jump) window.requestAnimationFrame(() => homeFilterIndicator.classList.remove("is-jump"));
    });
  };

  if (homeFilterTabs && homeFilterButtons.length > 1) {
    homeFilterIndicator = document.createElement("span");
    homeFilterIndicator.className = "mobile-home-filter-indicator";
    homeFilterIndicator.setAttribute("aria-hidden", "true");
    homeFilterTabs.prepend(homeFilterIndicator);
    homeFilterButtons.forEach((button, index) => {
      button.tabIndex = button.classList.contains("is-active") ? 0 : -1;
      button.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = homeFilterButtons.length - 1;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % homeFilterButtons.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + homeFilterButtons.length) % homeFilterButtons.length;
        const nextButton = homeFilterButtons[nextIndex];
        nextButton.focus({ preventScroll: true });
        nextButton.scrollIntoView({ behavior: homeFeedReduceMotion.matches ? "auto" : "smooth", block: "nearest", inline: "center" });
        nextButton.click();
      });
    });
    window.addEventListener("resize", () => moveHomeFilterIndicator(homeFilterButtons.find((button) => button.classList.contains("is-active")), true), { passive: true });
    document.fonts?.ready.then(() => moveHomeFilterIndicator(homeFilterButtons.find((button) => button.classList.contains("is-active")), true));
  }

  document.querySelectorAll("[data-mobile-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-mobile-filter]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
        if (item.hasAttribute("aria-selected")) item.setAttribute("aria-selected", String(active));
        if (item.hasAttribute("data-mobile-home-filter")) item.tabIndex = active ? 0 : -1;
      });
      if (button.hasAttribute("data-mobile-home-filter")) moveHomeFilterIndicator(button);
      window.clearTimeout(homeFeedFilterTimer);
      const useHomeFeedMotion = body.dataset.mobilePage === "home" && button.hasAttribute("data-mobile-home-filter") && homeMasonry && !homeFeedReduceMotion.matches;
      if (!useHomeFeedMotion) {
        homeMasonry?.classList.remove("is-filtering");
        homeMasonry?.removeAttribute("aria-busy");
        applyFeedFilter();
        return;
      }
      homeMasonry.classList.add("is-filtering");
      homeMasonry.setAttribute("aria-busy", "true");
      homeFeedFilterTimer = window.setTimeout(() => {
        applyFeedFilter();
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            homeMasonry.classList.remove("is-filtering");
            homeMasonry.removeAttribute("aria-busy");
          });
        });
      }, 150);
    });
  });
  document.querySelector("[data-mobile-search-input]")?.addEventListener("input", applyFeedFilter);
  applyFeedFilter();
  moveHomeFilterIndicator(homeFilterButtons.find((button) => button.classList.contains("is-active")), true);

  const communityTabs = [...document.querySelectorAll("[data-mobile-community-tab]")];
  const communityPanels = [...document.querySelectorAll("[data-mobile-community-panel]")];
  const communityTabList = document.querySelector(".mobile-community-module-tabs");
  let communityTabIndicator = null;
  let communityTabIndicatorReady = false;
  let communityTabIndicatorTimer = 0;
  let communityTabStickyFrame = 0;

  const syncCommunityTabStickyState = () => {
    communityTabStickyFrame = 0;
    if (!communityTabList) return;
    const stickyTop = Number.parseFloat(getComputedStyle(communityTabList).top) || 0;
    const isStuck = window.scrollY > 0 && communityTabList.getBoundingClientRect().top <= stickyTop + 0.5;
    communityTabList.classList.toggle("is-stuck", isStuck);
  };

  const requestCommunityTabStickySync = () => {
    if (communityTabStickyFrame) return;
    communityTabStickyFrame = window.requestAnimationFrame(syncCommunityTabStickyState);
  };

  const moveCommunityTabIndicator = (tab, immediate = false) => {
    if (!communityTabList || !communityTabIndicator || !tab) return;
    window.requestAnimationFrame(() => {
      if (!tab.offsetWidth || !tab.offsetHeight) return;
      const jump = immediate || !communityTabIndicatorReady;
      communityTabIndicator.classList.toggle("is-jump", jump);
      communityTabList.style.setProperty("--mobile-community-glide-x", `${tab.offsetLeft}px`);
      communityTabList.style.setProperty("--mobile-community-glide-y", `${tab.offsetTop}px`);
      communityTabList.style.setProperty("--mobile-community-glide-width", `${tab.offsetWidth}px`);
      communityTabList.style.setProperty("--mobile-community-glide-height", `${tab.offsetHeight}px`);
      communityTabIndicator.classList.add("is-visible");
      communityTabIndicatorReady = true;
      window.clearTimeout(communityTabIndicatorTimer);
      communityTabIndicator.classList.remove("is-moving");
      if (!jump) {
        void communityTabIndicator.offsetWidth;
        communityTabIndicator.classList.add("is-moving");
        communityTabIndicatorTimer = window.setTimeout(() => communityTabIndicator.classList.remove("is-moving"), 540);
      }
      if (jump) window.requestAnimationFrame(() => communityTabIndicator.classList.remove("is-jump"));
    });
  };

  if (communityTabList && communityTabs.length > 1) {
    communityTabIndicator = document.createElement("span");
    communityTabIndicator.className = "mobile-community-module-indicator";
    communityTabIndicator.setAttribute("aria-hidden", "true");
    communityTabList.prepend(communityTabIndicator);
    window.addEventListener("resize", () => {
      moveCommunityTabIndicator(communityTabs.find((tab) => tab.classList.contains("is-active")), true);
      requestCommunityTabStickySync();
    }, { passive: true });
    window.addEventListener("scroll", requestCommunityTabStickySync, { passive: true });
    document.fonts?.ready.then(() => {
      moveCommunityTabIndicator(communityTabs.find((tab) => tab.classList.contains("is-active")), true);
      requestCommunityTabStickySync();
    });
    requestCommunityTabStickySync();
  }

  const setCommunityModule = (moduleName, updateUrl = false) => {
    if (!communityTabs.length || !communityPanels.length) return;
    const next = communityTabs.some((tab) => tab.dataset.mobileCommunityTab === moduleName) ? moduleName : "recommend";
    communityTabs.forEach((tab) => {
      const active = tab.dataset.mobileCommunityTab === next;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    moveCommunityTabIndicator(communityTabs.find((tab) => tab.dataset.mobileCommunityTab === next));
    communityPanels.forEach((panel) => { panel.hidden = panel.dataset.mobileCommunityPanel !== next; });
    if (next === "aigc") {
      applyFeedFilter();
      window.requestAnimationFrame(() => {
        moveHomeFilterIndicator(homeFilterButtons.find((button) => button.classList.contains("is-active")), true);
      });
    }
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("module", next);
      history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }
  };
  communityTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setCommunityModule(tab.dataset.mobileCommunityTab, true));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const offset = event.key === "ArrowRight" ? 1 : -1;
      const nextTab = communityTabs[(index + offset + communityTabs.length) % communityTabs.length];
      setCommunityModule(nextTab.dataset.mobileCommunityTab, true);
      nextTab.focus();
    });
  });
  document.querySelectorAll("[data-mobile-community-open-module]").forEach((button) => {
    button.addEventListener("click", () => {
      setCommunityModule(button.dataset.mobileCommunityOpenModule, true);
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  });
  if (communityTabs.length) setCommunityModule(params.get("compose") === "1" ? "flash" : (params.get("module") || "recommend"));

  const tutorialSheet = document.querySelector("[data-mobile-tutorial-sheet]");
  const setTutorialSheet = (open, sourceButton = null) => {
    if (!tutorialSheet) return;
    tutorialSheet.classList.toggle("is-open", open);
    tutorialSheet.setAttribute("aria-hidden", open ? "false" : "true");
    if (open && sourceButton) {
      const title = sourceButton.dataset.tutorialTitle || "教程预览";
      const meta = sourceButton.dataset.tutorialMeta || "官方教程";
      const image = sourceButton.dataset.tutorialImage || "../../assets/image_assets/tutorial-cover-TU000101.jpg";
      const titleNode = tutorialSheet.querySelector("[data-mobile-tutorial-title]");
      const metaNode = tutorialSheet.querySelector("[data-mobile-tutorial-meta]");
      const imageNode = tutorialSheet.querySelector("[data-mobile-tutorial-image]");
      if (titleNode) titleNode.textContent = title;
      if (metaNode) metaNode.textContent = meta;
      if (imageNode) {
        imageNode.src = image;
        imageNode.alt = `${title}封面`;
      }
    }
  };
  document.querySelectorAll("[data-mobile-tutorial-open]").forEach((button) => button.addEventListener("click", () => setTutorialSheet(true, button)));
  tutorialSheet?.querySelectorAll("[data-mobile-tutorial-close]").forEach((button) => button.addEventListener("click", () => setTutorialSheet(false)));

  const myContentTabs = [...document.querySelectorAll("[data-mobile-my-tab]")];
  const myContentPanels = [...document.querySelectorAll("[data-mobile-my-panel]")];
  const myContentTitle = document.querySelector("[data-mobile-my-content-title]");
  const myFlashTab = document.querySelector('[data-mobile-my-tab="flash"]');
  const setMyContentTab = (tabName, updateHash = false) => {
    if (!myContentTabs.length || !myContentPanels.length) return;
    const next = myContentTabs.some((tab) => tab.dataset.mobileMyTab === tabName) ? tabName : "works";
    if (myContentTitle) myContentTitle.textContent = next === "favorites" ? "我的收藏" : "我的内容";
    if (myFlashTab) myFlashTab.hidden = next === "favorites";
    myContentTabs.forEach((tab) => {
      const active = tab.dataset.mobileMyTab === next;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-pressed", String(active));
    });
    myContentPanels.forEach((panel) => { panel.hidden = panel.dataset.mobileMyPanel !== next; });
    if (updateHash) history.replaceState(null, "", next === "works" ? window.location.pathname : `#${next}`);
  };
  myContentTabs.forEach((tab) => tab.addEventListener("click", () => setMyContentTab(tab.dataset.mobileMyTab, true)));
  if (myContentTabs.length) {
    setMyContentTab(window.location.hash.slice(1) || "works");
    window.addEventListener("hashchange", () => setMyContentTab(window.location.hash.slice(1) || "works"));
  }

  document.querySelector("[data-mobile-profile-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("资料已保存");
    window.setTimeout(() => window.location.assign("./mobile-my.html"), 650);
  });

  const activityDetail = document.querySelector("[data-mobile-activity-detail]");
  if (activityDetail) {
    const activityKey = params.get("activity") || "prompt";
    const activityData = {
      prompt: {
        title: "Prompt 共创计划",
        status: "进行中",
        reward: "最高可得 3,000 积分",
        progress: "0/2",
        description: "分享经过验证的 Prompt，让更多人直接复用你的创作方法。每日发布奖励最高 100 积分，活动内自动发放积分最高 3,000 积分。",
        cover: "../../assets/image_assets/activity-live-prompt.png",
        action: "./mobile-create.html?source=prompt&mode=image",
        actionLabel: "立即参与",
        tasks: [
          { name: "发布带图 Prompt", description: "每天前 2 条满足要求的 Prompt 作品 · 进度 0/2", reward: "+50 积分" },
          { name: "首页推荐加奖", description: "内容被推荐至首页 · 进度 0/1", reward: "+500 积分" },
        ],
      },
      "seven-day": {
        title: "七日成长",
        status: "进行中",
        reward: "最高可得 300 积分",
        progress: "0/7",
        description: "完成新手任务后开启七日成长挑战，连续完成每日任务赢取积分。",
        cover: "../../assets/image_assets/activity-live-growth.png",
        action: "./mobile-home.html",
        actionLabel: "开始任务",
        tasks: [
          { name: "浏览 3 条 AIGC 内容", description: "第 1 天 · 进度 0/3", reward: "+20 积分" },
          { name: "复制 3 条 Prompt", description: "第 2 天 · 进度 0/3", reward: "+30 积分" },
          { name: "收藏 3 个 AI 作品", description: "第 3 天 · 进度 0/3", reward: "+30 积分" },
          { name: "点赞或评论 5 条内容", description: "第 4 天 · 进度 0/5", reward: "+40 积分" },
          { name: "转发 3 个 AI 作品", description: "第 5 天 · 进度 0/3", reward: "+50 积分" },
          { name: "转发 1 条社区闪念", description: "第 6 天 · 进度 0/1", reward: "+60 积分" },
          { name: "发布 1 个 AI 作品", description: "第 7 天 · 进度 0/1", reward: "+70 积分" },
        ],
      },
    };
    const data = activityData[activityKey] || activityData.prompt;
    const promptChoiceSheet = document.querySelector("[data-mobile-prompt-choice-sheet]");
    const promptPublishSheet = document.querySelector("[data-mobile-prompt-publish-sheet]");
    const promptPublishForm = document.querySelector("[data-mobile-prompt-publish-form]");
    const setPromptSheet = (sheet, open) => {
      if (!sheet) return;
      sheet.classList.toggle("is-open", open);
      sheet.setAttribute("aria-hidden", open ? "false" : "true");
    };
    const bindings = {
      "[data-mobile-activity-title]": data.title,
      "[data-mobile-activity-status]": data.status,
      "[data-mobile-activity-reward]": data.reward,
      "[data-mobile-activity-progress]": data.progress,
      "[data-mobile-activity-description]": data.description,
    };
    Object.entries(bindings).forEach(([selector, value]) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = value;
    });
    const cover = document.querySelector("[data-mobile-activity-cover]");
    if (cover) { cover.src = data.cover; cover.alt = data.title; }
    document.querySelectorAll("[data-mobile-activity-action]").forEach((action) => {
      action.href = data.action;
      const icon = action.querySelector(".mobile-icon");
      action.textContent = "";
      if (icon) action.append(icon);
      action.append(data.actionLabel);
      if (activityKey === "prompt") {
        action.addEventListener("click", (event) => {
          event.preventDefault();
          setPromptSheet(promptChoiceSheet, true);
        });
      }
    });
    const taskList = document.querySelector("[data-mobile-activity-task-list]");
    if (taskList) {
      taskList.innerHTML = data.tasks.map((task) => `<article><span class="mobile-status-badge">待完成</span><div><h3>${task.name}</h3><p>${task.description}</p></div><strong>${task.reward}</strong></article>`).join("");
    }
    if (promptChoiceSheet && promptPublishSheet && promptPublishForm) {
      promptChoiceSheet.querySelectorAll("[data-mobile-prompt-choice-close]").forEach((button) => button.addEventListener("click", () => setPromptSheet(promptChoiceSheet, false)));
      promptChoiceSheet.querySelector("[data-mobile-prompt-direct-publish]")?.addEventListener("click", () => {
        setPromptSheet(promptChoiceSheet, false);
        setPromptSheet(promptPublishSheet, true);
      });
      promptPublishSheet.querySelectorAll("[data-mobile-prompt-publish-close]").forEach((button) => button.addEventListener("click", () => setPromptSheet(promptPublishSheet, false)));
      const promptTitle = promptPublishForm.querySelector("[data-mobile-prompt-publish-title-input]");
      const promptContent = promptPublishForm.querySelector("[data-mobile-prompt-publish-content]");
      const promptModel = promptPublishForm.querySelector("[data-mobile-prompt-publish-model]");
      const promptMedia = promptPublishForm.querySelector("[data-mobile-prompt-publish-media]");
      const promptMediaLabel = promptPublishForm.querySelector("[data-mobile-prompt-publish-media-label]");
      const promptError = promptPublishForm.querySelector("[data-mobile-prompt-publish-error]");
      promptMedia?.addEventListener("change", () => {
        const file = promptMedia.files?.[0];
        if (promptMediaLabel && file) promptMediaLabel.textContent = file.name;
        if (promptError && file) promptError.textContent = "";
      });
      promptPublishForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!promptTitle?.value.trim()) {
          if (promptError) promptError.textContent = "请填写作品标题";
          promptTitle?.focus();
          return;
        }
        if (!promptContent?.value.trim()) {
          if (promptError) promptError.textContent = "请填写 Prompt 内容";
          promptContent?.focus();
          return;
        }
        if (!promptModel?.value) {
          if (promptError) promptError.textContent = "请选择关联模型";
          promptModel?.focus();
          return;
        }
        if (!promptMedia?.files?.[0]) {
          if (promptError) promptError.textContent = "请上传案例图片或视频";
          promptMedia?.focus();
          return;
        }
        setPromptSheet(promptPublishSheet, false);
        showToast("Prompt 作品已提交审核");
      });
      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        setPromptSheet(promptChoiceSheet, false);
        setPromptSheet(promptPublishSheet, false);
      });
    }
    document.title = `${data.title} - 多元拾光`;
  }

  const exchangePage = document.querySelector("[data-mobile-exchange-page]");
  if (exchangePage) {
    const balanceNode = exchangePage.querySelector("[data-mobile-store-balance]");
    const productCards = [...exchangePage.querySelectorAll("[data-mobile-redeem-product]")];
    const confirmSheet = document.querySelector("[data-mobile-exchange-confirm-sheet]");
    const successSheet = document.querySelector("[data-mobile-exchange-success-sheet]");
    const confirmButton = document.querySelector("[data-mobile-exchange-confirm]");
    const confirmLabel = document.querySelector("[data-mobile-exchange-confirm-label]");
    const error = document.querySelector("[data-mobile-exchange-error]");
    let availablePoints = Number(balanceNode?.dataset.balance || balanceNode?.textContent || 0);
    let selectedProduct = null;
    let selectedTrigger = null;
    let redeeming = false;

    const setExchangeSheet = (sheet, open) => {
      if (!sheet) return;
      sheet.classList.toggle("is-open", open);
      sheet.setAttribute("aria-hidden", open ? "false" : "true");
    };
    const productFromCard = (card) => ({
      id: card?.dataset.productId || "",
      name: card?.dataset.productName || "商品权益",
      price: Number(card?.dataset.productPrice || 0),
      site: card?.dataset.productSite || "其他商品",
      description: card?.dataset.productDescription || "--",
    });
    const updateProductAvailability = () => {
      productCards.forEach((card) => {
        const button = card.querySelector("[data-mobile-redeem-open]");
        const product = productFromCard(card);
        const disabled = !product.id || product.price > availablePoints;
        if (button) {
          button.disabled = disabled;
          button.textContent = disabled ? "积分不足" : "兑换";
        }
      });
    };
    const updateBalance = () => {
      if (balanceNode) {
        balanceNode.textContent = String(availablePoints);
        balanceNode.dataset.balance = String(availablePoints);
      }
      updateProductAvailability();
    };
    const closeConfirm = () => {
      if (redeeming) return;
      setExchangeSheet(confirmSheet, false);
      if (error) error.textContent = "";
      selectedTrigger?.focus();
    };
    const closeSuccess = () => {
      setExchangeSheet(successSheet, false);
      selectedTrigger?.focus();
    };
    const openConfirm = (card, trigger) => {
      const product = productFromCard(card);
      if (!product.id) {
        showToast("商品信息不完整，暂时无法兑换");
        return;
      }
      if (product.price > availablePoints) {
        showToast(`还差 ${product.price - availablePoints} 积分`);
        return;
      }
      selectedProduct = product;
      selectedTrigger = trigger;
      const bindings = {
        "[data-mobile-exchange-confirm-site]": product.site,
        "[data-mobile-exchange-confirm-name]": product.name,
        "[data-mobile-exchange-confirm-description]": product.description,
        "[data-mobile-exchange-current-balance]": `${availablePoints} 积分`,
        "[data-mobile-exchange-price]": `${product.price} 积分`,
        "[data-mobile-exchange-after-balance]": `${availablePoints - product.price} 积分`,
      };
      Object.entries(bindings).forEach(([selector, value]) => {
        const node = confirmSheet?.querySelector(selector);
        if (node) node.textContent = value;
      });
      if (error) error.textContent = "";
      setExchangeSheet(confirmSheet, true);
      window.setTimeout(() => confirmButton?.focus(), 80);
    };

    productCards.forEach((card) => {
      const trigger = card.querySelector("[data-mobile-redeem-open]");
      trigger?.addEventListener("click", () => openConfirm(card, trigger));
    });
    confirmSheet?.querySelectorAll("[data-mobile-exchange-confirm-close]").forEach((button) => button.addEventListener("click", closeConfirm));
    successSheet?.querySelectorAll("[data-mobile-exchange-success-close]").forEach((button) => button.addEventListener("click", closeSuccess));
    confirmButton?.addEventListener("click", () => {
      if (!selectedProduct || redeeming) return;
      if (selectedProduct.price > availablePoints) {
        if (error) error.textContent = `积分不足，还差 ${selectedProduct.price - availablePoints} 积分`;
        return;
      }
      redeeming = true;
      confirmButton.disabled = true;
      if (confirmLabel) confirmLabel.textContent = "兑换中…";
      window.setTimeout(() => {
        availablePoints = Math.max(0, availablePoints - selectedProduct.price);
        updateBalance();
        const successName = successSheet?.querySelector("[data-mobile-exchange-success-product]");
        const successSummary = successSheet?.querySelector("[data-mobile-exchange-success-summary]");
        if (successName) successName.textContent = selectedProduct.name;
        if (successSummary) successSummary.textContent = `已扣除 ${selectedProduct.price} 积分，剩余 ${availablePoints} 积分。`;
        sessionStorage.setItem("mobile-exchange:recent", JSON.stringify({
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
        }));
        setExchangeSheet(confirmSheet, false);
        setExchangeSheet(successSheet, true);
        redeeming = false;
        confirmButton.disabled = false;
        if (confirmLabel) confirmLabel.textContent = "确认兑换";
      }, 520);
    });
    window.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || redeeming) return;
      if (successSheet?.classList.contains("is-open")) closeSuccess();
      else if (confirmSheet?.classList.contains("is-open")) closeConfirm();
    });
    updateProductAvailability();
  }

  const exchangeRecordList = document.querySelector("[data-mobile-exchange-record-list]");
  if (exchangeRecordList) {
    try {
      const recentRecord = JSON.parse(sessionStorage.getItem("mobile-exchange:recent") || "null");
      if (recentRecord?.id && recentRecord?.name && Number(recentRecord.price) > 0) {
        const card = document.createElement("article");
        card.className = "mobile-exchange-record-card is-recent";
        card.dataset.mobileExchangeRecord = "";
        card.dataset.mobileExchangeStatus = "success";
        card.dataset.mobileExchangeProductId = String(recentRecord.id);
        card.innerHTML = `<div class="mobile-exchange-record-head"><h2></h2><span class="mobile-status-badge is-success">兑换成功</span></div><div class="mobile-exchange-record-meta"><span>刚刚</span><span>积分兑换</span><strong></strong></div>`;
        const name = card.querySelector("h2");
        const points = card.querySelector("strong");
        if (name) name.textContent = recentRecord.name;
        if (points) points.textContent = `−${Number(recentRecord.price)} 积分`;
        exchangeRecordList.prepend(card);
      }
    } catch (error) {
      console.warn("Unable to restore the latest exchange record", error);
    }
  }

  document.querySelectorAll("[data-mobile-toast-message]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.mobileToastMessage));
  });

  const pointsFilters = document.querySelectorAll("[data-mobile-points-filter]");
  const pointsRecords = document.querySelectorAll("[data-mobile-points-record]");
  const pointsRecordGroups = document.querySelectorAll(".mobile-points-record-group");
  const pointsRecordEmpty = document.querySelector("[data-mobile-points-record-empty]");
  pointsFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const active = button.dataset.mobilePointsFilter;
      pointsFilters.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-selected", selected ? "true" : "false");
      });
      pointsRecords.forEach((record) => {
        record.hidden = active !== "all" && record.dataset.mobilePointsRecord !== active;
      });
      pointsRecordGroups.forEach((group) => {
        group.hidden = [...group.querySelectorAll("[data-mobile-points-record]")].every((record) => record.hidden);
      });
      if (pointsRecordEmpty) pointsRecordEmpty.hidden = [...pointsRecords].some((record) => !record.hidden);
    });
  });

  const pointsRobotPAG = document.querySelector("[data-mobile-points-robot-pag]");
  const pointsRobotCanvas = pointsRobotPAG?.querySelector("[data-mobile-points-robot-pag-canvas]");
  const pointsShopVideo = document.querySelector("[data-mobile-points-shop-video]");
  if (pointsRobotPAG || pointsShopVideo) {
    const reducePointsMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const LIBPAG_VERSION = "4.5.85";
    const LIBPAG_BASE_URL = `https://cdn.jsdelivr.net/npm/libpag@${LIBPAG_VERSION}/lib/`;
    let pointsPAGView = null;
    let pointsPAGFile = null;
    let pointsPAGInitPromise = null;
    let pointsRobotVisible = true;
    let pointsShopVisible = true;

    const shouldPlayPointsRobot = () => !reducePointsMotion && !document.hidden && pointsRobotVisible;
    const initPointsPAG = () => {
      if (!pointsRobotPAG || !pointsRobotCanvas || reducePointsMotion) return Promise.resolve();
      if (pointsPAGInitPromise) return pointsPAGInitPromise;

      pointsRobotPAG.dataset.pagState = "loading";
      pointsPAGInitPromise = Promise.all([
        import(`${LIBPAG_BASE_URL}libpag.esm.js`).then(({ PAGInit }) => PAGInit({
          locateFile: (file) => `${LIBPAG_BASE_URL}${file}`,
        })),
        fetch(new URL(pointsRobotPAG.dataset.pagSrc, document.baseURI)),
      ])
        .then(async ([PAG, response]) => {
          if (!response.ok) throw new Error(`PAG 文件加载失败（HTTP ${response.status}）`);
          pointsPAGFile = await PAG.PAGFile.load(await response.arrayBuffer());
          pointsRobotCanvas.width = pointsPAGFile.width();
          pointsRobotCanvas.height = pointsPAGFile.height();
          pointsPAGView = await PAG.PAGView.init(pointsPAGFile, pointsRobotCanvas);
          if (!pointsPAGView) throw new Error("PAGView 初始化失败");
          pointsPAGView.setRepeatCount(0);
          pointsPAGView.setMaxFrameRate(30);
          pointsRobotPAG.dataset.pagState = "ready";
          if (shouldPlayPointsRobot()) await pointsPAGView.play();
        })
        .catch((error) => {
          pointsPAGView?.destroy();
          pointsPAGView = null;
          pointsPAGFile?.destroy();
          pointsPAGFile = null;
          pointsRobotPAG.dataset.pagState = "fallback";
          console.warn("移动积分中心 PAG 动画加载失败，已回退到静态插图。", error);
        });
      return pointsPAGInitPromise;
    };

    const syncPointsRobotPlayback = () => {
      if (!pointsRobotPAG || reducePointsMotion) return;
      if (!shouldPlayPointsRobot()) {
        void pointsPAGView?.pause().catch((error) => console.warn("移动积分中心 PAG 动画暂停失败。", error));
        return;
      }
      if (!pointsPAGView) {
        void initPointsPAG();
        return;
      }
      void pointsPAGView.play().catch((error) => console.warn("移动积分中心 PAG 动画恢复失败。", error));
    };

    const syncPointsShopPlayback = () => {
      if (!pointsShopVideo) return;
      if (reducePointsMotion || document.hidden || !pointsShopVisible) {
        pointsShopVideo.pause();
        return;
      }
      void pointsShopVideo.play().catch((error) => {
        console.warn("移动积分商城视频自动播放失败，已保留封面图。", error);
      });
    };

    if (pointsRobotPAG) {
      if (reducePointsMotion) {
        pointsRobotPAG.dataset.pagState = "reduced-motion";
      } else if ("IntersectionObserver" in window) {
        const pointsRobotObserver = new IntersectionObserver(([entry]) => {
          pointsRobotVisible = entry.isIntersecting;
          syncPointsRobotPlayback();
        }, { threshold: 0.01 });
        pointsRobotObserver.observe(pointsRobotPAG);
      } else {
        syncPointsRobotPlayback();
      }
    }

    if (pointsShopVideo) {
      if (!reducePointsMotion && "IntersectionObserver" in window) {
        const pointsShopObserver = new IntersectionObserver(([entry]) => {
          pointsShopVisible = entry.isIntersecting;
          syncPointsShopPlayback();
        }, { threshold: 0.05 });
        pointsShopObserver.observe(pointsShopVideo);
      } else {
        syncPointsShopPlayback();
      }
    }

    document.addEventListener("visibilitychange", () => {
      syncPointsRobotPlayback();
      syncPointsShopPlayback();
    });
    window.addEventListener("pagehide", (event) => {
      pointsShopVideo?.pause();
      if (event.persisted) {
        void pointsPAGView?.pause();
        return;
      }
      pointsPAGView?.destroy();
      pointsPAGView = null;
      pointsPAGFile?.destroy();
      pointsPAGFile = null;
    });
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) syncPointsRobotPlayback();
      syncPointsShopPlayback();
    });
  }

  document.querySelector("[data-mobile-checkin]")?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    if (button.dataset.checked === "true") {
      showToast("今日已签到");
      return;
    }
    button.dataset.checked = "true";
    button.textContent = "今日已签到";
    const points = document.querySelector("[data-mobile-points-value]");
    if (points) points.textContent = String(Number(points.textContent) + 20);
    showToast("签到成功，积分 +20");
  });

  const commentSheet = document.querySelector("[data-mobile-comment-sheet]");
  const setCommentSheet = (open) => {
    if (!commentSheet) return;
    commentSheet.classList.toggle("is-open", open);
    commentSheet.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) window.setTimeout(() => commentSheet.querySelector("input")?.focus(), 180);
  };
  document.querySelectorAll("[data-mobile-comments-open]").forEach((button) => button.addEventListener("click", () => setCommentSheet(true)));
  document.querySelectorAll("[data-mobile-comments-close]").forEach((button) => button.addEventListener("click", () => setCommentSheet(false)));

  document.addEventListener("click", (event) => {
    const reply = event.target.closest("[data-mobile-comment-reply]");
    if (reply) {
      setCommentSheet(true);
      window.setTimeout(() => commentSheet?.querySelector("input")?.focus(), 180);
      return;
    }

    const like = event.target.closest("[data-mobile-comment-like]");
    if (!like) return;
    const wasLiked = like.getAttribute("aria-pressed") === "true";
    const baseCount = Number.parseInt(like.dataset.count || "0", 10);
    like.setAttribute("aria-pressed", String(!wasLiked));
    like.textContent = `赞 ${baseCount + (wasLiked ? 0 : 1)}`;
    showToast(wasLiked ? "已取消评论点赞" : "已点赞评论");
  });

  document.querySelector("[data-mobile-comment-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    if (!input?.value.trim()) return;
    const list = document.querySelector("[data-mobile-comment-list]");
    if (list) {
      const article = document.createElement("article");
      article.className = "mobile-comment";
      article.innerHTML = `<img src="../../assets/image_assets/1.png" alt=""><div class="mobile-comment-copy"><div class="mobile-comment-meta"><strong>我</strong><time>刚刚</time></div><p></p><div class="mobile-comment-actions"><button type="button" data-mobile-comment-reply>回复</button><button type="button" data-mobile-comment-like data-count="0" aria-pressed="false">赞 0</button></div></div>`;
      article.querySelector("p").textContent = input.value.trim();
      list.prepend(article);
    }
    input.value = "";
    showToast("评论已发布");
  });

  const flashPageForm = document.querySelector("[data-mobile-flash-page-form]");
  if (flashPageForm) {
    const content = flashPageForm.querySelector("[data-mobile-flash-page-content]");
    const contentCounter = flashPageForm.querySelector("[data-mobile-flash-page-counter]");
    const mediaInput = flashPageForm.querySelector("[data-mobile-flash-page-media-input]");
    const mediaAdd = flashPageForm.querySelector("[data-mobile-flash-page-media-add]");
    const mediaList = flashPageForm.querySelector("[data-mobile-flash-page-media-list]");
    const mediaCount = flashPageForm.querySelector("[data-mobile-flash-page-media-count]");
    const topicInput = flashPageForm.querySelector("[data-mobile-flash-page-topic-input]");
    const topicAdd = flashPageForm.querySelector("[data-mobile-flash-page-topic-add]");
    const topicList = flashPageForm.querySelector("[data-mobile-flash-page-topic-list]");
    const topicCount = flashPageForm.querySelector("[data-mobile-flash-page-topic-count]");
    const category = flashPageForm.querySelector("[data-mobile-flash-page-category]");
    const status = flashPageForm.querySelector("[data-mobile-flash-page-status]");
    const submit = flashPageForm.querySelector("[data-mobile-flash-page-submit]");
    const mediaFiles = [];
    const topics = [];
    const mediaLimit = 6;
    const topicLimit = 5;
    const maxFileSize = 50 * 1024 * 1024;
    let isPublishing = false;

    const setFlashPageStatus = (message, tone = "") => {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("is-error", tone === "error");
      status.classList.toggle("is-success", tone === "success");
    };

    const syncFlashPage = () => {
      const hasContent = Boolean(content?.value.trim());
      if (contentCounter && content) contentCounter.textContent = `${content.value.length}/600`;
      if (mediaCount) mediaCount.textContent = `${mediaFiles.length}/6`;
      if (topicCount) topicCount.textContent = `${topics.length}/5`;
      if (mediaAdd) mediaAdd.disabled = mediaFiles.length >= mediaLimit;
      if (topicAdd) topicAdd.disabled = !topicInput?.value.trim() || topics.length >= topicLimit;
      if (submit) submit.disabled = !hasContent || isPublishing;
    };

    const renderFlashPageMedia = () => {
      if (!mediaList || !mediaAdd) return;
      mediaList.replaceChildren();
      mediaFiles.forEach((item, index) => {
        const holder = document.createElement("div");
        holder.className = "mobile-flash-page-media-item";

        const preview = document.createElement(item.kind === "video" ? "video" : "img");
        preview.src = item.url;
        if (item.kind === "video") {
          preview.muted = true;
          preview.playsInline = true;
          preview.preload = "metadata";
          preview.setAttribute("aria-label", item.file.name);
        } else {
          preview.alt = item.file.name;
        }

        const kind = document.createElement("span");
        kind.className = "mobile-flash-page-media-kind";
        kind.textContent = item.kind === "video" ? "视频" : "图片";

        const remove = document.createElement("button");
        remove.className = "mobile-flash-page-media-remove";
        remove.type = "button";
        remove.setAttribute("aria-label", `移除 ${item.file.name}`);
        remove.innerHTML = '<img class="mobile-icon" src="../../resources/icons/remixicon/svg/System/close-line.svg" alt="">';
        remove.addEventListener("click", () => {
          const [removed] = mediaFiles.splice(index, 1);
          if (removed?.url) URL.revokeObjectURL(removed.url);
          renderFlashPageMedia();
          setFlashPageStatus("媒体已移除");
        });

        holder.append(preview, kind, remove);
        mediaList.append(holder);
      });
      mediaList.append(mediaAdd);
      syncFlashPage();
    };

    const renderFlashPageTopics = () => {
      if (!topicList) return;
      topicList.replaceChildren();
      topics.forEach((topic, index) => {
        const tag = document.createElement("span");
        tag.className = "mobile-flash-page-topic-tag";
        const label = document.createElement("span");
        label.textContent = `#${topic}`;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.setAttribute("aria-label", `删除话题 ${topic}`);
        remove.innerHTML = '<img class="mobile-icon" src="../../resources/icons/remixicon/svg/System/close-line.svg" alt="">';
        remove.addEventListener("click", () => {
          topics.splice(index, 1);
          renderFlashPageTopics();
          topicInput?.focus();
          setFlashPageStatus(`已删除“${topic}”话题`);
        });
        tag.append(label, remove);
        topicList.append(tag);
      });
      syncFlashPage();
    };

    const addFlashPageTopic = () => {
      const value = topicInput?.value.trim().replace(/^#+/, "").trim() || "";
      if (!value) return;
      if (topics.some((topic) => topic.toLocaleLowerCase() === value.toLocaleLowerCase())) {
        setFlashPageStatus(`“${value}”话题已存在`, "error");
        return;
      }
      if (topics.length >= topicLimit) {
        setFlashPageStatus("最多可添加 5 个话题", "error");
        return;
      }
      topics.push(value);
      topicInput.value = "";
      renderFlashPageTopics();
      setFlashPageStatus(`已添加“${value}”话题`);
    };

    content?.addEventListener("input", () => {
      syncFlashPage();
      setFlashPageStatus(content.value.trim() ? "内容会在社区内公开展示" : "先写下一点内容，再发布闪念");
    });
    mediaAdd?.addEventListener("click", () => mediaInput?.click());
    mediaInput?.addEventListener("change", () => {
      const selectedFiles = [...(mediaInput.files || [])];
      let added = 0;
      let rejectedMessage = "";
      for (const file of selectedFiles) {
        if (mediaFiles.length >= mediaLimit) {
          rejectedMessage = "最多可添加 6 个媒体文件";
          break;
        }
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
          rejectedMessage = "仅支持图片或视频文件";
          continue;
        }
        if (file.size > maxFileSize) {
          rejectedMessage = `${file.name} 超过 50MB`;
          continue;
        }
        mediaFiles.push({
          file,
          kind: file.type.startsWith("video/") ? "video" : "image",
          url: URL.createObjectURL(file),
        });
        added += 1;
      }
      mediaInput.value = "";
      renderFlashPageMedia();
      if (rejectedMessage) setFlashPageStatus(rejectedMessage, "error");
      else if (added) setFlashPageStatus(`已添加 ${added} 个媒体文件`);
    });
    topicInput?.addEventListener("input", syncFlashPage);
    topicInput?.addEventListener("keydown", (event) => {
      if (event.isComposing) return;
      if (event.key === "Enter") {
        event.preventDefault();
        addFlashPageTopic();
      } else if (event.key === "Backspace" && !topicInput.value && topics.length) {
        topics.pop();
        renderFlashPageTopics();
      }
    });
    topicAdd?.addEventListener("click", addFlashPageTopic);
    category?.addEventListener("change", () => {
      const selected = category.options[category.selectedIndex]?.textContent || "当前";
      setFlashPageStatus(`内容将发布到“${selected}”分类`);
    });
    flashPageForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!content?.value.trim()) {
        setFlashPageStatus("请先写下闪念内容", "error");
        content?.focus();
        return;
      }
      isPublishing = true;
      syncFlashPage();
      const submitLabel = submit?.querySelector("[data-mobile-flash-page-submit-label]");
      if (submitLabel) submitLabel.textContent = "发布中…";
      setFlashPageStatus("正在发布闪念…");
      window.setTimeout(() => {
        isPublishing = false;
        setFlashPageStatus("闪念已发布", "success");
        showToast("闪念已提交，正在审核中");
        window.setTimeout(() => window.location.assign("./mobile-community.html?module=flash"), 480);
      }, 520);
    });
    window.addEventListener("pagehide", () => mediaFiles.forEach((item) => URL.revokeObjectURL(item.url)));
    syncFlashPage();
  }

  document.querySelectorAll("[data-mobile-back]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const fallback = button.dataset.fallback || "./mobile-community.html";
      if (window.history.length > 1) window.history.back();
      else window.location.href = fallback;
    });
  });

  const walkthrough = document.querySelector("[data-mobile-walkthrough]");
  const setWalkthrough = (open) => {
    if (!walkthrough) return;
    walkthrough.classList.toggle("is-open", open);
    walkthrough.setAttribute("aria-hidden", open ? "false" : "true");
  };
  document.querySelector("[data-mobile-walkthrough-open]")?.addEventListener("click", () => setWalkthrough(true));
  document.querySelector("[data-mobile-walkthrough-close]")?.addEventListener("click", () => setWalkthrough(false));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setCommentSheet(false);
    setWalkthrough(false);
    setCreateActionSheet(false);
    setInviteRulesSheet(false);
    setTutorialSheet(false);
  });

  const createWorkspace = document.querySelector("[data-mobile-create-workspace]");
  const createComposer = document.querySelector("[data-mobile-create-composer]");
  if (createWorkspace && createComposer) {
    const createPrompt = createComposer.querySelector("[data-mobile-create-prompt]");
    const createSend = createComposer.querySelector(".mobile-create-send");
    const createError = createComposer.querySelector("[data-mobile-create-error]");
    const createModeInput = createComposer.querySelector("[data-mobile-create-mode-input]");
    const createAttachment = createComposer.querySelector("[data-mobile-create-attachment]");
    const createInputRow = createComposer.querySelector(".mobile-create-input-row");
    const createReferenceRow = createComposer.querySelector("[data-mobile-create-reference-row]");
    const createReferenceList = createComposer.querySelector("[data-mobile-create-reference-list]");
    const createReferenceInput = createComposer.querySelector("[data-mobile-create-reference-input]");
    const createSettingsSummary = createComposer.querySelector("[data-mobile-create-settings-summary]");
    const createSettingsCost = createComposer.querySelector("[data-mobile-create-settings-cost]");
    const createEmpty = createWorkspace.querySelector("[data-mobile-create-empty]");
    const createSource = createWorkspace.querySelector("[data-mobile-create-source]");
    const modelPopover = document.querySelector("[data-mobile-create-model-popover]");
    const modelTrigger = createComposer.querySelector("[data-mobile-create-model-open]");
    const createModeTabs = createComposer.querySelector("[data-mobile-create-mode-tabs]");
    const createModeButtons = [...(createModeTabs?.querySelectorAll("[data-mobile-create-mode]") || [])];
    const createComposerToggle = createComposer.querySelector("[data-mobile-create-composer-toggle]");
    const historySheet = document.querySelector("[data-mobile-create-history-sheet]");
    const previewDialog = document.querySelector("[data-mobile-create-preview-dialog]");
    const requestedCreateMode = params.get("mode");
    const createState = {
      mode: ["image", "script", "video"].includes(requestedCreateMode) ? requestedCreateMode : "image",
      image: { model: "Flux Pro 1.1", cost: 20, resolution: "2K", ratio: "1:1" },
      script: { model: "gemini-3-flash-preview", cost: 8, format: "Markdown 文本" },
      video: { model: "Seedance 2.0", cost: 64, resolution: "720p", ratio: "16:9", duration: "8秒" },
    };
    const sourceType = params.get("source") || "";
    const sourceData = {
      "same-work:image": {
        kind: "同款来源",
        title: "凤冠神女",
        meta: "Flux Pro 1.1 · 1:1",
        cover: "../../assets/image_assets/15.jpg",
        prompt: "凤冠神女站在暗红色殿堂入口，金色逆光勾勒轮廓，电影感人物海报。",
      },
      "same-work:video": {
        kind: "同款来源",
        title: "海灯守望",
        meta: "Seedance 2.0 / 16:9 / 8 秒",
        cover: "../../assets/image_assets/4.png",
        prompt: "海边灯塔被薄雾包围，镜头缓慢抬升，最后停在灯塔亮起的瞬间。",
      },
      "campaign:image": {
        kind: "活动创作",
        title: "AI 生图创作挑战",
        meta: "图片生成 · 活动投稿",
        cover: "../../assets/image_assets/activity-live-image-challenge.png",
        prompt: "",
      },
      "competition:image": {
        kind: "活动创作",
        title: "AIGC 创作挑战赛",
        meta: "图片生成 · 活动投稿",
        cover: "../../assets/image_assets/activity-live-image-challenge.png",
        prompt: "",
      },
      "prompt:image": {
        kind: "Prompt 共创",
        title: "Prompt 共创计划",
        meta: "图片生成 · Prompt 投稿",
        cover: "../../assets/image_assets/activity-live-prompt.png",
        prompt: "",
      },
      "prompt:script": {
        kind: "Prompt 共创",
        title: "Prompt 共创计划",
        meta: "剧本创作 · Prompt 投稿",
        cover: "../../assets/image_assets/activity-live-prompt.png",
        prompt: "",
      },
    };
    const createReferenceLimits = { image: 4, video: 1 };
    const createReferences = { image: [], video: [] };
    const retiredCreateReferenceUrls = new Set();
    let createReferenceSequence = 0;

    const setCreateComposerCollapsed = (collapsed, { focus = false } = {}) => {
      const nextCollapsed = Boolean(collapsed);
      createComposer.classList.toggle("is-collapsed", nextCollapsed);
      document.body.classList.toggle("has-create-composer-collapsed", nextCollapsed);
      if (createComposerToggle) {
        createComposerToggle.hidden = !nextCollapsed;
        createComposerToggle.setAttribute("aria-expanded", nextCollapsed ? "false" : "true");
      }
      if (!nextCollapsed && focus) {
        window.requestAnimationFrame(() => createPrompt?.focus({ preventScroll: true }));
      }
    };

    createComposerToggle?.addEventListener("click", () => {
      setCreateComposerCollapsed(false, { focus: true });
    });

    if (sourceType === "same-work") {
      ["image", "video"].forEach((mode) => {
        const sourceReference = sourceData[`${sourceType}:${mode}`];
        if (!sourceReference?.cover) return;
        createReferences[mode].push({
          id: `source-${mode}`,
          name: sourceReference.title,
          url: sourceReference.cover,
          isObjectUrl: false,
        });
      });
    }

    const activeCreateReferences = () => createReferences[createState.mode] || [];

    const renderCreateReferences = () => {
      if (!createReferenceList) return;
      const references = activeCreateReferences();
      const limit = createReferenceLimits[createState.mode] || 0;
      const target = createState.mode === "video" ? "首帧图片" : "参考图";
      createReferenceList.replaceChildren();
      createReferenceList.hidden = references.length === 0;
      createReferenceList.setAttribute("aria-label", `已添加的${target}`);
      if (createReferenceInput) createReferenceInput.multiple = createState.mode === "image";
      references.forEach((reference, index) => {
        const item = document.createElement("div");
        item.className = "mobile-create-reference-item";
        item.dataset.mobileCreateReferenceId = reference.id;
        item.setAttribute("role", "listitem");

        const image = document.createElement("img");
        image.className = "mobile-create-reference-preview";
        image.src = reference.url;
        image.alt = `${target} ${index + 1}：${reference.name}`;

        const remove = document.createElement("button");
        remove.className = "mobile-create-reference-remove";
        remove.type = "button";
        remove.dataset.mobileCreateReferenceRemove = reference.id;
        remove.setAttribute("aria-label", `删除${target} ${index + 1}：${reference.name}`);
        remove.innerHTML = '<img class="mobile-icon" src="../../resources/icons/remixicon/svg/System/close-line.svg" alt="">';

        item.append(image, remove);
        createReferenceList.append(item);
      });
      if (createAttachment) {
        const atLimit = references.length >= limit;
        createAttachment.hidden = atLimit || createState.mode === "script";
        createAttachment.classList.toggle("is-selected", references.length > 0);
        const label = createState.mode === "video"
          ? "添加首帧图片"
          : references.length
            ? `继续添加参考图，已选择 ${references.length}/${limit} 张`
            : `添加参考图，最多 ${limit} 张`;
        createAttachment.setAttribute("aria-label", label);
        createAttachment.setAttribute("title", label);
      }
      createReferenceRow?.setAttribute("data-reference-count", String(references.length));
    };

    const openCreateReferencePicker = () => {
      if (!createReferenceInput) return;
      if (activeCreateReferences().length >= (createReferenceLimits[createState.mode] || 0)) return;
      createReferenceInput.value = "";
      createReferenceInput.click();
    };

    const removeCreateReference = (referenceId) => {
      const references = activeCreateReferences();
      const index = references.findIndex((reference) => reference.id === referenceId);
      if (index < 0) return;
      const [removed] = references.splice(index, 1);
      if (removed.isObjectUrl) retiredCreateReferenceUrls.add(removed.url);
      renderCreateReferences();
      showToast(createState.mode === "video" ? "已删除首帧图片" : `已删除参考图，当前 ${references.length} 张`);
    };

    const setCreateSheet = (sheet, open) => {
      if (!sheet) return;
      sheet.classList.toggle("is-open", open);
      sheet.setAttribute("aria-hidden", open ? "false" : "true");
    };
    const setCreateModelPopover = (open, { returnFocus = true } = {}) => {
      if (!modelPopover || !modelTrigger) return;
      const wasOpen = modelPopover.open;
      if (!open && !wasOpen) return;
      modelPopover.open = open;
      modelPopover.classList.toggle("is-open", open);
      modelTrigger.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        requestAnimationFrame(() => {
          const activePanel = modelPopover.querySelector("[data-mobile-create-setting-panel]:not([hidden])");
          (activePanel?.querySelector(".mobile-model-card.is-selected") || activePanel?.querySelector(".mobile-model-card"))?.focus();
        });
      } else if (returnFocus) {
        modelTrigger.focus();
      }
    };
    const createModeReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let createModeIndicator = null;
    let createModeIndicatorReady = false;
    let createModeIndicatorTimer = 0;
    const moveCreateModeIndicator = (tab, immediate = false) => {
      if (!createModeTabs || !createModeIndicator || !tab) return;
      window.requestAnimationFrame(() => {
        if (!tab.offsetWidth || !tab.offsetHeight) return;
        const jump = immediate || !createModeIndicatorReady;
        createModeIndicator.classList.toggle("is-jump", jump);
        createModeTabs.style.setProperty("--mobile-home-glide-x", `${tab.offsetLeft}px`);
        createModeTabs.style.setProperty("--mobile-home-glide-y", `${tab.offsetTop}px`);
        createModeTabs.style.setProperty("--mobile-home-glide-width", `${tab.offsetWidth}px`);
        createModeTabs.style.setProperty("--mobile-home-glide-height", `${tab.offsetHeight}px`);
        createModeTabs.style.setProperty("--mobile-home-glide-radius", getComputedStyle(tab).borderRadius);
        createModeIndicator.classList.add("is-visible");
        createModeIndicatorReady = true;
        window.clearTimeout(createModeIndicatorTimer);
        createModeIndicator.classList.remove("is-moving");
        if (!jump) {
          void createModeIndicator.offsetWidth;
          createModeIndicator.classList.add("is-moving");
          createModeIndicatorTimer = window.setTimeout(() => createModeIndicator.classList.remove("is-moving"), createModeReduceMotion.matches ? 240 : 540);
        }
        if (jump) window.requestAnimationFrame(() => createModeIndicator.classList.remove("is-jump"));
      });
    };
    if (createModeTabs && createModeButtons.length > 1) {
      createModeIndicator = document.createElement("span");
      createModeIndicator.className = "mobile-home-filter-indicator";
      createModeIndicator.setAttribute("aria-hidden", "true");
      createModeTabs.prepend(createModeIndicator);
      createModeButtons.forEach((button, index) => {
        button.tabIndex = button.classList.contains("is-active") ? 0 : -1;
        button.addEventListener("keydown", (event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          let nextIndex = index;
          if (event.key === "Home") nextIndex = 0;
          if (event.key === "End") nextIndex = createModeButtons.length - 1;
          if (event.key === "ArrowRight") nextIndex = (index + 1) % createModeButtons.length;
          if (event.key === "ArrowLeft") nextIndex = (index - 1 + createModeButtons.length) % createModeButtons.length;
          const nextButton = createModeButtons[nextIndex];
          nextButton.focus({ preventScroll: true });
          nextButton.click();
        });
      });
      window.addEventListener("resize", () => moveCreateModeIndicator(createModeButtons.find((button) => button.classList.contains("is-active")), true), { passive: true });
      document.fonts?.ready.then(() => moveCreateModeIndicator(createModeButtons.find((button) => button.classList.contains("is-active")), true));
    }
    const syncCreatePrompt = () => {
      if (!createPrompt) return;
      createPrompt.style.height = "auto";
      createPrompt.style.height = `${Math.min(createPrompt.scrollHeight, 120)}px`;
      if (createSend) createSend.disabled = !createPrompt.value.trim();
      if (createPrompt.value.trim() && createError) createError.textContent = "";
    };
    const syncCreateSummary = () => {
      const state = createState[createState.mode];
      if (createSettingsSummary) createSettingsSummary.textContent = state.model;
      if (createSettingsCost) createSettingsCost.textContent = String(state.cost);
      const ratioIconMap = {
        "1:1": "../../resources/icons/lucide/square.svg",
        "16:9": "../../resources/icons/lucide/rectangle-horizontal.svg",
        "9:16": "../../resources/icons/lucide/rectangle-vertical.svg",
      };
      createComposer.querySelectorAll("[data-mobile-create-parameter]").forEach((control) => {
        const key = control.dataset.mobileCreateParameter;
        const stateKey = key.endsWith("-resolution") ? "resolution" : key;
        const visible = key === "ratio"
          ? createState.mode !== "script"
          : key === "duration"
            ? createState.mode === "video"
            : key === "image-resolution"
              ? createState.mode === "image"
              : key === "video-resolution" && createState.mode === "video";
        control.hidden = !visible;
        if (!visible) control.open = false;
        const label = control.querySelector(`[data-mobile-create-parameter-label="${stateKey}"]`);
        if (label && visible) {
          const ratioText = label.querySelector("[data-mobile-create-ratio-value]");
          if (ratioText) ratioText.textContent = state[stateKey];
          else label.textContent = state[stateKey];
          const ratioIcon = label.querySelector("[data-mobile-create-ratio-icon]");
          if (ratioIcon) ratioIcon.src = ratioIconMap[state[stateKey]] || ratioIconMap["1:1"];
        }
        const group = control.querySelector("[data-mobile-create-choice-group]");
        group?.querySelectorAll("[data-mobile-create-choice]").forEach((option) => {
          const selected = option.dataset.mobileCreateChoice === state[stateKey];
          option.classList.toggle("is-selected", selected);
          option.setAttribute("aria-pressed", selected ? "true" : "false");
        });
      });
      const durationInput = createComposer.querySelector("[data-mobile-create-duration-input]");
      if (durationInput && createState.mode === "video") durationInput.value = String(parseInt(state.duration, 10));
      const durationValue = createComposer.querySelector("[data-mobile-create-duration-value]");
      if (durationValue && createState.mode === "video") durationValue.textContent = state.duration;
    };
    const syncCreateMode = (mode) => {
      createState.mode = ["image", "script", "video"].includes(mode) ? mode : "image";
      if (createModeInput) createModeInput.value = createState.mode;
      if (createPrompt) {
        const promptConfig = {
          image: { ariaLabel: "描述画面", placeholder: "主体、场景、风格、光线和构图", limit: 1000 },
          script: { ariaLabel: "写下故事设定", placeholder: "人物关系、核心冲突或短片想法", limit: 5000 },
          video: { ariaLabel: "描述镜头", placeholder: "画面内容、镜头运动和节奏", limit: 1000 },
        }[createState.mode];
        createPrompt.setAttribute("aria-label", promptConfig.ariaLabel);
        createPrompt.placeholder = promptConfig.placeholder;
        createPrompt.maxLength = promptConfig.limit;
        if (createPrompt.value.length > promptConfig.limit) createPrompt.value = createPrompt.value.slice(0, promptConfig.limit);
        syncCreatePrompt();
      }
      if (createReferenceRow) createReferenceRow.hidden = createState.mode === "script";
      createInputRow?.classList.toggle("is-script", createState.mode === "script");
      createInputRow?.classList.toggle("is-video", createState.mode === "video");
      renderCreateReferences();
      let activeModeTab = null;
      createModeButtons.forEach((button) => {
        const selected = button.dataset.mobileCreateMode === createState.mode;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-selected", selected ? "true" : "false");
        button.setAttribute("aria-pressed", selected ? "true" : "false");
        button.tabIndex = selected ? 0 : -1;
        if (selected) activeModeTab = button;
      });
      moveCreateModeIndicator(activeModeTab);
      document.querySelectorAll("[data-mobile-create-setting-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.mobileCreateSettingPanel !== createState.mode;
      });
      setCreateModelPopover(false, { returnFocus: false });
      syncCreateSummary();
    };
    const renderCreateSource = () => {
      if (!createSource || !sourceType) return;
      const data = sourceData[`${sourceType}:${createState.mode}`];
      if (!data) {
        createSource.hidden = true;
        if (createEmpty) createEmpty.hidden = false;
        return;
      }
      createSource.hidden = false;
      if (createEmpty) createEmpty.hidden = true;
      const cover = createSource.querySelector("[data-mobile-create-source-cover]");
      const kind = createSource.querySelector("[data-mobile-create-source-kind]");
      const title = createSource.querySelector("[data-mobile-create-source-title]");
      const meta = createSource.querySelector("[data-mobile-create-source-meta]");
      if (cover) { cover.src = data.cover; cover.alt = data.title; }
      if (kind) kind.textContent = data.kind;
      if (title) title.textContent = data.title;
      if (meta) meta.textContent = data.meta;
      if (createPrompt && data.prompt) createPrompt.value = data.prompt;
      syncCreatePrompt();
    };

    createModeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        syncCreateMode(button.dataset.mobileCreateMode);
        renderCreateSource();
      });
    });
    createWorkspace.querySelectorAll("[data-mobile-create-suggestion]").forEach((button) => {
      button.addEventListener("click", () => {
        const mode = button.dataset.suggestionMode;
        const prompt = button.dataset.suggestionPrompt || "";
        syncCreateMode(mode);
        renderCreateSource();
        if (!createPrompt) return;
        createPrompt.value = prompt;
        syncCreatePrompt();
        createPrompt.focus();
        createPrompt.setSelectionRange(prompt.length, prompt.length);
      });
    });
    createWorkspace.querySelectorAll("[data-mobile-create-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const options = (button.dataset.filterOptions || "").split("|").filter(Boolean);
        const label = button.querySelector("span");
        if (!label || !options.length) return;
        const nextIndex = (options.indexOf(label.textContent.trim()) + 1) % options.length;
        label.textContent = options[nextIndex];
        showToast(`已切换为${options[nextIndex]}`);
      });
    });
    document.querySelectorAll("[data-mobile-create-choice-group]").forEach((group) => {
      group.querySelectorAll("[data-mobile-create-choice]").forEach((button) => {
        button.addEventListener("click", () => {
          group.querySelectorAll("[data-mobile-create-choice]").forEach((item) => item.classList.toggle("is-selected", item === button));
          const key = group.dataset.mobileCreateChoiceGroup;
          const targetMode = key.startsWith("video-") ? "video" : key.startsWith("image-") ? "image" : createState.mode;
          const stateKey = key.endsWith("-resolution") ? "resolution" : key === "video-ratio" ? "ratio" : key;
          createState[targetMode][stateKey] = button.dataset.mobileCreateChoice;
          group.closest("details")?.removeAttribute("open");
          syncCreateSummary();
        });
      });
    });
    createComposer.querySelector("[data-mobile-create-duration-input]")?.addEventListener("input", (event) => {
      createState.video.duration = `${event.currentTarget.value}秒`;
      syncCreateSummary();
    });
    document.querySelectorAll("[data-mobile-create-setting-panel]").forEach((panel) => {
      panel.querySelectorAll("[data-mobile-create-model]").forEach((button) => {
        button.addEventListener("click", () => {
          const selectedModel = button.dataset.mobileCreateModel;
          const selectedCost = Number(button.dataset.mobileCreateCost);
          if (!selectedModel || !Number.isFinite(selectedCost)) return;
          panel.querySelectorAll("[data-mobile-create-model]").forEach((item) => {
            const selected = item === button;
            item.classList.toggle("is-selected", selected);
            item.setAttribute("aria-pressed", selected ? "true" : "false");
            const stateIcon = item.querySelector(":scope > .mobile-icon");
            if (stateIcon) stateIcon.alt = selected ? "已选择" : "";
          });
          const mode = panel.dataset.mobileCreateSettingPanel;
          createState[mode].model = selectedModel;
          createState[mode].cost = selectedCost;
          syncCreateSummary();
          setCreateModelPopover(false);
        });
      });
    });
    createAttachment?.addEventListener("click", openCreateReferencePicker);
    createReferenceList?.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const remove = event.target.closest("[data-mobile-create-reference-remove]");
      if (!remove || !createReferenceList.contains(remove)) return;
      removeCreateReference(remove.dataset.mobileCreateReferenceRemove);
    });
    createReferenceInput?.addEventListener("change", () => {
      const imageFiles = Array.from(createReferenceInput.files || []).filter((file) => !file.type || file.type.startsWith("image/"));
      if (!imageFiles.length) {
        createReferenceInput.value = "";
        showToast("请选择图片文件");
        return;
      }
      const references = activeCreateReferences();
      const limit = createReferenceLimits[createState.mode] || 0;
      const acceptedFiles = imageFiles.slice(0, Math.max(0, limit - references.length));
      acceptedFiles.forEach((file) => {
        references.push({
          id: `local-${Date.now()}-${createReferenceSequence += 1}`,
          name: file.name,
          url: URL.createObjectURL(file),
          isObjectUrl: true,
        });
      });
      createReferenceInput.value = "";
      renderCreateReferences();
      if (createState.mode === "video") showToast("已添加首帧图片");
      else if (acceptedFiles.length) showToast(`已添加 ${acceptedFiles.length} 张参考图，当前 ${references.length}/${limit} 张`);
      if (imageFiles.length > acceptedFiles.length) showToast(createState.mode === "video" ? "首帧图片只能添加 1 张" : `最多可添加 ${limit} 张参考图`);
    });
    window.addEventListener("pagehide", () => {
      Object.values(createReferences).flat().forEach((reference) => {
        if (reference.isObjectUrl) URL.revokeObjectURL(reference.url);
      });
      retiredCreateReferenceUrls.forEach((url) => URL.revokeObjectURL(url));
    }, { once: true });
    modelPopover?.addEventListener("toggle", () => {
      const open = modelPopover.open;
      modelPopover.classList.toggle("is-open", open);
      modelTrigger?.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        createComposer.querySelectorAll(".mobile-create-selector[open]").forEach((selector) => {
          if (selector !== modelPopover) selector.open = false;
        });
      }
    });
    createComposer.querySelectorAll(".mobile-create-selector").forEach((selector) => {
      if (selector === modelPopover) return;
      selector.addEventListener("toggle", () => {
        if (!selector.open) return;
        createComposer.querySelectorAll(".mobile-create-selector[open]").forEach((item) => {
          if (item !== selector) item.open = false;
        });
      });
    });
    document.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".mobile-create-selector")) return;
      createComposer.querySelectorAll(".mobile-create-selector[open]").forEach((selector) => { selector.open = false; });
    });
    document.querySelector("[data-mobile-create-history-open]")?.addEventListener("click", () => setCreateSheet(historySheet, true));
    document.querySelectorAll("[data-mobile-create-history-close]").forEach((button) => button.addEventListener("click", () => setCreateSheet(historySheet, false)));
    createPrompt?.addEventListener("input", syncCreatePrompt);
    const createTaskStates = {
      queue: { status: "排队中", progress: "18%", meta: "正在等待生成资源" },
      running: { status: "生成中", progress: "68%", meta: "任务会在后台继续" },
      success: { status: "生成成功", progress: "100%", meta: "已自动存入生成记录，点击预览查看结果" },
      failed: { status: "生成失败", progress: "", meta: "本次未生成作品" },
      unknown: { status: "状态待确认", progress: "", meta: "可稍后再次查看" },
    };
    const createResultUrl = (mode, model) => {
      const query = new URLSearchParams({ mode });
      if (model) query.set("model", model);
      if (sourceType) query.set("source", sourceType);
      return `./mobile-generation-result.html?${query.toString()}`;
    };
    const syncCreateTaskUrl = ({ mode, state, prompt, model }) => {
      const query = new URLSearchParams({ mode, state, prompt, model });
      if (sourceType) query.set("source", sourceType);
      window.history.replaceState(null, "", `${window.location.pathname}?${query.toString()}`);
    };
    let activeCreateTask = null;
    let previewEntranceAnimations = [];
    let previewEntranceSequence = 0;
    const cancelPreviewEntrance = () => {
      previewEntranceAnimations.forEach((animation) => animation.cancel());
      previewEntranceAnimations = [];
    };
    const playPreviewEntrance = (previewContent, sourceRect = null, sourceRadius = "14px") => {
      if (!previewDialog || window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof Element.prototype.animate !== "function") return;

      const closeButton = previewDialog.querySelector("[data-mobile-create-preview-close]:not(.mobile-create-preview-backdrop)");
      const toolbar = previewDialog.querySelector(".mobile-create-preview-toolbar");
      const toolbarButtons = [...(toolbar?.querySelectorAll("[data-mobile-create-preview-action]") || [])];
      const sequence = previewEntranceSequence += 1;
      const animateItem = (element, keyframes, options) => {
        if (!element) return;
        try {
          const animation = element.animate(keyframes, {
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "backwards",
            ...options,
          });
          previewEntranceAnimations.push(animation);
        } catch {
          // Progressive enhancement: the detail remains fully visible without motion.
        }
      };

      if (previewContent) {
        const targetRect = previewContent.getBoundingClientRect();
        const hasGeometry = sourceRect && sourceRect.width > 0 && sourceRect.height > 0 && targetRect.width > 0 && targetRect.height > 0;
        if (hasGeometry) {
          const translateX = sourceRect.left - targetRect.left;
          const translateY = sourceRect.top - targetRect.top;
          const scaleX = sourceRect.width / targetRect.width;
          const scaleY = sourceRect.height / targetRect.height;
          animateItem(previewContent, [
            {
              opacity: 0.84,
              borderRadius: sourceRadius,
              transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`,
              transformOrigin: "top left",
            },
            {
              opacity: 1,
              borderRadius: getComputedStyle(previewContent).borderRadius,
              transform: "translate3d(0, 0, 0) scale(1, 1)",
              transformOrigin: "top left",
            },
          ], { duration: 560 });
        } else {
          animateItem(previewContent, [
            { opacity: 0, transform: "scale(0.96)" },
            { opacity: 1, transform: "scale(1)" },
          ], { duration: 480 });
        }
      }

      animateItem(closeButton, [
        { opacity: 0, transform: "scale(0.92)" },
        { opacity: 1, transform: "scale(1)" },
      ], { delay: 190, duration: 340 });
      animateItem(toolbar, [
        { opacity: 0, transform: "translate3d(0, 10px, 0) scale(0.985)" },
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
      ], { delay: 270, duration: 430 });
      toolbarButtons.forEach((button, index) => {
        animateItem(button, [
          { opacity: 0, transform: "translate3d(0, 6px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ], { delay: 340 + index * 70, duration: 360 });
      });

      previewDialog.dataset.mobilePreviewEntrance = "running";
      Promise.allSettled(previewEntranceAnimations.map((animation) => animation.finished)).then(() => {
        if (sequence === previewEntranceSequence && previewDialog.classList.contains("is-open")) {
          previewDialog.dataset.mobilePreviewEntrance = "complete";
        }
      });
    };
    const setPreviewDialog = (open, sourcePreview = null, requestedMode = "image") => {
      if (!previewDialog) return;
      const previewMode = ["image", "video", "script"].includes(requestedMode) ? requestedMode : "image";
      const sourceContent = sourcePreview?.querySelector(":scope > :first-child") || sourcePreview;
      const sourceRect = open && sourceContent instanceof Element ? sourceContent.getBoundingClientRect() : null;
      const sourceRadius = open && sourceContent instanceof Element ? getComputedStyle(sourceContent).borderRadius : "14px";
      cancelPreviewEntrance();
      previewEntranceSequence += 1;
      let previewContent = null;
      if (open) {
        previewDialog.querySelectorAll("[data-mobile-create-preview-content]").forEach((content) => {
          const selected = content.dataset.mobileCreatePreviewContent === previewMode;
          content.hidden = !selected;
          if (selected) previewContent = content;
        });
        const previewStage = previewDialog.querySelector(".mobile-create-preview-stage");
        previewStage?.setAttribute("aria-label", `${previewMode === "video" ? "视频" : previewMode === "script" ? "剧本" : "图片"}生成结果预览`);
      }
      previewDialog.classList.toggle("is-open", open);
      previewDialog.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.classList.toggle("has-create-preview", open);
      if (open) playPreviewEntrance(previewContent, sourceRect, sourceRadius);
      else {
        previewDialog.querySelectorAll("video").forEach((video) => video.pause());
        delete previewDialog.dataset.mobilePreviewEntrance;
      }
    };
    const appendCreateTask = (submittedPrompt, initialState = "running", { scroll = false, restored = false } = {}) => {
      const taskMode = createState.mode;
      const taskKind = taskMode === "video" ? "视频" : taskMode === "script" ? "剧本" : "图片";
      const taskSettings = createState[taskMode];
      const taskModel = restored && params.get("model") ? params.get("model") : taskSettings.model;
      const taskReferences = activeCreateReferences().map(({ name, url }) => ({ name, url }));
      let taskState = createTaskStates[initialState] ? initialState : "running";
      const createThread = createWorkspace.querySelector(".mobile-create-thread");
      const now = new Date();
      const pad = (value) => String(value).padStart(2, "0");

      const userTurn = document.createElement("article");
      userTurn.className = "mobile-create-turn is-user";
      const taskHeading = document.createElement("div");
      taskHeading.className = "mobile-create-task-heading";
      const taskDate = document.createElement("h2");
      taskDate.className = "mobile-create-task-date";
      taskDate.textContent = `${now.getMonth() + 1}.${pad(now.getDate())}`;
      const submittedAt = document.createElement("time");
      submittedAt.dateTime = now.toISOString();
      submittedAt.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      taskHeading.append(taskDate, submittedAt);

      const submissionReferences = document.createElement("div");
      submissionReferences.className = "mobile-create-submission-references";
      submissionReferences.setAttribute("aria-label", taskMode === "video" ? "本次使用的首帧图片" : "本次使用的参考图");
      taskReferences.forEach((reference, index) => {
        const image = document.createElement("img");
        image.className = "mobile-create-submission-thumb";
        image.src = reference.url;
        image.alt = `${taskMode === "video" ? "首帧图片" : "参考图"} ${index + 1}：${reference.name}`;
        submissionReferences.append(image);
      });

      const submissionChips = document.createElement("div");
      submissionChips.className = "mobile-create-submission-chips";
      [taskModel, taskSettings.resolution, taskSettings.ratio, taskSettings.duration, `${taskSettings.cost} 积分`].filter(Boolean).forEach((text) => {
        const chip = document.createElement("span");
        chip.textContent = text;
        submissionChips.append(chip);
      });
      const userPrompt = document.createElement("p");
      userPrompt.className = "mobile-create-submission-prompt";
      userPrompt.textContent = submittedPrompt;
      userTurn.append(taskHeading);
      if (taskReferences.length) userTurn.append(submissionReferences);
      userTurn.append(submissionChips, userPrompt);

      const taskTurn = document.createElement("article");
      taskTurn.className = "mobile-create-turn is-task";
      taskTurn.dataset.mobileCreateTask = "";
      const taskPreview = document.createElement("button");
      taskPreview.className = `mobile-create-task-preview${taskMode === "video" ? " is-video" : taskMode === "script" ? " is-script" : ""}`;
      taskPreview.type = "button";
      const taskPreviewContent = document.createElement(taskMode === "script" ? "article" : "img");
      if (taskMode === "script") {
        taskPreviewContent.className = "mobile-create-script-preview";
        taskPreviewContent.innerHTML = "<span>Markdown 预览</span><strong>雨夜霓虹街头 · 分镜设定</strong><p>主角在雨幕中确认追踪者，镜头切入手部道具和远处剪影。</p><ul><li>人物与冲突已拆解</li><li>三段分镜节奏已生成</li></ul>";
      } else {
        taskPreviewContent.src = taskMode === "video" ? "../../assets/image_assets/4.png" : "../../assets/image_assets/15-mobile-result-v2.png";
        taskPreviewContent.alt = `${taskKind}生成结果预览`;
      }
      const taskProgress = document.createElement("span");
      taskProgress.className = "mobile-create-task-progress";
      const taskProgressCopy = document.createElement("span");
      const taskProgressStatus = document.createElement("strong");
      const taskProgressValue = document.createElement("span");
      taskProgressCopy.append(taskProgressStatus, document.createTextNode(" "), taskProgressValue);
      taskProgress.append(taskProgressCopy);
      const taskPreviewLabel = document.createElement("span");
      taskPreviewLabel.className = "mobile-create-task-preview-label";
      const taskPreviewIcon = document.createElement("img");
      taskPreviewIcon.className = "mobile-icon";
      taskPreviewIcon.src = "../../resources/icons/remixicon/svg/System/eye-line.svg";
      taskPreviewIcon.alt = "";
      taskPreviewLabel.append(taskPreviewIcon, document.createTextNode("查看结果"));
      taskPreview.append(taskPreviewContent, taskProgress, taskPreviewLabel);

      const taskSummary = document.createElement("div");
      taskSummary.className = "mobile-create-task-summary";
      taskSummary.setAttribute("role", "status");
      taskSummary.setAttribute("aria-live", "polite");
      const taskStatusIcon = document.createElement("img");
      taskStatusIcon.className = "mobile-icon mobile-create-task-status-icon";
      taskStatusIcon.src = "../../resources/icons/remixicon/svg/System/checkbox-circle-fill.svg";
      taskStatusIcon.alt = "";
      taskStatusIcon.hidden = true;
      const taskStatus = document.createElement("strong");
      const taskMeta = document.createElement("span");
      taskSummary.append(taskStatusIcon, taskStatus, taskMeta);
      taskTurn.append(taskPreview, taskSummary);

      const playSubmissionEntrance = () => {
        if (restored || window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof Element.prototype.animate !== "function") return;

        const animations = [];
        const animateItem = (element, keyframes, delay, duration = 380) => {
          if (!element) return;
          try {
            const animation = element.animate(keyframes, {
              delay,
              duration,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              fill: "backwards",
            });
            animations.push(animation);
          } catch {
            // Progressive enhancement: submitted content remains visible if motion is unavailable.
          }
        };
        const riseIn = [
          { opacity: 0, transform: "translate3d(0, 7px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ];
        const imageIn = [
          { opacity: 0, transform: "scale(0.96)" },
          { opacity: 1, transform: "scale(1)" },
        ];

        let nextDelay = 0;
        animateItem(taskHeading, riseIn, nextDelay, 360);
        nextDelay += 62;
        [...submissionReferences.children].forEach((reference) => {
          animateItem(reference, imageIn, nextDelay, 360);
          nextDelay += 38;
        });
        [...submissionChips.children].forEach((chip) => {
          animateItem(chip, riseIn, nextDelay, 360);
          nextDelay += 34;
        });
        nextDelay += 18;
        animateItem(userPrompt, riseIn, nextDelay, 400);
        animateItem(taskTurn, [{ opacity: 0 }, { opacity: 1 }], nextDelay + 82, 420);

        Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
          taskTurn.dataset.submissionEntrance = "complete";
        });
      };

      let taskController = null;
      const openTaskResult = () => {
        activeCreateTask = taskController;
        if (taskState !== "success") {
          taskState = "success";
          renderCreateTask();
          showToast("生成完成，可点击查看结果");
          return;
        }
        if (previewDialog) setPreviewDialog(true, taskPreview, taskMode);
        else window.location.href = createResultUrl(taskMode, taskModel);
      };
      const renderCreateTask = () => {
        const previousState = taskTurn.dataset.state || "";
        const state = createTaskStates[taskState];
        taskTurn.classList.remove("is-completing");
        taskTurn.dataset.state = taskState;
        taskStatus.textContent = state.status;
        taskMeta.textContent = taskState === "success" ? state.meta : `${taskModel} · ${state.meta}`;
        taskStatusIcon.hidden = taskState !== "success";
        taskProgressStatus.textContent = state.status;
        taskProgressValue.textContent = state.progress;
        taskPreviewLabel.hidden = taskState !== "success";
        taskPreview.setAttribute("aria-label", taskState === "success" ? "查看生成结果" : "更新生成状态");
        syncCreateTaskUrl({ mode: taskMode, state: taskState, prompt: submittedPrompt, model: taskModel });
        if (taskState === "success" && previousState && previousState !== "success") {
          void taskTurn.offsetWidth;
          taskTurn.classList.add("is-completing");
        }
      };
      const removeTask = () => {
        userTurn.remove();
        taskTurn.remove();
        const hasRemainingTasks = Boolean(createThread?.querySelector("[data-mobile-create-task]"));
        document.body.classList.toggle("has-create-task", hasRemainingTasks);
        if (createEmpty) createEmpty.hidden = hasRemainingTasks;
        if (!hasRemainingTasks) {
          setCreateComposerCollapsed(false);
          createPrompt.placeholder = createState.mode === "script" ? "人物关系、核心冲突或短片想法" : createState.mode === "video" ? "画面内容、镜头运动和节奏" : "主体、场景、风格、光线和构图";
          window.history.replaceState(null, "", window.location.pathname);
        }
        if (activeCreateTask === taskController) activeCreateTask = null;
      };
      const regenerateTask = () => {
        setPreviewDialog(false);
        taskState = "running";
        renderCreateTask();
        taskTurn.scrollIntoView({ behavior: "smooth", block: "center" });
        showToast("已重新发起生成");
      };
      taskController = { remove: removeTask, regenerate: regenerateTask, complete: openTaskResult };
      taskPreview.addEventListener("click", openTaskResult);
      renderCreateTask();
      if (createEmpty) createEmpty.hidden = true;
      document.body.classList.add("has-create-task");
      if (createThread) {
        const turnAnchor = createThread.querySelector("[data-mobile-create-empty]");
        createThread.insertBefore(userTurn, turnAnchor);
        createThread.insertBefore(taskTurn, turnAnchor);
      }
      playSubmissionEntrance();
      createPrompt.value = "";
      syncCreatePrompt();
      setCreateComposerCollapsed(true);
      activeCreateTask = taskController;
      if (scroll) taskTurn.scrollIntoView({ behavior: "auto", block: "center" });
    };
    createComposer.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!createPrompt?.value.trim()) {
        if (createError) createError.textContent = "请输入提示词";
        createPrompt?.focus();
        return;
      }
      const submittedPrompt = createPrompt.value.trim();
      appendCreateTask(submittedPrompt, "running", { scroll: true });
      showToast(createState.mode === "script" ? "剧本创作任务已创建" : "生成任务已创建");
    });
    document.querySelectorAll("[data-mobile-create-preview-close]").forEach((button) => {
      button.addEventListener("click", () => setPreviewDialog(false));
    });
    document.querySelectorAll("[data-mobile-create-preview-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.mobileCreatePreviewAction;
        if (action === "regenerate") activeCreateTask?.regenerate?.();
        else if (action === "publish") showToast("作品已提交发布");
        else if (action === "activity") window.location.assign("./mobile-campaign-detail.html#mobile-campaign-participation");
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      setPreviewDialog(false);
      setCreateModelPopover(false);
      createComposer.querySelectorAll(".mobile-create-selector[open]").forEach((selector) => { selector.open = false; });
      setCreateSheet(historySheet, false);
    });
    const restoredModel = params.get("model");
    if (restoredModel) {
      const restoredPanel = [...document.querySelectorAll("[data-mobile-create-setting-panel]")]
        .find((panel) => panel.dataset.mobileCreateSettingPanel === createState.mode);
      const restoredModelButton = [...(restoredPanel?.querySelectorAll("[data-mobile-create-model]") || [])]
        .find((button) => button.dataset.mobileCreateModel === restoredModel);
      if (restoredModelButton) {
        createState[createState.mode].model = restoredModel;
        createState[createState.mode].cost = Number(restoredModelButton.dataset.mobileCreateCost);
        restoredPanel.querySelectorAll("[data-mobile-create-model]").forEach((button) => {
          const selected = button === restoredModelButton;
          button.classList.toggle("is-selected", selected);
          button.setAttribute("aria-pressed", selected ? "true" : "false");
          const stateIcon = button.querySelector(":scope > .mobile-icon");
          if (stateIcon) stateIcon.alt = selected ? "已选择" : "";
        });
      }
    }
    syncCreateMode(createState.mode);
    renderCreateSource();
    const restoredTaskState = params.get("state");
    const restoredPrompt = params.get("prompt") || (restoredTaskState
      ? (createState.mode === "video"
        ? "雷云中金龙与白虎对峙，镜头环绕战场。"
        : createState.mode === "script"
          ? "雨夜霓虹街头，少年发现自己被跟踪，手中藏着一件不能暴露的关键道具。"
          : "凤冠神女站在金色逆光中，电影感人物海报。")
      : "");
    if (restoredPrompt) {
      createPrompt.value = restoredPrompt;
      syncCreatePrompt();
      if (restoredTaskState) appendCreateTask(restoredPrompt, restoredTaskState, { restored: true });
    } else {
      syncCreatePrompt();
    }
    playCreateEntrance();
  }

  const campaignChoiceSheet = document.querySelector("[data-mobile-campaign-choice-sheet]");
  const campaignUploadSheet = document.querySelector("[data-mobile-campaign-upload-sheet]");
  const campaignUploadForm = document.querySelector("[data-mobile-campaign-upload-form]");
  if (campaignChoiceSheet && campaignUploadSheet && campaignUploadForm) {
    const campaignUploadInput = campaignUploadForm.querySelector("[data-mobile-campaign-upload-input]");
    const campaignUploadPreview = campaignUploadForm.querySelector("[data-mobile-campaign-upload-preview]");
    const campaignUploadLabel = campaignUploadForm.querySelector("[data-mobile-campaign-upload-label]");
    const campaignUploadTitle = campaignUploadForm.querySelector("[data-mobile-campaign-upload-title]");
    const campaignUploadDescription = campaignUploadForm.querySelector("[data-mobile-campaign-upload-description]");
    const campaignUploadError = campaignUploadForm.querySelector("[data-mobile-campaign-upload-error]");
    let campaignUploadObjectUrl = "";
    const setCampaignSheet = (sheet, open) => {
      sheet.classList.toggle("is-open", open);
      sheet.setAttribute("aria-hidden", open ? "false" : "true");
    };
    document.querySelectorAll("[data-mobile-campaign-participate]").forEach((button) => button.addEventListener("click", () => setCampaignSheet(campaignChoiceSheet, true)));
    campaignChoiceSheet.querySelectorAll("[data-mobile-campaign-choice-close]").forEach((button) => button.addEventListener("click", () => setCampaignSheet(campaignChoiceSheet, false)));
    campaignChoiceSheet.querySelector("[data-mobile-campaign-direct-upload]")?.addEventListener("click", () => {
      setCampaignSheet(campaignChoiceSheet, false);
      setCampaignSheet(campaignUploadSheet, true);
    });
    campaignUploadSheet.querySelectorAll("[data-mobile-campaign-upload-close]").forEach((button) => button.addEventListener("click", () => setCampaignSheet(campaignUploadSheet, false)));
    campaignUploadInput?.addEventListener("change", () => {
      const file = campaignUploadInput.files?.[0];
      if (!file) return;
      if (campaignUploadObjectUrl) URL.revokeObjectURL(campaignUploadObjectUrl);
      campaignUploadObjectUrl = URL.createObjectURL(file);
      if (campaignUploadPreview) {
        campaignUploadPreview.src = campaignUploadObjectUrl;
        campaignUploadPreview.hidden = false;
      }
      if (campaignUploadLabel) campaignUploadLabel.textContent = file.name;
      if (campaignUploadError) campaignUploadError.textContent = "";
    });
    campaignUploadForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = campaignUploadTitle?.value.trim() || "";
      const description = campaignUploadDescription?.value.trim() || "";
      const file = campaignUploadInput?.files?.[0];
      if (!file) {
        if (campaignUploadError) campaignUploadError.textContent = "请选择要投稿的原创图片";
        campaignUploadInput?.focus();
        return;
      }
      if (title.length < 4) {
        if (campaignUploadError) campaignUploadError.textContent = "作品标题不少于 4 个字";
        campaignUploadTitle?.focus();
        return;
      }
      if (description.length < 30) {
        if (campaignUploadError) campaignUploadError.textContent = "作品说明不少于 30 个字";
        campaignUploadDescription?.focus();
        return;
      }
      setCampaignSheet(campaignUploadSheet, false);
      showToast("作品已提交活动审核");
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      setCampaignSheet(campaignChoiceSheet, false);
      setCampaignSheet(campaignUploadSheet, false);
    });
  }

  document.querySelectorAll("[data-mobile-choice-group]").forEach((group) => {
    const name = group.dataset.choiceName;
    const form = group.closest("form");
    const ensureValue = () => {
      if (!name || !form) return;
      let hidden = form.querySelector(`input[type="hidden"][name="${name}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = name;
        form.append(hidden);
      }
      hidden.value = group.querySelector("[data-mobile-choice].is-selected")?.dataset.mobileChoice || "";
    };
    ensureValue();
    group.querySelectorAll("[data-mobile-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        group.querySelectorAll("[data-mobile-choice]").forEach((item) => item.classList.toggle("is-selected", item === button));
        ensureValue();
      });
    });
  });

  document.querySelectorAll("[data-mobile-upload]").forEach((button) => {
    button.addEventListener("click", () => {
      const uploaded = button.classList.toggle("is-uploaded");
      const label = button.querySelector("[data-mobile-upload-label]");
      if (label) label.textContent = uploaded ? "已添加参考图" : "上传图片";
      showToast(uploaded ? "已添加参考图" : "已移除参考图");
    });
  });

  document.querySelectorAll("[data-mobile-prompt]").forEach((input) => {
    const count = input.closest(".mobile-form-section")?.querySelector("[data-mobile-prompt-count]");
    const syncCount = () => {
      if (count) count.textContent = String(input.value.length);
    };
    if (params.get("prompt")) {
      input.value = params.get("prompt");
    } else if (params.get("source") === "same-work") {
      input.value = body.dataset.mobilePage === "create-video"
        ? "海边灯塔被薄雾包围，镜头缓慢抬升，最后停在灯塔亮起的瞬间。"
        : "凤冠神女站在暗红色殿堂入口，金色逆光勾勒轮廓，电影感人物海报。";
    }
    syncCount();
    input.addEventListener("input", syncCount);
  });

  document.querySelectorAll("[data-mobile-generator-form]").forEach((form) => {
    const generationMode = form.dataset.generatorMode === "video" ? "video" : "image";
    const generationKind = generationMode === "video" ? "视频" : "图片";
    const generationModel = generationMode === "video" ? "Seedance 2.0" : "Flux Pro 1.1";
    const generationSource = params.get("source") || "";
    const taskCard = document.querySelector("[data-mobile-inline-generation]");
    const badge = taskCard?.querySelector("[data-mobile-inline-generation-badge]");
    const stateTitle = taskCard?.querySelector("[data-mobile-inline-generation-state]");
    const stateMessage = taskCard?.querySelector("[data-mobile-inline-generation-message]");
    const progress = taskCard?.querySelector("[data-mobile-inline-generation-progress]");
    const preview = taskCard?.querySelector("[data-mobile-inline-generation-preview]");
    const previewLabel = taskCard?.querySelector("[data-mobile-inline-generation-preview-label]");
    const spinner = taskCard?.querySelector("[data-mobile-inline-generation-spinner]");
    const model = taskCard?.querySelector("[data-mobile-inline-generation-model]");
    const taskAction = taskCard?.querySelector("[data-mobile-inline-generation-action]");
    const taskActionLabel = taskCard?.querySelector("[data-mobile-inline-generation-action-label]");
    const submitButton = document.querySelector(`[data-mobile-generator-submit][form="${form.id}"]`);
    const submitLabel = submitButton?.querySelector("[data-mobile-generator-submit-label]");
    const costLabel = submitButton?.closest(".mobile-form-action-bar")?.querySelector(".mobile-cost span");
    let generationState = params.get("state") || "";
    const stateMap = {
      queue: { badge: "排队中", badgeClass: "is-running", title: `正在等待${generationKind}生成`, message: "当前进度 18%", progress: 18, action: "刷新状态" },
      running: { badge: "生成中", badgeClass: "is-running", title: `正在生成${generationKind}`, message: "已完成 68%", progress: 68, action: "刷新状态" },
      success: { badge: "生成成功", badgeClass: "is-success", title: `${generationKind}已生成`, message: "点击结果预览进入结果页", progress: 100, action: "查看结果" },
      failed: { badge: "生成失败", badgeClass: "is-warning", title: "生成失败", message: "内容未通过安全校验，请调整提示词", progress: 100, action: "返回修改" },
      unknown: { badge: "状态未知", badgeClass: "is-warning", title: "状态暂不可确认", message: "任务仍在后台处理，可稍后刷新", progress: 42, action: "刷新状态" },
    };
    const resultUrl = () => {
      const query = new URLSearchParams({ mode: generationMode });
      if (generationSource) query.set("source", generationSource);
      return `./mobile-generation-result.html?${query.toString()}`;
    };
    const syncTaskUrl = () => {
      const query = new URLSearchParams(new FormData(form));
      if (generationState) query.set("state", generationState);
      query.set("model", generationModel);
      if (generationSource) query.set("source", generationSource);
      window.history.replaceState(null, "", `${window.location.pathname}?${query.toString()}`);
    };
    const renderTask = ({ focus = false } = {}) => {
      if (!taskCard || !generationState) {
        if (taskCard) taskCard.hidden = true;
        if (submitButton) submitButton.disabled = false;
        if (submitLabel) submitLabel.textContent = "发起生成";
        if (costLabel) costLabel.textContent = "预计 20 积分";
        return;
      }
      const data = stateMap[generationState] || stateMap.running;
      taskCard.hidden = false;
      taskCard.dataset.state = generationState;
      if (badge) {
        badge.textContent = data.badge;
        badge.className = `mobile-status-badge ${data.badgeClass}`;
      }
      if (stateTitle) stateTitle.textContent = data.title;
      if (stateMessage) stateMessage.textContent = data.message;
      if (progress) progress.style.width = `${data.progress}%`;
      if (model) model.textContent = `${params.get("model") || generationModel} · ${generationKind}生成`;
      if (taskActionLabel) taskActionLabel.textContent = data.action;
      if (spinner) spinner.hidden = generationState === "success" || generationState === "failed";
      if (previewLabel) previewLabel.hidden = generationState !== "success";
      if (preview) {
        const ready = generationState === "success";
        preview.setAttribute("aria-disabled", ready ? "false" : "true");
        preview.setAttribute("aria-label", ready ? `查看${generationKind}生成结果` : `${generationKind}生成中，结果暂不可查看`);
      }
      if (submitButton) submitButton.disabled = generationState === "running" || generationState === "queue" || generationState === "unknown";
      if (submitLabel) submitLabel.textContent = generationState === "success" ? "再次生成" : generationState === "failed" ? "调整后重试" : "生成中";
      if (costLabel) costLabel.textContent = generationState === "success" ? "结果已生成" : generationState === "failed" ? "本次未生成" : "任务生成中";
      if (focus) taskCard.scrollIntoView({ behavior: "auto", block: "start" });
    };
    const openResult = () => {
      if (generationState !== "success") {
        showToast("生成完成后可查看结果");
        return;
      }
      window.location.href = resultUrl();
    };
    if (generationState) renderTask();
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const prompt = form.querySelector("[data-mobile-prompt]");
      const error = form.querySelector("[data-mobile-generator-error]");
      if (!prompt?.value.trim()) {
        if (error) error.textContent = "请输入提示词";
        prompt?.focus();
        return;
      }
      if (error) error.textContent = "";
      generationState = "running";
      syncTaskUrl();
      renderTask({ focus: true });
      showToast("生成任务已创建，可留在当前页查看进度");
    });
    preview?.addEventListener("click", openResult);
    taskAction?.addEventListener("click", () => {
      if (generationState === "success") {
        openResult();
        return;
      }
      if (generationState === "failed") {
        generationState = "";
        syncTaskUrl();
        renderTask();
        form.querySelector("[data-mobile-prompt]")?.focus();
        return;
      }
      generationState = "success";
      syncTaskUrl();
      renderTask();
      showToast("生成完成，可点击结果预览");
    });
  });

  const resultScreen = document.querySelector("[data-mobile-result-screen]");
  if (resultScreen) {
    document.documentElement.classList.add("mobile-result-document");
    const requestedResultMode = params.get("mode");
    const resultMode = ["image", "script", "video"].includes(requestedResultMode) ? requestedResultMode : "image";
    const resultSource = params.get("source") || "";
    const resultModel = params.get("model") || "";
    const activitySources = new Set(["campaign", "competition", "prompt"]);
    const activityResult = activitySources.has(resultSource);
    const image = document.querySelector("[data-mobile-result-image]");
    const video = document.querySelector("[data-mobile-result-video]");
    const script = document.querySelector("[data-mobile-result-script]");
    const resultMedia = document.querySelector(".mobile-result-media");
    const title = document.querySelector("[data-mobile-result-title]");
    const meta = document.querySelector("[data-mobile-result-meta]");
    const prompt = document.querySelector("[data-mobile-result-prompt]");
    const promptRegion = document.querySelector("[data-mobile-result-prompt-region]");
    const promptToggle = document.querySelector("[data-mobile-result-prompt-toggle]");
    const promptToggleLabel = document.querySelector("[data-mobile-result-prompt-toggle-label]");
    const retry = document.querySelector("[data-mobile-result-retry]");
    if (resultMode === "image" && resultModel && meta) meta.textContent = `${resultModel} · 3:4`;
    if (resultMode === "video") {
      if (image) image.hidden = true;
      if (video) video.hidden = false;
      if (title) title.textContent = "海灯守望";
      if (meta) meta.textContent = `${resultModel || "Seedance 2.0"} · 16:9 / 8 秒`;
      if (prompt) prompt.textContent = "暮色中的海边灯塔被潮湿薄雾包围，远处海浪反射出零碎的冷蓝色月光。镜头从礁石与翻涌浪花开始，缓慢向上抬升并绕过塔身，掠过被海风吹动的旧旗与斑驳墙面。最后灯塔暖黄色光束点亮，在雾中旋转扫过海面，画面停留在光束与远方船影交汇的瞬间，整体保持克制、孤独又温暖的电影质感。";
    }
    if (resultMode === "script") {
      if (image) image.hidden = true;
      if (video) video.hidden = true;
      if (script) script.hidden = false;
      resultMedia?.classList.add("is-script");
      if (title) title.textContent = "雨夜霓虹街头 · 分镜设定";
      if (meta) meta.textContent = `${resultModel || "gemini-3-flash-preview"} · Markdown 文本`;
      if (prompt) prompt.textContent = "雨夜霓虹街头，少年发现自己被跟踪，手中藏着一件不能暴露的关键道具。请拆解人物关系、核心冲突、三幕节奏和可执行分镜，并保留悬念式结尾。";
    }
    if (retry) {
      const retryQuery = new URLSearchParams({ mode: resultMode });
      if (resultModel) retryQuery.set("model", resultModel);
      if (resultSource) retryQuery.set("source", resultSource);
      retry.href = `./mobile-create.html?${retryQuery.toString()}`;
    }
    promptToggle?.addEventListener("click", () => {
      const expanded = promptToggle.getAttribute("aria-expanded") === "true";
      promptToggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      promptRegion?.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (promptToggleLabel) promptToggleLabel.textContent = expanded ? "展开创作信息" : "收起创作信息";
    });
    const resultPrimary = document.querySelector("[data-mobile-result-primary]");
    const resultPrimaryLabel = document.querySelector("[data-mobile-result-primary-label]");
    const resultPrimaryIcon = document.querySelector("[data-mobile-result-primary-icon]");
    const destinationSheet = document.querySelector("[data-mobile-result-destination-sheet]");
    const destinationList = document.querySelector("[data-mobile-result-destination-list]");
    const communityDestination = document.querySelector('[data-mobile-result-destination="community"]');
    const activityDestination = document.querySelector('[data-mobile-result-destination="activity"]');
    const activityDestinationLabel = document.querySelector("[data-mobile-result-activity-label]");
    const setDestinationSheet = (open) => {
      if (!destinationSheet) return;
      destinationSheet.classList.toggle("is-open", open);
      destinationSheet.setAttribute("aria-hidden", open ? "false" : "true");
    };
    if (activityResult) {
      if (activityDestinationLabel) activityDestinationLabel.textContent = "提交到当前活动";
      if (destinationList && activityDestination) destinationList.prepend(activityDestination);
      if (resultPrimaryIcon) resultPrimaryIcon.src = "../../resources/icons/remixicon/svg/Document/file-check-line.svg";
    }
    destinationSheet?.querySelectorAll("[data-mobile-result-destination-close]").forEach((button) => button.addEventListener("click", () => setDestinationSheet(false)));
    const publishResult = () => {
      if (!resultPrimary || resultPrimary.getAttribute("aria-disabled") === "true") return;
      setDestinationSheet(false);
      resultPrimary.setAttribute("aria-disabled", "true");
      if (resultPrimaryLabel) resultPrimaryLabel.textContent = "发布审核中";
      showToast("作品已提交发布");
    };
    communityDestination?.addEventListener("click", publishResult);
    activityDestination?.addEventListener("click", () => {
      setDestinationSheet(false);
      if (resultSource === "prompt") {
        window.location.assign("./mobile-activity-detail.html#mobile-activity-participation");
        return;
      }
      window.location.assign("./mobile-campaign-detail.html#mobile-campaign-participation");
    });
    resultPrimary?.addEventListener("click", () => {
      if (resultPrimary.getAttribute("aria-disabled") === "true") {
        showToast("作品已提交发布");
        return;
      }
      setDestinationSheet(true);
    });
  }

  const submissionScreen = document.querySelector("[data-mobile-submission-screen]");
  if (submissionScreen) {
    const editButton = document.querySelector("[data-mobile-submission-edit]");
    const editor = document.querySelector("[data-mobile-submission-editor]");
    const copy = document.querySelector("[data-mobile-submission-copy]");
    const count = document.querySelector("[data-mobile-submission-count]");
    const error = document.querySelector("[data-mobile-submission-error]");
    copy?.addEventListener("input", () => {
      if (count) count.textContent = String(copy.value.length);
    });
    editButton?.addEventListener("click", () => {
      if (editor?.hidden) {
        editor.hidden = false;
        editButton.querySelector("span").textContent = "确认重投";
        editor.scrollIntoView({ block: "center", behavior: "auto" });
        window.setTimeout(() => copy?.focus(), 180);
        return;
      }
      if (!copy?.value.trim()) {
        if (error) error.textContent = "请输入作品说明";
        copy?.focus();
        return;
      }
      if (error) error.textContent = "";
      editor.hidden = true;
      const badge = document.querySelector("[data-mobile-submission-status]");
      const statusText = document.querySelector("[data-mobile-submission-status-text]");
      const title = document.querySelector("#mobile-submission-status-title");
      const reason = document.querySelector("[data-mobile-submission-reason]");
      if (badge) {
        badge.textContent = "审核中";
        badge.className = "mobile-status-badge is-running";
      }
      if (statusText) statusText.textContent = "审核中";
      if (title) title.textContent = "作品已重新提交";
      if (reason) reason.textContent = "审核结果将在消息中心同步。";
      editButton.querySelector("span").textContent = "审核中";
      editButton.disabled = true;
      const history = document.querySelector(".mobile-submission-history ol");
      if (history) {
        const item = document.createElement("li");
        item.innerHTML = "<span></span><div><strong>已重新提交</strong><p>刚刚</p></div>";
        history.prepend(item);
      }
      showToast("投稿已重新提交");
    });
  }

  const scrollKey = `mobile-scroll:${window.location.pathname}`;
  const savedScroll = Number(sessionStorage.getItem(scrollKey) || 0);
  if (savedScroll > 0 && !window.location.hash) window.requestAnimationFrame(() => window.scrollTo(0, savedScroll));
  window.addEventListener("pagehide", () => sessionStorage.setItem(scrollKey, String(window.scrollY)));
})();
