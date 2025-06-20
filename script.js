document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const winampPlayer = document.getElementById('winampPlayer');
    const playBtn = document.getElementById('playBtn');
    const musicPrevBtn = document.getElementById('prevBtn');
    const musicNextBtn = document.getElementById('nextBtn');
    const stopBtn = document.getElementById('stopBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const trackNameEl = document.getElementById('trackName');
    const trackTimeEl = document.getElementById('trackTime');
    const playlistEl = document.getElementById('playlist');
    const playlistToggle = document.getElementById('playlistToggle');
    const trackCards = document.querySelectorAll('.tv-item');
    const memoryForm = document.getElementById('memoryForm');

    // --- Movie Carousel Elements ---
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselPrevBtn = document.getElementById('carouselPrevBtn');
    const carouselNextBtn = document.getElementById('carouselNextBtn');

    // --- Moments Carousel Elements ---
    const momentsSlides = document.querySelectorAll('.moments-slide');
    const momentsIndicators = document.querySelectorAll('.moments-indicator');
    const momentsCarouselTrack = document.querySelector('.moments-carousel-track');
    const momentsPrevBtn = document.getElementById('momentsPrevBtn');
    const momentsNextBtn = document.getElementById('momentsNextBtn');

    // --- Audio Player State ---
    const audio = new Audio();
    const songs = [
        { title: "50 Cent - In Da Club", src: "audio/50 Cent - In Da Club.mp3" },
        { title: "Avril Lavigne - Rock N Roll", src: "audio/Avril Lavigne - Rock N Roll.mp3" },
        { title: "Blink-182 - All The Small Things", src: "audio/Blink-182 - All The Small Things.mp3" },
        { title: "Britney Spears - Toxic", src: "audio/Britney Spears - Toxic.mp3" },
        { title: "Christina Aguilera - Beautiful", src: "audio/Christina Aguilera - Beautiful.mp3" },
        { title: "Eminem - Lose Yourself", src: "audio/Eminem - Lose Yourself.mp3" },
        { title: "Evanescence - Bring Me To Life", src: "audio/Evanescence - Bring Me To Life.mp3" },
        { title: "Gorillaz - Feel Good Inc", src: "audio/Gorillaz - Feel Good Inc.mp3" },
        { title: "Green Day - American Idiot", src: "audio/Green Day - American Idiot.mp3" },
        { title: "Linkin Park - In The End", src: "audio/Linkin Park - In The End.mp3" },
        { title: "Nelly - Hot In Herre", src: "audio/Nelly - Hot In Herre.mp3" },
        { title: "Outkast - Hey Ya", src: "audio/Outkast - Hey Ya.mp3" },
        { title: "Rihanna - Pon De Replay", src: "audio/Rihanna - Pon De Replay.mp3" },
        { title: "Sum 41 - Still Waiting", src: "audio/Sum 41 - Still Waiting.mp3" },
        { title: "The Killers - Mr. Brightside", src: "audio/The Killers - Mr. Brightside.mp3" }
    ];
    let currentSongIndex = 13;
    let isPlaying = false;

    // --- Movie Carousel State ---
    let currentSlide = 0;
    let autoPlayInterval;

    // --- Moments Carousel State ---
    let currentMomentsSlide = 0;
    let momentsAutoPlayInterval;

    // --- Functions ---
    const loadTrack = (trackIndex) => {
        const track = songs[trackIndex];
        audio.src = track.src;
        trackNameEl.textContent = track.title;
        updatePlaylistUI();
        audio.load();
    };

    const playTrack = () => {
        isPlaying = true;
        audio.play().catch(e => {
            console.log('Auto-play prevented by browser policy');
        });
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    };

    const pauseTrack = () => {
        isPlaying = false;
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    };

    const prevTrack = () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadTrack(currentSongIndex);
        playTrack();
    };

    const nextTrack = () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadTrack(currentSongIndex);
        playTrack();
    };

    const stopTrack = () => {
        pauseTrack();
        audio.currentTime = 0;
    };

    const setVolume = () => {
        audio.volume = volumeSlider.value / 100;
    };

    const updateProgress = () => {
        const { duration, currentTime } = audio;
        const progressPercent = (currentTime / duration) * 100;
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
        const totalMinutes = Math.floor(duration / 60) || 0;
        const totalSeconds = Math.floor(duration % 60).toString().padStart(2, '0') || '00';

        trackTimeEl.textContent = `${minutes}:${seconds} / ${totalMinutes}:${totalSeconds}`;
    };

    const updatePlaylistUI = () => {
        const playlistItems = playlistEl.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, index) => {
            if (index === currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };
    
    const populatePlaylist = () => {
        playlistEl.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${song.title}`;
            li.classList.add('playlist-item');
            li.setAttribute('data-track', index);
            playlistEl.appendChild(li);
        });
    };

    const updateActivePlaylistItem = () => {
        const playlistItems = playlistEl.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, index) => {
            if (index === currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };

    // --- Movie Carousel Functions ---
    function createInfiniteCarousel() {
        if (slides.length === 0) return;
        
        // Clone first and last slides for infinite effect
        const firstSlide = slides[0].cloneNode(true);
        const lastSlide = slides[slides.length - 1].cloneNode(true);
        
        // Add cloned slides
        carouselTrack.appendChild(firstSlide);
        carouselTrack.insertBefore(lastSlide, slides[0]);
        
        // Update track width for extra slides
        carouselTrack.style.width = `${(slides.length + 2) * 100}%`;
        
        // Update slide widths
        const allSlides = carouselTrack.querySelectorAll('.carousel-slide');
        allSlides.forEach(slide => {
            slide.style.width = `${100 / (slides.length + 2)}%`;
        });
        
        // Start at first real slide (index 1 because of cloned last slide)
        currentSlide = 0;
        carouselTrack.style.transform = `translateX(-${100 / (slides.length + 2)}%)`;
    }

    function updateSlideClasses() {
        const allSlides = carouselTrack.querySelectorAll('.carousel-slide');
        
        // Remove all classes
        allSlides.forEach(slide => {
            slide.classList.remove('center', 'adjacent');
        });
        
        // Find center slide (accounting for cloned slides)
        const centerIndex = currentSlide + 1; // +1 because of cloned last slide at start
        
        if (allSlides[centerIndex]) {
            allSlides[centerIndex].classList.add('center');
        }
        
        // Add adjacent classes
        if (allSlides[centerIndex - 1]) {
            allSlides[centerIndex - 1].classList.add('adjacent');
        }
        if (allSlides[centerIndex + 1]) {
            allSlides[centerIndex + 1].classList.add('adjacent');
        }
    }

    function showSlide(index, instant = false) {
        const totalSlides = slides.length + 2; // including cloned slides
        const slideWidth = 100 / totalSlides;
        const translateX = -((index + 1) * slideWidth); // +1 because of cloned last slide at start
        
        // Apply transform to carousel track
        if (carouselTrack) {
            if (instant) {
                carouselTrack.style.transition = 'none';
                carouselTrack.style.transform = `translateX(${translateX}%)`;
                // Force reflow
                carouselTrack.offsetHeight;
                carouselTrack.style.transition = 'transform 0.5s ease-in-out';
            } else {
                carouselTrack.style.transform = `translateX(${translateX}%)`;
            }
        }
        
        // Remove active class from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Activate current indicator
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        currentSlide = index;
        updateSlideClasses();
    }

    function changeSlide(direction) {
        let newIndex = currentSlide + direction;
        
        // Handle infinite loop
        if (newIndex >= slides.length) {
            // Going forward past last slide
            showSlide(newIndex);
            setTimeout(() => {
                showSlide(0, true); // Jump to first slide instantly
            }, 500);
            newIndex = 0;
        } else if (newIndex < 0) {
            // Going backward past first slide
            showSlide(newIndex);
            setTimeout(() => {
                showSlide(slides.length - 1, true); // Jump to last slide instantly
            }, 500);
            newIndex = slides.length - 1;
        } else {
            showSlide(newIndex);
        }
        
        // Update currentSlide after timeout for infinite loop
        setTimeout(() => {
            currentSlide = newIndex;
        }, 500);
    }

    function goToSlide(index) {
        showSlide(index);
        resetAutoPlay();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            changeSlide(1);
        }, 4000); // Change slide every 4 seconds
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // --- Moments Carousel Functions ---
    function showMomentsSlide(index) {
        const slideWidth = 100 / momentsSlides.length; // 20% for 5 slides
        const translateX = -(index * slideWidth);
        
        // Apply transform to moments carousel track
        if (momentsCarouselTrack) {
            momentsCarouselTrack.style.transform = `translateX(${translateX}%)`;
        }
        
        // Remove active class from all moments indicators
        momentsIndicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Activate current moments indicator
        if (momentsIndicators[index]) {
            momentsIndicators[index].classList.add('active');
        }
        
        currentMomentsSlide = index;
    }

    function changeMomentsSlide(direction) {
        let newIndex = currentMomentsSlide + direction;
        
        // Loop back to first slide if we go past the last one
        if (newIndex >= momentsSlides.length) {
            newIndex = 0;
        }
        // Loop to last slide if we go before the first one
        if (newIndex < 0) {
            newIndex = momentsSlides.length - 1;
        }
        
        showMomentsSlide(newIndex);
    }

    function goToMomentsSlide(index) {
        showMomentsSlide(index);
        resetMomentsAutoPlay();
    }

    function startMomentsAutoPlay() {
        momentsAutoPlayInterval = setInterval(() => {
            changeMomentsSlide(1);
        }, 5000); // Change slide every 5 seconds
    }

    function stopMomentsAutoPlay() {
        if (momentsAutoPlayInterval) {
            clearInterval(momentsAutoPlayInterval);
        }
    }

    function resetMomentsAutoPlay() {
        stopMomentsAutoPlay();
        startMomentsAutoPlay();
    }

    // --- Event Listeners ---
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    });

    musicPrevBtn.addEventListener('click', prevTrack);
    musicNextBtn.addEventListener('click', nextTrack);
    stopBtn.addEventListener('click', stopTrack);
    volumeSlider.addEventListener('input', setVolume);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);

    playlistToggle.addEventListener('click', () => {
        playlistEl.style.display = playlistEl.style.display === 'block' ? 'none' : 'block';
    });
    
    playlistEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('playlist-item')) {
            const trackIndex = parseInt(e.target.getAttribute('data-track'));
            if (trackIndex !== currentSongIndex) {
                currentSongIndex = trackIndex;
                loadTrack(currentSongIndex);
                playTrack();
            }
        }
    });

    trackCards.forEach(card => {
        card.addEventListener('click', () => {
            const trackIndex = parseInt(card.getAttribute('data-track'));
            if (trackIndex !== currentSongIndex) {
                currentSongIndex = trackIndex;
                loadTrack(currentSongIndex);
                playTrack();
            }
        });
    });

    memoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const memoryText = document.getElementById('memoryDescription').value;
        const submitBtn = this.querySelector('.submit-btn');

        if (memoryText.trim() === '') {
            alert('Please share a memory first!');
            return;
        }

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Share Another Memory';
                submitBtn.disabled = false;
                document.getElementById('memoryDescription').value = '';
            }, 2000);
            
        }, 2000);
    });

    // --- Movie Carousel Event Listeners ---
    if (carouselPrevBtn) {
        carouselPrevBtn.addEventListener('click', () => changeSlide(-1));
    }
    
    if (carouselNextBtn) {
        carouselNextBtn.addEventListener('click', () => changeSlide(1));
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // --- Moments Carousel Event Listeners ---
    if (momentsPrevBtn) {
        momentsPrevBtn.addEventListener('click', () => changeMomentsSlide(-1));
    }
    
    if (momentsNextBtn) {
        momentsNextBtn.addEventListener('click', () => changeMomentsSlide(1));
    }
    
    momentsIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToMomentsSlide(index));
    });

    // --- Draggable Winamp ---
    let isDragging = false;
    let offsetX, offsetY;

    const winampHeader = winampPlayer.querySelector('.winamp-header');
    
    winampHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - winampPlayer.offsetLeft;
        offsetY = e.clientY - winampPlayer.offsetTop;
        winampPlayer.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            winampPlayer.style.left = `${e.clientX - offsetX}px`;
            winampPlayer.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        winampPlayer.style.cursor = 'default';
    });

    // --- Smooth Scroll ---
    window.scrollToSection = (sectionId) => {
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    };

    // --- Initial Load ---
    populatePlaylist();
    loadTrack(currentSongIndex);
    setVolume();
    playTrack(); // Autoplay on load

    // --- Initialize Movie Carousel ---
    if (slides.length > 0) {
        createInfiniteCarousel();
        updateSlideClasses();
        startAutoPlay();
        
        // Pause auto-play when user hovers over carousel
        const carousel = document.querySelector('.movie-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);
        }
    }

    // --- Initialize Moments Carousel ---
    if (momentsSlides.length > 0) {
        showMomentsSlide(0);
        startMomentsAutoPlay();
        
        // Pause auto-play when user hovers over moments carousel
        const momentsCarousel = document.querySelector('.moments-carousel');
        if (momentsCarousel) {
            momentsCarousel.addEventListener('mouseenter', stopMomentsAutoPlay);
            momentsCarousel.addEventListener('mouseleave', startMomentsAutoPlay);
        }
    }

    // --- Floating Background Images Interaction ---
    const floatingImages = document.querySelectorAll('.floating-img');
    
    // Add parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        floatingImages.forEach((img, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            
            img.style.transform += ` translate(${x}px, ${y}px)`;
        });
    });

    // Add hover effects to floating images
    floatingImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.opacity = '0.8';
            img.style.transform += ' scale(1.2)';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.opacity = '0.3';
            img.style.transform = img.style.transform.replace(' scale(1.2)', '');
        });
    });
}); 