import {cn} from "../lib/cn.ts";
import {useAutoAnimate} from "@formkit/auto-animate/react";

function CurrentStepComponent({className, currentStep, numberOfSteps, didTapOnStep }: { currentStep: number; numberOfSteps: number; didTapOnStep: (step: number) => void; className?: string }) {
    const [parent] = useAutoAnimate();

    return (
        <div ref={parent} className={cn('hl:flex hl:flex-row hl:gap-1', className)}>
            {Array.from({length: numberOfSteps}, (_, i) => (
                <div key={i} className={cn('hl:shadow-3xl', i == 0 ? 'hl:rounded-l-full' : '', (i == numberOfSteps - 1) ? 'hl:rounded-r-full' : '', `${i <= currentStep ? 'hl:bg-lime-450' : 'hl:bg-neutral-300'} hl:w-full hl:h-1.5`)} onClick={() => didTapOnStep(i)}></div>
            ))}
        </div>
    );
}

export default CurrentStepComponent;