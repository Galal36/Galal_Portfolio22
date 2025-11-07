/*!
=========================================================
* JohnDoe Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
});

// protfolio filters
$(window).on("load", function() {
    var t = $(".portfolio-container");
    t.isotope({
        filter: ".new",
        animationOptions: {
            duration: 750,
            easing: "linear",
            queue: !1
        }
    }), $(".filters a").click(function() {
        $(".filters .active").removeClass("active"), $(this).addClass("active");
        var i = $(this).attr("data-filter");
        return t.isotope({
            filter: i,
            animationOptions: {
                duration: 750,
                easing: "linear",
                queue: !1
            }
        }), !1
    });
});


// google maps
function initMap() {
    // Fallback static embed to avoid billing errors
    var mapEl = document.getElementById('map');
    if (!mapEl) return;
    mapEl.innerHTML = '';
    var iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = '0';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    // OpenStreetMap static embed around Cairo Opera House (as a neutral center)
    iframe.src = 'https://www.openstreetmap.org/export/embed.html?bbox=31.220%2C30.030%2C31.255%2C30.055&layer=mapnik&marker=30.0444%2C31.2357';
    mapEl.appendChild(iframe);
}

// Enhancements after DOM is ready
$(function() {
    // IntersectionObserver reveal
    var observer = null;
    try {
        observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        $('.reveal, .card, section .container, .portfolio-item').each(function() {
            var el = this;
            if (!$(el).hasClass('reveal')) $(el).addClass('reveal');
            observer.observe(el);
        });
    } catch (e) {
        // Fallback: show immediately
        $('.reveal').addClass('reveal-visible');
    }

    // Skill bars animate width on reveal
    $('.progress .progress-bar').each(function() {
        var $bar = $(this);
        var target = parseInt($bar.attr('data-width') || '0', 10);
        if (!isNaN(target) && target > 0) {
            $bar.css('width', '0%');
            var animateBar = function() {
                $bar.animate({ width: target + '%' }, 900);
            };
            if (observer) {
                observer.observe(this);
                // When it becomes visible class is added; hook into that
                var node = this;
                var mo = new MutationObserver(function(muts){
                    muts.forEach(function(m){
                        if ($(node).hasClass('reveal-visible')) {
                            animateBar();
                            mo.disconnect();
                        }
                    })
                });
                mo.observe(this, { attributes: true, attributeFilter: ['class'] });
            } else {
                animateBar();
            }
        }
    });

    // Counters
    var startCounter = function(el) {
        var $el = $(el);
        var target = parseInt($el.attr('data-target') || '0', 10);
        var duration = 1000;
        var start = 0;
        var startTime = null;
        function step(ts) {
            if (!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / duration, 1);
            var val = Math.floor(progress * (target - start) + start);
            $el.text(val);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    };
    $('.count').each(function() {
        var el = this;
        if (observer) {
            observer.observe(el);
            var mo = new MutationObserver(function(muts){
                muts.forEach(function(){
                    if ($(el).hasClass('reveal-visible')) {
                        startCounter(el);
                        mo.disconnect();
                    }
                })
            });
            mo.observe(el, { attributes: true, attributeFilter: ['class'] });
        } else {
            startCounter(el);
        }
    });

    // 3D tilt for cards
    var toDeg = function(rad){ return rad * (180/Math.PI); };
    $('.tilt-card').on('mousemove', function(e){
        var $card = $(this);
        var rect = this.getBoundingClientRect();
        var cx = rect.left + rect.width/2;
        var cy = rect.top + rect.height/2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var rotateX = (+10 * dy / (rect.height/2));
        var rotateY = (-10 * dx / (rect.width/2));
        $card.css('transform', 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
        $card.addClass('hovered');
    }).on('mouseleave', function(){
        $(this).css('transform', 'none').removeClass('hovered');
    });

    // Contact form mailto handler
    $('#contact-form').on('submit', function(e){
        e.preventDefault();
        var name = $('#contact-name').val().trim();
        var email = $('#contact-email').val().trim();
        var message = $('#contact-message').val().trim();
        if (!name || !email || !message) {
            alert('Please fill all required fields.');
            return;
        }
        var subject = encodeURIComponent('Portfolio Contact from ' + name);
        var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
        window.location.href = 'mailto:galalmostafa362587@gmail.com?subject=' + subject + '&body=' + body;
    });

    // Theme toggle
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            $('.theme-toggle').each(function(){
                $(this).removeClass('btn-outline-dark').addClass('btn-outline-light').text('Light');
            });
        } else {
            document.documentElement.classList.remove('dark');
            $('.theme-toggle').each(function(){
                $(this).removeClass('btn-outline-light').addClass('btn-outline-dark').text('Dark');
            });
        }
    }
    var storedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(storedTheme);
    $(document).on('click', '.theme-toggle', function(){
        var isDark = document.documentElement.classList.contains('dark');
        var next = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
    });
});
