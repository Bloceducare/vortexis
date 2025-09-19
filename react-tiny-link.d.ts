declare module "react-tiny-link" {
    import * as React from "react";
  
    export interface ReactTinyLinkProps {
      cardSize?: "small" | "large";
      showGraphic?: boolean;
      maxLine?: number;
      minLine?: number;
      url: string;
    }
  
    export class ReactTinyLink extends React.Component<ReactTinyLinkProps> {}
  }
  