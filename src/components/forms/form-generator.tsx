import { ErrorMessage } from "@hookform/error-message";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type Props = {
  type: "text" | "email" | "password";
  inputType: "select" | "input" | "text-area";
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  register: UseFormRegister<any>;
  name: string;
  errors: FieldErrors<FieldValues>;
  lines?: number;
  form?: string;
  defaultValue?: string;
};

const FormGenerator = ({
  type,
  inputType,
  options,
  label,
  placeholder,
  register,
  name,
  errors,
  lines,
  form,
  defaultValue,
}: Props) => {
  switch (inputType) {
    case "input":
      return (
        <Label className="flex flex-col gap-2" htmlFor={`input-${name}`}>
          {label}
          <Input
            id={`input-${name}`}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            form={form}
            {...register(name)}
          />

          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );
    case "select":
      return (
        <Label className="flex flex-col gap-2" htmlFor={`select-${name}`}>
          {label}
          <select id={`select-${name}`} form={form} {...register(name)}>
            {options?.length &&
              options.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>

          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );
    case "text-area":
      return (
        <Label className="flex flex-col gap-2" htmlFor={`textarea-${name}`}>
          {label}
          <Textarea
            id={`textarea-${name}`}
            placeholder={placeholder}
            defaultValue={defaultValue}
            form={form}
            {...register(name)}
          />

          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );
  }
};

export default FormGenerator;
