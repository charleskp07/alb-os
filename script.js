(function () {
    "use strict";

    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("primaryNav");
    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var revealEls = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
        var io = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        io.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -40px 0px"
            }
        );
        revealEls.forEach(function (el) { io.observe(el); });
    }

    var statEls = document.querySelectorAll(".stat-num");
    function animateCount(el) {
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        if (reduceMotion) {
            el.textContent = target.toLocaleString("fr-FR") + suffix;
            return;
        }
        var duration = 1100;
        var start = null;
        function step(ts) {
            if (start === null) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = Math.round(target * eased);
            el.textContent = value.toLocaleString("fr-FR") + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    if (statEls.length && "IntersectionObserver" in window) {
        var statIo = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        statIo.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        statEls.forEach(function (el) { statIo.observe(el); });
    } else {
        statEls.forEach(animateCount);
    }
})();