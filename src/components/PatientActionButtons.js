'use client';

import { CalendarCheck, ClipboardCheck, Laptop, Phone, Stethoscope } from 'lucide-react';
import BookingButton from '@/components/BookingButton';

const CALL_NUMBER = '9739490270';
const REFERRAL_EMAIL = 'info@clapsmd.org';

const buttonBaseClass =
  'inline-flex items-center justify-center rounded-md px-5 py-3 font-medium transition-colors';

const styles = {
  primary: `${buttonBaseClass} bg-primary text-white hover:bg-primary-dark`,
  secondary: `${buttonBaseClass} bg-secondary text-white hover:bg-secondary-light`,
  outline: `${buttonBaseClass} border border-secondary/15 bg-white text-secondary hover:border-secondary/30 hover:bg-slate-50`,
};

const actions = {
  request_appointment: {
    label: 'Request Appointment',
    icon: CalendarCheck,
    kind: 'booking',
    style: 'primary',
  },
  schedule_pft: {
    label: 'Schedule PFT Testing',
    icon: Stethoscope,
    kind: 'booking',
    style: 'secondary',
  },
  call: {
    label: 'Call',
    icon: Phone,
    kind: 'link',
    href: `tel:${CALL_NUMBER}`,
    style: 'outline',
  },
  book_online: {
    label: 'Book Online',
    icon: CalendarCheck,
    kind: 'booking',
    style: 'outline',
  },
  referral: {
    label: 'Referral',
    icon: ClipboardCheck,
    kind: 'link',
    href: `mailto:${REFERRAL_EMAIL}?subject=Referral%20Request`,
    style: 'outline',
  },
  telehealth: {
    label: 'Book Telehealth Visit',
    icon: Laptop,
    kind: 'booking',
    style: 'outline',
  },
};

export default function PatientActionButtons({
  items = [
    'request_appointment',
    'schedule_pft',
    'call',
    'book_online',
    'referral',
    'telehealth',
  ],
  className = '',
  compact = false,
}) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`.trim()}>
      {items.map((key) => {
        const action = actions[key];
        if (!action) return null;

        const Icon = action.icon;
        const buttonClass = `${styles[action.style]} ${action?.label == "Schedule PFT Testing" ? 'border border-white' : ''} ${compact ? 'px-4 py-2.5 text-sm' : ''}`.trim();

        if (action.kind === 'booking') {
          return (
            <BookingButton key={key} className={buttonClass}>
              <Icon className="mr-2 h-4 w-4" />
              {action.label}
            </BookingButton>
          );
        }

        return (
          <a
            key={key}
            href={action.href}
            className={buttonClass}
          >
            <Icon className="mr-2 h-4 w-4" />
            {action.label}
          </a>
        );
      })}
    </div>
  );
}
