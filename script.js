var comments;

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

  loadAndRenderComments();
}

function loadAndRenderComments() {
  try {
    var commentsString = localStorage.getItem('james-blog-comments') || '[]';
    comments = JSON.parse(commentsString) || [];
  } catch (exception) {
    comments = [];
  }

  comments.sort(function(comment1, comment2) {
    return comment1.timeStamp - comment2.timeStamp;
  });
  comments.forEach(renderComment);
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
  var timeStamp = (new Date()).getTime();
  var newComment = {
    name: name,
    comment: comment,
    timeStamp, timeStamp
  };
  renderComment(newComment);
  comments.push(newComment);
  localStorage.setItem('james-blog-comments', JSON.stringify(comments));

  $('.comments-name-input').val('');
  $('.comments-comment-input').val('');

  $('.comments-comment-input').focus();
}

function renderComment(commentObject) {
  var commentEntry = $('#comments-stream-entry-template')[0].content;
  commentEntry.querySelector('.comments-stream-entry-name').innerText =
      commentObject.name;

  // Compose the date string. The jquery dateFormat library just says 'more than
  // 31 days ago' for old dates. So get the actual date for old dates.
  var dateString;
  if ((new Date()).getTime() - commentObject.timeStamp >
      31 * 24 * 60 * 60 * 1000) {
    dateString = $.format.date(new Date(commentObject.timeStamp), 'd MMM yy');
  } else {
    dateString = $.format.prettyDate(new Date(commentObject.timeStamp));
  }
  commentEntry.querySelector('.comments-stream-entry-date').innerText =
      dateString;

  commentEntry.querySelector('.comments-stream-entry-comment').innerText =
      commentObject.comment;
  commentEntry = document.importNode(commentEntry, true).querySelector(
      '.comments-stream-entry');

  $('.comments-stream').append(commentEntry);
  setTimeout(function() {
    commentEntry.classList.add('showing');
  }, 16);

  updateCommentStreamShadows();
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
    if (streamEl.offsetHeight + streamEl.scrollTop < streamEl.scrollHeight) {
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
