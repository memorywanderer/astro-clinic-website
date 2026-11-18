// Deterministic development fixtures. Shared components never import this file.
import structure from '@/assets/structure.svg';
import studio from '@/assets/studio.svg';
import type { FeatureItem } from '@/components/blocks/Features.astro';
import type { MediaSource } from '@/components/ui/Media.astro';

export const structureMedia: MediaSource = {
  src: structure,
  alt: 'Схема здания и модульной конструкции',
  width: 1200,
  height: 600,
};
export const studioMedia: MediaSource = {
  src: studio,
  alt: 'Композиция из круга и вытянутой арки',
  width: 1200,
  height: 600,
};
export const engineeringFeatures: readonly FeatureItem[] = [
  {
    title: 'Сначала исследование',
    description:
      'Проверяем условия площадки и согласовываем понятный план работ.',
    media: structureMedia,
  },
  {
    title: 'Открытый процесс',
    description:
      'Длинное описание для проверки переноса текста: команда видит решения, сроки и взаимосвязи на каждом этапе проекта.',
    media: structureMedia,
  },
  { title: 'Точная передача' },
];
export const studioFeatures: readonly FeatureItem[] = [
  {
    title: 'Форма рождается в диалоге',
    description:
      'Изучаем материалы и ищем ритм, который подходит пространству.',
    media: studioMedia,
  },
  {
    title: 'Каждая деталь имеет значение',
    description:
      'Ә Ғ Қ Ң Ө Ұ Ү Һ І · ә ғ қ ң ө ұ ү һ і. Ұзақ мәтін де ыңғайлы оқылуы керек.',
    media: studioMedia,
  },
];
