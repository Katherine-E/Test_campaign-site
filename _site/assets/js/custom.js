// Your own JavaScript goes here. It runs on every page.

// ---- Tabs ----
// Markup: <div class="tabs"> containing <div class="tab-panel" data-tab="Name"> blocks.
// The buttons are created automatically from each panel's data-tab label.
document.querySelectorAll(".tabs").forEach(function (tabs) {
  var panels = tabs.querySelectorAll(".tab-panel");
  var buttonRow = document.createElement("div");
  buttonRow.className = "tab-buttons";

  panels.forEach(function (panel, i) {
    var button = document.createElement("button");
    button.textContent = panel.dataset.tab;
    button.addEventListener("click", function () {
      panels.forEach(function (p) { p.hidden = p !== panel; });
      buttonRow.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("active", b === button);
      });
    });
    buttonRow.appendChild(button);
    if (i === 0) button.click();
  });

  tabs.prepend(buttonRow);
});

// ---- Scroll progress bar ----
// A thin bar across the top of the page that fills as you scroll down.
var progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

function updateProgress() {
  var scrollable = document.documentElement.scrollHeight - window.innerHeight;
  var fraction = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.transform = "scaleX(" + fraction + ")";
}
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

// ---- Reveal on scroll ----
// Page content fades and slides in as it scrolls into view. Skipped for visitors
// whose system is set to reduce motion.
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.classList.add("is-visible");
        revealObserver.unobserve(el);
        // Cards have their own hover animation; hand it back once the reveal is done.
        if (el.classList.contains("card")) {
          el.addEventListener("transitionend", function done(e) {
            if (e.target !== el) return;
            el.classList.remove("reveal", "is-visible");
            el.removeEventListener("transitionend", done);
          });
        }
      }
    });
  }, { rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".main-content main > *:not(.card-row):not(.band), .card").forEach(function (el) {
    // Content already on screen when the page loads stays put, so nothing flickers.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}
