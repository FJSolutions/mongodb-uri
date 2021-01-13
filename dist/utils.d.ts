import * as Types from "./types";
export declare const isNullOrEmpty: (value: any | string | null | undefined) => boolean;
export declare const isNullOrUndefined: (value: any | null | undefined) => boolean;
export declare const isNullZeroOrNegative: (value: number | null | undefined) => boolean;
export declare const parsePrimitive: (value: string) => Types.Primitive;
export declare const hasUserNameOrPassword: (config: Types.UriConfigContract) => boolean;
export declare const parseBoolean: (value: string) => boolean | undefined;
