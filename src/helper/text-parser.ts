export const parseSotraModelToText = (model: SotraModel) => {
  switch (model) {
    case 'ctranslate':
      return 'DE ctranslate'
    case 'fairseq':
      return 'DE lmu_fairseq'
    case 'passthrough':
      return 'HSB passthrough'
  }
}
