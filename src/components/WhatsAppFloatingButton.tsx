import React from 'react';
import { buildWhatsAppUrl } from '../config/whatsapp';

interface WhatsAppIconProps {
  className?: string;
}

export const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({
  className = 'w-6 h-6',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.758.459 3.474 1.331 4.988L2 22l5.169-1.356a9.927 9.927 0 0 0 4.862 1.263h.004c5.515 0 9.969-4.453 9.969-9.969 0-2.664-1.037-5.169-2.92-7.052A9.908 9.908 0 0 0 12.031 2Zm5.822 14.274c-.246.693-1.434 1.326-1.991 1.41-.511.077-1.158.11-1.87-.116-.432-.137-.986-.321-1.696-.628-2.984-1.288-4.933-4.294-5.082-4.493-.149-.198-1.213-1.614-1.213-3.079 0-1.465.768-2.185 1.04-2.482.273-.297.595-.372.793-.372.198 0 .396.002.57.01.183.009.428-.069.669.512.248.595.842 2.057.916 2.206.075.149.124.322.025.52-.099.198-.149.322-.297.495-.149.174-.313.389-.446.521-.149.148-.304.309-.131.606.173.297.769 1.269 1.651 2.055 1.135 1.012 2.091 1.325 2.388 1.474.297.149.471.124.644-.074.174-.198.743-.867.941-1.164.198-.297.396-.248.669-.149.273.099 1.734.818 2.031.967.297.149.495.223.57.347.074.124.074.718-.172 1.411Z" />
  </svg>
);

interface WhatsAppFloatingButtonProps {
  hidden?: boolean;
}

/**
 * Floating WhatsApp Customer Support Button:
 * - Mobile: Compact official WhatsApp icon button in bottom-right corner
 * - Desktop: Reveals "WhatsApp — Chat with us" smoothly on hover
 * - Opens WhatsApp in a new tab with pre-filled product inquiry message
 */
export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  hidden = false,
}) => {
  if (hidden) return null;

  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp — Chat with us"
      className="group fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center md:justify-start h-12 w-12 md:w-auto md:h-12 md:px-3.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl shadow-[#25D366]/30 border border-white/20 transition-all duration-300 ease-out hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <WhatsAppIcon className="w-6 h-6 shrink-0" />
      <span className="hidden md:inline-block max-w-0 overflow-hidden whitespace-nowrap font-sans text-xs font-bold tracking-tight opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-2.5 transition-all duration-300 ease-out">
        WhatsApp — Chat with us
      </span>
    </a>
  );
};
