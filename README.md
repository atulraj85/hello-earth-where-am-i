## This is the Hello earth project created using 
1. React
2. Nextjs
3. Mapbox



## Code Explanation

The main component of interest is the `Map` component located in the file that imports `mapbox-gl`. This component initializes a Mapbox map, sets the default center coordinates to Borneo, and applies a specific map style (`outdoors-v12`).

```tsx
"use client";

// Importing Mapbox and its CSS styles
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

// Setting the Mapbox access token from the environment variable
// Make sure to add your Mapbox API key in the .env.local file like this:
// NEXT_PUBLIC_MAPBOX_API_KEY=your-mapbox-access-token
if (!process.env.NEXT_PUBLIC_MAPBOX_API_KEY) {
    throw new Error("Mapbox API key is not defined in the environment variables.");
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const Map = () => {
    // Reference to the map container in the DOM
    const mapContainer = useRef<HTMLDivElement | null>(null);
    // Reference to store the Mapbox instance
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        // Prevent re-initializing the map if it already exists
        if (!mapContainer.current || map.current) return;

        // Initialize the Mapbox map instance
        map.current = new mapboxgl.Map({
            container: mapContainer.current as HTMLDivElement, // The HTML container for the map
            style: "mapbox://styles/mapbox/outdoors-v12", // Mapbox style to use
            center: [114.21, 0.87], // Initial longitude and latitude for the map's center
            zoom: 5, // Initial zoom level
        });

        // Clean up the map instance only when the component unmounts
        return () => {
            if (map.current) {
                map.current.remove(); // Properly remove the map instance
                map.current = null;
            }
        };
    }, []);

    // Render the map container as a full-screen div
    return <div className="w-full h-screen" ref={mapContainer} />;
};

export default Map;

```

### Key Parts of the Code:

1. **Environment Variables**: The Mapbox access token is pulled from `process.env.NEXT_PUBLIC_MAPBOX_API_KEY`. This allows for safe storage and easy updates of API keys without hardcoding them.
2. **`useRef` for DOM Reference**: The `mapContainer` reference is used to point to the DOM element where the map will be rendered. `map` is used to store the map instance.
3. **Mapbox Map Initialization**: The map is initialized using `new mapboxgl.Map()`, with coordinates set to center on Borneo (`[114.21, 0.87]`).
4. **Cleanup**: The cleanup function (`map.current.remove()`) ensures that the map is properly destroyed when the component is unmounted, preventing memory leaks.

### Example Usage

To use this `Map` component, simply import and include it in your page component:

```tsx
import MyMapboxMap from "@/app/components/MyMapboxMap";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <MyMapboxMap/>
        </div>
    );
}
```

This example adds a title to the page and renders the `Map` component, displaying the interactive map below the heading.

## Notes

- The Mapbox access token must be kept secret. Avoid sharing your `.env.local` file or exposing your token in public repositories.
- The application uses Tailwind CSS to style the map container (`w-full h-screen`), ensuring the map takes up the full width and height of the viewport.

## Resources

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

Feel free to explore these resources to further customize the map or add additional features such as markers, layers, or popups.

## License

This project is open source and available under the MIT License.