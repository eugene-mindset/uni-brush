import { FunctionalComponent } from "preact";

import AppMenu from "./app-menu";
import { StarSystemEditor } from "./star-system-editor";
import { StarSystemDirectory } from "./star-system-directory";
import MainToolbar from "./main-toolbar";

export const FullInterface: FunctionalComponent<{}> = ({}) => {
  // const showStarSystemEditor = computed(() => {
  //   return mainView.pointer.intersect.ref.value?.type === EntityTypes.STAR_SYSTEM;
  // })
  // ;

  console.log("render full interface");
  return (
    <>
      <AppMenu />
      <MainToolbar />
      {/* <div className="panels" hidden>
        <StarSystemEditor />
        <StarSystemDirectory />
      </div> */}
    </>
  );
};

export default FullInterface;
