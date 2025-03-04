const InstagramPost = ({ code }: { code: string }) => {
  return (
    <div className=" flex justify-center items-center">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={`https://www.instagram.com/p/${code}`}
        data-instgrm-version="14"
      ></blockquote>
    </div>
  );
};

export default InstagramPost;
