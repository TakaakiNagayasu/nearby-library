import React, { useContext, useEffect, useRef, useState } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import {
  LibrariesCountContext,
  LibrariesListContext,
  SearchNearByLibraryContext,
} from "../templates/SSearchForm";
import { trpc } from "../utils/trpc";
import type { LatitudeLongitudeLimit } from "../object/LatitudeLongitudeLimitObject";
import { CONSTANTS } from "../config/constants";

type Props = {
  apiKey: string;
  mapId: string;
  libraries: ("places" | "geometry")[];
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: CONSTANTS.GOOGLE_MAPS_DEFAULT_LATITUDE,
  lng: CONSTANTS.GOOGLE_MAPS_DEFAULT_LONGITUDE,
};

export const MapWidget: React.FC<Props> = ({ apiKey, mapId, libraries }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const [AdvancedMarkerElement, setAdvancedMarkerElement] = useState<
    typeof google.maps.marker.AdvancedMarkerElement | null
  >(null);

  const [libraryMarkers, setLibraryMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);
  const [userMarker, setUserMarker] =
    useState<google.maps.marker.AdvancedMarkerElement>();

  const { searchNearByLibrary } = useContext(SearchNearByLibraryContext);
  const { setValueFormLibrariesCandidateList } =
    useContext(LibrariesListContext);
  const { getValuesFormLibrariesCount } = useContext(LibrariesCountContext);

  const isFirstRender = useRef(true);

  const {
    mutateAsync,
    // isLoading,
    // error,
  } = trpc.searchLibrariesFromGeoCode.searchLibrariesFromGeoCode.useMutation();

  // AdvancedMarkerElement のロード
  useEffect(() => {
    if (!isLoaded) return;

    async function loadMarkerLibrary() {
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;
      setAdvancedMarkerElement(() => AdvancedMarkerElement);
    }

    loadMarkerLibrary();
  }, [isLoaded]);

  // マーカーを追加
  useEffect(() => {
    if (!isLoaded || !AdvancedMarkerElement || !mapRef.current) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const lat =
      userMarker && userMarker.position
        ? (typeof userMarker.position.lat === "function"
            ? userMarker.position.lat()
            : userMarker.position.lat) ?? 0
        : mapRef.current.getCenter()?.lat() ?? 0;

    const lng =
      userMarker && userMarker.position
        ? (typeof userMarker.position.lng === "function"
            ? userMarker.position.lng()
            : userMarker.position.lng) ?? 0
        : mapRef.current.getCenter()?.lng() ?? 0;

    {
      const geoCodeObject: LatitudeLongitudeLimit = {
        latitude: lat,
        longitude: lng,
        limit: getValuesFormLibrariesCount().value,
      };

      const searchLibrariesFromGeoCode = async () => {
        const librariesFromGeoCode = await mutateAsync(geoCodeObject);

        // Google Mapに反映
        const markers = librariesFromGeoCode.map(
          ({ systemid, longitude, latitude, formal }) => {
            return {
              systemid,
              position: { latitude, longitude },
              title: formal,
            };
          }
        );

        if (libraryMarkers) {
          libraryMarkers.forEach((libraryMarker) => {
            libraryMarker.map = null;
          });
        }

        const newMarkers = markers.map(({ position, title }) => {
          return new AdvancedMarkerElement({
            position: { lat: position.latitude, lng: position.longitude },
            title,
            map: null,
          });
        });

        newMarkers.forEach((marker) => {
          marker.map = mapRef.current;
        });

        setLibraryMarkers(newMarkers);

        const calcKmToM = (strKm: string) => {
          const numKm: number = strKm ? Number.parseFloat(strKm) : 0;
          const numM = Math.round(numKm * 1000);
          return numM.toString() + "m";
        };

        // 図書館候補一覧に反映
        setValueFormLibrariesCandidateList(
          "checkboxList",
          librariesFromGeoCode.map(
            ({ systemid, formal, distance, url_pc }) => ({
              enabled: true,
              checkbox: false,
              name: formal,
              sub: calcKmToM(distance),
              value: systemid,
              link: url_pc,
            })
          )
        );
      };

      searchLibrariesFromGeoCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, AdvancedMarkerElement, searchNearByLibrary]);

  // ユーザーがクリックした場所にマーカーを追加
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!AdvancedMarkerElement || !mapRef.current || !event.latLng) return;

    const newMarker = (latLng: google.maps.LatLng) =>
      new AdvancedMarkerElement({
        position: latLng,
        title: "中心位置",
        map: mapRef.current,
        content: new google.maps.marker.PinElement({
          background: "#34A7FF",
          glyphColor: "#0074CC",
          borderColor: "#0074CC",
        }).element,
      });

    if (userMarker) {
      userMarker.position = null;
    }
    setUserMarker(newMarker(event.latLng));
  };

  // setUserMarker(newMarker(new google.maps.LatLng(center.lat, center.lng)));

  if (loadError) {
    return <div>Error loading Google Maps: {loadError.message}</div>;
  }

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={CONSTANTS.GOOGLE_MAPS_DEFAULT_ZOOM}
        onLoad={(map) => {
          mapRef.current = map;
          map.setOptions({ mapId: mapId });
        }}
        onClick={(event) => handleMapClick(event)}
      />
    </>
  );
};
