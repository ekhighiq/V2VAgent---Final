"use client";

import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AppConfig = {
  title: string;
  settings: UserSettings;
  show_qr?: boolean;
};

export type UserSettings = {
  chat: boolean;
  inputs: {
    mic: boolean;
  };
  outputs: {
    audio: boolean;
  };
  ws_url: string;
  token: string;
  room_name: string;
  participant_name: string;
};

// Fallback if NEXT_PUBLIC_APP_CONFIG is not set
const defaultConfig: AppConfig = {
  title: "HighIQ Voice Assistant",
  settings: {
    chat: true,
    inputs: {
      mic: true,
    },
    outputs: {
      audio: true
    },
    ws_url: "",
    token: "",
    room_name: "",
    participant_name: "",
  },
  show_qr: false,
};

const useAppConfig = (): AppConfig => {
  return useMemo(() => {
    return defaultConfig;
  }, []);
};

type ConfigData = {
  config: AppConfig;
  setUserSettings: (settings: UserSettings) => void;
};

const ConfigContext = createContext<ConfigData | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const appConfig = useAppConfig();
  const router = useRouter();
  const [localColorOverride, setLocalColorOverride] = useState<string | null>(
    null
  );

  const getSettingsFromUrl = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }
    if (!window.location.hash) {
      return null;
    }
    const appConfigFromSettings = appConfig;
    
    const params = new URLSearchParams(window.location.hash.replace("#", ""));
    return {
      chat: params.get("chat") === "1",
      inputs: {
        mic: params.get("mic") === "1",
      },
      outputs: {
        audio: params.get("audio") === "1",
        chat: params.get("chat") === "1",
      },
      ws_url: "",
      token: "",
      room_name: "",
      participant_name: "",
    } as UserSettings;
  }, [appConfig]);

  const getSettingsFromCookies = useCallback(() => {
    const appConfigFromSettings = appConfig;
  
    const jsonSettings = getCookie("hi_settings");
    if (!jsonSettings) {
      return null;
    }
    return JSON.parse(jsonSettings) as UserSettings;
  }, [appConfig]);

  const setUrlSettings = useCallback(
    (us: UserSettings) => {
      const obj = new URLSearchParams({
        mic: boolToString(us.inputs.mic),
        audio: boolToString(us.outputs.audio),
        chat: boolToString(us.chat),
      });
      // Note: We don't set ws_url and token to the URL on purpose
      router.replace("/#" + obj.toString());
    },
    [router]
  );

  const setCookieSettings = useCallback((us: UserSettings) => {
    const json = JSON.stringify(us);
    setCookie("hi_settings", json);
  }, []);

  const getConfig = useCallback(() => {
    const appConfigFromSettings = appConfig;

    const cookieSettigs = getSettingsFromCookies();
    const urlSettings = getSettingsFromUrl();
    if (!cookieSettigs) {
      if (urlSettings) {
        setCookieSettings(urlSettings);
      }
    }
    if (!urlSettings) {
      if (cookieSettigs) {
        setUrlSettings(cookieSettigs);
      }
    }
    const newCookieSettings = getSettingsFromCookies();
    if (!newCookieSettings) {
      return appConfigFromSettings;
    }
    appConfigFromSettings.settings = newCookieSettings;
    return { ...appConfigFromSettings };
  }, [
    appConfig,
    getSettingsFromCookies,
    getSettingsFromUrl,
    localColorOverride,
    setCookieSettings,
    setUrlSettings,
  ]);

  const setUserSettings = useCallback(
    (settings: UserSettings) => {
      const appConfigFromSettings = appConfig;
      setUrlSettings(settings);
      setCookieSettings(settings);
      _setConfig((prev) => {
        return {
          ...prev,
          settings: settings,
        };
      });
    },
    [appConfig, setCookieSettings, setUrlSettings]
  );

  const [config, _setConfig] = useState<AppConfig>(getConfig());

  // Run things client side because we use cookies
  useEffect(() => {
    _setConfig(getConfig());
  }, [getConfig]);

  return (
    <ConfigContext.Provider value={{ config, setUserSettings }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = React.useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

const boolToString = (b: boolean) => (b ? "1" : "0");
