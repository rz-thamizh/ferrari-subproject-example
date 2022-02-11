import React, { useEffect, createRef } from 'react';
import styled from 'styled-components';
import { Loader } from '@googlemaps/js-api-loader';
import { asRem } from '@/roanuz/lib/css';
import Config from '@/config';

const MapViewWrapper = styled.div`
  height: ${asRem(500)};
  .map-container {
    height: 100%;
    position: relative;
  }
`;

export const MapView = () => {
  const map = createRef();

  useEffect(() => {
    const loader = new Loader({
      apiKey: Config.GoogleMapApiKey,
      version: 'weekly',
    });
    loader.load().then((google) => {
      const mapLocation = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: {
          lat: Config.GoogleMapLocationLatitudePoint,
          lng: Config.GoogleMapLocationLongitudePoint,
        },
        zoomControl: true,
      });
      map.current = new google.maps.Marker({
        position: {
          lat: Config.GoogleMapLocationLatitudePoint,
          lng: Config.GoogleMapLocationLongitudePoint,
        },
        map: mapLocation,
        title: `${Config.WebsiteKey}.is`,
      });
    });
  }, []);

  return (
    <MapViewWrapper>
      <div className="map-container" id="map" />
    </MapViewWrapper>
  );
};
