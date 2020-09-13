module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    // vant按需引入配置
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ]
}
