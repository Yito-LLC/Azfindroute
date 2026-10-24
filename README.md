# Az Find Route.com
Repository to help with the Tempe Union Bus System.

The map is powered by Mapbox GL JS and opens in 3D. Use the map control to switch
between 3D and 2D. Enter an address and press Enter to geocode it and place a pin
on the map, zooming in to street level.

If you zoom out below level 5, the map recenters on your most recently searched
address, or on Arizona if you have not searched for an address yet.

The Mapbox public access token is configured in the `mapbox-access-token` meta
tag in `index.html`. The token needs Mapbox GL JS, Search JS, and Geocoding API
access.
