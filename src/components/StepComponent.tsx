import { useAutoAnimate } from "@formkit/auto-animate/react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "../lib/cn.ts";
import { ButtonItem, FormValues, Layout, Step } from "../models/models.ts";
import StepInputComponent, { StepInputComponentRef } from "./StepInputComponent.tsx";

export type StepComponentRef = {
    checkForErrors: () => boolean;
};

const StepComponent = forwardRef<StepComponentRef, {
    step: Step;
    className?: string;
    formValues?: FormValues;
    onChangeValue: (values: FormValues) => void;
}>(({step, className, onChangeValue, formValues}, ref) => {
    const [parent] = useAutoAnimate();

    console.log('StepComponent', formValues);
    const elementsRefs = useRef<(StepInputComponentRef | null)[]>([]);

    useEffect(() => {
        elementsRefs.current = elementsRefs.current.slice(0, step.elements.length);
    }, [step]);

    function onButtonClick(id: string) {
        let newValue: string[];
        const selectedButtons = Object.keys(formValues ?? {}) ?? [];
        if (step.multiple === true) {
            newValue = selectedButtons.includes(id) ? selectedButtons.filter(el => el !== id) : [...selectedButtons, id];
        } else {
            newValue = [id];
        }
        const newValues = newValue.reduce((prev, curr) => {
            prev[curr] = 'true';
            return prev;
        }, {} as FormValues)
        onChangeValue({
            ...newValues,
        });
    }

    function isSelected(id: string) {
        return formValues?.[id] === 'true';
    }

    function checkForErrors() {
        let isValid = true;
        elementsRefs.current.forEach(el => {
            if (el?.checkForErrors() === false) {
                isValid = false;
            }
        });
        return isValid;
    }

    function changeInputValue(id: string, value: string | number | undefined) {
        console.log('tu powinno wejść');
        onChangeValue({
            ...formValues,
            [id]: value,
        });
    }

    useImperativeHandle(ref, () => {
        return {
            checkForErrors,
        }
    })

    function getLayoutClass(layout?: Layout) {
        switch (layout ?? 'half') {
            case 'full':
                return 'hl:w-full';
            case 'half':
            console.log('layout 1', layout);
                return 'hl:w-[50%]';
            case 'one-third':
                return 'hl:w-1/3';
            default:
                return 'hl:flex-1/2';
        }
    }

    return (
        <div className={cn('flex flex-col gap-3 items-center', className)}>
            <p className={cn("hl:text-headings-200 hl:text-xs hl:text-center", step.subtitle == null && 'hl:text-transparent')}>{step.subtitle ?? 'no-info'}</p>
            {step.title && (
                <div className="hl:text-headings-100 hl:font-medium hl:text-lg hl:text-center">{step.title}</div>
            )}
            <div ref={parent} className={'hl:flex hl:flex-wrap hl:mt-3'}>
                {step.elements.map((element, index) => (
                    <div key={element.id} className={cn('hl:px-2 hl:py-2', getLayoutClass(element.layout))}>
                        {element.type === 'button' ?
                            (
                                <ButtonComponent
                                    item={element}
                                    isSelected={isSelected(element.id)}
                                    onClick={() => {
                                        onButtonClick(element.id)
                                    }}
                                    layout={element.layout}
                                />
                            ) : (
                                <StepInputComponent
                                    ref={el => {
                                        elementsRefs.current[index] = el
                                    }}
                                    formValues={formValues}
                                    item={element}
                                    onChange={(val) => {
                                        changeInputValue(element.id, val)
                                    }}
                                />
                            )}
                    </div>
                ))}
            </div>
        </div>
    );
});

function ButtonComponent({item, isSelected, onClick, layout}: {
    item: ButtonItem;
    layout?: Layout;
    isSelected?: boolean;
    onClick?: () => void;
}) {
    const additionalClass = layout === 'half' ? 'hl:md:h-32 hl:h-36' : '';

    return (
        <button
          onClick={onClick}
          type="button"
          className={cn('hl:group hl:cursor-pointer hl:border-2 hl:group hl:border-cerise-500 hl:hover:bg-cerise-500 hl:text-white hl:accent-white hl:transition hl:rounded-xl hl:flex hl:flex-col hl:gap-3 hl:items-center hl:py-3 hl:px-3 hl:w-full', isSelected && 'hl:bg-cerise-500 hl:hover:bg-cerise-600 hl:text-white hl:accent-white', additionalClass)}
        >
          {layout == 'half' && (<div className="grow"></div>)}
            {!isSelected ? (
                <>
                    {item.icon && (
                        <>
                            <img src={item.icon} alt={item.name} className={'hl:w-10 hl:h-10 hl:group-hover:hidden'}/>
                            {item.iconSelected && (
                                <img src={item.iconSelected} alt={item.name}
                                     className={'hl:w-10 hl:h-10 hl:group-hover:inline hl:hidden'}/>
                            )}
                        </>

                    )}
                </>
            ) : (
                <>{item.iconSelected && (
                    <img src={item.iconSelected} alt={item.name} className={'hl:w-10 hl:h-10'}/>
                )}</>
            )}

            <div className={cn('hl:text-headings-100 hl:group-hover:text-white hl:transition hl:text-sm hl:font-medium', isSelected && 'hl:text-white')}>{item.name}</div>
            {layout == 'half' && (<div className="grow"></div>)}
        </button>);
}

export default StepComponent;
