import { useEffect } from "react";
import InstagramPost from "./InstagramPost";

const About = () => {
  useEffect(() => {
    // Función para cargar el script de Instagram
    const loadInstagramScript = () => {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => {
        // Forzar la renderización de los embeds después de cargar el script
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      };
      document.body.appendChild(script);

      return script;
    };

    // Cargar el script
    const script = loadInstagramScript();

    // Limpiar el script cuando el componente se desmonte
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Array de códigos de publicaciones de Instagram
  const posts = [
    { code: "CIf_XsAnvqr", text: "Texto 1" },
    { code: "CGxnEtrH-de", text: "Texto 2" },
    { code: "CKKtXNNnzQP", text: "Texto 3" },
    { code: "CBn1HXClsG9", text: "Texto 4" },
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
          {/* Contenedor de Instagram */}
          <div className="flex-1">
            <InstagramPost code={post.code} />
          </div>

          {/* Contenedor de texto */}
          <div className="flex-1 p-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              {post.text}
            </h3>
            <p className="text-gray-600 mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              consequuntur id excepturi quisquam ipsum. Doloribus fugiat
              laudantium eius amet ipsa, dignissimos perferendis eum minus
              tempora. Nemo nulla aut quasi recusandae? Lorem ipsum dolor sit
              amet consectetur adipisicing elit.
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default About;
