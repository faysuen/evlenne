// Evlenne Pet Identity domain model.
//
// Phase 1 uses session storage in the Studio. This model defines the stable
// shape we can persist when accounts/database storage are connected.
//
// Product templates should reference petIdentity.id + portrait.masterAsset,
// rather than asking a customer to upload the same pet for every SKU.

export const PET_IDENTITY_VERSION = 1;

export function createPetIdentity({
  id,
  name,
  years = "",
  sourcePhoto = "",
  masterPortrait = "",
  engravingPortrait = "",
  pawPrint = null,
  furProfile = null
}) {
  return {
    version: PET_IDENTITY_VERSION,
    id,
    name,
    years,
    status: masterPortrait ? "portrait_ready" : "draft",
    assets: {
      sourcePhoto,
      portrait: {
        master: masterPortrait,
        engraving: engravingPortrait || masterPortrait,
        approved: Boolean(masterPortrait)
      },
      paw: pawPrint,
      fur: furProfile
    },
    personalization: {
      displayName: name,
      years
    }
  };
}

export const PRODUCT_FAMILIES = {
  wear: ["portrait-pendant", "portrait-bracelet", "fur-ring"],
  carry: ["leather-travel-tag", "bag-charm"],
  keep: ["portrait-coin", "paw-keepsake", "fur-keepsake"],
  live: []
};

export function personalizationForProduct(petIdentity, productId) {
  if (!petIdentity?.id) throw new Error("A Pet Identity is required.");
  return {
    petIdentityId: petIdentity.id,
    productId,
    portraitAsset: petIdentity.assets?.portrait?.engraving || "",
    petName: petIdentity.personalization?.displayName || "",
    years: petIdentity.personalization?.years || ""
  };
}
