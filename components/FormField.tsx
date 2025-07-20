import { Controller, Control, FieldValues, Path } from "react-hook-form";

import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  inputClassName?: string;
  labelClassName?: string;
}

const CustomFormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  inputClassName = "",
  labelClassName = "",
  icon: Icon,
}: FormFieldProps<T> & { icon?: React.ComponentType<any> }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={`label ${labelClassName}`} htmlFor={field.name}>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center bg-dark-300 border border-primary-200 rounded-xl h-14 w-full">
              {Icon && <Icon className="ml-4 text-primary-100 w-6 h-6 pointer-events-none" />}
            <Input
                id={field.name}
                className={`input bg-transparent border-none shadow-none focus:ring-0 focus:border-none text-light-100 placeholder:text-primary-100 h-14 text-base flex-1 ${inputClassName}`}
              type={type}
              placeholder={placeholder}
              {...field}
            />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
