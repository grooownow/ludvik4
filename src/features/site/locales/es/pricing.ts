import {
  enPricingLocaleCopy,
  internationalPricingServices,
  type PricingLocaleCopy,
  type ServiceText,
} from "../../international-pricing";

// TRANSLATION STUB — replaced by the es translation.
export const esPricingTexts: ServiceText[] = internationalPricingServices.map(
  ({ id: _id, slug: _slug, from: _from, packages, ...rest }) => ({
    ...rest,
    packages: packages.map(({ price: _p, oldPrice: _o, ...pack }) => pack),
  }),
);
export const esPricingCopy: PricingLocaleCopy = enPricingLocaleCopy;
