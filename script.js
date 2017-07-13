function initialize() {
  $('.credits-button').click(toggleCreditsPopup);
  $(document).click(handleDocumentClick);

  $('.comments-button').click(toggleCommentsVisibility);
  $('.comments-section .close-button').click(toggleCommentsVisibility);

  $(document).scroll(updateHeaderShadow);

  $('.comments-comment-input').on('input', updateCommentSubmitButton);
  updateCommentSubmitButton();

  $('.comments-submit-button').click(submitComment);
  $('.comments-comment-input').on('keypress', handleCommentFieldKey);

  $('.comments-stream').scroll(updateCommentStreamShadows);
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

function updateHeaderShadow() {
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

  updateCommentStreamShadows();

  $('.comments-name-input').val('');
  $('.comments-comment-input').val('');

  $('.comments-comment-input').focus();
}

function updateCommentStreamShadows() {
  var streamEl = $('.comments-stream')[0];
  if (streamEl.scrollHeight <= streamEl.clientHeight) {
    $('.comments-header').removeClass('scrolled');
    $('.comments-new-entry').removeClass('scrolled');
  } else {
    if (streamEl.scrollTop > 0) {
      $('.comments-header').addClass('scrolled');
    } else {
      $('.comments-header').removeClass('scrolled');
    }
    if (streamEl.clientHeight + streamEl.scrollTop < streamEl.scrollHeight) {
      $('.comments-new-entry').addClass('scrolled');
    } else {
      $('.comments-new-entry').removeClass('scrolled');
    }
  }
}

function handleCommentFieldKey(event) {
  if (event.keyCode == 13 && !event.shiftKey) {
    submitComment();
    event.preventDefault();
  }
}

$(document).ready(initialize);
