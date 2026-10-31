import type { Locale } from "@/lib/i18n";

/** Every message the contact form's server side can return, per language. */
export type LeadMessages = {
  nameTooLong: string;
  nameIsLink: string;
  messageTooShort: string;
  messageTooLong: string;
  contactMissing: string;
  contactTooLong: string;
  contactInvalid: string;
  checkFields: string;
  rateLimited: string;
  captchaFailed: string;
  deliveryFailed: string;
};

export const LEAD_MESSAGES: Record<Locale, LeadMessages> = {
  en: {
    nameTooLong: "Name is too long.",
    nameIsLink: "A name cannot be a link.",
    messageTooShort:
      "Tell me a bit more about the task — at least a couple of sentences.",
    messageTooLong: "Too long — please shorten it a bit.",
    contactMissing: "Leave a contact so I can reply.",
    contactTooLong: "Contact is too long.",
    contactInvalid: "Enter an email, a messenger link, or a phone number.",
    checkFields: "Please check the form fields.",
    rateLimited: "Too many requests in a row — wait a minute and try again.",
    captchaFailed:
      "The anti-bot check did not pass. Reload the page and try again.",
    deliveryFailed:
      "Could not send the request. Message me directly on Telegram: t.me/ludvik4work",
  },
  es: {
    nameTooLong: "El nombre es demasiado largo.",
    nameIsLink: "El nombre no puede ser un enlace.",
    messageTooShort:
      "Cuéntanos un poco más sobre el proyecto: con un par de frases basta.",
    messageTooLong: "Es demasiado largo. Acórtalo un poco, por favor.",
    contactMissing: "Déjanos un contacto para poder responderte.",
    contactTooLong: "El contacto es demasiado largo.",
    contactInvalid:
      "Escribe un email, un enlace de mensajería o un número de teléfono.",
    checkFields: "Revisa los campos del formulario.",
    rateLimited:
      "Demasiados envíos seguidos. Espera un minuto y vuelve a intentarlo.",
    captchaFailed:
      "No se ha superado la verificación antibots. Recarga la página y vuelve a intentarlo.",
    deliveryFailed:
      "No se ha podido enviar la solicitud. Escríbenos directamente por Telegram: t.me/ludvik4work",
  },
  ru: {
    nameTooLong: "Слишком длинное имя.",
    nameIsLink: "Имя не может быть ссылкой.",
    messageTooShort:
      "Расскажите о задаче чуть подробнее — хотя бы пару предложений.",
    messageTooLong: "Слишком длинно — сократите, пожалуйста.",
    contactMissing: "Оставьте контакт, чтобы мы могли ответить.",
    contactTooLong: "Слишком длинный контакт.",
    contactInvalid: "Укажите email, ссылку на мессенджер или номер телефона.",
    checkFields: "Проверьте поля формы.",
    rateLimited:
      "Слишком много отправок подряд — подождите минуту и попробуйте снова.",
    captchaFailed:
      "Проверка на бота не прошла. Обновите страницу и попробуйте снова.",
    deliveryFailed:
      "Не удалось отправить заявку. Напишите нам напрямую в Telegram: t.me/ludvik4work",
  },
};
