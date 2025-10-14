// resources/js/components/app-logo-icon.tsx
type IconProps = {
    className?: string;
    width?: number | string;
    height?: number | string;
    ariaLabel?: string;
};

export default function AppLogoIconWhite({
                                        className,
                                        width,
                                        height,
                                        ariaLabel = 'Logo',
                                    }: IconProps) {
    return (
        <img
            src="/img/app-logo-icon-white.png"
            className={className}
            width={width ?? 160}
            height={height}
            alt={ariaLabel}
            loading="lazy"
            decoding="async"
            onError={(e) => {
                console.error('Nie mogę wczytać /img/app-logo-icon.svg', e);
            }}
            style={{ display: 'inline-block' }}
        />
    );
}
