import {
  type PricingPackage,
  type PricingService,
  pricingHref,
  pricingServices,
} from "./pricing-draft";

/** Every label of the services page; each market has its own. */
export type PricingCopy = {
  eyebrow: string;
  /** The hub's title: plain part, accent part. */
  hubTitle: [string, string];
  /** The accent part of a service page's title, after the service name. */
  tabTitle: string;
  lead: string;
  tabsLabel: string;
  examples: string;
  galleryTitle: string;
  galleryHint: string;
  benefits: string;
  needsLabel: string;
  needsTail: string;
  tech: string;
  packages: string;
  popular: string;
  order: string;
  everywhereLabel: string;
  detailLink: string;
  closing: { eyebrow: string; title: string; cta: string };
};

/** What the shared services page renders for one market. */
export type PricingCatalog = {
  services: PricingService[];
  href: (id: string) => string;
  copy: PricingCopy;
  /** Where "Order" leads when the market has no order dialog. */
  orderHref?: (service: PricingService, pack: PricingPackage) => string;
  /** The animation gallery's captions, in tile order. */
  galleryCaptions?: { title: string; text: string }[];
  jsonLd: {
    areaServed: string;
    currency: string;
    homeLabel: string;
    hubLabel: string;
    hubPath: string;
    /** ludvik4.ru's URLs end in a slash, ludvik4.dev's do not. */
    trailingSlash: boolean;
  };
};

export const ruPricingCatalog: PricingCatalog = {
  services: pricingServices,
  href: pricingHref,
  copy: {
    eyebrow: "Услуги и цены",
    hubTitle: ["Что мы делаем — ", "и сколько это стоит."],
    tabTitle: "пакеты и цены.",
    lead: "Цену и сроки фиксируем в договоре до начала работы — вы заранее знаете, сколько заплатите и что получите. Выберите услугу, чтобы сравнить пакеты.",
    tabsLabel: "Услуги",
    examples: "Например",
    galleryTitle: "Потрогайте сами",
    galleryHint:
      "Наведите курсор или коснитесь — анимации отвечают на ваши движения.",
    benefits: "Что вы получаете",
    needsLabel: "От вас",
    needsTail: "Остальное — на нас.",
    tech: "Под капотом",
    packages: "Пакеты",
    popular: "Чаще выбирают",
    order: "Заказать",
    everywhereLabel: "Во всех пакетах:",
    detailLink: "Подробнее об услуге →",
    closing: {
      eyebrow: "Не нашли свою задачу?",
      title: "Расскажите идею — оценим.",
      cta: "Обсудить проект",
    },
  },
  jsonLd: {
    areaServed: "RU",
    currency: "RUB",
    homeLabel: "Главная",
    hubLabel: "Услуги",
    hubPath: "/uslugi",
    trailingSlash: true,
  },
};
