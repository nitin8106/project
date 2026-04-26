// ===== DATA =====
const BIKES = [
  { id: 1, name: "Yamaha R15", category: "sports", price_hour: 80, price_day: 600, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", desc: "High-performance sports bike with aggressive styling.", available: true },
  { id: 2, name: "Royal Enfield Classic", category: "cruiser", price_hour: 100, price_day: 800, img: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400", desc: "Iconic cruiser with a thumping engine and retro look.", available: true },
  { id: 3, name: "Ather 450X", category: "electric", price_hour: 60, price_day: 450, img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400", desc: "Smart electric scooter with fast charging & app connectivity.", available: true },
  { id: 4, name: "KTM Duke 390", category: "sports", price_hour: 120, price_day: 950, img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400", desc: "Naked street fighter with razor-sharp handling.", available: true },
  { id: 5, name: "Bajaj Avenger 220", category: "cruiser", price_hour: 70, price_day: 550, img: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400", desc: "Comfortable cruiser perfect for long highway rides.", available: false },
  { id: 6, name: "Ola S1 Pro", category: "electric", price_hour: 55, price_day: 400, img: "https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=400", desc: "Feature-packed electric scooter with 181km range.", available: true },
  { id: 7, name: "Honda CBR 650R", category: "sports", price_hour: 150, price_day: 1200, img: "https://images.unsplash.com/photo-1525160354320-d8e92641c563?w=400", desc: "Mid-range supersport with inline-4 engine.", available: true },
  { id: 8, name: "Jawa 42", category: "cruiser", price_hour: 85, price_day: 650, img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400", desc: "Neo-retro cruiser with modern mechanicals.", available: true },
];

// ===== AUTH HELPERS =====
const getUsers = () => JSON.parse(localStorage.getItem('rr_users') || '[]');
const saveUsers = (u) => localStorage.setItem('rr_users', JSON.stringify(u));
const getSession = () => JSON.parse(localStorage.getItem('rr_session') || 'null');
const setSession = (u) => localStorage.setItem('rr_session', JSON.stringify(u));
const clearSession = () => localStorage.removeItem('rr_session');

function updateNavAuth() {
  const session = getSession();
  const loginLinks = document.querySelectorAll('.link-login');
  const registerLinks = document.querySelectorAll('.link-register');
  const logoutLinks = document.querySelectorAll('.link-logout');
  const userGreet = document.querySelectorAll('.user-greet');

  if (session) {
    loginLinks.forEach(el => el.style.display = 'none');
    registerLinks.forEach(el => el.style.display = 'none');
    logoutLinks.forEach(el => el.style.display = 'inline-block');
    userGreet.forEach(el => { el.textContent = `Hi, ${session.name.split(' ')[0]}`; el.style.display = 'inline-block'; });
  } else {
    loginLinks.forEach(el => el.style.display = 'inline-block');
    registerLinks.forEach(el => el.style.display = 'inline-block');
    logoutLinks.forEach(el => el.style.display = 'none');
    userGreet.forEach(el => el.style.display = 'none');
  }
}

function logout() {
  clearSession();
  window.location.href = 'index.html';
}

// ===== VALIDATION =====
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const isValidPhone = (p) => /^[6-9]\d{9}$/.test(p);
const isValidPassword = (p) => p.length >= 6;

function showError(inputId, msgId, msg) {
  const input = document.getElementById(inputId);
  const msgEl = document.getElementById(msgId);
  if (input) input.classList.add('error');
  if (msgEl) { msgEl.textContent = msg; msgEl.classList.add('show'); }
}

function clearError(inputId, msgId) {
  const input = document.getElementById(inputId);
  const msgEl = document.getElementById(msgId);
  if (input) input.classList.remove('error');
  if (msgEl) msgEl.classList.remove('show');
}

function showAlert(id, msg, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type} show`;
  setTimeout(() => el.classList.remove('show'), 4000);
}

// ===== REGISTER =====
function handleRegister(e) {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;

  ['reg-name','reg-email','reg-phone','reg-password','reg-confirm'].forEach((id) => clearError(id, id + '-err'));

  if (!name) { showError('reg-name', 'reg-name-err', 'Name is required'); valid = false; }
  if (!isValidEmail(email)) { showError('reg-email', 'reg-email-err', 'Enter a valid email'); valid = false; }
  if (!isValidPhone(phone)) { showError('reg-phone', 'reg-phone-err', 'Enter a valid 10-digit phone number'); valid = false; }
  if (!isValidPassword(password)) { showError('reg-password', 'reg-password-err', 'Password must be at least 6 characters'); valid = false; }
  if (password !== confirm) { showError('reg-confirm', 'reg-confirm-err', 'Passwords do not match'); valid = false; }

  if (!valid) return;

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    showAlert('reg-alert', 'Email already registered. Please login.');
    return;
  }

  users.push({ name, email, phone, password });
  saveUsers(users);
  showAlert('reg-alert', 'Registration successful! Redirecting...', 'success');
  setTimeout(() => window.location.href = 'login.html', 1500);
}

// ===== LOGIN =====
function handleLogin(e) {
  e.preventDefault();
  let valid = true;

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  ['login-email','login-password'].forEach(id => clearError(id, id + '-err'));

  if (!isValidEmail(email)) { showError('login-email', 'login-email-err', 'Enter a valid email'); valid = false; }
  if (!password) { showError('login-password', 'login-password-err', 'Password is required'); valid = false; }

  if (!valid) return;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    showAlert('login-alert', 'Invalid email or password.');
    return;
  }

  setSession(user);
  showAlert('login-alert', `Welcome back, ${user.name}!`, 'success');
  setTimeout(() => window.location.href = 'index.html', 1200);
}

// ===== BIKES PAGE =====
function renderBikes(filter = 'all') {
  const grid = document.getElementById('bikes-grid');
  if (!grid) return;

  const filtered = filter === 'all' ? BIKES : BIKES.filter(b => b.category === filter);

  grid.innerHTML = filtered.map(bike => `
    <div class="bike-card" data-category="${bike.category}">
      <img src="${bike.img}" alt="${bike.name}" loading="lazy">
      <div class="bike-card-body">
        <div class="bike-category">${bike.category}</div>
        <h3>${bike.name}</h3>
        <p>${bike.desc}</p>
        <div class="bike-price">
          <div class="price-tag">₹${bike.price_hour}<span>/hr</span></div>
          <span class="badge ${bike.available ? 'badge-available' : 'badge-rented'}">${bike.available ? 'Available' : 'Rented'}</span>
        </div>
        <button class="btn-rent" onclick="rentBike(${bike.id})" ${!bike.available ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
          ${bike.available ? '🏍️ Rent Now' : 'Not Available'}
        </button>
      </div>
    </div>
  `).join('');
}

function rentBike(id) {
  if (!getSession()) {
    alert('Please login to rent a bike.');
    window.location.href = 'login.html';
    return;
  }
  localStorage.setItem('rr_selected_bike', id);
  window.location.href = 'booking.html';
}

function initFilterBtns() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderBikes(btn.dataset.filter);
    });
  });
}

// ===== BOOKING PAGE =====
let selectedDuration = 'hour';
let selectedQty = 1;
let selectedPayment = 'card';

function initBooking() {
  const bikeId = parseInt(localStorage.getItem('rr_selected_bike'));
  const bike = BIKES.find(b => b.id === bikeId);
  if (!bike) { window.location.href = 'bikes.html'; return; }

  document.getElementById('b-bike-img').src = bike.img;
  document.getElementById('b-bike-name').textContent = bike.name;
  document.getElementById('b-bike-cat').textContent = bike.category + ' • ' + (bike.available ? 'Available' : 'Rented');

  updatePrice(bike);

  document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDuration = btn.dataset.type;
      updatePrice(bike);
    });
  });

  document.getElementById('qty-input').addEventListener('input', (e) => {
    selectedQty = Math.max(1, parseInt(e.target.value) || 1);
    e.target.value = selectedQty;
    updatePrice(bike);
  });

  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
      selectedPayment = opt.querySelector('input').value;
      const cardForm = document.getElementById('card-form');
      if (cardForm) cardForm.classList.toggle('show', selectedPayment === 'card');
    });
  });
}

function updatePrice(bike) {
  const rate = selectedDuration === 'hour' ? bike.price_hour : bike.price_day;
  const subtotal = rate * selectedQty;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const label = selectedDuration === 'hour' ? 'hr' : 'day';
  document.getElementById('price-rate').textContent = `₹${rate}/${label} × ${selectedQty} ${label}${selectedQty > 1 ? 's' : ''}`;
  document.getElementById('price-subtotal').textContent = `₹${subtotal}`;
  document.getElementById('price-tax').textContent = `₹${tax}`;
  document.getElementById('price-total').textContent = `₹${total}`;
}

function confirmBooking() {
  if (selectedPayment === 'card') {
    const cardNum = document.getElementById('card-number')?.value.replace(/\s/g,'');
    const expiry = document.getElementById('card-expiry')?.value;
    const cvv = document.getElementById('card-cvv')?.value;
    const name = document.getElementById('card-name')?.value;
    if (!cardNum || cardNum.length < 16 || !expiry || !cvv || cvv.length < 3 || !name) {
      alert('Please fill in all card details correctly.');
      return;
    }
  }

  if (selectedPayment === 'upi') {
    const upiId = document.getElementById('upi-id')?.value.trim();
    if (!upiId || !upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. name@upi).');
      return;
    }
  }

  const bookingId = 'RR' + Date.now().toString().slice(-6);
  const session = getSession();
  const bikeId = parseInt(localStorage.getItem('rr_selected_bike'));
  const bike = BIKES.find(b => b.id === bikeId);
  const duration = `${selectedQty} ${selectedDuration}${selectedQty > 1 ? 's' : ''}`;
  const total = document.getElementById('price-total').textContent;

  const bookingData = {
    id: bookingId,
    user: session?.email,
    userName: session?.name,
    userPhone: session?.phone,
    bike: bike?.name,
    bikeImg: bike?.img,
    category: bike?.category,
    duration,
    payment: selectedPayment,
    total,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  };

  const bookings = JSON.parse(localStorage.getItem('rr_bookings') || '[]');
  bookings.push(bookingData);
  localStorage.setItem('rr_bookings', JSON.stringify(bookings));
  localStorage.setItem('rr_last_booking', JSON.stringify(bookingData));

  window.location.href = 'confirmation.html';
}

// ===== HAMBURGER =====
function initHamburger() {
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('nav-links');
  if (ham && nav) {
    ham.addEventListener('click', () => nav.classList.toggle('open'));
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
  initHamburger();

  const page = document.body.dataset.page;
  if (page === 'bikes') { renderBikes(); initFilterBtns(); }
  if (page === 'booking') initBooking();
  if (page === 'register') {
    document.getElementById('register-form')?.addEventListener('submit', handleRegister);
  }
  if (page === 'login') {
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  }
});
