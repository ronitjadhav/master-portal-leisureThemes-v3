import {expect} from "chai";
import sinon from "sinon";
import TileSetLayer, {lastUpdatedSymbol, hiddenObjects} from "../../tileset";
import store from "../../../../app-store";

describe("src/core/layers/tileset.js", () => {
    let attributes, map3D, cesium3DTilesetSpy;

    before(() => {
        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D",
            addInteraction: sinon.stub(),
            removeInteraction: sinon.stub(),
            addLayer: () => sinon.stub(),
            getView: () => {
                return {
                    getResolutions: () => [2000, 1000]
                };
            }
        };

        map3D = {
            id: "1",
            mode: "3D",
            getCesiumScene: () => {
                return {
                    primitives: {
                        show: true,
                        contains: () => true,
                        add: sinon.stub()
                    }
                };
            }
        };
        mapCollection.addMap(map, "2D");
        mapCollection.addMap(map3D, "3D");
    });
    beforeEach(() => {
        global.Cesium = {};
        global.Cesium.Cesium3DTileset = () => { /* no content*/ };
        attributes = {
            id: "4002",
            name: "GebÃ¤ude LoD2",
            url: "https://geoportal-hamburg.de/gdi3d/datasource-data/LoD2",
            typ: "TileSet3D",
            cesium3DTilesetOptions: {
                maximumScreenSpaceError: 6
            },
            isSelected: false
        };
        cesium3DTilesetSpy = sinon.spy(global.Cesium, "Cesium3DTileset");
        store.state.Maps.mode = "3D";
        store.getters = {
            "Maps/mode": store.state.Maps.mode
        };
    });

    afterEach(() => {
        sinon.restore();
        global.Cesium = null;
        store.state.Maps.mode = "2D";
    });

    /**
     * Checks the layer for attributes content.
     * @param {Object} layer the layer
     * @param {Object} tilesetLayer the tilesetLayer
     * @param {Object} attrs the attributes
     * @returns {void}
     */
    function checkLayer (layer, tilesetLayer, attrs) {
        expect(layer).not.to.be.undefined;
        expect(tilesetLayer.get("name")).to.be.equals(attrs.name);
        expect(tilesetLayer.get("id")).to.be.equals(attrs.id);
        expect(tilesetLayer.get("typ")).to.be.equals(attrs.typ);
        expect(layer.tileset.layerReferenceId).to.be.equals(attrs.id);
    }

    it("setVisible shall call setIsSelected", function () {
        const tilesetLayer = new TileSetLayer(attributes),
            layer = tilesetLayer.get("layer"),
            setIsSelectedSpy = sinon.spy(TileSetLayer.prototype, "setIsSelected");

        tilesetLayer.setVisible(true);
        checkLayer(layer, tilesetLayer, attributes);
        expect(setIsSelectedSpy.calledOnce).to.equal(true);
        expect(setIsSelectedSpy.calledWithMatch(true)).to.equal(true);
    });
    describe("styleContent", function () {
        it("should set lastUpdatedSymbol on the content on first call", function () {
            const tilesetLayer = new TileSetLayer(attributes),
                content = sinon.spy();

            expect(content[lastUpdatedSymbol]).to.be.undefined;
            tilesetLayer.styleContent(content);
            expect(content[lastUpdatedSymbol]).to.not.be.undefined;
        });
    });
    describe("hideObjects", function () {
        it("add the id to the hiddenObjects and create an empty Set", function () {
            const tilesetLayer = new TileSetLayer(attributes);

            tilesetLayer.hideObjects(["id"]);
            expect(hiddenObjects.id).to.be.an.instanceOf(Set);
        });
    });
    describe("showObjects", function () {
        it("should remove the id from the hiddenObjects List", function () {
            const tilesetLayer = new TileSetLayer(attributes);

            tilesetLayer.hideObjects(["id"]);
            expect(hiddenObjects.id).to.be.an.instanceOf(Set);
            tilesetLayer.showObjects(["id"]);
            expect(hiddenObjects.id).to.be.undefined;
        });
    });
    it("setIsSelected true shall create cesiumtilesetProvider", function () {
        const tilesetLayer = new TileSetLayer(attributes),
            layer = tilesetLayer.get("layer");

        tilesetLayer.setIsSelected(true);
        checkLayer(layer, tilesetLayer, attributes);
        expect(layer.tileset.show).to.be.true;
        expect(cesium3DTilesetSpy.calledOnce).to.equal(true);
        expect(cesium3DTilesetSpy.calledWithMatch({maximumScreenSpaceError: 6})).to.equal(true);
    });
    it("setIsSelected false shall create ellipsoidtilesetProvider", function () {
        const tilesetLayer = new TileSetLayer(attributes),
            layer = tilesetLayer.get("layer");

        tilesetLayer.setIsSelected(false);
        checkLayer(layer, tilesetLayer, attributes);
        expect(layer.tileset.show).to.be.false;
    });
    it("setIsVisibleInMap to true shall set isVisibleInMap", function () {
        const tilesetLayer = new TileSetLayer(attributes),
            layer = tilesetLayer.get("layer");

        tilesetLayer.setIsVisibleInMap(true);
        checkLayer(layer, tilesetLayer, attributes);
        expect(tilesetLayer.get("isVisibleInMap")).to.equal(true);
        expect(cesium3DTilesetSpy.calledOnce).to.equal(true);
        expect(cesium3DTilesetSpy.calledWithMatch({maximumScreenSpaceError: 6})).to.equal(true);
    });
    it("setIsVisibleInMap to false shall set isVisibleInMap and hide layer", function () {
        const tilesetLayer = new TileSetLayer(attributes),
            layer = tilesetLayer.get("layer");

        checkLayer(layer, tilesetLayer, attributes);
        tilesetLayer.setIsVisibleInMap(false);
        expect(tilesetLayer.get("isVisibleInMap")).to.equal(false);
        expect(layer.tileset.show).to.be.false;
    });
});
