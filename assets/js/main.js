/* VYRON — interações do site */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");

  var config = window.VYRON_CONFIG || {};
  var PLACEHOLDER = "[WHATSAPP_DA_VYRON]";

  /* ---------- WhatsApp ---------- */
  function whatsappNumber() {
    var raw = String(config.whatsapp || PLACEHOLDER);
    var digits = raw.replace(/\D/g, "");
    // Enquanto o número real não for configurado, mantém o placeholder visível no link.
    return digits.length >= 10 ? digits : raw;
  }

  function whatsappUrl(message) {
    var text = message || config.whatsappMessage || "";
    return "https://wa.me/" + whatsappNumber() + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.setAttribute("href", whatsappUrl(el.getAttribute("data-whatsapp") || ""));
  });
  document.querySelectorAll("[data-whatsapp-display]").forEach(function (el) {
    el.textContent = config.whatsappDisplay || config.whatsapp || PLACEHOLDER;
  });
  if (config.email) {
    document.querySelectorAll("[data-email]").forEach(function (el) {
      var isReal = /@/.test(config.email) && config.email.indexOf("[") === -1;
      if (isReal) {
        var a = document.createElement("a");
        a.href = "mailto:" + config.email;
        a.textContent = config.email;
        el.replaceWith(a);
      } else {
        el.textContent = config.email;
      }
    });
  }

  /* ---------- Header ---------- */
  var header = document.querySelector(".site-header");
  var waFloat = document.querySelector(".wa-float");
  var hero = document.querySelector(".hero");
  var contact = document.getElementById("contato");

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 12);
    if (waFloat && hero) {
      // O botão flutuante aparece após o hero e some na seção de contato.
      var pastHero = y > hero.offsetHeight * 0.6;
      var rect = contact ? contact.getBoundingClientRect() : null;
      var inContact = rect && rect.top < window.innerHeight * 0.6 && rect.bottom > 0;
      waFloat.classList.toggle("is-hidden", !pastHero || inContact);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("menu");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    document.body.classList.toggle("no-scroll", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Link ativo na navegação ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav ul a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navLinks.forEach(function (a) {
          var active = a.getAttribute("href") === id;
          a.classList.toggle("is-active", active);
          if (active) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { activeObserver.observe(s); });
  }

  /* ---------- Animações de entrada ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Escalona elementos irmãos para uma entrada sutil em sequência.
  reveals.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.classList.contains("reveal");
    });
    var index = siblings.indexOf(el);
    if (index > 0) el.style.setProperty("--delay", Math.min(index * 0.08, 0.32) + "s");
  });

  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Formulário → WhatsApp ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  var defaultNote = status ? status.textContent : "";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var missing = [];

      ["nome", "whatsapp", "mensagem"].forEach(function (name) {
        var field = form.elements[name];
        var empty = !String(data.get(name) || "").trim();
        field.closest(".field").classList.toggle("has-error", empty);
        field.setAttribute("aria-invalid", String(empty));
        if (empty) missing.push(field);
      });

      var email = form.elements.email;
      var emailInvalid = email.value.trim() !== "" && !email.checkValidity();
      email.closest(".field").classList.toggle("has-error", emailInvalid);
      email.setAttribute("aria-invalid", String(emailInvalid));
      if (emailInvalid) missing.push(email);

      if (missing.length) {
        status.textContent = "Preencha nome, WhatsApp e como podemos ajudar (e confira o e-mail, se informado).";
        status.classList.add("is-error");
        missing[0].focus();
        return;
      }

      status.textContent = defaultNote;
      status.classList.remove("is-error");

      var lines = [
        "Olá, VYRON! Vim pelo site.",
        "",
        "*Nome:* " + data.get("nome").trim()
      ];
      if (String(data.get("empresa")).trim()) lines.push("*Empresa:* " + data.get("empresa").trim());
      lines.push("*WhatsApp:* " + data.get("whatsapp").trim());
      if (String(data.get("email")).trim()) lines.push("*E-mail:* " + data.get("email").trim());
      lines.push("", "*Como podemos ajudar?*", data.get("mensagem").trim());

      window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener");
    });

    form.addEventListener("input", function (e) {
      var field = e.target.closest(".field");
      if (field && field.classList.contains("has-error") && e.target.value.trim()) {
        field.classList.remove("has-error");
        e.target.setAttribute("aria-invalid", "false");
      }
    });
  }
})();
