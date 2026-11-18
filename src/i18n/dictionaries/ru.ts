export const ru = {
  'error.notFound': 'Страница не найдена',
  'error.description': 'Проверьте адрес или перейдите на главную страницу.',
  'nav.main': 'Основная навигация',
  'nav.footer': 'Навигация внизу страницы',
  'nav.menu': 'Меню',
  'nav.home': 'Главная',
  'nav.services': 'Услуги',
  'language.label': 'Выбор языка',
  'action.services': 'Все услуги',
  'action.contact': 'Написать нам',
  'price.from': 'от {price}',
  'price.request': 'После консультации',
  'price.free': 'Без оплаты',
  'price.range': '–',
  'demo.label': 'Демо',
  'preview.testimonials': 'Вымышленные отзывы — только образец оформления',
} as const;
export type TranslationKey = keyof typeof ru;
export type Dictionary = Record<TranslationKey, string>;
