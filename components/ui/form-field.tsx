"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type SharedProps = {
  label?: string;
  error?: string;
  containerClassName?: string;
};

type InputAsProps = SharedProps &
  Omit<React.ComponentProps<"input">, "className"> & {
    as?: "input";
    className?: string;
  };

type TextareaAsProps = SharedProps &
  Omit<React.ComponentProps<"textarea">, "className"> & {
    as: "textarea";
    className?: string;
  };

export type FormFieldProps = InputAsProps | TextareaAsProps;

const FormField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(function FormField(
  { label, error, containerClassName, className, as = "input", id, ...props },
  ref,
) {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const describedBy = error ? `${fieldId}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      {label ? (
        <Label htmlFor={fieldId} className="text-sm font-medium text-primary">
          {label}
        </Label>
      ) : null}

      {as === "textarea" ? (
        <Textarea
          id={fieldId}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn("min-h-28 rounded-md px-3 py-2.5", className)}
          {...(props as React.ComponentProps<"textarea">)}
        />
      ) : (
        <Input
          id={fieldId}
          ref={ref as React.Ref<HTMLInputElement>}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn("h-11 rounded-md px-3", className)}
          {...(props as React.ComponentProps<"input">)}
        />
      )}

      {error ? (
        <p id={describedBy} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export { FormField };
