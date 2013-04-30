$ ->
  if !(window.WebSocket?)
    $('#session_status').append("<p>Sorry websocket is not supported in your browser. Try something else.<\/p>")
  else
    connect = ->
      host = "ws://localhost:9999/websocket"
      try
        socket = new WebSocket(host)

        socket.onopen = ->
          $('#session_status').append("<p>Websocket is now open through: #{host}<\/p>")

        socket.onmessage = (msg) ->
          $('#stream').append("<p class=\"message\">#{msg.data}<\/p>")

        socket.onclose = ->
          $('#session_status').append("<p>Websocket is now closed. Thank you come again.<\/p>")

        $('#disconnect').click ->
          socket.close()

      catch error
        console.log("Websocket error: #{error}")

    connect()

