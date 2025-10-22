import { FunctionComponent } from "preact";

import { Panel } from "@/components";
import { ModelGenerator } from "../../model/base";

interface Props<T extends ModelGenerator<any, any>> {}

export const GeneratorEditor: FunctionComponent<Props<any>> = <T extends ModelGenerator<any, any>>(
  props: Props<T>
) => {
  return <div>Test</div>;
};
