/**
 * AuraSerene Luxury Massage — Admin & Concierge Engine
 * Firebase Modular SDK (Auth & Realtime Firestore)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// Firebase configuration matching project
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
const auth = getAuth(app);
const db = getFirestore(app);

// State
let appointmentsCache = [];
let unsubscribeFirestore = null;

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
const statusFilter = document.getElementById('statusFilter');

// Modal Elements
const detailsModal = document.getElementById('detailsModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

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

// ==========================================
// 2. LOGIN & LOGOUT HANDLERS
// ==========================================
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
    if (error.code === 'auth/invalid-credential') {
      authAlert.textContent = 'Invalid email or password. Verify the user exists in Firebase Auth.';
    } else if (error.code === 'auth/too-many-requests') {
      authAlert.textContent = 'Too many attempts. Please wait a few minutes before trying again.';
    } else {
      authAlert.textContent = error.message || 'Authentication failed.';
    }
    authAlert.style.display = 'block';
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<span>Sign In to Sanctuary Portal</span>';
  }
});

logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

// ==========================================
// 3. REALTIME FIRESTORE SUBSCRIPTION
// ==========================================
function subscribeToAppointments() {
  const collRef = collection(db, 'appointments');

  // Stream raw collection without server-side index constraints; sort in-memory
  unsubscribeFirestore = onSnapshot(collRef, (snapshot) => {
    appointmentsCache = [];
    snapshot.forEach(docSnap => {
      appointmentsCache.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    // Client-side date sorting handles missing or mixed timestamp types safely
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
        <td colspan="7" class="empty-state">
          Firestore Permission Error. Make sure you are authenticated with proper read permissions.
        </td>
      </tr>
    `;
  });
}

// ==========================================
// 4. METRICS COMPUTATION
// ==========================================
function renderMetrics(data) {
  const todayStr = new Date().toISOString().split('T')[0];

  let totalCount = data.length;
  let todayCount = 0;
  let pendingCount = 0;
  let totalRevenue = 0;

  data.forEach(item => {
    if (item.date === todayStr) todayCount++;
    if (item.status === 'pending') pendingCount++;

    if (item.status === 'completed' || item.status === 'confirmed') {
      const rawPrice = (item.estimatedPrice || '').replace(/[^\d]/g, '');
      const num = parseInt(rawPrice, 10);
      if (!isNaN(num)) totalRevenue += num;
    }
  });

  document.getElementById('statTotal').textContent = totalCount;
  document.getElementById('statToday').textContent = todayCount;
  document.getElementById('statPending').textContent = pendingCount;
  document.getElementById('statRevenue').textContent = `₦${totalRevenue.toLocaleString()}`;
}

// ==========================================
// 5. RENDER TABLE WITH REAL-TIME FILTERS
// ==========================================
function renderTable() {
  const queryTerm = searchInput.value.toLowerCase().trim();
  const filterVal = statusFilter.value;

  const filtered = appointmentsCache.filter(apt => {
    const matchesStatus = filterVal === 'all' || apt.status === filterVal;
    const refCode = apt.id.slice(0, 7).toLowerCase();
    const name = (apt.clientName || '').toLowerCase();
    const phone = (apt.phone || '').toLowerCase();
    const email = (apt.email || '').toLowerCase();

    const matchesSearch = name.includes(queryTerm) || 
                          phone.includes(queryTerm) || 
                          email.includes(queryTerm) || 
                          refCode.includes(queryTerm);

    return matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    appointmentsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">No matching appointments found.</td>
      </tr>
    `;
    return;
  }

  appointmentsTableBody.innerHTML = filtered.map(apt => {
    const ref = apt.id.slice(0, 7).toUpperCase();
    const status = apt.status || 'pending';

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
          <select class="status-dropdown" data-id="${escapeHtml(apt.id)}">
            <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="confirmed" ${status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="completed" ${status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="cancelled" ${status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <div class="table-row-actions">
            <button class="btn-icon view-btn" data-id="${escapeHtml(apt.id)}" title="View details">👁</button>
            <button class="btn-icon delete delete-btn" data-id="${escapeHtml(apt.id)}" title="Delete record">🗑</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  attachRowListeners();
}

// ==========================================
// 6. EVENT LISTENERS
// ==========================================
function attachRowListeners() {
  document.querySelectorAll('.status-dropdown').forEach(dropdown => {
    dropdown.addEventListener('change', async (e) => {
      const docId = e.target.getAttribute('data-id');
      const newStatus = e.target.value;

      try {
        await updateDoc(doc(db, 'appointments', docId), {
          status: newStatus
        });
      } catch (err) {
        console.error('Error updating status:', err);
        alert('Could not update status: ' + err.message);
      }
    });
  });

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.getAttribute('data-id');
      const apt = appointmentsCache.find(a => a.id === docId);
      if (!apt) return;

      const cleanPhone = encodeURIComponent(apt.phone || '');

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
          <a href="tel:${cleanPhone}" style="color:var(--color-gold);">${escapeHtml(apt.phone || 'N/A')}</a>
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

modalClose.addEventListener('click', () => detailsModal.classList.remove('active'));
window.addEventListener('click', (e) => {
  if (e.target === detailsModal) detailsModal.classList.remove('active');
});

searchInput.addEventListener('input', renderTable);
statusFilter.addEventListener('change', renderTable);

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