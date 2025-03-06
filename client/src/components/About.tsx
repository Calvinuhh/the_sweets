import { useEffect } from "react";
import InstagramPost from "./InstagramPost";

const About = () => {
  useEffect(() => {
    const loadInstagramScript = () => {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      };
      document.body.appendChild(script);

      return script;
    };

    const script = loadInstagramScript();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const posts = [
    {
      code: "CIf_XsAnvqr",
      text: "Texto 1",
      parrafo:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem consequuntur id excepturi quisquam ipsum. Doloribus fugiat laudantium eius amet ipsa, dignissimos perferendis eum minus tempora. Nemo nulla aut quasi recusandae? Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      code: "CGxnEtrH-de",
      text: "Texto 2",
      parrafo:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem consequuntur id excepturi quisquam ipsum. Doloribus fugiat laudantium eius amet ipsa, dignissimos perferendis eum minus tempora. Nemo nulla aut quasi recusandae? Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      code: "CKKtXNNnzQP",
      text: "Texto 3",
      parrafo:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem consequuntur id excepturi quisquam ipsum. Doloribus fugiat laudantium eius amet ipsa, dignissimos perferendis eum minus tempora. Nemo nulla aut quasi recusandae? Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      code: "CBn1HXClsG9",
      text: "Texto 4",
      parrafo:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem consequuntur id excepturi quisquam ipsum. Doloribus fugiat laudantium eius amet ipsa, dignissimos perferendis eum minus tempora. Nemo nulla aut quasi recusandae? Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 p-6 font-lato">
      {posts.map((post, index) => (
        <div
          key={post.code}
          className={`bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full my-4 flex ${
            index % 2 === 0 ? "flex-row" : "flex-row-reverse"
          } items-center justify-between`}
        >
          <div className="flex-1">
            <InstagramPost code={post.code} />
          </div>

          <div className="flex-1 p-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              {post.text}
            </h3>
            <p className="text-gray-600 mt-2">{post.parrafo}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default About;
