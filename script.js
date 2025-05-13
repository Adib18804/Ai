// Utility Functions
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) =>
  Array.from(context.querySelectorAll(selector));

// Debounce Function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Initialize Particles.js
const initParticles = () => {
  if (!$("#particles-js")) return;
  try {
    particlesJS("particles-js", {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.3, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 120,
          color: "#ffffff",
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
        },
      },
    });
  } catch (err) {
    console.error("Particles.js failed to load:", err);
  }
};

// Typewriter Effect
const initTypewriter = () => {
  const typewrite = $(".typewrite");
  if (!typewrite) return;

  const texts = JSON.parse(typewrite.getAttribute("data-text"));
  let count = 0;
  let index = 0;
  let currentText = "";
  let letter = "";

  const type = () => {
    if (count === texts.length) count = 0;
    currentText = texts[count];
    letter = currentText.slice(0, ++index);

    typewrite.textContent = letter;
    if (letter.length === currentText.length) {
      count++;
      index = 0;
      setTimeout(type, 2000);
    } else {
      setTimeout(type, 100);
    }
  };

  type();
};

// Counter Animation
const initCounters = () => {
  const counters = $$(".number");
  const speed = 200;

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-count");
    let count = +counter.textContent;

    const updateCount = () => {
      const increment = target / speed;
      if (count < target) {
        count += increment;
        counter.textContent = Math.ceil(count).toLocaleString();
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };

    if (count < target) updateCount();
  });
};

// 3D Card Hover Effects
const initCardEffects = () => {
  const cards = $$(".feature-card, .personality-card");
  cards.forEach((card) => {
    const handleMove = debounce((e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      const { width, height } = card.getBoundingClientRect();
      const rotateY = ((x - width / 2) / width) * 15;
      const rotateX = ((height / 2 - y) / height) * 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.boxShadow = `${-rotateY}px ${rotateX}px 20px rgba(0,0,0,0.1)`;
    }, 10);

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
      card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
    });
  });
};

// Theme Toggle
const initThemeToggle = () => {
  const themeToggle = $("#theme-toggle");
  if (!themeToggle) return;

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.innerHTML =
      theme === "dark"
        ? '<i class="fas fa-sun" aria-hidden="true"></i>'
        : '<i class="fas fa-moon" aria-hidden="true"></i>';
    localStorage.setItem("theme", theme);
  };

  themeToggle.addEventListener("click", () => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });

  // Load saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
};

// Chatbot Functionality
const initChatbot = () => {
  const chatbotToggle = $(".chatbot-toggle");
  const chatbot = $(".ai-chatbot");
  const chatbotInput = $(".chatbot-input");
  const chatbotMessages = $(".chatbot-messages");

  if (!chatbotToggle || !chatbot || !chatbotInput || !chatbotMessages) return;

  chatbotToggle.addEventListener("click", () => {
    chatbot.classList.toggle("active");
  });

  $(".chatbot-close").addEventListener("click", () => {
    chatbot.classList.remove("active");
  });

  chatbotInput.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#chatbot-input");
    const message = input.value.trim();
    if (!message) return;

    // User message
    const userMessage = document.createElement("div");
    userMessage.className = "message user";
    userMessage.innerHTML = `
      <div class="message-content">${message}</div>
      <div class="message-time">Just now</div>
    `;
    chatbotMessages.appendChild(userMessage);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Simulate bot response
    setTimeout(() => {
      const botMessage = document.createElement("div");
      botMessage.className = "message bot";
      botMessage.innerHTML = `
        <div class="message-content">Thanks for your question! I'm here to help with AI-related queries. Try asking about prompt engineering or automation.</div>
        <div class="message-time">Just now</div>
      `;
      chatbotMessages.appendChild(botMessage);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 500);

    input.value = "";
  });
};

// Notification Center
const initNotifications = () => {
  const notificationToggle = $(".notification-toggle");
  const notificationCenter = $(".notification-center");

  if (!notificationToggle || !notificationCenter) return;

  notificationToggle.addEventListener("click", () => {
    notificationCenter.classList.toggle("active");
  });

  $(".notification-close").addEventListener("click", () => {
    notificationCenter.classList.remove("active");
  });
};

// Personality Selector
const initPersonalitySelector = () => {
  const personalityCards = $$(".personality-card");
  personalityCards.forEach((card) => {
    card.addEventListener("click", () => {
      personalityCards.forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-checked", "false");
        c.setAttribute("tabindex", "-1");
      });
      card.classList.add("active");
      card.setAttribute("aria-checked", "true");
      card.setAttribute("tabindex", "0");

      const personality = card.getAttribute("data-personality");
      const botMessage = document.createElement("div");
      botMessage.className = "message bot";
      botMessage.innerHTML = `
        <div class="message-content">
          Personality set to <strong>${personality}</strong> mode. How can I assist you today?
        </div>
        <div class="message-time">Just now</div>
      `;
      $(".chatbot-messages").appendChild(botMessage);
      $(".chatbot-messages").scrollTop = $(".chatbot-messages").scrollHeight;
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });
};

// Tab Switching
const initTabs = () => {
  const tabBtns = $$(".tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      tabBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      $$(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });
      $(`#${tabId}`).classList.add("active");
    });

    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });
};

// PWA Installation Prompt
const initPWA = () => {
  let installPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installPrompt = e;

    const installBtn = document.createElement("button");
    installBtn.textContent = "Install App";
    installBtn.className = "install-btn";
    installBtn.setAttribute("aria-label", "Install NexusAI App");
    document.body.appendChild(installBtn);

    installBtn.addEventListener("click", () => {
      installPrompt.prompt();
      installPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          console.log("User accepted install");
        } else {
          console.log("User declined install");
        }
        installBtn.remove();
      });
    });
  });
};

// Service Worker Registration
const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registration successful");
        })
        .catch((err) => {
          console.error("ServiceWorker registration failed:", err);
        });
    });
  }
};

// Mobile Menu Toggle
const initMobileMenu = () => {
  const mobileMenu = $(".mobile-menu");
  const nav = $("nav ul");

  if (!mobileMenu || !nav) return;

  mobileMenu.addEventListener("click", () => {
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
  });
};

// Initialize All Features
document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initTypewriter();
  initCounters();
  initCardEffects();
  initThemeToggle();
  initChatbot();
  initNotifications();
  initPersonalitySelector();
  initTabs();
  initPWA();
  registerServiceWorker();
  initMobileMenu();
});
