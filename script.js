      (function () {
        "use strict";

        /* ---------- Benefit overlay dialogs ---------- */
        var lastTrigger = null;

        function openDialog(id, trigger) {
          var overlay = document.getElementById(id);
          if (!overlay) return;
          lastTrigger = trigger || null;
          overlay.hidden = false;
          // Force reflow so the .open class transition/display applies
          void overlay.offsetWidth;
          overlay.classList.add("open");
          document.body.style.overflow = "hidden";
          var closeBtn = overlay.querySelector("[data-close]");
          if (closeBtn) closeBtn.focus();
          document.addEventListener("keydown", onDialogKeydown);
        }

        function closeDialog(overlay) {
          if (!overlay) return;
          overlay.classList.remove("open");
          overlay.hidden = true;
          document.body.style.overflow = "";
          document.removeEventListener("keydown", onDialogKeydown);
          if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
        }

        function onDialogKeydown(e) {
          if (e.key === "Escape") {
            var open = document.querySelector(".overlay.open");
            if (open) closeDialog(open);
          }
          if (e.key === "Tab") {
            var openDialogEl = document.querySelector(".overlay.open .dialog");
            if (!openDialogEl) return;
            var focusables = openDialogEl.querySelectorAll("button, a[href]");
            if (!focusables.length) return;
            var first = focusables[0];
            var last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault(); first.focus();
            }
          }
        }

        document.querySelectorAll("[data-dialog]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            openDialog(btn.getAttribute("data-dialog"), btn);
          });
        });

        document.querySelectorAll(".overlay").forEach(function (overlay) {
          overlay.addEventListener("click", function (e) {
            if (e.target === overlay) closeDialog(overlay);
          });
          var closeBtn = overlay.querySelector("[data-close]");
          if (closeBtn) {
            closeBtn.addEventListener("click", function () { closeDialog(overlay); });
          }
          var closeLink = overlay.querySelector("[data-close-link]");
          if (closeLink) {
            closeLink.addEventListener("click", function () { closeDialog(overlay); });
          }
        });

        /* ---------- FAQ accordion ---------- */
        document.querySelectorAll(".faq-q").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var expanded = btn.getAttribute("aria-expanded") === "true";
            var panel = document.getElementById(btn.getAttribute("aria-controls"));
            var icon = btn.querySelector(".faq-icon");
            btn.setAttribute("aria-expanded", String(!expanded));
            if (panel) panel.hidden = expanded;
            if (icon) icon.textContent = expanded ? "+" : "−";
          });
        });

        /* ---------- Contact form ---------- */
        var form = document.getElementById("contact-form");
        var thankYou = document.getElementById("thank-you");
        var errorMsg = document.getElementById("form-error");
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var name = document.getElementById("field-name");
          var email = document.getElementById("field-email");
          var missing = [];
          if (!name.value.trim()) missing.push("your name");
          if (!email.value.trim() || email.value.indexOf("@") === -1) missing.push("a valid email address");
          if (missing.length) {
            errorMsg.textContent = "Please add " + missing.join(" and ") + " so I can reply to you.";
            errorMsg.style.display = "block";
            (missing[0] === "your name" ? name : email).focus();
            return;
          }
          errorMsg.style.display = "none";
          form.hidden = true;
          thankYou.hidden = false;
          thankYou.focus();
        });
      })();
    
