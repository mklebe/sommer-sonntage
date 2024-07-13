import { MATERIAL_TYPE } from "@ts/threejs-utils";

export const ComplexMeshConfig = {
  PlanningSurface: {
    renderInside: false,
    renderOutside: true,
    materialTypeOutside: MATERIAL_TYPE.PHYSICAL,
    colorOutside: "#e0dbd1",
    roughnessOutside: 0.5,
    metalnessOutside: 0,
    reflectivityOutside: 0,
    flatShadingOutside: false,
  },
};
