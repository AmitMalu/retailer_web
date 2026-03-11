import "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        isMultipart?: boolean;
    }
}