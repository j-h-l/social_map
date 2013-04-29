// Generated by CoffeeScript 1.6.2
(function() {
  $(function() {
    var connect;

    if (!(window.WebSocket != null)) {
      return $('#session_status').append("<p>Sorry websocket is not supported in your browser. Try something else.<\/p>");
    } else {
      connect = function() {
        var error, host, socket;

        host = "ws://localhost:9999/websocket";
        try {
          socket = new WebSocket(host);
          socket.onopen = function() {
            return $('#session_status').append("<p>Websocket is now open through: " + host + "<\/p>");
          };
          socket.onmessage = function(msg) {
            return $('#stream').append("<p class=\"message\">" + msg.data + "<\/p>");
          };
          socket.onclose = function() {
            return $('#session_status').append("<p>Websocket is now closed. Thank you come again.<\/p>");
          };
          return $('#disconnect').click(function() {
            return socket.close();
          });
        } catch (_error) {
          error = _error;
          return console.log("Websocket error: " + error);
        }
      };
      return connect();
    }
  });

}).call(this);