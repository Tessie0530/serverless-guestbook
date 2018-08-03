/**
 * Web application
 */
const apiUrl = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/df9fe46a2332ad3b8ea9192dab595d75f7ba4ec9a365768e05da2154148b1a0b/questionfind';
const guestbook = {
  // retrieve the existing guestbook entries
  get() {
    return $.ajax({
      type: 'POST',
      url: `${apiUrl}/entries`,
      dataType: 'json'
    });
  },
  // add a select guestbood entry
  add(location) {
    console.log('Sending',location)
    return $.ajax({
      type: 'POST',
      url: `${apiUrl}/entries`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        location,
      }),
      dataType: 'json',
    });
  }
};

(function() {

  let entriesTemplate;

  function prepareTemplates() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  }

  // retrieve entries and update the UI
  function loadEntries() {
    console.log('Loading entries...');
    $('#entries').html('Loading entries...');
    guestbook.get().done(function(result) {
      if (!result.entries) {
        return;
      }

      const context = {
        entries: result.entries
      }
      $('#entries').html(entriesTemplate(context));
    }).error(function(error) {
      $('#entries').html('No entries');
      console.log(error);
    });
  }

  // intercept the click on the submit button, add the guestbook entry and
  // reload entries on success
  $(document).on('submit', '#searchEntry', function(e) {
    e.preventDefault();

    guestbook.add(
      $('#location').val().trim()
    ).done(function(result) {
      console.log('Loading entries...');
      $('#entries').html('Loading entries...');
      if (!result.entries) {
        return;
      }     
      const context = {
      entries: result.entries
      }  
      $('#entries').html(entriesTemplate(context));
    }).error(function(error) {
      $('#entries').html('No entries');
      console.log(error);
    });
  });

  $(document).ready(function() {
    prepareTemplates();
  });
})();
