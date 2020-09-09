import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import {FunctionComponent, ReactNode} from "react";

/** The purpose of this file is to simplify the code, because there are lots of places using this type and props */
export type TestItemExampleCardProps = {
  example: ItemExampleModel, title: ReactNode, action: ReactNode, collapsed?: boolean
}
export type TestItemExampleCardType = FunctionComponent<TestItemExampleCardProps>
