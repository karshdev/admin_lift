import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily:{
        oxygen:`"Oxygen", sans-serif`,
        ubuntu:`"Ubuntu", sans-serif`,
        public: `"Public Sans", sans-serif`,
        fira: `"Fira Sans", sans-serif`,
        canterall: `"Cantarell", sans-serif`,
      },
      colors:{
        primary:{
          1:"#7367f0"
        },
        secondary:{
          1:"#b4b3b9",
          2:"#acaab1",
          3:"#8d8a94",
          4:"#444050",
          5:"#ff4c51",
        }
      }
    },
  },
  plugins: [],
});
