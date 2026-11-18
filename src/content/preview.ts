import { parseLocale, type Locale } from '@/config/site';
import type { TestimonialItem } from '@/components/blocks/Testimonials.astro';
import { services } from './data/business';
import { testimonials } from './data/testimonials';
import { requiredText, resolveFieldService, resolveService } from './normalize';

// Used exclusively by the development route. Both sources terminate at this boundary.
export function getServiceComparison(locale: Locale) {
  parseLocale(locale);
  const ru = services.find(
    (entry) => entry.id === 'planning' && entry.locale === 'ru',
  )!;
  const kk = services.find(
    (entry) => entry.id === 'planning' && entry.locale === 'kk',
  )!;
  return {
    field: resolveFieldService(
      {
        id: ru.id,
        title: { ru: ru.title, kk: kk.title },
        description: { ru: ru.description, kk: kk.description },
        destination: ru.destination,
        metadata: { ru: ru.metadata!, kk: kk.metadata! },
      },
      locale,
    ),
    entry: resolveService(locale === 'ru' ? ru : kk, locale),
  };
}

export function getPreviewTestimonials(
  locale: Locale,
): readonly TestimonialItem[] {
  const ids = new Set<string>();
  return testimonials[parseLocale(locale)].map((item) => {
    const id = requiredText(item.id, 'preview testimonial.id');
    if (ids.has(id))
      throw new Error(`Duplicate preview testimonial: ${id}/${locale}`);
    ids.add(id);
    return {
      id,
      quote: requiredText(item.quote, `${id}.quote/${locale}`),
      author: requiredText(item.author, `${id}.author/${locale}`),
    };
  });
}
