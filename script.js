// Slider + popup for email notification
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("notifySlider");
  const track = slider?.querySelector(".notify-slider-track");
  const thumb = document.getElementById("sliderThumb");
  const fill = document.getElementById("sliderFill");
  const formHint = document.getElementById("formHint");
  const popup = document.getElementById("emailPopup");
  const backdrop = document.getElementById("popupBackdrop");
  const popupCancel = document.getElementById("popupCancel");
  const popupSend = document.getElementById("popupSend");
  const emailInput = document.getElementById("email");
  const popupHint = document.getElementById("popupHint");
  const sendText = popupSend?.querySelector(".send-text");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const openThreshold = 0.85;

  if (!track || !thumb || !fill || !popup) return;

  let isDragging = false;
  let startX = 0;
  let startLeft = 0;

  function getTrackRect() {
    return track.getBoundingClientRect();
  }

  function getThumbMaxLeft() {
    const trackRect = getTrackRect();
    return trackRect.width - thumb.offsetWidth - 8;
  }

  function setThumbPosition(px) {
    const maxLeft = getThumbMaxLeft();
    const left = Math.max(0, Math.min(px, maxLeft));
    thumb.style.left = `${left}px`;
    fill.style.width = `${left + thumb.offsetWidth / 2}px`;
    return left >= maxLeft * openThreshold;
  }

  function resetSlider() {
    thumb.style.left = "3px";
    fill.style.width = "0";
  }

  function openPopup() {
    popup.classList.add("open");
    popup.setAttribute("aria-hidden", "false");
    emailInput.value = "";
    emailInput.classList.remove("error");
    popupHint.textContent = "";
    popupHint.className = "email-popup-hint";
    emailInput.focus();
    document.body.style.overflow = "hidden";
  }

  function closePopup() {
    popup.classList.remove("open");
    popup.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showError(message) {
    popupHint.textContent = message;
    popupHint.className = "email-popup-hint error";
    emailInput.classList.add("error");
  }

  const NOTIFY_EMAIL = "qera.ops@gmail.com";

  function submitEmail(email) {
    popupSend.disabled = true;
    if (sendText) sendText.textContent = "Submitting...";

    const subject = encodeURIComponent("Qera Waitlist Signup");
    const body = encodeURIComponent(`New signup: ${email}`);
    const mailtoLink = `mailto:${NOTIFY_EMAIL}?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;

    setTimeout(() => {
      popupHint.textContent = "Thanks! We'll notify you at launch.";
      popupHint.className = "email-popup-hint success";
      emailInput.value = "";
      if (sendText) sendText.textContent = "Send";
      popupSend.disabled = false;
      formHint.textContent = "We'll let you know when we launch.";
      formHint.classList.add("success");

      setTimeout(() => {
        closePopup();
        resetSlider();
        formHint.classList.remove("success");
        formHint.textContent = "Slide or click to get notified.";
      }, 1500);
    }, 800);
  }

  // Track click (anywhere on slider opens popup)
  track.addEventListener("click", (e) => {
    if (e.target.closest(".notify-slider-thumb")) return;
    openPopup();
  });

  // Thumb click opens popup
  thumb.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isDragging) openPopup();
  });

  // Drag start
  thumb.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    startLeft = parseInt(thumb.style.left || "3", 10) || 3;
  });

  // Drag move
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const trackRect = getTrackRect();
    const deltaX = e.clientX - startX;
    const newLeft = startLeft + deltaX;
    const reachedEnd = setThumbPosition(newLeft);
    if (reachedEnd) {
      openPopup();
      resetSlider();
      isDragging = false;
    }
  });

  // Drag end
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      resetSlider();
      isDragging = false;
    }
  });

  // Touch support
  thumb.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startLeft = parseInt(thumb.style.left || "3", 10) || 3;
  });

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging || !e.touches.length) return;
      e.preventDefault();
      const deltaX = e.touches[0].clientX - startX;
      const newLeft = startLeft + deltaX;
      const reachedEnd = setThumbPosition(newLeft);
      if (reachedEnd) {
        openPopup();
        resetSlider();
        isDragging = false;
      }
    },
    { passive: false },
  );

  document.addEventListener("touchend", () => {
    if (isDragging) {
      resetSlider();
      isDragging = false;
    }
  });

  backdrop.addEventListener("click", closePopup);
  popupCancel.addEventListener("click", () => {
    closePopup();
    resetSlider();
  });

  popupSend.addEventListener("click", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      showError("Please enter your email address");
      return;
    }
    if (!emailRegex.test(email)) {
      showError("Please enter a valid email address");
      return;
    }

    emailInput.classList.remove("error");
    popupHint.className = "email-popup-hint";
    popupHint.textContent = "";
    submitEmail(email);
  });

  emailInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") popupSend.click();
  });

  emailInput.addEventListener("input", () => {
    emailInput.classList.remove("error");
    popupHint.textContent = "";
    popupHint.className = "email-popup-hint";
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("open")) {
      closePopup();
      resetSlider();
    }
  });

  // Coming soon popup (Threads link)
  const comingSoonPopup = document.getElementById("comingSoonPopup");
  const comingSoonBackdrop = document.getElementById("comingSoonBackdrop");
  const comingSoonClose = document.getElementById("comingSoonClose");
  const threadsLink = document.getElementById("threads-link");

  function openComingSoon() {
    comingSoonPopup?.classList.add("open");
    comingSoonPopup?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeComingSoon() {
    comingSoonPopup?.classList.remove("open");
    comingSoonPopup?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  threadsLink?.addEventListener("click", (e) => {
    e.preventDefault();
    openComingSoon();
  });

  comingSoonBackdrop?.addEventListener("click", closeComingSoon);
  comingSoonClose?.addEventListener("click", closeComingSoon);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && comingSoonPopup?.classList.contains("open")) {
      closeComingSoon();
    }
  });
});
