"use strict";
/*!
 * Copyright (c) 2013-2014 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

var OperationsManager = require("./operations-manager");
var OperationsStack = require("./operations-stack");
var Utils = require("./lib/utils");

/**
 * @class
 * @param {Object} options
 * @param {HTMLElement} [options.container] - Specifies where the UI should be
 *                                          added to. If none is given, the UI
 *                                          will automatically be disabled.
 * @param {Image} options.image - The source image
 */
function ImglyKit(options) {
  // `options` is required
  if (typeof options !== "object") throw new Error("No options given.");
  // `options.image` is required
  if (typeof options.image === "undefined") throw new Error("`options.image` is undefined.");

  /**
   * @type {ImglyKit.OperationsManager}
   */
  this.operations = new OperationsManager(this);

  /**
   * The stack of {@link Operation} instances that will be used
   * to render the final Image
   * @type {ImglyKit.OperationsStack}
   */
  this.operationsStack = new OperationsStack(this);

  this.reset();
}

/**
 * The current version of the SDK
 * @name ImglyKit.version
 * @internal Keep in sync with package.json
 */
ImglyKit.version = "0.0.1";

// Exposed classes
ImglyKit.Operation = require("./operations/operation");
ImglyKit.Operations = {};
ImglyKit.Operations.FiltersOperation = require("./operations/filters-operation");

/**
 * The available render types
 * @enum {string}
 */
ImglyKit.RenderType = {
  IMAGE: "image",
  DATAURL: "data-url"
}

/**
 * The available output image formats
 * @enum {string}
 */
ImglyKit.ImageFormat = {
  PNG: "image/png",
  JPEG: "image/jpeg"
}

/**
 * Registers all default operations
 * @private
 */
ImglyKit.prototype._registerOperations = function () {
  this.operations.register(require("./operations/filters-operation"));
  this.operations.register(require("./operations/rotation-operation"));
  this.operations.register(require("./operations/crop-operation"));
};

/**
 * Renders the image
 * @param  {ImglyKit.RenderType} [renderType=ImglyKit.RenderType.IMAGE] - The output type
 * @param  {ImglyKit.ImageFormat} [imageFormat=ImglyKit.ImageFormat.PNG] - The output image format
 * @param  {string} [dimensions] - The final dimensions of the image
 * @return {Promise}
 */
ImglyKit.prototype.render = function(renderType, imageFormat, dimensions) {
  if (typeof renderType !== "undefined" &&
    Utils.objectValues(ImglyKit.RenderType).indexOf(renderType) === -1) {
    throw new Error("Invalid render type: " + renderType);
  }

  if (typeof imageFormat !== "undefined" &&
    Utils.objectValues(ImglyKit.ImageFormat).indexOf(imageFormat) === -1) {
    throw new Error("Invalid image format: " + imageFormat);
  }
};

/**
 * Resets all custom and selected operations
 */
ImglyKit.prototype.reset = function () {
  this.operations.reset();
  this._registerOperations();
};

module.exports = ImglyKit;
