(function(){
  function setupGeneContentAccordions(){
    const accordions = document.querySelectorAll("details[data-gene-accordion]");
    if (!accordions.length) return;

    const trackedOpens = new Set();

    accordions.forEach((accordion, index) => {
      accordion.addEventListener("toggle", () => {
        if (!accordion.open) return;

        const accordionId = accordion.dataset.accordionId || `item_${index + 1}`;
        if (trackedOpens.has(accordionId)) return;
        trackedOpens.add(accordionId);

        const summary = accordion.querySelector(":scope > summary");
        const accordionTitle = summary
          ? summary.textContent.replace(/\s+/g, " ").trim()
          : accordionId;
        const payload = {
          accordion_id: accordionId,
          accordion_title: accordionTitle,
          accordion_group: accordion.dataset.accordionGroup || "content",
          source_page: location.pathname.split("/").pop() || "index.html"
        };

        if (typeof window.gtag === "function") {
          window.gtag("event", "content_accordion_open", payload);
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupGeneContentAccordions, { once:true });
  } else {
    setupGeneContentAccordions();
  }
})();
