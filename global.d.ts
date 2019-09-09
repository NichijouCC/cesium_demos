// declare module "Cesium" {
//     // export =Cesium;
//     type TypedArray = Float64Array | Float32Array | Int32Array | Int16Array;
//     export interface Cesium3DTileset {
//         constructor(Cesium3DTilesetItem: {
//             url: string;
//             maximumScreenSpaceError: number;
//             maximumNumberOfLoadedTiles: number;
//             shadows?: any;
//         })
//     }
//     // export interface Geometry {
//     //     constructor(options: { attributes: GeometryAttributes; primitiveType?: PrimitiveType; indices?: Uint16Array | Uint32Array; boundingSphere?: BoundingSphere });
//     // }
//     export interface GeometryAttribute {
//         constructor(options?: { componentDatatype?: Cesium.ComponentDatatype; componentsPerAttribute?: number; normalize?: boolean; values?: number[] | TypedArray });

//         xxxx(): void;
//     }
// }