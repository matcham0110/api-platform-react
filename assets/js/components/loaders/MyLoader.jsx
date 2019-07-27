import React from "react";
import ContentLoader from "react-content-loader";

const MyLoader = () => (
  <ContentLoader
    height={650}
    width={300}
    speed={5}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="165" y="11" rx="0" ry="0" width="1" height="0" />
  </ContentLoader>
);

export default MyLoader;
