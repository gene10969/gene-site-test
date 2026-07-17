(function () {
  "use strict";

  const LINE_URL = "https://lin.ee/6bBKc67";

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
      event_category: "index_journey"
    }, parameters || {}));
  }

  function normalize(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function cardTitle(element) {
    const heading = element.querySelector("h2, h3");
    return heading ? normalize(heading.textContent) : "";
  }

  function findCard(container, title) {
    return Array.from(container.children).find(function (element) {
      return cardTitle(element) === title;
    }) || null;
  }

  function assignSectionIds(container) {
    const ids = {
      "このようなお悩みの方へ": "gene-concerns",
      "施術を受ける前にご確認ください": "gene-before-treatment",
      "自律神経に特化した理由": "gene-specialty",
      "施術の考え方": "gene-treatment-policy",
      "ごあいさつ": "gene-director",
      "大切にしていること": "gene-values",
      "よくあるご質問": "gene-faq",
      "現在の状態を確認したい方へ": "gene-condition-check",
      "最後に": "gene-final-message",
      "ご相談・ご予約はこちら": "gene-contact"
    };

    const used = new Set();
    Array.from(container.children).forEach(function (element) {
      const title = cardTitle(element);
      let id = ids[title];
      if (title === "初めての方へ") {
        id = element.classList.contains("gene-check-invite") ? "gene-check-intro" : "gene-first-time";
      }
      if (!id || used.has(id)) return;
      element.id = id;
      used.add(id);
    });
  }

  function reorderExistingCards(container) {
    const original = Array.from(container.children);
    const originalPosition = new Map(original.map(function (element, index) {
      return [element, index];
    }));
    const ranks = {
      "このようなお悩みの方へ": 20,
      "施術を受ける前にご確認ください": 40,
      "自律神経に特化した理由": 50,
      "施術の考え方": 60,
      "ごあいさつ": 70,
      "大切にしていること": 80,
      "よくあるご質問": 90,
      "現在の状態を確認したい方へ": 100,
      "最後に": 110,
      "ご相談・ご予約はこちら": 120
    };

    original.sort(function (a, b) {
      function rank(element, index) {
        const title = cardTitle(element);
        if (title === "初めての方へ") {
          return element.classList.contains("gene-check-invite") ? 10 : 30;
        }
        return Object.prototype.hasOwnProperty.call(ranks, title) ? ranks[title] : 200 + index;
      }
      return rank(a, originalPosition.get(a)) - rank(b, originalPosition.get(b));
    });

    original.forEach(function (element) {
      container.appendChild(element);
    });
  }

  const symptomGroups = [
    {
      label: "ぐるぐる・ふわふわする",
      hint: "めまい・ふらつきが気になる",
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
      label: "頭・耳・身体に違和感がある",
      hint: "頭痛・関節・手足などの不調",
      links: [["頭痛", "headache.html"], ["顎関節症", "tmj.html"], ["腱鞘炎", "tenosynovitis.html"], ["足底筋膜炎", "plantar-fasciitis.html"]]
    },
    {
      label: "うまく症状を説明できない",
      hint: "どれに当てはまるか分からない方へ",
      links: [["30秒自律神経チェック", "check.html?from=index.html"], ["LINEで相談する", LINE_URL]]
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

      return '<details class="gene-sensation-card" data-sensation-id="sensation-' + (groupIndex + 1) + '">' +
        '<summary><span class="gene-sensation-label">' + group.label + '</span>' +
        '<span class="gene-sensation-hint">' + group.hint + '</span></summary>' +
        '<div class="gene-sensation-links">' + links + '</div></details>';
    }).join("");

    section.innerHTML =
      '<p class="gene-section-eyebrow">FIND BY FEELING</p>' +
      '<h2 id="gene-sensation-title">症状名が分からなくても大丈夫です</h2>' +
      '<p class="gene-sensation-lead">今感じていることに近い項目からお選びください。読む順番は自由です。</p>' +
      '<div class="gene-sensation-grid">' + cards + '</div>' +
      '<p class="gene-sensation-note">迷う場合は、無料・登録なしの<a href="check.html?from=index.html" data-gene-cta="sensation_check">30秒自律神経チェック</a>をご利用いただけます。</p>';

    section.querySelectorAll(".gene-sensation-card").forEach(function (details) {
      details.addEventListener("toggle", function () {
        if (!details.open) return;
        const label = normalize(details.querySelector(".gene-sensation-label").textContent);
        track("symptom_category_open", {
          item_id: details.dataset.sensationId,
          item_name: label
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

  const detailSummaries = {
    "このようなお悩みの方へ": "対応している主なお悩みと、相談先に迷っている方へのご案内",
    "初めての方へ": "初回の確認方法や、来院前に知っていただきたいこと",
    "自律神経に特化した理由": "不調を部分だけでなく、身体全体から確認する理由",
    "施術の考え方": "強い刺激に頼らず、身体の反応を確認しながら進める考え方",
    "施術を受ける前にご確認ください": "当院がお手伝いできる方と、施術に関する大切な確認事項",
    "ごあいさつ": "院長の経歴と、これまで不調に向き合ってきた経験",
    "大切にしていること": "専門性と同じように、安心感を大切にしている理由",
    "最後に": "相談先が分からず不安を抱えている方へ"
  };

  function convertLongCardsToDetails(container) {
    Array.from(container.querySelectorAll(".info-card")).forEach(function (card, position) {
      if (card.classList.contains("gene-check-invite")) return;
      const content = card.querySelector(".card-content");
      const heading = content ? content.querySelector(":scope > h3") : null;
      if (!content || !heading) return;

      const title = normalize(heading.textContent);
      const summaryText = detailSummaries[title];
      if (!summaryText) return;

      const details = document.createElement("details");
      details.className = "gene-content-details";
      details.dataset.detailId = card.id || "detail-" + (position + 1);

      const summary = document.createElement("summary");
      summary.innerHTML =
        '<span class="gene-detail-heading">' + title + '</span>' +
        '<span class="gene-detail-summary">' + summaryText + '</span>' +
        '<span class="gene-detail-action" aria-hidden="true">詳しく読む</span>';

      const body = document.createElement("div");
      body.className = "gene-detail-body";
      Array.from(content.childNodes).forEach(function (node) {
        if (node !== heading) body.appendChild(node);
      });

      heading.remove();
      details.appendChild(summary);
      details.appendChild(body);
      content.appendChild(details);
      card.classList.add("gene-accordion-card");

      details.addEventListener("toggle", function () {
        const action = details.querySelector(".gene-detail-action");
        if (action) action.textContent = details.open ? "閉じる" : "詳しく読む";
        if (!details.open) return;
        track("detail_open", {
          section_id: details.dataset.detailId,
          section_title: title,
          section_position: position + 1
        });
      });
    });
  }

  function convertFaqItems(container) {
    const faqCard = findCard(container, "よくあるご質問");
    if (!faqCard) return;
    faqCard.querySelectorAll(".faq-preview-item").forEach(function (item, index) {
      const question = item.querySelector("strong");
      if (!question || item.querySelector("details")) return;

      const details = document.createElement("details");
      details.className = "gene-faq-details";
      const summary = document.createElement("summary");
      summary.textContent = normalize(question.textContent);
      const answer = document.createElement("div");
      answer.className = "gene-faq-answer";

      Array.from(item.childNodes).forEach(function (node) {
        if (node !== question) answer.appendChild(node);
      });
      details.appendChild(summary);
      details.appendChild(answer);
      item.innerHTML = "";
      item.appendChild(details);

      details.addEventListener("toggle", function () {
        if (!details.open) return;
        track("faq_open", {
          item_id: "faq-" + (index + 1),
          item_name: normalize(summary.textContent)
        });
      });
    });
  }

  function createHeroActions() {
    const hero = document.querySelector(".top-hero-card");
    if (!hero || document.querySelector(".gene-hero-actions")) return;

    const actions = document.createElement("div");
    actions.className = "gene-hero-actions";
    actions.setAttribute("aria-label", "最初のご案内");
    actions.innerHTML =
      '<a href="#gene-sensation-guide" class="gene-cta-secondary" data-gene-cta="hero_symptoms">今の感覚から探す</a>' +
      '<a href="' + LINE_URL + '" class="gene-cta-primary" target="_blank" rel="noopener" data-gene-cta="hero_line">LINEで相談・予約</a>';
    hero.insertAdjacentElement("afterend", actions);
  }

  function createMidCta(container) {
    const faqCard = findCard(container, "よくあるご質問");
    if (!faqCard || document.querySelector(".gene-mid-cta")) return;

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
    faqCard.insertAdjacentElement("afterend", section);
  }

  function createDesktopHeader() {
    if (document.querySelector(".gene-journey-header")) return;
    const header = document.createElement("header");
    header.className = "gene-journey-header";
    header.innerHTML =
      '<div class="gene-journey-header-inner">' +
      '<a href="/" class="gene-journey-brand" aria-label="大阪 自律神経専門整体院 gene ホーム">' +
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
      '<a href="check.html?from=index.html">30秒自律神経チェック</a></div></details>' +
      '</nav>' +
      '<div class="gene-journey-header-actions">' +
      '<a href="check.html?from=index.html" class="gene-header-check" data-nav-item="check">30秒チェック</a>' +
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
      '<a href="/"><span aria-hidden="true">⌂</span><small>ホーム</small></a>' +
      '<button type="button" data-drawer-view="symptoms" aria-controls="gene-journey-drawer" aria-expanded="false"><span aria-hidden="true">＋</span><small>お悩み</small></button>' +
      '<a href="menu.html"><span aria-hidden="true">◇</span><small>施術・料金</small></a>' +
      '<button type="button" data-drawer-view="other" aria-controls="gene-journey-drawer" aria-expanded="false"><span aria-hidden="true">•••</span><small>その他</small></button>' +
      '<a href="' + LINE_URL + '" class="gene-mobile-line" target="_blank" rel="noopener"><span aria-hidden="true">↗</span><small>LINE</small></a>';

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);
    document.body.appendChild(nav);

    const symptomLinks = symptomGroups.map(function (group) {
      const first = group.links[0];
      return '<a href="' + first[1] + '"><strong>' + group.label + '</strong><span>' + group.hint + '</span></a>';
    }).join("");

    const views = {
      symptoms: '<div class="gene-drawer-heading"><div><small>FIND BY FEELING</small><h2>今の感覚から探す</h2></div><button type="button" class="gene-drawer-close" aria-label="閉じる">×</button></div>' +
        '<div class="gene-drawer-symptom-list">' + symptomLinks + '</div>' +
        '<a href="#gene-sensation-guide" class="gene-drawer-all-link">すべての分類を見る</a>',
      other: '<div class="gene-drawer-heading"><div><small>MENU</small><h2>その他のご案内</h2></div><button type="button" class="gene-drawer-close" aria-label="閉じる">×</button></div>' +
        '<div class="gene-drawer-other-list">' +
        '<a href="#gene-first-time">初めての方へ<span>›</span></a>' +
        '<a href="check.html?from=index.html">30秒自律神経チェック<span>›</span></a>' +
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
          track("mobile_drawer_link_click", {
            drawer_view: view,
            link_text: normalize(link.textContent),
            link_url: link.getAttribute("href")
          });
          closeDrawer();
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
    const container = document.getElementById("index-cards");
    if (!container) return;

    reorderExistingCards(container);
    assignSectionIds(container);
    container.insertBefore(createSensationGuide(), container.firstChild);
    convertLongCardsToDetails(container);
    convertFaqItems(container);
    createHeroActions();
    createMidCta(container);
    createDesktopHeader();
    createMobileNavigation();
    setupCtaTracking();
    document.documentElement.classList.add("gene-journey-ready");
  });
})();
