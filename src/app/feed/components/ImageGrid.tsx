import React from "react";
import { Image } from "antd";

type Props = {
  imageURLs: string[];
};

export const ImageGrid = ({ imageURLs }: Props) => {
  return (
    <div className="mt-2">
      <Image.PreviewGroup
        preview={{
          onChange: (current, prev) =>
            console.log(`current index: ${current}, prev index: ${prev}`),
        }}
      >
        <div className="mr-6 inline">
          <Image width="100%" height="auto" alt="imageURL" src={imageURLs[0]} />
        </div>
        {imageURLs.slice(1)?.map((imageURL) => {
          return (
            <div key={imageURL} className="mr-6 inline">
              <Image width="100px" height="auto"  alt="imageURL" src={imageURL} />
            </div>
          );
        })}
      </Image.PreviewGroup>
    </div>
  );
};

export default ImageGrid;
