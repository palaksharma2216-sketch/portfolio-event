/* ==================================================================
   Creative Developer Portfolio – Palak Sharma
   File: script.js  (all the interactive behaviour)
   Contents:
     1. Mobile navigation menu
     2. Header shadow and back-to-top button
     3. Highlight the active nav link
     4. Scroll reveal animation and skill bars
     5. Typing effect in the hero
     6. Project details pop-up
     7. Contact form validation
     8. Footer year
   ================================================================== */

// Wait until the whole HTML page has loaded before running any code
document.addEventListener("DOMContentLoaded", () => {

  // Tell the CSS that JavaScript is working (it then enables the reveal animation)
  document.documentElement.classList.add("js-ready");


  /* ---------- 1. MOBILE NAVIGATION MENU ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav__link");

  // Open or close the menu and keep the accessibility attributes up to date
  function setMenu(isOpen) {
    navMenu.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  // Clicking the hamburger button toggles the menu
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
  });

  // Close the menu after choosing a link (useful on phones)
  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  // Pressing the Escape key closes the menu
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  // Close the menu if the user clicks outside of it
  document.addEventListener("click", (event) => {
    const clickedInside = navMenu.contains(event.target) || navToggle.contains(event.target);
    if (!clickedInside) setMenu(false);
  });


  /* ---------- 2. HEADER SHADOW AND BACK-TO-TOP BUTTON ---------- */
  const siteHeader = document.getElementById("siteHeader");
  const toTopButton = document.getElementById("toTop");

  function handleScroll() {
    const scrolled = window.scrollY > 20;
    siteHeader.classList.toggle("is-scrolled", scrolled);

    // Show the back-to-top button after scrolling down 500px
    toTopButton.hidden = window.scrollY < 500;
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // run once on load

  toTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  /* ---------- 3. HIGHLIGHT THE ACTIVE NAV LINK ----------
     IntersectionObserver tells us when a section is visible on screen. */
  const sections = document.querySelectorAll("main section[id]");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("is-active", isCurrent);
            if (isCurrent) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        }
      });
    },
    // A section counts as "current" when it crosses the middle of the screen
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));


  /* ---------- 4. SCROLL REVEAL ANIMATION AND SKILL BARS ---------- */
  const revealItems = document.querySelectorAll(".reveal");
  const skillFills = document.querySelectorAll(".skill__fill");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        // If this block contains skill bars, fill them to their level
        entry.target.querySelectorAll(".skill__fill").forEach((fill) => {
          fill.style.width = fill.dataset.level + "%";
        });

        observer.unobserve(entry.target); // animate only once
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  // Safety: if the browser has no IntersectionObserver support, just show everything
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    skillFills.forEach((fill) => (fill.style.width = fill.dataset.level + "%"));
  }


  /* ---------- 5. TYPING EFFECT IN THE HERO ---------- */
  const typedRole = document.getElementById("typedRole");

  // SAMPLE: change these phrases to describe yourself
  const roles = ["web developer", "B.Tech student", "creative problem solver", "lifelong learner"];

  let roleIndex = 0;   // which phrase we are on
  let charIndex = 0;   // how many letters are showing
  let isDeleting = false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function typeRole() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typedRole.textContent = currentRole.slice(0, charIndex);

    let delay = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 1600;          // pause when the phrase is complete
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length; // move to the next phrase
      delay = 400;
    }

    setTimeout(typeRole, delay);
  }

  // People who prefer reduced motion just see the first phrase with no typing
  if (!reducedMotion) {
    typedRole.textContent = "";
    typeRole();
  }


  /* ---------- 6. PROJECT DETAILS POP-UP ---------- */
  const projectDialog = document.getElementById("projectDialog");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalTech = document.getElementById("modalTech");
  const modalLink = document.getElementById("modalLink");
  const modalClose = document.getElementById("modalClose");

  // Each "View details" button stores its project info in data-* attributes
  document.querySelectorAll(".js-project").forEach((button) => {
    button.addEventListener("click", () => {
      modalTitle.textContent = button.dataset.title;
      modalDesc.textContent = button.dataset.desc;
      modalTech.textContent = button.dataset.tech;
      modalLink.href = button.dataset.link;

      projectDialog.showModal(); // opens the dialog and traps keyboard focus inside it
    });
  });

  modalClose.addEventListener("click", () => projectDialog.close());

  // Clicking the dark area outside the box also closes it
  projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });


  /* ---------- 7. CONTACT FORM VALIDATION ---------- */
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  // Each rule returns an error message, or "" if the value is fine
  const validators = {
    name(value) {
      if (value.trim() === "") return "Please enter your name.";
      if (value.trim().length < 2) return "Your name must be at least 2 characters.";
      if (!/^[A-Za-z\s.'-]+$/.test(value.trim())) return "Use letters only in your name.";
      return "";
    },
    email(value) {
      if (value.trim() === "") return "Please enter your email address.";
      // Simple email pattern: text, @, text, dot, text
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) {
        return "Enter a valid email, for example name@example.com.";
      }
      return "";
    },
    subject(value) {
      if (value.trim() === "") return "Please enter a subject.";
      if (value.trim().length < 3) return "The subject must be at least 3 characters.";
      return "";
    },
    message(value) {
      if (value.trim() === "") return "Please write a message.";
      if (value.trim().length < 20) return "Your message must be at least 20 characters.";
      return "";
    },
  };

  // Check one field, then show or clear its error. Returns true if the field is valid.
  function validateField(field) {
    const errorBox = document.getElementById(field.id + "Error");
    const message = validators[field.name](field.value);

    errorBox.textContent = message;
    field.classList.toggle("is-invalid", message !== "");
    field.classList.toggle("is-valid", message === "");
    field.setAttribute("aria-invalid", message !== "" ? "true" : "false");

    return message === "";
  }

  const fields = form.querySelectorAll("input, textarea");

  fields.forEach((field) => {
    // Check when the user leaves a field
    field.addEventListener("blur", () => validateField(field));
    // Re-check while typing, but only if the field already shows an error
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) validateField(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // stop the page from reloading
    formStatus.textContent = "";

    // Validate every field. We loop through all of them so all errors show at once.
    let firstInvalid = null;
    fields.forEach((field) => {
      const isValid = validateField(field);
      if (!isValid && !firstInvalid) firstInvalid = field;
    });

    // If something is wrong, send the keyboard focus to the first problem field
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    /* All fields are valid.
       A real website would send the data to a server here.
       For this lab project we only show a success message. */
    const firstName = form.elements.name.value.trim().split(" ")[0];
    formStatus.textContent = `Thank you, ${firstName}! Your message is ready to send. (Demo only: no server is connected.)`;

    form.reset();
    fields.forEach((field) => {
      field.classList.remove("is-valid", "is-invalid");
      field.removeAttribute("aria-invalid");
    });
  });


  /* ---------- 8. FOOTER YEAR ---------- */
  // Keeps the copyright year correct automatically
  document.getElementById("year").textContent = new Date().getFullYear();

});