mapboxgl.accessToken = 'pk.eyJ1IjoiaW8tYWNjb3VudHMiLCJhIjoiY2xqbjVweGxvMTJtNDNldXE2NHN6YWFsdSJ9.AX756oYBqrn4MNXzDV23gw'; // Replace with your Mapbox access token

            var startingPoints = [
                [91.8206028, 26.16521776],
                [81.22978333, 16.64663163],
                [79.42802566, 14.10452511],
                [78.00177763867694, 14.604510056135306],
                [76.33185589569626, 14.859513690997552],
                [74.92560600687045, 15.36861398413617],
            ];

            var destinationPoint = [74.7698229, 13.12219202]; // Replace with the coordinates of your destination point (longitude, latitude)

            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: startingPoints[1], // Set the initial center to the first starting point
                zoom: 3
            });

            // Add a marker for the destination point
            var destMarker = new mapboxgl.Marker({ color: "green" })
                .setLngLat(destinationPoint)
                .addTo(map);

            // Add markers for the starting points
            startingPoints.forEach(function (point, index) {
                var marker = new mapboxgl.Marker({ color: "blue" })
                    .setLngLat(point)
                    .setPopup(new mapboxgl.Popup().setHTML('Starting Point ' + (index + 1)))
                    .addTo(map);
            });

            // Calculate and display the route using the Mapbox Directions API
            var waypoints = startingPoints.map(function (point) {
                return {
                    coordinates: point
                };
            });

            waypoints.push({
                coordinates: destinationPoint
            });

            fetch('https://api.mapbox.com/directions/v5/mapbox/driving/' + waypoints.map(function (waypoint) {
                return waypoint.coordinates.join(',');
            }).join(';') + '?geometries=geojson&access_token=' + mapboxgl.accessToken)
                .then(response => response.json())
                .then(data => {
                    var route = data.routes[0];
                    var routeCoordinates = route.geometry.coordinates;

                    // Calculate the index for the color change
                    var colorChangeIndex = Math.floor(routeCoordinates.length / 1.43);

                    // Divide the route into two segments
                    var routeSegment1 = routeCoordinates.slice(0, colorChangeIndex);
                    var routeSegment2 = routeCoordinates.slice(colorChangeIndex);

                    // Add the first route segment with a blue color
                    map.addLayer({
                        id: 'route-segment1',
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: {
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'LineString',
                                    coordinates: routeSegment1
                                }
                            }
                        },
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': 'blue', // Change this to the color you want
                            'line-width': 4
                        }
                    });

                    // Add the second route segment with a different color
                    map.addLayer({
                        id: 'route-segment2',
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: {
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'LineString',
                                    coordinates: routeSegment2
                                }
                            }
                        },
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': 'red', // Change this to the color you want
                            'line-width': 4
                        }
                    });

                    // Add a blue line from the end of routeSegment1 to the destination point
                    map.addLayer({
                        id: 'blue-to-destination',
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: {
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'LineString',
                                    coordinates: [routeSegment1[routeSegment1.length - 1], destinationPoint]
                                }
                            }
                        },
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': 'blue', // Change this to the color you want
                            'line-width': 4
                        }
                    });
                });

       