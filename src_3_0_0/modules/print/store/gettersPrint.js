import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import statePrint from "./statePrint";

const getters = {
    ...generateSimpleGetters(statePrint),

    /**
     * Provides state for urlParams.
     * @param {Object} state state of the app-store.
     * @returns {Object} state for urlParams
     */
    urlParams: state => {
        const params = {
            autoAdjustScale: state.autoAdjustScale,
            isScaleSelectedManually: state.isScaleSelectedManually,
            currentFormat: state.currentFormat,
            currentLayoutName: state.currentLayoutName,
            currentScale: state.currentScale,
            currentScaleUrlParams: state.currentScale,
            dpiForPdf: state.dpiForPdf,
            title: state.title,
            isGfiSelected: state.isGfiSelected,
            isLegendSelected: state.isLegendSelected
        };

        return params;
    }
};

export default getters;
