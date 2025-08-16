import { Annotation } from "mapkit-react";
import { useEffect, useState } from "react";
import coordinateMarkerIcon from "@/assets/icons/nav/path/coordinateMarker.svg";
import useLocationParams from "@/hooks/useLocationParams";
import useNavigateLocationParams from "@/hooks/useNavigateLocationParams";
import useNavigationParams from "@/hooks/useNavigationParams";
import useBoundStore from "@/store";
import { zoomOnPoint } from "@/utils/zoomUtils";

interface Props {
  map: mapkit.Map | null;
}

const CoordinatePin = ({ map }: Props) => {
  const { coordinate } = useLocationParams();
  const { setSrc, isNavOpen } = useNavigationParams();

  const setIsZooming = useBoundStore((state) => state.setIsZooming);

  const navigate = useNavigateLocationParams();

  const [prevCoordinate, setPrevCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Zoom on focused coordinate if there is one
  /* biome-ignore lint/correctness/useExhaustiveDependencies: Should only zoom when coordinate changes
   * or when map first loads */
  useEffect(() => {
    if (coordinate) {
      setPrevCoordinate(coordinate);
    }
    if (map && coordinate && !isNavOpen) {
      zoomOnPoint(map, coordinate, 0.001, setIsZooming);
    }
  }, [coordinate?.latitude, coordinate?.longitude, !!map]);

  if (!map || !prevCoordinate) {
    return;
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log("clicked");
    if (isNavOpen) {
      setSrc(`${prevCoordinate.latitude},${prevCoordinate.longitude}`);
    } else if (
      coordinate?.latitude === prevCoordinate.latitude ||
      coordinate?.longitude === prevCoordinate.longitude
    ) {
      zoomOnPoint(map, coordinate, 0.001, setIsZooming);
    }
    navigate(`/${prevCoordinate.latitude},${prevCoordinate.longitude}`);
    e.stopPropagation();
  };

  return (
    <Annotation
      latitude={prevCoordinate.latitude}
      longitude={prevCoordinate.longitude}
      displayPriority={"required"}
    >
      <button type="button" onClick={handleClick}>
        <img
          src={coordinateMarkerIcon}
          alt="Coordinate Pin"
          className="pointer-events-none h-10 w-10"
        />
      </button>
    </Annotation>
  );
};

export default CoordinatePin;
