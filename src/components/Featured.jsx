import { useEffect, useMemo, useState } from "react";
import DriftWall from "./DriftWall";
import { CREATIONS } from "../data";

function useResponsiveTile() {
  const [tile, setTile] = useState({
    width: 280,
    columns: 5,
  });

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 720;

      setTile({
        width: mobile ? 150 : 280,
        columns: mobile ? 3 : 5,
      });
    };

    update();

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return tile;
}

export default function Featured({ onSelect }) {
  const items = useMemo(() => {
    return CREATIONS
      .filter((c) => c.featured)
      .sort(
        (a, b) =>
          (a.featuredOrder || 0) -
          (b.featuredOrder || 0)
      );
  }, []);

  const {
    width: tileWidth,
    columns,
  } = useResponsiveTile();

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="featured"
      id="featured"
      aria-label="Lavori in evidenza"
    >
      <div className="section-head">
        <h2 className="section-title">
          Lavori in evidenza
        </h2>
      </div>

      <div className="featured-wall">
        <DriftWall
          items={items}
          columns={columns}
          tileWidth={tileWidth}

          gap={24}
          radius={22}

          tilt={9}
          turn={-7}

          perspective={1600}
          depth={90}

          speed={24}
          direction="up"

          variance={0.4}
          parallax={0.7}

          lift={36}

          fade={0.32}
          dim={0.88}

          overlayColor="#121019"

          onSelect={onSelect}
        />
      </div>
    </section>
  );
}