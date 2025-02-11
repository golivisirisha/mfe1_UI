const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({

  name: 'mainapp',

  exposes: {
    './Dashboard': './src/app/Components/home/home.component.ts',
    './Users' : './src/app/Components/users/users.component.ts',
    './Products' : './src/app/Components/products/products.component.ts',
    './Orders' : './src/app/Components/orders/orders.component.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // Add further packages you don't need at runtime
  ],

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

});
