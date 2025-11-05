// hooks/useThrottledSubmit.ts
import { useMemo } from "react";
import throttle from "lodash.throttle";

export function useThrottledFormSubmit<T>(
  submitFn: (values: T, formikHelpers?: any) => void,
  delay: number = 1000
) {
  return useMemo(() => {
    return throttle(
      (values: T, formikHelpers?: any) => submitFn(values, formikHelpers),
      delay,
      { trailing: false }
    );
  }, [submitFn, delay]);
}
