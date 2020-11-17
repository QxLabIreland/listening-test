import {BasicExampleModel, BasicFileModel, BasicTaskItemModel, BasicTaskModel} from "./BasicTaskModel";

export interface ImageTestModel extends BasicTaskModel{
  items: ImageTestItemModel[];
}

export interface ImageTestItemModel extends BasicTaskItemModel {
  example?: ImageExampleModel;
}

export interface ImageExampleModel extends BasicExampleModel {
  medias: ImageFileModel[];
  // The answer is the value of audio
  mediaRef?: ImageFileModel;
  settings?: ImageExampleSettingsModel
}

export interface ImageExampleSettingsModel {
  isHorizontalDisplay?: boolean
}

export interface ImageFileModel extends BasicFileModel{

}
