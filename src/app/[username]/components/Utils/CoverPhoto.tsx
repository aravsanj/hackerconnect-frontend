
type Props = {
  url: string | undefined;
};

const CoverPhoto = ({ url }: Props) => {
  return (
    <>
      <div
        className="h-[50%] rounded-tl-xl rounded-tr-xl relative bg-cover bg-center"
        style={{ backgroundImage: `url(${url})` }}
      ></div>
    </>
  );
};

export default CoverPhoto;
