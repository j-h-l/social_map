$ ->
  if !(window.WebSocket?)
    $('#session_status').append("<p>Sorry websocket is not supported in your browser. Try something else.<\/p>")
  else
    mapOptions =
      zoom: 4
      center: new google.maps.LatLng(-34.397, 150.644)
      mapTypeId: google.maps.MapTypeId.ROADMAP
    map = new google.maps.Map($('#map-canvas')[0], mapOptions)

    connect = ->
      host = "ws://localhost:9999/websocket"
      try
        socket = new WebSocket(host)

        socket.onopen = ->
          $('#session_status').append("<p>Websocket is now open through: #{host}<\/p>")

        socket.onmessage = (msg) ->
          # something = JSON.parse(msg)
          # console.log("Console output: #{msg}")
          j = JSON.parse(msg.data)

          # $('#stream').append("<p class=\"message\">#{j.lat}<\/p>")
          markoptions = 
            position: new google.maps.LatLng(j.lat, j.lng)
            map: map
            title: 'newone'

          addM = new google.maps.Marker(markoptions)
          map.panTo(addM.getPosition())

        socket.onclose = ->
          $('#session_status').append("<p>Websocket is now closed. Thank you come again.<\/p>")

        $('#disconnect').click ->
          socket.close()

      catch error
        console.log("Websocket error: #{error}")

    gmapinit = ->
      mapOptions =
        zoom: 4
        center: new google.maps.LatLng(-34.397, 150.644)
        mapTypeId: google.maps.MapTypeId.ROADMAP

      map = new google.maps.Map($('#map-canvas')[0], mapOptions)


    connect()
    
    google.maps.event.addDomListener(window, 'load', gmapinit)

