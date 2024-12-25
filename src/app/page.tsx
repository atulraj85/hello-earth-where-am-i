"use client";
import MyLocation from "@/components/MyLocation";
import MyMapboxMap from "@/components/MyMapboxMap";
import { LocationType } from "@/types";
import { useState } from "react";

export default function Home() {
  const [locationData, setLocationData] = useState<LocationType>({
    latitude: null,
    longitude: null,
  });

  const handleLocationUpdate = (lat: number | null, lng: number | null) => {
    setLocationData({ latitude: lat, longitude: lng });
  };

  console.log("locationData Home: ", locationData);

  return (
    <div className="flex flex-col items-center w-full relative">
      <div className="absolute z-10 ">
        <MyLocation onLocationUpdate={handleLocationUpdate} />
      </div>
      <div className="w-full">
        <MyMapboxMap locationData={locationData} />
      </div>
    </div>
  );
}
