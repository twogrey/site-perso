"use strict";

var modal = null;
var modalFocusables = [];
var previouslyFocusedElementModal = null;

var openModal = function openModal(modalID) {
  // Keep current modal & his trigger
  modal = document.querySelector('#' + modalID);
  previouslyFocusedElementModal = document.querySelector(':focus'); // Add specific styles to <body>

  body.classList.add('modal-is-open'); // Set attribute to <dialog> element

  modal.setAttribute('open', ''); // Check focusable elements in the modal then give focus to the first one

  modalFocusables = Array.from(modal.querySelectorAll(focusableSelector));
  modalFocusables[0].focus(); // Init closing modal functions

  modal.addEventListener('click', closeModal);
  modal.querySelectorAll('.js-modal-close').forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

var closeModal = function closeModal() {
  // Abort function if there is not opened modal
  if (modal === null) {
    return;
  } // Give focus to the trigger


  if (previouslyFocusedElementModal !== null) {
    previouslyFocusedElementModal.focus();
  } // Add fading-out class to modal


  modal.classList.add('is-hiding'); // Remove closing modal functions

  modal.removeEventListener('click', closeModal);
  modal.querySelectorAll('.js-modal-close').forEach(function (btn) {
    btn.removeEventListener('click', closeModal);
  });
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation); //

  var hideModal = function hideModal() {
    // Undo all the things
    modal.classList.remove('is-hiding');
    modal.removeAttribute('open', '');
    body.classList.remove('modal-is-open');
    modal.removeEventListener('animationend', hideModal);
    modal = null;
    getScrollbarWidth();
  }; // When the modal has finished to fade out


  modal.addEventListener('animationend', hideModal);
};

var stopPropagation = function stopPropagation(e) {
  e.stopPropagation();
}; // Focus trap


var focusInModal = function focusInModal(e) {
  e.preventDefault();
  var index = modalFocusables.findIndex(function (f) {
    return f === modal.querySelector(':focus');
  });

  if (e.shiftKey === true) {
    index--;
  } else {
    index++;
  }

  if (index >= modalFocusables.length) {
    index = 0;
  }

  if (index < 0) {
    index = modalFocusables.length - 1;
  }

  modalFocusables[index].focus();
};

window.addEventListener('keydown', function (e) {
  // Close modal by pressing Esc
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeModal(e);
  }

  if (e.key === 'Tab' && modal !== null) {
    focusInModal(e);
  }
});
document.querySelectorAll('.js-modal').forEach(function (a) {
  a.addEventListener('click', function () {
    openModal(a.getAttribute('data-modal-id'));
  });
});
