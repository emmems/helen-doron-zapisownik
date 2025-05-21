import { useAutoAnimate } from "@formkit/auto-animate/react";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Select from "react-select";
import zod from 'zod';
import { cn } from "../lib/cn.ts";
import { API_KEY } from "../methods/api.key.ts";
import { FormValues, Input } from "../models/models.ts";

export type StepInputComponentRef = {
    checkForErrors: () => boolean;
};

const StepInputComponent = forwardRef<StepInputComponentRef, {
    item: Input;
    className?: string;
    onValidChange?: (isValid: boolean) => void;
    onChange?: (value: string) => void
    formValues?: FormValues;
}>(({className, formValues, item, onChange, onValidChange}, ref) => {

    const [parent] = useAutoAnimate();
    const [value, setValue] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [wasFocused, setWasFocused] = useState(false);


    function checkForErrors() {
        setWasFocused(true);
        return validateInput(value, true);
    }

    useImperativeHandle(ref, () => {
        return {
            checkForErrors,
        }
    })

    const classNames = cn(
        'hl:w-full hl:text-neutral-900 hl:bg-neutral-100 hl:rounded-lg hl:text-sm hl:font-medium hl:focus:outline-none hl:focus:ring-1 hl:focus:ring-cerise-500 hl:focus:border-transparent hl:border-transparent',
        className,
        errMsg.length > 0 && 'hl:outline hl:outline-red-500',
    );
    const classNamesWithPadding = cn('hl:py-2 hl:px-2', classNames);

    function validateInput(val: string, wasFocused: boolean) {

        const setErrMsgIfNeeded = (val: string) => {
            if (wasFocused) {
                setErrMsg(val);
            } else {
                setErrMsg('');
            }
        }

        if (item.type === 'email') {
            if (!zod.email().safeParse(val).success) {
                onValidChange?.(false);
                setErrMsgIfNeeded('Wprowadź poprawny adres e-mail.');
                return false;
            }
            onValidChange?.(true);
            setErrMsg('');
            return true;
        }

        if (item.isRequired === true) {
            if (val.length == 0) {
                switch (item.type) {
                    case 'checkbox':
                        setErrMsgIfNeeded('Proszę o zaznaczenie zgody.');
                        break;
                    case 'select':
                        setErrMsgIfNeeded('Wybierz wartość.');
                        break;
                    case 'phone':
                      setErrMsgIfNeeded('Wprowadź numer telefonu.');
                      break;
                }
                onValidChange?.(false);
                return false;
            }
        }
        setErrMsg('');
        onValidChange?.(true);
        return true;
    }

    useEffect(() => {
        validateInput(value, wasFocused);
        onChange?.(value);
    }, [value]);

    let field: React.ReactNode;

    switch (item.type) {
        case 'email':
            field = (<>
                <input
                    onFocus={() => setWasFocused(true)}
                    id={item.id}
                    name={item.id}
                    className={classNamesWithPadding}
                    placeholder={item.placeholder}
                    value={value}
                    type="text"
                    autoComplete="email"
                    onChange={(e) => setValue(e.target.value)}
                />
            </>);
            break;
        case 'text':
            field = (<>
                <input
                    onFocus={() => setWasFocused(true)}
                    id={item.id}
                    name={item.id}
                    className={classNamesWithPadding}
                    placeholder={item.placeholder}
                    value={value}
                    type="text"
                    onChange={(e) => setValue(e.target.value)}
                />
            </>);
            break;
        case 'checkbox':
            field = (<>
                <div className={"hl:flex hl:items-center hl:gap-2 hl:justify-start"}>
                    <input
                        onFocus={() => setWasFocused(true)}
                        id={item.id}
                        name={item.id}
                        placeholder={item.placeholder}
                        checked={value === 'true'}
                        type="checkbox"
                        onClick={(e) => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            setValue(e.target.checked ? 'true' : '');
                        }}
                    />
                    <label htmlFor={item.id}
                           className={cn('hl:text-neutral-500 hl:font-medium hl:text-xs hl:cursor-pointer')}>
                  {item.name.includes('<') ? (<span dangerouslySetInnerHTML={{ __html: item.name }}></span>) : item.name} {item.isRequired &&
                        <span className={cn('hl:text-cerise-500 hl:font-medium hl:text-xs')}>*</span>}
                    </label>
                </div>
            </>);
            break;
        case 'select':
            if (item.getValuesEndpoint != null) {
                field = <AsyncSelectInput onFocus={() => setWasFocused(true)}
                                          formValues={formValues}
                                          item={item}
                                          onSelectValue={(val) => {
                                              setValue(val)
                                          }}
                                          classNames={classNames}
                />;
            } else {
                field = <SelectInput onFocus={() => setWasFocused(true)}
                                     item={item}
                                     classNames={classNames}
                                     onSelectValue={(val) => {
                                         setValue(val)
                                     }}/>;
            }
            break;
        case 'phone':
            field = (<>
                <input
                    id={item.id}
                    onFocus={() => setWasFocused(true)}
                    name={item.id}
                    className={classNamesWithPadding}
                    placeholder={item.placeholder}
                    value={value}
                    type="text"
                    autoComplete="tel"
                    onChange={(e) => setValue(e.target.value)}
                />

            </>);
            break;
        default:
            break;
    }

    return (<div ref={parent}>
        {field}
        {errMsg.length > 0 && (
            <p className={cn('hl:text-red-500 hl:text-xs hl:mt-1', errMsg.length > 0 && 'hl:text-red-500')}>{errMsg}</p>
        )}
    </div>);
});

export default StepInputComponent;


function SelectInput({item, classNames, onSelectValue, onFocus}: {
    item: Input;
    classNames: string,
    onSelectValue?: (value: string) => void
    onFocus?: () => void;
}) {

    function onSelectVal(val?: string) {
        if (onSelectValue && val) {
            onSelectValue(val);
        }
    }

    const options = (item.values?.map(el => ({ value: el.id, label: el.name })) ?? []).sort((a, b) => a.label.toLowerCase().localeCompare(b.label));

    return (<>
        <Select
            onFocus={onFocus}
            className={cn(classNames, 'hl:focus:outline-none hl:focus:ring-1 hl:focus:ring-cerise-500 hl:focus:border-transparent hl:border-transparent')}
            placeholder={item.placeholder}
            onChange={(val) => onSelectVal(val?.value)}
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: '#E22A86',
                    primary25: 'hotpink',
                }
            })}
            styles={{
                control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: 'transparent',
                    border: state.isFocused ? '1px solid red' : 'none',
                    margin: '0',
                    borderColor: 'red',
                }),
                indicatorSeparator: (baseStyles) => ({
                    ...baseStyles,
                    display: 'none',
                }),
                menu: (baseStyles) => ({
                    ...baseStyles,
                    border: 'none',
                    margin: '0',
                    borderColor: 'red',
                }),
                valueContainer: (baseStyles) => ({
                    ...baseStyles,
                    border: 'none',
                    // margin: '0',
                    // padding: '0',
                    borderColor: 'red',
                }),
            }}
            options={options}
        />
    </>);
}

function AsyncSelectInput({formValues, item, classNames, onSelectValue, onFocus}: {
    formValues?: FormValues;
    item: Input;
    classNames: string;
    onSelectValue?: (value: string) => void
    onFocus?: () => void;
}) {
    console.log('AsyncSelectInput render', formValues);

    const [input, setInput] = useState('');
    const [options, setOptions] = useState<{ name: string; label: string; }[]>([]);

    function onSelectVal(val?: string) {
        if (onSelectValue && val) {
            onSelectValue(val);
        }
    }

    async function loadOptions(inputValue: string) {

        const searchParams = new URLSearchParams();
        if (formValues != null) {
            Object.keys(formValues).forEach(key => {
                if (formValues[key] != null) {
                    searchParams.append(key, formValues[key].toString());
                }
            })
        }
        searchParams.append('input', inputValue);

        const result = await fetch((item.getValuesEndpoint ?? '') + '?' + searchParams.toString(), {
            headers: {
                'Authorization': API_KEY,
            }
        });

        try {
            console.log('OPTIOOOOONS')
            const payload = await result.json();
            console.log(payload);

            const obj = zod.object({
                departments: zod.array(zod.object({
                    id: zod.string(),
                    name: zod.string(),
                    state: zod.string().optional(),
                })),
                shouldUpdate: zod.boolean().optional(),
            }).parse(payload);

            if (obj.shouldUpdate === true) {
                fetch('', {
                    headers: {
                        'Authorization': API_KEY,
                    }
                }).then(() => {
                    console.log('departments updated');
                }).catch((err) => {
                    console.warn('departments update failed', err);
                });
            }

            return obj.departments.map(el => {
                return {
                    name: el.id,
                    label: el.name
                }
            })
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    useEffect(() => {
        loadOptions(input).then(values => {
          values = values.sort((a, b) => a.label.toLowerCase().localeCompare(b.label));
          setOptions(values);
        }).catch(err => {
            console.warn('error during loading options', err);
        });
    }, [input, formValues]);

    return (<>
        <Select
            onFocus={onFocus}
            className={cn(classNames, 'hl:focus:outline-none hl:focus:ring-1 hl:focus:ring-cerise-500 hl:focus:border-transparent hl:border-transparent')}
            placeholder={item.placeholder}
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: '#E22A86',
                    primary25: '#e03d8e',
                }
            })}
            onChange={(val) => onSelectVal(val?.name)}
            onInputChange={(newInput) => {
                setInput(newInput);
            }}
            options={options}
            styles={{
                control: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: 'transparent',
                    margin: '0',
                    borderColor: 'transparent',
                    // borderColor: 'red',
                }),
                indicatorSeparator: (baseStyles) => ({
                    ...baseStyles,
                    display: 'none',
                }),
                // menu: (baseStyles) => ({
                //     ...baseStyles,
                //     border: 'none',
                //     margin: '0',
                //     // borderColor: 'red',
                // }),
                // valueContainer: (baseStyles) => ({
                //     ...baseStyles,
                //     border: 'none',
                //     // margin: '0',
                //     // padding: '0',
                //     // borderColor: 'red',
                // }),
            }}
        />
    </>);
}
