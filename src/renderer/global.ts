export namespace Global {
  export namespace Layers {
    export const BASE_LAYER = 0;
    export const BLOOM_LAYER = 1;
    export const OVERLAY_LAYER = 2;
    export const DEBUG_LAYER = 30;
  }
}

export const BLOOM_PARAMS = {
  exposure: 1,
  bloomStrength: 1,
  bloomThreshold: 0.4,
  bloomRadius: 0.1,
};
