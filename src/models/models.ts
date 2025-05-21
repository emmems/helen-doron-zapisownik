import * as zod from 'zod';

const layout = zod.enum(['full', 'half', 'one-third']);
export type Layout = zod.infer<typeof layout>;

export type FormValues = { [itemID: string]: number | string | undefined }


export const buttonItem = zod.object({
  id: zod.string(),
  type: zod.enum(['button']),
  name: zod.string().min(2).max(100),
  icon: zod.string().optional(),
  iconSelected: zod.string().optional(),
  layout: layout.optional(),
})

export const buttonItems = zod.array(buttonItem);

export type ButtonItem = zod.infer<typeof buttonItem>;
export type ButtonItems = zod.infer<typeof buttonItems>;

export const input = zod.object({
  id: zod.string(),
  name: zod.string(),
  description: zod.string().optional(),
  placeholder: zod.string().optional(),
  type: zod.enum(['email', 'text', 'checkbox', 'select', 'phone']),
  isRequired: zod.boolean().optional(),
  layout: layout.optional(),

  getValuesEndpoint: zod.string().optional(),
  values: zod.array(zod.object({
    id: zod.string(),
    name: zod.string().min(2).max(100),
  })).optional(),
});

export type Input = zod.infer<typeof input>;

export const singleStep = zod.object({
  title: zod.string().optional(),
  subtitle: zod.string().optional(),
  multiple: zod.boolean().optional(),
  elements: zod.array(zod.union([
    buttonItem,
    input,
  ])),
});

export const steps = zod.array(singleStep);

export type Steps = zod.infer<typeof steps>;
export type Step = zod.infer<typeof singleStep>;
