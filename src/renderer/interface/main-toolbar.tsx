import "@/styles/ui.css";
import { FunctionalComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

export const toolbarRoutes = [
  { name: "Geography", options: ["Terrain Editor", "System Directory"] },
  { name: "Civilization", options: ["Nations", "Species", "Diplomacy & Warfare"] },
  { name: "Transportation", options: ["Routes"] },
  { name: "Cartography", options: ["Measurement"] },
];

// TODO: UI needs to get cleaned up
export const MainToolbar: FunctionalComponent<{}> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const buttonsRef = useRef<Record<string, HTMLButtonElement | null>>({});

  const [showOptions, setShowMainOptions] = useState<boolean>(false);
  const [selectedMain, setSelectedMain] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const onClickToggle = (e: MouseEvent) => {
    setShowMainOptions((oldShow) => !oldShow);

    e.preventDefault();
    toggleRef.current?.blur();
  };

  const onClickMainOption = (route: string, e: MouseEvent) => {
    setSelectedMain((oldRoute) => {
      if (route === oldRoute) {
        setSelectedSub(null);
        return null;
      }
      return route;
    });

    e.preventDefault();
    buttonsRef.current[route]?.blur();
  };

  const onClickSubOption = (route: string, subRoute: string, e: MouseEvent) => {
    setSelectedSub((oldRoute) => {
      if (subRoute === oldRoute) return null;
      return subRoute;
    });

    e.preventDefault();
    buttonsRef.current[subRoute]?.blur();
  };

  // TOOD: make into a hook
  useEffect(() => {
    const handleClick = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowMainOptions(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  console.log(showOptions, selectedMain);

  return (
    <div ref={ref} id="main-toolbar">
      <button
        ref={toggleRef}
        id="main-toolbar-toggle"
        className="fancy small"
        onClick={onClickToggle}
      >
        {showOptions ? `\u276E` : `\u276F`}
      </button>
      <div id="toolbar-container" className={showOptions ? "flex-col" : "flex-row"}>
        <div id="inner-toolbar">
          {toolbarRoutes.map(
            (x) =>
              (showOptions || x.name === selectedMain) && (
                <button
                  ref={(el) => (buttonsRef.current[x.name] = el)}
                  key={x.name}
                  className={`fancy small ${selectedMain === x.name ? "selected" : ""}`}
                  onClick={(e) => onClickMainOption(x.name, e)}
                >
                  {x.name}
                </button>
              )
          )}
        </div>
        {toolbarRoutes.map(
          (main) =>
            main.name === selectedMain && (
              <div className="sub-toolbar">
                {main.options.map(
                  (sub) =>
                    (showOptions || sub === selectedSub) && (
                      <button
                        ref={(el) => (buttonsRef.current[sub] = el)}
                        key={sub}
                        className={`fancy small ${selectedSub === sub ? "selected" : ""}`}
                        onClick={(e) => onClickSubOption(main.name, sub, e)}
                      >
                        {sub}
                      </button>
                    )
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default MainToolbar;
