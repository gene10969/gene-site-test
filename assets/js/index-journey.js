(function () {
  "use strict";

  const LINE_URL = "https://lin.ee/6bBKc67";
  const HOME_URL = location.hostname.endsWith("github.io") ? "index.html" : "/";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function track(eventName, parameters) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, Object.assign({
      event_category: "index_journey",
      source_page: location.pathname.split("/").pop() || "index.html"
    }, parameters || {}));
  }

  function normalize(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function cardTitle(element) {
    const heading = element.querySelector("h2, h3");
    return heading ? normalize(heading.textContent) : "";
  }

  function cardKey(element) {
    const title = cardTitle(element);
    if (element.classList.contains("gene-guide-card")) return "route";
    if (element.classList.contains("gene-cvr-problem-section")) return "concerns";
    if (element.classList.contains("top-atopic-focus")) return "atopic";
    if (element.classList.contains("top-case-card")) return "cases";
    if (element.classList.contains("top-symptom-seo-card")) return "symptom_index";
    if (element.classList.contains("top-access-card")) return "access";
    if (element.classList.contains("top-cta-card")) return "contact";
    if (element.classList.contains("gene-check-invite") && title.indexOf("健康は") === 0) return "lifestyle";
    if (element.classList.contains("gene-check-invite") && title === "現在の状態を確認したい方へ") return "check";
    if (title === "当院が選ばれる理由") return "reasons";
    if (title === "geneの6つの安心") return "safety";
    if (title === "自律神経が落ち着きやすい環境づくり") return "environment";
    if (title === "施術を受ける前にご確認ください") return "policy";
    if (title === "ごあいさつ") return "director";
    if (title === "初めての方へ") return "first_time";
    if (title === "よくあるご質問") return "faq";
    if (title === "大切にしていること") return "values";
    if (title === "最後に") return "final_message";
    if (title === "ご予約の流れ") return "flow";
    return "other";
  }

  function findCard(container, key) {
    return Array.from(container.children).find(function (element) {
      return cardKey(element) === key;
    }) || null;
  }

  function reorderExistingCards(container) {
    const order = {
      route: 10,
      concerns: 30,
      first_time: 40,
      reasons: 50,
      safety: 60,
      environment: 70,
      atopic: 80,
      cases: 90,
      director: 100,
      values: 110,
      lifestyle: 120,
      symptom_index: 130,
      policy: 140,
      faq: 150,
      check: 160,
      final_message: 170,
      flow: 180,
      access: 190,
      contact: 200
    };
    const original = Array.from(container.children);
    const positions = new Map(original.map(function (element, index) {
      return [element, index];
    }));

    original.sort(function (a, b) {
      const aRank = order[cardKey(a)] || 500 + positions.get(a);
      const bRank = order[cardKey(b)] || 500 + positions.get(b);
      return aRank - bRank;
    });
    original.forEach(function (element) {
      container.appendChild(element);
    });
  }

  function assignSectionIds(container) {
    const ids = {
      route: "gene-route-guide",
      concerns: "gene-concerns",
      first_time: "gene-first-time",
      reasons: "gene-reasons",
      safety: "gene-safety",
      environment: "gene-environment",
      atopic: "gene-atopic",
      cases: "gene-cases",
      director: "gene-director",
      values: "gene-values",
      lifestyle: "gene-lifestyle",
      symptom_index: "gene-symptom-index",
      policy: "gene-before-treatment",
      faq: "gene-faq",
      check: "gene-condition-check",
      final_message: "gene-final-message",
      flow: "gene-booking-flow",
      access: "gene-access",
      contact: "gene-contact"
    };
    Array.from(container.children).forEach(function (element) {
      const id = ids[cardKey(element)];
      if (id) element.id = id;
    });
  }

  function adaptRouteGuide(container) {
    const guide = findCard(container, "route");
    if (!guide) return;
    const options = guide.querySelectorAll(".gene-guide-option");
    if (options[0]) {
      options[0].href = "#gene-sensation-guide";
      const title = options[0].querySelector("strong");
      const copy = options[0].querySelector("small");
      if (title) title.textContent = "今の感覚から探す";
      if (copy) copy.textContent = "症状名が分からなくても、今感じていることに近い項目から確認できます。";
      options[0].dataset.geneCta = "intro_feeling";
    }
    if (options[1]) options[1].dataset.geneCta = "intro_check";
    if (options[2]) options[2].dataset.geneCta = "intro_line";
  }

  const symptomGroups = [
    {
      label: "ぐるぐる・ふわふわする",
      hint: "めまい・ふらつき・耳鳴りが気になる",
      links: [["めまい", "dizziness.html"], ["耳鳴り", "tinnitus.html"]]
    },
    {
      label: "眠れない・疲れが取れない",
      hint: "寝つき・途中覚醒・慢性的なだるさ",
      links: [["不眠", "insomnia.html"], ["慢性疲労", "fatigue.html"]]
    },
    {
      label: "胸がドキドキする・息がしづらい",
      hint: "動悸・息苦しさ・喉の違和感",
      links: [["動悸", "palpitations.html"], ["息苦しさ", "shortness-of-breath.html"], ["喉の違和感", "throat-discomfort.html"]]
    },
    {
      label: "理由なく不安になる・外出が怖い",
      hint: "強い不安や発作のような感覚",
      links: [["パニック症状", "panic.html"], ["不安障害", "anxiety-disorder.html"]]
    },
    {
      label: "朝起きられない・立っているのがつらい",
      hint: "朝の不調・立ちくらみ・冷え",
      links: [["起立性調節障害", "orthostatic-dysregulation.html"], ["冷え性", "coldness.html"]]
    },
    {
      label: "胃腸の調子が安定しない",
      hint: "腹部の不快感・便通・吐き気",
      links: [["過敏性腸症候群", "ibs.html"], ["慢性便秘", "chronic-constipation.html"], ["胃の不快感", "stomach-discomfort.html"], ["吐き気", "nausea.html"]]
    },
    {
      label: "肌・頭・身体に気になる違和感がある",
      hint: "かゆみ・頭痛・あご・手足などの不調",
      links: [["アトピー・皮膚症状", "atopic.html"], ["頭痛", "headache.html"], ["顎関節症", "tmj.html"], ["腱鞘炎", "tenosynovitis.html"], ["足裏の痛み", "plantar-fasciitis.html"], ["PMS", "pms.html"]]
    },
    {
      label: "うまく症状を説明できない",
      hint: "どれに当てはまるか分からない方へ",
      links: [["自律神経の不調について見る", "autonomic.html"], ["15問の簡易チェック", "check.html?from=index.html"], ["LINEで相談する", LINE_URL]]
    }
  ];

  function createSensationGuide() {
    const section = document.createElement("section");
    section.id = "gene-sensation-guide";
    section.className = "gene-sensation-guide";
    section.setAttribute("aria-labelledby", "gene-sensation-title");

    const cards = symptomGroups.map(function (group, groupIndex) {
      const links = group.links.map(function (link) {
        const external = link[1].indexOf("http") === 0;
        return '<a href="' + link[1] + '"' + (external ? ' target="_blank" rel="noopener"' : "") + '>' + link[0] + '<span aria-hidden="true">›</span></a>';
      }).join("");
      return '<details id="gene-sensation-' + (groupIndex + 1) + '" class="gene-sensation-card" data-sensation-id="sensation-' + (groupIndex + 1) + '">' +
        '<summary><span class="gene-sensation-label">' + group.label + '</span>' +
        '<span class="gene-sensation-hint">' + group.hint + '</span></summary>' +
        '<div class="gene-sensation-links">' + links + '</div></details>';
    }).join("");

    section.innerHTML =
      '<p class="gene-section-eyebrow">FIND BY FEELING</p>' +
      '<h2 id="gene-sensation-title">症状名が分からなくても大丈夫です</h2>' +
      '<p class="gene-sensation-lead">今感じていることに近い項目からお選びください。読む順番は自由です。</p>' +
      '<div class="gene-sensation-grid">' + cards + '</div>' +
      '<p class="gene-sensation-note">どれに当てはまるか分からない方は、無料・登録なしの<a href="check.html?from=index.html" data-gene-cta="sensation_check">15問の簡易チェック</a>をご利用ください。</p>';

    section.querySelectorAll(".gene-sensation-card").forEach(function (details) {
      details.addEventListener("toggle", function () {
        if (!details.open) return;
        track("symptom_category_open", {
          item_id: details.dataset.sensationId,
          item_name: normalize(details.querySelector(".gene-sensation-label").textContent)
        });
      });
    });
    section.querySelectorAll(".gene-sensation-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        track("symptom_link_click", {
          event_label: link.getAttribute("href"),
          link_text: normalize(link.textContent)
        });
      });
    });
    return section;
  }

  const accordionDescriptions = {
    reasons: "選ばれている理由を、専門性・確認方法・通いやすさからご案内します。",
    safety: "初めての方にも安心していただくための6つの取り組みです。",
    environment: "温度・照明・音にも配慮した院内環境をご紹介します。",
    symptoms: "症状名から詳しいページを探したい方はこちらです。",
    policy: "施術前に知っていただきたいことと、当院がお手伝いできる方について。",
    greeting: "院長の経歴と、施術で大切にしている背景をご紹介します。",
    first_visit: "初回の確認方法や、来院前の不安についてご案内します。",
    faq: "初めての方から多くいただく質問をまとめています。",
    values: "専門性と同じように、安心感を大切にしている理由です。",
    final_message: "相談先が分からず不安を抱えている方へ。"
  };

  function enhanceAccordions(container) {
    container.querySelectorAll(":scope > details.gene-index-accordion").forEach(function (details) {
      const summary = details.querySelector(":scope > summary");
      if (!summary || summary.querySelector(".gene-native-accordion-sub")) return;
      const description = accordionDescriptions[details.dataset.accordionId] || "詳しい内容を開いて確認できます。";
      const sub = document.createElement("span");
      sub.className = "gene-native-accordion-sub";
      sub.textContent = description;
      const action = document.createElement("span");
      action.className = "gene-native-accordion-action";
      action.setAttribute("aria-hidden", "true");
      action.textContent = "詳しく読む";
      summary.appendChild(sub);
      summary.appendChild(action);
      details.addEventListener("toggle", function () {
        action.textContent = details.open ? "閉じる" : "詳しく読む";
      });
    });
  }

  function convertFaqItems(container) {
    const faqCard = findCard(container, "faq");
    if (!faqCard) return;
    faqCard.querySelectorAll(".faq-preview-item").forEach(function (item, index) {
      const question = item.querySelector(":scope > strong");
      if (!question || item.querySelector("details")) return;
      const details = document.createElement("details");
      details.className = "gene-faq-details";
      details.dataset.faqId = "faq-" + (index + 1);
      const summary = document.createElement("summary");
      summary.textContent = normalize(question.textContent);
      const answer = document.createElement("div");
      answer.className = "gene-faq-answer";
      Array.from(item.childNodes).forEach(function (node) {
        if (node !== question) answer.appendChild(node);
      });
      details.appendChild(summary);
      details.appendChild(answer);
      item.replaceChildren(details);
      details.addEventListener("toggle", function () {
        if (!details.open) return;
        track("faq_open", {
          item_id: details.dataset.faqId,
          item_name: normalize(summary.textContent)
        });
      });
    });
  }

  function createMidCta(container) {
    const checkCard = findCard(container, "check");
    const faqCard = findCard(container, "faq");
    const anchor = checkCard || faqCard;
    if (!anchor || document.querySelector(".gene-mid-cta")) return;
    const section = document.createElement("aside");
    section.className = "gene-mid-cta";
    section.setAttribute("aria-label", "相談と来院案内");
    section.innerHTML =
      '<div><p class="gene-section-eyebrow">NEED HELP?</p>' +
      '<h2>ご自身の状態が当てはまるか迷う方へ</h2>' +
      '<p>予約を決める前のご質問だけでも、LINEからお送りいただけます。</p></div>' +
      '<div class="gene-mid-cta-actions">' +
      '<a href="' + LINE_URL + '" class="gene-cta-primary" target="_blank" rel="noopener" data-gene-cta="mid_line">LINEで質問する</a>' +
      '<a href="access.html" class="gene-cta-secondary" data-gene-cta="mid_access">アクセスを見る</a></div>';
    anchor.insertAdjacentElement("afterend", section);
  }

  function createDesktopHeader() {
    if (document.querySelector(".gene-journey-header")) return;
    const header = document.createElement("header");
    header.className = "gene-journey-header";
    header.innerHTML =
      '<div class="gene-journey-header-inner">' +
      '<a href="' + HOME_URL + '" class="gene-journey-brand" aria-label="大阪 自律神経専門整体院 gene ホーム">' +
      '<span class="gene-brand-full">大阪 自律神経専門整体院 gene</span><span class="gene-brand-short">gene</span></a>' +
      '<nav class="gene-journey-desktop-nav" aria-label="PC上部固定メニュー">' +
      '<a href="#gene-sensation-guide" data-nav-item="concerns">お悩み</a>' +
      '<a href="#gene-first-time" class="gene-nav-secondary" data-nav-item="first">初めての方</a>' +
      '<a href="menu.html" data-nav-item="menu">施術・料金</a>' +
      '<a href="voice.html" class="gene-nav-wide" data-nav-item="voice">院内写真</a>' +
      '<a href="faq.html" class="gene-nav-wide" data-nav-item="faq">よくある質問</a>' +
      '<a href="access.html" class="gene-nav-wide" data-nav-item="access">アクセス</a>' +
      '<details class="gene-nav-more"><summary>その他</summary><div class="gene-nav-more-menu">' +
      '<a href="#gene-first-time">初めての方</a><a href="voice.html">院内・改善写真</a>' +
      '<a href="faq.html">よくある質問</a><a href="access.html">アクセス</a>' +
      '<a href="check.html?from=index.html">15問の簡易チェック</a></div></details>' +
      '</nav>' +
      '<div class="gene-journey-header-actions">' +
      '<a href="check.html?from=index.html" class="gene-header-check" data-nav-item="check">15問チェック</a>' +
      '<a href="' + LINE_URL + '" class="gene-header-line" target="_blank" rel="noopener" data-nav-item="line">LINE予約</a>' +
      '</div></div>';
    document.body.insertBefore(header, document.body.firstChild);

    let ticking = false;
    function updateHeader() {
      header.classList.toggle("is-compact", window.scrollY > 80);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    }, { passive: true });
    updateHeader();
    header.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        track("journey_nav_click", {
          item_name: link.dataset.navItem || normalize(link.textContent),
          link_url: link.getAttribute("href")
        });
      });
    });
    const more = header.querySelector(".gene-nav-more");
    document.addEventListener("click", function (event) {
      if (more && more.open && !more.contains(event.target)) more.removeAttribute("open");
    });
  }

  function createMobileNavigation() {
    if (document.querySelector(".gene-journey-mobile-nav")) return;
    const backdrop = document.createElement("div");
    backdrop.className = "gene-journey-drawer-backdrop";
    backdrop.hidden = true;
    const drawer = document.createElement("section");
    drawer.className = "gene-journey-drawer";
    drawer.id = "gene-journey-drawer";
    drawer.hidden = true;
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("role", "dialog");
    const nav = document.createElement("nav");
    nav.className = "gene-journey-mobile-nav";
    nav.setAttribute("aria-label", "スマホ下部固定メニュー");
    nav.innerHTML =
      '<a href="' + HOME_URL + '"><span aria-hidden="true">⌂</span><small>ホーム</small></a>' +
      '<button type="button" data-drawer-view="symptoms" aria-controls="gene-journey-drawer" aria-expanded="false"><span aria-hidden="true">＋</span><small>お悩み</small></button>' +
      '<a href="menu.html"><span aria-hidden="true">◇</span><small>施術料金</small></a>' +
      '<button type="button" data-drawer-view="other" aria-controls="gene-journey-drawer" aria-expanded="false"><span aria-hidden="true">•••</span><small>その他</small></button>' +
      '<a href="' + LINE_URL + '" class="gene-mobile-line" target="_blank" rel="noopener"><span aria-hidden="true">↗</span><small>LINE</small></a>';
    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);
    document.body.appendChild(nav);

    const symptomLinks = symptomGroups.map(function (group, index) {
      return '<a href="#gene-sensation-' + (index + 1) + '" data-sensation-target="gene-sensation-' + (index + 1) + '"><strong>' + group.label + '</strong><span>' + group.hint + '</span></a>';
    }).join("");
    const views = {
      symptoms: '<div class="gene-drawer-heading"><div><small>FIND BY FEELING</small><h2>今の感覚から探す</h2></div><button type="button" class="gene-drawer-close" aria-label="閉じる">×</button></div>' +
        '<div class="gene-drawer-symptom-list">' + symptomLinks + '</div>' +
        '<a href="#gene-sensation-guide" class="gene-drawer-all-link">すべての分類を見る</a>',
      other: '<div class="gene-drawer-heading"><div><small>MENU</small><h2>その他のご案内</h2></div><button type="button" class="gene-drawer-close" aria-label="閉じる">×</button></div>' +
        '<div class="gene-drawer-other-list">' +
        '<a href="#gene-first-time">初めての方へ<span>›</span></a>' +
        '<a href="check.html?from=index.html">15問の簡易チェック<span>›</span></a>' +
        '<a href="voice.html">院内・改善写真<span>›</span></a>' +
        '<a href="faq.html">よくある質問<span>›</span></a>' +
        '<a href="access.html">アクセス<span>›</span></a></div>'
    };

    let lastTrigger = null;
    function closeDrawer() {
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      document.body.classList.remove("gene-drawer-open");
      nav.querySelectorAll("button[aria-expanded]").forEach(function (button) {
        button.setAttribute("aria-expanded", "false");
      });
      window.setTimeout(function () {
        drawer.hidden = true;
        backdrop.hidden = true;
      }, 240);
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    }

    function openDrawer(view, trigger) {
      lastTrigger = trigger;
      drawer.innerHTML = views[view];
      drawer.hidden = false;
      backdrop.hidden = false;
      window.requestAnimationFrame(function () {
        drawer.classList.add("is-open");
        backdrop.classList.add("is-open");
      });
      document.body.classList.add("gene-drawer-open");
      nav.querySelectorAll("button[aria-expanded]").forEach(function (button) {
        button.setAttribute("aria-expanded", button === trigger ? "true" : "false");
      });
      const close = drawer.querySelector(".gene-drawer-close");
      if (close) close.addEventListener("click", closeDrawer);
      drawer.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          const targetId = link.dataset.sensationTarget;
          track("mobile_drawer_link_click", {
            drawer_view: view,
            link_text: normalize(link.textContent),
            link_url: link.getAttribute("href")
          });
          closeDrawer();
          if (targetId) {
            const target = document.getElementById(targetId);
            if (target) {
              target.open = true;
              window.setTimeout(function () {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 260);
            }
          }
        });
      });
      track("mobile_drawer_open", { drawer_view: view });
      if (close) close.focus({ preventScroll: true });
    }

    nav.querySelectorAll("button[data-drawer-view]").forEach(function (button) {
      button.addEventListener("click", function () {
        const view = button.dataset.drawerView;
        if (!drawer.hidden && button.getAttribute("aria-expanded") === "true") {
          closeDrawer();
        } else {
          openDrawer(view, button);
        }
      });
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        track("journey_mobile_nav_click", {
          link_text: normalize(link.textContent),
          link_url: link.getAttribute("href")
        });
      });
    });
    backdrop.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !drawer.hidden) closeDrawer();
    });
  }

  function setupCtaTracking() {
    document.querySelectorAll("[data-gene-cta]").forEach(function (link) {
      link.addEventListener("click", function () {
        track("journey_cta_click", {
          cta_id: link.dataset.geneCta,
          link_url: link.getAttribute("href")
        });
      });
    });
    const contactCard = document.getElementById("gene-contact");
    if (contactCard) {
      contactCard.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          track("journey_cta_click", {
            cta_id: "final_" + normalize(link.textContent),
            link_url: link.getAttribute("href")
          });
        });
      });
    }
  }

  ready(function () {
    if (document.documentElement.dataset.geneJourneyReady === "true") return;
    const container = document.getElementById("index-cards");
    if (!container) return;
    document.documentElement.dataset.geneJourneyReady = "true";
    reorderExistingCards(container);
    assignSectionIds(container);
    adaptRouteGuide(container);
    const routeGuide = findCard(container, "route");
    const sensationGuide = createSensationGuide();
    if (routeGuide) routeGuide.insertAdjacentElement("afterend", sensationGuide);
    else container.insertBefore(sensationGuide, container.firstChild);
    enhanceAccordions(container);
    convertFaqItems(container);
    createMidCta(container);
    createDesktopHeader();
    createMobileNavigation();
    setupCtaTracking();
    document.documentElement.classList.add("gene-journey-ready");
  });
})();
