import type { TestimonialItem } from '@/components/blocks/Testimonials.astro';
import type { Locale } from '@/config/site';
// Clearly fictional author labels. Only the development preview imports these records.
export const testimonials: Record<Locale, readonly TestimonialItem[]> = {
  ru: [
    {
      id: 'sample-1',
      quote: 'В этом вымышленном примере план помог обсудить привычки семьи.',
      author: 'Вымышленный автор 1',
    },
    {
      id: 'sample-2',
      quote: 'Учебный отзыв показывает, как выглядит короткая цитата.',
      author: 'Вымышленный автор 2',
    },
    {
      id: 'sample-3',
      quote: 'Это образец текста, а не отзыв реального клиента.',
      author: 'Вымышленный автор 3',
    },
  ],
  kk: [
    {
      id: 'sample-1',
      quote:
        'Бұл ойдан шығарылған үлгіде жоспар отбасы әдеттерін талқылауға көмектесті.',
      author: 'Ойдан шығарылған автор 1',
    },
    {
      id: 'sample-2',
      quote: 'Оқу пікірі қысқа дәйексөздің көрінісін көрсетеді.',
      author: 'Ойдан шығарылған автор 2',
    },
    {
      id: 'sample-3',
      quote: 'Бұл нақты клиенттің пікірі емес, мәтін үлгісі.',
      author: 'Ойдан шығарылған автор 3',
    },
  ],
};
