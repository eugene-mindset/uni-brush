import { FunctionalComponent } from "preact";

import MainMenu from "./main-menu";
import { StarSystemEditor } from "./star-system-editor";
import { StarSystemDirectory } from "./star-system-directory";

export const FullInterface: FunctionalComponent<{}> = ({}) => {
  // const showStarSystemEditor = computed(() => {
  //   return mainView.pointer.intersect.ref.value?.type === EntityTypes.STAR_SYSTEM;
  // })
  // ;

  console.log("render full interface");
  return (
    <>
      <MainMenu />
      {/* <div className="panels" hidden>
        <StarSystemEditor />
        <StarSystemDirectory />
      </div> */}
    </>
  );
};

export default FullInterface;
