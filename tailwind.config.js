/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          '100': '#FFE3EC',
          '200': '#FF8CBA',
          '300': '#F364A2',
          '400': '#E8368F',
          '500': '#DA127D',
          '600': '#BC0A6F',
          '700': '#A30664',
          '800': '#870557',
          '900': '#620042',
        }
      }
    }
  },
  variants: {
    borderWidth: ['responsive', 'last'],
    inset: ['responsive']
  },
  plugins: []
}