/* ==========================================================================
   Pimofy Digital — Site JavaScript
   Handles: sticky header shadow, desktop dropdown, mobile menu,
            FAQ accordion, scroll-reveal animations, contact form.
   Vanilla JS, no dependencies. Deferred load (see <script defer>).
   ========================================================================== */
(function () {
  'use strict';

  /* --- 1) Sticky header shadow on scroll --------------------------------- */
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- 2) Mobile menu toggle --------------------------------------------- */
  var burger = document.querySelector('.nav__burger');
  var menu = document.querySelector('.nav__menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    // Close menu when a real link (not the dropdown toggle) is tapped
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- 3) Dropdown (Solutions) — click + hover, keyboard accessible ------ */
  document.querySelectorAll('.dropdown').forEach(function (dd) {
    var toggle = dd.querySelector('.dropdown__toggle');
    if (!toggle) return;
    var setOpen = function (state) { dd.setAttribute('aria-expanded', String(state)); };

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      setOpen(dd.getAttribute('aria-expanded') !== 'true');
    });
    // Desktop hover
    dd.addEventListener('mouseenter', function () { if (window.innerWidth > 760) setOpen(true); });
    dd.addEventListener('mouseleave', function () { if (window.innerWidth > 760) setOpen(false); });
    // Close on outside click / Escape
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  });

  /* --- 4) FAQ accordion --------------------------------------------------- */
  document.querySelectorAll('.faq__item').forEach(function (item) {
    var q = item.querySelector('.faq__q');
    var a = item.querySelector('.faq__a');
    if (!q || !a) return;
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', function () {
      var open = item.getAttribute('aria-expanded') === 'true';
      item.setAttribute('aria-expanded', String(!open));
      q.setAttribute('aria-expanded', String(!open));
      a.style.maxHeight = open ? null : a.scrollHeight + 'px';
    });
  });

  /* --- 5) Scroll-reveal animations (IntersectionObserver) ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: show everything if IO unsupported
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* --- 6) Contact form (front-end only fallback) -------------------------- */
  var form = document.querySelector('#contact-form');
  if (form) {
    var method = (form.getAttribute('method') || 'get').toLowerCase();
    var action = (form.getAttribute('action') || '').trim();
    var usesBackendSubmit = method === 'post' && action.length > 0;
    var humanVerificationInput = form.querySelector('#human_verification');
    var humanVerificationAnswerInput = form.querySelector('#human_verification_answer');
    var humanVerificationField = form.querySelector('[data-human-field]');
    var humanVerificationQuestion = form.querySelector('[data-human-question]');
    var refreshButton = form.querySelector('[data-refresh-human-challenge]');
    var humanErrorMessage = 'Please answer the arithmetic check correctly before submitting.';

    function showHumanVerificationError(message) {
      var errorBox = form.querySelector('.form__error');
      if (errorBox) {
        errorBox.innerHTML = '<strong>Please fix the following:</strong><ul><li>' + (message || humanErrorMessage) + '</li></ul>';
        errorBox.classList.add('show');
      }

      if (humanVerificationField) {
        humanVerificationField.classList.add('field--error');
      }

      if (humanVerificationInput) {
        humanVerificationInput.setAttribute('aria-invalid', 'true');
      }
    }

    function clearHumanVerificationError() {
      if (humanVerificationField) {
        humanVerificationField.classList.remove('field--error');
      }

      if (humanVerificationInput) {
        humanVerificationInput.removeAttribute('aria-invalid');
      }
    }

    function markHumanVerificationSuccess() {
      if (humanVerificationField) {
        humanVerificationField.classList.remove('field--error');
        humanVerificationField.classList.add('field--success');
      }
    }

    function clearHumanVerificationSuccess() {
      if (humanVerificationField) {
        humanVerificationField.classList.remove('field--success');
      }
    }

    function updateHumanVerification(challenge) {
      if (!challenge || !humanVerificationQuestion || !humanVerificationAnswerInput || !humanVerificationInput) {
        return;
      }

      humanVerificationQuestion.textContent = challenge.question;
      humanVerificationAnswerInput.value = String(challenge.answer);
      humanVerificationInput.value = '';
      clearHumanVerificationError();
      clearHumanVerificationSuccess();
    }

    if (humanVerificationInput && humanVerificationAnswerInput) {
      humanVerificationInput.setAttribute('pattern', '[0-9-]+');
      humanVerificationInput.setAttribute('inputmode', 'numeric');
      humanVerificationInput.addEventListener('input', function () {
        if (humanVerificationInput.value.trim() !== '') {
          clearHumanVerificationError();
          if (Number(humanVerificationInput.value) === Number(humanVerificationAnswerInput.value)) {
            markHumanVerificationSuccess();
          } else {
            clearHumanVerificationSuccess();
          }
        } else {
          clearHumanVerificationSuccess();
          clearHumanVerificationError();
        }
      });
    }

    if (refreshButton) {
      refreshButton.addEventListener('click', function () {
        fetch('/contact/challenge', {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })
          .then(function (response) {
            if (!response.ok) {
              throw new Error('Unable to refresh the challenge.');
            }
            return response.json();
          })
          .then(function (challenge) {
            updateHumanVerification(challenge);
          })
          .catch(function () {
            var errorBox = form.querySelector('.form__error');
            if (errorBox) {
              errorBox.innerHTML = '<strong>Please fix the following:</strong><ul><li>Unable to refresh the security challenge. Please try again.</li></ul>';
              errorBox.classList.add('show');
            }
          });
      });
    }

    // Keep static prototype pages usable, but never block real backend submits.
    if (!usesBackendSubmit) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var success = form.querySelector('.form__success');
        if (success) {
          success.classList.add('show');
          success.setAttribute('role', 'status');
        }
        form.reset();
      });
    }

    form.addEventListener('submit', function (e) {
      if (humanVerificationInput && humanVerificationAnswerInput) {
        var userAnswer = (humanVerificationInput.value || '').trim();
        var expectedAnswer = (humanVerificationAnswerInput.value || '').trim();
        var validAnswer = userAnswer !== '' && Number(userAnswer) === Number(expectedAnswer);

        if (!validAnswer) {
          e.preventDefault();
          humanVerificationInput.focus();
          showHumanVerificationError(humanErrorMessage);
          clearHumanVerificationSuccess();
          return;
        }

        clearHumanVerificationError();
        markHumanVerificationSuccess();
      }

      form.classList.add('is-loading');
      form.setAttribute('aria-busy', 'true');
      var submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.classList.add('is-loading');
        submitButton.setAttribute('aria-disabled', 'true');
      }
    });

    // If redirected with a contact feedback anchor, keep focus on feedback
    // but clean query/hash so refresh or share links stay tidy.
    var feedback = form.querySelector('.form__feedback');
    var url = new URL(window.location.href);
    var hasFeedbackHash =
      window.location.hash === '#contact-feedback-anchor' ||
      window.location.hash === '#contact-success-feedback' ||
      window.location.hash === '#contact-error-feedback';
    var hasStatusParam = url.searchParams.has('success') || url.searchParams.has('error');

    if (feedback && hasFeedbackHash && hasStatusParam) {
      var hasVisibleMessage = !!feedback.querySelector('.form__success.show, .form__error.show');
      if (hasVisibleMessage) {
        setTimeout(function () {
          var cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete('success');
          cleanUrl.searchParams.delete('error');
          cleanUrl.hash = '';
          window.history.replaceState({}, '', cleanUrl.pathname + cleanUrl.search);
        }, 1200);
      }
    }
  }

  /* --- 7) Footer year ----------------------------------------------------- */
  var yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
