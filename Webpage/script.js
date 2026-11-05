// Data สำหรับแบนเนอร์เกม


const games = {
    CounterStrike: { title: 'Counter-Strike 2', desc: 'Improved performance, weapon balancing, and long-awaited bug fixes — dive into smoother action now!', img: 'img/banner1.png', video: 'video/video1.mp4' },
    PUBG: { title: 'PUBG: BATTLEGROUNDS', desc: 'Maps revamped, new equipment deployed, and bugs squashed.', img: 'img/banner2.png', video: 'video/video2.mp4' },
    MARVEL: { title: 'Marvel Rivals', desc: 'Balanced heroes, fresh new skins, and smoother gameplay.', img: 'img/banner3.png', video: 'video/video3.mp4' },
    DOTA: { title: 'Dota 2', desc: 'Hero balancing, bug fixes, and full-on game polish.', img: 'img/banner4.png', video: 'video/video4.mp4' },
    Umamusume: { title: 'Umamusume: Pretty Derby', desc: 'New Uma, cute events, and collect special decorations.', img: 'img/banner5.png', video: 'video/video5.mp4' }
};

// เลือก Element ต่างๆ
const gameKeys = Object.keys(games);
const items = document.querySelectorAll('.game-item');
const bannerContainer = document.getElementById('bannerContainer');
const bannerDots = document.getElementById('bannerDots');

// ตัวแปรสำหรับควบคุมการทำงาน
let currentIndex = 0, intervalId = null, videoTimeout = null, startX = 0, isDragging = false;

(function() {
            // Get references to the HTML elements
            const wrapper = document.querySelector('.slides-wrapper');
            const cards = document.querySelectorAll('.stats-card');
            const dotsContainer = document.querySelector('.page-dots');
            
            let currentStatsIndex = 0;

            /**
             * @param {number} index - The index of the slide to show.
             */
            function showSlide(index) {
                // Update the current index
                currentStatsIndex = index;
                
                // Calculate the new transform value to move the wrapper
                const transformValue = -currentStatsIndex * 100;
                
                // Apply the new transform to the wrapper
                wrapper.style.transform = `translateX(${transformValue}%)`;
                
                // Update the active state of the dots
                updateDots();
            }

            /**
             * Updates the active class on the page dots.
             */
            function updateDots() {
                // Remove the 'active' class from all dots
                const allDots = dotsContainer.querySelectorAll('.page-dot');
                allDots.forEach(dot => dot.classList.remove('active'));
                
                // Add the 'active' class to the current dot
                allDots[currentStatsIndex].classList.add('active');
            }

            /**
             * Dynamically creates the page dots based on the number of slides.
             */
            function createDots() {
                for (let i = 0; i < cards.length; i++) {
                    const dot = document.createElement('span');
                    dot.classList.add('page-dot');
                    // Use a closure to capture the correct index for the event listener
                    dot.addEventListener('click', () => showSlide(i));
                    dotsContainer.appendChild(dot);
                }
                // Initialize the dots after they are created
                showSlide(0);
            }
            
            // Call the function to create and initialize the dots when the page loads
            document.addEventListener('DOMContentLoaded', createDots);
        })();

// ฟังก์ชันเปลี่ยนเนื้อหาของแบนเนอร์
function changeGame(key) {
    const img = document.getElementById('bannerImage');
    const video = document.getElementById('bannerVideo');
    const videoSource = document.getElementById('videoSource');
    const title = document.getElementById('bannerTitle');
    const desc = document.getElementById('bannerDesc');

    // หยุดวิดีโอและแสดงภาพ
    clearTimeout(videoTimeout);
    video.style.display = 'none';
    img.style.display = 'block';

    // ใส่ Effect fade-in
    bannerContainer.classList.remove('slide-fade-enter', 'slide-fade-enter-active');
    void bannerContainer.offsetWidth;
    bannerContainer.classList.add('slide-fade-enter');

    // อัปเดตข้อมูล
    requestAnimationFrame(() => {
        img.src = games[key].img;
        title.textContent = games[key].title;
        desc.textContent = games[key].desc;
        videoSource.src = games[key].video;
        video.load();
        bannerContainer.classList.add('slide-fade-enter-active');
    });

    // เมื่อจบ Effect ให้ลบคลาส
    bannerContainer.addEventListener('transitionend', () => {
        bannerContainer.classList.remove('slide-fade-enter', 'slide-fade-enter-active');
    }, { once: true });

    // ตั้งเวลาเล่นวิดีโอหลังจาก 1.5 วินาที
    videoTimeout = setTimeout(() => {
        img.style.display = 'none';
        video.style.display = 'block';
        video.play();
    }, 1500);
}

// อัปเดต Progress Bar สำหรับ Desktop
function updateProgressBar() {
    items.forEach(item => item.classList.remove('active'));
    if (items[currentIndex]) items[currentIndex].classList.add('active');
}

// อัปเดตจุดนำทางสำหรับ Mobile
function updateDots() {
    bannerDots.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    const dots = bannerDots.querySelectorAll('.dot');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
}

// เลื่อนเกมถัดไปอัตโนมัติ
function nextGameAuto() {
    currentIndex = (currentIndex + 1) % gameKeys.length;
    changeGame(gameKeys[currentIndex]);
    window.innerWidth > 768 ? updateProgressBar() : updateDots();
}

// เริ่ม Interval สำหรับการเปลี่ยนเกมอัตโนมัติ
function startInterval() {
    clearInterval(intervalId); // เคลียร์ Interval เก่า
    window.innerWidth > 768 ? updateProgressBar() : updateDots();
    intervalId = setInterval(nextGameAuto, 5000);
}

// รีเซ็ต Interval
function resetInterval() { clearInterval(intervalId); startInterval(); }

// เปลี่ยนเกมด้วยการคลิก
function manualChangeGame(key) { 
    currentIndex = gameKeys.indexOf(key); 
    resetInterval(); 
    changeGame(key); 
    updateProgressBar(); 
}

// เพิ่ม Event Listener สำหรับการคลิกที่เกมแต่ละรายการ
items.forEach(item => {
    item.addEventListener('click', () => manualChangeGame(item.dataset.gameKey));
});

// สร้างจุดนำทางสำหรับโหมดมือถือ
function createDots() {
    bannerDots.innerHTML = '';
    gameKeys.forEach((key, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => { 
            currentIndex = index; 
            resetInterval(); 
            changeGame(key); 
            updateDots(); 
        });
        bannerDots.appendChild(dot);
    });
    updateDots();
}

// --- การจัดการการลาก (Drag) ของแบนเนอร์หลัก ---
function handleDragStart(e) { 
    clearInterval(intervalId); 
    isDragging = true; 
    startX = e.clientX || e.touches[0].clientX; 
}

function handleDragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    const deltaX = (e.clientX || e.changedTouches[0].clientX) - startX;
    // ตรวจสอบทิศทางการลาก
    if (deltaX > 50) currentIndex = (currentIndex - 1 + gameKeys.length) % gameKeys.length;
    else if (deltaX < -50) currentIndex = (currentIndex + 1) % gameKeys.length;
    changeGame(gameKeys[currentIndex]);
    updateDots();
    startInterval();
}
function handleDragCancel() { 
    if (!isDragging) return; 
    isDragging = false; 
    startInterval(); 
}

// --- ตัวจัดการโหมดของแบนเนอร์ (Desktop/Mobile) ---
let isMobileMode = window.innerWidth <= 768;
function handleBannerMode() {
    const newIsMobileMode = window.innerWidth <= 768;
    // ถ้าโหมดเปลี่ยน
    if (newIsMobileMode !== isMobileMode) {
        isMobileMode = newIsMobileMode;
        // ลบ Event Listener เก่าออก
        bannerContainer.removeEventListener('mousedown', handleDragStart);
        bannerContainer.removeEventListener('mouseup', handleDragEnd);
        bannerContainer.removeEventListener('mouseleave', handleDragCancel);
        bannerContainer.removeEventListener('touchstart', handleDragStart);
        bannerContainer.removeEventListener('touchend', handleDragEnd);
        bannerContainer.removeEventListener('touchcancel', handleDragCancel);

        // เพิ่ม Event Listener ใหม่ตามโหมดที่ถูกต้อง
        if (isMobileMode) {
            createDots();
            bannerContainer.addEventListener('mousedown', handleDragStart);
            bannerContainer.addEventListener('mouseup', handleDragEnd);
            bannerContainer.addEventListener('mouseleave', handleDragCancel);
            bannerContainer.addEventListener('touchstart', handleDragStart);
            bannerContainer.addEventListener('touchend', handleDragEnd);
            bannerContainer.addEventListener('touchcancel', handleDragCancel);
        }
    }
    // อัปเดต UI ตามโหมดปัจจุบัน
    window.innerWidth > 768 ? updateProgressBar() : updateDots();
}

// --- โค้ดสำหรับแบนเนอร์มือถือ (แยกจากแบนเนอร์หลัก) ---
const mobileGames = Object.keys(games);
let mobileIndex = 0, mobileStartX = 0, mobileDragging = false;
const mobileContainer = document.getElementById('mobileBannerContainer');
const mobileImage = document.getElementById('mobileBannerImage');
const mobileTitle = document.getElementById('mobileBannerTitle');
const mobileDesc = document.getElementById('mobileBannerDesc');
const mobileDots = document.getElementById('mobileBannerDots');

// สร้างจุดนำทาง
mobileGames.forEach((key, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.addEventListener('click', () => { showMobileGame(index); });
    mobileDots.appendChild(dot);
});

// อัปเดตจุดที่กำลังใช้งาน
function updateMobileDots() {
    mobileDots.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    mobileDots.querySelectorAll('.dot')[mobileIndex].classList.add('active');
}

// เปลี่ยนเนื้อหาของแบนเนอร์มือถือ
function showMobileGame(index) {
    mobileIndex = index;
    const game = games[mobileGames[mobileIndex]];
    mobileImage.src = game.img;
    mobileTitle.textContent = game.title;
    mobileDesc.textContent = game.desc;
    updateMobileDots();
}

showMobileGame(0);

// --- การจัดการการลากสำหรับแบนเนอร์มือถือ ---
function handleMobileStart(e) {
    mobileDragging = true;
    mobileStartX = e.touches ? e.touches[0].clientX : e.clientX;
}

function handleMobileEnd(e) {
    if (!mobileDragging) return;
    mobileDragging = false;
    const deltaX = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) - mobileStartX;
    if (deltaX > 50) mobileIndex = (mobileIndex - 1 + mobileGames.length) % mobileGames.length;
    else if (deltaX < -50) mobileIndex = (mobileIndex + 1) % mobileGames.length;
    showMobileGame(mobileIndex);
}

// เพิ่ม Event Listener การลาก
mobileContainer.addEventListener('mousedown', handleMobileStart);
mobileContainer.addEventListener('mouseup', handleMobileEnd);
mobileContainer.addEventListener('mouseleave', handleMobileEnd);
mobileContainer.addEventListener('touchstart', handleMobileStart);
mobileContainer.addEventListener('touchend', handleMobileEnd);
mobileContainer.addEventListener('touchcancel', handleMobileEnd);

// --- การจัดการ Carousel (ส่วนแสดงรายการเกม) ---
document.addEventListener('DOMContentLoaded', () => {
    let lastScreenWidth = window.innerWidth;

    // ตั้งค่าแบนเนอร์หลักตอนโหลดหน้า
    changeGame(gameKeys[currentIndex]);
    startInterval();
    handleBannerMode(); 

    // ฟังก์ชันสำหรับ Carousel บน Desktop (ใช้ปุ่มกด)
    function handleCarousel(num, selector) {
        const nextBtn = document.querySelector('.next-btn' + num);
        const prevBtn = document.querySelector('.prev-btn' + num);
        const carouselTrack = document.querySelector('#carousel-track' + num);
        if (!nextBtn || !prevBtn || !carouselTrack) return; 

        // ลบ Listener เก่าเพื่อป้องกันการทำงานซ้ำ
        const oldNextHandler = nextBtn.onclick;
        const oldPrevHandler = prevBtn.onclick;
        if (oldNextHandler) nextBtn.removeEventListener('click', oldNextHandler);
        if (oldPrevHandler) prevBtn.removeEventListener('click', oldPrevHandler);
        
        const cardWidth = document.querySelector('.game-card').offsetWidth + 16;
        const totalitem = document.querySelectorAll(selector).length;
        let currentIndex = 0;
        const cardsPerView = 6;

        function updateCarousel() {
            carouselTrack.style.transform = `translateX(${-currentIndex * cardWidth * cardsPerView}px)`;
        }
        
        const nextHandler = () => {
            if (currentIndex < totalitem / cardsPerView - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        };

        const prevHandler = () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalitem / cardsPerView - 1;
            }
            updateCarousel();
        };

        nextBtn.addEventListener('click', nextHandler);
        prevBtn.addEventListener('click', prevHandler);
    }

    // ฟังก์ชันสำหรับ Carousel บน Mobile (ใช้การลาก)
    function handleDragCarousel(carousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        const startDrag = (e) => {
            isDown = true;
            carousel.classList.add('active');
            const clientX = e.touches ? e.touches[0].pageX : e.pageX;
            startX = clientX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        };

        const moveDrag = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].pageX : e.pageX;
            const x = clientX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        };
        
        const endDrag = () => {
            isDown = false;
            carousel.classList.remove('active');
        };
        
        // ลบ Event Listener เก่า
        carousel.removeEventListener('mousedown', startDrag);
        carousel.removeEventListener('touchstart', startDrag);
        carousel.removeEventListener('mousemove', moveDrag);
        carousel.removeEventListener('touchmove', moveDrag);
        carousel.removeEventListener('mouseup', endDrag);
        carousel.removeEventListener('mouseleave', endDrag);
        carousel.removeEventListener('touchend', endDrag);
        carousel.removeEventListener('touchcancel', endDrag);

        // เพิ่ม Event Listener ใหม่
        carousel.addEventListener('mousedown', startDrag);
        carousel.addEventListener('touchstart', startDrag);
        carousel.addEventListener('mousemove', moveDrag);
        carousel.addEventListener('touchmove', moveDrag);
        carousel.addEventListener('mouseup', endDrag);
        carousel.addEventListener('mouseleave', endDrag);
        carousel.addEventListener('touchend', endDrag);
        carousel.addEventListener('touchcancel', endDrag);
    }

    // ฟังก์ชันหลักที่เลือกใช้งาน Carousel ตามขนาดหน้าจอ
    function applyCarouselFunctionality() {
        const currentScreenWidth = window.innerWidth;
        const isSwitchingToMobile = lastScreenWidth > 768 && currentScreenWidth <= 768;

        // ถ้าเปลี่ยนจาก Desktop ไป Mobile ให้รีเซ็ตตำแหน่ง
        if (isSwitchingToMobile) {
            const carouselTracks = document.querySelectorAll('.carousel-track');
            carouselTracks.forEach(track => {
                track.style.transform = 'translateX(0px)';
                track.style.transition = 'none';
            });
            setTimeout(() => {
                carouselTracks.forEach(track => {
                    track.style.transition = 'transform 0.5s ease';
                });
            }, 10);
        }

        // ลบ Listener เก่าของ Carousel ทั้งหมด
        document.querySelectorAll('.carousel-controls').forEach(controls => {
            const nextBtn = controls.querySelector('.next-btn');
            const prevBtn = controls.querySelector('.prev-btn');
            if (nextBtn) nextBtn.removeEventListener('click', nextBtn.onclick);
            if (prevBtn) prevBtn.removeEventListener('click', prevBtn.onclick);
        });
        document.querySelectorAll('.carousel-container').forEach(carousel => {
            carousel.removeEventListener('mousedown', handleDragCarousel);
            carousel.removeEventListener('touchstart', handleDragCarousel);
        });


        // ใช้งานฟังก์ชันที่เหมาะสมกับขนาดหน้าจอ
        if (currentScreenWidth > 768) {
            handleCarousel("1", '.new-item');
            handleCarousel("2", '.saving-item');
            handleCarousel("3", '.releases-item');
            handleCarousel("4", '.trending-item');
            handleCarousel("5", '.featured-item');
            handleCarousel("6", '.most-item');
            handleCarousel("7", '.up-item');
            handleCarousel("8", '.now-item');
        } else {
            document.querySelectorAll('.carousel-container').forEach(handleDragCarousel);
        }
        
        lastScreenWidth = currentScreenWidth;
    }
    
    // เรียกใช้ฟังก์ชันและเพิ่ม Event Listener เมื่อหน้าจอถูกปรับขนาด
    applyCarouselFunctionality();
    window.addEventListener('resize', applyCarouselFunctionality);
});

 // footer

document.addEventListener('DOMContentLoaded', () => {
      // Footer dropdown functionality for mobile and desktop
      const footerColumns = document.querySelectorAll('.footer-column h3');

      footerColumns.forEach(column => {
        column.addEventListener('click', () => {
          // Find the parent column element
          const parentColumn = column.closest('.footer-column');

          // Close other open menus
          document.querySelectorAll('.footer-column.active').forEach(item => {
            if (item !== parentColumn) {
              item.classList.remove('active');
            }
          });

          // Toggle the 'active' class on the parent element
          parentColumn.classList.toggle('active');
        });
      });

      // Back-to-top button functionality
      const backToTopBtn = document.querySelector('.back-to-top');

      if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      }
    });


// โค้ดใหม่สำหรับ slideshow-section และ content (ฉบับแก้ไขสมบูรณ์)
document.addEventListener('DOMContentLoaded', () => {
    // 1. แก้ไข: ให้มองหาทั้ง .slideshow-section และ .content ที่เราปรับโครงสร้างแล้ว
    const slideshowSections = document.querySelectorAll('.slideshow-section, .content');

    slideshowSections.forEach(section => {
        const slideshowContainer = section.querySelector('.slideshow-container');
        const slidesWrapper = slideshowContainer ? slideshowContainer.querySelector('.slides-wrapper') : null;
        const slideshowDotsContainer = section.querySelector('.slideshow-dots');
        
        const slides = slidesWrapper ? slidesWrapper.querySelectorAll('.stats-card, .game-suggest') : [];

        if (slidesWrapper && slideshowDotsContainer && slides.length > 0) {
            let currentIndex = 0;

            const createDots = () => {
                slideshowDotsContainer.innerHTML = '';
                for (let i = 0; i < slides.length; i++) {
                    const dot = document.createElement('span');
                    dot.classList.add('page-dot');
                    if (i === currentIndex) {
                        dot.classList.add('active');
                    }
                    dot.addEventListener('click', () => {
                        goToSlide(i);
                    });
                    slideshowDotsContainer.appendChild(dot);
                }
            };

            // การแก้ไขหลักอยู่ตรงนี้
            const goToSlide = (index) => {
                currentIndex = index;
                
                // ดึงความกว้างจริงของการ์ดใบแรก (เราตั้งสมมติฐานว่าทุกใบกว้างเท่ากัน)
                const slideWidth = slides[0].offsetWidth;
                
                // ดึงค่า 'gap' ที่กำหนดไว้ใน CSS
                const wrapperStyle = window.getComputedStyle(slidesWrapper);
                const gap = parseFloat(wrapperStyle.gap) || 0;
                
                // คำนวณระยะที่ต้องเลื่อนใหม่ = index * (ความกว้างของการ์ด + gap)
                const offset = -currentIndex * (slideWidth + gap);
                
                slidesWrapper.style.transform = `translateX(${offset}px)`;
                updateDots();
            };

            const updateDots = () => {
                const dots = slideshowDotsContainer.querySelectorAll('.page-dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            };

            createDots();

            window.addEventListener('resize', () => {
                setTimeout(() => {
                    goToSlide(currentIndex);
                }, 100);
            });
        }
    });
});

    

// ...existing code...

// Hamburger menu for mobile
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const closeMenuBtn = document.getElementById('closeMenuBtn');

  if (hamburgerBtn && mobileMenuOverlay && closeMenuBtn) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    closeMenuBtn.addEventListener('click', () => {
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
    // ปิดเมนูเมื่อคลิกนอก content
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});

