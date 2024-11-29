import janna from '@jannajs/lint/eslint'

export default janna({
  tailwind: true,
  settings: {
    tailwindcss: {
      config: 'tailwind.config.ts',
      tags: ['cls', 'tw'],
    },
  },
}, {
  rules: {
    'style/jsx-indent': ['off'],
    'toml/array-bracket-newline': ['off'],
    'toml/array-bracket-spacing': ['error', 'never', { objectsInArrays: true }],
  },
})
