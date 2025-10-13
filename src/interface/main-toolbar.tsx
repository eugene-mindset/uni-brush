import { FunctionalComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import "@/styles/ui.css";
import { SVGIcons } from "@/components";

interface Props {
  routes: { name: string; options: string[] }[];
  path?: [string, string];
  onPathSelected?: (path: [string, string]) => void;
}

// TODO: UI needs to get cleaned up
export const MainToolbar: FunctionalComponent<Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const buttonsRef = useRef<Record<string, HTMLButtonElement | null>>({});

  const [showOptions, setShowMainOptions] = useState<boolean>(false);
  const [selectedMain, setSelectedMain] = useState<string>(props?.path ? props.path[0] : "");
  const [selectedSub, setSelectedSub] = useState<string>(props?.path ? props.path[1] : "");

  const updateSelectedRoute = (route: string, subRoute: string) => {
    const oldRoute = selectedMain;
    const oldSubRoute = selectedSub;

    if (oldRoute === route && oldSubRoute === subRoute) {
      if (oldRoute !== "" && oldSubRoute === "") {
        setSelectedMain("");
      } else {
        setSelectedSub("");
      }
    } else if (oldRoute === route) {
      if (subRoute == "") {
        setSelectedMain("");
      } else {
        setSelectedSub(subRoute);
      }
    } else {
      setSelectedMain(route);
      setSelectedSub(subRoute);
    }
  };

  const onClickToggle = (e: MouseEvent) => {
    setShowMainOptions((oldShow) => !oldShow);
    e.preventDefault();
  };

  const onClickOption = (route: string, subRoute: string, e: MouseEvent) => {
    updateSelectedRoute(route, subRoute);

    e.preventDefault();
    buttonsRef.current[route]?.blur();
    buttonsRef.current[subRoute]?.blur();
  };

  useEffect(() => {
    // update selected route when it changes
    const out: [string, string] = [selectedMain || "", selectedSub || ""];
    props?.onPathSelected && props.onPathSelected(out);
  }, [selectedMain, selectedSub]);

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

  return (
    <div ref={ref} id="main-toolbar">
      <button
        ref={toggleRef}
        id="main-toolbar-toggle"
        className="core small square"
        onClick={onClickToggle}
      >
        {showOptions ? <SVGIcons.CaretLeftFill /> : <SVGIcons.CaretRightFill />}
      </button>
      <div id="toolbar-container" className={showOptions ? "flex-col" : "flex-row"}>
        <div id="inner-toolbar">
          {props.routes.map(
            (x) =>
              (showOptions || x.name === selectedMain) && (
                <button
                  ref={(el) => (buttonsRef.current[x.name] = el)}
                  key={x.name}
                  className={`core small ${selectedMain === x.name ? "selected" : ""}`}
                  onClick={(e) => onClickOption(x.name, "", e)}
                >
                  {x.name}
                </button>
              )
          )}
        </div>
        {props.routes.map(
          (main) =>
            main.name === selectedMain && (
              <div className="sub-toolbar">
                {main.options.map(
                  (sub) =>
                    (showOptions || sub === selectedSub) && (
                      <button
                        ref={(el) => (buttonsRef.current[sub] = el)}
                        key={sub}
                        className={`core small ${selectedSub === sub ? "selected" : ""}`}
                        onClick={(e) => onClickOption(main.name, sub, e)}
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
