// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appUrl: 'http://localhost:4200/',
  // apiBaseUrl: 'https://localhost:44321/api/',
  // apiBaseUrl: 'https://dev-hrms-api.openspacetech.in/api/',
  // filePath: 'https://dev-hrms-api.openspacetech.in/hrms/',
  logoFolder: 'hrms/logo/',

  primaryUrl: '172.20.243.129:83',
  primaryApiUrl: 'http://172.20.243.129:84/api/',
  primaryFileUrl: 'http://172.20.243.129:84/hrms/',

  secondaryUrl: '180.179.248.140:8083',
  secondaryApiUrl: 'http://180.179.248.140:8084/api/',
  secondaryFileUrl: 'http://180.179.248.140:8084/hrms/',

  localUrl: 'localhost',
  localApiUrl: 'https://dev-hrms-api.openspacetech.in/api/',
  localFileUrl: 'https://dev-hrms-api.openspacetech.in/hrms/',

  testUrl: '172.20.243.148:81',
  testApiUrl: 'http://172.20.243.148:82/api/',
  testFileUrl: 'http://172.20.243.148:82/hrms/',

  storageEncryption: {
    encrypt: true,
    key: 'q1w2e3r4t5y6'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
