import { RocketConfig } from "../config/envs/index";
const rcWebhook = require("rocketchat-webhook");
export class RocketLogger {
  /**
   *
   * @param {string} appName
   */
  private _appName: string;
  private _types: string[];
  private _console: any;
  private _format: any;
  constructor(appName: string) {
    /**
     * App name
     * @type {string}
     * @private
     */
    this._appName = "App";
    /**
     * Default type of console log
     * @type {string[]}
     * @private
     */
    this._types = ["error", "warn"];

    /**
     * Just backup of default console
     * @type {Console}
     * @private
     */
    this._console = {};
    /**
     * Format of message. Default is JSON
     * @type {string}
     * @private
     */
    this._format = "json"; // line
    this._appName = appName;
    for (let k in console) {
      this._console[k] = console[k];
    }
  }

  getIpAddress() {
    let // Local ip address that we're trying to calculate
      address: any,
      // Provides a few basic operating-system related utility functions (built-in)
      os = require("os"),
      // Network interfaces
      ifaces = os.networkInterfaces();
    // Iterate over interfaces ...
    for (let dev in ifaces) {
      let iface = ifaces[dev].filter(function(details: {
        family: string;
        internal: boolean;
      }) {
        return details.family === "IPv4" && details.internal === false;
      });
      if (iface.length > 0) {
        address = iface[0].address;
      }
    }
    return address;
  }
  /**
   *
   * @param hookUrl
   * @param {any[]} types
   * @param format
   */
  register(types = []) {
    if (types.length > 0) {
      this._types = types;
    }
    this._registerPrototypes();
  }
  /**
   * Override some method of default console object
   * @private
   */
  _registerPrototypes() {
    if (!RocketConfig.hostUrl || !RocketConfig.token) {
      return;
    }
    let self = this;
    this._types.forEach((type) => {
      if (console[type]) {
        console[type] = self[type].bind(this);
      }
    });
  }
  /**
   *
   * @param message
   * @param params
   * @returns {string}
   * @private
   */
  _serilizeMessage(message: any, params = []) {
    let data = [];
    data.push(message);
    params.forEach(function(p) {
      data.push(p);
    });
    if (this._format === "json") {
      return JSON.stringify(data);
    }
    let lines = [];
    data.forEach(function(d) {
      if (typeof d === "object") {
        if (Array.isArray(d)) {
          d.forEach(function(_d) {
            if (typeof _d === "object") {
              _d = JSON.stringify(_d);
            }
            lines.push("\t" + _d + "\n");
          });
        } else {
          d = JSON.stringify(d);
          lines.push(d);
        }
      } else {
        lines.push(d);
      }
    });
    return lines.join("\n");
  }
  /**
   *
   * @param message
   * @private
   */
  _sendToRocket(message: string, type: string) {
    let ip = this.getIpAddress();
    rcWebhook.sendMessage(
      RocketConfig.hostUrl,
      RocketConfig.token,
      `*[${new Date().toISOString()}] : Log [${type}] from : ${
        this._appName
      } [${ip}]` +
        ":*\n--------------------------------------------\n" +
        message,
    );
  }
  /**
   *
   * @param value
   * @param {string} message
   * @param optionalParams
   */
  assert(value: any, message: any, ...optionalParams: any[]) {}
  /**
   *
   * @param obj
   * @param {NodeJS.InspectOptions} options
   */
  dir(obj: any, options: any) {}
  /**
   *
   * @param message
   * @param optionalParams
   */
  debug(message: any, ...optionalParams: any[]) {
    this._sendToRocket(this._serilizeMessage(message, optionalParams), "DEBUG");
    this._console.debug(message, optionalParams);
  }
  /**
   *
   * @param message
   * @param optionalParams
   */
  error(message: any, ...optionalParams: any[]) {
    this._sendToRocket(this._serilizeMessage(message, optionalParams), "ERROR");
    this._console.error(message, optionalParams);
  }
  /**
   *
   * @param message
   * @param optionalParams
   */
  info(message: any, ...optionalParams: any[]) {
    this._sendToRocket(this._serilizeMessage(message, optionalParams), "INFO");
    this._console.info(message, optionalParams);
  }
  /**
   *
   * @param message
   * @param optionalParams
   */
  log(message: any, ...optionalParams: any[]) {
    this._sendToRocket(this._serilizeMessage(message, optionalParams), "LOG");
    this._console.log(message, optionalParams);
  }
  /**
   *
   * @param {string} label
   */
  time(label: any) {
    this._sendToRocket(label, "TIME");
  }
  /**
   *
   * @param {string} label
   */
  timeEnd(label: any) {
    this._sendToRocket(label, "TIME_END");
  }
  /**
   *
   * @param message
   * @param optionalParams
   */
  trace(message: any, ...optionalParams: any[]) {
    this._sendToRocket(this._serilizeMessage(message, optionalParams), "TRACE");
    this._console.trace(message, optionalParams);
  }
  /**
   *
   * @param message
   * @param optionalParams
   */
  warn(message: any, ...optionalParams: any[]) {
    this._sendToRocket(this._serilizeMessage(message, optionalParams), "WARN");
    this._console.warn(message, optionalParams);
  }
}
// exports.RocketLogger = RocketLogger;
