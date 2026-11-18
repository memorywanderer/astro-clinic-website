import type { NavigationLink } from '@/components/ui/navigation';

export interface ContactInfo {
  phone?: { text: string; number: string };
  email?: string;
  address?: string;
  hours?: string;
  links?: readonly NavigationLink[];
  map?: NavigationLink;
  messengers?: { whatsapp?: string; telegram?: string };
  bookingUrl?: string;
  social?: readonly NavigationLink[];
}
