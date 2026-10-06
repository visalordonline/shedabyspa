/**
 * Shedaby Spa — the beauty galaxy
 * Front-end Logic, Dynamic Guest Pricing, Firebase Firestore Sync & PWA
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9tIPz-JOvuxm3L7Y1V2Ds85tpJfLulsI",
  authDomain: "massage-a122b.firebaseapp.com",
  projectId: "massage-a122b",
  storageBucket: "massage-a122b.firebasestorage.app",
  messagingSenderId: "21373139793",
  appId: "1:21373139793:web:f4cf83055b625a28477170",
  measurementId: "G-JNV4RDEEJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// UPDATED CATALOG FROM BROCHURE
// ==========================================
const SHEDABY_CATALOG = {
  // Massage
  'deep-tissue': {
    name: 'Deep Tissue Massage',
    options: [{ label: 'Relieves pain & tension in deep muscle layers', price: '30,000' }]
  },
  'swedish': {
    name: 'Swedish Massage',
    options: [{ label: 'Gentle, relaxing strokes for overall wellness', price: '25,000' }]
  },
  'aromatherapy': {
    name: 'Aromatherapy Massage',
    options: [{ label: 'Essential oils promote relaxation and calmness', price: '25,000' }]
  },
  'hot-stone': {
    name: 'Hot Stone Massage',
    options: [{ label: 'Warm stones ease muscle tension & promote relaxation', price: '35,000' }]
  },

  // Reflexology Massage
  'back-massage': {
    name: 'Back Massage',
    options: [{ label: 'Relieves upper and lower back tension', price: '15,000' }]
  },
  'leg-massage': {
    name: 'Leg Massage',
    options: [{ label: 'Eases leg muscle tension and promotes circulation', price: '7,000' }]
  },
  'head-massage': {
    name: 'Head Massage',
    options: [{ label: 'Relaxes and rejuvenates the scalp and neck', price: '8,000' }]
  },

  // Couple Massage
  'couple-swedish': {
    name: 'Couple Swedish Massage',
    options: [{ label: 'Shared relaxation experience for two', price: '45,000' }]
  },
  'couple-aroma': {
    name: 'Couple Aromatherapy Massage',
    options: [{ label: 'Shared relaxation experience for two', price: '45,000' }]
  },
  'couple-hotstone': {
    name: 'Couple Hot Stone Massage',
    options: [{ label: 'Shared relaxation experience for two', price: '50,000' }]
  },
  'couple-deeptissue': {
    name: 'Couple Deep Tissue Massage',
    options: [{ label: 'Shared relaxation experience for two', price: '50,000' }]
  },

  // VIP Massage
  'four-hands': {
    name: 'Four Hands Massage',
    options: [{ label: 'Double the relaxation with two therapists', price: '45,000' }]
  },
  'erotic': {
    name: 'Erotic Massage',
    options: [{ label: 'Sensual, intimate experience', price: '50,000' }]
  },
  'nuru': {
    name: 'Nuru Massage',
    options: [{ label: 'Japanese-style, sensual massage', price: '60,000' }]
  },

  // Home/Office Massage
  'outcall-deeptissue': {
    name: 'Home/Office Deep Tissue Massage',
    options: [{ label: 'Relieves pain and tension in deep muscle layers', price: '50,000' }]
  },
  'outcall-swedish': {
    name: 'Home/Office Swedish Massage',
    options: [{ label: 'Gentle, relaxing strokes for overall wellness', price: '50,000' }]
  },
  'outcall-aroma': {
    name: 'Home/Office Aromatherapy Massage',
    options: [{ label: 'Essential oils promote relaxation and calmness', price: '50,000' }]
  },
  'outcall-hotstone': {
    name: 'Home/Office Hot Stone Massage',
    options: [{ label: 'Warm stones ease muscle tension & promote relaxation', price: '50,000' }]
  },
  'outcall-erotic': {
    name: 'Home/Office Erotic Massage',
    options: [{ label: 'Sensual, intimate experience', price: '70,000' }]
  },
  'outcall-nuru': {
    name: 'Home/Office Nuru Massage',
    options: [{ label: 'Japanese-style, sensual massage', price: '80,000' }]
  },

  // Facials
  'regular-facial': {
    name: 'Regular Facial',
    options: [{ label: 'Customized, basic facial experience', price: '25,000' }]
  },
  'organic-facial': {
    name: 'Organic Facial',
    options: [{ label: 'Natural, chemical-free products for a healthy glow', price: '30,000' }]
  },
  'acne-facial': {
    name: 'Acne Facial',
    options: [{ label: 'Targets acne-prone skin for clarity and control', price: '35,000' }]
  },
  'dermaplaning': {
    name: 'Dermaplaning',
    options: [{ label: 'Exfoliates and smooths skin texture', price: '35,000' }]
  },
  'led-facial': {
    name: 'LED Facial',
    options: [{ label: 'Stimulates collagen production and skin renewal', price: '35,000' }]
  },
  'anti-aging-facial': {
    name: 'Anti-Aging Facial',
    options: [{ label: 'Reduces fine lines and wrinkles', price: '40,000' }]
  },

  // Body Scrub/Polish & Steam
  'organic-scrub': {
    name: 'Organic Scrub',
    options: [{ label: 'Exfoliates and nourishes skin', price: '30,000' }]
  },
  'sugar-scrub': {
    name: 'Sugar Scrub',
    options: [{ label: 'Natural exfoliants for smooth skin', price: '35,000' }]
  },
  'coffee-scrub': {
    name: 'Coffee Scrub',
    options: [{ label: 'Stimulates circulation and reduces cellulite', price: '1,000' }]
  },
  'sauna': {
    name: 'Sauna Detox',
    options: [{ label: 'Detoxifies and relaxes', price: '8,000' }]
  },
  'body-steam': {
    name: 'Body Steam',
    options: [{ label: 'Opens pores for deep cleansing', price: '8,000' }]
  },
  'v-steam': {
    name: 'V Steam',
    options: [{ label: 'Hydrates and rejuvenates intimate area', price: '10,000' }]
  },

  // Body Sculpting
  'belly-fat': {
    name: 'Belly Fat Reduction',
    options: [{ label: 'Targets excess fat for a flatter stomach', price: '30,000' }]
  },
  'butt-lift': {
    name: 'Butt Lift',
    options: [{ label: 'Enhances and lifts buttocks', price: '30,000' }]
  },
  'breast-enhancement': {
    name: 'Breast Enhancement',
    options: [{ label: 'Natural, non-invasive breast lift', price: '20,000' }]
  },
  'arm-fat': {
    name: 'Arm Fat Reduction',
    options: [{ label: 'Tones and slims arms', price: '15,000' }]
  },

  // Waxing
  'full-body-wax': {
    name: 'Full Body Wax',
    options: [{ label: 'Complete hair removal for smooth skin', price: '45,000' }]
  },
  'chin-wax': {
    name: 'Chin Wax',
    options: [{ label: 'Defines jawline', price: '7,000' }]
  },
  'full-legs-wax': {
    name: 'Full Legs Wax',
    options: [{ label: 'Smooth legs from thigh to toe', price: '18,000' }]
  },
  'underarms-wax': {
    name: 'Underarms Wax',
    options: [{ label: 'Reduces sweat and hair', price: '8,000' }]
  },
  'bikini-wax': {
    name: 'Bikini Line Wax',
    options: [{ label: 'Defines bikini area', price: '15,000' }]
  },
  'brazilian-wax': {
    name: 'Brazilian Wax',
    options: [{ label: 'Complete hair removal for intimate area', price: '20,000' }]
  },

  // Foot & Hand Treatment
  'pedicure': {
    name: 'Pedicure',
    options: [{ label: 'Nourishes and beautifies feet', price: '8,000' }]
  },
  'gel-pedicure': {
    name: 'Gel Pedicure',
    options: [{ label: 'Long-lasting, gel polish', price: '3,000' }]
  },
  'manicure': {
    name: 'Manicure',
    options: [{ label: 'Nourishes and beautifies hands', price: '5,000' }]
  },
  'foot-detox': {
    name: 'Foot Detox',
    options: [{ label: 'Removes toxins and rejuvenates feet', price: '8,000' }]
  },
  'cutting-nails': {
    name: 'Cutting Nails (Hand & Leg)',
    options: [{ label: 'Trims and shapes nails', price: '5,000' }]
  },
  'pedi-mani-combo': {
    name: 'Pedicure & Manicure Combo',
    options: [{ label: 'Stimulates collagen production and skin renewal', price: '30,000' }]
  },

  // Semi-Permanent Lash
  'classic-lash': {
    name: 'Classic Lash',
    options: [{ label: 'Natural, individual lashes', price: '12,000' }]
  },
  'hybrid-lash': {
    name: 'Hybrid Lash',
    options: [{ label: 'Mix of classic and volume lashes', price: '15,000' }]
  },
  'volume-lash': {
    name: 'Volume Lash',
    options: [{ label: 'Full, voluminous lashes', price: '20,000' }]
  },
  'mega-volume-lash': {
    name: 'Mega Volume Lash',
    options: [{ label: 'Extra full, dramatic lashes', price: '25,000' }]
  },

  // Laser & Semi-Permanent Brow
  'teeth-whitening': {
    name: 'Teeth Whitening',
    options: [{ label: 'Brightens and whitens teeth', price: '25,000' }]
  },
  'scaling-polishing': {
    name: 'Scaling & Polishing',
    options: [{ label: 'Deep cleans and smooths teeth', price: '30,000' }]
  },
  'tag-remover': {
    name: 'Tag Remover',
    options: [{ label: 'Removes skin tags', price: '18,000' }]
  },
  'microblading': {
    name: 'Microblading Brow',
    options: [{ label: 'Hair-like strokes for natural brows', price: '30,000' }]
  },
  'ombre-shading': {
    name: 'Ombré Shading Brow',
    options: [{ label: 'Gradual, natural-looking color', price: '35,000' }]
  },
  'brow-combo': {
    name: 'Combo Brow',
    options: [{ label: 'Combination of microblading and shading', price: '40,000' }]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initStickyHeader();
  initMobileMenu();
  initFAQAccordion();
  initBookingEngine();
  initServiceSelectionQuickLinks();
  initSmartsuppTriggers();
  initScrollAnimations();
  initBackToTop();
  setCurrentYear();
  initPWA();
});

// ==========================================
// 1. THEME TOGGLE
// ==========================================
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('shedaby-theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (themeIcon) themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('shedaby-theme', nextTheme);
    if (themeIcon) themeIcon.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
  });
}

// ==========================================
// 2. BOOKING ENGINE WITH LIVE PRICING & PAYMENT
// ==========================================
function initBookingEngine() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const guestSelect = document.getElementById('guestCount');
  const serviceSelect = document.getElementById('serviceSelect');
  const durationSelect = document.getElementById('durationSelect');
  const computedPrice = document.getElementById('computedPrice');
  const dateInput = document.getElementById('prefDate');
  const formAlert = document.getElementById('formAlert');
  const payCopyBtn = document.getElementById('payCopyBtn');
  const payAcctNum = document.getElementById('payAcctNum');
  const payOptionLabels = document.querySelectorAll('.pay-option');
  const payRadioInputs = document.querySelectorAll('input[name="payOption"]');

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Populate options when service changes
  function updateOptions(selectedServiceKey) {
    if (!durationSelect) return;
    durationSelect.innerHTML = '';
    const serviceData = SHEDABY_CATALOG[selectedServiceKey];

    if (!serviceData) {
      const defaultOption = document.createElement('option');
      defaultOption.textContent = '-- Choose Service First --';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      durationSelect.appendChild(defaultOption);
      if (computedPrice) computedPrice.textContent = 'Please select service & option';
      return;
    }

    serviceData.options.forEach((opt, idx) => {
      const option = document.createElement('option');
      option.value = opt.label;
      option.setAttribute('data-base-price', opt.price);
      option.setAttribute('data-base-label', opt.label);
      if (idx === 0) option.selected = true;
      durationSelect.appendChild(option);
    });

    calculateDynamicPrice();
  }

  // Dynamic price recalculation
  function calculateDynamicPrice() {
    if (!durationSelect || !computedPrice) return;
    const selectedOption = durationSelect.options[durationSelect.selectedIndex];
    if (!selectedOption || !selectedOption.getAttribute('data-base-price')) {
      computedPrice.textContent = 'Please select service & option';
      return;
    }

    const rawBase = selectedOption.getAttribute('data-base-price').replace(/[^\d]/g, '');
    const basePrice = parseInt(rawBase, 10);
    const baseLabel = selectedOption.getAttribute('data-base-label') || selectedOption.value;
    const guestType = guestSelect ? guestSelect.value : '1 Guest';
    const serviceKey = serviceSelect ? serviceSelect.value : '';

    let calculatedTotal = basePrice;
    let labelNote = '';

    const isAlreadyCoupleService = serviceKey.startsWith('couple-');
    const isAlreadyOutcallService = serviceKey.startsWith('outcall-');

    switch (guestType) {
      case '2 Guests':
        if (isAlreadyCoupleService) {
          calculatedTotal = basePrice;
          labelNote = ' (Couple Suite Rate)';
        } else {
          calculatedTotal = basePrice * 2;
          labelNote = ' (2 Guests Session)';
        }
        break;

      case 'Group Booking':
        calculatedTotal = basePrice * 4;
        labelNote = ' (Bridal / Group Tier - 4 Persons)';
        break;

      case 'Home/Office Outcall':
        if (isAlreadyOutcallService) {
          calculatedTotal = basePrice;
          labelNote = ' (Standard Outcall)';
        } else {
          calculatedTotal = Math.max(50000, basePrice + 20000);
          labelNote = ' (Mobile Outcall & Transport)';
        }
        break;

      case '1 Guest':
      default:
        calculatedTotal = basePrice;
        labelNote = '';
        break;
    }

    const formattedPrice = `₦${calculatedTotal.toLocaleString()}`;
    computedPrice.textContent = `${formattedPrice}${labelNote}`;
    computedPrice.setAttribute('data-final-price', formattedPrice);

    selectedOption.textContent = `${baseLabel} — ${formattedPrice}`;
  }

  // Event Listeners for select controls
  if (guestSelect) {
    guestSelect.addEventListener('change', calculateDynamicPrice);
  }

  if (serviceSelect) {
    serviceSelect.addEventListener('change', (e) => updateOptions(e.target.value));
    if (serviceSelect.value) {
      updateOptions(serviceSelect.value);
    }
  }

  if (durationSelect) {
    durationSelect.addEventListener('change', calculateDynamicPrice);
  }

  // --- Payment Option Selection Logic (Persistent Bold & Tick) ---
  function syncPaymentUI() {
    payOptionLabels.forEach(label => {
      const radio = label.querySelector('input[type="radio"]');
      if (radio && radio.checked) {
        label.classList.add('selected');
      } else {
        label.classList.remove('selected');
      }
    });
    const err = document.getElementById('payError');
    if (err) err.textContent = '';
  }

  payRadioInputs.forEach(radio => {
    radio.addEventListener('change', syncPaymentUI);
  });

  payOptionLabels.forEach(label => {
    label.addEventListener('click', () => {
      const radio = label.querySelector('input[type="radio"]');
      if (radio && !radio.checked) {
        radio.checked = true;
        syncPaymentUI();
      }
    });
  });

  // Copy Account Number
  if (payCopyBtn && payAcctNum) {
    payCopyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(payAcctNum.textContent.trim());
        payCopyBtn.textContent = '✓ Account Number Copied';
        setTimeout(() => {
          payCopyBtn.textContent = '📋 Copy Account Number';
        }, 3000);
      } catch (err) {
        payCopyBtn.textContent = 'Press and hold to copy';
      }
    });
  }

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearValidationErrors();

    const fullName = document.getElementById('fullName')?.value.trim() || '';
    const phoneNumber = document.getElementById('phoneNumber')?.value.trim() || '';
    const emailAddress = document.getElementById('emailAddress')?.value.trim() || '';
    const guestCount = guestSelect?.value || '1 Guest';
    const serviceKey = serviceSelect?.value || '';
    const duration = durationSelect?.value || '';
    const prefDate = document.getElementById('prefDate')?.value || '';
    const prefTime = document.getElementById('prefTime')?.value || '';
    const specialRequests = document.getElementById('specialRequests')?.value.trim() || '';
    const termsCheck = document.getElementById('termsCheck')?.checked || false;

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

    const payChoice = document.querySelector('input[name="payOption"]:checked');
    if (!payChoice) {
      showError('payError', 'Please select a payment option');
      isValid = false;
    }

    if (!isValid) {
      showAlert('Please complete all highlighted fields.', 'error');
      return;
    }

    const serviceName = SHEDABY_CATALOG[serviceKey]?.name || serviceKey;
    const finalPrice = computedPrice.getAttribute('data-final-price') || computedPrice.textContent;

    const PAYMENT_DETAILS = {
      'paid': {
        status: 'paid_claimed',
        label: 'Payment Made (Zenith Bank Transfer - Awaiting Verification)',
        short: 'Transfer Made'
      },
      'pay-at-spa': {
        status: 'pay_at_spa',
        label: 'Will Pay at Spa on Arrival',
        short: 'Pay at Spa'
      }
    };
    const paymentMeta = PAYMENT_DETAILS[payChoice.value] || {
      status: 'pending_payment',
      label: 'Not specified',
      short: 'Not specified'
    };

    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Synchronizing Reservation...</span>';
    }

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
        paymentOption: payChoice.value,
        paymentStatus: paymentMeta.status,
        paymentLabel: paymentMeta.label,
        paymentShort: paymentMeta.short,
        paymentBank: 'Zenith Bank',
        status: 'pending',
        spaLocation: '10 Ikegwuru Street Off Mummy B Road, Port Harcourt',
        createdAt: serverTimestamp(),
        source: 'Shedaby Spa Website'
      };

      const docRef = await addDoc(collection(db, 'appointments'), appointmentRecord);
      const bookingRef = docRef.id.slice(0, 7).toUpperCase();

      const payConfirmationMsg = payChoice.value === 'paid'
        ? 'Thank you for your payment transfer. Our concierge team will verify it and confirm your session shortly.'
        : 'Your reservation is held. Payment will be collected on arrival at our spa reception desk.';

      showAlert(
        `✨ <strong>Appointment Request Received!</strong><br>` +
        `Thank you, <strong>${escapeHtml(fullName)}</strong>. Your booking for <strong>${escapeHtml(serviceName)}</strong> (${escapeHtml(finalPrice)}) on <strong>${escapeHtml(prefDate)} at ${escapeHtml(prefTime)}</strong> has been registered.<br>` +
        `<strong>Payment Selected:</strong> ${escapeHtml(paymentMeta.label)}<br>` +
        `${payConfirmationMsg}<br>` +
        `<small>Reference Code: <strong>#${bookingRef}</strong>. Concierge sync completed.</small>`,
        'success'
      );

      form.reset();
      syncPaymentUI();
      if (payCopyBtn) payCopyBtn.textContent = '📋 Copy Account Number';
      if (computedPrice) computedPrice.textContent = 'Please select service & option';
      if (durationSelect) {
        durationSelect.innerHTML = '<option value="" disabled selected>-- Choose Service First --</option>';
      }
    } catch (error) {
      console.error('Firestore submission error:', error);
      showAlert(`Firestore Error: ${error.message}. Ensure your database rules permit record writes.`, 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
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
    if (formAlert) formAlert.style.display = 'none';
  }

  function showAlert(htmlMsg, type) {
    if (!formAlert) return;
    formAlert.innerHTML = htmlMsg;
    formAlert.className = `form-alert ${type}`;
    formAlert.style.display = 'block';
    formAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ==========================================
// 3. UI UTILITIES
// ==========================================
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

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
        const q = item.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      if (!isAlreadyActive) {
        parentItem.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initServiceSelectionQuickLinks() {
  const serviceButtons = document.querySelectorAll('.btn-book-service');
  const serviceSelect = document.getElementById('serviceSelect');
  const appointmentSection = document.getElementById('appointment');

  serviceButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = button.getAttribute('data-service-key');

      if (serviceKey && serviceSelect && appointmentSection) {
        serviceSelect.value = serviceKey;
        serviceSelect.dispatchEvent(new Event('change'));
        appointmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        serviceSelect.focus();
      }
    });
  });
}

function initSmartsuppTriggers() {
  const floatingBtn = document.getElementById('smartsuppChatBtn');
  if (floatingBtn) {
    floatingBtn.addEventListener('click', () => {
      if (typeof window.smartsupp === 'function') window.smartsupp('chat:open');
    });
  }
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

// ==========================================
// 4. PWA ENGINE
// ==========================================
function initPWA() {
  let deferredPrompt = null;
  const installBtn = document.getElementById('pwaInstallBtn');

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'inline-flex';
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      installBtn.style.display = 'none';
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    });
  }

  window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.style.display = 'none';
    deferredPrompt = null;
  });
}