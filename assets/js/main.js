(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const menuBtn = document.querySelector(".menu-btn");
  const links = [...document.querySelectorAll(".nav nav a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open menu");
    });
  });

  const reveal = () => {
    document.querySelectorAll(".reveal").forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.92) el.classList.add("in");
    });
  };

  const markNav = () => {
    nav.classList.toggle("scrolled", window.scrollY > 8);
    let current = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top < 140) current = section;
    });
    links.forEach((link) => {
      link.classList.toggle("active", current && link.getAttribute("href") === "#" + current.id);
    });
  };

  window.addEventListener("scroll", () => {
    reveal();
    markNav();
  }, { passive: true });
  reveal();
  markNav();

  const clockTime = document.getElementById("clock-time");
  const clockDate = document.getElementById("clock-date");
  const timeFormat = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  });
  const dateFormat = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", year: "numeric"
  });
  const tick = () => {
    const now = new Date();
    clockTime.textContent = timeFormat.format(now) + " IST";
    clockDate.textContent = dateFormat.format(now);
  };
  tick();
  setInterval(tick, 1000);

  const canvas = document.getElementById("field");
  if (!canvas || motion) return;

  const ctx = canvas.getContext("2d");
  let dots = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  const pointer = { x: -9999, y: -9999 };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const count = Math.min(70, Math.floor((width * height) / 18000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    for (const dot of dots) {
      dot.x += dot.vx;
      dot.y += dot.vy;
      const dx = pointer.x - dot.x;
      const dy = pointer.y - dot.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 140) {
        dot.x -= dx * 0.008;
        dot.y -= dy * 0.008;
      }
      if (dot.x < 0 || dot.x > width) dot.vx *= -1;
      if (dot.y < 0 || dot.y > height) dot.vy *= -1;
    }

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i];
        const b = dots[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 130) {
          ctx.strokeStyle = "rgba(120, 220, 220, " + (1 - dist / 130) * 0.35 + ")";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(190, 180, 255, 0.85)";
      ctx.beginPath();
      ctx.arc(dots[i].x, dots[i].y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    frame = requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else frame = requestAnimationFrame(draw);
  });

  resize();
  draw();
})();
