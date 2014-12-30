
(function () {

  var name;
  var socket = io();

  function initChat() {

    var $msg = $('#messages');
    var $msgTable = $('#messages table');

    $('.namebox form').submit(function () {
      name = $('#name').val();
      $('.namebox').hide();
      $('.chat').show();
      $msg.scrollTop($msg.prop('scrollHeight'));
      return false;
    });

    $('.chat form').submit(function(){
      socket.emit('chat message', {
        name: name,
        text: $('#m').val()
      });
      $('#m').val('');
      return false;
    });

    socket.on('chat log', function(messages){
      messages.forEach(function (msg) {
        $msgTable.append('<tr><td>' + msg.name + '</td><td>' + msg.text + '</td></tr>');
      });
      $msg.scrollTop($msg.prop('scrollHeight'));
    });

    socket.on('chat message', function(msg){
      $msgTable.append('<tr><td>' + msg.name + '</td><td>' + msg.text + '</td></tr>');
      $msg.scrollTop($msg.prop('scrollHeight'));
    });

  }

  function initAttendance() {

    $('aside input').on('change', function() {
      socket.emit('attendance update', {
        name: $(this).attr('name'),
        attendance: $(this).is(':checked')
      });
    });

    socket.on('attendance log', function(attendance) {
      Object.keys(attendance).forEach(function (name) {
        $('aside input[name=' + name + ']').prop('checked', attendance[name]);
      });
    });

    socket.on('attendance update', function(msg){
      $('aside input[name=' + msg.name + ']').prop('checked', msg.attendance);
    });

  }

  window.airsoft = {
    initChat: initChat,
    initAttendance: initAttendance
  };

}());
