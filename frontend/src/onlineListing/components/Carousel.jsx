import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
      const settings = {
            // Slider settings
            dots: true,
            infinite: true,
            speed: 500,

            // Slide settings
            slidesToShow: 1,
            slidesToScroll: 1,

            // Autoplay settings
            autoplay: true,
            autoplaySpeed: 3000, // 3 seconds

            // Navigation settings
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
      };

      return (
            <div style={{ width: "100%", margin: "0 auto" }}>
                  <Slider {...settings}>
                        <div>
                              <div
                                    style={{
                                          backgroundColor: "red",
                                          height: "400px",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          color: "white",
                                          fontSize: "30px",
                                    }}
                              >
                                    <h2>Slide 1</h2>
                              </div>
                        </div>
                        <div>
                              <div
                                    style={{
                                          backgroundColor: "orange",
                                          height: "400px",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          color: "white",
                                          fontSize: "30px",
                                    }}
                              >
                                    <h2>Slide 2</h2>
                              </div>
                        </div>
                        <div>
                              <div
                                    style={{
                                          backgroundColor: "green",
                                          height: "400px",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          color: "white",
                                          fontSize: "30px",
                                    }}
                              >
                                    <h2>Slide 3</h2>
                              </div>
                        </div>
                  </Slider>
            </div>
      );
};

// Custom Next Arrow
const SampleNextArrow = (props) => {
      const { className, style, onClick } = props;
      return (
            <div
                  className={className}
                  style={{
                        ...style,
                        display: "block",
                        background: "gray",
                        borderRadius: "50%",
                        right: "10px",
                        zIndex: 1,
                  }}
                  onClick={onClick}
            />
      );
};

// Custom Previous Arrow
const SamplePrevArrow = (props) => {
      const { className, style, onClick } = props;
      return (
            <div
                  className={className}
                  style={{
                        ...style,
                        display: "block",
                        background: "gray",
                        borderRadius: "50%",
                        left: "10px",
                        zIndex: 1,
                  }}
                  onClick={onClick}
            />
      );
};

export default Carousel;
