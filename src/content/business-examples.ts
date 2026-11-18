import type { ServiceItem } from '@/components/blocks/Services.astro';
import type {
  NavigationItem,
  NavigationGroup,
} from '@/components/ui/navigation';
import { structureMedia, studioMedia } from './component-showcase';

export const exampleNavigation: readonly NavigationItem[] = [
  { label: 'Главная', href: '#start', current: true },
  {
    label: 'О подходе',
    href: '#about',
    children: [{ label: 'Связаться', href: '#contact' }],
  },
];
export const exampleFooter: readonly NavigationGroup[] = [
  { label: 'Навигация по примеру', items: exampleNavigation },
];
export const clinicServices: readonly ServiceItem[] = [
  {
    id: 'consultation',
    title: 'Консультация',
    description:
      'Пример карточки направления. Медицинская услуга не предлагается.',
    media: studioMedia,
  },
  {
    id: 'plan',
    title: 'План наблюдения',
    description: 'Пример короткого пояснения без изображения.',
  },
  {
    id: 'questions',
    title: 'Вопросы перед визитом',
    link: { label: 'Посмотреть раздел вопросов', href: '#faq' },
  },
];
export const professionalServices: readonly ServiceItem[] = [
  {
    id: 'strategy',
    title: 'Стратегия',
    description:
      'От контекста и ограничений к обоснованному направлению работы.',
    media: structureMedia,
    metadata: 'Исследование и обсуждение',
  },
  {
    id: 'systems',
    title: 'Системы',
    description: 'Понятные процессы для команды.',
  },
  {
    id: 'guidance',
    title: 'Сопровождение',
    description: 'Регулярное обсуждение решений.',
    link: { label: 'Перейти к контакту', href: '#contact' },
  },
];
