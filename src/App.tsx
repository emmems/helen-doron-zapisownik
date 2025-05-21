import { useAutoAnimate } from "@formkit/auto-animate/react";
import posthog from 'posthog-js';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import LoadingIndicator from "./LoadingIndicator.tsx";
import Button from "./components/Button.tsx";
import CurrentStepComponent from "./components/CurrentStepComponent.tsx";
import StepComponent, { StepComponentRef } from "./components/StepComponent.tsx";
import { sendAnalyticEvent } from "./lib/analytics.ts";
import { API_KEY } from "./methods/api.key.ts";
import { FormValues } from "./models/models.ts";
import { useConfig } from "./useConfig.tsx";

function App() {

    const [errMsg, setErrMsg] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const [parent] = useAutoAnimate();
    const [parent2] = useAutoAnimate();
    const {data: formData, isLoading: isFetchingConfig} = useConfig();

    const [formValues, setFormValues] = useState<{ [key: string]: FormValues | undefined }>({});

    const stepComponentRef = useRef<StepComponentRef | null>(null);

    async function sendForm() {
        setIsLoading(true);
        setErrMsg('');
        try {

          posthog.capture('form_submit', formValues);

            // const result = await fetch('http://localhost:4321/api/form/post', {
            const result = await fetch('https://helen-doron-form-backend.emems.workers.dev/api/form/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': API_KEY,
                },
                body: JSON.stringify(formValues),
            });

            if (result.status !== 200) {
                throw new Error(await result.text());
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

            return undefined;

        } catch (e) {
            console.warn(e);
            setErrMsg('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie później.');
        } finally {
            setIsLoading(false);
        }
    }

    function nextStep() {
        const errMsg = validateStep(currentStep);
        if (errMsg != undefined) {
            setErrMsg(errMsg);
            return;
        }
        setErrMsg('');

        if (currentStep >= 3) {
            sendAnalyticEvent({
              event: 'form_submit_clicked',
              step: '5',
            });
            sendForm().then(() => {
              sendAnalyticEvent({
                event: 'form_submit',
                step: '5',
              });
              setTimeout(() => {
                setTimeout(() => {
                  setIsSent(true);
                }, 1000);
                window.location.href = 'https://pokazowa.helendoron.pl/dziekujemy';
              }, 500);
            });
        } else {
          sendAnalyticEvent({
            // @ts-expect-error it is enum but it is not
            event: `step_${currentStep + 2}`,
            step: `${currentStep + 2}`
          });
          setCurrentStep(currentStep + 1);
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }

    function onChangeValue(step: number, vals?: FormValues) {
        setFormValues({
            ...formValues,
            [step]: vals,
        });
    }

    function validateStep(step: number) {
        switch (step) {
            case 0:
                if (formValues[step] == undefined || Object.keys(formValues[step]).length == 0) {
                    return 'Musisz zaznaczyć przynajmniej jedną opcję.';
                } else {
                    return undefined;
                }
            case 1:
                if (formValues[step] == undefined || Object.keys(formValues[step]).length == 0) {
                    return 'Musisz zaznaczyć opcję.';
                } else {
                    return undefined;
                }
            case 2:
                if (formValues[step] == undefined || Object.keys(formValues[step]).length == 0) {
                    return 'Musisz zaznaczyć opcję.';
                } else {
                    return undefined;
                }
            case 3:
                if (stepComponentRef.current?.checkForErrors() === false) {
                    return 'Uzupełnij poprawnie wszystkie pola.';
                } else {
                    return undefined;
                }
            default:
                return undefined;
        }
        return undefined;
    }

    useEffect(() => {
        console.log(formValues);
    }, [formValues]);

    return (
        <div className={'hl:font-display hl:relative hl:max-w-[600px] hl:min-h-[300px] hl:bg-white hl:rounded-xl hl:shadow-xl hl:flex hl:flex-col'}>

            {isSent ? (
                <div className="hl:flex hl:flex-col hl:gap-3 hl:items-center hl:p-5">
                    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="48" height="48" rx="24" stroke="#E22A86" stroke-width="3"
                              stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 27L22.6667 34L36 20" stroke="#E22A86" stroke-width="3" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>

                    <div>Dziękujemy za wypełnienie formularza!</div>
                    <div>Skontaktujemy się z Tobą tak szybko jak to możliwe!</div>

                    <img src="/icons/thank-you-image.png" alt={"Podziękowanie za wypełnienie formularza."}/>
                </div>

            ) : (<>
                {isFetchingConfig ? <LoadingIndicator/> : (
                    <div ref={parent} className="hl:flex hl:flex-col hl:grow hl:py-4">
                        <CurrentStepComponent className={"hl:px-5 hl:mb-5"} currentStep={currentStep}
                                              numberOfSteps={formData?.length ?? 1} didTapOnStep={setCurrentStep}/>
                        {formData && (
                            <StepComponent
                                ref={stepComponentRef}
                                step={formData[currentStep]}
                                formValues={formValues[`${currentStep}`]}
                                className={'hl:px-3'}
                                onChangeValue={(formValues) => {
                                    onChangeValue(currentStep, formValues)
                                }}
                            />
                        )}

                        <div className={"hl:grow"}></div>
                        <div className={'hl:px-5 hl:text-red-500 hl:text-right hl:text-sm'}>{errMsg}</div>
                        <div ref={parent2} className={'hl:flex hl:flex-row hl:mt-5 hl:px-5'}>
                            {currentStep > 0 && (
                                <Button onClick={prevStep} variant={'secondary'}
                                        className={'hl:text-center hl:min-w-26'}>Wstecz</Button>
                            )}
                            <div className={'hl:grow'}></div>
                            <Button onClick={nextStep} variant={'default'}
                    className={'hl:text-center hl:min-w-26'}>{currentStep === 3 ? 'Wyślij' : 'Dalej'}</Button>
                        </div>
                    </div>
                )}
            </>)}

            {isLoading && (
                <div className="hl:bg-black/30 hl:absolute hl:inset-0 hl:rounded-xl hl:flex hl:justify-center hl:items-center">
                    <LoadingIndicator />
                </div>
            )}
        </div>
    )
}

export default App
