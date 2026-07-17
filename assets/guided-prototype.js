(function () {
  "use strict";

  const symptomGroups = {
    sleep: {
      title: "睡眠・疲労・朝のつらさに関するページ",
      description: "近い内容からお読みください。複数のページを見比べても問題ありません。",
      links: [
        ["不眠", "insomnia.html"],
        ["慢性疲労", "fatigue.html"],
        ["起立性調節障害", "orthostatic-dysregulation.html"],
        ["自律神経失調症", "autonomic.html"]
      ]
    },
    balance: {
      title: "めまい・不安・呼吸に関するページ",
      description: "感じ方や経過は人によって異なります。現在の状態に近い項目をご覧ください。",
      links: [
        ["めまい", "dizziness.html"],
        ["動悸", "palpitations.html"],
        ["不安障害", "anxiety-disorder.html"],
        ["息苦しさ", "shortness-of-breath.html"],
        ["パニック症状", "panic.html"]
      ]
    },
    digestive: {
      title: "胃腸・皮膚の不調に関するページ",
      description: "胃腸や皮膚の状態と、緊張・睡眠などの関係をページごとにまとめています。",
      links: [
        ["アトピー", "atopic.html"],
        ["過敏性腸症候群", "ibs.html"],
        ["胃の不快感", "stomach-discomfort.html"],
        ["吐き気", "nausea.html"],
        ["慢性便秘", "chronic-constipation.html"]
      ]
    },
    body: {
      title: "頭・顎・身体の痛みに関するページ",
      description: "負担が出ている場所だけでなく、身体全体の使い方との関係もご案内しています。",
      links: [
        ["頭痛", "headache.html"],
        ["顎関節症", "tmj.html"],
        ["耳鳴り", "tinnitus.html"],
        ["腱鞘炎", "tenosynovitis.html"],
        ["足底筋膜炎", "plantar-fasciitis.html"]
      ]
    }
  };

  const screenLabels = {
    home: "目的を選択してください",
    symptoms: "症状について",
    "first-visit": "初めての方へ",
    price: "料金・通院について"
  };

  function setupMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      menu.classList.toggle("is-open", open);
      const label = toggle.querySelector(".sr-only");
      if (label) label.textContent = open ? "メニューを閉じる" : "メニューを開く";
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (menu.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });
  }

  function setupGuide() {
    const app = document.querySelector("[data-guide-app]");
    if (!app) return;

    const screens = Array.from(app.querySelectorAll("[data-guide-screen]"));
    const status = document.getElementById("guide-status-text");
    const reset = app.querySelector("[data-guide-reset]");

    function showScreen(name, options) {
      const settings = Object.assign({ scroll: false, focus: false }, options || {});
      const next = screens.find(function (screen) {
        return screen.dataset.guideScreen === name;
      });
      if (!next) return;

      screens.forEach(function (screen) {
        const active = screen === next;
        screen.hidden = !active;
        screen.setAttribute("aria-hidden", String(!active));
      });

      if (status) status.textContent = screenLabels[name] || "ご案内";
      if (reset) reset.hidden = name === "home";

      if (settings.scroll) {
        document.getElementById("guided-entry").scrollIntoView({ behavior: "smooth", block: "start" });
      }

      if (settings.focus) {
        window.setTimeout(function () {
          const heading = next.querySelector("h3, button, a");
          if (!heading) return;
          if (/^H[1-6]$/.test(heading.tagName)) heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }, settings.scroll ? 520 : 40);
      }
    }

    app.querySelectorAll("[data-guide-open]").forEach(function (button) {
      button.addEventListener("click", function () {
        showScreen(button.dataset.guideOpen, { focus: true });
      });
    });

    document.querySelectorAll("[data-guide-target]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        const target = link.dataset.guideTarget;
        if (!screenLabels[target]) return;
        event.preventDefault();
        showScreen(target, { scroll: true, focus: true });
      });
    });

    if (reset) {
      reset.addEventListener("click", function () {
        showScreen("home", { focus: true });
      });
    }

    setupSymptomResults(app);
  }

  function setupSymptomResults(app) {
    const result = document.getElementById("symptom-result");
    const title = document.getElementById("symptom-result-title");
    const description = document.getElementById("symptom-result-description");
    const links = document.getElementById("symptom-result-links");
    const buttons = Array.from(app.querySelectorAll("[data-symptom-group]"));
    if (!result || !title || !description || !links || !buttons.length) return;

    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", function () {
        const group = symptomGroups[button.dataset.symptomGroup];
        if (!group) return;

        buttons.forEach(function (item) {
          const selected = item === button;
          item.classList.toggle("is-selected", selected);
          item.setAttribute("aria-pressed", String(selected));
        });

        title.textContent = group.title;
        description.textContent = group.description;
        links.replaceChildren();

        group.links.forEach(function (entry) {
          const anchor = document.createElement("a");
          anchor.href = entry[1];
          anchor.textContent = entry[0];
          links.appendChild(anchor);
        });

        result.hidden = false;

        if (window.matchMedia("(max-width: 760px)").matches) {
          window.setTimeout(function () {
            result.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }, 30);
        }
      });
    });
  }

  function setupReveal() {
    const targets = document.querySelectorAll(
      ".section-heading, .guide-app, .split-heading, .principle-grid article, .space-copy, .space-image, .final-cta-inner"
    );
    targets.forEach(function (target) {
      target.setAttribute("data-reveal", "");
    });

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach(function (target) {
        target.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6%" });

    targets.forEach(function (target) {
      observer.observe(target);
    });
  }

  function setupToTop() {
    const button = document.querySelector(".to-top");
    if (!button) return;

    function update() {
      button.classList.toggle("is-visible", window.scrollY > 560);
    }

    window.addEventListener("scroll", update, { passive: true });
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    update();
  }

  function init() {
    setupMenu();
    setupGuide();
    setupReveal();
    setupToTop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
