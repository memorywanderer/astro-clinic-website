// Development fixtures only. No reusable component imports this module.
import column from '@/assets/column.svg';
import materialStudy from '@/assets/material-study.png';
import { structureMedia, studioMedia } from './component-showcase';
import type { ServiceItem } from '@/components/blocks/Services.astro';
import type { TestimonialItem } from '@/components/blocks/Testimonials.astro';
import type { FAQItem, FAQGroup } from '@/components/blocks/FAQ.astro';
import type { GalleryItem } from '@/components/blocks/Gallery.astro';
import type {
  NavigationGroup,
  NavigationItem,
} from '@/components/ui/navigation';
import type { ContactInfo } from '@/components/ui/ContactDetails.astro';

export const navigation: readonly NavigationItem[] = [
  { label: 'Начало', href: '#business-showcase', current: true },
  {
    label: 'Подход',
    href: '#about-split',
    children: [
      { label: 'О команде', href: '#about-split' },
      { label: 'Контакты', href: '#contact-details' },
    ],
  },
  { label: 'Связаться', href: '#contact-details' },
];
export const footerGroups: readonly NavigationGroup[] = [
  {
    label: 'Разделы',
    items: [
      { label: 'Начало', href: '#business-showcase' },
      { label: 'О подходе', href: '#about-split' },
    ],
  },
  {
    label: 'Демонстрация',
    items: [{ label: 'Контактная секция', href: '#contact-details' }],
  },
];
export const demoContact: ContactInfo = {
  email: 'demo@example.com',
  hours: 'Демонстрационный режим. Запись и отправка сообщений недоступны.',
  links: [{ label: 'Об исходном коде Astro', href: 'https://astro.build/' }],
};
export const services: readonly ServiceItem[] = [
  {
    id: 'research',
    title: 'Исследование',
    description:
      'Уточняем контекст, собираем информацию и формулируем понятную задачу.',
    media: structureMedia,
    link: { label: 'Обсудить исследование', href: '#contact-details' },
    metadata: 'Первый этап',
  },
  {
    id: 'design',
    title: 'Разработка решения',
    description:
      'Длинный текст для проверки переноса: сравниваем варианты, обсуждаем ограничения и выбираем обоснованное направление работы.',
    media: studioMedia,
  },
  {
    id: 'support',
    title: 'Сопровождение',
    description: 'Поддерживаем команду на этапе внедрения.',
  },
];

// Verified public-domain quotations, never represented as business reviews or ratings.
// Source: Oscar Wilde, The Picture of Dorian Gray, Preface.
const source = {
  label: 'Оригинал: предисловие',
  href: 'https://www.gutenberg.org/files/174/174-h/174-h.htm',
};
export const quotations: readonly TestimonialItem[] = [
  {
    id: 'artist',
    quote: 'The artist is the creator of beautiful things.',
    author: 'Oscar Wilde',
    role: 'Литературная цитата · не отзыв клиента',
    source,
  },
  {
    id: 'symbol',
    quote: 'All art is at once surface and symbol.',
    author: 'Oscar Wilde',
    role: 'Литературная цитата · не отзыв клиента',
    source,
  },
  {
    id: 'art',
    quote: 'All art is quite useless.',
    author: 'Oscar Wilde',
    role: 'Литературная цитата · не отзыв клиента',
    source,
  },
];
export const quoteNotice =
  'Типографические образцы из предисловия Оскара Уайльда. Они демонстрируют компонент и не являются отзывами о вымышленном бизнесе.';
export const faqItems: readonly FAQItem[] = [
  {
    id: 'begin',
    question: 'С чего начать знакомство?',
    answer:
      'Начните с описания задачи. Демонстрационная страница показывает структуру содержимого и не принимает обращения.',
  },
  {
    id: 'materials',
    question: 'Какие материалы можно подготовить заранее?',
    answer:
      'Соберите вопросы, исходные материалы и ограничения. Расширенный ответ помогает проверить читаемость длинного текста и работу компонента без JavaScript. Ә Ғ Қ Ң Ө Ұ Ү Һ І.',
  },
];
export const faqGroups: readonly FAQGroup[] = [
  { id: 'general', title: 'Знакомство', items: [faqItems[0]] },
  { id: 'preparation', title: 'Подготовка', items: [faqItems[1]] },
];
export const galleryItems: readonly GalleryItem[] = [
  {
    id: 'structure',
    media: structureMedia,
    title: 'Модульная схема',
    caption: 'Схематическая иллюстрация, не реализованный проект.',
    link: { label: 'Перейти к описанию подхода', href: '#about-split' },
  },
  {
    id: 'column',
    media: {
      src: column,
      alt: 'Вертикальная схема арочного проёма',
      width: 600,
      height: 900,
    },
    caption: 'Вертикальное соотношение сторон.',
  },
  { id: 'studio', media: studioMedia },
  {
    id: 'raster',
    media: {
      src: materialStudy,
      alt: 'Растровая схема двух прямоугольных объёмов',
      width: 900,
      height: 600,
    },
    caption: 'Локальный PNG для проверки оптимизации Astro.',
  },
];
