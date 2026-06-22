/* ==========================================================================
   SoloHer — Shared JavaScript
   Reading progress bar, mobile nav, FAQ accordion, scroll-in animations.
   ========================================================================== */

(function () {
  'use strict';

  /* ----- Mobile nav toggle ----- */
  var navToggle = document.querySelector('.nav__toggle');
  var navLinks = document.querySelector('.nav__links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a link is tapped
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ----- Reading progress bar + nav scroll state ----- */
  var progressBar = document.querySelector('.progress-bar');
  var nav = document.querySelector('.nav');
  var ticking = false;

  var onScroll = function () {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (progressBar) {
      var docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = percent + '%';
    }

    if (nav) {
      nav.classList.toggle('is-scrolled', scrollTop > 8);
    }
    ticking = false;
  };

  var requestScroll = function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);
  onScroll();

  /* ----- FAQ accordion ----- */
  document.querySelectorAll('.faq__question').forEach(function (question) {
    question.addEventListener('click', function () {
      var item = question.closest('.faq__item');
      var answer = item.querySelector('.faq__answer');
      var isOpen = item.classList.toggle('is-open');

      question.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  });

  /* ----- Scroll-in animations (trigger once) ----- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: reveal everything if IntersectionObserver is unsupported
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ----- Recalculate open FAQ height on resize (keeps long answers visible) ----- */
  window.addEventListener('resize', function () {
    document.querySelectorAll('.faq__item.is-open .faq__answer').forEach(
      function (answer) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    );
  });

  /* ----- Legal modals (popup windows) ----- */
  var openModal = function (modal) {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    var closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();
  };

  var closeModal = function (modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  // Open triggers
  document.querySelectorAll('[data-modal]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      openModal(document.getElementById(trigger.getAttribute('data-modal')));
    });
  });

  // Close on overlay / close button
  document.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', function () {
      closeModal(el.closest('.modal'));
    });
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openOne = document.querySelector('.modal.is-open');
      if (openOne) closeModal(openOne);
    }
  });
})();
