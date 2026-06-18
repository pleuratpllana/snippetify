export default {
  theme: {
    extend: {
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      keyframes: {
        meshMove: {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 100%" },
        },
      },
      animation: {
        meshMove: "meshMove 60s linear infinite",
      },
      backgroundImage: {
        "mesh-gradient":
          "linear-gradient(135deg, #f7fdea 0%, #eafec8 25%, #dfffb3 50%, #eafec8 75%, #f7fdea 100%)",
      },

      backgroundSize: {
        "400p": "400% 400%",
      },
    },
  },
  plugins: [],
};
