import { t } from 'i18next';

const FullLogo = () => {
  return (
    <div className="flex items-center gap-3 h-[60px]">
      <img
        src="/logo.svg"
        alt={t('logo')}
        className="h-16 w-16 shrink-0"
        draggable={false}
      />

      <span
        className="text-[42px] leading-none select-none"
        style={{
          fontFamily: 'Roghin',
        }}
      >
        FlowForge
      </span>
    </div>
  );
};

FullLogo.displayName = 'FullLogo';

export { FullLogo };