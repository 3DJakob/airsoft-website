
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

  function initSlider() {

    var current = 0;
    var width = $('.slider').width();
    var count = $('.slider .images img').length;

    $('.slider .images').css('width', width * count);
    $('.slider .images img').css('width', width);

    function setSlide(n) {

      dots[current].removeClass('active');

      current = n;

      dots[current].addClass('active');

      updateCSS();
    }

    function updateCSS() {
      $('.slider .images').css('left', -(current * width));
    }

    function prevSlide() {
      setSlide((current + count - 1) % count);
    }

    function nextSlide() {
      setSlide((current + 1) % count);
    }

    var dots = [];

    for (var i=0; i<count; i++) {
      var dot = $('<div />');
      dots.push(dot);
      $('.slider .dots').append(dot);
    }

    dots[current].addClass('active');

    setInterval(nextSlide, 7000);
    $('.slider a').eq(0).on('click', prevSlide);
    $('.slider a').eq(1).on('click', nextSlide);

  }

  window.airsoft = {
    initChat: initChat,
    initAttendance: initAttendance,
    initSlider: initSlider
  };

}());
