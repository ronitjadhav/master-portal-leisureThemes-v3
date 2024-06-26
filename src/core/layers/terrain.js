import store from "../../app-store";
import {terrain} from "@masterportal/masterportalapi/src";
import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList";
import createStyle from "@masterportal/masterportalapi/src/vectorStyle/createStyle";
import getProxyUrl from "../../../src/utils/getProxyUrl";
import * as bridge from "./RadioBridge.js";
import Layer from "./layer";
/**
 * Creates a terrain-layer to display on 3D-map.
 * @param {Object} attrs  attributes of the layer
 * @returns {void}
 */
export default function TerrainLayer (attrs) {
    const defaults = {
        supported: ["3D"],
        showSettings: false,
        selectionIDX: -1,
        useProxy: false,
        legend: false
    };

    /**
     * @deprecated in the next major-release!
     * useProxy
     * getProxyUrl()
     */
    if (attrs.useProxy) {
        attrs.url = getProxyUrl(this.get("url"));
    }

    this.createLayer(Object.assign(defaults, attrs));
    // call the super-layer
    Layer.call(this, Object.assign(defaults, attrs), this.layer, !attrs.isChildLayer);

    store.watch((state, getters) => getters["Maps/mode"], mode => {
        if (mode === "3D") {
            this.setIsSelected(this.get("isVisibleInMap"));
        }
    });
}

/**
 * Calls the function setIsSelected.
 * @param {boolean} newValue if true, layer is selected
 * @returns {void}
 */
TerrainLayer.prototype.setVisible = function (newValue) {
    this.setIsSelected(newValue);
};

/**
 * Calls masterportalAPI's terrain-layer to set this layer visible.
 * @param {Boolean} newValue if true, layer is visible
 * @param {Object} attr the attributes for the layer
 * @returns {void}
 */
TerrainLayer.prototype.setIsSelected = function (newValue, attr) {
    const map = mapCollection.getMap(store.getters["Maps/mode"]),
        treeType = store.getters.treeType;

    if (map && map.mode === "3D") {
        let isVisibleInMap = this.attributes ? this.get("isVisibleInMap") : false;

        if (!this.attributes && attr) {
            isVisibleInMap = attr.isVisibleInMap;
            attr.isSelected = newValue;
            // terrain.setVisible(newValue, this.attributes ? this.attributes : attr, map);
        }
        else {
            this.attributes.isSelected = newValue;
            this.setIsVisibleInMap(newValue);
        }
        if (isVisibleInMap) {
            // this.createLegend();
        }
        if (treeType !== "light" || store.state.mobile) {
            bridge.updateLayerView(this);
            bridge.renderMenu();

        }
    }
};
/**
 * Setter for isVisibleInMap and setter for layer.setVisible
 * @param {Boolean} newValue Flag if layer is visible in map
 * @returns {void}
 */
TerrainLayer.prototype.setIsVisibleInMap = function (newValue) {
    const lastValue = this.get("isVisibleInMap"),
        map = mapCollection.getMap(store.getters["Maps/mode"]);

    this.set("isVisibleInMap", newValue);
    if (map && map.mode === "3D") {
        terrain.setVisible(newValue, this.attributes, map);
    }
    if (lastValue !== newValue) {
        // here it is possible to change the layer visibility-info in state and listen to it e.g. in LegendWindow
        // e.g. store.dispatch("Map/toggleLayerVisibility", {layerId: this.get("id")});
        bridge.layerVisibilityChanged(this, this.get("isVisibleInMap"));
    }
};


/**
* Register interaction with map view. Listens to change of scale.
* @returns {void}
*/
TerrainLayer.prototype.registerInteractionMapViewListeners = function () {
    // no listeners shall be registered
};
/**
 * Transforms transparency into opacity and sets opacity on layer.
 * @return {void}
 */
TerrainLayer.prototype.updateLayerTransparency = function () {
    // not needed in 3D
};
/**
 * Sets visible min and max resolution on layer.
 * @returns {void}
 */
TerrainLayer.prototype.setMinMaxResolutions = function () {
    // not needed in 3D
};
/**
 * Checks whether the layer is visible or not based on the scale.
 * @param {object} options - of the map, contains scale of the map
 * @returns {void}
 **/
TerrainLayer.prototype.checkForScale = function () {
    // not needed in 3D
};
/**
 * Setter for transparency and setter for opacitiy of the layer.
 * @param {Number} newValue Tranparency in percent
 * @returns {void}
 */
TerrainLayer.prototype.setTransparency = function () {
    // not needed in 3D
};
