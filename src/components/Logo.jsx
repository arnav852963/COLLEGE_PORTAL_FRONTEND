import logo from "../assets/logo.png";

export const Logo = ({
    size = 34,
    showText = true,
    text = "ProfConnect",
    className = "",
}) => {
    return (
        <div className={`flex items-center gap-2 ${className}`.trim()}>
            <img
                src={logo}
                alt="ProfConnect"
                width={size}
                height={size}
                className="shrink-0 rounded-md object-contain"
                loading="eager"
                decoding="async"
            />

            {showText && (
                <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                    {text}
                </span>
            )}
        </div>
    );
};
