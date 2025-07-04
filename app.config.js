export default ({ config }) => {
  const isDev = process.env.EAS_BUILD_PROFILE === "development";
  return {
    ...config,
    name: isDev ? "Dew Point Helper (Dev)" : "Dew Point Helper",
    displayName: isDev ? "Dew Point Helper Dev" : "Dew Point Helper",
    icon: "./assets/icon.png",
    extra: {
      eas: {
        projectId: "1cc2a678-1fdd-4696-93b8-9661bd1dbe35",
      },
    },
    ios: {
      bundleIdentifier: "com.ruders.dewpointhelper",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.ruders.dewpointhelper",
    },
  };
};
