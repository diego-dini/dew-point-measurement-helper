export default ({ config }) => {
  const isDev = process.env.EAS_BUILD_PROFILE === "development";
  // You should update these values as needed for each new release!
  const version = "0.9.32";
  const buildNumber = "5";
  const versionCode = 5;

  return {
    ...config,
    name: isDev ? "Dew Point Helper (Dev)" : "Dew Point Helper",
    displayName: isDev ? "Dew Point Helper Dev" : "Dew Point Helper",
    icon: "./assets/icon.png",
    version,
    extra: {
      eas: {
        projectId: "1cc2a678-1fdd-4696-93b8-9661bd1dbe35",
      },
    },
    ios: {
      bundleIdentifier: "com.ruders.dewpointhelper",
      buildNumber,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.ruders.dewpointhelper",
      versionCode,
      releaseStatus: "draft",
    },
    description: "Aplicativo para cálculo e monitoramento do ponto de orvalho.", // Descrição curta
    privacy: {
      policyUrl: "",
    },
    categories: ["tools"],
    contact: {
      email: "contato@ruders.com.br",
      website: "https://ruders.com.br",
    },
    screenshots: [],
  };
};
