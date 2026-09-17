/**
 * Shedaby Spa — ...the beauty galaxy
 * Front-end Logic, Firebase Firestore Sync & Smartsupp Live Chat
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9tIPz-JOvuxm3L7Y1V2Ds85tpJfLulsI",
  authDomain: "massage-a122b.firebaseapp.com",
  projectId: "massage-a122b",
  storageBucket: "massage-a122b.firebasestorage.app",
  messagingSenderId: "21373139793",
  appId: "1:21373139793:web:f4cf83055b625a28477170",
  measurementId: "G-JNV4RDEEJJ"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

// ==========================================
// SHEDABY SPA BROCHURE SERVICE CATALOG
// ==========================================
const SHEDABY_CATALOG = {
  // Massages (In-Spa)
  'swedish': {
    name: 'Swedish Massage',
    options: [{ label: 'Full Body Wellness Session', price: '25,000' }]
  },
  'deep-tissue': {
    name: 'Deep Tissue Massage',
    options: [{ label: 'Deep Muscle Relief Session', price: '30,000' }]
  },
  'aromatherapy': {
    name: 'Aromatherapy Massage',
    options: [{ label: 'Essential Oils Relaxing Session', price: '25,000' }]
  },
  'hot-stone': {
    name: 'Hot Stone Massage',
    options: [{ label: 'Warm Basalt Stone Therapy', price: '35,000' }]
  },

  // Reflexology & Targeted
  'back-massage': {
    name: 'Back Massage',
    options: [{ label: 'Upper & Lower Back Relief', price: '15,000' }]
  },
  'leg-massage': {
    name: 'Leg Massage',
    options: [{ label: 'Leg Muscle Tension & Circulation', price: '7,000' }]
  },
  'head-massage': {
    name: 'Head Massage',
    options: [{ label: 'Scalp & Neck Rejuvenation', price: '8,000' }]
  },

  // Couple Massages
  'couple-swedish': {
    name: 'Couple Swedish Massage',
    options: [{ label: 'Shared Session for 2 People', price: '45,000' }]
  },
  'couple-aroma': {
    name: 'Couple Aromatherapy Massage',
    options: [{ label: 'Shared Session for 2 People', price: '45,000' }]
  },
  'couple-hotstone': {
    name: 'Couple Hot Stone Massage',
    options: [{ label: 'Shared Session for 2 People', price: '50,000' }]
  },
  'couple-deeptissue': {
    name: 'Couple Deep Tissue Massage',
    options: [{ label: 'Shared Session for 2 People', price: '50,000' }]
  },

  // VIP Massages
  'four-hands': {
    name: 'Four Hands VIP Massage',
    options: [{ label: 'Two Synchronized Therapists', price: '45,000' }]
  },
  'erotic': {
    name: 'Erotic VIP Massage',
    options: [{ label: 'Sensual, Intimate Experience', price: '50,000' }]
  },
  'nuru': {
    name: 'Nuru VIP Massage',
    options: [{ label: 'Japanese-style Sensual Experience', price: '60,000' }]
  },

  // Home / Office Outcall Massages
  'outcall-swedish': {
    name: 'Home/Office Swedish Massage',
    options: [{ label: 'Outcall Service at Your Location', price: '50,000' }]
  },
  'outcall-deeptissue': {
    name: 'Home/Office Deep Tissue Massage',
    options: [{ label: 'Outcall Service at Your Location', price: '50,000' }]
  },
  'outcall-aroma': {
    name: 'Home/Office Aromatherapy Massage',
    options: [{ label: 'Outcall Service at Your Location', price: '50,000' }]
  },
  'outcall-hotstone': {
    name: 'Home/Office Hot Stone Massage',
    options: [{ label: 'Outcall Service at Your Location', price: '50,000' }]
  },
  'outcall-erotic': {
    name: 'Home/Office Erotic Massage',
    options: [{ label: 'Sensual Outcall Experience', price: '70,000' }]
  },
  'outcall-nuru': {
    name: 'Home/Office Nuru Massage',
    options: [{ label: 'Japanese-style Sensual Outcall', price: '80,000' }]
  },

  // Facials
  'regular-facial': {
    name: 'Regular Facial',
    options: [{ label: 'Customized Basic Facial Experience', price: '25,000' }]
  },
  'organic-facial': {
    name: 'Organic Facial',
    options: [{ label: 'Natural, Chemical-free Healthy Glow', price: '30,000' }]
  },
  'acne-facial': {
    name: 'Acne Facial',
    options: [{ label: 'Clarity & Blemish Control', price: '35,000' }]
  },
  'dermaplaning': {
    name: 'Dermaplaning Facial',
    options: [{ label: 'Exfoliates & Smooths Skin Texture', price: '35,000' }]
  },
  'led-facial': {
    name: 'LED Facial',
    options: [{ label: 'Collagen Stimulation & Skin Renewal', price: '35,000' }]
  },
  'anti-aging-facial': {
    name: 'Anti-Aging Facial',
    options: [{ label: 'Reduces Fine Lines & Wrinkles', price: '40,000' }]
  },

  // Body Scrub, Steam & Sauna
  'organic-scrub': {
    name: 'Organic Body Scrub',
    options: [{ label: 'Exfoliates & Nourishes Skin', price: '30,000' }]
  },
  'sugar-scrub': {
    name: 'Sugar Body Scrub',
    options: [{ label: 'Natural Exfoliants for Smooth Skin', price: '35,000' }]
  },
  'sauna': {
    name: 'Sauna Detox',
    options: [{ label: 'Detoxifies & Relaxes Body', price: '8,000' }]
  },
  'body-steam': {
    name: 'Body Steam',
    options: [{ label: 'Opens Pores for Deep Cleansing', price: '8,000' }]
  },
  'v-steam': {
    name: 'V Steam',
    options: [{ label: 'Hydrates & Rejuvenates Intimate Area', price: '10,000' }]
  },

  // Body Sculpting
  'belly-fat': {
    name: 'Belly Fat Reduction',
    options: [{ label: 'Targets Excess Fat for Flatter Stomach', price: '30,000' }]
  },
  'butt-lift': {
    name: 'Butt Lift',
    options: [{ label: 'Enhances & Lifts Buttocks', price: '30,000' }]
  },
  'breast-enhancement': {
    name: 'Breast Enhancement',
    options: [{ label: 'Natural, Non-invasive Lift', price: '20,000' }]
  },
  'arm-fat': {
    name: 'Arm Fat Reduction',
    options: [{ label: 'Tones & Slims Arms', price: '15,000' }]
  },

  // Waxing
  'full-body-wax': {
    name: 'Full Body Wax',
    options: [{ label: 'Complete Hair Removal for Smooth Skin', price: '45,000' }]
  },
  'brazilian-wax': {
    name: 'Brazilian Wax',
    options: [{ label: 'Complete Removal for Intimate Area', price: '20,000' }]
  },
  'bikini-wax': {
    name: 'Bikini Line Wax',
    options: [{ label: 'Defines Bikini Area', price: '15,000' }]
  },
  'full-legs-wax': {
    name: 'Full Legs Wax',
    options: [{ label: 'Smooth Legs Thigh to Toe', price: '18,000' }]
  },
  'underarms-wax': {
    name: 'Underarms Wax',
    options: [{ label: 'Reduces Sweat & Hair', price: '8,000' }]
  },
  'chin-wax': {
    name: 'Chin Wax',
    options: [{ label: 'Defines Jawline', price: '7,000' }]
  },

  // Hands & Feet Treatment
  'pedi-mani-combo': {
    name: 'Pedicure & Manicure Combined',
    options: [{ label: 'Complete Nourishing Grooming Experience', price: '30,000' }]
  },
  'pedicure': {
    name: 'Pedicure',
    options: [{ label: 'Nourishes & Beautifies Feet', price: '8,000' }]
  },
  'manicure': {
    name: 'Manicure',
    options: [{ label: 'Nourishes & Beautifies Hands', price: '5,000' }]
  },
  'foot-detox': {
    name: 'Foot Detox',
    options: [{ label: 'Removes Toxins & Rejuvenates Feet', price: '8,000' }]
  },
  'gel-pedicure': {
    name: 'Gel Polish Add-on',
    options: [{ label: 'Long-lasting Gel Polish', price: '3,000' }]
  },

  // Laser & Semi-Permanent Beauty
  'teeth-whitening': {
    name: 'Teeth Whitening',
    options: [{ label: 'Brightens & Whitens Teeth', price: '25,000' }]
  },
  'scaling-polishing': {
    name: 'Scaling & Polishing',
    options: [{ label: 'Deep Cleans & Smooths Teeth', price: '30,000' }]
  },
  'microblading': {
    name: 'Microblading Brows',
    options: [{ label: 'Hair-like Natural Strokes', price: '30,000' }]
  },
  'ombre-shading': {
    name: 'Ombré Shading Brows',
    options: [{ label: 'Gradual, Natural-looking Color', price: '35,000' }]
  },
  'classic-lash': {
    name: 'Classic Semi-Permanent Lashes',
    options: [{ label: 'Natural Individual Lashes', price: '12,000' }]
  },
  'hybrid-lash': {
    name: 'Hybrid Semi-Permanent Lashes',
    options: [{ label: 'Mix of Classic & Volume', price: '15,000' }]
  },
  'volume-lash': {
    name: 'Volume Semi-Permanent Lashes',
    options: [{ label: 'Full Voluminous Lashes', price: '20,000' }]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initFAQAccordion();
  initBookingEngine();
  initServiceSelectionQuickLinks();
  initSmartsuppTriggers();
  initScrollAnimations();
  initBackToTop();
  setCurrentYear();
});

function initStickyHeader() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}

function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

  if (!navToggle || !navMenu) return;

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  navToggle.addEventListener('click', toggleMenu);
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) toggleMenu();
    });
  });
}

function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentItem = btn.parentElement;
      const isAlreadyActive = parentItem.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isAlreadyActive) {
        parentItem.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initBookingEngine() {
  const form = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');
  const serviceSelect = document.getElementById('serviceSelect');
  const durationSelect = document.getElementById('durationSelect');
  const computedPrice = document.getElementById('computedPrice');
  const dateInput = document.getElementById('prefDate');
  const formAlert = document.getElementById('formAlert');

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  function updateOptions(selectedServiceKey) {
    durationSelect.innerHTML = '';
    const serviceData = SHEDABY_CATALOG[selectedServiceKey];

    if (!serviceData) {
      const defaultOption = document.createElement('option');
      defaultOption.textContent = '-- Choose Service First --';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      durationSelect.appendChild(defaultOption);
      computedPrice.textContent = 'Please select service & option';
      return;
    }

    serviceData.options.forEach((opt, idx) => {
      const option = document.createElement('option');
      option.value = opt.label;
      option.setAttribute('data-price', opt.price);
      option.textContent = `${opt.label} — ₦${opt.price}`;
      if (idx === 0) option.selected = true;
      durationSelect.appendChild(option);
    });

    updatePriceDisplay();
  }

  function updatePriceDisplay() {
    const selectedOption = durationSelect.options[durationSelect.selectedIndex];
    if (selectedOption && selectedOption.getAttribute('data-price')) {
      computedPrice.textContent = `₦${selectedOption.getAttribute('data-price')}`;
    } else {
      computedPrice.textContent = 'Please select service & option';
    }
  }

  serviceSelect.addEventListener('change', (e) => updateOptions(e.target.value));
  durationSelect.addEventListener('change', updatePriceDisplay);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearValidationErrors();

    const fullName = document.getElementById('fullName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const emailAddress = document.getElementById('emailAddress').value.trim();
    const guestCount = document.getElementById('guestCount').value;
    const serviceKey = serviceSelect.value;
    const duration = durationSelect.value;
    const prefDate = document.getElementById('prefDate').value;
    const prefTime = document.getElementById('prefTime').value;
    const specialRequests = document.getElementById('specialRequests').value.trim();
    const termsCheck = document.getElementById('termsCheck').checked;

    let isValid = true;

    if (!fullName) {
      showError('nameError', 'Please enter your full name');
      isValid = false;
    }

    const phonePattern = /^[\d\s\+\-\(\)]{7,20}$/;
    if (!phoneNumber || !phonePattern.test(phoneNumber)) {
      showError('phoneError', 'Please enter a valid telephone number');
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailAddress || !emailPattern.test(emailAddress)) {
      showError('emailError', 'Please enter a valid email address');
      isValid = false;
    }

    if (!serviceKey) {
      showError('serviceError', 'Please select a treatment from the brochure');
      isValid = false;
    }

    if (!duration || durationSelect.selectedIndex === -1) {
      showError('durationError', 'Please select a service option');
      isValid = false;
    }

    if (!prefDate) {
      showError('dateError', 'Please select your preferred date');
      isValid = false;
    }

    if (!prefTime) {
      showError('timeError', 'Please select a preferred time');
      isValid = false;
    }

    if (!termsCheck) {
      showError('termsError', 'You must agree to the appointment terms');
      isValid = false;
    }

    if (!isValid) {
      showAlert('Please complete all highlighted fields.', 'error');
      return;
    }

    const serviceName = SHEDABY_CATALOG[serviceKey]?.name || serviceKey;
    const finalPrice = computedPrice.textContent;

    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Securing Shedaby Booking...</span>';

    try {
      const appointmentRecord = {
        clientName: fullName,
        phone: phoneNumber,
        email: emailAddress,
        guests: guestCount,
        serviceKey: serviceKey,
        serviceName: serviceName,
        duration: duration,
        estimatedPrice: finalPrice,
        date: prefDate,
        timeSlot: prefTime,
        specialRequests: specialRequests || 'None',
        status: 'pending',
        spaLocation: '10 Ikegwuru Street Off Mummy B Road, Port Harcourt',
        createdAt: serverTimestamp(),
        source: 'Shedaby Spa Website'
      };

      const docRef = await addDoc(collection(db, 'appointments'), appointmentRecord);
      const bookingRef = docRef.id.slice(0, 7).toUpperCase();

      if (typeof window.smartsupp === 'function') {
        window.smartsupp('set', {
          name: fullName,
          email: emailAddress,
          phone: phoneNumber,
          variables: {
            bookingRef: { value: bookingRef, label: 'Booking Ref' },
            service: { value: serviceName, label: 'Service' },
            price: { value: finalPrice, label: 'Price' },
            date: { value: prefDate, label: 'Date' },
            time: { value: prefTime, label: 'Time' }
          }
        });
      }

      showAlert(
        `✨ <strong>Appointment Request Received!</strong><br>` +
        `Thank you, <strong>${escapeHtml(fullName)}</strong>. Your booking for <strong>${escapeHtml(serviceName)}</strong> (${escapeHtml(finalPrice)}) on <strong>${prefDate} at ${prefTime}</strong> is registered.<br>` +
        `<small>Reference Code: <strong>#${bookingRef}</strong>. Our Port Harcourt concierge will confirm via phone/email shortly.</small>`,
        'success'
      );

      form.reset();
      computedPrice.textContent = 'Please select service & option';

    } catch (error) {
      console.error('Error saving Shedaby appointment:', error);
      showAlert('Could not record your appointment. Please chat with us live using the widget below.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  });

  function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = message;
      if (errorEl.previousElementSibling) errorEl.previousElementSibling.classList.add('has-error');
    }
  }

  function clearValidationErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    formAlert.style.display = 'none';
  }

  function showAlert(htmlMsg, type) {
    formAlert.innerHTML = htmlMsg;
    formAlert.className = `form-alert ${type}`;
    formAlert.style.display = 'block';
    formAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function initSmartsuppTriggers() {
  const floatingBtn = document.getElementById('smartsuppChatBtn');
  if (floatingBtn) {
    floatingBtn.addEventListener('click', () => {
      if (typeof window.smartsupp === 'function') window.smartsupp('chat:open');
    });
  }
}

function initServiceSelectionQuickLinks() {
  const serviceButtons = document.querySelectorAll('.btn-book-service');
  const serviceSelect = document.getElementById('serviceSelect');
  const appointmentSection = document.getElementById('appointment');

  serviceButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = button.getAttribute('data-service-key');

      if (serviceKey && serviceSelect) {
        serviceSelect.value = serviceKey;
        serviceSelect.dispatchEvent(new Event('change'));
        appointmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        serviceSelect.focus();
      }
    });
  });
}

function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));
}

function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) yearElement.textContent = new Date().getFullYear();
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}