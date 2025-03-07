import React from "react";
import { styled } from "@mui/material";
import { Wrapper as GoogleMapWrapper } from "@googlemaps/react-wrapper";
import { MapWidget } from "../molecules/MapWidget";

type Props = {
  apiKey: string;
  mapId: string;
};

const Frame = styled("div")`
  width: 100%;
  height: 100%;
`;

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

const IndexPage: React.FC<Props> = ({ apiKey, mapId }) => (
  <Frame>
    <GoogleMapWrapper apiKey={apiKey}>
      <MapWidget apiKey={apiKey} mapId={mapId} libraries={libraries}/>
    </GoogleMapWrapper>
  </Frame>
);

export default IndexPage;
