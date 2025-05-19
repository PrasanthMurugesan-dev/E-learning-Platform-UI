// Course data
const courses = [
  {
    id: 1,
    title: "HTML Basics",
    description: "Learn the structure of web pages and HTML5 fundamentals.",
    video: "https://www.youtube.com/embed/UB1O30fR-EE",
    category: "Web Development",
    duration: "4 hours"
  },
  {
    id: 2,
    title: "CSS Mastery",
    description: "Style your websites with CSS, learn Flexbox and Grid layouts.",
    video: "https://www.youtube.com/embed/yfoY53QXEnI",
    category: "Web Development",
    duration: "6 hours"
  },
  {
    id: 3,
    title: "JavaScript Fundamentals",
    description: "Master JavaScript basics including variables, functions, and DOM manipulation.",
    video: "https://www.youtube.com/embed/W6NZfCO5SIk",
    category: "Web Development",
    duration: "8 hours"
  },
  {
    id: 4,
    title: "React.js For Beginners",
    description: "Learn the most popular JavaScript library for building user interfaces.",
    video: "https://www.youtube.com/embed/QFaFIcGhPoM",
    category: "Web Development",
    duration: "10 hours"
  },
  {
    id: 5,
    title: "Python Programming",
    description: "Start your journey with Python, from basics to advanced concepts.",
    video: "https://www.youtube.com/embed/rfscVS0vtbw",
    category: "Programming",
    duration: "12 hours"
  },
  {
    id: 6,
    title: "Data Science Essentials",
    description: "Introduction to data analysis, visualization, and machine learning basics.",
    video: "https://www.youtube.com/embed/ua-CiDNNj30",
    category: "Data Science",
    duration: "15 hours"
  },
  {
    id: 7,
    title: "Digital Marketing Fundamentals",
    description: "Learn SEO, social media marketing, and content strategy.",
    video: "https://www.youtube.com/embed/nU-IIXBWlS4",
    category: "Marketing",
    duration: "8 hours"
  },
  {
    id: 8,
    title: "UI/UX Design Principles",
    description: "Create intuitive and beautiful user interfaces with modern design principles.",
    video: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
    category: "Design",
    duration: "9 hours"
  },
  {
    id: 9,
    title: "Node.js Backend Development",
    description: "Build scalable server-side applications with Node.js and Express.",
    video: "https://www.youtube.com/embed/Oe421EPjeBE",
    category: "Web Development",
    duration: "11 hours"
  },
  {
    id: 10,
    title: "Mobile App Development with Flutter",
    description: "Create cross-platform mobile apps with Google's Flutter framework.",
    video: "https://www.youtube.com/embed/pTJJsmejUOQ",
    category: "Mobile Development",
    duration: "14 hours"
  }
];

// DOM Elements
const courseListEl = document.getElementById("course-list");
const courseDetailEl = document.getElementById("course-detail");
const courseTitleEl = document.getElementById("course-title");
const courseVideoEl = document.getElementById("course-video");
const progressBarEl = document.getElementById("progress-bar");
const categoryFilterEl = document.getElementById("category-filter");
const searchInputEl = document.getElementById("search-input");

let currentCourseId = null;
let activeFilters = {
  category: "All",
  search: ""
};

// Initialize the application
function initApp() {
  populateCourseList();
  populateCategoryFilter();
  setupEventListeners();
  showPage("home");
  animateWelcome();
}

// Populate course listing with all courses
function populateCourseList() {
  courseListEl.innerHTML = "";
  
  const filteredCourses = filterCourses();
  
  if (filteredCourses.length === 0) {
    courseListEl.innerHTML = `<p class="no-results">No courses found matching your criteria.</p>`;
    return;
  }
  
  filteredCourses.forEach((course, index) => {
    const card = document.createElement("div");
    card.className = "course-card";
    
    // Get saved progress for this course
    const progress = localStorage.getItem(`progress_${course.id}`) || 0;
    
    card.innerHTML = `
      <div class="course-card-header">
        <span class="course-category">${course.category}</span>
        <span class="course-duration"><i class="fas fa-clock"></i> ${course.duration}</span>
      </div>
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <div class="course-card-footer">
        <div class="mini-progress">
          <div class="mini-progress-bar" style="width: ${progress}%"></div>
        </div>
        <button class="view-course-btn" data-id="${course.id}">
          <span>View Course</span>
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    `;
    
    // Add animation delay based on index
    card.style.animationDelay = `${index * 0.1}s`;
    
    courseListEl.appendChild(card);
  });
  
  // Add click event for all course buttons
  document.querySelectorAll('.view-course-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.getAttribute('data-id'));
      viewCourse(id);
    });
  });
}

// Filter courses based on current filters
function filterCourses() {
  return courses.filter(course => {
    // Category filter
    const categoryMatch = activeFilters.category === "All" || 
                          course.category === activeFilters.category;
    
    // Search filter (match title or description)
    const searchTerm = activeFilters.search.toLowerCase();
    const searchMatch = searchTerm === "" || 
                       course.title.toLowerCase().includes(searchTerm) || 
                       course.description.toLowerCase().includes(searchTerm);
    
    return categoryMatch && searchMatch;
  });
}

// Populate category filter dropdown
function populateCategoryFilter() {
  // Get unique categories
  const categories = ["All", ...new Set(courses.map(course => course.category))];
  
  // Create options
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilterEl.appendChild(option);
  });
}

// Setup event listeners
function setupEventListeners() {
  // Category filter change
  categoryFilterEl.addEventListener('change', (e) => {
    activeFilters.category = e.target.value;
    populateCourseList();
  });
  
  // Search input
  searchInputEl.addEventListener('input', (e) => {
    activeFilters.search = e.target.value;
    populateCourseList();
    
    // Debounce search results fade-in
    clearTimeout(searchInputEl.debounceTimer);
    searchInputEl.debounceTimer = setTimeout(() => {
      document.querySelectorAll('.course-card').forEach(card => {
        card.classList.add('search-result');
      });
    }, 300);
  });
  
  // Rating stars handling
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
      handleRating(e);
    }
  });
  
  // Progress tracking - update as video plays
  document.getElementById('simulate-progress').addEventListener('click', () => {
    simulateProgress();
  });
  
  // Notes toggle
  document.getElementById('toggle-notes').addEventListener('click', () => {
    document.getElementById('notes-section').classList.toggle('open');
  });
  
  // Save notes
  document.getElementById('save-notes').addEventListener('click', () => {
    saveNotes();
  });
}

// Show selected page with animation
function showPage(page) {
  // Hide all pages first
  document.querySelectorAll('section').forEach(section => {
    section.classList.add("hidden");
  });
  
  // Show selected page with animation
  const selectedPage = document.getElementById(page);
  selectedPage.classList.remove("hidden");
  selectedPage.classList.add("fade-in");
  
  // Update active nav link
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
  });
  
  // Find and highlight the active link
  document.querySelector(`nav a[data-page="${page}"]`)?.classList.add('active');
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// View course details
function viewCourse(id) {
  const course = courses.find(c => c.id === id);
  
  if (course) {
    currentCourseId = id;
    
    // Update course details
    courseTitleEl.textContent = course.title;
    document.getElementById('course-category').textContent = course.category;
    document.getElementById('course-duration').textContent = course.duration;
    courseVideoEl.src = course.video;
    
    // Get saved progress
    const storedProgress = localStorage.getItem(`progress_${id}`) || 0;
    progressBarEl.value = storedProgress;
    document.getElementById('progress-percent').textContent = `${storedProgress}%`;
    
    // Get saved notes
    const savedNotes = localStorage.getItem(`notes_${id}`) || '';
    document.getElementById('course-notes').value = savedNotes;
    
    // Get saved rating
    const savedRating = localStorage.getItem(`rating_${id}`) || 0;
    updateStarRating(savedRating);
    
    // Show the course detail page with animation
    showPage("course-detail");
    
    // Animate course details
    animateCourseDetails();
  }
}

// Mark course as completed
function markAsCompleted() {
  if (currentCourseId !== null) {
    localStorage.setItem(`progress_${currentCourseId}`, 100);
    progressBarEl.value = 100;
    document.getElementById('progress-percent').textContent = '100%';
    
    // Animate completion
    const confetti = document.getElementById('completion-confetti');
    confetti.classList.add('active');
    
    setTimeout(() => {
      confetti.classList.remove('active');
    }, 3000);
    
    document.getElementById('completion-message').classList.add('show');
    setTimeout(() => {
      document.getElementById('completion-message').classList.remove('show');
    }, 5000);
  }
}

// Handle star rating
function handleRating(e) {
  if (currentCourseId === null) return;
  
  const stars = document.querySelectorAll('.star');
  const clickedIndex = Array.from(stars).indexOf(e.target);
  const rating = clickedIndex + 1;
  
  // Save rating
  localStorage.setItem(`rating_${currentCourseId}`, rating);
  
  // Update display
  updateStarRating(rating);
  
  // Show thank you message
  const thankYou = document.getElementById('rating-thanks');
  thankYou.classList.add('show');
  setTimeout(() => {
    thankYou.classList.remove('show');
  }, 2000);
}

// Update star rating display
function updateStarRating(rating) {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

// Save course notes
function saveNotes() {
  if (currentCourseId === null) return;
  
  const notes = document.getElementById('course-notes').value;
  localStorage.setItem(`notes_${currentCourseId}`, notes);
  
  // Show save confirmation
  const saveConfirm = document.getElementById('notes-saved');
  saveConfirm.classList.add('show');
  setTimeout(() => {
    saveConfirm.classList.remove('show');
  }, 2000);
}

// Simulate progress while watching video
function simulateProgress() {
  if (currentCourseId === null) return;
  
  const currentProgress = parseInt(progressBarEl.value);
  const newProgress = Math.min(currentProgress + 20, 100);
  
  // Animate progress bar
  animateProgressTo(newProgress);
  
  // Save new progress
  localStorage.setItem(`progress_${currentCourseId}`, newProgress);
}

// Animate progress bar to target value
function animateProgressTo(target) {
  const current = parseInt(progressBarEl.value);
  const step = target > current ? 1 : -1;
  
  const interval = setInterval(() => {
    const currentValue = parseInt(progressBarEl.value);
    
    if (currentValue === target) {
      clearInterval(interval);
      return;
    }
    
    const newValue = currentValue + step;
    progressBarEl.value = newValue;
    document.getElementById('progress-percent').textContent = `${newValue}%`;
    
  }, 20);
}

// Animate welcome section
function animateWelcome() {
  const hero = document.querySelector('.hero-text');
  hero.classList.add('slide-in');
  
  const cards = document.querySelectorAll('.feature-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('fade-in');
    }, 500 + (index * 200));
  });
}

// Animate course details
function animateCourseDetails() {
  const elements = document.querySelectorAll('.animate-in');
  
  elements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.1}s`;
    element.classList.add('active');
  });
}

// Login/Registration functionality
function setupAuthForms() {
  // Show registration form
  document.getElementById('show-register').addEventListener('click', function(e) {
    e.preventDefault();
    const loginCard = document.querySelector('.auth-card:not(.hidden)');
    const registerCard = document.getElementById('register-card');
    
    loginCard.classList.add('flip-out');
    
    setTimeout(() => {
      loginCard.classList.add('hidden');
      registerCard.classList.remove('hidden');
      registerCard.classList.add('flip-in');
    }, 300);
  });
  
  // Show login form
  document.getElementById('show-login').addEventListener('click', function(e) {
    e.preventDefault();
    const registerCard = document.getElementById('register-card');
    const loginCard = document.querySelector('.auth-card:not(#register-card)');
    
    registerCard.classList.add('flip-out');
    
    setTimeout(() => {
      registerCard.classList.add('hidden');
      loginCard.classList.remove('hidden');
      loginCard.classList.add('flip-in');
    }, 300);
  });
  
  // Login form submission
  document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (email && password) {
      // In a real app, you would send this to a server
      console.log('Login attempt:', { email });
      
      // Simulate successful login
      const loginSuccess = document.createElement('div');
      loginSuccess.className = 'login-success';
      loginSuccess.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>Login successful! Redirecting...</p>
      `;
      
      document.querySelector('.auth-card').appendChild(loginSuccess);
      
      // Redirect to courses after delay
      setTimeout(() => {
        showPage('courses');
      }, 2000);
    }
  });
  
  // Registration form submission
  document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    
    // Simple validation
    if (name && email && password && password === confirm) {
      // In a real app, you would send this to a server
      console.log('Registration attempt:', { name, email });
      
      // Simulate successful registration
      const registerSuccess = document.createElement('div');
      registerSuccess.className = 'login-success';
      registerSuccess.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>Account created successfully! Please log in.</p>
      `;
      
      document.getElementById('register-card').appendChild(registerSuccess);
      
      // Show login form after delay
      setTimeout(() => {
        document.getElementById('show-login').click();
      }, 2000);
    } else if (password !== confirm) {
      alert('Passwords do not match!');
    }
  });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initApp();
  setupAuthForms();
});