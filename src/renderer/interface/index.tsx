import { FunctionalComponent } from "preact";

import MainMenu from "./main-menu";
import { StarSystemEditor } from "./star-system-editor";

export const FullInterface: FunctionalComponent<{}> = ({}) => {
  // const showStarSystemEditor = computed(() => {
  //   return mainView.pointer.intersect.ref.value?.type === EntityTypes.STAR_SYSTEM;
  // })
  // ;

  console.log("render full interface");
  return (
    <>
      <MainMenu />
      <StarSystemEditor />
    </>
  );
};

export default FullInterface;
