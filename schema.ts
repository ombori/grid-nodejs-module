export type Settings = { enabled: false } | {
  /**
   * @title Enabled
   */
  enabled: true;

  /**
   * @title A test setting
   * @default "Default value"
   */
  test_setting: string;

  // TODO: add your settings here
}
