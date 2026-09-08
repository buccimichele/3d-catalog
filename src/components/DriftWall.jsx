import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./DriftWall.css";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .matches;

const columnFactor = (index, variance) => {
  const pseudo =
    ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;

  return 1 + variance * pseudo;
};

const getItemId = (item) => {
  return (
    item.id ||
    `${item.title}-${item.images?.[0] || ""}`
  );
};

export default function DriftWall({
  items = [],
  columns = 5,
  tileWidth = 200,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = "up",
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = false,
  overlayColor = "#060010",
  onSelect,
  className = "",
  style,
}) {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const trackRefs = useRef([]);
  const copyRefs = useRef([]);
  const rafRef = useRef(null);

  const offsetsRef = useRef([]);
  const velocitiesRef = useRef([]);

  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);

  const pointerRef = useRef({
    x: 0,
    y: 0,
  });

  const pointerDampedRef = useRef({
    x: 0,
    y: 0,
  });

  const lastTsRef = useRef(null);

  const [containerHeight, setContainerHeight] =
    useState(600);

  const [activeId, setActiveId] =
    useState(null);

  const activeIdRef = useRef(null);

  const [reduced, setReduced] =
    useState(false);

  const [imageRatios, setImageRatios] =
    useState({});

  const [columnHeights, setColumnHeights] =
    useState([]);

  const columnItems = useMemo(() => {
    if (!items.length) {
      return Array.from(
        { length: columns },
        () => []
      );
    }

    const shuffled = [...items];

    for (
      let i = shuffled.length - 1;
      i > 0;
      i--
    ) {
      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [
        shuffled[i],
        shuffled[j],
      ] = [
        shuffled[j],
        shuffled[i],
      ];
    }

    const result = Array.from(
      { length: columns },
      () => []
    );

    shuffled.forEach(
      (item, index) => {
        result[index % columns].push(item);
      }
    );

    return result;
  }, [items, columns]);

  useEffect(() => {
    setReduced(prefersReducedMotion());

    const mq = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const onChange = (event) => {
      setReduced(event.matches);
    };

    mq.addEventListener(
      "change",
      onChange
    );

    return () => {
      mq.removeEventListener(
        "change",
        onChange
      );
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const sources = [
      ...new Set(
        items
          .map((item) => item.images?.[0])
          .filter(Boolean)
      ),
    ];

    if (!sources.length) {
      return undefined;
    }

    const loadImages = async () => {
      const results =
        await Promise.all(
          sources.map(
            (src) =>
              new Promise(
                (resolve) => {
                  const img =
                    new Image();

                  img.onload = () => {
                    if (
                      img.naturalWidth &&
                      img.naturalHeight
                    ) {
                      resolve({
                        src,
                        ratio:
                          img.naturalWidth /
                          img.naturalHeight,
                      });
                    } else {
                      resolve(null);
                    }
                  };

                  img.onerror = () => {
                    resolve(null);
                  };

                  img.src = src;
                }
              )
          )
        );

      if (cancelled) return;

      setImageRatios((previous) => {
        const next = {
          ...previous,
        };

        results.forEach((result) => {
          if (result) {
            next[result.src] =
              result.ratio;
          }
        });

        return next;
      });
    };

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [items]);

  useLayoutEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const ro =
      new ResizeObserver(
        ([entry]) => {
          setContainerHeight(
            entry.contentRect.height ||
              600
          );
        }
      );

    ro.observe(
      containerRef.current
    );

    return () => {
      ro.disconnect();
    };
  }, []);

  const measureColumns =
    useCallback(() => {
      const heights =
        columnItems.map(
          (_, columnIndex) => {
            const copy =
              copyRefs.current[
                columnIndex
              ];

            if (!copy) {
              return 0;
            }

            return copy.offsetHeight;
          }
        );

      setColumnHeights(
        (previous) => {
          if (
            previous.length ===
              heights.length &&
            previous.every(
              (value, index) =>
                Math.abs(
                  value -
                    heights[index]
                ) < 0.5
            )
          ) {
            return previous;
          }

          return heights;
        }
      );
    },
    [columnItems]
  );

  useLayoutEffect(() => {
    measureColumns();
  }, [
    measureColumns,
    imageRatios,
    tileWidth,
    gap,
    containerHeight,
  ]);

  useEffect(() => {
    const observers = [];

    copyRefs.current.forEach(
      (copy) => {
        if (!copy) return;

        const ro =
          new ResizeObserver(() => {
            measureColumns();
          });

        ro.observe(copy);

        observers.push(ro);
      }
    );

    return () => {
      observers.forEach((ro) =>
        ro.disconnect()
      );
    };
  }, [
    columnItems,
    imageRatios,
    tileWidth,
    measureColumns,
  ]);

  const columnCopies = useMemo(() => {
    return columnHeights.map(
      (height) => {
        if (!height) {
          return 2;
        }

        return Math.max(
          2,
          Math.ceil(
            (containerHeight * 1.8) /
              height
          ) + 1
        );
      }
    );
  }, [
    columnHeights,
    containerHeight,
  ]);

  const baseVelocities = useMemo(() => {
    const dirSign =
      direction === "up" ? 1 : -1;

    return columnItems.map(
      (_, columnIndex) => {
        const alternate =
          columnIndex % 2 === 0
            ? 1
            : -1;

        return (
          speed *
          columnFactor(
            columnIndex,
            variance
          ) *
          dirSign *
          alternate
        );
      }
    );
  }, [
    columnItems,
    speed,
    direction,
    variance,
  ]);

  useEffect(() => {
    // Le immagini finiscono di caricare in momenti diversi,
    // quindi columnHeights cambia più volte dopo il mount.
    // Se ogni volta azzerassimo offset/velocità, la colonna
    // "salterebbe" di colpo a una nuova posizione proprio
    // mentre una foto cambia dimensione: è quel salto a dare
    // l'impressione di un buco o di un'immagine che sparisce.
    // Impostiamo la posizione di partenza una sola volta per
    // colonna e poi la lasciamo intatta ai ricalcoli successivi.
    const previousOffsets = offsetsRef.current;
    const previousVelocities = velocitiesRef.current;

    offsetsRef.current = columnHeights.map(
      (height, columnIndex) => {
        if (previousOffsets[columnIndex] != null) {
          return previousOffsets[columnIndex];
        }

        if (!height) return 0;

        return (
          height *
          ((columnIndex * 0.37) % 1)
        );
      }
    );

    velocitiesRef.current = columnItems.map(
      (_, columnIndex) =>
        previousVelocities[columnIndex] || 0
    );
  }, [
    columnHeights,
    columnItems,
  ]);

  const applyPlaneTransform =
    useCallback(
      (px, py) => {
        const plane =
          planeRef.current;

        if (!plane) return;

        plane.style.transform =
          `translate(-50%, -50%) scale(1.18) ` +
          `rotateX(${tilt + py}deg) ` +
          `rotateY(${turn + px}deg) ` +
          `rotateZ(${roll}deg) ` +
          `translateZ(${-depth}px)`;
      },
      [
        tilt,
        turn,
        roll,
        depth,
      ]
    );

  useEffect(() => {
    const animate = (timestamp) => {
      if (
        lastTsRef.current === null
      ) {
        lastTsRef.current =
          timestamp;
      }

      const dt = Math.min(
        0.05,
        Math.max(
          0,
          timestamp -
            lastTsRef.current
        ) / 1000
      );

      lastTsRef.current =
        timestamp;

      const maxTilt =
        parallax * 8;

      const targetX =
        pointerRef.current.x *
        maxTilt;

      const targetY =
        -pointerRef.current.y *
        maxTilt;

      const damp =
        1 -
        Math.exp(-dt / 0.12);

      pointerDampedRef.current.x +=
        (targetX -
          pointerDampedRef.current
            .x) *
        damp;

      pointerDampedRef.current.y +=
        (targetY -
          pointerDampedRef.current
            .y) *
        damp;

      applyPlaneTransform(
        pointerDampedRef.current.x,
        pointerDampedRef.current.y
      );

      for (
        let c = 0;
        c < trackRefs.current.length;
        c++
      ) {
        const copyHeight =
          columnHeights[c];

        if (!copyHeight) {
          continue;
        }

        const paused =
          wallHoveredRef.current &&
          pauseOnHover;

        const factor =
          paused ||
          hoveredColRef.current === c
            ? 0
            : 1;

        const target =
          baseVelocities[c] *
          factor;

        const ease =
          1 -
          Math.exp(
            -dt /
              (target === 0
                ? 0.16
                : 0.28)
          );

        velocitiesRef.current[c] +=
          (target -
            velocitiesRef.current[
              c
            ]) *
          ease;

        let next =
          (offsetsRef.current[c] ||
            0) +
          velocitiesRef.current[c] *
            dt;

        next =
          ((next % copyHeight) +
            copyHeight) %
          copyHeight;

        offsetsRef.current[c] =
          next;

        const track =
          trackRefs.current[c];

        if (track) {
          track.style.transform =
            `translate3d(0, ${-next}px, 0)`;
        }
      }

      rafRef.current =
        requestAnimationFrame(
          animate
        );
    };

    rafRef.current =
      requestAnimationFrame(
        animate
      );

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(
          rafRef.current
        );
      }

      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [
    baseVelocities,
    columnHeights,
    pauseOnHover,
    parallax,
    reduced,
    applyPlaneTransform,
  ]);

  const activate = useCallback(
    (id, columnIndex) => {
      activeIdRef.current = id;
      hoveredColRef.current =
        columnIndex;

      setActiveId(id);
    },
    []
  );

  const release = useCallback(
    () => {
      activeIdRef.current = null;
      hoveredColRef.current = -1;
      setActiveId(null);
    },
    []
  );

  const handlePointerMove =
    useCallback(
      (event) => {
        const rect =
          containerRef.current?.getBoundingClientRect();

        if (!rect) return;

        if (
          parallax > 0 &&
          !reduced
        ) {
          pointerRef.current = {
            x:
              (event.clientX -
                rect.left) /
                rect.width -
              0.5,

            y:
              (event.clientY -
                rect.top) /
                rect.height -
              0.5,
          };
        }

        const hit =
          document.elementFromPoint(
            event.clientX,
            event.clientY
          );

        const tile =
          hit?.closest?.(
            "[data-tile-id]"
          );

        if (!tile) return;

        const id =
          tile.dataset.tileId;

        if (
          id ===
          activeIdRef.current
        ) {
          return;
        }

        activeIdRef.current = id;

        hoveredColRef.current =
          Number(
            tile.dataset.col
          );

        setActiveId(id);
      },
      [parallax, reduced]
    );

  const handlePointerLeaveWall =
    useCallback(() => {
      wallHoveredRef.current =
        false;

      pointerRef.current = {
        x: 0,
        y: 0,
      };

      release();
    }, [release]);

  const cssVars = useMemo(
    () => ({
      "--dw-tile-w": `${tileWidth}px`,
      "--dw-gap": `${gap}px`,
      "--dw-radius": `${radius}px`,
      "--dw-perspective": `${perspective}px`,
      "--dw-lift": `${lift}px`,
      "--dw-dim": dim,
      "--dw-gray":
        grayscale ? 1 : 0,
      "--dw-overlay":
        overlayColor,
      "--dw-edge": `${Math.max(
        0,
        (1 - fade) * 100
      )}%`,
      ...style,
    }),
    [
      tileWidth,
      gap,
      radius,
      perspective,
      lift,
      dim,
      grayscale,
      overlayColor,
      fade,
      style,
    ]
  );

  const renderTile = (
    item,
    copyIndex,
    itemIndex,
    columnIndex
  ) => {
    const src =
      item.images?.[0];

    if (!src) return null;

    const itemId =
      getItemId(item);

    const ratio =
      imageRatios[src] || 4 / 3;

    const imageHeight =
      tileWidth / ratio;

    const borderPosition =
      itemIndex % 2 === 0
        ? "bottom"
        : "top";

    const tileId =
      `${columnIndex}-${copyIndex}-${itemId}`;

    return (
      <div
        key={tileId}
        tabIndex={0}
        role="button"
        aria-label={item.title}
        className={[
          "drift-wall__tile",
          `drift-wall__tile--border-${borderPosition}`,
          activeId === tileId
            ? "is-active"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-tile-id={tileId}
        data-col={columnIndex}
        style={{
          "--dw-image-h": `${imageHeight}px`,
        }}
        onFocus={() =>
          activate(
            tileId,
            columnIndex
          )
        }
        onBlur={release}
        onClick={() =>
          onSelect?.(item)
        }
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            onSelect?.(item);
          }
        }}
      >
        <span className="drift-wall__inner">
          <img
            src={src}
            alt={item.title}
            width="auto"
            height="auto"
            loading="eager"
            decoding="async"
            draggable={false}
          />

          <span
            className="drift-wall__overlay"
            aria-hidden="true"
          />
        </span>
      </div>
    );
  };

  const rootClass = [
    "drift-wall",
    reduced
      ? "drift-wall--reduced"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={
        handlePointerMove
      }
      onPointerEnter={() => {
        wallHoveredRef.current =
          true;
      }}
      onPointerLeave={
        handlePointerLeaveWall
      }
      role="group"
      aria-label="Lavori in evidenza"
    >
      <div
        ref={planeRef}
        className="drift-wall__plane"
      >
        {columnItems.map(
          (column, columnIndex) => {
            const copies =
              columnCopies[
                columnIndex
              ] || 2;

            return (
              <div
                className="drift-wall__col"
                key={`col-${columnIndex}`}
              >
                <div
                  className="drift-wall__track"
                  ref={(element) => {
                    trackRefs.current[
                      columnIndex
                    ] = element;
                  }}
                >
                  {Array.from({
                    length: copies,
                  }).map(
                    (_, copyIndex) => (
                      <div
                        className="drift-wall__copy"
                        key={`copy-${columnIndex}-${copyIndex}`}
                        ref={
                          copyIndex === 0
                            ? (element) => {
                                copyRefs.current[
                                  columnIndex
                                ] =
                                  element;
                              }
                            : undefined
                        }
                      >
                        {column.map(
                          (
                            item,
                            itemIndex
                          ) =>
                            renderTile(
                              item,
                              copyIndex,
                              itemIndex,
                              columnIndex
                            )
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}