import {cn} from "../lib/cn.ts";


function Button({variant, className, children, onClick}: { variant?: 'default' | 'secondary'; className?: string; children: React.ReactNode; onClick?: () => void }) {

    function getVariantClass(variant?: 'default' | 'secondary') {
        switch (variant ?? 'default') {
            case 'default':
                return 'hl:bg-cerise-500 hl:hover:bg-cerise-600 hl:text-white hl:accent-white';
            case 'secondary':
                return 'hl:bg-white hl:hover:bg-neutral-100 hl:border-2 hl:border-cerise-500 hl:text-cerise-500 hl:accent-cerise-500';
            default:
                return '';
        }
    }

    return (
        <button type="button" className={cn('hl:transition hl:cursor-pointer hl:rounded-xl hl:py-2 hl:px-5 hl:font-medium', getVariantClass(variant), className)} onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;