import { useState } from "react";

const Home = () => {
  const [comets, setComets] = useState([{ degree: 0, size: 8 }]);

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const addComet = () => {
    const MAX_PHONE_DOT_SIZE = 4;
    const MAX_TABLET_DOT_SIZE = 6;
    const MAX_DESKTOP_DOT_SIZE = 14;

    const isPhone = window.document.body.offsetWidth <= 767;
    const isTablet = window.document.body.offsetWidth <= 991;

    let maxDotSize = MAX_DESKTOP_DOT_SIZE;

    if (isTablet) {
      maxDotSize = MAX_TABLET_DOT_SIZE;
    }

    if (isPhone) {
      maxDotSize = MAX_PHONE_DOT_SIZE;
    }

    const item = {
      degree: randomIntFromInterval(-15, 15),
      size: randomIntFromInterval(2, maxDotSize),
    };
    setComets([...comets, { ...item }]);
  };

  return (
    <div className={"welcome"}>
      <h1 className="welcome__greeting" onClick={addComet}>
        <span className="welcome_app-text">New App</span>
        <span className="bg-text bg-text-3"> New App</span>
        <span className="bg-text bg-text-2"> New App</span>
        <span className="bg-text bg-text-1"> New App</span>
        {comets.map((item, index) => (
          <div
            className="comet__line"
            style={{
              transform: `rotateZ(${item.degree}deg)`,
            }}
          >
            <div
              key={index}
              style={{
                width: `${item.size}px`,
                height: `${item.size}px`,
              }}
              className="comet"
            ></div>
          </div>
        ))}
        <div className="comet-8"></div>
      </h1>
    </div>
  );
};

export default Home;
