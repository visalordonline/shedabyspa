/**
 * Shedaby Spa Concierge & Admin Engine
 * Firebase Modular SDK (Realtime Firestore & Email Confirmation Copy)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  deleteDoc 
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let appointmentsCache = [];
let unsubscribeFirestore = null;
let currentViewingAppointment = null;

// DOM Elements
const authScreen = document.getElementById('authScreen');
const dashboardLayout = document.getElementById('dashboardLayout');
const loginForm = document.getElementById('loginForm');
const authAlert = document.getElementById('authAlert');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userDisplayEmail = document.getElementById('userDisplayEmail');

const appointmentsTableBody = document.getElementById('appointmentsTableBody');
const searchInput = document.getElementById('searchInput');

// Modal Elements
const detailsModal = document.getElementById('detailsModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalCopyBtn = document.getElementById('modalCopyBtn');
const copyToast = document.getElementById('copyToast');

// ==========================================
// 1. AUTHENTICATION LISTENER
// ==========================================
onAuthStateChanged(auth, (user) => {
  if (user) {
    authScreen.style.display = 'none';
    dashboardLayout.style.display = 'block';
    userDisplayEmail.textContent = user.email || 'Admin';
    subscribeToAppointments();
  } else {
    authScreen.style.display = 'flex';
    dashboardLayout.style.display = 'none';
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
      unsubscribeFirestore = null;
    }
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authAlert.style.display = 'none';

  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;

  if (!email || !password) {
    authAlert.textContent = 'Please provide both email and password.';
    authAlert.style.display = 'block';
    return;
  }

  loginBtn.disabled = true;
  loginBtn.innerHTML = '<span>Verifying Credentials...</span>';

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Login error:', error);
    authAlert.textContent = error.message || 'Authentication failed.';
    authAlert.style.display = 'block';
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<span>Sign In to Sanctuary Portal</span>';
  }
});

logoutBtn.addEventListener('click', () => signOut(auth));

// ==========================================
// 2. REALTIME FIRESTORE SUBSCRIPTION
// ==========================================
function subscribeToAppointments() {
  const collRef = collection(db, 'appointments');

  unsubscribeFirestore = onSnapshot(collRef, (snapshot) => {
    appointmentsCache = [];
    snapshot.forEach(docSnap => {
      appointmentsCache.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    appointmentsCache.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      return timeB - timeA;
    });

    renderMetrics(appointmentsCache);
    renderTable();
  }, (error) => {
    console.error('Error streaming appointments:', error);
    appointmentsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          Firestore Permission Error. Verify you are authenticated.
        </td>
      </tr>
    `;
  });
}

// ==========================================
// 3. METRICS
// ==========================================
function renderMetrics(data) {
  const todayStr = new Date().toISOString().split('T')[0];

  let totalCount = data.length;
  let todayCount = 0;
  let totalRevenue = 0;

  data.forEach(item => {
    if (item.date === todayStr) todayCount++;
    const rawPrice = (item.estimatedPrice || '').replace(/[^\d]/g, '');
    const num = parseInt(rawPrice, 10);
    if (!isNaN(num)) totalRevenue += num;
  });

  document.getElementById('statTotal').textContent = totalCount;
  document.getElementById('statToday').textContent = todayCount;
  document.getElementById('statRevenue').textContent = `₦${totalRevenue.toLocaleString()}`;
}

// ==========================================
// 4. RENDER TABLE
// ==========================================
function renderTable() {
  const queryTerm = searchInput.value.toLowerCase().trim();

  const filtered = appointmentsCache.filter(apt => {
    const refCode = apt.id.slice(0, 7).toLowerCase();
    const name = (apt.clientName || '').toLowerCase();
    const phone = (apt.phone || '').toLowerCase();
    const email = (apt.email || '').toLowerCase();

    return name.includes(queryTerm) || 
           phone.includes(queryTerm) || 
           email.includes(queryTerm) || 
           refCode.includes(queryTerm);
  });

  if (filtered.length === 0) {
    appointmentsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">No appointments found.</td>
      </tr>
    `;
    return;
  }

  appointmentsTableBody.innerHTML = filtered.map(apt => {
    const ref = apt.id.slice(0, 7).toUpperCase();

    return `
      <tr data-id="${escapeHtml(apt.id)}">
        <td><span class="ref-tag">#${ref}</span></td>
        <td>
          <span class="client-name">${escapeHtml(apt.clientName || 'Unnamed')}</span>
          <span class="client-sub">${escapeHtml(apt.phone || 'N/A')}</span>
          <span class="client-sub">${escapeHtml(apt.email || '')}</span>
        </td>
        <td>
          <strong>${escapeHtml(apt.serviceName || 'Custom Service')}</strong>
          <span class="client-sub">${escapeHtml(apt.duration || '')} • ${escapeHtml(apt.guests || '1 Guest')}</span>
        </td>
        <td>
          <strong>${escapeHtml(apt.date || 'TBD')}</strong>
          <span class="client-sub">${escapeHtml(apt.timeSlot || '')}</span>
        </td>
        <td>
          <strong>${escapeHtml(apt.estimatedPrice || '₦0')}</strong>
        </td>
        <td>
          <div class="table-row-actions">
            <button class="btn-icon view-btn" data-id="${escapeHtml(apt.id)}" title="View Client Info">👁</button>
            <button class="btn-icon delete delete-btn" data-id="${escapeHtml(apt.id)}" title="Delete record">🗑</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  attachRowListeners();
}

// ==========================================
// 5. MODAL & ONE-CLICK EMAIL COPY
// ==========================================
function attachRowListeners() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.getAttribute('data-id');
      const apt = appointmentsCache.find(a => a.id === docId);
      if (!apt) return;

      currentViewingAppointment = apt;
      const cleanPhone = encodeURIComponent(apt.phone || '');
      copyToast.style.display = 'none';

      modalBody.innerHTML = `
        <div class="detail-row">
          <span>Booking Reference:</span>
          <strong>#${apt.id.slice(0, 7).toUpperCase()}</strong>
        </div>
        <div class="detail-row">
          <span>Guest Name:</span>
          <strong>${escapeHtml(apt.clientName || 'N/A')}</strong>
        </div>
        <div class="detail-row">
          <span>Contact Number:</span>
          <a href="tel:${cleanPhone}" style="color:var(--color-gold); font-weight:600;">${escapeHtml(apt.phone || 'N/A')}</a>
        </div>
        <div class="detail-row">
          <span>Email Address:</span>
          <strong>${escapeHtml(apt.email || 'N/A')}</strong>
        </div>
        <div class="detail-row">
          <span>Therapy Modality:</span>
          <strong>${escapeHtml(apt.serviceName || 'N/A')}</strong>
        </div>
        <div class="detail-row">
          <span>Session Duration:</span>
          <strong>${escapeHtml(apt.duration || 'N/A')}</strong>
        </div>
        <div class="detail-row">
          <span>Party Size:</span>
          <strong>${escapeHtml(apt.guests || '1 Guest')}</strong>
        </div>
        <div class="detail-row">
          <span>Scheduled Date:</span>
          <strong>${escapeHtml(apt.date || 'N/A')} at ${escapeHtml(apt.timeSlot || '')}</strong>
        </div>
        <div class="detail-row">
          <span>Estimated Fee:</span>
          <strong>${escapeHtml(apt.estimatedPrice || '₦0')}</strong>
        </div>
        <div>
          <label style="font-size:0.8rem; font-weight:600; display:block; margin-bottom:6px;">Special Requests / Focus Areas:</label>
          <div class="special-req-box">${escapeHtml(apt.specialRequests || 'No special requests submitted.')}</div>
        </div>
      `;

      detailsModal.classList.add('active');
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const docId = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to permanently remove this appointment record?')) {
        try {
          await deleteDoc(doc(db, 'appointments', docId));
        } catch (err) {
          console.error('Error deleting record:', err);
          alert('Could not delete record: ' + err.message);
        }
      }
    });
  });
}

// Copy Confirmation Email Function
modalCopyBtn.addEventListener('click', async () => {
  if (!currentViewingAppointment) return;

  const apt = currentViewingAppointment;
  const ref = apt.id.slice(0, 7).toUpperCase();

  const confirmationEmailText = 
`Dear ${apt.clientName || 'Valued Guest'},

Your appointment has been confirmed by the admin at Shedaby Spa (...the beauty galaxy).

Here are your confirmed reservation details:
- Booking Reference: #${ref}
- Treatment: ${apt.serviceName || 'Spa Therapy'}
- Option: ${apt.duration || 'Full Session'}
- Date & Time: ${apt.date || 'Scheduled Date'} at ${apt.timeSlot || 'Scheduled Time'}
- Party Size: ${apt.guests || '1 Guest'}
- Total Fee: ${apt.estimatedPrice || '₦0'}
- Location: 10 Ikegwuru Street Off Mummy B Road, Port Harcourt

If you have any questions or need to reschedule, please contact us on 08174605032 or 08139570302.

We look forward to welcoming you to our serene sanctuary.

Warm regards,
Shedaby Spa Concierge Desk`;

  try {
    await navigator.clipboard.writeText(confirmationEmailText);
    copyToast.style.display = 'inline-block';
    setTimeout(() => {
      copyToast.style.display = 'none';
    }, 3500);
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    alert('Failed to copy. Please allow clipboard permissions.');
  }
});

modalClose.addEventListener('click', () => {
  detailsModal.classList.remove('active');
  currentViewingAppointment = null;
});

window.addEventListener('click', (e) => {
  if (e.target === detailsModal) {
    detailsModal.classList.remove('active');
    currentViewingAppointment = null;
  }
});

searchInput.addEventListener('input', renderTable);

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}