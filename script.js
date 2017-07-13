function initialize() {
  $('.credits-button').click(toggleCreditsPopup);
  $(document).click(handleDocumentClick);

  $('.comments-button').click(toggleCommentsVisibility);
  $('.comments-section .close-button').click(toggleCommentsVisibility);

  $(document).scroll(setHeaderShadow);

  $('.comments-comment-input').on('input', updateCommentSubmitButton);
  updateCommentSubmitButton();

  $('.comments-submit-button').click(submitComment);
  $('.comments-comment-input').on('keypress', handleCommentFieldKey);
}

function toggleCreditsPopup() {
  $('.credits-popup').toggleClass('showing');
}

function handleDocumentClick(event) {
  if (event.target != $('.credits-popup')[0] &&
      event.target != $('.credits-button')[0]) {
    $('.credits-popup').removeClass('showing');
  }
}

function toggleCommentsVisibility() {
  $('.comments-button').toggleClass('showing');
  $('.comments-section').toggleClass('showing');

  if ($('.comments-section').hasClass('showing')) {
    $('.comments-comment-input').focus();
  }
}

function setHeaderShadow() {
  if (document.body.scrollTop > 0) {
    $('.header').addClass('scrolled');
  } else {
    $('.header').removeClass('scrolled');
  }
}

function updateCommentSubmitButton() {
  if ($('.comments-comment-input').val()) {
    $('.comments-submit-button').removeClass('disabled');
  } else {
    $('.comments-submit-button').addClass('disabled');
  }
}

function submitComment() {
  if ($('.comments-submit-button').hasClass('disabled')) {
    return;
  }

  var name = $('.comments-name-input').val() || 'Anonymous';
  var comment = $('.comments-comment-input').val();

  var commentEntry = $('#comments-stream-entry-template')[0].content;
  commentEntry.querySelector('.comments-stream-entry-name').innerText = name;
  commentEntry.querySelector('.comments-stream-entry-date').innerText =
      $.format.prettyDate(new Date());
  commentEntry.querySelector('.comments-stream-entry-comment').innerText =
      comment;
  commentEntry = document.importNode(commentEntry, true).querySelector(
      '.comments-stream-entry');

  $('.comments-stream').append(commentEntry);
  setTimeout(function() {
    commentEntry.classList.add('showing');
  }, 16);


  $('.comments-name-input').val('');
  $('.comments-comment-input').val('');

  $('.comments-comment-input').focus();
}

function handleCommentFieldKey(event) {
  if (event.keyCode == 13 && !event.shiftKey) {
    submitComment();
    event.preventDefault();
  }
}

$(document).ready(initialize);
